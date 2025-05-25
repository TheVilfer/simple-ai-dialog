import { Metadata } from 'next';

import ChatClient from '@/components/chat/ChatClient';


export const metadata: Metadata = {
  title: 'Chat',
  description: 'Chat with AI',
};

export default function ChatPage() {
  return <ChatClient />;
} 