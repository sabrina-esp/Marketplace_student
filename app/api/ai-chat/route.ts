import mongoose from 'mongoose';
import { NextResponse } from 'next/server';
import connectDB from '../../../lib/db/mongodb';
import ChatSession from '../../../lib/models/ChatSession';
import ChatMessage from '../../../lib/models/ChatMessage';

type RawMessage = {
  role: 'user' | 'assistant';
  content: string;
  attachments?: { name: string; type?: string | null }[];
};

const serializeMessage = (message: any) => ({
  id: message._id.toString(),
  chatId: message.chatId.toString(),
  role: message.role,
  content: message.content,
  attachments: message.attachments ?? [],
  createdAt: message.createdAt?.toISOString?.() ?? message.createdAt,
});

const serializeSession = (session: any) => ({
  id: session._id.toString(),
  title: session.title,
  lastMessageSnippet: session.lastMessageSnippet ?? '',
  createdAt: session.createdAt?.toISOString?.() ?? session.createdAt,
  updatedAt: session.updatedAt?.toISOString?.() ?? session.updatedAt,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const chatId = body?.chatId;
    const rawMessages: RawMessage[] = Array.isArray(body?.messages) ? body.messages : null;

    if (!chatId || !mongoose.Types.ObjectId.isValid(chatId)) {
      return NextResponse.json({ error: 'Invalid chatId' }, { status: 400 });
    }

    if (!rawMessages || rawMessages.length === 0) {
      return NextResponse.json({ error: 'No messages provided' }, { status: 400 });
    }

    await connectDB();

    const session = await ChatSession.findById(chatId);
    if (!session) {
      return NextResponse.json({ error: 'Chat session not found' }, { status: 404 });
    }

    const formattedMessages = rawMessages.slice(-20).map((message) => {
      const attachmentText =
        message.attachments && message.attachments.length > 0
          ? `\n\nAttachments:\n${message.attachments
              .map((att) => `- ${att.name}${att.type ? ` (${att.type})` : ''}`)
              .join('\n')}`
          : '';

      return {
        role: message.role,
        content: `${message.content || ''}${attachmentText}`,
      };
    });

    const apiKey = process.env.OPENAI_API_KEY || process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      const lastUserMessage =
        [...formattedMessages].reverse().find((m) => m.role === 'user')?.content ?? 'your query';
      const mockMessage = await ChatMessage.create({
        chatId,
        role: 'assistant',
        content: `Mock response: I understand "${lastUserMessage.slice(
          0,
          80,
        )}". Try refining your filters or explore featured products while we connect the AI service.`,
        attachments: [],
      });

      session.lastMessageSnippet = mockMessage.content.slice(0, 120);
      session.updatedAt = new Date();
      await session.save();

      return NextResponse.json({
        content: mockMessage.content,
        message: serializeMessage(mockMessage),
        session: serializeSession(session),
        mock: true,
      });
    }

    const isOpenRouter = Boolean(process.env.OPENROUTER_API_KEY);
    const endpoint = isOpenRouter
      ? 'https://openrouter.ai/api/v1/chat/completions'
      : 'https://api.openai.com/v1/chat/completions';

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    };

    if (isOpenRouter && process.env.OPENROUTER_APP_ID) {
      headers['HTTP-Referer'] = process.env.OPENROUTER_APP_ID;
      headers['X-Title'] = 'Student Marketplace';
    }

    const model =
      process.env.OPENAI_MODEL ||
      process.env.OPENROUTER_MODEL ||
      (isOpenRouter ? 'openrouter/auto' : 'gpt-4o-mini');

    const response = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model,
        messages: formattedMessages,
        temperature: 0.2,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('AI provider error', response.status, errorBody);
      return NextResponse.json(
        { error: 'Upstream AI service failed' },
        { status: response.status === 401 ? 401 : 502 },
      );
    }

    const data = await response.json();
    const content =
      data?.choices?.[0]?.message?.content ??
      "I'm here to help! Let me know the course, project, or study material you're searching for.";

    const assistantMessage = await ChatMessage.create({
      chatId,
      role: 'assistant',
      content,
      attachments: [],
    });

    session.lastMessageSnippet = content.slice(0, 120);
    session.updatedAt = new Date();
    await session.save();

    return NextResponse.json({
      content,
      message: serializeMessage(assistantMessage),
      session: serializeSession(session),
    });
  } catch (error) {
    console.error('AI chat route error', error);
    return NextResponse.json({ error: 'Unexpected error in AI chat route' }, { status: 500 });
  }
}

