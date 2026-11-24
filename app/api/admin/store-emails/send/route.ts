// POST /api/admin/store-emails/send — email the store waitlist (admin)
//   { subject, message }            → sends to everyone on the list
//   { subject, message, testTo }    → sends ONE copy to that address, nobody else

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { getDB, storeEmailQueries } from '@/lib/db';
import { buildLaunchEmail, mailConfigured, sendMail, siteUrl } from '@/lib/mail';

export async function POST(request: NextRequest) {
  try {
    await requireAuth();
    const body = await request.json();
    const subject = typeof body.subject === 'string' ? body.subject.trim().slice(0, 150) : '';
    const message = typeof body.message === 'string' ? body.message.trim().slice(0, 5000) : '';
    const testTo = typeof body.testTo === 'string' ? body.testTo.trim() : '';

    if (!subject || !message) {
      return NextResponse.json({ error: 'Add a subject and a message first.' }, { status: 400 });
    }
    if (!mailConfigured()) {
      return NextResponse.json(
        { error: 'Email sending is not set up yet (needs RESEND_API_KEY and MAIL_FROM).' },
        { status: 503 }
      );
    }

    if (testTo) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(testTo)) {
        return NextResponse.json({ error: 'That test address does not look right.' }, { status: 400 });
      }
      const unsubscribeUrl = `${siteUrl()}/unsubscribe?t=preview`;
      const result = await sendMail([
        { to: testTo, subject: `[TEST] ${subject}`, ...buildLaunchEmail({ subject, message, unsubscribeUrl }), unsubscribeUrl },
      ]);
      if (result.sent === 0) return NextResponse.json({ error: result.error || 'Send failed.' }, { status: 502 });
      return NextResponse.json({ success: true, test: true, sent: 1 });
    }

    const db = getDB();
    const people = (await storeEmailQueries.getAll(db)).filter(p => p.unsubscribe_token);
    if (people.length === 0) return NextResponse.json({ error: 'The waitlist is empty.' }, { status: 400 });

    const messages = people.map(p => {
      const unsubscribeUrl = `${siteUrl()}/unsubscribe?t=${p.unsubscribe_token}`;
      return { to: p.email, subject, ...buildLaunchEmail({ subject, message, unsubscribeUrl }), unsubscribeUrl };
    });
    const result = await sendMail(messages);

    // Only stamp people if something actually went out.
    if (result.sent > 0 && result.failed === 0) await storeEmailQueries.markEmailed(db, people.map(p => p.id));

    if (result.sent === 0) return NextResponse.json({ error: result.error || 'Send failed.' }, { status: 502 });
    return NextResponse.json({ success: true, sent: result.sent, failed: result.failed, error: result.error });
  } catch (error: any) {
    if (error.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    console.error('Error sending waitlist email:', error);
    return NextResponse.json({ error: 'Failed to send' }, { status: 500 });
  }
}
