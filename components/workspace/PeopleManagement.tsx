'use client';

import { useState } from 'react';
import { useWorkspace } from '@/contexts/WorkspaceContext';
import { MemberRole, Permission } from '@/types/workspace';

const PERMISSIONS = [
  { value: 'can_view' as Permission, label: 'Can view', description: 'View pages and content' },
  { value: 'can_comment' as Permission, label: 'Can comment', description: 'Add comments to pages' },
  { value: 'can_edit' as Permission, label: 'Can edit', description: 'Edit pages and content' },
];

export default function PeopleManagement() {
  const { currentWorkspace, inviteMember, removeMember, updateMemberRole, canUserManageMembers, isLoading } = useWorkspace();
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<MemberRole>('member');
  const [selectedPermissions, setSelectedPermissions] = useState<Permission[]>(['can_view']);
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const [editRole, setEditRole] = useState<MemberRole>('member');
  const [editPermissions, setEditPermissions] = useState<Permission[]>([]);
  const [isInviting, setIsInviting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const canManage = canUserManageMembers();

  if (!currentWorkspace) {
    return (
      <div className="text-[#6b6b6b] text-center py-8">
        No workspace selected. Please select a workspace first.
      </div>
    );
  }

  const handleTogglePermission = (permission: Permission) => {
    setSelectedPermissions((prev) =>
      prev.includes(permission)
        ? prev.filter((p) => p !== permission)
        : [...prev, permission]
    );
  };

  const handleToggleEditPermission = (permission: Permission) => {
    setEditPermissions((prev) =>
      prev.includes(permission)
        ? prev.filter((p) => p !== permission)
        : [...prev, permission]
    );
  };

  const handleInvite = async () => {
    if (!email.trim() || selectedPermissions.length === 0) return;

    try {
      setIsInviting(true);
      await inviteMember(email, role, selectedPermissions);
      setEmail('');
      setRole('member');
      setSelectedPermissions(['can_view']);
      setShowInviteForm(false);
    } catch (error) {
      console.error('Failed to invite member:', error);
    } finally {
      setIsInviting(false);
    }
  };

  const handleStartEdit = (memberId: string, currentRole: MemberRole, currentPermissions: Permission[]) => {
    setEditingMemberId(memberId);
    setEditRole(currentRole);
    setEditPermissions(currentPermissions);
  };

  const handleSaveEdit = async (memberId: string) => {
    try {
      setIsUpdating(true);
      await updateMemberRole(memberId, editRole, editPermissions);
      setEditingMemberId(null);
    } catch (error) {
      console.error('Failed to update member:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemove = async (memberId: string) => {
    if (confirm('Are you sure you want to remove this member?')) {
      try {
        await removeMember(memberId);
      } catch (error) {
        console.error('Failed to remove member:', error);
      }
    }
  };

  const getRoleBadgeColor = (role: MemberRole) => {
    switch (role) {
      case 'owner':
        return 'bg-purple-600/20 text-purple-400 border-purple-500/30';
      case 'admin':
        return 'bg-blue-600/20 text-blue-400 border-blue-500/30';
      case 'member':
        return 'bg-green-600/20 text-green-400 border-green-500/30';
      case 'guest':
        return 'bg-gray-600/20 text-gray-400 border-gray-500/30';
      default:
        return 'bg-gray-600/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header with Add Member Button */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-md font-semibold text-[#e5e5e5]">Members</h3>
          <p className="text-sm text-[#9b9b9b] mt-1">
            {currentWorkspace.members.length} member{currentWorkspace.members.length !== 1 ? 's' : ''} in this workspace
          </p>
        </div>
        {canManage && (
          <button
            onClick={() => setShowInviteForm(!showInviteForm)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-all flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add member
          </button>
        )}
      </div>

      {/* Invite Form */}
      {showInviteForm && (
        <div className="p-4 bg-[#1f1f1f]/80 border border-[#2a2a2a]/60 rounded-lg space-y-4">
          <h4 className="text-sm font-semibold text-[#e5e5e5]">Invite new member</h4>
          
          <div>
            <label className="block text-sm font-medium text-[#e5e5e5] mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="member@example.com"
              className="w-full px-3 py-2 bg-[#0f0f0f]/80 text-[#e5e5e5] border border-[#2a2a2a]/60 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#e5e5e5] mb-2">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as MemberRole)}
              className="w-full px-3 py-2 bg-[#0f0f0f]/80 text-[#e5e5e5] border border-[#2a2a2a]/60 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/50"
            >
              <option value="admin">Admin - Full access except workspace deletion</option>
              <option value="member">Member - Can edit and collaborate</option>
              <option value="guest">Guest - Limited access</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#e5e5e5] mb-2">Permissions</label>
            <div className="space-y-2">
              {PERMISSIONS.map((permission) => (
                <label
                  key={permission.value}
                  className="flex items-start gap-3 p-3 bg-[#0f0f0f]/60 rounded-lg cursor-pointer hover:bg-[#252525]/60 transition-all"
                >
                  <input
                    type="checkbox"
                    checked={selectedPermissions.includes(permission.value)}
                    onChange={() => handleTogglePermission(permission.value)}
                    className="mt-1 w-4 h-4 rounded border-[#2a2a2a] bg-[#1f1f1f] text-blue-600 focus:ring-2 focus:ring-blue-500/50"
                  />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-[#e5e5e5]">{permission.label}</div>
                    <div className="text-xs text-[#9b9b9b]">{permission.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleInvite}
              disabled={!email.trim() || selectedPermissions.length === 0}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send invitation
            </button>
            <button
              onClick={() => {
                setShowInviteForm(false);
                setEmail('');
                setRole('member');
                setSelectedPermissions(['can_view']);
              }}
              className="px-4 py-2 bg-[#2a2a2a]/80 text-[#e5e5e5] rounded-lg text-sm hover:bg-[#3a3a3a]/80 transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Members List */}
      <div className="space-y-2">
        {currentWorkspace.members.map((member) => (
          <div
            key={member.id}
            className="p-4 bg-[#1f1f1f]/80 border border-[#2a2a2a]/60 rounded-lg hover:border-[#3a3a3a]/60 transition-all"
          >
            {editingMemberId === member.id ? (
              /* Edit Mode */
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#2a2a2a]/60 rounded-full flex items-center justify-center text-sm font-semibold text-[#e5e5e5]">
                    {member.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-[#e5e5e5]">{member.name}</div>
                    <div className="text-xs text-[#9b9b9b]">{member.email}</div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#e5e5e5] mb-2">Role</label>
                  <select
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value as MemberRole)}
                    disabled={member.role === 'owner'}
                    className="w-full px-3 py-2 bg-[#0f0f0f]/80 text-[#e5e5e5] border border-[#2a2a2a]/60 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50"
                  >
                    <option value="admin">Admin</option>
                    <option value="member">Member</option>
                    <option value="guest">Guest</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#e5e5e5] mb-2">Permissions</label>
                  <div className="space-y-2">
                    {PERMISSIONS.map((permission) => (
                      <label
                        key={permission.value}
                        className="flex items-start gap-3 p-2 bg-[#0f0f0f]/60 rounded-lg cursor-pointer hover:bg-[#252525]/60 transition-all"
                      >
                        <input
                          type="checkbox"
                          checked={editPermissions.includes(permission.value)}
                          onChange={() => handleToggleEditPermission(permission.value)}
                          className="mt-1 w-4 h-4 rounded border-[#2a2a2a] bg-[#1f1f1f] text-blue-600 focus:ring-2 focus:ring-blue-500/50"
                        />
                        <div className="flex-1">
                          <div className="text-sm font-medium text-[#e5e5e5]">{permission.label}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleSaveEdit(member.id)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-all"
                  >
                    Save changes
                  </button>
                  <button
                    onClick={() => setEditingMemberId(null)}
                    className="px-4 py-2 bg-[#2a2a2a]/80 text-[#e5e5e5] rounded-lg text-sm hover:bg-[#3a3a3a]/80 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              /* View Mode */
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#2a2a2a]/60 rounded-full flex items-center justify-center text-sm font-semibold text-[#e5e5e5]">
                  {member.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-[#e5e5e5]">{member.name}</div>
                  <div className="text-xs text-[#9b9b9b]">{member.email}</div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getRoleBadgeColor(member.role)}`}>
                  {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                </div>
                {canManage && member.role !== 'owner' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleStartEdit(member.id, member.role, member.permissions)}
                      className="p-2 text-[#9b9b9b] hover:text-[#e5e5e5] hover:bg-[#2a2a2a]/60 rounded-lg transition-all"
                      title="Edit member"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleRemove(member.id)}
                      className="p-2 text-[#9b9b9b] hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-all"
                      title="Remove member"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

