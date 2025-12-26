/**
 * Workspace API Service
 * Handles all workspace-related API calls
 */

import { get, post, put, del } from './api';
import { getToken } from './auth';
import { Workspace, MemberRole, Permission } from '@/types/workspace';

export interface CreateWorkspaceRequest {
  name: string;
  description?: string;
  icon?: string;
}

export interface UpdateWorkspaceRequest {
  name?: string;
  description?: string;
  icon?: string;
}

export interface InviteMemberRequest {
  email: string;
  role: MemberRole;
  permissions: Permission[];
}

export interface UpdateMemberRequest {
  role?: MemberRole;
  permissions?: Permission[];
}

// API response types (snake_case from backend)
interface WorkspaceApiResponse {
  id: string;
  name: string;
  slug: string;
  owner_id: string;
  created_at: string;
  description?: string;
  icon?: string;
  updated_at?: string;
  role: MemberRole;
}

export interface WorkspaceResponse {
  workspace: WorkspaceApiResponse;
}

export interface WorkspacesListResponse {
  workspaces: WorkspaceApiResponse[];
  source?: string;
}

/**
 * Transform API response to frontend Workspace type
 */
function transformWorkspace(apiWorkspace: WorkspaceApiResponse): Workspace {
  return {
    id: apiWorkspace.id,
    name: apiWorkspace.name,
    description: apiWorkspace.description,
    icon: apiWorkspace.icon,
    ownerId: apiWorkspace.owner_id,
    createdAt: new Date(apiWorkspace.created_at),
    updatedAt: apiWorkspace.updated_at ? new Date(apiWorkspace.updated_at) : new Date(apiWorkspace.created_at),
    role: apiWorkspace.role,
    // Members will be populated separately if needed
    members: [],
    // Default settings
    settings: {
      allowGuestInvites: true,
      defaultPermission: 'can_view',
      requireApproval: false,
      publicPages: false,
    },
  };
}

/**
 * Get all workspaces for the current user
 */
export async function listWorkspaces(): Promise<Workspace[]> {
  const token = getToken();
  if (!token) {
    throw new Error('Not authenticated');
  }

  const response = await get<WorkspacesListResponse>('/api/v1/workspaces', token);
  return response.workspaces.map(transformWorkspace);
}

/**
 * Get a specific workspace by ID
 */
export async function getWorkspace(workspaceId: string): Promise<Workspace> {
  const token = getToken();
  if (!token) {
    throw new Error('Not authenticated');
  }

  const response = await get<WorkspaceResponse>(`/api/v1/workspaces/${workspaceId}`, token);
  return transformWorkspace(response.workspace);
}

/**
 * Create a new workspace
 */
export async function createWorkspace(data: CreateWorkspaceRequest): Promise<Workspace> {
  const token = getToken();
  if (!token) {
    throw new Error('Not authenticated');
  }

  const response = await post<WorkspaceResponse>('/api/v1/workspaces', data, token);
  return transformWorkspace(response.workspace);
}

/**
 * Update an existing workspace
 */
export async function updateWorkspace(
  workspaceId: string,
  data: UpdateWorkspaceRequest
): Promise<Workspace> {
  const token = getToken();
  if (!token) {
    throw new Error('Not authenticated');
  }

  const response = await put<WorkspaceResponse>(
    `/api/v1/workspaces/${workspaceId}`,
    data,
    token
  );
  return transformWorkspace(response.workspace);
}

/**
 * Delete a workspace
 */
export async function deleteWorkspace(workspaceId: string): Promise<void> {
  const token = getToken();
  if (!token) {
    throw new Error('Not authenticated');
  }

  await del(`/api/v1/workspaces/${workspaceId}`, token);
}

/**
 * Invite a member to a workspace
 */
export async function inviteMemberToWorkspace(
  workspaceId: string,
  data: InviteMemberRequest
): Promise<void> {
  const token = getToken();
  if (!token) {
    throw new Error('Not authenticated');
  }

  await post(`/api/v1/workspaces/${workspaceId}/members/invite`, data, token);
}

/**
 * Remove a member from a workspace
 */
export async function removeMemberFromWorkspace(
  workspaceId: string,
  memberId: string
): Promise<void> {
  const token = getToken();
  if (!token) {
    throw new Error('Not authenticated');
  }

  await del(`/api/v1/workspaces/${workspaceId}/members/${memberId}`, token);
}

/**
 * Update a member's role and permissions
 */
export async function updateWorkspaceMember(
  workspaceId: string,
  memberId: string,
  data: UpdateMemberRequest
): Promise<void> {
  const token = getToken();
  if (!token) {
    throw new Error('Not authenticated');
  }

  await put(`/api/v1/workspaces/${workspaceId}/members/${memberId}`, data, token);
}

