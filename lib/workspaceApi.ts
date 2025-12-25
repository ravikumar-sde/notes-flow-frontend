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

export interface WorkspaceResponse {
  workspace: Workspace;
}

export interface WorkspacesListResponse {
  workspaces: Workspace[];
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
  return response.workspaces;
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
  return response.workspace;
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
  return response.workspace;
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
  return response.workspace;
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

