"use client";

import { useState } from 'react';
import { MOCK_CONVERSATIONS, MOCK_MESSAGES, MOCK_USERS } from '../data/mock-data';
import { Message } from '../types';
import { ChatLayout } from './chat-layout';
import { ChatSidebar } from './chat-sidebar';
import { ChatWindow } from './chat-window';

export function ChatContainer() {
  const [selectedId, setSelectedId] = useState<string | undefined>(MOCK_CONVERSATIONS[0].id);
  const [messages, setMessages] = useState<Record<string, Message[]>>(MOCK_MESSAGES);

  const selectedConversation = MOCK_CONVERSATIONS.find(c => c.id === selectedId);
  const currentMessages = selectedId ? (messages[selectedId] || []) : [];

  const handleSendMessage = (content: string) => {
    if (!selectedId) return;

    const newMessage: Message = {
      id: `new-${Date.now()}`,
      senderId: MOCK_USERS.me.id,
      content,
      timestamp: new Date().toISOString(),
      status: 'sent',
      type: 'text'
    };

    setMessages(prev => ({
      ...prev,
      [selectedId]: [...(prev[selectedId] || []), newMessage]
    }));
  };

  return (
    <div className="h-full flex flex-col bg-background relative overflow-hidden">
       {/* Decorative Gradient Background */}
      <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] animate-pulse-horizontal" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[100px]" />
      </div>

      <ChatLayout className="relative z-10">
        <ChatSidebar
          conversations={MOCK_CONVERSATIONS}
          selectedId={selectedId}
          onSelect={setSelectedId}
          className={selectedId ? "hidden md:flex" : "flex w-full md:w-96"}
        />
        <ChatWindow
          conversation={selectedConversation}
          messages={currentMessages}
          currentUserId={MOCK_USERS.me.id}
          onSendMessage={handleSendMessage}
          onBack={() => setSelectedId(undefined)}
          className={!selectedId ? "hidden md:flex" : "flex"}
        />
      </ChatLayout>
    </div>
  );
}
