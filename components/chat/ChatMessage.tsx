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
import Image from "next/image";

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
      "flex w-full gap-2 sm:gap-3 md:gap-4 group px-1 sm:px-2",
      isUser ? "justify-end" : "justify-start"
    )}>
      {!isUser && (
        <div className="flex h-6 w-6 sm:h-7 md:h-8 sm:w-7 md:w-8 shrink-0 select-none items-center justify-center rounded-full bg-primary/10 text-primary">
          <Bot className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5" />
        </div>
      )}
      
      <div className={cn(
        "flex flex-col max-w-[80%] xs:max-w-[85%] sm:max-w-[80%] md:max-w-[75%] lg:max-w-[70%] relative",
        isUser ? "items-end" : "items-start"
      )}>
        <div className={cn(
          "px-2.5 py-2 xs:px-3 sm:px-3.5 md:px-4 xs:py-2.5 sm:py-3 rounded-lg xs:rounded-xl md:rounded-2xl text-[11px] xs:text-xs sm:text-sm shadow-sm overflow-hidden group",
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
                    <pre className="bg-muted/50 p-1 xs:p-1.5 sm:p-2 rounded-md overflow-auto my-1.5 sm:my-2 text-[9px] xs:text-[10px] sm:text-xs" {...props} />
                  ),
                  code: ({ className, children, ...props }) => {
                    const match = /language-(\w+)/.exec(className || '');
                    return !className || !match ? (
                      <code className="bg-muted/50 px-1 py-0.5 rounded-sm font-mono text-[9px] xs:text-[10px] sm:text-xs" {...props}>
                        {children}
                      </code>
                    ) : (
                      <code className={`${className} font-mono text-[9px] xs:text-[10px] sm:text-xs`} {...props}>
                        {children}
                      </code>
                    );
                  },
                  a: (props) => (
                    <a 
                      className="text-primary underline break-words" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      {...props} 
                    />
                  ),
                  ul: (props) => (
                    <ul className="list-disc pl-3 xs:pl-4 sm:pl-5 md:pl-6 my-1.5 sm:my-2" {...props} />
                  ),
                  ol: (props) => (
                    <ol className="list-decimal pl-3 xs:pl-4 sm:pl-5 md:pl-6 my-1.5 sm:my-2" {...props} />
                  ),
                  li: (props) => (
                    <li className="my-0.5 xs:my-1" {...props} />
                  ),
                  blockquote: (props) => (
                    <blockquote className="border-l-2 sm:border-l-3 md:border-l-4 border-muted-foreground/20 pl-1.5 xs:pl-2 sm:pl-3 italic my-1.5 xs:my-2 sm:my-3" {...props} />
                  ),
                  hr: (props) => (
                    <hr className="border-muted my-2 sm:my-3 md:my-4" {...props} />
                  ),
                  img: ({ src, alt }) => {
                    if (!src || typeof src !== 'string') {
                      return (
                        <span className="text-muted-foreground text-xs">
                          [Image cannot be displayed]
                        </span>
                      );
                    }
                    
                    try {
                      const url = new URL(src);
                      if (url.protocol === 'http:' || url.protocol === 'https:') {
                        return (
                          <div className="relative max-w-full h-auto my-2 rounded-md overflow-hidden">
                            <Image
                              src={src}
                              alt={alt || 'Image'}
                              width={500}
                              height={300}
                              className="max-w-full h-auto rounded-md"
                              style={{ objectFit: 'contain' }}
                              priority={false}
                            />
                          </div>
                        );
                      }
                    } catch {
                      // URL is invalid, don't attempt to use Next/Image
                    }
                    
                    return (
                      <span className="text-muted-foreground text-xs">
                        [Image cannot be displayed: invalid URL]
                      </span>
                    );
                  },
                  table: (props) => (
                    <div className="overflow-x-auto my-2">
                      <table className="min-w-full border-collapse text-[9px] xs:text-[10px] sm:text-xs" {...props} />
                    </div>
                  ),
                  th: (props) => (
                    <th className="border border-border px-1 py-0.5 sm:px-2 sm:py-1 bg-muted/30" {...props} />
                  ),
                  td: (props) => (
                    <td className="border border-border px-1 py-0.5 sm:px-2 sm:py-1" {...props} />
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
              "absolute top-1.5 right-1.5 xs:top-2 xs:right-2 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity p-0.5 xs:p-1 rounded-sm hover:bg-background/20",
              isUser ? "text-primary-foreground/70 hover:text-primary-foreground" : "text-foreground/50 hover:text-foreground"
            )}
            aria-label={t("copyMessage")}
            title={t("copyMessage")}
            tabIndex={0}
          >
            {copied ? (
              <Check className="h-2.5 w-2.5 xs:h-3 xs:w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4" />
            ) : (
              <Copy className="h-2.5 w-2.5 xs:h-3 xs:w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4" />
            )}
          </button>
        </div>
        <span className="px-1 sm:px-2 text-[9px] xs:text-[10px] sm:text-[11px] text-muted-foreground mt-0.5 sm:mt-1">
          {formatDate(message.timestamp)}
        </span>
      </div>
      
      {isUser && (
        <div className="flex h-6 w-6 sm:h-7 md:h-8 sm:w-7 md:w-8 shrink-0 select-none items-center justify-center rounded-full bg-primary/10 text-primary">
          <User className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5" />
        </div>
      )}
    </div>
  );
} 