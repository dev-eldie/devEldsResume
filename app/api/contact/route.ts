import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const result = await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>",
      to: "eldiearubang@yahoo.com",
      replyTo: email,
      subject: `New inquiry from ${name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #a78bfa;">New Portfolio Inquiry</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <p><strong>Message:</strong></p>
          <div style="background: #f4f4f4; padding: 16px; border-radius: 8px; white-space: pre-wrap;">${message}</div>
          <hr style="margin-top: 32px;" />
          <p style="color: #888; font-size: 12px;">Sent from your portfolio contact form at dev-elds-resume.vercel.app</p>
        </div>
      `,
    });

    if (result.error) {
      console.error("Resend error:", result.error);
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ ok: true, id: result.data?.id });
  } catch (err) {
    console.error("Contact email error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
