import {
  Workspace,
  WorkspaceMember,
  Permission,
  MemberRole,
  PermissionCheck,
  ROLE_CAPABILITIES,
  ROLE_PERMISSIONS,
} from '@/types/workspace';

/**
 * Check if a user has a specific permission in a workspace
 */
export function hasPermission(
  workspace: Workspace,
  userId: string,
  permission: Permission
): boolean {
  if (!workspace.members) return false;

  const member = workspace.members.find((m) => m.userId === userId);
  if (!member) return false;

  return member.permissions.includes(permission);
}

/**
 * Check if a user can edit content in a workspace
 */
export function canEdit(workspace: Workspace, userId: string): boolean {
  return hasPermission(workspace, userId, 'can_edit');
}

/**
 * Check if a user can view content in a workspace
 */
export function canView(workspace: Workspace, userId: string): boolean {
  return hasPermission(workspace, userId, 'can_view');
}

/**
 * Check if a user can comment on content in a workspace
 */
export function canComment(workspace: Workspace, userId: string): boolean {
  return hasPermission(workspace, userId, 'can_comment');
}

/**
 * Get all permissions for a user in a workspace
 */
export function getUserPermissions(
  workspace: Workspace,
  userId: string
): PermissionCheck {
  // If workspace has a role field (from API), use it directly
  if (workspace.role) {
    const capabilities = ROLE_CAPABILITIES[workspace.role];
    const permissions = ROLE_PERMISSIONS[workspace.role];

    return {
      canEdit: permissions.includes('can_edit'),
      canView: permissions.includes('can_view'),
      canComment: permissions.includes('can_comment'),
      canInvite: capabilities.canInvite,
      canManageMembers: capabilities.canManageMembers,
      canDelete: capabilities.canDeleteWorkspace,
    };
  }

  // Fallback to members array for backwards compatibility
  if (!workspace.members || workspace.members.length === 0) {
    return {
      canEdit: false,
      canView: false,
      canComment: false,
      canInvite: false,
      canManageMembers: false,
      canDelete: false,
    };
  }

  const member = workspace.members.find((m) => m.userId === userId);

  if (!member) {
    return {
      canEdit: false,
      canView: false,
      canComment: false,
      canInvite: false,
      canManageMembers: false,
      canDelete: false,
    };
  }

  const capabilities = ROLE_CAPABILITIES[member.role];

  return {
    canEdit: member.permissions.includes('can_edit'),
    canView: member.permissions.includes('can_view'),
    canComment: member.permissions.includes('can_comment'),
    canInvite: capabilities.canInvite,
    canManageMembers: capabilities.canManageMembers,
    canDelete: capabilities.canDeleteWorkspace,
  };
}

/**
 * Check if a user is the workspace owner
 */
export function isWorkspaceOwner(workspace: Workspace, userId: string): boolean {
  // If workspace has a role field, check if it's owner
  if (workspace.role) {
    return workspace.role === 'owner';
  }
  // Fallback to checking ownerId
  return workspace.ownerId === userId;
}

/**
 * Check if a user is an admin or owner
 */
export function isAdminOrOwner(workspace: Workspace, userId: string): boolean {
  // If workspace has a role field, check it directly
  if (workspace.role) {
    return workspace.role === 'owner' || workspace.role === 'admin';
  }

  // Fallback to members array
  if (!workspace.members) return false;

  const member = workspace.members.find((m) => m.userId === userId);
  if (!member) return false;

  return member.role === 'owner' || member.role === 'admin';
}

/**
 * Get member by user ID
 */
export function getMember(
  workspace: Workspace,
  userId: string
): WorkspaceMember | undefined {
  return workspace.members?.find((m) => m.userId === userId);
}

/**
 * Get member role
 */
export function getMemberRole(
  workspace: Workspace,
  userId: string
): MemberRole | null {
  const member = getMember(workspace, userId);
  return member ? member.role : null;
}

/**
 * Check if user can invite members
 */
export function canInviteMembers(workspace: Workspace, userId: string): boolean {
  const member = getMember(workspace, userId);
  if (!member) return false;

  return ROLE_CAPABILITIES[member.role].canInvite;
}

/**
 * Check if user can manage members (change roles, remove members)
 */
export function canManageMembers(workspace: Workspace, userId: string): boolean {
  const member = getMember(workspace, userId);
  if (!member) return false;

  return ROLE_CAPABILITIES[member.role].canManageMembers;
}

/**
 * Check if user can edit workspace settings
 */
export function canEditSettings(workspace: Workspace, userId: string): boolean {
  const member = getMember(workspace, userId);
  if (!member) return false;

  return ROLE_CAPABILITIES[member.role].canEditSettings;
}

/**
 * Get default permissions for a role
 */
export function getDefaultPermissions(role: MemberRole): Permission[] {
  return [...ROLE_PERMISSIONS[role]];
}

