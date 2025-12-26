'use client';

import { useState, useMemo } from 'react';
import { useWorkspace } from '@/contexts/WorkspaceContext';
import { Page, PageWithChildren } from '@/types/blocks';

interface PageListProps {
  onSelectPage: (page: Page) => void;
  selectedPageId?: string;
}

// Helper function to build page tree
function buildPageTree(pages: Page[]): PageWithChildren[] {
  const pageMap = new Map<string, PageWithChildren>();
  const rootPages: PageWithChildren[] = [];

  // First pass: create PageWithChildren objects
  pages.forEach(page => {
    pageMap.set(page.id, {
      ...page,
      children: [],
      level: 0,
      isExpanded: true,
    });
  });

  // Second pass: build tree structure and calculate levels
  pages.forEach(page => {
    const pageWithChildren = pageMap.get(page.id)!;

    if (!page.parentId) {
      // Root page
      pageWithChildren.level = 0;
      rootPages.push(pageWithChildren);
    } else {
      // Child page
      const parent = pageMap.get(page.parentId);
      if (parent) {
        pageWithChildren.level = parent.level + 1;
        parent.children.push(pageWithChildren);
      } else {
        // Parent not found, treat as root
        pageWithChildren.level = 0;
        rootPages.push(pageWithChildren);
      }
    }
  });

  // Sort by order
  const sortByOrder = (pages: PageWithChildren[]) => {
    pages.sort((a, b) => (a.order || 0) - (b.order || 0));
    pages.forEach(page => sortByOrder(page.children));
  };
  sortByOrder(rootPages);

  return rootPages;
}

// Flatten tree for rendering
function flattenPageTree(pages: PageWithChildren[], expandedPages: Set<string>): PageWithChildren[] {
  const result: PageWithChildren[] = [];

  const traverse = (page: PageWithChildren) => {
    result.push(page);
    if (expandedPages.has(page.id) && page.children.length > 0) {
      page.children.forEach(traverse);
    }
  };

  pages.forEach(traverse);
  return result;
}

