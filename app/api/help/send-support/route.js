import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';

export async function POST(req) {
  try {
    // Verify authentication
    const token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    try {
      jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { name, email, subject, message } = await req.json();

    // Validate input
    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    // Configure nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Email to support team
    const supportEmailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .field { margin-bottom: 20px; }
            .field-label { font-weight: bold; color: #7c3aed; margin-bottom: 5px; }
            .field-value { background: white; padding: 15px; border-radius: 8px; border-left: 4px solid #8b5cf6; }
            .message-box { background: white; padding: 20px; border-radius: 8px; border: 2px solid #e0e7ff; min-height: 150px; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🆘 New Support Request</h1>
            </div>
            <div class="content">
              <div class="field">
                <div class="field-label">👤 From:</div>
                <div class="field-value">${name}</div>
              </div>
              
              <div class="field">
                <div class="field-label">📧 Email:</div>
                <div class="field-value">${email}</div>
              </div>
              
              <div class="field">
                <div class="field-label">📌 Subject:</div>
                <div class="field-value">${subject}</div>
              </div>
              
              <div class="field">
                <div class="field-label">💬 Message:</div>
                <div class="message-box">${message.replace(/\n/g, '<br>')}</div>
              </div>
              
              <div class="footer">
                <p>Received: ${new Date().toLocaleString()}</p>
                <p>Please respond to: <strong>${email}</strong></p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    // Confirmation email to user
    const confirmationEmailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .message { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .icon { font-size: 48px; text-align: center; margin-bottom: 20px; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✅ Support Request Received</h1>
            </div>
            <div class="content">
              <div class="icon">📬</div>
              
              <p>Hi <strong>${name}</strong>,</p>
              
              <p>Thank you for contacting our support team! We've received your message and will get back to you as soon as possible.</p>
              
              <div class="message">
                <h3 style="color: #7c3aed; margin-top: 0;">Your Message:</h3>
                <p><strong>Subject:</strong> ${subject}</p>
                <p>${message.replace(/\n/g, '<br>')}</p>
              </div>
              
              <p><strong>What happens next?</strong></p>
              <ul>
                <li>✅ We've received your request</li>
                <li>⏱️ Our team will review it within 24 hours</li>
                <li>📧 You'll receive a response at: <strong>${email}</strong></li>
              </ul>
              
              <p>If you have any urgent concerns, please call us at: <strong>+216 55 448 132</strong></p>
              
              <div class="footer">
                <p>Best regards,<br><strong>Support Team</strong></p>
                <p style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd;">
                  This is an automated confirmation. Please do not reply to this email.
                </p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    // Send email to support team
    await transporter.sendMail({
      from: `"Support System" <${process.env.EMAIL_USER}>`,
      to: 'karouielyess@gmail.com',
      subject: `🆘 Support Request: ${subject}`,
      html: supportEmailHtml,
      replyTo: email
    });

    // Send confirmation email to user
    await transporter.sendMail({
      from: `"Support Team" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `✅ We received your support request: ${subject}`,
      html: confirmationEmailHtml
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Support request sent successfully' 
    });

  } catch (error) {
    console.error('Error sending support email:', error);
    return NextResponse.json({ 
      error: 'Failed to send support request', 
      details: error.message 
    }, { status: 500 });
  }
}
