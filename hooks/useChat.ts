"use client";

import { create } from "zustand";
import { devtools } from "zustand/middleware";

import type { Message, MessageType, ChatState, MessageInput } from "@/types/chat";
import type { ID } from "@/types/common";

// Sample markdown responses for demonstration
const MARKDOWN_RESPONSES: readonly string[] = [
  `### Привет!

Вот пример разметки Markdown:

- Маркированный список
- С несколькими пунктами

1. Нумерованный список
2. Тоже полезный

**Жирный текст** и *курсив* тоже поддерживаются.

\`\`\`javascript
// А вот и пример кода
function hello() {
  console.warn("Привет, мир!");
}
\`\`\`

> Цитаты отображаются так`,

  `## Markdown поддерживает разные заголовки

Ссылки тоже работают, например [Google](https://google.com)

Вот таблица:

| Имя | Возраст | Город |
|-----|---------|-------|
| Иван | 25 | Москва |
| Мария | 30 | Санкт-Петербург |

---

И горизонтальную черту тоже можно добавить`,

  `Обычный ответ без особого форматирования, но можно выделить \`код внутри строки\` при необходимости.

Иногда полезно создать чек-лист задач:

- [x] Выполненная задача
- [ ] Невыполненная задача
- [ ] Еще одна задача`
] as const;

// Keywords that trigger markdown responses
const MARKDOWN_KEYWORDS = [
  'markdown', 
  'покажи', 
  'пример', 
  'код', 
  'разметка', 
  'форматирование',
  'таблица',
  'список'
] as const;

// Configuration
const AI_RESPONSE_DELAY = 1000; // 1 second

interface ChatActions {
  readonly addMessage: (content: string, type: MessageType) => Message;
  readonly simulateAiResponse: (userContent: string) => Promise<void>;
  readonly clearMessages: () => void;
  readonly updateMessage: (id: ID, updates: Partial<Message>) => void;
  readonly deleteMessage: (id: ID) => void;
  readonly sendMessage: (input: MessageInput) => Promise<void>;
}

type ChatStore = ChatState & ChatActions;

/**
 * Generates a unique message ID
 */
const generateMessageId = (): string => {
  return `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};

/**
 * Creates a new message object
 */
const createMessage = (
  content: string, 
  type: MessageType,
  id?: string
): Message => ({
  id: id || generateMessageId(),
  content: content.trim(),
  type,
  timestamp: new Date().toISOString(),
});

/**
 * Checks if user message contains markdown-related keywords
 */
const shouldReturnMarkdown = (content: string): boolean => {
  const contentLower = content.toLowerCase();
  return MARKDOWN_KEYWORDS.some(keyword => contentLower.includes(keyword));
};

/**
 * Gets a random markdown response
 */
const getRandomMarkdownResponse = (): string => {
  const randomIndex = Math.floor(Math.random() * MARKDOWN_RESPONSES.length);
  return MARKDOWN_RESPONSES[randomIndex] as string;
};

/**
 * Simulates AI processing delay
 */
const simulateProcessingDelay = (ms: number = AI_RESPONSE_DELAY): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const useChat = create<ChatStore>()(
  devtools(
    (set, get) => ({
      // State
      messages: [],
      isLoading: false,
      error: null,
      currentSession: undefined,
      sessions: [],

      // Actions
      addMessage: (content: string, type: MessageType): Message => {
        if (!content.trim()) {
          throw new Error('Message content cannot be empty');
        }

        const message = createMessage(content, type);
        
        set((state) => ({
          messages: [...state.messages, message],
          error: null, // Clear any previous errors
        }));
        
        return message;
      },

      updateMessage: (id: ID, updates: Partial<Message>): void => {
        set((state) => ({
          messages: state.messages.map(message =>
            message.id === id 
              ? { ...message, ...updates, id } // Ensure ID doesn't change
              : message
          ),
        }));
      },

      deleteMessage: (id: ID): void => {
        set((state) => ({
          messages: state.messages.filter(message => message.id !== id),
        }));
      },

      simulateAiResponse: async (userContent: string): Promise<void> => {
        if (!userContent.trim()) {
          set({ error: 'Cannot respond to empty message' });
          return;
        }

        set({ isLoading: true, error: null });
        
        try {
          // Simulate AI processing time
          await simulateProcessingDelay();
          
          // Determine response content
          const responseContent = shouldReturnMarkdown(userContent)
            ? getRandomMarkdownResponse()
            : userContent; // Echo user message when not requesting markdown
          
          const aiMessage = createMessage(responseContent, "ai");
          
          set((state) => ({
            messages: [...state.messages, aiMessage],
            isLoading: false,
          }));
        } catch (error) {
          const errorMessage = error instanceof Error 
            ? error.message 
            : 'Failed to generate AI response';
            
          set({ 
            isLoading: false, 
            error: errorMessage 
          });
        }
      },

      sendMessage: async (input: MessageInput): Promise<void> => {
        const { content, attachments, replyTo } = input;
        
        if (!content.trim()) {
          set({ error: 'Message content cannot be empty' });
          return;
        }

        try {
          // Add user message
          const userMessage = get().addMessage(content, "user");
          
          // TODO: Handle attachments and replyTo in future implementation
          if (attachments && attachments.length > 0) {
            console.warn('Attachments not yet implemented');
          }
          if (replyTo) {
            console.warn('Reply functionality not yet implemented');
          }
          
          // Simulate AI response
          await get().simulateAiResponse(content);
        } catch (error) {
          const errorMessage = error instanceof Error 
            ? error.message 
            : 'Failed to send message';
            
          set({ error: errorMessage });
        }
      },

      clearMessages: (): void => {
        set({ 
          messages: [], 
          error: null,
          isLoading: false 
        });
      },
    }),
    {
      name: 'chat-store',
      // Only include state in devtools, not actions
      partialize: (state: ChatStore) => ({
        messages: state.messages,
        isLoading: state.isLoading,
        error: state.error,
        currentSession: state.currentSession,
        sessions: state.sessions,
      }),
    }
  )
);

// Selector hooks for better performance
export const useChatMessages = () => useChat(state => state.messages);
export const useChatLoading = () => useChat(state => state.isLoading);
export const useChatError = () => useChat(state => state.error);
export const useChatActions = () => useChat(state => ({
  addMessage: state.addMessage,
  simulateAiResponse: state.simulateAiResponse,
  clearMessages: state.clearMessages,
  updateMessage: state.updateMessage,
  deleteMessage: state.deleteMessage,
  sendMessage: state.sendMessage,
})); 