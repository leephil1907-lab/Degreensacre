import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { isUuid, sanitizeForDb } from '@/lib/validation';

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized', success: false }, { status: 401 });

    const { data: messages, error } = await supabase
      .from('messages')
      .select('*, sender:sender_id(first_name, last_name, avatar_url), recipient:recipient_id(first_name, last_name, avatar_url)')
      .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
      .order('created_at', { ascending: false })
      .limit(1000);
    if (error) throw error;

    const conversations = new Map<string, { id: string; lastMessage: unknown; unreadCount: number; otherUser: unknown }>();
    for (const message of messages || []) {
      if (!conversations.has(message.conversation_id)) {
        const senderIsUser = message.sender_id === user.id;
        const profile = senderIsUser ? message.recipient : message.sender;
        conversations.set(message.conversation_id, {
          id: message.conversation_id,
          lastMessage: message,
          unreadCount: 0,
          otherUser: {
            id: senderIsUser ? message.recipient_id : message.sender_id,
            first_name: profile?.first_name || 'De-Greenacres',
            last_name: profile?.last_name || 'User',
            avatar_url: profile?.avatar_url || null,
          },
        });
      }
      if (message.recipient_id === user.id && !message.is_read) conversations.get(message.conversation_id)!.unreadCount += 1;
    }
    return NextResponse.json({ conversations: Array.from(conversations.values()), success: true });
  } catch (error) {
    console.error('GET /api/messages error:', error);
    return NextResponse.json({ error: 'Failed to fetch messages', success: false }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Please sign in to send messages', success: false }, { status: 401 });

    const body = await request.json();
    const recipientId = String(body.recipient_id || '');
    const content = String(body.content || '').trim();
    if (!isUuid(recipientId) || recipientId === user.id) return NextResponse.json({ error: 'A valid recipient other than yourself is required', success: false }, { status: 400 });
    if (!content || content.length > 5000) return NextResponse.json({ error: 'Message content must contain 1–5,000 characters', success: false }, { status: 400 });
    if (body.conversation_id && !isUuid(String(body.conversation_id))) return NextResponse.json({ error: 'Invalid conversation ID', success: false }, { status: 400 });
    if (body.property_id && !isUuid(String(body.property_id))) return NextResponse.json({ error: 'Invalid property ID', success: false }, { status: 400 });

    let conversationId = body.conversation_id as string | undefined;
    if (conversationId) {
      const { data: conversation, error } = await supabase.from('conversations').select('id, created_by').eq('id', conversationId).maybeSingle();
      if (error || !conversation) return NextResponse.json({ error: 'Conversation not found or access denied', success: false }, { status: 403 });
      const { data: history, error: historyError } = await supabase.from('messages').select('sender_id, recipient_id').eq('conversation_id', conversationId).limit(500);
      if (historyError) throw historyError;
      const participants = new Set<string>([user.id, conversation.created_by]);
      for (const item of history || []) { participants.add(item.sender_id); participants.add(item.recipient_id); }
      if ((history || []).length > 0 && !participants.has(recipientId)) return NextResponse.json({ error: 'The recipient is not part of this conversation', success: false }, { status: 403 });
    } else {
      const { data: conversation, error } = await supabase.from('conversations').insert({
        property_id: body.property_id || null,
        created_by: user.id,
      }).select('id').single();
      if (error) throw error;
      conversationId = conversation.id;
    }

    const { data: message, error } = await supabase.from('messages').insert({
      conversation_id: conversationId,
      sender_id: user.id,
      recipient_id: recipientId,
      content: sanitizeForDb(content),
    }).select('*, sender:sender_id(first_name, last_name, avatar_url)').single();
    if (error) throw error;

    const { error: notificationError } = await supabase.from('notifications').insert({
      user_id: recipientId,
      type: 'new_message',
      title: 'New Message',
      message: 'You have a new message',
      data: { conversation_id: conversationId, sender_id: user.id },
    });
    if (notificationError) console.warn('Message saved but recipient notification failed:', notificationError.message);

    return NextResponse.json({ message, success: true });
  } catch (error) {
    console.error('POST /api/messages error:', error);
    return NextResponse.json({ error: 'Failed to send message', success: false }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized', success: false }, { status: 401 });
    const body = await request.json();
    if (!isUuid(String(body.conversation_id || ''))) return NextResponse.json({ error: 'Valid conversation ID required', success: false }, { status: 400 });
    const { error } = await supabase.from('messages').update({ is_read: true }).eq('conversation_id', body.conversation_id).eq('recipient_id', user.id).eq('is_read', false);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('PATCH /api/messages error:', error);
    return NextResponse.json({ error: 'Failed to update read state', success: false }, { status: 500 });
  }
}
