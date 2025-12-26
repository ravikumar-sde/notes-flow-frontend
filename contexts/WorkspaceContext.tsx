'use client';

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Workspace, WorkspaceInvitation, MemberRole, Permission } from '@/types/workspace';
import { Page } from '@/types/blocks';
import {
  createInvitation,
  acceptInvitation,
  declineInvitation,
} from '@/lib/workspaceUtils';
import { getUserPermissions } from '@/lib/permissions';
import { logout, isAuthenticated } from '@/lib/auth';
import * as workspaceApi from '@/lib/workspaceApi';
import { ApiError } from '@/lib/api';
import Toast from '@/components/ui/Toast';

/**
 * Normalize workspace data to ensure all required fields are present
 */
function normalizeWorkspace(workspace: Workspace): Workspace {
  return {
    ...workspace,
    members: workspace.members || [],
    settings: workspace.settings || {
      allowGuestInvites: true,
      defaultPermission: 'can_view' as const,
      requireApproval: false,
      publicPages: false,
    },
  };
}

interface WorkspaceContextType {
  // Current state
  workspaces: Workspace[];
  currentWorkspace: Workspace | null;
  currentUserId: string;
  pages: Page[];
  invitations: WorkspaceInvitation[];

  // Loading and error states
  isLoading: boolean;
  error: string | null;

  // Workspace actions
  setCurrentWorkspace: (workspace: Workspace | null) => void;
  createNewWorkspace: (name: string, description?: string, icon?: string) => Promise<Workspace>;
  updateWorkspaceName: (workspaceId: string, name: string) => Promise<void>;
  updateWorkspace: (workspaceId: string, name: string, description?: string) => Promise<void>;
  deleteWorkspace: (workspaceId: string) => Promise<void>;
  refreshWorkspaces: () => Promise<void>;

  // Member actions
  inviteMember: (email: string, role: MemberRole, permissions: Permission[]) => Promise<void>;
  removeMember: (memberId: string) => Promise<void>;
  updateMemberRole: (memberId: string, role: MemberRole, permissions: Permission[]) => Promise<void>;

  // Invitation actions
  acceptWorkspaceInvitation: (invitationId: string) => void;
  declineWorkspaceInvitation: (invitationId: string) => void;

  // Page actions
  createPage: (title: string) => Page;
  deletePage: (pageId: string) => void;
  updatePageTitle: (pageId: string, title: string) => void;

  // Permission checks
  canUserEdit: () => boolean;
  canUserView: () => boolean;
  canUserComment: () => boolean;
  canUserInvite: () => boolean;
  canUserManageMembers: () => boolean;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

interface WorkspaceProviderProps {
  children: ReactNode;
  initialUserId: string;
}

export function WorkspaceProvider({ children, initialUserId }: WorkspaceProviderProps) {
  const router = useRouter();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(null);
  const [pages, setPages] = useState<Page[]>([]);
  const [invitations, setInvitations] = useState<WorkspaceInvitation[]>([]);
  const [currentUserId] = useState(initialUserId);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAuthErrorToast, setShowAuthErrorToast] = useState(false);

  // Handle authentication errors
  const handleAuthError = useCallback(() => {
    // Set a user-friendly error message
    setError('Your session has expired. Please log in again.');

    // Show toast notification
    setShowAuthErrorToast(true);

    // Clear auth data
    logout();

    // Redirect to login after a brief delay to show the message
    setTimeout(() => {
      router.push('/auth/login');
    }, 2000);
  }, [router]);

  // Handle API errors consistently
  const handleApiError = useCallback((err: unknown, defaultMessage: string): never => {
    // Handle authentication errors
    if (err instanceof ApiError && (err.statusCode === 401 || err.statusCode === 403)) {
      console.error('Authentication error:', err);
      handleAuthError();
      throw err;
    }

    const errorMessage = err instanceof Error ? err.message : defaultMessage;
    setError(errorMessage);
    console.error(defaultMessage, err);
    throw err;
  }, [handleAuthError]);

  // Fetch workspaces on mount
  useEffect(() => {
    // Only fetch if authenticated
    if (isAuthenticated()) {
      refreshWorkspaces();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Refresh workspaces from API
  const refreshWorkspaces = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const fetchedWorkspaces = await workspaceApi.listWorkspaces();

      console.log("FETCHED WORKSPACES:", fetchedWorkspaces);

      // Normalize all workspaces
      const normalizedWorkspaces = fetchedWorkspaces.map(normalizeWorkspace);

      setWorkspaces(normalizedWorkspaces);
    } catch (err) {
      // Handle authentication errors specially - don't throw
      if (err instanceof ApiError && (err.statusCode === 401 || err.statusCode === 403)) {
        console.error('Authentication error:', err);
        handleAuthError();
        return;
      }

      const errorMessage = err instanceof Error ? err.message : 'Failed to load workspaces';
      setError(errorMessage);
      console.error('Error fetching workspaces:', err);
    } finally {
      setIsLoading(false);
    }
  }, [handleAuthError]);

