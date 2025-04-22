import { ReactNode, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../types';
import { Bars3Icon } from '@heroicons/react/24/outline';
import Sidebar from './Sidebar';
import RunSettings from './RunSettings';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isRunSettingsOpen, setIsRunSettingsOpen] = useState(true);
  const { apiKey } = useSelector((state: RootState) => state.chat);

  return (
    <div className="h-screen flex bg-[#1e1e1e] overflow-hidden">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${isSidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-black/50" onClick={() => setIsSidebarOpen(false)} />
        <div className="fixed left-0 top-0 bottom-0 w-[260px] shadow-xl">
          <Sidebar onClose={() => setIsSidebarOpen(false)} isMobile={true} />
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className={`hidden lg:block transition-all duration-200 ${isSidebarOpen ? 'w-[260px]' : 'w-0'}`}>
        <div className={`w-[260px] h-full border-r border-[#2a2a2a] shadow-xl ${!isSidebarOpen && 'hidden'}`}>
          <Sidebar onCollapse={() => setIsSidebarOpen(false)} isMobile={false} />
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        {/* Top bar */}
        <div className="flex items-center h-14 px-4 border-b border-[#2a2a2a] bg-[#1e1e1e] sticky top-0 z-10">
          {/* Mobile menu button */}
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden p-2 -ml-2 text-gray-400 hover:text-white"
          >
            <Bars3Icon className="h-6 w-6" />
          </button>

          {/* Desktop toggle buttons */}
          <div className="hidden lg:flex items-center gap-2">
            {!isSidebarOpen && (
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-[#2a2a2a]"
                title="Show sidebar"
              >
                <Bars3Icon className="h-5 w-5" />
              </button>
            )}
          </div>
          
          <div className="flex-1 flex items-center justify-between">
            {!apiKey && (
              <div className="text-sm text-red-400 ml-2">
                Please set your API key to start using Gemini Studio
              </div>
            )}
          </div>
        </div>

        {/* Main area with chat and run settings */}
        <div className="flex-1 flex overflow-hidden">
          {/* Chat area */}
          <div className="flex-1 overflow-hidden">
            {children}
          </div>

          {/* Run settings panel - desktop */}
          <div className={`hidden lg:block transition-all duration-200 ${isRunSettingsOpen ? 'w-[300px]' : 'w-[56px]'}`}>
            <div className={`h-full shadow-xl border-l border-[#2a2a2a]`}>
              <RunSettings 
                isOpen={isRunSettingsOpen} 
                onClose={() => setIsRunSettingsOpen(false)}
                onOpen={() => setIsRunSettingsOpen(true)}
              />
            </div>
          </div>

          {/* Run settings panel - mobile */}
          <div className="lg:hidden">
            {/* Always show the collapsed settings button in mobile header */}
            <div className="fixed top-0 right-0 z-40">
              <RunSettings 
                isOpen={isRunSettingsOpen} 
                onClose={() => setIsRunSettingsOpen(false)}
                onOpen={() => setIsRunSettingsOpen(true)}
              />
            </div>

            {/* Modal overlay when settings are open */}
            {isRunSettingsOpen && (
              <div className="fixed inset-0 z-40">
                <div className="fixed inset-0 bg-black/50" onClick={() => setIsRunSettingsOpen(false)} />
                <div className="fixed right-0 top-0 bottom-0 w-[300px] shadow-xl">
                  <RunSettings 
                    isOpen={true} 
                    onClose={() => setIsRunSettingsOpen(false)}
                    onOpen={() => setIsRunSettingsOpen(true)}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout; 