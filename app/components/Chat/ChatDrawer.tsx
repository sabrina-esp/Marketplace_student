"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ClockIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import type { AttachmentMeta, ChatMessageRecord, ChatSessionRecord } from '../../../lib/chatStorage';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const GREETING =
  "Hi! I'm your study marketplace assistant. Tell me what you're looking for and I'll suggest the best resources.";

const ChatDrawer = ({ isOpen, onClose }: Props) => {
  const [sessions, setSessions] = useState<ChatSessionRecord[]>([]);
  const [messages, setMessages] = useState<ChatMessageRecord[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [loadingSessions, setLoadingSessions] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [creatingSession, setCreatingSession] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const messagesRef = useRef<ChatMessageRecord[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

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

  const loadSessions = useCallback(async () => {
    try {
      setLoadingSessions(true);
      setError(null);
      const res = await fetch('/api/chat', { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to load chat history');
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
      setSessions([]);
      setActiveId(null);
      return [];
    } finally {
      setLoadingSessions(false);
    }
  }, []);

  const fetchMessages = useCallback(
    async (sessionId: string) => {
      try {
        setLoadingMessages(true);
        setError(null);
        const res = await fetch(`/api/chat?sessionId=${sessionId}`, { cache: 'no-store' });
        if (res.status === 404) {
          setMessages([]);
          messagesRef.current = [];
          return;
        }
        if (!res.ok) throw new Error('Failed to load messages');
        const data = await res.json();
        const list: ChatMessageRecord[] = Array.isArray(data.messages) ? data.messages : [];
        setMessages(list);
        messagesRef.current = list;
        if (data.session) updateSessionList(data.session);
      } catch (err: any) {
        console.error('Load messages error', err);
        setError(err.message ?? 'Unable to load messages.');
        setMessages([]);
        messagesRef.current = [];
      } finally {
        setLoadingMessages(false);
      }
    },
    [updateSessionList],
  );

  const createSession = useCallback(async (): Promise<ChatSessionRecord | null> => {
    try {
      setCreatingSession(true);
      setError(null);
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create', initialMessage: GREETING }),
      });
      if (!res.ok) throw new Error('Failed to create chat session');
      const data = await res.json();
      const session: ChatSessionRecord | undefined = data.session;
      const initialMessages: ChatMessageRecord[] = Array.isArray(data.messages) ? data.messages : [];
      if (session) {
        setSessions((prev) => [session, ...prev]);
        setActiveId(session.id);
        setMessages(initialMessages);
        messagesRef.current = initialMessages;
        return session;
      }
      return null;
    } catch (err) {
      console.error('Create chat session error', err);
      setError('Unable to start a new chat right now.');
      return null;
    } finally {
      setCreatingSession(false);
    }
  }, []);

  const deleteChat = useCallback(
    async (sessionId: string) => {
      try {
        const res = await fetch(`/api/chat?sessionId=${sessionId}`, {
          method: 'DELETE',
        });

        if (res.status === 404) {
          setSessions((prev) => prev.filter((session) => session.id !== sessionId));
          if (activeId === sessionId) {
            const remaining = sessions.filter((s) => s.id !== sessionId);
            if (remaining.length > 0) {
              const nextId = remaining[0].id;
              setActiveId(nextId);
              fetchMessages(nextId);
            } else {
              setActiveId(null);
              setMessages([]);
              messagesRef.current = [];
              await createSession();
            }
          }
          return;
        }

        if (!res.ok) throw new Error('Unable to delete chat');

        setSessions((prev) => prev.filter((session) => session.id !== sessionId));

        if (activeId === sessionId) {
          const remaining = sessions.filter((s) => s.id !== sessionId);
          if (remaining.length > 0) {
            const nextId = remaining[0].id;
            setActiveId(nextId);
            fetchMessages(nextId);
          } else {
            setActiveId(null);
            setMessages([]);
            messagesRef.current = [];
            await createSession();
          }
        }
      } catch (err) {
        console.error('Delete chat error:', err);
        setError('Unable to delete this chat right now.');
      }
    },
    [activeId, sessions, fetchMessages, createSession],
  );

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
      messagesRef.current = [];
      return;
    }
    fetchMessages(activeId);
  }, [activeId, fetchMessages, isOpen]);

  const handleSend = useCallback(
    async (text: string, _attachments?: AttachmentMeta[]) => {
      const trimmed = text.trim();
      if (!trimmed) return;

      let sessionId = activeId;
      if (!sessionId) {
        const newSession = await createSession();
        sessionId = newSession?.id ?? null;
      }

      if (!sessionId) {
        return;
      }

      const tempId = `${Date.now()}-user`;
      const optimisticMessage: ChatMessageRecord = {
        id: tempId,
        chatId: sessionId,
        role: 'user',
        content: trimmed,
        createdAt: new Date().toISOString(),
      };

      const optimisticList = [...messagesRef.current, optimisticMessage];
      messagesRef.current = optimisticList;
      setMessages(optimisticList);
      setIsTyping(true);
      setError(null);

      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId, message: trimmed }),
        });

        if (!res.ok) {
          const errorBody = await res.json().catch(() => ({}));
          throw new Error(errorBody.error || 'Failed to contact AI assistant');
        }

        const data = await res.json();
        const serverMessages: ChatMessageRecord[] = Array.isArray(data.messages) ? data.messages : [];
        const serverSession: ChatSessionRecord | undefined = data.session;
        const assistant = serverMessages.find((msg) => msg.role === 'assistant');
        const persistedUser = serverMessages.find((msg) => msg.role === 'user');

        let nextList = messagesRef.current;
        const userIdx = nextList.findIndex((msg) => msg.id === tempId);
        if (userIdx !== -1 && persistedUser) {
          nextList = [...nextList];
          nextList[userIdx] = persistedUser;
        }
        if (assistant) {
          nextList = [...nextList, assistant];
        }

        messagesRef.current = nextList;
        setMessages(nextList);

        if (serverSession) {
          updateSessionList(serverSession);
        }
      } catch (err: any) {
        console.error('Chat send error:', err);
        const fallback: ChatMessageRecord = {
          id: `${Date.now()}-error`,
          chatId: sessionId,
          role: 'assistant',
          content: "Sorry, I couldn't reach the AI service right now. Please try again in a moment.",
          createdAt: new Date().toISOString(),
        };
        const failedList = [...messagesRef.current, fallback];
        messagesRef.current = failedList;
        setMessages(failedList);
        setError(err.message ?? 'Unable to reach the AI service.');
      } finally {
        setIsTyping(false);
      }
    },
    [activeId, updateSessionList, createSession],
  );

  const handleUseChat = useCallback((sessionId: string) => {
    setActiveId(sessionId);
    setHistoryOpen(false);
  }, []);

  const activeSessionTitle = useMemo(
    () => sessions.find((session) => session.id === activeId)?.title ?? 'New Chat',
    [sessions, activeId],
  );

  const historyOpenClass = historyOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0';

  return (
    <div className={`fixed inset-0 z-50 ${isOpen ? '' : 'pointer-events-none'}`}>
      <div
        onClick={onClose}
        className={`absolute inset-0 transition ${isOpen ? 'bg-black/50 backdrop-blur-[2px]' : 'bg-transparent'}`}
      />
      <aside
        className={`absolute right-0 top-0 flex h-full max-h-[100dvh] w-full transform border-l border-gray-100 bg-white shadow-2xl transition-transform duration-300 sm:max-w-md lg:max-w-3xl ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex w-full flex-col">
          <header className="flex items-center justify-between border-b border-gray-100 bg-white/95 px-4 py-3 backdrop-blur">
            <div>
              <div className="text-base font-semibold text-gray-900">Ask AI</div>
              <div className="text-xs text-gray-500">{activeSessionTitle}</div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setHistoryOpen((prev) => !prev)}
                aria-label="Toggle history"
                className="flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600 transition hover:bg-gray-50 lg:hidden"
              >
                <ClockIcon className="h-4 w-4" />
                History
              </button>
              <button
                onClick={createSession}
                disabled={creatingSession}
                className="flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <PlusIcon className="h-4 w-4" />
                New Chat
              </button>
              <button onClick={onClose} className="text-gray-400 transition hover:text-gray-600" aria-label="Close chat">
                ✕
              </button>
            </div>
          </header>

          <div className="flex flex-1 min-h-0 overflow-hidden">
            <aside
              className={`absolute inset-y-0 left-0 z-20 h-full w-full max-w-xs transform border-r border-gray-100 bg-gray-50/90 backdrop-blur transition-transform duration-300 lg:static lg:z-0 lg:max-w-[280px] ${historyOpenClass}`}
            >
              <div className="flex h-full flex-col">
                <div className="flex items-center justify-between px-4 py-3 lg:hidden">
                  <div className="text-sm font-semibold text-gray-700">History</div>
                  <button
                    onClick={() => setHistoryOpen(false)}
                    className="rounded-lg border border-gray-200 px-3 py-1 text-xs text-gray-500 transition hover:bg-gray-100"
                  >
                    Close
                  </button>
                </div>
                <div className="flex-1 space-y-2 overflow-y-auto px-3 pb-4">
                  {loadingSessions ? (
                    Array.from({ length: 3 }).map((_, idx) => (
                      <div key={idx} className="h-20 rounded-xl border border-gray-100 bg-gray-100/60 animate-pulse" />
                    ))
                  ) : sessions.length === 0 ? (
                    <div className="rounded-xl border border-gray-100 bg-white p-4 text-xs text-gray-500 shadow-sm">
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
                        <button onClick={() => handleUseChat(session.id)} className="block w-full text-left">
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

            <section className="flex min-h-0 flex-1 flex-col bg-gray-50/70">
              <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-gray-50/90 px-3 py-4 sm:px-4 sm:py-6">
                {loadingMessages ? (
                  Array.from({ length: 4 }).map((_, idx) => (
                    <div key={idx} className="h-20 w-3/4 rounded-2xl bg-white/80 shadow-sm animate-pulse" />
                  ))
                ) : (
                  <>
                    {messages.map((message) => (
                      <ChatMessage key={message.id} role={message.role} content={message.content} />
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
            </section>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default ChatDrawer;

