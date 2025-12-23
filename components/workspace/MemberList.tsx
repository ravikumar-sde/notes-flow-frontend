'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useWorkspace } from '@/contexts/WorkspaceContext';
import { MemberRole } from '@/types/workspace';
import { ROLE_PERMISSIONS } from '@/types/workspace';

const ROLE_LABELS: Record<MemberRole, string> = {
  owner: 'Owner',
  admin: 'Admin',
  member: 'Member',
  guest: 'Guest',
};

const ROLE_COLORS: Record<MemberRole, string> = {
  owner: 'bg-purple-900/30 text-purple-400',
  admin: 'bg-blue-900/30 text-blue-400',
  member: 'bg-green-900/30 text-green-400',
  guest: 'bg-gray-700/30 text-gray-400',
};

export default function MemberList() {
  const {
    currentWorkspace,
    currentUserId,
    removeMember,
    updateMemberRole,
    canUserManageMembers,
  } = useWorkspace();

  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<MemberRole>('member');

  if (!currentWorkspace) {
    return (
      <div className="p-8 text-center text-[#6b6b6b]">
        Select a workspace to view members
      </div>
    );
  }

  const canManage = canUserManageMembers();

  const handleUpdateRole = (memberId: string) => {
    const permissions = ROLE_PERMISSIONS[selectedRole];
    updateMemberRole(memberId, selectedRole, permissions);
    setEditingMemberId(null);
  };

  const handleRemoveMember = (memberId: string) => {
    if (confirm('Are you sure you want to remove this member?')) {
      removeMember(memberId);
    }
  };

  return (
    <div className="bg-linear-to-br from-[#1a1a1a]/90 to-[#1f1f1f]/90 rounded-xl border border-[#2a2a2a]/60 shadow-[0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-sm">
      {/* Header */}
      <div className="px-6 py-4 border-b border-[#2a2a2a]/60 bg-linear-to-r from-[#1f1f1f]/50 to-transparent">
        <h2 className="text-lg font-semibold text-[#e5e5e5]">
          Members ({currentWorkspace.members.length})
        </h2>
        <p className="text-sm text-[#6b6b6b] mt-1">
          Manage workspace members and their permissions
        </p>
      </div>

      {/* Member List */}
      <div className="divide-y divide-[#2a2a2a]/40">
        {currentWorkspace.members.map((member) => {
          const isCurrentUser = member.userId === currentUserId;
          const isMemberOwner = member.role === 'owner';
          const canEditThisMember = canManage && !isMemberOwner && !isCurrentUser;
          const isEditing = editingMemberId === member.id;

          return (
            <div key={member.id} className="px-6 py-4 hover:bg-[#1f1f1f]/60 transition-all duration-200 group">
              <div className="flex items-center justify-between">
                {/* Member Info */}
                <div className="flex items-center gap-4 flex-1">
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-linear-to-br from-[#2a2a2a] to-[#252525] flex items-center justify-center text-[#e5e5e5] font-medium shadow-[0_2px_8px_rgba(0,0,0,0.3)] border border-[#3a3a3a]/40 group-hover:shadow-[0_4px_12px_rgba(0,0,0,0.4)] transition-all duration-200">
                    {member.avatar ? (
                      <Image src={member.avatar} alt={member.name} className="w-full h-full rounded-full" />
                    ) : (
                      member.name?.charAt(0)?.toUpperCase() || member.email?.charAt(0)?.toUpperCase() || '?'
                    )}
                  </div>

                  {/* Name & Email */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-[#e5e5e5]">
                        {member.name || member.email}
                      </span>
                      {isCurrentUser && (
                        <span className="text-xs text-[#6b6b6b] bg-[#252525]/60 px-2 py-0.5 rounded-full border border-[#2a2a2a]/40">(You)</span>
                      )}
                    </div>
                    <div className="text-xs text-[#6b6b6b]">{member.email}</div>
                    <div className="flex gap-1 mt-1.5">
                      {member.permissions.map((permission) => (
                        <span
                          key={permission}
                          className="text-xs px-2 py-0.5 bg-[#252525]/80 text-[#9b9b9b] rounded-md border border-[#2a2a2a]/40 shadow-[inset_0_1px_2px_rgba(0,0,0,0.2)]"
                        >
                          {permission.replace('can_', '').replace('_', ' ')}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Role & Actions */}
                <div className="flex items-center gap-3">
                  {isEditing ? (
                    <div className="flex items-center gap-2">
                      <select
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value as MemberRole)}
                        className="px-3 py-1 bg-[#252525]/80 text-[#e5e5e5] border border-[#2a2a2a]/60 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500/50 shadow-[inset_0_1px_3px_rgba(0,0,0,0.3)] transition-all"
                      >
                        <option value="admin">Admin</option>
                        <option value="member">Member</option>
                        <option value="guest">Guest</option>
                      </select>
                      <button
                        onClick={() => handleUpdateRole(member.id)}
                        className="px-3 py-1 bg-linear-to-r from-blue-600 to-blue-700 text-white rounded-lg text-sm hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-[0_2px_8px_rgba(37,99,235,0.3)] hover:shadow-[0_4px_12px_rgba(37,99,235,0.4)]"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingMemberId(null)}
                        className="px-3 py-1 bg-[#252525]/80 text-[#e5e5e5] rounded-lg text-sm hover:bg-[#2f2f2f]/80 transition-all duration-200 border border-[#2a2a2a]/40"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <>
                      <span className={`px-3 py-1 rounded-lg text-xs font-medium shadow-[0_2px_4px_rgba(0,0,0,0.2)] border border-[#2a2a2a]/40 ${ROLE_COLORS[member.role]}`}>
                        {ROLE_LABELS[member.role]}
                      </span>

                      {canEditThisMember && (
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <button
                            onClick={() => {
                              setEditingMemberId(member.id);
                              setSelectedRole(member.role);
                            }}
                            className="px-2 py-1 text-xs text-[#e5e5e5] hover:bg-[#252525]/60 rounded-lg transition-all duration-200 border border-[#2a2a2a]/40 hover:border-[#3a3a3a]/60 shadow-[0_2px_4px_rgba(0,0,0,0.2)]"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleRemoveMember(member.id)}
                            className="px-2 py-1 text-xs text-red-400 hover:bg-red-900/40 rounded-lg transition-all duration-200 border border-red-900/40 hover:border-red-800/60 shadow-[0_2px_4px_rgba(0,0,0,0.2)]"
                          >
                            Remove
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

