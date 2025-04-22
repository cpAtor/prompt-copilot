import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../types';
import { setCurrentConversation, deleteConversation, createConversation } from '../store/slices/chatSlice';
import { PlusIcon, TrashIcon, XMarkIcon, ChevronLeftIcon } from '@heroicons/react/24/outline';

interface SidebarProps {
  onClose?: () => void;
  onCollapse?: () => void;
  isMobile: boolean;
}

const Sidebar = ({ onClose, onCollapse, isMobile }: SidebarProps) => {
  const dispatch = useDispatch();
  const { conversations, currentConversationId } = useSelector((state: RootState) => state.chat);

  return (
    <div className="h-full flex flex-col bg-[#1e1e1e]">
      <div className="flex items-center justify-between px-3 py-3">
        <h2 className="text-lg font-semibold">Chats</h2>
        {isMobile ? (
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-800 rounded-lg"
            title="Close sidebar"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        ) : (
          <button
            onClick={onCollapse}
            className="p-1 hover:bg-gray-800 rounded-lg"
            title="Hide chat list"
          >
            <ChevronLeftIcon className="h-6 w-6" />
          </button>
        )}
      </div>

      <div className="px-3">
        <button
          onClick={() => {
            dispatch(createConversation());
            onClose?.();
          }}
          className="flex items-center w-full p-3 gap-3 text-sm bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded-lg transition-colors text-white"
        >
          <PlusIcon className="h-5 w-5" />
          <span>New Chat</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-2 mt-4">
        {conversations.map((conversation) => (
          <div
            key={conversation.id}
            className={`group flex items-center justify-between p-3 rounded-lg mb-1 cursor-pointer ${
              conversation.id === currentConversationId
                ? 'bg-[#2a2a2a]'
                : 'hover:bg-[#2a2a2a]'
            }`}
            onClick={() => {
              dispatch(setCurrentConversation(conversation.id));
              onClose?.();
            }}
          >
            <span className="truncate text-sm text-gray-300">
              {conversation.messages[0]?.content.slice(0, 30) || 'New Conversation'}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                dispatch(deleteConversation(conversation.id));
              }}
              className="opacity-0 group-hover:opacity-100 p-1 hover:bg-[#3a3a3a] rounded transition-opacity"
            >
              <TrashIcon className="h-4 w-4 text-gray-400 hover:text-white" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar; 