export default function PageList({ onSelectPage, selectedPageId }: PageListProps) {
  const { currentWorkspace, pages, createPage, deletePage, updatePageTitle, canUserEdit, canAddChildPage } = useWorkspace();
  const [isCreating, setIsCreating] = useState(false);
  const [newPageTitle, setNewPageTitle] = useState('');
  const [editingPageId, setEditingPageId] = useState<string | null>(null);
  const [editPageTitle, setEditPageTitle] = useState('');
  const [creatingChildFor, setCreatingChildFor] = useState<string | null>(null);

  const canEdit = canUserEdit();

  const workspacePages = pages.filter(
    (page) => page.workspaceId === currentWorkspace?.id
  );

  // Build page tree
  const pageTree = useMemo(() => buildPageTree(workspacePages), [workspacePages]);

  // Track manually collapsed pages (all others are expanded by default)
  const [collapsedPages, setCollapsedPages] = useState<Set<string>>(new Set());

  // Derive expanded pages: all pages with children except manually collapsed ones
  const expandedPages = useMemo(() => {
    const ids = new Set<string>();
    const collectParents = (pages: PageWithChildren[]) => {
      pages.forEach(page => {
        if (page.children.length > 0 && !collapsedPages.has(page.id)) {
          ids.add(page.id);
          collectParents(page.children);
        }
      });
    };
    collectParents(pageTree);
    return ids;
  }, [pageTree, collapsedPages]);

  // Flatten tree for rendering
  const flatPages = useMemo(() => flattenPageTree(pageTree, expandedPages), [pageTree, expandedPages]);

  const handleCreatePage = (parentId?: string | null) => {
    if (!newPageTitle.trim()) return;

    const newPage = createPage(newPageTitle, parentId || null);
    setNewPageTitle('');
    setIsCreating(false);
    setCreatingChildFor(null);

    // Expand parent if creating child (remove from collapsed)
    if (parentId) {
      setCollapsedPages(prev => {
        const newSet = new Set(prev);
        newSet.delete(parentId);
        return newSet;
      });
    }

    onSelectPage(newPage);
  };

  const handleDeletePage = (pageId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this page and all its children?')) {
      deletePage(pageId);
    }
  };

  const handleEditPage = (page: Page, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingPageId(page.id);
    setEditPageTitle(page.title);
  };

  const handleSaveEdit = (pageId: string) => {
    if (editPageTitle.trim()) {
      updatePageTitle(pageId, editPageTitle);
    }
    setEditingPageId(null);
    setEditPageTitle('');
  };

  const handleCancelEdit = () => {
    setEditingPageId(null);
    setEditPageTitle('');
  };

  const toggleExpand = (pageId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCollapsedPages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(pageId)) {
        // Currently collapsed, so expand it (remove from collapsed set)
        newSet.delete(pageId);
      } else {
        // Currently expanded, so collapse it (add to collapsed set)
        newSet.add(pageId);
      }
      return newSet;
    });
  };

  const handleCreateChild = (parentId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCreatingChildFor(parentId);
    setIsCreating(true);
    // Expand parent (remove from collapsed)
    setCollapsedPages(prev => {
      const newSet = new Set(prev);
      newSet.delete(parentId);
      return newSet;
    });
  };

  if (!currentWorkspace) {
    return (
      <div className="p-4 text-center text-[#a0a0a0] text-xs">
        Select a workspace to view pages
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-2 py-1.5">
        <div className="flex items-center justify-between mb-1.5">
          <h3 className="text-[10px] font-medium text-[#9b9b9b] uppercase tracking-wide">Private</h3>
        </div>

        {/* Create Page Form */}
        {isCreating && (
          <div className="mt-1.5 p-2 bg-linear-to-br from-[#1f1f1f]/60 to-[#1a1a1a]/60 rounded-md border border-[#2a2a2a]/40 shadow-[0_2px_8px_rgba(0,0,0,0.3)]">
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
              className="w-full px-2 py-1.5 bg-[#191919]/80 text-[#e3e3e3] border border-[#2f2f2f]/60 rounded-md text-xs outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 placeholder-[#5a5a5a] shadow-[inset_0_1px_2px_rgba(0,0,0,0.3)] transition-all"
              autoFocus
            />
            <div className="flex gap-1 mt-1">
              <button
                onClick={() => handleCreatePage(creatingChildFor)}
                disabled={!newPageTitle.trim()}
                className="flex-1 px-2 py-1 bg-linear-to-r from-[#2f2f2f] to-[#3a3a3a] text-[#e3e3e3] rounded-md text-[10px] font-medium hover:from-[#3a3a3a] hover:to-[#454545] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-[0_2px_4px_rgba(0,0,0,0.2)] border border-[#3a3a3a]/40"
              >
                Create
              </button>
              <button
                onClick={() => {
                  setIsCreating(false);
                  setNewPageTitle('');
                  setCreatingChildFor(null);
                }}
                className="px-2 py-1 text-[#9b9b9b] rounded-md text-[10px] font-medium hover:bg-[#232323]/60 transition-all duration-200 border border-transparent hover:border-[#2a2a2a]/40"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Page List */}
      <div className="flex-1 overflow-y-auto px-1.5">
        <div className="space-y-0.5">
          {flatPages.map((page) => (
              <div
                key={page.id}
                style={{ paddingLeft: `${page.level * 16 + 6}px` }}
                className={`group flex items-center justify-between gap-1.5 pr-1.5 py-1 rounded-md transition-all duration-200 ${
                  editingPageId === page.id
                    ? 'bg-[#232323]/60'
                    : selectedPageId === page.id
                    ? 'text-[#e3e3e3] shadow-[inset_0_1px_2px_rgba(0,0,0,0.3)] hover:bg-[#232323]/60 bg-[#232323]/60 cursor-pointer'
                    : 'text-[#9b9b9b] hover:bg-[#232323]/60 hover:text-[#e3e3e3] hover:shadow-[0_2px_4px_rgba(0,0,0,0.2)] border border-transparent hover:border-[#2a2a2a]/40 cursor-pointer'
                }`}
                onClick={editingPageId === page.id ? undefined : () => onSelectPage(page)}
              >
                {editingPageId === page.id ? (
                  // Edit Mode
                  <div className="flex-1 flex items-center gap-1 py-0.5">
                    {/* Expand/Collapse placeholder */}
                    {page.children.length > 0 && <div className="w-3" />}
                    <div className="text-base opacity-70">{page.icon || <i className='bx bx-file-detail'></i>}</div>
                    <input
                      type="text"
                      value={editPageTitle}
                      onChange={(e) => setEditPageTitle(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveEdit(page.id);
                        if (e.key === 'Escape') handleCancelEdit();
                      }}
                      className="flex-1 px-1.5 py-0.5 bg-[#191919]/80 text-[#e3e3e3] border border-[#2f2f2f]/60 rounded text-xs outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30"
                      autoFocus
                      onClick={(e) => e.stopPropagation()}
                    />
                    <div className="flex items-center gap-0.5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSaveEdit(page.id);
                        }}
                        className="p-0.5 hover:text-green-400 transition-all duration-200 rounded hover:bg-green-900/20"
                        title="Save"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCancelEdit();
                        }}
                        className="p-0.5 hover:text-red-400 transition-all duration-200 rounded hover:bg-red-900/20"
                        title="Cancel"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <>
                    <div className='flex gap-1 items-center flex-1 min-w-0'>
                      {/* Expand/Collapse Button */}
                      {page.children.length > 0 ? (
                        <button
                          onClick={(e) => toggleExpand(page.id, e)}
                          className="w-3 h-3 flex items-center justify-center text-[#9b9b9b] hover:text-[#e3e3e3] transition-colors shrink-0"
                        >
                          <svg
                            className={`w-2.5 h-2.5 transition-transform duration-200 ${expandedPages.has(page.id) ? 'rotate-90' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      ) : (
                        <div className="w-3" />
                      )}

                      {/* Page Icon */}
                      <div className="text-base opacity-70 group-hover:scale-110 transition-transform duration-200 shrink-0">{page.icon || <i className='bx bx-file-detail'></i>}</div>

                      {/* Page Title */}
                      <div className="flex-1 min-w-0">
                        <div className="text-xs truncate font-normal">
                          {page.title || 'Untitled'}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-0.5">
                      {/* Add Child Button */}
                      {canEdit && canAddChildPage(page.id) && (
                        <button
                          onClick={(e) => handleCreateChild(page.id, e)}
                          className="opacity-0 group-hover:opacity-100 p-0.5 hover:text-green-400 transition-all duration-200 rounded hover:bg-green-900/20"
                          title="Add child page"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        </button>
                      )}
                      {/* Edit Button */}
                      {canEdit && (
                        <button
                          onClick={(e) => handleEditPage(page, e)}
                          className="opacity-0 group-hover:opacity-100 p-0.5 hover:text-blue-400 transition-all duration-200 rounded hover:bg-blue-900/20"
                          title="Edit page title"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>
                      )}

                      {/* Delete Button */}
                      {canEdit && (
                        <button
                          onClick={(e) => handleDeletePage(page.id, e)}
                          className="opacity-0 group-hover:opacity-100 p-0.5 hover:text-red-400 transition-all duration-200 rounded hover:bg-red-900/20"
                          title="Delete page"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  </>
                )}
              </div>
            ))}

            {/* Add New Button - Below last page */}
            {canEdit && (
              <button
                onClick={() => {
                  setIsCreating(true);
                  setCreatingChildFor(null);
                }}
                className="w-full flex items-center gap-1.5 px-1.5 py-1.5 text-[#9b9b9b] hover:text-[#e3e3e3] rounded-md hover:bg-[#232323]/60 transition-all duration-200 group mt-0.5"
              >
                <svg className="w-3.5 h-3.5 group-hover:rotate-90 transition-all duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="text-xs">Add new</span>
              </button>
            )}
          </div>
      </div>
    </div>
  );
}