  // Create new workspace
  const createNewWorkspace = useCallback(async (name: string, description?: string, icon?: string): Promise<Workspace> => {
    try {
      setIsLoading(true);
      setError(null);

      const newWorkspace = await workspaceApi.createWorkspace({
        name,
        description,
        icon,
      });

      // Normalize the workspace data
      const normalizedWorkspace = normalizeWorkspace(newWorkspace);

      setWorkspaces((prev) => [...prev, normalizedWorkspace]);
      setCurrentWorkspace(normalizedWorkspace);
      return normalizedWorkspace;
    } catch (err) {
      return handleApiError(err, 'Failed to create workspace');
    } finally {
      setIsLoading(false);
    }
  }, [handleApiError]);

  // Update workspace name
  const updateWorkspaceName = useCallback(async (workspaceId: string, name: string): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      const updatedWorkspace = await workspaceApi.updateWorkspace(workspaceId, { name });
      const normalizedWorkspace = normalizeWorkspace(updatedWorkspace);

      setWorkspaces((prev) =>
        prev.map((ws) => (ws.id === workspaceId ? normalizedWorkspace : ws))
      );

      if (currentWorkspace?.id === workspaceId) {
        setCurrentWorkspace(normalizedWorkspace);
      }
    } catch (err) {
      handleApiError(err, 'Failed to update workspace');
    } finally {
      setIsLoading(false);
    }
  }, [currentWorkspace, handleApiError]);

  // Update workspace (name and description)
  const updateWorkspace = useCallback(async (workspaceId: string, name: string, description?: string): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      const updatedWorkspace = await workspaceApi.updateWorkspace(workspaceId, {
        name,
        description,
      });
      const normalizedWorkspace = normalizeWorkspace(updatedWorkspace);

      setWorkspaces((prev) =>
        prev.map((ws) => (ws.id === workspaceId ? normalizedWorkspace : ws))
      );

      if (currentWorkspace?.id === workspaceId) {
        setCurrentWorkspace(normalizedWorkspace);
      }
    } catch (err) {
      handleApiError(err, 'Failed to update workspace');
    } finally {
      setIsLoading(false);
    }
  }, [currentWorkspace, handleApiError]);

  // Delete workspace
  const deleteWorkspace = useCallback(async (workspaceId: string): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      await workspaceApi.deleteWorkspace(workspaceId);

      setWorkspaces((prev) => prev.filter((ws) => ws.id !== workspaceId));

      if (currentWorkspace?.id === workspaceId) {
        setCurrentWorkspace(null);
      }

      // Remove pages belonging to this workspace
      setPages((prev) => prev.filter((page) => page.workspaceId !== workspaceId));
    } catch (err) {
      handleApiError(err, 'Failed to delete workspace');
    } finally {
      setIsLoading(false);
    }
  }, [currentWorkspace, handleApiError]);

  // Invite member
  const inviteMember = useCallback(async (email: string, role: MemberRole, permissions: Permission[]): Promise<void> => {
    if (!currentWorkspace) return;

    try {
      setIsLoading(true);
      setError(null);

      await workspaceApi.inviteMemberToWorkspace(currentWorkspace.id, {
        email,
        role,
        permissions,
      });

      // Create local invitation for UI (in real app, this would come from backend)
      const invitation = createInvitation({
        workspaceId: currentWorkspace.id,
        email,
        role,
        permissions,
        invitedBy: currentUserId,
      });

      setInvitations((prev) => [...prev, invitation]);

      // Refresh workspaces to get updated member list
      await refreshWorkspaces();
    } catch (err) {
      handleApiError(err, 'Failed to invite member');
    } finally {
      setIsLoading(false);
    }
  }, [currentWorkspace, currentUserId, refreshWorkspaces, handleApiError]);

  // Remove member
  const removeMember = useCallback(async (memberId: string): Promise<void> => {
    if (!currentWorkspace) return;

    try {
      setIsLoading(true);
      setError(null);

      await workspaceApi.removeMemberFromWorkspace(currentWorkspace.id, memberId);

      // Refresh workspaces to get updated member list
      await refreshWorkspaces();

      // Update current workspace
      const updatedWorkspace = workspaces.find(ws => ws.id === currentWorkspace.id);
      if (updatedWorkspace) {
        setCurrentWorkspace(updatedWorkspace);
      }
    } catch (err) {
      handleApiError(err, 'Failed to remove member');
    } finally {
      setIsLoading(false);
    }
  }, [currentWorkspace, workspaces, refreshWorkspaces, handleApiError]);

  // Update member role
  const updateMemberRole = useCallback(async (memberId: string, role: MemberRole, permissions: Permission[]): Promise<void> => {
    if (!currentWorkspace) return;

    try {
      setIsLoading(true);
      setError(null);

      await workspaceApi.updateWorkspaceMember(currentWorkspace.id, memberId, {
        role,
        permissions,
      });

      // Refresh workspaces to get updated member list
      await refreshWorkspaces();

      // Update current workspace
      const updatedWorkspace = workspaces.find(ws => ws.id === currentWorkspace.id);
      if (updatedWorkspace) {
        setCurrentWorkspace(updatedWorkspace);
      }
    } catch (err) {
      handleApiError(err, 'Failed to update member');
    } finally {
      setIsLoading(false);
    }
  }, [currentWorkspace, workspaces, refreshWorkspaces, handleApiError]);

  // Accept invitation (simplified - in real app would need backend)
  const acceptWorkspaceInvitation = useCallback((invitationId: string) => {
    const invitation = invitations.find((inv) => inv.id === invitationId);
    if (!invitation) return;

    const acceptedInvitation = acceptInvitation(invitation);
    setInvitations((prev) =>
      prev.map((inv) => (inv.id === invitationId ? acceptedInvitation : inv))
    );

    // Add user to workspace (in real app, this would be done on backend)
    // For now, we'll just update the invitation status
  }, [invitations]);

  // Decline invitation
  const declineWorkspaceInvitation = useCallback((invitationId: string) => {
    const invitation = invitations.find((inv) => inv.id === invitationId);
    if (!invitation) return;

    const declinedInvitation = declineInvitation(invitation);
    setInvitations((prev) =>
      prev.map((inv) => (inv.id === invitationId ? declinedInvitation : inv))
    );
  }, [invitations]);

  // Create page (continued in next section due to line limit)
  const createPage = useCallback((title: string): Page => {
    if (!currentWorkspace) {
      throw new Error('No workspace selected');
    }

    const newPage: Page = {
      id: `page_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
      workspaceId: currentWorkspace.id,
      title,
      blocks: [],
      createdBy: currentUserId,
      createdAt: new Date(),
      updatedAt: new Date(),
      isPublic: false,
    };

    setPages((prev) => [...prev, newPage]);
    return newPage;
  }, [currentWorkspace, currentUserId]);

  // Delete page
  const deletePage = useCallback((pageId: string) => {
    setPages((prev) => prev.filter((page) => page.id !== pageId));
  }, []);

  // Update page title
  const updatePageTitle = useCallback((pageId: string, title: string) => {
    setPages((prev) =>
      prev.map((page) =>
        page.id === pageId
          ? { ...page, title, updatedAt: new Date(), updatedBy: currentUserId }
          : page
      )
    );
  }, [currentUserId]);

  // Permission checks
  const canUserEdit = useCallback(() => {
    if (!currentWorkspace) return false;
    return getUserPermissions(currentWorkspace, currentUserId).canEdit;
  }, [currentWorkspace, currentUserId]);

  const canUserView = useCallback(() => {
    if (!currentWorkspace) return false;
    return getUserPermissions(currentWorkspace, currentUserId).canView;
  }, [currentWorkspace, currentUserId]);

  const canUserComment = useCallback(() => {
    if (!currentWorkspace) return false;
    return getUserPermissions(currentWorkspace, currentUserId).canComment;
  }, [currentWorkspace, currentUserId]);

  const canUserInvite = useCallback(() => {
    if (!currentWorkspace) return false;
    return getUserPermissions(currentWorkspace, currentUserId).canInvite;
  }, [currentWorkspace, currentUserId]);

  const canUserManageMembers = useCallback(() => {
    if (!currentWorkspace) return false;
    return getUserPermissions(currentWorkspace, currentUserId).canManageMembers;
  }, [currentWorkspace, currentUserId]);

  const value: WorkspaceContextType = {
    workspaces,
    currentWorkspace,
    currentUserId,
    pages,
    invitations,
    isLoading,
    error,
    setCurrentWorkspace,
    createNewWorkspace,
    updateWorkspaceName,
    updateWorkspace,
    deleteWorkspace,
    refreshWorkspaces,
    inviteMember,
    removeMember,
    updateMemberRole,
    acceptWorkspaceInvitation,
    declineWorkspaceInvitation,
    createPage,
    deletePage,
    updatePageTitle,
    canUserEdit,
    canUserView,
    canUserComment,
    canUserInvite,
    canUserManageMembers,
  };

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
      {showAuthErrorToast && (
        <Toast
          message="Your session has expired. Redirecting to login..."
          type="error"
          duration={2000}
          onClose={() => setShowAuthErrorToast(false)}
        />
      )}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (context === undefined) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
}

