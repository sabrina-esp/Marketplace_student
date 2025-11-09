import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '../../../../../lib/db/mongodb';
import ChatSession from '../../../../../lib/models/ChatSession';
import ChatMessage from '../../../../../lib/models/ChatMessage';

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

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
    }

    const session = await ChatSession.findById(params.id);
    if (!session) {
      return NextResponse.json({ error: 'Chat session not found' }, { status: 404 });
    }

    const body = await request.json();

    if (!body.role || !['user', 'assistant'].includes(body.role)) {
      return NextResponse.json({ error: 'Invalid message role' }, { status: 400 });
    }

    if (!body.content || typeof body.content !== 'string') {
      return NextResponse.json({ error: 'Message content required' }, { status: 400 });
    }

    const message = await ChatMessage.create({
      chatId: session._id,
      role: body.role,
      content: body.content,
      attachments: Array.isArray(body.attachments) ? body.attachments : [],
    });

    if (body.role === 'user' && session.title === 'New Chat') {
      session.title = body.content.slice(0, 80) || 'New Chat';
    }

    session.lastMessageSnippet = body.content.slice(0, 120);
    session.updatedAt = new Date();
    await session.save();

    return NextResponse.json({
      session: serializeSession(session),
      message: serializeMessage(message),
    });
  } catch (error) {
    console.error('Error creating chat message', error);
    return NextResponse.json({ error: 'Failed to create chat message' }, { status: 500 });
  }
}


