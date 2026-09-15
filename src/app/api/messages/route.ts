import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { sanitizeForDb } from '@/lib/validation';

// GET /api/messages - Get conversations
export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized', success: false },
        { status: 401 }
      );
    }

    // Get conversations where user is a participant
    const { data: messages, error } = await supabase
      .from('messages')
      .select('*, sender:sender_id(first_name, last_name, avatar_url), recipient:recipient_id(first_name, last_name, avatar_url)')
      .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Group messages by conversation
    const conversations = new Map();
    for (const msg of messages || []) {
      const convId = msg.conversation_id;
      if (!conversations.has(convId)) {
        conversations.set(convId, {
          id: convId,
          lastMessage: msg,
          unreadCount: 0,
        });
      }
      if (msg.recipient_id === user.id && !msg.is_read) {
        conversations.get(convId).unreadCount++;
      }
    }

    return NextResponse.json({
      conversations: Array.from(conversations.values()),
      success: true,
    });
  } catch (error) {
    console.error('GET /api/messages error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages', success: false },
      { status: 500 }
    );
  }
}

// POST /api/messages - Send a message
export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Please sign in to send messages', success: false },
        { status: 401 }
      );
    }

    const body = await request.json();

    if (!body.recipient_id) {
      return NextResponse.json(
        { error: 'Recipient is required', success: false },
        { status: 400 }
      );
    }

    if (!body.content || body.content.trim().length < 1) {
      return NextResponse.json(
        { error: 'Message content is required', success: false },
        { status: 400 }
      );
    }

    // Find or create conversation
    let conversationId = body.conversation_id;

    if (!conversationId) {
      // Create new conversation
      const { data: conversation, error: convError } = await supabase
        .from('conversations')
        .insert({
          property_id: body.property_id || null,
        })
        .select()
        .single();

      if (convError) throw convError;
      conversationId = conversation.id;
    }

    // Send message
    const { data: message, error } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        sender_id: user.id,
        recipient_id: body.recipient_id,
        content: sanitizeForDb(body.content),
      })
      .select('*, sender:sender_id(first_name, last_name, avatar_url)')
      .single();

    if (error) throw error;

    // Create notification for recipient
    await supabase.from('notifications').insert({
      user_id: body.recipient_id,
      type: 'new_message',
      title: 'New Message',
      message: 'You have a new message',
      data: { conversation_id: conversationId, sender_id: user.id },
    });

    return NextResponse.json({ message, success: true });
  } catch (error) {
    console.error('POST /api/messages error:', error);
    return NextResponse.json(
      { error: 'Failed to send message', success: false },
      { status: 500 }
    );
  }
}
