import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';
import {
  ContactFormEmail,
  InquirySentEmail,
} from '@/emails';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, data } = body;

    switch (type) {
      case 'contact': {
        // Send contact form to admin
        const adminResult = await sendEmail({
          to: 'de_greenacrespropertiesltd@yahoo.com',
          subject: `[Contact Form] ${data.subject}`,
          template: ContactFormEmail(data),
          replyTo: data.email,
        });

        // Send confirmation to user
        const userResult = await sendEmail({
          to: data.email,
          subject: 'We received your message — De-Greenacres',
          template: InquirySentEmail({
            name: data.name,
            propertyTitle: 'General Enquiry',
            agentName: 'De-Greenacres Support Team',
          }),
        });

        return NextResponse.json({
          success: adminResult.success && userResult.success,
          adminId: adminResult.id,
          userId: userResult.id,
        });
      }

      default:
        return NextResponse.json(
          { success: false, error: 'Unknown email type' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Email API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
