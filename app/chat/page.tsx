import ChatClient from '@/components/chat/ChatClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Chat',
  description: 'Chat with AI',
};

export default function ChatPage() {
  return <ChatClient />;
} 