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
      "flex w-full group px-1 sm:px-2 md:px-3 py-1 sm:py-1.5 md:py-2",
      isUser 
        ? "gap-1.5 sm:gap-2 md:gap-3 justify-end" 
        : "gap-2 sm:gap-3 md:gap-4 justify-start"
    )}>
      {!isUser && (
        <div className="flex h-5 w-5 sm:h-6 md:h-7 sm:w-6 md:w-7 shrink-0 select-none items-center justify-center rounded-full bg-primary/10 text-primary">
          <Bot className="h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-4 md:w-4" />
        </div>
      )}
      
      <div className={cn(
        "flex flex-col relative",
        isUser 
          ? "max-w-[75%] xs:max-w-[80%] sm:max-w-[70%] items-end" 
          : "max-w-[85%] xs:max-w-[90%] sm:max-w-[85%] md:max-w-[80%] lg:max-w-[75%] items-start"
      )}>
        <div className={cn(
          "rounded-md xs:rounded-lg md:rounded-xl text-[10px] xs:text-[11px] sm:text-xs shadow-sm overflow-hidden group",
          isUser 
            ? "bg-primary text-primary-foreground rounded-br-none px-2 py-1.5 xs:px-2.5 sm:px-3 xs:py-2 sm:py-2.5" 
            : "bg-card border border-border rounded-bl-none px-2.5 py-2 xs:px-3 sm:px-4 md:px-4.5 xs:py-2.5 sm:py-3"
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
                    <pre className="bg-muted/50 p-1.5 xs:p-2 sm:p-3 rounded-md overflow-auto my-2 sm:my-2.5 md:my-3 text-[8px] xs:text-[9px] sm:text-[10px]" {...props} />
                  ),
                  code: ({ className, children, ...props }) => {
                    const match = /language-(\w+)/.exec(className || '');
                    return !className || !match ? (
                      <code className="bg-muted/50 px-1 py-0.5 rounded-sm font-mono text-[8px] xs:text-[9px] sm:text-[10px]" {...props}>
                        {children}
                      </code>
                    ) : (
                      <code className={`${className} font-mono text-[8px] xs:text-[9px] sm:text-[10px]`} {...props}>
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
                    <ul className="list-disc pl-4 xs:pl-5 sm:pl-6 my-1.5 sm:my-2 md:my-2.5" {...props} />
                  ),
                  ol: (props) => (
                    <ol className="list-decimal pl-4 xs:pl-5 sm:pl-6 my-1.5 sm:my-2 md:my-2.5" {...props} />
                  ),
                  li: (props) => (
                    <li className="my-1 xs:my-1.5" {...props} />
                  ),
                  p: (props) => (
                    <p className="my-1.5 sm:my-2" {...props} />
                  ),
                  blockquote: (props) => (
                    <blockquote className="border-l-2 sm:border-l-3 border-muted-foreground/20 pl-2 xs:pl-3 sm:pl-4 italic my-2 xs:my-2.5 sm:my-3" {...props} />
                  ),
                  hr: (props) => (
                    <hr className="border-muted my-2 sm:my-2.5 md:my-3" {...props} />
                  ),
                  img: ({ src, alt }) => {
                    if (!src || typeof src !== 'string') {
                      return (
                        <span className="text-muted-foreground text-[10px]">
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
                      <span className="text-muted-foreground text-[10px]">
                        [Image cannot be displayed: invalid URL]
                      </span>
                    );
                  },
                  table: (props) => (
                    <div className="overflow-x-auto my-2">
                      <table className="min-w-full border-collapse text-[8px] xs:text-[9px] sm:text-[10px]" {...props} />
                    </div>
                  ),
                  th: (props) => (
                    <th className="border border-border px-1.5 py-1 sm:px-2 sm:py-1.5 bg-muted/30" {...props} />
                  ),
                  td: (props) => (
                    <td className="border border-border px-1.5 py-1 sm:px-2 sm:py-1.5" {...props} />
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
              "absolute opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity rounded-sm hover:bg-background/20",
              isUser 
                ? "top-1 right-1 xs:top-1.5 xs:right-1.5 sm:top-2 sm:right-2 p-0.5 text-primary-foreground/70 hover:text-primary-foreground" 
                : "top-1.5 right-1.5 xs:top-2 xs:right-2 sm:top-2.5 sm:right-2.5 p-0.5 xs:p-1 text-foreground/50 hover:text-foreground"
            )}
            aria-label={t("copyMessage")}
            title={t("copyMessage")}
            tabIndex={0}
          >
            {copied ? (
              <Check className={cn(
                isUser 
                  ? "h-2 w-2 xs:h-2.5 xs:w-2.5 sm:h-3 sm:w-3" 
                  : "h-2.5 w-2.5 xs:h-3 xs:w-3 sm:h-3.5 sm:w-3.5"
              )} />
            ) : (
              <Copy className={cn(
                isUser 
                  ? "h-2 w-2 xs:h-2.5 xs:w-2.5 sm:h-3 sm:w-3" 
                  : "h-2.5 w-2.5 xs:h-3 xs:w-3 sm:h-3.5 sm:w-3.5"
              )} />
            )}
          </button>
        </div>
        <span className={cn(
          "text-[8px] xs:text-[9px] sm:text-[10px] text-muted-foreground",
          isUser ? "px-1 sm:px-1.5 mt-0.5 sm:mt-1" : "px-1.5 sm:px-2 mt-1 sm:mt-1.5"
        )}>
          {formatDate(message.timestamp)}
        </span>
      </div>
      
      {isUser && (
        <div className="flex h-5 w-5 sm:h-6 md:h-7 sm:w-6 md:w-7 shrink-0 select-none items-center justify-center rounded-full bg-primary/10 text-primary">
          <User className="h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-4 md:w-4" />
        </div>
      )}
    </div>
  );
} 