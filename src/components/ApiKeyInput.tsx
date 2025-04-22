import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../types';
import { setApiKey } from '../store/slices/chatSlice';

const ApiKeyInput = () => {
  const dispatch = useDispatch();
  const apiKey = useSelector((state: RootState) => state.chat.apiKey);
  const [input, setInput] = useState(apiKey);
  const [isEditing, setIsEditing] = useState(!apiKey);

  const handleSave = () => {
    dispatch(setApiKey(input));
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <div className="px-4 py-2 border-b border-[#2e2e2e]">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400">
            API Key: {apiKey ? '••••••••' : 'Not set'}
          </span>
          <button
            onClick={() => setIsEditing(true)}
            className="text-xs text-blue-400 hover:text-blue-300"
          >
            Edit
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-3 border-b border-[#2e2e2e]">
      <div className="flex flex-col gap-2">
        <label className="text-xs text-gray-400">Gemini API Key</label>
        <div className="flex gap-2">
          <input
            type="password"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter your API key"
            className="flex-1 px-3 py-1.5 bg-[#2e2e2e] border border-[#3e3e3e] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSave}
            disabled={!input.trim()}
            className="px-3 py-1.5 bg-[#2e2e2e] hover:bg-[#3e3e3e] text-sm rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-[#3e3e3e]"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyInput; 