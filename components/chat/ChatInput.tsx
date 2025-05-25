"use client";

import { SendIcon, CornerDownLeftIcon, HelpCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState, FormEvent, useRef, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useChat } from "@/hooks/useChat";



interface ChatInputProps {
  placeholder?: string;
  customHandler?: ((message: string) => Promise<void>) | undefined;
  className?: string;
}

export function ChatInput({ 
  placeholder, 
  customHandler,
  className
}: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const { addMessage, simulateAiResponse, isLoading } = useChat();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const t = useTranslations("chat");
  
  // Auto-resize textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
    {
  }
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [message]);
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    const trimmedMessage = message.trim();
    if (!trimmedMessage || isLoading) {
    return;
  }
    
    // Clear input
    setMessage("");
    if (textareaRef.current) {
    {
  }
      textareaRef.current.style.height = 'auto';
    }
    
    if (customHandler) {
    {
  }
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
    {
  }
      e.preventDefault();
      handleSubmit(e as unknown as FormEvent);
    }
  };
  
  const defaultPlaceholder = isLoading ? t("waitingResponse") : t("typeMessage");
  
  return (
    <form 
      onSubmit={handleSubmit}
      className={`flex flex-col gap-1 border-t p-2 sm:p-4 w-full ${className || ''}`}
    >
      <div className="flex justify-between items-center text-[10px] text-muted-foreground px-2">
        <div className="flex items-center">
          {isFocused && (
            <div className="flex items-center">
              <CornerDownLeftIcon className="h-3 w-3 mr-1" />
              <span>{t("sendTip")}</span>
            </div>
          )}
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center cursor-help">
                <HelpCircle className="h-3 w-3 mr-1" />
                <span>{t("markdownSupported")}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-xs">
              <p className="text-xs">
                <strong>**Bold**</strong>, <em>*Italic*</em>, <code>`Code`</code>, ```Code blocks```, - Lists, # Headings, and more.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="flex items-end gap-1 sm:gap-2">
        <div className="relative flex-1 overflow-hidden">
          <textarea
            ref={textareaRef}
            placeholder={placeholder || defaultPlaceholder}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="flex w-full resize-none rounded-md border border-input bg-background px-2 sm:px-3 py-2 text-xs sm:text-sm min-h-[40px] sm:min-h-[44px] max-h-[120px] sm:max-h-[150px] ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isLoading}
            rows={1}
            aria-label={t("typeMessage")}
          />
        </div>
        
        <Button 
          type="submit" 
          size="icon"
          className="h-9 w-9 sm:h-10 sm:w-10 rounded-full flex-shrink-0"
          disabled={!message.trim() || isLoading}
          aria-label={t("sendMessage")}
          title={t("sendMessage")}
        >
          {isLoading ? (
            <Skeleton className="h-4 w-4 sm:h-5 sm:w-5 rounded-full" />
          ) : (
            <SendIcon className="h-4 w-4 sm:h-5 sm:w-5" />
          )}
        </Button>
      </div>
    </form>
  );
} 