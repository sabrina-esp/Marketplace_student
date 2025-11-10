import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { spawn } from 'child_process';
import connectDB from '../../../lib/db/mongodb';
const connectOnce = async () => {
  if (mongoose.connection.readyState === 0) {
    await connectDB();
  }
};

const ProductModel =
  mongoose.models.Product ||
  mongoose.model(
    'Product',
    new mongoose.Schema(
      {
        title: { type: String, required: true },
        description: { type: String, required: true },
        category: { type: String },
        price: { type: String },
        productType: { type: String },
      },
      { timestamps: true },
    ),
  );

const ChatSessionModel =
  mongoose.models.ChatSession ||
  mongoose.model(
    'ChatSession',
    new mongoose.Schema(
      {
        title: { type: String, default: 'New Chat', trim: true },
        lastMessageSnippet: { type: String, default: '', trim: true },
      },
      { timestamps: true },
    ),
  );

const ChatMessageModel =
  mongoose.models.ChatMessage ||
  mongoose.model(
    'ChatMessage',
    new mongoose.Schema(
      {
        sessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'ChatSession', required: true, index: true },
        role: { type: String, enum: ['user', 'assistant'], required: true },
        content: { type: String, required: true },
        attachments: { type: Array, default: [] },
      },
      { timestamps: true },
    ),
  );

const MAX_CONTEXT_MESSAGES = 6;
const MAX_PRODUCTS = 5;
const RECOMMENDATION_KEYWORDS = [
  'recommend',
  'suggest',
  'study',
  'prepare',
  'help me with',
  'exam',
  'course',
  'document',
  'resource',
  'revision',
  'practice',
  'materials',
];

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const serializeSession = (session) => ({
  id: session._id.toString(),
  title: session.title || 'New Chat',
  lastMessageSnippet: session.lastMessageSnippet ?? '',
  createdAt: session.createdAt,
  updatedAt: session.updatedAt,
});

const serializeMessage = (message) => ({
  id: message._id.toString(),
  chatId: message.sessionId.toString(),
  role: message.role,
  content: message.content,
  createdAt: message.createdAt,
});

