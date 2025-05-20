"use client";

import { create } from "zustand";

export type MessageType = "user" | "ai";

export interface Message {
  id: string;
  content: string;
  type: MessageType;
  timestamp: Date;
}

// Sample markdown responses for demonstration
const markdownResponses = [
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
  console.log("Привет, мир!");
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
];

interface ChatState {
  messages: Message[];
  isLoading: boolean;
  addMessage: (content: string, type: MessageType) => void;
  simulateAiResponse: (userContent: string) => Promise<void>;
  clearMessages: () => void;
}

export const useChat = create<ChatState>((set) => ({
  messages: [],
  isLoading: false,
  
  addMessage: (content: string, type: MessageType) => {
    const message: Message = {
      id: Date.now().toString(),
      content,
      type,
      timestamp: new Date(),
    };
    
    set((state) => ({
      messages: [...state.messages, message],
    }));
    
    return message;
  },
  
  simulateAiResponse: async (userContent: string) => {
    set({ isLoading: true });
    
    // Wait 1 second to simulate AI processing time
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Check if user message contains markdown-related keywords
    const markdownKeywords = [
      'markdown', 
      'покажи', 
      'пример', 
      'код', 
      'разметка', 
      'форматирование',
      'таблица',
      'список'
    ];
    
    const userMessageLower = userContent.toLowerCase();
    const requestingMarkdown = markdownKeywords.some(keyword => 
      userMessageLower.includes(keyword)
    );
    
    let content;
    
    // Only use markdown examples when specifically requested
    if (requestingMarkdown) {
      const randomIndex = Math.floor(Math.random() * markdownResponses.length);
      content = markdownResponses[randomIndex];
    } else {
      // Always echo the user message when not requesting markdown
      content = userContent;
    }
    
    const message = {
      id: Date.now().toString(),
      content,
      type: "ai" as MessageType,
      timestamp: new Date(),
    };
    
    set((state) => ({
      messages: [...state.messages, message],
      isLoading: false,
    }));
  },
  
  clearMessages: () => {
    set({ messages: [] });
  },
})); 