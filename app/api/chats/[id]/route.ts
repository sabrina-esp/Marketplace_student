import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '../../../../lib/db/mongodb';
import ChatSession from '../../../../lib/models/ChatSession';
import ChatMessage from '../../../../lib/models/ChatMessage';

const serializeSession = (session: any) => ({
  id: session._id.toString(),
  title: session.title,
  lastMessageSnippet: session.lastMessageSnippet ?? '',
  createdAt: session.createdAt?.toISOString?.() ?? session.createdAt,
  updatedAt: session.updatedAt?.toISOString?.() ?? session.updatedAt,
});

const serializeMessage = (message: any) => ({
  id: message._id.toString(),
  chatId: message.chatId.toString(),
  role: message.role,
  content: message.content,
  attachments: message.attachments ?? [],
  createdAt: message.createdAt?.toISOString?.() ?? message.createdAt,
});

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
    }

    const session = await ChatSession.findById(params.id).lean();
    if (!session) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const messages = await ChatMessage.find({ chatId: params.id }).sort({ createdAt: 1 }).lean();

    return NextResponse.json({
      session: serializeSession(session),
      messages: messages.map(serializeMessage),
    });
  } catch (error) {
    console.error('Error fetching chat session', error);
    return NextResponse.json({ error: 'Failed to fetch chat session' }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
    }

    const session = await ChatSession.findByIdAndDelete(params.id);
    if (!session) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    await ChatMessage.deleteMany({ chatId: params.id });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting chat session', error);
    return NextResponse.json({ error: 'Failed to delete chat session' }, { status: 500 });
  }
}


