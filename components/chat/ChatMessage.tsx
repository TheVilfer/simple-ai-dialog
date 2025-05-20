"use client";

import { cn } from "@/lib/utils";
import { Message } from "@/hooks/useChat";
import { formatDate } from "@/lib/utils";
import { User, Bot } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.type === "user";
  
  return (
    <div className={cn(
      "flex w-full gap-3",
      isUser ? "justify-end" : "justify-start"
    )}>
      {!isUser && (
        <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full bg-primary/10 text-primary">
          <Bot className="h-5 w-5" />
        </div>
      )}
      
      <div className={cn(
        "flex flex-col max-w-[85%] sm:max-w-[75%]",
        isUser ? "items-end" : "items-start"
      )}>
        <div className={cn(
          "px-4 py-3 rounded-2xl text-sm shadow-sm overflow-hidden",
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
                    <pre className="bg-muted/50 p-2 rounded-md overflow-auto my-2" {...props} />
                  ),
                  code: ({ className, children, ...props }) => {
                    const match = /language-(\w+)/.exec(className || '');
                    return !className || !match ? (
                      <code className="bg-muted/50 px-1 py-0.5 rounded-sm font-mono text-xs" {...props}>
                        {children}
                      </code>
                    ) : (
                      <code className={`${className} font-mono text-xs`} {...props}>
                        {children}
                      </code>
                    );
                  },
                  a: (props) => (
                    <a className="text-primary underline" target="_blank" rel="noopener noreferrer" {...props} />
                  ),
                  ul: (props) => (
                    <ul className="list-disc pl-6 my-2" {...props} />
                  ),
                  ol: (props) => (
                    <ol className="list-decimal pl-6 my-2" {...props} />
                  ),
                  li: (props) => (
                    <li className="my-1" {...props} />
                  ),
                  blockquote: (props) => (
                    <blockquote className="border-l-4 border-muted-foreground/20 pl-3 italic my-2" {...props} />
                  ),
                  hr: (props) => (
                    <hr className="border-muted my-4" {...props} />
                  ),
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          )}
        </div>
        <span className="px-2 text-[11px] text-muted-foreground mt-1">
          {formatDate(message.timestamp)}
        </span>
      </div>
      
      {isUser && (
        <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full bg-primary/10 text-primary">
          <User className="h-5 w-5" />
        </div>
      )}
    </div>
  );
} 