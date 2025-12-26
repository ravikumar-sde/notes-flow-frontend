import {
  Workspace,
  WorkspaceMember,
  WorkspaceInvitation,
  CreateWorkspaceInput,
  InviteMemberInput,
  UpdateMemberInput,
  MemberRole,
  ROLE_PERMISSIONS,
  Permission,
} from '@/types/workspace';

/**
 * Generate unique ID for workspace
 */
export function generateWorkspaceId(): string {
  return `workspace_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Generate unique ID for member
 */
export function generateMemberId(): string {
  return `member_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Generate unique ID for invitation
 */
export function generateInvitationId(): string {
  return `invitation_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Generate unique invitation token
 */
export function generateInvitationToken(): string {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 16)}`;
}

/**
 * Create a new workspace
 */
export function createWorkspace(input: CreateWorkspaceInput): Workspace {
  const now = new Date();
  const workspaceId = generateWorkspaceId();

  // Create owner as first member
  const ownerMember: WorkspaceMember = {
    id: generateMemberId(),
    workspaceId,
    userId: input.ownerId,
    email: '', // Should be provided from user data
    name: '', // Should be provided from user data
    role: 'owner',
    permissions: ROLE_PERMISSIONS.owner,
    joinedAt: now,
    lastActiveAt: now,
  };

  return {
    id: workspaceId,
    name: input.name,
    description: input.description,
    icon: input.icon,
    ownerId: input.ownerId,
    members: [ownerMember],
    createdAt: now,
    updatedAt: now,
    settings: {
      allowGuestInvites: true,
      defaultPermission: 'can_view',
      requireApproval: false,
      publicPages: false,
    },
  };
}

/**
 * Create an invitation
 */
export function createInvitation(input: InviteMemberInput): WorkspaceInvitation {
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days

  return {
    id: generateInvitationId(),
    workspaceId: input.workspaceId,
    email: input.email,
    role: input.role,
    permissions: input.permissions,
    invitedBy: input.invitedBy,
    invitedByName: '', // Should be fetched from user data
    status: 'pending',
    createdAt: now,
    expiresAt,
    token: generateInvitationToken(),
  };
}

/**
 * Add member to workspace
 */
export function addMemberToWorkspace(
  workspace: Workspace,
  userId: string,
  email: string,
  name: string,
  role: MemberRole,
  permissions: Permission[]
): Workspace {
  const newMember: WorkspaceMember = {
    id: generateMemberId(),
    workspaceId: workspace.id,
    userId,
    email,
    name,
    role,
    permissions,
    joinedAt: new Date(),
  };

  return {
    ...workspace,
    members: [...(workspace.members || []), newMember],
    updatedAt: new Date(),
  };
}

/**
 * Remove member from workspace
 */
export function removeMemberFromWorkspace(
  workspace: Workspace,
  memberId: string
): Workspace {
  return {
    ...workspace,
    members: (workspace.members || []).filter((m) => m.id !== memberId),
    updatedAt: new Date(),
  };
}

/**
 * Update member role and permissions
 */
export function updateMember(
  workspace: Workspace,
  input: UpdateMemberInput
): Workspace {
  return {
    ...workspace,
    members: (workspace.members || []).map((member) =>
      member.id === input.memberId
        ? {
            ...member,
            role: input.role ?? member.role,
            permissions: input.permissions ?? member.permissions,
          }
        : member
    ),
    updatedAt: new Date(),
  };
}

/**
 * Check if invitation is valid (not expired, pending)
 */
export function isInvitationValid(invitation: WorkspaceInvitation): boolean {
  const now = new Date();
  return (
    invitation.status === 'pending' &&
    invitation.expiresAt > now
  );
}

/**
 * Accept invitation
 */
export function acceptInvitation(invitation: WorkspaceInvitation): WorkspaceInvitation {
  return {
    ...invitation,
    status: 'accepted',
    acceptedAt: new Date(),
  };
}

/**
 * Decline invitation
 */
export function declineInvitation(invitation: WorkspaceInvitation): WorkspaceInvitation {
  return {
    ...invitation,
    status: 'declined',
  };
}

