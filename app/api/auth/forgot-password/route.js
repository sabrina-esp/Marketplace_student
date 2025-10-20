import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

export async function POST(req) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json(
                { success: false, message: 'Email is required' },
                { status: 400 }
            );
        }

        await dbConnect();
        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            return NextResponse.json(
                { success: false, message: 'No account found with this email' },
                { status: 404 }
            );
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpiry = resetTokenExpiry;
        await user.save();

        // Send email
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`;

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Password Reset Request - Marketplace',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);">
                    <div style="background: white; border-radius: 20px; padding: 40px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
                        <div style="text-align: center; margin-bottom: 30px;">
                            <div style="background: linear-gradient(135deg, #7c3aed 0%, #6366f1 100%); width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                                <span style="font-size: 40px;">🔑</span>
                            </div>
                            <h2 style="color: #7c3aed; margin: 0; font-size: 28px;">Reset Your Password</h2>
                        </div>
                        
                        <p style="color: #333; font-size: 16px; line-height: 1.6;">Hello,</p>
                        <p style="color: #333; font-size: 16px; line-height: 1.6;">
                            You requested to reset your password. Click the button below to create a new password:
                        </p>
                        
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${resetUrl}" style="display: inline-block; padding: 15px 40px; background: linear-gradient(135deg, #7c3aed 0%, #6366f1 100%); color: white; text-decoration: none; border-radius: 10px; font-weight: bold; font-size: 16px; box-shadow: 0 5px 15px rgba(124, 58, 237, 0.3);">
                                Reset Password
                            </a>
                        </div>
                        
                        <p style="color: #666; font-size: 14px; line-height: 1.6;">
                            Or copy and paste this link into your browser:
                        </p>
                        <p style="color: #6366f1; font-size: 14px; word-break: break-all; background: #f3f4f6; padding: 12px; border-radius: 8px;">
                            ${resetUrl}
                        </p>
                        
                        <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #e5e7eb;">
                            <p style="color: #ef4444; font-size: 14px; margin: 10px 0;">
                                ⚠️ <strong>This link will expire in 1 hour.</strong>
                            </p>
                            <p style="color: #666; font-size: 14px; margin: 10px 0;">
                                If you didn't request this password reset, please ignore this email or contact support if you have concerns.
                            </p>
                        </div>
                        
                        <div style="margin-top: 30px; text-align: center; color: #999; font-size: 12px;">
                            <p>© ${new Date().getFullYear()} Marketplace. All rights reserved.</p>
                        </div>
                    </div>
                </div>
            `,
        });

        return NextResponse.json({
            success: true,
            message: 'Password reset link sent to your email',
        });
    } catch (error) {
        console.error('Forgot password error:', error);
        return NextResponse.json(
            { success: false, message: 'Error processing request' },
            { status: 500 }
        );
    }
}