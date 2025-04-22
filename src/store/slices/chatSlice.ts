import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ChatState, Message, RunSettings, Conversation } from '../../types';

const DEFAULT_RUN_SETTINGS: RunSettings = {
  temperature: 1.0,
  topP: 0.8,
  maxOutputTokens: 2048,
  model: 'gemini-1.5-pro'
};

const loadState = (): ChatState => {
  const savedState = localStorage.getItem('chatState');
  if (savedState) {
    const parsedState = JSON.parse(savedState);
    // Migrate existing conversations to include run settings if they don't have them
    if (parsedState.conversations) {
      parsedState.conversations = parsedState.conversations.map((conv: Omit<Conversation, 'runSettings'> & { runSettings?: RunSettings }) => ({
        ...conv,
        runSettings: conv.runSettings || { ...DEFAULT_RUN_SETTINGS }
      }));
    }
    return parsedState;
  }
  return {
    conversations: [],
    currentConversationId: null,
    apiKey: '',
    selectedModel: 'gemini-1.5-pro',
  };
};

const initialState: ChatState = loadState();

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setApiKey: (state, action: PayloadAction<string>) => {
      state.apiKey = action.payload;
      localStorage.setItem('chatState', JSON.stringify(state));
    },
    setSelectedModel: (state, action: PayloadAction<string>) => {
      state.selectedModel = action.payload;
      if (state.currentConversationId) {
        const conversation = state.conversations.find(c => c.id === state.currentConversationId);
        if (conversation) {
          conversation.runSettings.model = action.payload;
        }
      }
      localStorage.setItem('chatState', JSON.stringify(state));
    },
    updateRunSettings: (state, action: PayloadAction<{ conversationId: string; settings: Partial<RunSettings> }>) => {
      const conversation = state.conversations.find(c => c.id === action.payload.conversationId);
      if (conversation) {
        conversation.runSettings = { ...conversation.runSettings, ...action.payload.settings };
        localStorage.setItem('chatState', JSON.stringify(state));
      }
    },
    createConversation: (state) => {
      const newConversation = {
        id: Date.now().toString(),
        title: 'New Conversation',
        messages: [],
        lastUpdated: Date.now(),
        runSettings: { ...DEFAULT_RUN_SETTINGS }
      };
      state.conversations.push(newConversation);
      state.currentConversationId = newConversation.id;
      localStorage.setItem('chatState', JSON.stringify(state));
    },
    setCurrentConversation: (state, action: PayloadAction<string>) => {
      state.currentConversationId = action.payload;
      localStorage.setItem('chatState', JSON.stringify(state));
    },
    addMessage: (state, action: PayloadAction<{ conversationId: string; message: Message }>) => {
      const conversation = state.conversations.find(c => c.id === action.payload.conversationId);
      if (conversation) {
        conversation.messages.push(action.payload.message);
        conversation.lastUpdated = Date.now();
        localStorage.setItem('chatState', JSON.stringify(state));
      }
    },
    deleteConversation: (state, action: PayloadAction<string>) => {
      state.conversations = state.conversations.filter(c => c.id !== action.payload);
      if (state.currentConversationId === action.payload) {
        state.currentConversationId = state.conversations[0]?.id || null;
      }
      localStorage.setItem('chatState', JSON.stringify(state));
    },
  },
});

export const {
  setApiKey,
  setSelectedModel,
  updateRunSettings,
  createConversation,
  setCurrentConversation,
  addMessage,
  deleteConversation,
} = chatSlice.actions;

export default chatSlice.reducer; 