"use client";

import { useState, FormEvent, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { SendIcon } from "lucide-react";
import { useChat } from "@/hooks/useChat";
import { Skeleton } from "@/components/ui/skeleton";

interface ChatInputProps {
  placeholder?: string;
  customHandler?: (message: string) => Promise<void>;
  className?: string;
}

export function ChatInput({ 
  placeholder, 
  customHandler,
  className
}: ChatInputProps) {
  const [message, setMessage] = useState("");
  const { addMessage, simulateAiResponse, isLoading } = useChat();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Auto-resize textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [message]);
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    const trimmedMessage = message.trim();
    if (!trimmedMessage || isLoading) return;
    
    // Clear input
    setMessage("");
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
    
    if (customHandler) {
      // Use custom handler if provided
      await customHandler(trimmedMessage);
    } else {
      // Default behavior
      addMessage(trimmedMessage, "user");
      await simulateAiResponse(trimmedMessage);
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as FormEvent);
    }
  };
  
  const defaultPlaceholder = isLoading ? "Ожидание ответа..." : "Написать сообщение...";
  
  return (
    <form 
      onSubmit={handleSubmit}
      className={`flex items-end gap-2 border-t p-3 sm:p-4 mx-auto max-w-3xl w-full ${className || ''}`}
    >
      <div className="relative flex-1 overflow-hidden">
        <textarea
          ref={textareaRef}
          placeholder={placeholder || defaultPlaceholder}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          className="flex w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[44px] max-h-[150px] ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={isLoading}
          rows={1}
        />
      </div>
      
      <Button 
        type="submit" 
        size="icon"
        className="h-10 w-10 rounded-full flex-shrink-0"
        disabled={!message.trim() || isLoading}
      >
        {isLoading ? (
          <Skeleton className="h-5 w-5 rounded-full" />
        ) : (
          <SendIcon className="h-5 w-5" />
        )}
      </Button>
    </form>
  );
} 