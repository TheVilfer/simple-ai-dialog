/**
 * Chat related types
 */

import type { DateString, ID } from './common';

// Message types
export type MessageType = 'user' | 'ai' | 'system';
export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read' | 'failed';

export interface Message {
  readonly id: ID;
  readonly content: string;
  readonly type: MessageType;
  readonly timestamp: DateString;
  readonly status?: MessageStatus;
  readonly metadata?: MessageMetadata;
}

export interface MessageMetadata {
  readonly tokens?: number;
  readonly model?: string;
  readonly processingTime?: number;
  readonly error?: string;
  readonly attachments?: readonly Attachment[];
}

// Attachment types
export type AttachmentType = 'image' | 'file' | 'link';

export interface Attachment {
  readonly id: ID;
  readonly type: AttachmentType;
  readonly name: string;
  readonly url: string;
  readonly size?: number;
  readonly mimeType?: string;
  readonly thumbnail?: string;
}

// Chat session types
export interface ChatSession {
  readonly id: ID;
  readonly title?: string;
  readonly createdAt: DateString;
  readonly updatedAt: DateString;
  readonly messageCount: number;
  readonly lastMessage?: Message;
  readonly isActive: boolean;
}

// Chat state
export interface ChatState {
  readonly messages: readonly Message[];
  readonly isLoading: boolean;
  readonly error: string | null;
  readonly currentSession?: ChatSession;
  readonly sessions: readonly ChatSession[];
}

// AI Configuration
export interface AIConfig {
  readonly model: string;
  readonly temperature: number;
  readonly maxTokens: number;
  readonly systemPrompt?: string;
  readonly enableMarkdown: boolean;
  readonly enableCodeHighlighting: boolean;
}

// Chat settings
export interface ChatSettings {
  readonly aiConfig: AIConfig;
  readonly autoSave: boolean;
  readonly showTimestamps: boolean;
  readonly enableNotifications: boolean;
  readonly theme: 'auto' | 'light' | 'dark';
}

// Message input types
export interface MessageInput {
  readonly content: string;
  readonly attachments?: readonly File[];
  readonly replyTo?: ID;
}

// Chat events
export type ChatEventType = 
  | 'message_sent'
  | 'message_received'
  | 'typing_start'
  | 'typing_stop'
  | 'session_created'
  | 'session_updated'
  | 'error_occurred';

export interface ChatEvent {
  readonly type: ChatEventType;
  readonly timestamp: DateString;
  readonly data?: unknown;
}

// Typing indicator
export interface TypingIndicator {
  readonly isTyping: boolean;
  readonly startedAt?: DateString;
}

// Message reactions (for future implementation)
export type ReactionType = 'like' | 'dislike' | 'love' | 'laugh' | 'wow' | 'sad' | 'angry';

export interface MessageReaction {
  readonly type: ReactionType;
  readonly count: number;
  readonly userReacted: boolean;
}

// Enhanced message with reactions
export interface EnhancedMessage extends Message {
  readonly reactions?: Record<ReactionType, MessageReaction>;
  readonly replyTo?: ID;
  readonly edited?: boolean;
  readonly editedAt?: DateString;
}

// Chat analytics (for future implementation)
export interface ChatAnalytics {
  readonly totalMessages: number;
  readonly totalSessions: number;
  readonly averageSessionLength: number;
  readonly mostActiveDay: string;
  readonly topTopics: readonly string[];
  readonly responseTime: {
    readonly average: number;
    readonly median: number;
  };
}

// Export types
export interface ChatExport {
  readonly sessionId: ID;
  readonly title: string;
  readonly createdAt: DateString;
  readonly messages: readonly Message[];
  readonly format: 'json' | 'markdown' | 'txt';
}

// Search and filtering
export interface MessageSearchParams {
  readonly query: string;
  readonly sessionId?: ID;
  readonly type?: MessageType;
  readonly dateFrom?: DateString;
  readonly dateTo?: DateString;
  readonly limit?: number;
  readonly offset?: number;
}

export interface MessageSearchResult {
  readonly message: Message;
  readonly sessionId: ID;
  readonly sessionTitle?: string;
  readonly relevanceScore: number;
  readonly highlightedContent: string;
}

// Error types
export type ChatErrorCode = 
  | 'MESSAGE_TOO_LONG'
  | 'RATE_LIMIT_EXCEEDED'
  | 'AI_SERVICE_UNAVAILABLE'
  | 'INVALID_ATTACHMENT'
  | 'SESSION_NOT_FOUND'
  | 'NETWORK_ERROR';

export interface ChatError {
  readonly code: ChatErrorCode;
  readonly message: string;
  readonly retryable: boolean;
  readonly details?: Record<string, unknown>;
} 