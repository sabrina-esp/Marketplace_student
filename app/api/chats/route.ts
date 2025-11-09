import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../../lib/db/mongodb';
import ChatSession from '../../../lib/models/ChatSession';
import ChatMessage from '../../../lib/models/ChatMessage';

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

export async function GET() {
  try {
    await connectDB();
    const sessions = await ChatSession.find().sort({ updatedAt: -1 }).lean();
    return NextResponse.json({ sessions: sessions.map(serializeSession) });
  } catch (error) {
    console.error('Error fetching chat sessions', error);
    return NextResponse.json({ error: 'Failed to fetch chat sessions' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json().catch(() => ({}));
    const session = await ChatSession.create({
      title: body.title || 'New Chat',
    });

    let initialMessages: any[] = [];

    if (body.initialMessage) {
      const message = await ChatMessage.create({
        chatId: session._id,
        role: body.initialRole === 'user' ? 'user' : 'assistant',
        content: body.initialMessage,
        attachments: Array.isArray(body.attachments) ? body.attachments : [],
      });
      initialMessages = [serializeMessage(message)];
      session.title =
        body.initialRole === 'user'
          ? body.initialMessage.slice(0, 80)
          : session.title;
      session.lastMessageSnippet = body.initialMessage.slice(0, 120);
      await session.save();
    }

    return NextResponse.json({
      session: serializeSession(session),
      messages: initialMessages,
    });
  } catch (error) {
    console.error('Error creating chat session', error);
    return NextResponse.json({ error: 'Failed to create chat session' }, { status: 500 });
  }
}


