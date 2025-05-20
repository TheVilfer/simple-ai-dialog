"use client";

import { useEffect, useState } from "react";
import { ChatList } from "@/components/chat/ChatList";
import { ChatInput } from "@/components/chat/ChatInput";
import { Button } from "@/components/ui/button";
import { PlusIcon, ArrowLeftIcon } from "lucide-react";
import { useChat } from "@/hooks/useChat";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Link from "next/link";
import { ThemeToggleSimple } from "@/components/ui/theme-toggle";
import { LanguageSwitcherSimple } from "@/components/ui/language-switcher";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function ChatClient() {
  const { clearMessages } = useChat();
  const [showClearDialog, setShowClearDialog] = useState(false);
  const t = useTranslations("common");
  const tChat = useTranslations("chat");
  
  // Reset chat messages when component mounts
  useEffect(() => {
    clearMessages();
  }, [clearMessages]);
  
  const handleClearChat = () => {
    clearMessages();
    setShowClearDialog(false);
  };
  
  return (
    <ProtectedRoute>
      <div className="flex h-screen flex-col overflow-hidden">
        <header className="sticky top-0 z-10 flex items-center justify-between border-b bg-background p-2 sm:p-4">
          <div className="flex items-center gap-2">
            <Link 
              href="/profile" 
              className="mr-1 sm:mr-2 rounded-md p-1 hover:bg-muted transition-colors"
              aria-label={t("back")}
            >
              <ArrowLeftIcon className="h-4 w-4 sm:h-5 sm:w-5" />
            </Link>
            <h1 className="text-lg sm:text-xl font-bold truncate">{t("chat")}</h1>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <LanguageSwitcherSimple />
            <ThemeToggleSimple />
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => setShowClearDialog(true)}
              title={t("newChat")}
              className="h-8 w-8 sm:h-9 sm:w-9"
            >
              <PlusIcon className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>
        </header>
        
        <div className="flex flex-1 flex-col overflow-hidden relative">
          <ChatList />
          <div className="sticky bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm w-full">
            <div className="max-w-3xl mx-auto w-full">
              <ChatInput />
            </div>
          </div>
        </div>
        
        {/* Clear chat confirmation dialog */}
        <Dialog open={showClearDialog} onOpenChange={setShowClearDialog}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{t("newChat")}</DialogTitle>
              <DialogDescription>
                {tChat("clearChatConfirm")}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowClearDialog(false)}
                className="mt-2 sm:mt-0"
              >
                {t("cancel")}
              </Button>
              <Button
                onClick={handleClearChat}
                className="sm:ml-2"
              >
                {t("yes")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </ProtectedRoute>
  );
}