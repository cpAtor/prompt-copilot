import { ReactNode, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../types';
import { 
  Bars3Icon, 
  Cog6ToothIcon, 
  CommandLineIcon, 
  ChevronRightIcon, 
  ChevronLeftIcon,
  ChatBubbleLeftIcon
} from '@heroicons/react/24/outline';
import Sidebar from './Sidebar';
import RunSettings from './RunSettings';
import SystemPrompt from './SystemPrompt';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(true);
  const [rightPanelWidth, setRightPanelWidth] = useState(() => {
    const saved = localStorage.getItem('rightPanelWidth');
    return saved ? parseInt(saved) : 300;
  });
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    const saved = localStorage.getItem('sidebarWidth');
    return saved ? parseInt(saved) : 260;
  });
  const [isDraggingRight, setIsDraggingRight] = useState(false);
  const [isDraggingLeft, setIsDraggingLeft] = useState(false);
  const [activeTab, setActiveTab] = useState<'system' | 'run'>('system');
  const { apiKey } = useSelector((state: RootState) => state.chat);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingRight) {
        const mainContentRect = document.querySelector('.main-content')?.getBoundingClientRect();
        const rightEdge = mainContentRect?.right || window.innerWidth;
        const newWidth = Math.max(300, Math.min(800, rightEdge - e.clientX));
        setRightPanelWidth(newWidth);
        localStorage.setItem('rightPanelWidth', newWidth.toString());
      }
      if (isDraggingLeft) {
        const newWidth = Math.max(260, Math.min(800, e.clientX));
        setSidebarWidth(newWidth);
        localStorage.setItem('sidebarWidth', newWidth.toString());
      }
    };

    const handleMouseUp = () => {
      setIsDraggingRight(false);
      setIsDraggingLeft(false);
    };

    if (isDraggingRight || isDraggingLeft) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = '';
    };
  }, [isDraggingRight, isDraggingLeft]);

  return (
    <div className="h-screen flex flex-col bg-[#1e1e1e] overflow-hidden">
      {/* Top bar */}
      <div className="h-14 px-4 border-b border-[#2a2a2a] bg-[#1e1e1e] sticky top-0 z-10 flex items-center">
        {/* Mobile menu button */}
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="lg:hidden p-2 -ml-2 text-gray-400 hover:text-white"
        >
          <Bars3Icon className="h-6 w-6" />
        </button>

        {/* App title */}
        <h1 className="text-lg font-semibold text-white ml-2">Prompt Copilot</h1>

        <div className="flex-1 flex items-center justify-between">
          {!apiKey && (
            <div className="text-sm text-red-400 ml-2">
              Please set your API key to start using Prompt Copilot
            </div>
          )}
          <div className="lg:hidden flex items-center gap-2 ml-auto">
            <button
              onClick={() => {
                setActiveTab('system');
                setIsRightPanelOpen(true);
              }}
              className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-[#2a2a2a] transition-colors"
              title="System Prompt"
            >
              <CommandLineIcon className="h-5 w-5" />
            </button>
            <button
              onClick={() => {
                setActiveTab('run');
                setIsRightPanelOpen(true);
              }}
              className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-[#2a2a2a] transition-colors"
              title="Run Settings"
            >
              <Cog6ToothIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Mobile sidebar */}
        <div className={`fixed inset-0 z-50 lg:hidden ${isSidebarOpen ? 'block' : 'hidden'}`}>
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsSidebarOpen(false)} />
          <div className="fixed left-0 top-0 bottom-0 w-[260px] shadow-xl">
            <Sidebar isMobile={true} onClose={() => setIsSidebarOpen(false)} />
          </div>
        </div>

        {/* Desktop sidebar */}
        <div className={`hidden lg:block transition-all duration-200 flex-shrink-0`}>
          <div 
            className="relative border-r border-[#2a2a2a] shadow-xl h-full"
            style={{ width: isSidebarOpen ? `${sidebarWidth}px` : '48px' }}
          >
            {isSidebarOpen ? (
              <>
                <div className="absolute inset-0">
                  <Sidebar isMobile={false} />
                </div>
                {/* Minimize button */}
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="absolute right-2 top-2 z-10 p-2 text-gray-400 hover:text-white rounded-lg hover:bg-[#2a2a2a]"
                  title="Minimize panel"
                >
                  <ChevronLeftIcon className="h-5 w-5" />
                </button>
                {/* Drag handle */}
                <div
                  className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize bg-[#3a3a3a] hover:bg-blue-500/50 active:bg-blue-500 transition-colors"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setIsDraggingLeft(true);
                  }}
                />
              </>
            ) : (
              /* Minimized view */
              <div className="w-12 flex flex-col items-center pt-16 gap-4">
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-[#2a2a2a]"
                  title="Expand panel"
                >
                  <ChevronRightIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-[#2a2a2a]"
                  title="Show conversations"
                >
                  <ChatBubbleLeftIcon className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 flex min-w-0 relative main-content">
          {/* Chat area */}
          <div className="flex-1 overflow-hidden">
            {children}
          </div>

          {/* Right panel - desktop */}
          <div className={`hidden lg:block transition-all duration-200 flex-shrink-0`}>
            <div 
              className="relative border-l border-[#2a2a2a] shadow-xl h-full flex"
              style={{ width: isRightPanelOpen ? `${rightPanelWidth}px` : '48px' }}
            >
              {isRightPanelOpen ? (
                <div className="flex flex-col h-full w-full">
                  {/* Header area */}
                  <div className="h-14 flex items-center justify-between px-4 border-b border-[#2a2a2a] relative w-full">
                    {/* Minimize button */}
                    <button
                      onClick={() => setIsRightPanelOpen(false)}
                      className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-[#2a2a2a]"
                      title="Minimize panel"
                    >
                      <ChevronRightIcon className="h-5 w-5" />
                    </button>

                    {/* Tab buttons */}
                    <div className="flex gap-1 bg-[#2a2a2a] rounded-lg p-1">
                      <button
                        onClick={() => setActiveTab('system')}
                        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                          activeTab === 'system' 
                            ? 'text-white bg-[#3a3a3a]' 
                            : 'text-gray-400 hover:text-white hover:bg-[#3a3a3a]'
                        }`}
                      >
                        System Prompt
                      </button>
                      <button
                        onClick={() => setActiveTab('run')}
                        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                          activeTab === 'run' 
                            ? 'text-white bg-[#3a3a3a]' 
                            : 'text-gray-400 hover:text-white hover:bg-[#3a3a3a]'
                        }`}
                      >
                        Options
                      </button>
                    </div>
                  </div>

                  {/* Panel content */}
                  <div className="flex-1 overflow-hidden w-full">
                    {activeTab === 'system' && (
                      <SystemPrompt 
                        isOpen={true} 
                        isMobile={false}
                      />
                    )}
                    {activeTab === 'run' && (
                      <RunSettings 
                        isOpen={true}
                        onClose={() => {}}
                        onOpen={() => {}}
                      />
                    )}
                  </div>

                  {/* Drag handle */}
                  <div
                    className="absolute left-0 top-0 bottom-0 w-1 cursor-col-resize bg-[#3a3a3a] hover:bg-blue-500/50 active:bg-blue-500 transition-colors"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      setIsDraggingRight(true);
                    }}
                  />
                </div>
              ) : (
                /* Minimized view */
                <div className="w-12 flex flex-col items-center pt-16 gap-4">
                  <button
                    onClick={() => setIsRightPanelOpen(true)}
                    className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-[#2a2a2a]"
                    title="Expand panel"
                  >
                    <ChevronLeftIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('system');
                      setIsRightPanelOpen(true);
                    }}
                    className={`p-2 text-gray-400 hover:text-white rounded-lg hover:bg-[#2a2a2a] ${
                      activeTab === 'system' ? 'bg-[#2a2a2a] text-white' : ''
                    }`}
                    title="System Prompt"
                  >
                    <CommandLineIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('run');
                      setIsRightPanelOpen(true);
                    }}
                    className={`p-2 text-gray-400 hover:text-white rounded-lg hover:bg-[#2a2a2a] ${
                      activeTab === 'run' ? 'bg-[#2a2a2a] text-white' : ''
                    }`}
                    title="Run Settings"
                  >
                    <Cog6ToothIcon className="h-5 w-5" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile panel */}
          {isRightPanelOpen && (
            <div className="lg:hidden fixed inset-0 z-40">
              <div className="fixed inset-0 bg-black/50" onClick={() => setIsRightPanelOpen(false)} />
              <div className="fixed right-0 top-0 bottom-0 w-[300px] shadow-xl">
                {activeTab === 'system' && (
                  <SystemPrompt 
                    isOpen={true}
                    onClose={() => setIsRightPanelOpen(false)}
                    isMobile={true}
                  />
                )}
                {activeTab === 'run' && (
                  <RunSettings 
                    isOpen={true}
                    onClose={() => setIsRightPanelOpen(false)}
                    onOpen={() => setIsRightPanelOpen(true)}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Layout; 