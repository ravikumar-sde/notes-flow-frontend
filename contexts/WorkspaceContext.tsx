'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Workspace, WorkspaceInvitation, MemberRole, Permission } from '@/types/workspace';
import { Page } from '@/types/blocks';
import {
  createWorkspace,
  addMemberToWorkspace,
  removeMemberFromWorkspace,
  updateMember,
  createInvitation,
  acceptInvitation,
  declineInvitation,
} from '@/lib/workspaceUtils';
import { getUserPermissions } from '@/lib/permissions';

interface WorkspaceContextType {
  // Current state
  workspaces: Workspace[];
  currentWorkspace: Workspace | null;
  currentUserId: string;
  pages: Page[];
  invitations: WorkspaceInvitation[];

  // Workspace actions
  setCurrentWorkspace: (workspace: Workspace | null) => void;
  createNewWorkspace: (name: string, description?: string, icon?: string) => Workspace;
  updateWorkspaceName: (workspaceId: string, name: string) => void;
  deleteWorkspace: (workspaceId: string) => void;

  // Member actions
  inviteMember: (email: string, role: MemberRole, permissions: Permission[]) => void;
  removeMember: (memberId: string) => void;
  updateMemberRole: (memberId: string, role: MemberRole, permissions: Permission[]) => void;

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
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(null);
  const [pages, setPages] = useState<Page[]>([]);
  const [invitations, setInvitations] = useState<WorkspaceInvitation[]>([]);
  const [currentUserId] = useState(initialUserId);

  // Create new workspace
  const createNewWorkspace = useCallback((name: string, description?: string, icon?: string) => {
    const newWorkspace = createWorkspace({
      name,
      description,
      icon,
      ownerId: currentUserId,
    });

    setWorkspaces((prev) => [...prev, newWorkspace]);
    setCurrentWorkspace(newWorkspace);
    return newWorkspace;
  }, [currentUserId]);

  // Update workspace name
  const updateWorkspaceName = useCallback((workspaceId: string, name: string) => {
    setWorkspaces((prev) =>
      prev.map((ws) =>
        ws.id === workspaceId
          ? { ...ws, name, updatedAt: new Date() }
          : ws
      )
    );

    if (currentWorkspace?.id === workspaceId) {
      setCurrentWorkspace((prev) =>
        prev ? { ...prev, name, updatedAt: new Date() } : null
      );
    }
  }, [currentWorkspace]);

  // Delete workspace
  const deleteWorkspace = useCallback((workspaceId: string) => {
    setWorkspaces((prev) => prev.filter((ws) => ws.id !== workspaceId));
    
    if (currentWorkspace?.id === workspaceId) {
      setCurrentWorkspace(null);
    }

    // Remove pages belonging to this workspace
    setPages((prev) => prev.filter((page) => page.workspaceId !== workspaceId));
  }, [currentWorkspace]);

  // Invite member
  const inviteMember = useCallback((email: string, role: MemberRole, permissions: Permission[]) => {
    if (!currentWorkspace) return;

    const invitation = createInvitation({
      workspaceId: currentWorkspace.id,
      email,
      role,
      permissions,
      invitedBy: currentUserId,
    });

    setInvitations((prev) => [...prev, invitation]);
  }, [currentWorkspace, currentUserId]);

  // Remove member
  const removeMember = useCallback((memberId: string) => {
    if (!currentWorkspace) return;

    const updatedWorkspace = removeMemberFromWorkspace(currentWorkspace, memberId);
    setCurrentWorkspace(updatedWorkspace);
    setWorkspaces((prev) =>
      prev.map((ws) => (ws.id === updatedWorkspace.id ? updatedWorkspace : ws))
    );
  }, [currentWorkspace]);

  // Update member role
  const updateMemberRole = useCallback((memberId: string, role: MemberRole, permissions: Permission[]) => {
    if (!currentWorkspace) return;

    const updatedWorkspace = updateMember(currentWorkspace, {
      memberId,
      role,
      permissions,
    });

    setCurrentWorkspace(updatedWorkspace);
    setWorkspaces((prev) =>
      prev.map((ws) => (ws.id === updatedWorkspace.id ? updatedWorkspace : ws))
    );
  }, [currentWorkspace]);

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
      id: `page_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
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
    setCurrentWorkspace,
    createNewWorkspace,
    updateWorkspaceName,
    deleteWorkspace,
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