const runOllama = async (prompt) =>
  new Promise((resolve, reject) => {
    const OLLAMA_CMD = process.env.OLLAMA_PATH || 'ollama';
    const ollama = spawn(OLLAMA_CMD, ['run', 'llama3'], {
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    let output = '';
    let errorOutput = '';

    ollama.stdout.on('data', (data) => {
      output += data.toString();
    });

    ollama.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    ollama.on('error', (error) => {
      reject(error);
    });

    ollama.on('close', (code) => {
      if (code === 0) {
        resolve(output.trim());
      } else {
        reject(new Error(errorOutput || `Ollama exited with code ${code}`));
      }
    });

    ollama.stdin.write(prompt);
    ollama.stdin.end();
  });

const buildPrompt = ({ history, products, question }) => {
  const historyBlock =
    history.length > 0
      ? history
          .map((msg) => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
          .join('\n')
      : 'No previous messages.';

  const productBlock =
    products.length > 0
      ? products
          .map(
            (product, index) =>
              `Product ${index + 1}:
Title: ${product.title}
Description: ${product.description}
Category: ${product.category || 'N/A'}
Price: ${product.price || 'N/A'}
Type: ${product.productType || 'N/A'}
`,
          )
          .join('\n')
      : 'No matching products were found.';

  return `You are an assistant helping students explore a marketplace of study resources.

Recent conversation:
${historyBlock}

Relevant marketplace products:
${productBlock}

User request:
${question}

Provide a concise, friendly answer that references the products when applicable. If no products match, let the student know politely and suggest adjacent topics or study tips.`;
};

const isRecommendationIntent = (text) => {
  const lower = text.toLowerCase();
  return RECOMMENDATION_KEYWORDS.some((keyword) => lower.includes(keyword));
};

const extractTopic = (text) => {
  const match = text.match(/(?:about|on|for|in|with)\s+([\w\s-]+)/i);
  if (match) return match[1].trim();
  return text.trim();
};

export async function GET(request) {
  try {
    await connectOnce();

    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (sessionId) {
      if (!mongoose.Types.ObjectId.isValid(sessionId)) {
        return NextResponse.json({ error: 'Invalid session id.' }, { status: 400 });
      }

      const session = await ChatSessionModel.findById(sessionId).lean();
      if (!session) {
        return NextResponse.json({ error: 'Session not found.' }, { status: 404 });
      }

      const messages = await ChatMessageModel.find({ sessionId })
        .sort({ createdAt: 1 })
        .lean();

      return NextResponse.json({
        session: serializeSession(session),
        messages: messages.map(serializeMessage),
      });
    }

    const sessions = await ChatSessionModel.find().sort({ updatedAt: -1 }).lean();
    return NextResponse.json({
      sessions: sessions.map(serializeSession),
    });
  } catch (error) {
    console.error('Chat GET error:', error);
    return NextResponse.json({ error: 'Failed to load chat data.' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectOnce();

    const body = await request.json();
    const action = body?.action;

    if (action === 'create') {
      const title = body?.title?.trim() || 'New Chat';
      const greeting =
        body?.initialMessage?.trim() ||
        "Hi! I'm your study marketplace assistant. Tell me what you're looking for and I'll suggest the best resources.";

      const session = await ChatSessionModel.create({
        title,
        lastMessageSnippet: greeting.slice(0, 120),
      });

      const assistantMessage = await ChatMessageModel.create({
        sessionId: session._id,
        role: 'assistant',
        content: greeting,
      });

      return NextResponse.json({
        session: serializeSession(session),
        messages: [serializeMessage(assistantMessage)],
      });
    }

    const question = body?.message?.trim();
    if (!question) {
      return NextResponse.json({ error: 'Message is required.' }, { status: 400 });
    }

    let sessionId = body?.sessionId;
    let session;

    if (sessionId) {
      if (!mongoose.Types.ObjectId.isValid(sessionId)) {
        return NextResponse.json({ error: 'Invalid session id.' }, { status: 400 });
      }
      session = await ChatSessionModel.findById(sessionId);
    }

    if (!session) {
      session = await ChatSessionModel.create({ title: 'New Chat' });
      sessionId = session._id.toString();
    }

    const userMessage = await ChatMessageModel.create({
      sessionId: session._id,
      role: 'user',
      content: question,
    });

    const conversation = await ChatMessageModel.find({ sessionId: session._id })
      .sort({ createdAt: -1 })
      .limit(MAX_CONTEXT_MESSAGES)
      .lean();

    const topic = extractTopic(question);
    const normalizedQuery = escapeRegex(topic);
    const keywordPattern = new RegExp(
      normalizedQuery
        .split(/\s+/)
        .filter(Boolean)
        .join('|'),
      'i',
    );

    const rawProducts = await ProductModel.find({
      $or: [
        { title: { $regex: keywordPattern } },
        { description: { $regex: keywordPattern } },
        { category: { $regex: keywordPattern } },
        { productType: { $regex: keywordPattern } },
      ],
    })
      .limit(20)
      .lean();

    const products = rawProducts.slice(0, MAX_PRODUCTS);

    const prompt = buildPrompt({
      history: conversation.reverse(),
      products,
      question,
    });

    let reply;
    try {
      reply = await runOllama(prompt);
    } catch (ollamaError) {
      console.error('Ollama error:', ollamaError);
      reply =
        products.length > 0
          ? `Here are a few resources that might help:\n${products
              .map((p) => `• ${p.title} (${p.category || 'General'})`)
              .join('\n')}`
          : "I'm sorry, I couldn't process that request right now. Please try again in a moment.";
    }

    const assistantMessage = await ChatMessageModel.create({
      sessionId: session._id,
      role: 'assistant',
      content: reply,
    });

    const firstUserMessage = await ChatMessageModel.findOne({
      sessionId: session._id,
      role: 'user',
    })
      .sort({ createdAt: 1 })
      .lean();

    if (firstUserMessage && (!session.title || session.title === 'New Chat')) {
      session.title = firstUserMessage.content.slice(0, 60);
    }
    session.lastMessageSnippet = reply.slice(0, 120);
    session.updatedAt = new Date();
    await session.save();

    const serializedSession = serializeSession(session);

    return NextResponse.json({
      reply,
      session: serializedSession,
      messages: [serializeMessage(userMessage), serializeMessage(assistantMessage)],
    });
  } catch (error) {
    console.error('Chat POST error:', error);
    return NextResponse.json(
      { error: 'Unable to process your request at the moment.' },
      { status: 500 },
    );
  }
}

export async function DELETE(request) {
  try {
    await connectOnce();
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId || !mongoose.Types.ObjectId.isValid(sessionId)) {
      return NextResponse.json({ error: 'Valid sessionId is required.' }, { status: 400 });
    }

    const session = await ChatSessionModel.findById(sessionId);
    if (!session) {
      return NextResponse.json({ error: 'Session not found.' }, { status: 404 });
    }

    await ChatMessageModel.deleteMany({ sessionId });
    await ChatSessionModel.findByIdAndDelete(sessionId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Chat DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete chat session.' }, { status: 500 });
  }
}
