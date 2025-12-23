'use client';

import { useState } from 'react';
import { useWorkspace } from '@/contexts/WorkspaceContext';
import { Page } from '@/types/blocks';

interface PageListProps {
  onSelectPage: (page: Page) => void;
  selectedPageId?: string;
}

export default function PageList({ onSelectPage, selectedPageId }: PageListProps) {
  const { currentWorkspace, pages, createPage, deletePage, canUserEdit } = useWorkspace();
  const [isCreating, setIsCreating] = useState(false);
  const [newPageTitle, setNewPageTitle] = useState('');

  const canEdit = canUserEdit();

  const workspacePages = pages.filter(
    (page) => page.workspaceId === currentWorkspace?.id
  );

  const handleCreatePage = () => {
    if (!newPageTitle.trim()) return;

    const newPage = createPage(newPageTitle);
    setNewPageTitle('');
    setIsCreating(false);
    onSelectPage(newPage);
  };

  const handleDeletePage = (pageId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this page?')) {
      deletePage(pageId);
    }
  };

  if (!currentWorkspace) {
    return (
      <div className="p-6 text-center text-[#a0a0a0] text-sm">
        Select a workspace to view pages
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-3 py-2">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-[11px] font-medium text-[#9b9b9b] uppercase tracking-wide">Private</h3>
          {canEdit && (
            <button
              onClick={() => setIsCreating(true)}
              className="p-1 hover:bg-[#232323] rounded transition-colors"
              title="New Page"
            >
              <svg className="w-3.5 h-3.5 text-[#9b9b9b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          )}
        </div>

        {/* Create Page Form */}
        {isCreating && (
          <div className="mt-2 p-2 bg-linear-to-br from-[#1f1f1f]/60 to-[#1a1a1a]/60 rounded-lg border border-[#2a2a2a]/40 shadow-[0_2px_8px_rgba(0,0,0,0.3)]">
            <input
              type="text"
              value={newPageTitle}
              onChange={(e) => setNewPageTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCreatePage();
                if (e.key === 'Escape') {
                  setIsCreating(false);
                  setNewPageTitle('');
                }
              }}
              placeholder="Page title..."
              className="w-full px-2 py-1.5 bg-[#191919]/80 text-[#e3e3e3] border border-[#2f2f2f]/60 rounded-lg text-[13px] outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/30 placeholder-[#5a5a5a] shadow-[inset_0_1px_2px_rgba(0,0,0,0.3)] transition-all"
              autoFocus
            />
            <div className="flex gap-1.5 mt-1.5">
              <button
                onClick={handleCreatePage}
                disabled={!newPageTitle.trim()}
                className="flex-1 px-2 py-1 bg-linear-to-r from-[#2f2f2f] to-[#3a3a3a] text-[#e3e3e3] rounded-lg text-[11px] font-medium hover:from-[#3a3a3a] hover:to-[#454545] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-[0_2px_4px_rgba(0,0,0,0.2)] border border-[#3a3a3a]/40"
              >
                Create
              </button>
              <button
                onClick={() => {
                  setIsCreating(false);
                  setNewPageTitle('');
                }}
                className="px-2 py-1 text-[#9b9b9b] rounded-lg text-[11px] font-medium hover:bg-[#232323]/60 transition-all duration-200 border border-transparent hover:border-[#2a2a2a]/40"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Page List */}
      <div className="flex-1 overflow-y-auto px-2">
        {workspacePages.length === 0 ? (
          <div className="p-4 text-center">
            <div className="text-[#9b9b9b] text-[13px] mb-2">No pages yet</div>
            {canEdit && (
              <button
                onClick={() => setIsCreating(true)}
                className="text-[#9b9b9b] text-[12px] hover:text-[#e3e3e3] transition-all duration-200 hover:underline"
              >
                Create your first page →
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-0.5">
            {workspacePages.map((page) => (
              <div
                key={page.id}
                onClick={() => onSelectPage(page)}
                className={`group flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer transition-all duration-200 ${
                  selectedPageId === page.id
                    ? 'bg-linear-to-r from-[#2f2f2f]/80 to-[#2a2a2a]/80 text-[#e3e3e3] shadow-[inset_0_1px_2px_rgba(0,0,0,0.3)] border border-[#3a3a3a]/40'
                    : 'text-[#9b9b9b] hover:bg-[#232323]/60 hover:text-[#e3e3e3] hover:shadow-[0_2px_4px_rgba(0,0,0,0.2)] border border-transparent hover:border-[#2a2a2a]/40'
                }`}
              >
                {/* Page Icon */}
                <span className="text-sm opacity-70 group-hover:scale-110 transition-transform duration-200">{page.icon || '📄'}</span>

                {/* Page Title */}
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] truncate font-medium">
                    {page.title || 'Untitled'}
                  </div>
                </div>

                {/* Delete Button */}
                {canEdit && (
                  <button
                    onClick={(e) => handleDeletePage(page.id, e)}
                    className="opacity-0 group-hover:opacity-100 p-0.5 hover:text-red-400 transition-all duration-200 rounded hover:bg-red-900/20"
                    title="Delete page"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

