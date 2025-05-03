import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../types';
import { setSelectedModel, updateRunSettings } from '../store/slices/chatSlice';
import { Cog6ToothIcon, XMarkIcon } from '@heroicons/react/24/outline';

const AVAILABLE_MODELS = [
  { id: 'gemini-2.5-pro-preview-03-25', name: 'Gemini 2.5 Pro Preview' },
  { id: 'gemini-2.5-flash-preview-04-17', name: 'Gemini 2.5 Flash Preview' },
  { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash' },
  { id: 'gemini-2.0-flash-lite', name: 'Gemini 2.0 Flash-Lite' },
  { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash' },
  { id: 'gemini-1.5-flash-8b', name: 'Gemini 1.5 Flash-8B' },
  { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro' },
];

interface RunSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
}

const RunSettings = ({ isOpen, onClose, onOpen }: RunSettingsProps) => {
  const dispatch = useDispatch();
  const { conversations, currentConversationId } = useSelector((state: RootState) => state.chat);
  const currentConversation = conversations.find(c => c.id === currentConversationId);
  const settings = currentConversation?.runSettings;

  if (!isOpen) {
    return null;
  }

  if (!currentConversationId) {
    return (
      <div className="h-full flex flex-col bg-[#1e1e1e]">
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 pt-12 text-sm text-gray-400">
            Select a conversation to view and edit run settings
          </div>
        </div>
      </div>
    );
  }

  if (!settings) {
    return null;
  }

  const handleSettingChange = (key: keyof typeof settings, value: number | string) => {
    dispatch(updateRunSettings({
      conversationId: currentConversationId,
      settings: { [key]: value }
    }));
  };

  return (
    <div className="h-full flex flex-col bg-[#1e1e1e] w-full">
      {/* Mobile-only header */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-[#2a2a2a]">
        <h2 className="text-lg font-semibold text-white">Run Settings</h2>
        <button
          onClick={onClose}
          className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-[#2a2a2a]"
          title="Close settings"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto w-full">
        <div className="px-6 py-4 space-y-6 w-full">
          {/* Model Selection */}
          <div className="w-full">
            <select
              value={settings.model}
              onChange={(e) => {
                handleSettingChange('model', e.target.value);
                dispatch(setSelectedModel(e.target.value));
              }}
              className="w-full px-3 py-2 bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {AVAILABLE_MODELS.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.name}
                </option>
              ))}
            </select>
          </div>

          {/* Token Count */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Token count</span>
              <span className="text-sm text-white">0 / 1,048,576</span>
            </div>
          </div>

          {/* Temperature */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Temperature</span>
              <span className="text-sm text-white">{settings.temperature.toFixed(1)}</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={settings.temperature}
              onChange={(e) => handleSettingChange('temperature', parseFloat(e.target.value))}
              className="w-full accent-blue-500"
            />
          </div>

          {/* Top P */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Top P</span>
              <span className="text-sm text-white">{settings.topP.toFixed(1)}</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={settings.topP}
              onChange={(e) => handleSettingChange('topP', parseFloat(e.target.value))}
              className="w-full accent-blue-500"
            />
          </div>

          {/* Output length */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Output length</span>
              <span className="text-sm text-white">{settings.maxOutputTokens}</span>
            </div>
            <input
              type="range"
              min="1"
              max="2048"
              step="1"
              value={settings.maxOutputTokens}
              onChange={(e) => handleSettingChange('maxOutputTokens', parseInt(e.target.value))}
              className="w-full accent-blue-500"
            />
          </div>

          {/* Tools */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-white">Tools</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Structured output</span>
                <button className="text-xs text-blue-400 hover:text-blue-300">Edit</button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Code execution</span>
                <div className="relative inline-block w-8 h-4">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-8 h-4 bg-[#3a3a3a] rounded-full peer peer-checked:bg-blue-500"></div>
                  <div className="absolute left-1 top-1 w-2 h-2 bg-white rounded-full transition peer-checked:translate-x-4"></div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Function calling</span>
                <button className="text-xs text-blue-400 hover:text-blue-300">Edit</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RunSettings; 