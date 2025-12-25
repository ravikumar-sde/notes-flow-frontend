'use client';

import { useState } from 'react';
import { WorkspaceProvider } from '@/contexts/WorkspaceContext';
import WorkspaceSidebar from '@/components/workspace/WorkspaceSidebar';
import PageEditor from '@/components/PageEditor';
import { Page } from '@/types/blocks';

export default function WorkspacePage() {
  const [selectedPage, setSelectedPage] = useState<Page | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // In a real app, this would come from authentication
  const currentUserId = 'user_demo_123';

  return (
    <WorkspaceProvider initialUserId={currentUserId}>
      <div className="flex h-screen overflow-hidden bg-linear-to-br from-[#0f0f0f] via-[#0f0f0f] to-[#1a1a1a]">
        {/* Sidebar */}
        <WorkspaceSidebar
          onSelectPage={setSelectedPage}
          selectedPageId={selectedPage?.id}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          {selectedPage ? (
            <PageEditor page={selectedPage} />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center max-w-md px-6">
                {/* Modern animated icon */}
                <div className="relative mb-8">
                  <div className="absolute inset-0 bg-linear-to-r from-[#6366f1] to-[#8b5cf6] blur-3xl opacity-20 rounded-full"></div>
                  <div className="relative text-8xl mb-4 animate-bounce-slow">✨</div>
                </div>

                <h2 className="text-4xl font-bold bg-linear-to-r from-[#f5f5f5] to-[#a0a0a0] bg-clip-text text-transparent mb-4">
                  Welcome to NotesFlow
                </h2>
                <p className="text-[#a0a0a0] text-lg mb-8 leading-relaxed">
                  Your modern workspace for ideas, notes, and collaboration.
                  Select a page from the sidebar or create a new one to get started.
                </p>

                {/* Quick action hint */}
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-full text-sm text-[#a0a0a0]">
                  <span className="text-[#6366f1]">💡</span>
                  <span>Tip: Use the sidebar to create your first page</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </WorkspaceProvider>
  );
}

