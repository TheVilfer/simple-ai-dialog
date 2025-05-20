"use client";

import { cn } from "@/lib/utils";
import { Message } from "@/hooks/useChat";
import { formatDate } from "@/lib/utils";
import { User, Bot, Copy, Check } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import { useState } from "react";
import { toast } from "@/hooks/useToast";
import { useTranslations } from "next-intl";

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.type === "user";
  const [copied, setCopied] = useState(false);
  const t = useTranslations("chat");
  
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      toast({
        description: t("messageCopied"),
        variant: "success",
        duration: 2000,
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy message:", error);
    }
  };
  
  return (
    <div className={cn(
      "flex w-full gap-2 sm:gap-3 group",
      isUser ? "justify-end" : "justify-start"
    )}>
      {!isUser && (
        <div className="flex h-6 w-6 sm:h-8 sm:w-8 shrink-0 select-none items-center justify-center rounded-full bg-primary/10 text-primary">
          <Bot className="h-4 w-4 sm:h-5 sm:w-5" />
        </div>
      )}
      
      <div className={cn(
        "flex flex-col max-w-[90%] sm:max-w-[85%] md:max-w-[75%] relative",
        isUser ? "items-end" : "items-start"
      )}>
        <div className={cn(
          "px-3 py-2 sm:px-4 sm:py-3 rounded-xl sm:rounded-2xl text-xs sm:text-sm shadow-sm overflow-hidden group",
          isUser 
            ? "bg-primary text-primary-foreground rounded-br-none" 
            : "bg-card border border-border rounded-bl-none"
        )}>
          {isUser ? (
            <p className="whitespace-pre-wrap break-words leading-relaxed">
              {message.content}
            </p>
          ) : (
            <div className="markdown whitespace-pre-wrap break-words leading-relaxed">
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw, [rehypeHighlight, { detect: true }]]}
                components={{
                  pre: (props) => (
                    <pre className="bg-muted/50 p-1 sm:p-2 rounded-md overflow-auto my-2 text-[10px] sm:text-xs" {...props} />
                  ),
                  code: ({ className, children, ...props }) => {
                    const match = /language-(\w+)/.exec(className || '');
                    return !className || !match ? (
                      <code className="bg-muted/50 px-1 py-0.5 rounded-sm font-mono text-[10px] sm:text-xs" {...props}>
                        {children}
                      </code>
                    ) : (
                      <code className={`${className} font-mono text-[10px] sm:text-xs`} {...props}>
                        {children}
                      </code>
                    );
                  },
                  a: (props) => (
                    <a className="text-primary underline" target="_blank" rel="noopener noreferrer" {...props} />
                  ),
                  ul: (props) => (
                    <ul className="list-disc pl-4 sm:pl-6 my-2" {...props} />
                  ),
                  ol: (props) => (
                    <ol className="list-decimal pl-4 sm:pl-6 my-2" {...props} />
                  ),
                  li: (props) => (
                    <li className="my-1" {...props} />
                  ),
                  blockquote: (props) => (
                    <blockquote className="border-l-2 sm:border-l-4 border-muted-foreground/20 pl-2 sm:pl-3 italic my-2" {...props} />
                  ),
                  hr: (props) => (
                    <hr className="border-muted my-3 sm:my-4" {...props} />
                  ),
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          )}
          <button 
            onClick={copyToClipboard}
            className={cn(
              "absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-sm hover:bg-background/20",
              isUser ? "text-primary-foreground/70 hover:text-primary-foreground" : "text-foreground/50 hover:text-foreground"
            )}
            aria-label={t("copyMessage")}
            title={t("copyMessage")}
          >
            {copied ? (
              <Check className="h-3 w-3 sm:h-4 sm:w-4" />
            ) : (
              <Copy className="h-3 w-3 sm:h-4 sm:w-4" />
            )}
          </button>
        </div>
        <span className="px-2 text-[10px] sm:text-[11px] text-muted-foreground mt-1">
          {formatDate(message.timestamp)}
        </span>
      </div>
      
      {isUser && (
        <div className="flex h-6 w-6 sm:h-8 sm:w-8 shrink-0 select-none items-center justify-center rounded-full bg-primary/10 text-primary">
          <User className="h-4 w-4 sm:h-5 sm:w-5" />
        </div>
      )}
    </div>
  );
} 