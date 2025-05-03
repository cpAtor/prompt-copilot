import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../types';
import { addMessage, createConversation } from '../store/slices/chatSlice';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { PaperAirplaneIcon, DocumentDuplicateIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

const ChatInterface = () => {
  const dispatch = useDispatch();
  const { conversations, currentConversationId, apiKey } = useSelector((state: RootState) => state.chat);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const currentConversation = conversations.find(c => c.id === currentConversationId);

  const handleSendMessage = async () => {
    if (!input.trim() || !currentConversationId || !apiKey || !currentConversation) return;

    const userMessage = {
      id: Date.now().toString(),
      content: input,
      role: 'user' as const,
      timestamp: Date.now(),
    };

    dispatch(addMessage({ conversationId: currentConversationId, message: userMessage }));
    setInput('');
    setIsLoading(true);

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: currentConversation.runSettings.model });

      const generationConfig = {
        temperature: currentConversation.runSettings.temperature,
        topP: currentConversation.runSettings.topP,
        maxOutputTokens: currentConversation.runSettings.maxOutputTokens,
      };

      // If there's a system prompt, send it first
      if (currentConversation.systemPrompt) {
        await model.generateContent({
          contents: [{ role: 'system', parts: [{ text: currentConversation.systemPrompt }] }],
          generationConfig,
        });
      }

      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: input }] }],
        generationConfig,
      });

      const response = await result.response;
      const text = response.text();

      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        content: text,
        role: 'assistant' as const,
        timestamp: Date.now(),
      };

      dispatch(addMessage({ conversationId: currentConversationId, message: assistantMessage }));
    } catch (error) {
      console.error('Error generating response:', error);
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        content: 'Error: Failed to generate response. Please check your API key and model selection.',
        role: 'assistant' as const,
        timestamp: Date.now(),
      };
      dispatch(addMessage({ conversationId: currentConversationId, message: errorMessage }));
    } finally {
      setIsLoading(false);
    }
  };

  if (!currentConversationId) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-4">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Get started with Gemini
        </h1>
        <button
          onClick={() => dispatch(createConversation())}
          className="flex items-center gap-2 px-4 py-2 bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded-lg transition-colors text-sm text-white"
        >
          Start New Conversation
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e] relative">
      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto">
          {currentConversation?.messages.map((message) => (
            <div
              key={message.id}
              className={`py-6 ${message.role === 'assistant' ? 'bg-[#1e1e1e]' : 'bg-[#2a2a2a]'}`}
            >
              <div className="max-w-3xl mx-auto px-4">
                <div className="flex items-start gap-4">
                  <div className="w-7 h-7 rounded-full bg-[#3a3a3a] flex items-center justify-center text-sm text-white">
                    {message.role === 'user' ? 'U' : 'G'}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm leading-6 text-gray-300">
                      {message.content}
                    </div>
                    {message.role === 'assistant' && (
                      <div className="flex items-center gap-2 mt-4">
                        <button className="p-2 text-xs text-gray-400 hover:text-white rounded-lg hover:bg-[#2a2a2a]">
                          <DocumentDuplicateIcon className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="py-6 bg-[#1e1e1e]">
              <div className="max-w-3xl mx-auto px-4">
                <div className="flex items-start gap-4">
                  <div className="w-7 h-7 rounded-full bg-[#3a3a3a] flex items-center justify-center text-sm text-white">
                    G
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <ArrowPathIcon className="h-4 w-4 animate-spin" />
                    Thinking...
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input area */}
      <div className="border-t border-[#2a2a2a] bg-[#1e1e1e] sticky bottom-0 pb-4 pt-4">
        <div className="max-w-3xl mx-auto px-4">
          <div className="flex items-end gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Type something or pick one from prompt gallery"
              className="flex-1 min-h-[44px] max-h-[200px] p-2 bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
              rows={1}
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading || !input.trim()}
              className="p-2 bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-white"
            >
              <PaperAirplaneIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface; 