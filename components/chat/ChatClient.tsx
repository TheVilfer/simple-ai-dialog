"use client";

import { useEffect } from "react";
import { ChatList } from "@/components/chat/ChatList";
import { ChatInput } from "@/components/chat/ChatInput";
import { Button } from "@/components/ui/button";
import { PlusIcon, ArrowLeftIcon } from "lucide-react";
import { useChat } from "@/hooks/useChat";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Link from "next/link";
import { ThemeToggleSimple } from "@/components/ui/theme-toggle";

export default function ChatClient() {
  const { clearMessages } = useChat();
  
  // Reset chat messages when component mounts
  useEffect(() => {
    clearMessages();
  }, [clearMessages]);
  
  return (
    <ProtectedRoute>
      <div className="flex h-screen flex-col max-w-5xl mx-auto overflow-hidden">
        <header className="sticky top-0 z-10 flex items-center justify-between border-b bg-background p-4">
          <div className="flex items-center gap-2">
            <Link 
              href="/profile" 
              className="mr-2 rounded-md p-1 hover:bg-muted transition-colors"
              aria-label="Back to profile"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </Link>
            <h1 className="text-xl font-bold">Чат</h1>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggleSimple />
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => clearMessages()}
              title="Новый чат"
            >
              <PlusIcon className="h-4 w-4" />
            </Button>
          </div>
        </header>
        
        <div className="flex flex-1 flex-col overflow-hidden relative">
          <ChatList />
          <div className="sticky bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm">
            <ChatInput />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}