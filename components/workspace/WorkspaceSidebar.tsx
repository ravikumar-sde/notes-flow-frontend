'use client';

import { useState } from 'react';
import { Page } from '@/types/blocks';
import WorkspaceSelector from './WorkspaceSelector';
import PageList from './PageList';
import InviteMember from './InviteMember';
import MemberList from './MemberList';

interface WorkspaceSidebarProps {
  onSelectPage: (page: Page) => void;
  selectedPageId?: string;
}

export default function WorkspaceSidebar({ onSelectPage, selectedPageId }: WorkspaceSidebarProps) {
  const [activeTab, setActiveTab] = useState<'pages' | 'members'>('pages');

  return (
    <div className="w-64 h-screen bg-linear-to-br from-[#0f0f0f] via-[#0f0f0f] to-[#1a1a1a]/50 border-r border-[#191919]/60 flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.4)]">
      {/* Workspace Selector */}
      <div className="p-3 border-b border-[#191919]/60 bg-linear-to-b from-[#1a1a1a]/20 to-transparent">
        <WorkspaceSelector />
      </div>

      {/* Tabs */}
      <div className="flex px-2 pt-2 gap-1 border-b border-[#191919]/60 bg-[#0f0f0f]/50">
        <button
          onClick={() => setActiveTab('pages')}
          className={`flex-1 px-3 py-1.5 text-[13px] font-medium transition-all duration-200 rounded-t-lg relative ${
            activeTab === 'pages'
              ? 'text-[#e3e3e3] bg-[#1a1a1a]/40'
              : 'text-[#9b9b9b] hover:text-[#e3e3e3] hover:bg-[#1a1a1a]/20'
          }`}
        >
          Pages
          {activeTab === 'pages' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-linear-to-r from-blue-600 to-blue-500 shadow-[0_0_8px_rgba(37,99,235,0.5)]" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('members')}
          className={`flex-1 px-3 py-1.5 text-[13px] font-medium transition-all duration-200 rounded-t-lg relative ${
            activeTab === 'members'
              ? 'text-[#e3e3e3] bg-[#1a1a1a]/40'
              : 'text-[#9b9b9b] hover:text-[#e3e3e3] hover:bg-[#1a1a1a]/20'
          }`}
        >
          Members
          {activeTab === 'members' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-linear-to-r from-blue-600 to-blue-500 shadow-[0_0_8px_rgba(37,99,235,0.5)]" />
          )}
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'pages' ? (
          <PageList onSelectPage={onSelectPage} selectedPageId={selectedPageId} />
        ) : (
          <div className="h-full overflow-y-auto">
            {/* Invite Member Button */}
            <div className="p-3 border-b border-[#191919]/60 bg-linear-to-b from-[#1a1a1a]/10 to-transparent">
              <InviteMember />
            </div>

            {/* Member List */}
            <div className="p-4">
              <MemberList />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

