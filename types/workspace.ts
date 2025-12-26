// Workspace types for multi-tenant functionality

// Permission levels for workspace members
export type Permission = 'can_edit' | 'can_view' | 'can_comment';

// Member roles in workspace
export type MemberRole = 'owner' | 'admin' | 'member' | 'guest';

// Invitation status
export type InvitationStatus = 'pending' | 'accepted' | 'declined' | 'expired';

// Base workspace member interface
export interface WorkspaceMember {
  id: string;
  workspaceId: string;
  userId: string;
  email: string;
  name: string;
  role: MemberRole;
  permissions: Permission[];
  joinedAt: Date;
  lastActiveAt?: Date;
  avatar?: string;
}

// Workspace invitation interface
export interface WorkspaceInvitation {
  id: string;
  workspaceId: string;
  email: string;
  role: MemberRole;
  permissions: Permission[];
  invitedBy: string; // userId of inviter
  invitedByName: string;
  status: InvitationStatus;
  createdAt: Date;
  expiresAt: Date;
  acceptedAt?: Date;
  token: string; // unique invitation token
}

// Workspace interface
export interface Workspace {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  ownerId: string;
  members?: WorkspaceMember[]; // Optional as API might not always include members
  createdAt: Date;
  updatedAt: Date;
  settings?: WorkspaceSettings; // Optional as API might not always include settings
  role?: MemberRole; // Current user's role in this workspace
}

// Workspace settings
export interface WorkspaceSettings {
  allowGuestInvites: boolean;
  defaultPermission: Permission;
  requireApproval: boolean;
  publicPages: boolean;
}

// Permission check result
export interface PermissionCheck {
  canEdit: boolean;
  canView: boolean;
  canComment: boolean;
  canInvite: boolean;
  canManageMembers: boolean;
  canDelete: boolean;
}

// Role permissions mapping
export const ROLE_PERMISSIONS: Record<MemberRole, Permission[]> = {
  owner: ['can_edit', 'can_view', 'can_comment'],
  admin: ['can_edit', 'can_view', 'can_comment'],
  member: ['can_edit', 'can_view', 'can_comment'],
  guest: ['can_view', 'can_comment'],
};

// Role capabilities (what actions each role can perform)
export const ROLE_CAPABILITIES: Record<MemberRole, {
  canInvite: boolean;
  canManageMembers: boolean;
  canDeleteWorkspace: boolean;
  canEditSettings: boolean;
}> = {
  owner: {
    canInvite: true,
    canManageMembers: true,
    canDeleteWorkspace: true,
    canEditSettings: true,
  },
  admin: {
    canInvite: true,
    canManageMembers: true,
    canDeleteWorkspace: false,
    canEditSettings: true,
  },
  member: {
    canInvite: true,
    canManageMembers: false,
    canDeleteWorkspace: false,
    canEditSettings: false,
  },
  guest: {
    canInvite: false,
    canManageMembers: false,
    canDeleteWorkspace: false,
    canEditSettings: false,
  },
};

// Helper type for creating new workspace
export interface CreateWorkspaceInput {
  name: string;
  description?: string;
  icon?: string;
  ownerId: string;
}

// Helper type for inviting members
export interface InviteMemberInput {
  workspaceId: string;
  email: string;
  role: MemberRole;
  permissions: Permission[];
  invitedBy: string;
}

// Helper type for updating member
export interface UpdateMemberInput {
  memberId: string;
  role?: MemberRole;
  permissions?: Permission[];
}

