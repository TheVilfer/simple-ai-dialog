"use client";

import { PlusIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, ReactNode } from "react";

import { ChatInput } from "@/components/chat/ChatInput";
import { ChatList } from "@/components/chat/ChatList";
import { Button } from "@/components/ui/button";
import { useChat } from "@/hooks/useChat";


interface ChatProps {
  title?: string;
  headerRight?: ReactNode;
  onNewChat?: () => void;
  customHandler?: (message: string) => Promise<void>;
  clearOnMount?: boolean;
}

export function Chat({
  title,
  headerRight,
  onNewChat,
  customHandler,
  clearOnMount = true,
}: ChatProps) {
  const { clearMessages } = useChat();
  const t = useTranslations("common");

  const handleNewChat = () => {
    clearMessages();
    if (onNewChat) {
    {
  }
      onNewChat();
    }
  };
  
  // Reset chat messages when component mounts if clearOnMount is true
  useEffect(() => {
    if (clearOnMount) {
    {
  }
      clearMessages();
    }
  }, [clearMessages, clearOnMount]);
  
  return (
    <div className="flex h-full flex-col max-w-5xl mx-auto overflow-hidden">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b bg-background p-4">
        <h1 className="text-xl font-bold">{title || t("chat")}</h1>
        <div className="flex gap-2 items-center">
          {headerRight}
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleNewChat}
            title={t("newChat")}
            aria-label={t("newChat")}
          >
            <PlusIcon className="h-4 w-4" />
          </Button>
        </div>
      </header>
      
      <div className="flex flex-1 flex-col overflow-hidden relative">
        <ChatList />
        <div className="sticky bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm">
          <ChatInput customHandler={customHandler} />
        </div>
      </div>
    </div>
  );
} 