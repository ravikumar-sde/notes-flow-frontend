'use client';

import { useState } from 'react';
import { useWorkspace } from '@/contexts/WorkspaceContext';
import { MemberRole, Permission } from '@/types/workspace';

const PERMISSIONS: { value: Permission; label: string; description: string }[] = [
  {
    value: 'can_view',
    label: 'Can View',
    description: 'Can view pages and content',
  },
  {
    value: 'can_comment',
    label: 'Can Comment',
    description: 'Can add comments to pages',
  },
  {
    value: 'can_edit',
    label: 'Can Edit',
    description: 'Can edit pages and content',
  },
];

interface InviteMemberFormProps {
  onSuccess?: () => void;
}

export default function InviteMemberForm({ onSuccess }: InviteMemberFormProps) {
  const { currentWorkspace, inviteMember, canUserInvite } = useWorkspace();
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<MemberRole>('member');
  const [selectedPermissions, setSelectedPermissions] = useState<Permission[]>(['can_view']);

  const canInvite = canUserInvite();

  const handleTogglePermission = (permission: Permission) => {
    setSelectedPermissions((prev) =>
      prev.includes(permission)
        ? prev.filter((p) => p !== permission)
        : [...prev, permission]
    );
  };

  const handleInvite = () => {
    if (!email.trim() || selectedPermissions.length === 0) return;

    inviteMember(email, role, selectedPermissions);
    
    // Reset form
    setEmail('');
    setRole('member');
    setSelectedPermissions(['can_view']);
    
    if (onSuccess) {
      onSuccess();
    }
  };

  if (!currentWorkspace || !canInvite) {
    return (
      <div className="text-center py-8 text-[#6b6b6b]">
        You don't have permission to invite members to this workspace.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Email Input */}
      <div>
        <label className="block text-sm font-medium text-[#e5e5e5] mb-2">
          Email address
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="member@example.com"
          className="w-full px-3 py-2 bg-[#1f1f1f]/80 text-[#e5e5e5] border border-[#2a2a2a]/60 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
        />
      </div>

      {/* Role Selection */}
      <div>
        <label className="block text-sm font-medium text-[#e5e5e5] mb-2">
          Role
        </label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as MemberRole)}
          className="w-full px-3 py-2 bg-[#1f1f1f]/80 text-[#e5e5e5] border border-[#2a2a2a]/60 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 shadow-[inset_0_1px_3px_rgba(0,0,0,0.3)] transition-all"
        >
          <option value="admin">Admin - Full access except workspace deletion</option>
          <option value="member">Member - Can edit and collaborate</option>
          <option value="guest">Guest - Limited access</option>
        </select>
      </div>

      {/* Permissions */}
      <div>
        <label className="block text-sm font-medium text-[#e5e5e5] mb-2">
          Permissions
        </label>
        <div className="space-y-2">
          {PERMISSIONS.map((permission) => (
            <label
              key={permission.value}
              className="flex items-start gap-3 p-3 bg-[#1f1f1f]/60 rounded-lg cursor-pointer hover:bg-[#252525]/60 transition-all duration-200 border border-[#2a2a2a]/40 hover:border-[#3a3a3a]/60"
            >
              <input
                type="checkbox"
                checked={selectedPermissions.includes(permission.value)}
                onChange={() => handleTogglePermission(permission.value)}
                className="mt-1 w-4 h-4 rounded border-[#2a2a2a] bg-[#1f1f1f] text-blue-600 focus:ring-2 focus:ring-blue-500/50 transition-all"
              />
              <div className="flex-1">
                <div className="text-sm font-medium text-[#e5e5e5]">{permission.label}</div>
                <div className="text-xs text-[#9b9b9b]">{permission.description}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Invite Button */}
      <button
        onClick={handleInvite}
        disabled={!email.trim() || selectedPermissions.length === 0}
        className="w-full px-4 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Send invitation
      </button>
    </div>
  );
}

