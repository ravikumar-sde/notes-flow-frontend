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

export default function InviteMember() {
  const { currentWorkspace, inviteMember, canUserInvite } = useWorkspace();
  const [isOpen, setIsOpen] = useState(false);
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
    setIsOpen(false);
  };

  if (!currentWorkspace || !canInvite) {
    return null;
  }

  return (
    <div className="relative">
      {/* Invite Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 text-sm font-medium shadow-[0_4px_12px_rgba(37,99,235,0.3)] hover:shadow-[0_6px_16px_rgba(37,99,235,0.4)] group"
      >
        <svg className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
          />
        </svg>
        Invite Member
      </button>

      {/* Modal */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Modal Content */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-linear-to-br from-[#1f1f1f]/95 to-[#1a1a1a]/95 border border-[#2a2a2a]/60 rounded-xl shadow-[0_20px_60px_rgba(0,0,0,0.6)] w-full max-w-md backdrop-blur-xl">
              {/* Header */}
              <div className="px-6 py-4 border-b border-[#2a2a2a]/60 bg-linear-to-r from-[#252525]/50 to-transparent">
                <h2 className="text-lg font-semibold text-[#e5e5e5]">Invite Member</h2>
                <p className="text-sm text-[#6b6b6b] mt-1">
                  Invite someone to join {currentWorkspace.name}
                </p>
              </div>

              {/* Form */}
              <div className="px-6 py-4 space-y-4">
                {/* Email Input */}
                <div>
                  <label className="block text-sm font-medium text-[#e5e5e5] mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="colleague@example.com"
                    className="w-full px-3 py-2 bg-[#252525]/80 text-[#e5e5e5] border border-[#2a2a2a]/60 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 placeholder-[#6b6b6b] shadow-[inset_0_1px_3px_rgba(0,0,0,0.3)] transition-all"
                    autoFocus
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
                    className="w-full px-3 py-2 bg-[#252525]/80 text-[#e5e5e5] border border-[#2a2a2a]/60 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 shadow-[inset_0_1px_3px_rgba(0,0,0,0.3)] transition-all"
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
                        className="flex items-start gap-3 p-3 bg-[#252525]/60 rounded-lg cursor-pointer hover:bg-[#2a2a2a]/60 transition-all duration-200 border border-[#2a2a2a]/40 hover:border-[#3a3a3a]/60 shadow-[0_2px_4px_rgba(0,0,0,0.2)] hover:shadow-[0_4px_8px_rgba(0,0,0,0.3)]"
                      >
                        <input
                          type="checkbox"
                          checked={selectedPermissions.includes(permission.value)}
                          onChange={() => handleTogglePermission(permission.value)}
                          className="mt-1 w-4 h-4 rounded border-[#2a2a2a] bg-[#1f1f1f] text-blue-600 focus:ring-2 focus:ring-blue-500/50 transition-all"
                        />
                        <div className="flex-1">
                          <div className="text-sm font-medium text-[#e5e5e5]">
                            {permission.label}
                          </div>
                          <div className="text-xs text-[#6b6b6b]">
                            {permission.description}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-[#2a2a2a]/60 flex gap-3 justify-end bg-linear-to-r from-transparent to-[#252525]/30">
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 bg-[#252525]/80 text-[#e5e5e5] rounded-lg hover:bg-[#2a2a2a]/80 transition-all duration-200 text-sm border border-[#2a2a2a]/40 hover:border-[#3a3a3a]/60 shadow-[0_2px_4px_rgba(0,0,0,0.2)]"
                >
                  Cancel
                </button>
                <button
                  onClick={handleInvite}
                  disabled={!email.trim() || selectedPermissions.length === 0}
                  className="px-4 py-2 bg-linear-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-sm font-medium shadow-[0_4px_12px_rgba(37,99,235,0.3)] hover:shadow-[0_6px_16px_rgba(37,99,235,0.4)]"
                >
                  Send Invitation
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

