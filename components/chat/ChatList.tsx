"use client";

import { Bot } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRef, useEffect, ReactNode } from "react";

import { ChatMessage } from "@/components/chat/ChatMessage";
import { Skeleton } from "@/components/ui/skeleton";
import { useChat } from "@/hooks/useChat";


interface ChatListProps {
  emptyState?: ReactNode;
  className?: string;
}

export function ChatList({ emptyState, className }: ChatListProps) {
  const { messages, isLoading } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("chat");
  
  // Scroll to bottom when messages change or when loading state changes
  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  // Default empty state
  const defaultEmptyState = (
    <div className="flex h-full min-h-[calc(100vh-12rem)] flex-col items-center justify-center">
      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-muted">
        <Bot className="h-12 w-12 text-muted-foreground" />
      </div>
      <h3 className="mt-6 text-xl font-semibold">{t("empty")}</h3>
      <p className="mb-8 mt-2 text-center text-sm text-muted-foreground max-w-xs sm:max-w-sm">
        {t("startChatInstructions")}
      </p>
    </div>
  );
  
  return (
    <div 
      ref={containerRef}
      className={`flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-rounded-md scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent px-2 sm:px-4 py-6 ${className || ''}`}
    >
      <div className="max-w-3xl mx-auto">
        {messages.length === 0 ? (
          emptyState || defaultEmptyState
        ) : (
          <>
            <div className="space-y-6 pb-20">
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              {isLoading && (
                <div className="flex gap-3 py-4 max-w-[85%] sm:max-w-[75%]">
                  <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Bot className="h-5 w-5" />
                  </div>
                  <div className="flex flex-col space-y-3 w-full">
                    <div className="bg-card border border-border rounded-tl-2xl rounded-tr-2xl rounded-br-2xl p-4 space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-[85%]" />
                      <Skeleton className="h-4 w-[90%]" />
                      <div className="pt-1"></div>
                      
                      {/* List-like skeleton */}
                      <div className="pl-4 space-y-1 my-2">
                        <div className="flex items-center gap-2">
                          <Skeleton className="h-2 w-2 rounded-full" />
                          <Skeleton className="h-4 w-[80%]" />
                        </div>
                        <div className="flex items-center gap-2">
                          <Skeleton className="h-2 w-2 rounded-full" />
                          <Skeleton className="h-4 w-[70%]" />
                        </div>
                      </div>
                      
                      <Skeleton className="h-4 w-[75%]" />
                      
                      {/* Code block skeleton */}
                      <div className="bg-muted/50 p-2 rounded-md my-2">
                        <div className="space-y-1">
                          <Skeleton className="h-3 w-full" />
                          <Skeleton className="h-3 w-[70%]" />
                          <Skeleton className="h-3 w-[60%]" />
                        </div>
                      </div>
                      
                      <Skeleton className="h-4 w-[65%]" />
                    </div>
                    <span className="px-2 text-[11px] text-muted-foreground">
                      <Skeleton className="h-3 w-16 inline-block" />
                    </span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </>
        )}
      </div>
    </div>
  );
} 