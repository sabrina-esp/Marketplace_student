'use client';

import { useState, useEffect } from 'react';
import ChatWindow from '../components/ChatWindow';

interface Conversation {
  roomId: string;
  serviceId: string;
  lastMessage: string;
  senderName: string;
  senderId: string;
  receiverName: string;
  receiverId: string;
  timestamp: Date;
  unreadCount: number;
}

interface UnreadData {
  totalUnread: number;
  conversations: Conversation[];
}

export default function MessagesPage() {
  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [totalUnread, setTotalUnread] = useState(0);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [showChatWindow, setShowChatWindow] = useState(false);
  const [currentUserId, setCurrentUserId] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  // Fetch current user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/auth/is');
        if (response.ok) {
          const data = await response.json();
          setCurrentUserId(data.userId);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };
    fetchUser();
  }, []);

  // Fetch all conversations (both read and unread)
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/marketplace/chat/conversations');
        
        if (!response.ok) {
          throw new Error('Failed to fetch conversations');
        }

        const data: UnreadData = await response.json();
        setConversations(data.conversations || []);
        setTotalUnread(data.totalUnread || 0);
      } catch (error) {
        console.error('Error fetching conversations:', error);
      } finally {
        setLoading(false);
      }
    };

    if (currentUserId) {
      fetchConversations();
    }
  }, [currentUserId, refreshKey]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshKey(prev => prev + 1);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleConversationClick = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    setShowChatWindow(true);
  };

  const handleCloseChatWindow = () => {
    setShowChatWindow(false);
    setSelectedConversation(null);
    // Refresh unread counts after closing chat
    setRefreshKey(prev => prev + 1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-lightpink to-white p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center text-lightgrey">Loading messages...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-lightpink to-white p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-purple mb-2">Messages</h1>
          <p className="text-lightgrey">
            {totalUnread > 0 
              ? `You have ${totalUnread} unread message${totalUnread > 1 ? 's' : ''}`
              : 'No unread messages'}
          </p>
        </div>

        {/* Conversations List */}
        {conversations.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-lightgrey">No messages yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {conversations.map((conversation) => {
              // Determine who the "other person" is in this conversation
              const isUserSender = conversation.senderId === currentUserId;
              const otherPersonName = isUserSender ? conversation.receiverName : conversation.senderName;
              const otherPersonId = isUserSender ? conversation.receiverId : conversation.senderId;

              return (
                <div
                  key={conversation.roomId}
                  onClick={() => handleConversationClick(conversation)}
                  className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-all hover:scale-[1.02]"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-purple">
                          {otherPersonName}
                        </h3>
                        {conversation.unreadCount > 0 && (
                          <span className="bg-orange text-white text-xs font-bold px-2 py-1 rounded-full">
                            {conversation.unreadCount}
                          </span>
                        )}
                      </div>
                      <p className="text-lightgrey text-sm mb-2 line-clamp-2">
                        {isUserSender ? 'You: ' : ''}{conversation.lastMessage}
                      </p>
                      <p className="text-xs text-lightgrey">
                        {new Date(conversation.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Chat Window Modal */}
        {showChatWindow && selectedConversation && (
          <ChatWindow
            serviceId={selectedConversation.serviceId}
            serviceTitle="Service Chat"
            ownerId={selectedConversation.senderId === currentUserId ? selectedConversation.receiverId : selectedConversation.senderId}
            ownerName={selectedConversation.senderId === currentUserId ? selectedConversation.receiverName : selectedConversation.senderName}
            onClose={handleCloseChatWindow}
          />
        )}
      </div>
    </div>
  );
}
