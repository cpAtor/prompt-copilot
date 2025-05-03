export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant' | 'system';
  timestamp: number;
}

export interface RunSettings {
  temperature: number;
  topP: number;
  maxOutputTokens: number;
  model: string;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  lastUpdated: number;
  runSettings: RunSettings;
  systemPrompt: string;
}

export interface ChatState {
  conversations: Conversation[];
  currentConversationId: string | null;
  apiKey: string;
  selectedModel: string;
}

export interface ThemeState {
  isDarkMode: boolean;
}

export interface RootState {
  chat: ChatState;
  theme: ThemeState;
} 