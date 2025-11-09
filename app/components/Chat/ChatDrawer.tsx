"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ClockIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import {
  AttachmentMeta,
  ChatMessageRecord,
  ChatSessionRecord,
} from '../../../lib/chatStorage';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const INITIAL_ASSISTANT_GREETING =
  "Hi! I'm your study marketplace assistant. Tell me what you're looking for and I'll suggest the best resources.";

const ChatDrawer = ({ isOpen, onClose }: Props) => {
  const [sessions, setSessions] = useState<ChatSessionRecord[]>([]);
  const [messages, setMessages] = useState<ChatMessageRecord[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [historyOpen, setHistoryOpen] = useState<boolean>(false);
  const [loadingSessions, setLoadingSessions] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<ChatMessageRecord[]>([]);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setHistoryOpen(false);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping, isOpen]);

  const updateSessionList = useCallback((session: ChatSessionRecord) => {
    setSessions((prev) => {
      const others = prev.filter((s) => s.id !== session.id);
      return [session, ...others];
    });
  }, []);

  const loadSessions = useCallback(async (): Promise<ChatSessionRecord[]> => {
    try {
      setLoadingSessions(true);
      setError(null);
      const res = await fetch('/api/chats', { cache: 'no-store' });
      if (!res.ok) {
        throw new Error('Failed to load chat history');
      }
      const data = await res.json();
      const list: ChatSessionRecord[] = Array.isArray(data.sessions) ? data.sessions : [];
      setSessions(list);
      if (list.length > 0) {
        setActiveId((current) => current ?? list[0].id);
      } else {
        setActiveId(null);
      }
      return list;
    } catch (err: any) {
      console.error('Chat history load error', err);
      setError(err.message ?? 'Unable to load chat history');
      setSessions([]);
      setActiveId(null);
      return [];
    } finally {
      setLoadingSessions(false);
    }
  }, []);

  const createSession = useCallback(async () => {
    try {
      const res = await fetch('/api/chats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          initialMessage: INITIAL_ASSISTANT_GREETING,
          initialRole: 'assistant',
        }),
      });
      if (!res.ok) {
        throw new Error('Failed to create chat session');
      }
      const data = await res.json();
      const session: ChatSessionRecord | undefined = data.session;
      const initialMessages: ChatMessageRecord[] = Array.isArray(data.messages) ? data.messages : [];
      if (session) {
        setSessions((prev) => [session, ...prev]);
        setActiveId(session.id);
        setMessages(initialMessages);
      }
    } catch (err) {
      console.error('Create chat session error', err);
    }
  }, []);

  const fetchMessages = useCallback(async (sessionId: string) => {
    try {
      setLoadingMessages(true);
      setError(null);
      const res = await fetch(`/api/chats/${sessionId}`, { cache: 'no-store' });
      if (res.status === 404) {
        setMessages([]);
        return;
      }
      if (!res.ok) {
        throw new Error('Failed to load messages');
      }
      const data = await res.json();
      const session: ChatSessionRecord | undefined = data.session;
      const list: ChatMessageRecord[] = Array.isArray(data.messages) ? data.messages : [];
      setMessages(list);
      if (session) {
        updateSessionList(session);
      }
    } catch (err: any) {
      console.error('Load messages error', err);
      setError(err.message ?? 'Unable to load messages');
      setMessages([]);
    } finally {
      setLoadingMessages(false);
    }
  }, [updateSessionList]);

  useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;
    loadSessions().then((list) => {
      if (!cancelled && list.length === 0) {
        createSession();
      }
    });
    return () => {
      cancelled = true;
    };
  }, [isOpen, loadSessions, createSession]);

  useEffect(() => {
    if (!isOpen) return;
    if (!activeId) {
      setMessages([]);
      return;
    }
    fetchMessages(activeId);
  }, [activeId, fetchMessages, isOpen]);

  const newChat = useCallback(async () => {
    await createSession();
  }, [createSession]);

  const deleteChat = useCallback(
    async (id: string) => {
      try {
        const res = await fetch(`/api/chats/${id}`, { method: 'DELETE' });
        if (!res.ok) {
          throw new Error('Unable to delete chat');
        }
        setSessions((prev) => {
          const next = prev.filter((s) => s.id !== id);
          if (activeId === id) {
            const nextActive = next[0]?.id ?? null;
            setActiveId(nextActive);
            setMessages([]);
          }
          return next;
        });
      } catch (err) {
        console.error('Delete chat error', err);
      }
    },
    [activeId],
  );

  const useChat = useCallback((id: string) => {
    setActiveId(id);
    setHistoryOpen(false);
  }, []);

  const handleSend = useCallback(
    async (text: string, attachments?: AttachmentMeta[]) => {
      if (!activeId) return;
      try {
        const payload = {
          role: 'user',
          content: text,
          attachments: attachments ?? [],
        };
        const res = await fetch(`/api/chats/${activeId}/messages`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          throw new Error('Failed to send message');
        }
        const data = await res.json();
        const message: ChatMessageRecord = data.message;
        const session: ChatSessionRecord | undefined = data.session;
        const nextMessages = [...messagesRef.current, message];
        messagesRef.current = nextMessages;
        setMessages(nextMessages);
        if (session) {
          updateSessionList(session);
        }

        setIsTyping(true);

        const conversation = nextMessages.map((m) => ({
          role: m.role,
          content: m.content,
          attachments: m.attachments?.map((a) => ({ name: a.name, type: a.type })),
        }));

        const aiResponse = await fetch('/api/ai-chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            chatId: activeId,
            messages: conversation,
          }),
        });

        if (!aiResponse.ok) {
          throw new Error('AI request failed');
        }

        const aiData = await aiResponse.json();
        if (aiData?.message) {
          const aiMessage: ChatMessageRecord = aiData.message;
          const sessionUpdate: ChatSessionRecord | undefined = aiData.session;
          const withAssistant = [...messagesRef.current, aiMessage];
          messagesRef.current = withAssistant;
          setMessages(withAssistant);
          if (sessionUpdate) {
            updateSessionList(sessionUpdate);
          }
        }
      } catch (err: any) {
        console.error('Chat send error', err);
        const fallback: ChatMessageRecord = {
          id: `${Date.now()}-error`,
          chatId: activeId,
          role: 'assistant',
          content: "Sorry, I couldn't reach the AI service right now. Please try again in a moment.",
          attachments: [],
          createdAt: new Date().toISOString(),
        };
        const withError = [...messagesRef.current, fallback];
        messagesRef.current = withError;
        setMessages(withError);
      } finally {
        setIsTyping(false);
      }
    },
    [activeId, updateSessionList],
  );

  const historyPanel = (
    <aside
      className={`absolute inset-y-0 left-0 z-20 w-full max-w-full transform bg-white shadow-xl transition-transform duration-300 sm:max-w-xs lg:static lg:translate-x-0 lg:shadow-none ${
        historyOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}
    >
      <div className="flex h-full flex-col border-r border-gray-100 bg-gray-50/80 backdrop-blur-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2 font-semibold text-gray-800">
            <ClockIcon className="h-4 w-4" />
            History
          </div>
          <button
            onClick={() => setHistoryOpen(false)}
            className="rounded-lg border border-gray-200 px-3 py-1 text-xs text-gray-500 hover:bg-gray-100 lg:hidden"
          >
            Close
          </button>
        </div>
        <div className="flex-1 space-y-2 overflow-y-auto px-3 pb-4">
          {loadingSessions ? (
            Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="h-20 rounded-xl border border-gray-100 bg-gray-50 animate-pulse" />
            ))
          ) : sessions.length === 0 ? (
            <div className="rounded-xl border border-gray-100 bg-white p-4 text-xs text-gray-500">
              No conversations yet. Start a new chat to begin.
            </div>
          ) : (
            sessions.map((session) => (
              <div
                key={session.id}
                className={`group rounded-xl border bg-white p-3 shadow-sm transition ${
                  session.id === activeId
                    ? 'border-purple ring-2 ring-purple/20'
                    : 'border-gray-100 hover:border-purple/40'
                }`}
              >
                <button
                  onClick={() => useChat(session.id)}
                  className="block w-full text-left"
                >
                  <div className="text-sm font-semibold text-gray-800 line-clamp-1">
                    {session.title || 'New chat'}
                  </div>
                  <div className="mt-1 text-[11px] text-gray-500">
                    {new Date(session.updatedAt || session.createdAt).toLocaleString()}
                  </div>
                </button>
                <div className="mt-2 flex items-center justify-between">
                  <span className="flex-1 truncate pr-2 text-[11px] text-gray-400">
                    {session.lastMessageSnippet || 'No messages yet'}
                  </span>
                  <button
                    onClick={() => deleteChat(session.id)}
                    className="rounded-full border border-transparent p-1 text-gray-400 transition hover:border-red-200 hover:bg-red-50 hover:text-red-500"
                    aria-label="Delete chat"
                  >
                    <TrashIcon className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </aside>
  );

  const activeSessionTitle = useMemo(() => sessions.find((s) => s.id === activeId)?.title ?? 'New Chat', [
    sessions,
    activeId,
  ]);

  return (
    <div className={`fixed inset-0 z-50 ${isOpen ? '' : 'pointer-events-none'}`}>
      <div
        onClick={onClose}
        className={`absolute inset-0 transition ${isOpen ? 'bg-black/50 backdrop-blur-[2px]' : 'bg-transparent'}`}
      />
      <aside
        className={`absolute right-0 top-0 h-full w-full transform border-l border-gray-100 bg-white shadow-2xl transition-transform duration-300 sm:w-[420px] lg:w-[520px] ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-gray-100 bg-white/90 px-4 py-3 backdrop-blur">
          <div>
            <div className="text-base font-semibold text-gray-900">Ask AI</div>
            <div className="text-xs text-gray-500">{activeSessionTitle}</div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setHistoryOpen((v) => !v)}
              aria-label="Toggle history"
              className="flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600 transition hover:bg-gray-50 lg:hidden"
            >
              <ClockIcon className="h-4 w-4" />
              History
            </button>
            <button
              onClick={newChat}
              className="flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-700 transition hover:bg-gray-50"
            >
              <PlusIcon className="h-4 w-4" />
              New Chat
            </button>
            <button onClick={onClose} className="text-gray-400 transition hover:text-gray-600" aria-label="Close chat">
              ✕
            </button>
          </div>
        </div>

        <div className="relative flex h-[calc(100vh-57px)]">
          {historyPanel}

          <div className="flex flex-1 flex-col">
            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-gray-50/80 px-4 py-6">
              {loadingMessages ? (
                Array.from({ length: 4 }).map((_, idx) => (
                  <div key={idx} className="h-20 w-3/4 rounded-2xl bg-white/80 shadow-sm animate-pulse" />
                ))
              ) : (
                <>
                  {messages.map((m) => (
                    <ChatMessage
                      key={m.id}
                      role={m.role}
                      content={m.content}
                      attachments={m.attachments}
                    />
                  ))}
                  {isTyping && <ChatMessage role="assistant" content="" isTyping />}
                </>
              )}
              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50/70 px-3 py-2 text-xs text-red-600">
                  {error}
                </div>
              )}
            </div>
            <ChatInput onSend={handleSend} />
          </div>
        </div>
      </aside>
    </div>
  );
};

export default ChatDrawer;

