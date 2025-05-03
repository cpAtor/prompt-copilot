import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../types';
import { addMessage } from '../store/slices/chatSlice';
import { ChevronUpIcon, ChevronDownIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface SystemPromptProps {
  isOpen: boolean;
  onClose?: () => void;
  isMobile?: boolean;
}

const SystemPrompt = ({ 
  isOpen, 
  onClose,
  isMobile = false
}: SystemPromptProps) => {
  const dispatch = useDispatch();
  const currentConversationId = useSelector((state: RootState) => state.chat.currentConversationId);
  const conversations = useSelector((state: RootState) => state.chat.conversations);
  const currentConversation = conversations.find(c => c.id === currentConversationId);
  
  const [prompt, setPrompt] = useState(currentConversation?.systemPrompt || '');
  const [isInputExpanded, setIsInputExpanded] = useState(false);

  useEffect(() => {
    setPrompt(currentConversation?.systemPrompt || '');
    const savedInputExpanded = localStorage.getItem('systemPromptInputExpanded');
    if (savedInputExpanded) setIsInputExpanded(JSON.parse(savedInputExpanded));
  }, [currentConversation?.systemPrompt]);

  const handleSave = () => {
    if (currentConversationId && currentConversation) {
      dispatch(addMessage({
        conversationId: currentConversationId,
        message: {
          id: Date.now().toString(),
          content: prompt,
          role: 'system' as const,
          timestamp: Date.now(),
        }
      }));
    }
  };

  const toggleInputExpanded = () => {
    const newExpanded = !isInputExpanded;
    setIsInputExpanded(newExpanded);
    localStorage.setItem('systemPromptInputExpanded', JSON.stringify(newExpanded));
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="h-full flex flex-col bg-[#1e1e1e]">
      {/* Mobile-only header */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-[#2a2a2a]">
        <h2 className="text-lg font-semibold text-white">System Prompt</h2>
        <button
          onClick={onClose}
          className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-[#2a2a2a]"
          title="Close system prompt"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-4">
          <div className="relative">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onBlur={handleSave}
              placeholder="Enter a system prompt..."
              className={`w-full ${
                isInputExpanded ? 'h-[calc(100vh-200px)]' : 'h-40'
              } px-4 py-3 bg-[#2a2a2a] text-white rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm`}
            />
            <button
              onClick={toggleInputExpanded}
              className="absolute right-2 bottom-2 z-10 p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-[#3a3a3a]"
              title={isInputExpanded ? "Collapse input" : "Expand input"}
            >
              {isInputExpanded ? (
                <ChevronUpIcon className="h-4 w-4" />
              ) : (
                <ChevronDownIcon className="h-4 w-4" />
              )}
            </button>
          </div>
          <p className="text-sm text-gray-400">
            The system prompt helps set the behavior and context for the AI assistant in this conversation.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SystemPrompt; 