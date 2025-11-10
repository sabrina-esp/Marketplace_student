"use client";
import { Fragment } from 'react';
import { AttachmentMeta } from '../../../lib/chatStorage';

type Props = {
  role: 'user' | 'assistant';
  content: string;
  attachments?: AttachmentMeta[];
  isTyping?: boolean;
};

const ChatMessage = ({ role, content, attachments = [], isTyping = false }: Props) => {
  const isUser = role === 'user';
  const paragraphs = content ? content.split('\n\n') : [];

  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[90%] sm:max-w-[80%] space-y-3 rounded-2xl px-3 py-2.5 text-sm leading-relaxed shadow-sm break-words ${
          isUser ? 'bg-purple text-white' : 'bg-white text-gray-800 border border-gray-100'
        }`}
      >
        <div className="space-y-2">
          {isTyping ? (
            <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-gray-500">
              Assistant is typing
              <span className="flex space-x-1">
                <span className="h-1 w-1 animate-bounce rounded-full bg-gray-400" />
                <span className="h-1 w-1 animate-bounce rounded-full bg-gray-400 [animation-delay:0.15s]" />
                <span className="h-1 w-1 animate-bounce rounded-full bg-gray-400 [animation-delay:0.3s]" />
              </span>
            </div>
          ) : (
            paragraphs.map((paragraph, idx) => (
              <Fragment key={idx}>
                <p className="whitespace-pre-wrap">{paragraph}</p>
              </Fragment>
            ))
          )}
        </div>
        {attachments.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {attachments.map((a, idx) => (
              <div
                key={`${a.name}-${idx}`}
                className={`flex items-center gap-2 rounded-xl border ${
                  isUser ? 'border-white/40 bg-white/10 text-white/90' : 'border-gray-200 bg-gray-50 text-gray-700'
                } px-3 py-2 text-xs`}
              >
                {a.previewDataUrl && a.type?.startsWith('image/') ? (
                  <img src={a.previewDataUrl} alt={a.name} className="h-10 w-10 rounded-lg object-cover border border-gray-100 bg-white" />
                ) : (
                  <span className="font-semibold uppercase text-purple-500">{a.name.split('.').pop()}</span>
                )}
                <div className="max-w-[140px] truncate">{a.name}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;


