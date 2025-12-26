'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useWorkspace } from '@/contexts/WorkspaceContext';
import { Workspace } from '@/types/workspace';
import { getUser, logout } from '@/lib/auth';
import SettingsModal from './SettingsModal';

export default function WorkspaceSelector() {
  const router = useRouter();
  const { workspaces, currentWorkspace, setCurrentWorkspace, createNewWorkspace, updateWorkspace, deleteWorkspace, error } = useWorkspace();
  const [isOpen, setIsOpen] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState('');
  const [newWorkspaceDescription, setNewWorkspaceDescription] = useState('');
  const [editWorkspaceName, setEditWorkspaceName] = useState('');
  const [editWorkspaceDescription, setEditWorkspaceDescription] = useState('');
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [user, setUser] = useState<{ id: string; email: string; name: string } | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [workspaceToDelete, setWorkspaceToDelete] = useState<string | null>(null);
  const [inviteLink, setInviteLink] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [linkCopied, setLinkCopied] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);

  useEffect(() => {
    const currentUser = getUser();
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  const handleCreateWorkspace = async () => {
    if (!newWorkspaceName.trim()) return;

    try {
      setIsCreating(true);
      await createNewWorkspace(newWorkspaceName, newWorkspaceDescription || undefined);
      setNewWorkspaceName('');
      setNewWorkspaceDescription('');
      setShowCreateForm(false);
      setIsOpen(false);
    } catch (error) {
      console.error('Failed to create workspace:', error);
      // Error is already handled in context
    } finally {
      setIsCreating(false);
    }
  };

  const handleSelectWorkspace = (workspace: Workspace) => {
    setCurrentWorkspace(workspace);
    setIsOpen(false);
  };

  // const handleEditWorkspace = () => {
  //   if (!currentWorkspace) return;
  //   setEditWorkspaceName(currentWorkspace.name);
  //   setEditWorkspaceDescription(currentWorkspace.description || '');
  //   setShowEditForm(true);
  // };

  const handleSaveEdit = async () => {
    if (!currentWorkspace || !editWorkspaceName.trim()) return;

    try {
      await updateWorkspace(currentWorkspace.id, editWorkspaceName, editWorkspaceDescription || undefined);
      setEditWorkspaceName('');
      setEditWorkspaceDescription('');
      setShowEditForm(false);
    } catch (error) {
      console.error('Failed to update workspace:', error);
      // Error is already handled in context
    }
  };

  const handleDeleteWorkspace = async (workspaceId: string) => {
    if (!confirm('Are you sure you want to delete this workspace? This action cannot be undone.')) {
      return;
    }

    try {
      setIsDeleting(true);
      setWorkspaceToDelete(workspaceId);
      await deleteWorkspace(workspaceId);
      setWorkspaceToDelete(null);
    } catch (error) {
      console.error('Failed to delete workspace:', error);
      // Error is already handled in context
    } finally {
      setIsDeleting(false);
      setWorkspaceToDelete(null);
    }
  };

  const handleOpenInviteModal = () => {
    if (!currentWorkspace) return;

    // Generate invite link and code
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const generatedLink = `${baseUrl}/workspace/join?code=${currentWorkspace.id}-${Date.now().toString(36)}`;
    const generatedCode = `${currentWorkspace.id.substring(0, 8).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;

    setInviteLink(generatedLink);
    setInviteCode(generatedCode);
    setShowInviteModal(true);
    setIsOpen(false);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(inviteCode);
      setCodeCopied(true);
      setTimeout(() => setCodeCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  // Group workspaces by user email
  const groupedWorkspaces = workspaces.reduce((acc, workspace) => {
    const ownerEmail = user?.email || 'unknown@example.com';
    if (!acc[ownerEmail]) {
      acc[ownerEmail] = [];
    }
    acc[ownerEmail].push(workspace);
    return acc;
  }, {} as Record<string, Workspace[]>);

  return (
    <div className="relative">
      {showEditForm ? (
        /* Edit Workspace Form */
        <div className="p-4 bg-linear-to-br from-[#1a1a1a]/90 to-[#1f1f1f]/90 rounded-md border border-[#2a2a2a]/50 shadow-[0_4px_16px_rgba(0,0,0,0.4)]">
          <div className="text-sm font-semibold text-[#e5e5e5] mb-3">Edit Workspace</div>
          <input
            type="text"
            value={editWorkspaceName}
            onChange={(e) => setEditWorkspaceName(e.target.value)}
            placeholder="Workspace name"
            className="w-full px-3 py-2 bg-[#1f1f1f]/80 text-[#e5e5e5] border border-[#2a2a2a]/60 rounded-lg text-sm mb-2 outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all shadow-[inset_0_1px_3px_rgba(0,0,0,0.3)] placeholder-[#6b6b6b]"
            autoFocus
          />
          <input
            type="text"
            value={editWorkspaceDescription}
            onChange={(e) => setEditWorkspaceDescription(e.target.value)}
            placeholder="Description (optional)"
            className="w-full px-3 py-2 bg-[#1f1f1f]/80 text-[#e5e5e5] border border-[#2a2a2a]/60 rounded-lg text-sm mb-3 outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all shadow-[inset_0_1px_3px_rgba(0,0,0,0.3)] placeholder-[#6b6b6b]"
          />
          <div className="flex gap-2">
            <button
              onClick={handleSaveEdit}
              disabled={!editWorkspaceName.trim()}
              className="flex-1 px-3 py-2 bg-linear-to-r from-blue-600 to-blue-700 text-white rounded-lg text-sm font-medium hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-[0_2px_8px_rgba(37,99,235,0.3)] hover:shadow-[0_4px_12px_rgba(37,99,235,0.4)]"
            >
              Save
            </button>
            <button
              onClick={() => {
                setShowEditForm(false);
                setEditWorkspaceName('');
                setEditWorkspaceDescription('');
              }}
              className="px-3 py-2 bg-[#1f1f1f]/80 text-[#e5e5e5] rounded-lg text-sm hover:bg-[#2a2a2a]/80 transition-all duration-200 border border-[#2a2a2a]/40 hover:border-[#3a3a3a]/60"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        /* Current Workspace Button */
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center gap-3 px-4 py-3 bg-linear-to-br from-[#1a1a1a]/90 via-[#1f1f1f]/90 to-[#1a1a1a]/90 text-[#f5f5f5] rounded-md hover:from-[#242424]/90 hover:via-[#2a2a2a]/90 hover:to-[#242424]/90 transition-all duration-300 border border-[#2a2a2a]/50 hover:border-[#3a3a3a] shadow-[0_4px_16px_rgba(0,0,0,0.4)] hover:shadow-[0_6px_24px_rgba(0,0,0,0.5)] backdrop-blur-sm group"
        >
          {/* Workspace Avatar */}
          <div className="w-10 h-10 bg-[#2a2a2a]/60 rounded-md flex items-center justify-center text-lg font-semibold text-[#e5e5e5] group-hover:scale-110 transition-transform duration-300">
            {currentWorkspace?.name?.charAt(0).toUpperCase() || 'W'}
          </div>

          <div className="flex-1 text-left">
            <div className="font-semibold text-sm text-[#e5e5e5]">
              {currentWorkspace?.name || 'Select Workspace'}
            </div>
            <div className="text-xs text-[#a0a0a0]">
              {user?.name || 'User'}
            </div>
          </div>

          <svg
            className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      )}

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-full bg-[#1a1a1a]/95 border border-[#2a2a2a]/60 rounded-md shadow-[0_8px_32px_rgba(0,0,0,0.6)] z-50 max-h-[500px] overflow-hidden backdrop-blur-xl">
          {/* Error Message */}
          {error && (
            <div className="p-3 m-2 bg-red-900/20 border border-red-500/30 rounded-lg">
              <div className="flex items-center gap-2 text-red-400 text-sm">
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* Settings and Invite Buttons */}
          <div className="p-2 flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowSettingsModal(true);
                setIsOpen(false);
              }}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-[#1f1f1f]/80 text-[#9b9b9b] rounded-lg hover:bg-[#252525]/80 hover:text-[#e5e5e5] transition-all duration-200 border border-[#2a2a2a]/40 hover:border-[#3a3a3a]/60 group"
              title="Settings"
            >
              <svg className="w-4 h-4 group-hover:rotate-45 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-sm font-medium">Settings</span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleOpenInviteModal();
              }}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-[#1f1f1f]/80 text-[#9b9b9b] rounded-lg hover:bg-[#252525]/80 hover:text-[#e5e5e5] transition-all duration-200 border border-[#2a2a2a]/40 hover:border-[#3a3a3a]/60 group"
              title="Invite members"
            >
              <svg className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              <span className="text-sm font-medium">Invite</span>
            </button>
          </div>

          {/* Divider */}
          <div className="border-t border-[#2a2a2a]/60 my-2 shadow-[0_1px_0_rgba(255,255,255,0.03)]" />

          {/* Workspace List */}
          <div className="p-2 max-h-[400px] overflow-y-auto">
            {workspaces.length === 0 ? (
              <div className="px-3 py-4 text-sm text-[#6b6b6b] text-center">
                No workspaces yet. Create one to get started!
              </div>
            ) : (
              Object.entries(groupedWorkspaces).map(([email, emailWorkspaces]) => (
                <div key={email} className="mb-4 last:mb-0">
                  {/* Email Separator */}
                  <div className="text-xs text-[#6b6b6b] px-3 py-2 font-semibold tracking-wider flex items-center gap-2">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {email}
                  </div>

                  {/* Workspaces for this email */}
                  {emailWorkspaces.map((workspace) => (
                    <div
                      key={workspace.id}
                      className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-md transition-all duration-200 group ${
                        currentWorkspace?.id === workspace.id
                          ? 'bg-linear-to-r from-[#2a2a2a]/80 to-[#252525]/80 shadow-[inset_0_1px_2px_rgba(0,0,0,0.3)] border border-[#3a3a3a]/40'
                          : 'hover:bg-[#252525]/60 hover:shadow-[0_2px_8px_rgba(0,0,0,0.3)]'
                      }`}
                    >
                      <button
                        onClick={() => handleSelectWorkspace(workspace)}
                        className="flex items-center gap-3 flex-1 min-w-0"
                      >
                        <div className="w-8 h-8 bg-[#2a2a2a]/60 rounded-md flex items-center justify-center text-sm font-semibold shrink-0">
                          {workspace.name?.charAt(0) || 'W'}
                        </div>
                        <div className="flex-1 text-left min-w-0">
                          <div className="text-sm text-[#e5e5e5] font-medium truncate">{workspace.name}</div>
                          <div className="text-xs text-[#6b6b6b]">
                            {(workspace.members || []).length} member{(workspace.members || []).length !== 1 ? 's' : ''}
                          </div>
                        </div>
                        {currentWorkspace?.id === workspace.id && (
                          <svg className="w-4 h-4 text-blue-500 drop-shadow-[0_0_4px_rgba(99,102,241,0.5)] shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteWorkspace(workspace.id);
                        }}
                        disabled={isDeleting && workspaceToDelete === workspace.id}
                        className="opacity-0 group-hover:opacity-100 p-1.5 text-[#6b6b6b] hover:text-red-400 hover:bg-red-900/20 rounded transition-all duration-200 shrink-0 disabled:opacity-50"
                        title="Delete workspace"
                      >
                        {isDeleting && workspaceToDelete === workspace.id ? (
                          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              ))
            )}
          </div>

          {/* Divider */}
          <div className="border-t border-[#2a2a2a]/60 my-2 shadow-[0_1px_0_rgba(255,255,255,0.03)]" />

          {/* Create Workspace Section */}
          {!showCreateForm ? (
            <div className="p-2">
              <button
                onClick={() => setShowCreateForm(true)}
                className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-[#e5e5e5] hover:bg-[#252525]/60 rounded-lg transition-all duration-200 hover:shadow-[0_2px_8px_rgba(0,0,0,0.3)] group"
              >
                <svg className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New workspace
              </button>
            </div>
          ) : (
            <div className="p-4 bg-linear-to-br from-[#252525]/80 to-[#1f1f1f]/80 rounded-lg m-2 border border-[#2a2a2a]/40 shadow-[inset_0_1px_2px_rgba(0,0,0,0.3)]">
              <div className="text-sm font-semibold text-[#e5e5e5] mb-3">Create Workspace</div>
              <input
                type="text"
                value={newWorkspaceName}
                onChange={(e) => setNewWorkspaceName(e.target.value)}
                placeholder="Workspace name"
                className="w-full px-3 py-3 bg-[#1f1f1f]/80 text-[#e5e5e5] border border-[#2a2a2a]/60 rounded-lg text-sm mb-2 outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all shadow-[inset_0_1px_3px_rgba(0,0,0,0.3)] placeholder-[#6b6b6b]"
                autoFocus
              />
              <input
                type="text"
                value={newWorkspaceDescription}
                onChange={(e) => setNewWorkspaceDescription(e.target.value)}
                placeholder="Description (optional)"
                className="w-full px-3 py-2 bg-[#1f1f1f]/80 text-[#e5e5e5] border border-[#2a2a2a]/60 rounded-lg text-sm mb-3 outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all shadow-[inset_0_1px_3px_rgba(0,0,0,0.3)] placeholder-[#6b6b6b]"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleCreateWorkspace}
                  disabled={!newWorkspaceName.trim() || isCreating}
                  className="flex-1 px-3 py-2 bg-linear-to-r from-blue-600 to-blue-700 text-white rounded-lg text-sm font-medium hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-[0_2px_8px_rgba(37,99,235,0.3)] hover:shadow-[0_4px_12px_rgba(37,99,235,0.4)] flex items-center justify-center gap-2"
                >
                  {isCreating && (
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  )}
                  {isCreating ? 'Creating...' : 'Create'}
                </button>
                <button
                  onClick={() => {
                    setShowCreateForm(false);
                    setNewWorkspaceName('');
                    setNewWorkspaceDescription('');
                  }}
                  className="px-3 py-2 bg-[#1f1f1f]/80 text-[#e5e5e5] rounded-lg text-sm hover:bg-[#2a2a2a]/80 transition-all duration-200 border border-[#2a2a2a]/40 hover:border-[#3a3a3a]/60"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Divider */}
          <div className="border-t border-[#2a2a2a]/60 my-2 shadow-[0_1px_0_rgba(255,255,255,0.03)]" />

          {/* Logout Button */}
          <div className="p-2">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-red-400 hover:bg-red-900/20 rounded-lg transition-all duration-200 hover:shadow-[0_2px_8px_rgba(239,68,68,0.2)] group"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Log out
            </button>
          </div>
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setIsOpen(false);
            setShowCreateForm(false);
          }}
        />
      )}

      {/* Settings Modal */}
      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
      />

      {/* Invite Member Modal */}
      {showInviteModal && (
        <>
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={() => {
              setShowInviteModal(false);
              setLinkCopied(false);
              setCodeCopied(false);
            }}
          />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-[#1a1a1a]/95 border border-[#2a2a2a]/60 rounded-xl shadow-[0_20px_60px_rgba(0,0,0,0.6)] w-full max-w-lg backdrop-blur-xl">
              <div className="px-6 py-4 border-b border-[#2a2a2a]/60 bg-[#0f0f0f]/30 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-[#e5e5e5]">Invite to Workspace</h2>
                  <p className="text-sm text-[#6b6b6b] mt-1">{currentWorkspace?.name}</p>
                </div>
                <button
                  onClick={() => {
                    setShowInviteModal(false);
                    setLinkCopied(false);
                    setCodeCopied(false);
                  }}
                  className="text-[#6b6b6b] hover:text-[#e5e5e5] transition-colors p-2 hover:bg-[#2a2a2a]/60 rounded-lg"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-6 space-y-6">
                {/* Invite Link Section */}
                <div>
                  <label className="block text-sm font-medium text-[#e5e5e5] mb-2">
                    Invite Link
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={inviteLink}
                      readOnly
                      className="flex-1 px-3 py-2.5 bg-[#252525]/80 text-[#e5e5e5] border border-[#2a2a2a]/60 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 shadow-[inset_0_1px_3px_rgba(0,0,0,0.3)] transition-all"
                    />
                    <button
                      onClick={handleCopyLink}
                      className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-all duration-200 shadow-[0_2px_8px_rgba(37,99,235,0.3)] hover:shadow-[0_4px_12px_rgba(37,99,235,0.4)] flex items-center gap-2"
                    >
                      {linkCopied ? (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Copied
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-[#6b6b6b] mt-2">
                    Share this link with anyone you want to invite to this workspace
                  </p>
                </div>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[#2a2a2a]/60"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-2 bg-[#1a1a1a] text-[#6b6b6b]">OR</span>
                  </div>
                </div>

                {/* Invite Code Section */}
                <div>
                  <label className="block text-sm font-medium text-[#e5e5e5] mb-2">
                    Invite Code
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={inviteCode}
                      readOnly
                      className="flex-1 px-3 py-2.5 bg-[#252525]/80 text-[#e5e5e5] border border-[#2a2a2a]/60 rounded-lg text-sm font-mono outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 shadow-[inset_0_1px_3px_rgba(0,0,0,0.3)] transition-all"
                    />
                    <button
                      onClick={handleCopyCode}
                      className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-all duration-200 shadow-[0_2px_8px_rgba(37,99,235,0.3)] hover:shadow-[0_4px_12px_rgba(37,99,235,0.4)] flex items-center gap-2"
                    >
                      {codeCopied ? (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Copied
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-[#6b6b6b] mt-2">
                    Share this code for manual workspace joining
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

