export type AttachmentMeta = {
  name: string;
  type: string;
  size?: number;
  previewDataUrl?: string | null;
};

export type ChatMessageRecord = {
  id: string;
  chatId: string;
  role: 'user' | 'assistant';
  content: string;
  attachments?: AttachmentMeta[];
  createdAt: string;
};

export type ChatSessionRecord = {
  id: string;
  title: string;
  lastMessageSnippet?: string | null;
  createdAt: string;
  updatedAt: string;
};

