'use client';

import { Page } from '@/types/blocks';
import WorkspaceSelector from './WorkspaceSelector';
import PageList from './PageList';

interface WorkspaceSidebarProps {
  onSelectPage: (page: Page) => void;
  selectedPageId?: string;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export default function WorkspaceSidebar({ onSelectPage, selectedPageId, isCollapsed, onToggleCollapse }: WorkspaceSidebarProps) {
  return (
    <>
      {isCollapsed && (
        <div className="absolute top-3 left-3 w-93 bg-[#1a1a1a] z-40">
          <WorkspaceSelector isCollapsed={isCollapsed} />
          {/* Collapse Toggle Button */}
          <button
            onClick={onToggleCollapse}
            className="absolute -right-5 top-5 z-50 w-8 h-8 bg-[#1a1a1a] border border-[#2a2a2a] rounded-full flex items-center justify-center hover:bg-[#252525] transition-all duration-200 shadow-lg"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <svg
              className={`w-4 h-4 text-[#9b9b9b] transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>
      )}
      {!isCollapsed && (
        <div className={`relative h-screen bg-linear-to-br from-[#0f0f0f] via-[#0f0f0f] to-[#1a1a1a]/50 flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.4)] transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-96'
          }`}>
          {/* Collapse Toggle Button */}
          <button
            onClick={onToggleCollapse}
            className="absolute -right-5 top-8 z-50 w-8 h-8 bg-[#1a1a1a] border border-[#2a2a2a] rounded-full flex items-center justify-center hover:bg-[#252525] transition-all duration-200 shadow-lg"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <svg
              className={`w-4 h-4 text-[#9b9b9b] transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          {/* Workspace Selector */}
          <div className="p-3 border-b border-[#191919]/60 bg-linear-to-b from-[#1a1a1a]/20 to-transparent">
            <WorkspaceSelector />
          </div>

          <div className="flex-1 overflow-hidden">
            <PageList onSelectPage={onSelectPage} selectedPageId={selectedPageId} />
          </div>
        </div>
      )}
    </>
  );
}

