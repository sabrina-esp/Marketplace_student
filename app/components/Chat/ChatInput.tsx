"use client";
import { useMemo, useRef, useState } from 'react';
import { AttachmentMeta } from '../../../lib/chatStorage';

type Props = {
  onSend: (text: string, attachments?: AttachmentMeta[]) => void;
};

const MAX_ATTACHMENTS = 5;

const ChatInput = ({ onSend }: Props) => {
  const [text, setText] = useState('');
  const [attachments, setAttachments] = useState<AttachmentMeta[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);
  const [isRecording, setIsRecording] = useState(false);

  const attachmentsLeft = useMemo(() => Math.max(0, MAX_ATTACHMENTS - attachments.length), [attachments.length]);

  const handleSend = () => {
    const value = text.trim();
    if (!value && attachments.length === 0) return;
    onSend(value, attachments);
    setText('');
    setAttachments([]);
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files) return;
    const selected = Array.from(files).slice(0, attachmentsLeft);

    const mapped = await Promise.all(
      selected.map(
        (file) =>
          new Promise<AttachmentMeta>((resolve) => {
            if (file.type.startsWith('image/')) {
              const reader = new FileReader();
              reader.onload = () => {
                resolve({
                  name: file.name,
                  type: file.type,
                  size: file.size,
                  previewDataUrl: typeof reader.result === 'string' ? reader.result : null,
                });
              };
              reader.readAsDataURL(file);
            } else {
              resolve({
                name: file.name,
                type: file.type,
                size: file.size,
                previewDataUrl: null,
              });
            }
          }),
      ),
    );
    setAttachments((prev) => [...prev, ...mapped].slice(0, MAX_ATTACHMENTS));
    if (fileRef.current) fileRef.current.value = '';
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleVoice = () => {
    const w = window as any;
    const SpeechRecognition = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition not supported in this browser');
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsRecording(true);
    recognition.onend = () => setIsRecording(false);
    recognition.onerror = () => setIsRecording(false);

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setText((current) => (current ? `${current} ${transcript}` : transcript));
    };

    recognition.start();
  };

  return (
    <>
      <div className="flex flex-col gap-2 border-t border-gray-200 bg-white/80 backdrop-blur px-3 py-2">
        {attachments.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {attachments.map((a, idx) => (
              <div
                key={`${a.name}-${idx}`}
                className="group flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs text-gray-700 shadow-sm"
              >
                {a.previewDataUrl && a.type.startsWith('image/') ? (
                  <img src={a.previewDataUrl} alt={a.name} className="h-8 w-8 rounded object-cover border border-gray-100" />
                ) : (
                  <span className="font-semibold text-purple-600">{a.name.split('.').pop()}</span>
                )}
                <div className="max-w-[140px] truncate">{a.name}</div>
                <button
                  onClick={() => removeAttachment(idx)}
                  className="rounded-full border border-gray-200 px-1.5 text-gray-400 transition hover:border-red-200 hover:text-red-500"
                  aria-label="Remove attachment"
                  type="button"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
        <div className="flex items-center gap-2">
          <input
            ref={fileRef}
            type="file"
            multiple
            accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.txt"
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
          <button
            onClick={() => fileRef.current?.click()}
            type="button"
            className="flex items-center justify-center rounded-lg border border-gray-200 px-3 py-2 text-gray-700 hover:bg-gray-50 transition"
            disabled={attachmentsLeft === 0}
          >
            📎
          </button>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Ask AI for recommendations..."
            rows={1}
            className="flex-1 resize-none rounded-lg border border-gray-200 px-3 py-2 text-sm leading-relaxed focus:border-purple focus:outline-none focus:ring-2 focus:ring-purple/30"
          />
          <button
            onClick={handleVoice}
            type="button"
            className={`flex items-center justify-center rounded-lg border border-gray-200 px-3 py-2 text-gray-700 transition hover:bg-gray-50 ${isRecording ? 'border-purple text-purple-600 bg-purple/5' : ''}`}
          >
            🎤
          </button>
          <button
            onClick={handleSend}
            type="button"
            className="rounded-lg bg-purple px-4 py-2 font-semibold text-white shadow hover:opacity-90 transition"
          >
            Send
          </button>
        </div>
        {attachmentsLeft < MAX_ATTACHMENTS && (
          <div className="text-[11px] text-gray-400">
            {attachmentsLeft} attachment{attachmentsLeft === 1 ? '' : 's'} remaining
          </div>
        )}
      </div>
    </>
  );
};

export default ChatInput;


