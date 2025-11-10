import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import User from '@/lib/models/User';
import dbConnect from '@/lib/db/mongodb';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export async function POST(request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    let decoded;
    
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return NextResponse.json({ success: false, message: 'Invalid token' }, { status: 401 });
    }

    await dbConnect();
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    const { email: friendEmail } = await request.json();

    if (!friendEmail) {
      return NextResponse.json({ success: false, message: 'Email is required' }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(friendEmail)) {
      return NextResponse.json({ success: false, message: 'Invalid email format' }, { status: 400 });
    }

    // Generate referral code (use user ID or create unique code)
    const referralCode = `${user.name.toUpperCase().replace(/\s+/g, '')}${user._id.toString().slice(-4)}`;
    const referralLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3011'}/register?ref=${referralCode}`;

    // Create email transporter
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.EMAIL_USER || 'karouielyess@gmail.com',
        pass: process.env.EMAIL_PASSWORD || process.env.EMAIL_PASS,
      },
    });

    // Email template
    const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>You're Invited to Join Marketplace!</title>
      <style>
        body {
          margin: 0;
          padding: 0;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        .email-container {
          max-width: 600px;
          margin: 40px auto;
          background: white;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }
        .header {
          background: linear-gradient(135deg, #7c3aed 0%, #6366f1 50%, #8b5cf6 100%);
          padding: 40px 20px;
          text-align: center;
          color: white;
        }
        .header h1 {
          margin: 0;
          font-size: 32px;
          font-weight: bold;
        }
        .header p {
          margin: 10px 0 0 0;
          font-size: 16px;
          opacity: 0.9;
        }
        .content {
          padding: 40px 30px;
        }
        .invitation-box {
          background: linear-gradient(135deg, rgba(124, 58, 237, 0.1) 0%, rgba(99, 102, 241, 0.1) 100%);
          border: 2px solid rgba(124, 58, 237, 0.2);
          border-radius: 15px;
          padding: 25px;
          margin: 25px 0;
          text-align: center;
        }
        .invitation-box h2 {
          margin: 0 0 10px 0;
          color: #7c3aed;
          font-size: 24px;
        }
        .invitation-box p {
          margin: 0;
          color: #4b5563;
          font-size: 16px;
        }
        .benefit-list {
          margin: 30px 0;
        }
        .benefit-item {
          display: flex;
          align-items: center;
          margin: 15px 0;
          padding: 15px;
          background: #f9fafb;
          border-radius: 10px;
        }
        .benefit-icon {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #7c3aed, #6366f1);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 15px;
          font-size: 20px;
        }
        .cta-button {
          display: inline-block;
          padding: 18px 40px;
          background: linear-gradient(135deg, #7c3aed 0%, #6366f1 100%);
          color: white;
          text-decoration: none;
          border-radius: 12px;
          font-weight: bold;
          font-size: 18px;
          margin: 20px 0;
          box-shadow: 0 10px 30px rgba(124, 58, 237, 0.3);
          transition: all 0.3s ease;
        }
        .cta-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 15px 40px rgba(124, 58, 237, 0.4);
        }
        .referral-code {
          background: #f3f4f6;
          border: 2px dashed #7c3aed;
          border-radius: 10px;
          padding: 15px;
          margin: 20px 0;
          text-align: center;
          font-family: monospace;
          font-size: 18px;
          font-weight: bold;
          color: #7c3aed;
        }
        .footer {
          background: #f9fafb;
          padding: 30px;
          text-align: center;
          color: #6b7280;
          font-size: 14px;
        }
        .footer a {
          color: #7c3aed;
          text-decoration: none;
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <h1>🎉 You're Invited!</h1>
          <p>Join the best online learning platform</p>
        </div>
        
        <div class="content">
          <p style="font-size: 18px; color: #374151; margin-bottom: 20px;">
            Hi there! 👋
          </p>
          
          <p style="font-size: 16px; color: #4b5563; line-height: 1.6;">
            <strong>${user.name}</strong> thinks you'd love <strong>Marketplace</strong> - an amazing platform 
            where you can learn new skills, take courses, and grow your career!
          </p>

          <div class="invitation-box">
            <h2>🎁 Special Offer</h2>
            <p>Get <strong style="color: #7c3aed; font-size: 24px;">20% OFF</strong> your first course!</p>
          </div>

          <div class="benefit-list">
            <div class="benefit-item">
              <div class="benefit-icon">📚</div>
              <div>
                <strong style="color: #374151;">Thousands of Courses</strong><br>
                <span style="color: #6b7280; font-size: 14px;">Learn anything from web development to design</span>
              </div>
            </div>
            
            <div class="benefit-item">
              <div class="benefit-icon">👨‍🏫</div>
              <div>
                <strong style="color: #374151;">Expert Instructors</strong><br>
                <span style="color: #6b7280; font-size: 14px;">Learn from industry professionals</span>
              </div>
            </div>
            
            <div class="benefit-item">
              <div class="benefit-icon">🏆</div>
              <div>
                <strong style="color: #374151;">Certificates</strong><br>
                <span style="color: #6b7280; font-size: 14px;">Get certified and boost your career</span>
              </div>
            </div>
          </div>

          <div style="text-align: center;">
            <a href="${referralLink}" class="cta-button">
              Join Now & Get 20% OFF
            </a>
          </div>

          <p style="text-align: center; color: #6b7280; margin-top: 20px; font-size: 14px;">
            Or use this referral code:
          </p>
          <div class="referral-code">
            ${referralCode}
          </div>

          <p style="font-size: 14px; color: #6b7280; text-align: center; margin-top: 30px;">
            Click the button above or copy the link below:<br>
            <a href="${referralLink}" style="color: #7c3aed; word-break: break-all;">${referralLink}</a>
          </p>
        </div>

        <div class="footer">
          <p style="margin: 0 0 10px 0;">
            This invitation was sent by ${user.name} (${user.email})
          </p>
          <p style="margin: 0;">
            © 2024 Marketplace. All rights reserved.<br>
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3011'}">Visit our website</a>
          </p>
        </div>
      </div>
    </body>
    </html>
    `;

    // Send email
    await transporter.sendMail({
      from: `"${user.name} via Marketplace" <${process.env.EMAIL_USER || 'karouielyess@gmail.com'}>`,
      to: friendEmail,
      subject: `${user.name} invited you to join Marketplace - Get 20% OFF!`,
      html: emailHtml,
      text: `
Hi there!

${user.name} invited you to join Marketplace - the best online learning platform!

🎁 Special Offer: Get 20% OFF your first course!

Why join Marketplace?
✓ Thousands of courses
✓ Expert instructors
✓ Professional certificates

Use this referral code: ${referralCode}
Or click this link: ${referralLink}

Join now and start learning!

---
This invitation was sent by ${user.name} (${user.email})
© 2024 Marketplace. All rights reserved.
      `.trim(),
    });

    // Save referral to database (optional - you can track referrals)
    // user.referrals = user.referrals || [];
    // user.referrals.push({
    //   email: friendEmail,
    //   code: referralCode,
    //   sentAt: new Date()
    // });
    // await user.save();

    return NextResponse.json({
      success: true,
      message: 'Invitation sent successfully!',
      referralCode,
    });

  } catch (error) {
    console.error('Error sending invitation:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to send invitation. Please try again.',
      error: error.message
    }, { status: 500 });
  }
}
