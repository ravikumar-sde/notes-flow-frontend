'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { WorkspaceProvider, useWorkspace } from '@/contexts/WorkspaceContext';
import WorkspaceSidebar from '@/components/workspace/WorkspaceSidebar';
import PageEditor from '@/components/PageEditor';
import { Page } from '@/types/blocks';
import { isAuthenticated, getUser } from '@/lib/auth';

function WorkspaceContent() {
  const { workspaces, pages, currentWorkspace, setCurrentWorkspace, createPage } = useWorkspace();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedPage, setSelectedPage] = useState<Page | null>(null);
  const hasAutoSelectedRef = useRef(false);

  // Auto-select first workspace on mount
  useEffect(() => {
    if (!hasAutoSelectedRef.current && workspaces.length > 0 && !currentWorkspace) {
      hasAutoSelectedRef.current = true;
      setCurrentWorkspace(workspaces[0]);
    }
  }, [workspaces, currentWorkspace, setCurrentWorkspace]);

  // Auto-select or create first page when workspace is set
  useEffect(() => {
    if (currentWorkspace && !selectedPage) {
      // Get pages for current workspace
      let workspacePages = pages.filter(p => p.workspaceId === currentWorkspace.id);

      // If no pages exist, create a sample empty page
      if (workspacePages.length === 0) {
        const newPage = createPage('Untitled');
        workspacePages = [newPage];
      }

      // Select the first page
      if (workspacePages.length > 0) {
        // Use setTimeout to avoid setState in effect warning
        setTimeout(() => setSelectedPage(workspacePages[0]), 0);
      }
    }
  }, [currentWorkspace, pages, selectedPage, createPage]);

  return (
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
  );
}

export default function WorkspacePage() {
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string>('');

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = () => {
      if (!isAuthenticated()) {
        router.push('/auth/login');
        return;
      }

      try {
        const user = getUser();
        if (user && user.id) {
          setCurrentUserId(user.id);
        } else {
          router.push('/auth/login');
        }
      } catch (error) {
        console.error('Failed to get user:', error);
        router.push('/auth/login');
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuth();
  }, [router]);

  // Show loading state while checking authentication
  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center h-screen bg-linear-to-br from-[#0f0f0f] via-[#0f0f0f] to-[#1a1a1a]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#2a2a2a] border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#a0a0a0]">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated
  if (!currentUserId) {
    return null;
  }

  return (
    <WorkspaceProvider initialUserId={currentUserId}>
      <WorkspaceContent />
    </WorkspaceProvider>
  );
}

