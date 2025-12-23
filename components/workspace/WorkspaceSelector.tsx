'use client';

import { useState } from 'react';
import { useWorkspace } from '@/contexts/WorkspaceContext';
import { Workspace } from '@/types/workspace';

export default function WorkspaceSelector() {
  const { workspaces, currentWorkspace, setCurrentWorkspace, createNewWorkspace, updateWorkspace } = useWorkspace();
  const [isOpen, setIsOpen] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState('');
  const [newWorkspaceDescription, setNewWorkspaceDescription] = useState('');
  const [editWorkspaceName, setEditWorkspaceName] = useState('');
  const [editWorkspaceDescription, setEditWorkspaceDescription] = useState('');

  const handleCreateWorkspace = () => {
    if (!newWorkspaceName.trim()) return;

    createNewWorkspace(newWorkspaceName, newWorkspaceDescription || undefined);
    setNewWorkspaceName('');
    setNewWorkspaceDescription('');
    setShowCreateForm(false);
    setIsOpen(false);
  };

  const handleSelectWorkspace = (workspace: Workspace) => {
    setCurrentWorkspace(workspace);
    setIsOpen(false);
  };

  const handleEditWorkspace = () => {
    if (!currentWorkspace) return;
    setEditWorkspaceName(currentWorkspace.name);
    setEditWorkspaceDescription(currentWorkspace.description || '');
    setShowEditForm(true);
  };

  const handleSaveEdit = () => {
    if (!currentWorkspace || !editWorkspaceName.trim()) return;

    updateWorkspace(currentWorkspace.id, editWorkspaceName, editWorkspaceDescription || undefined);
    setEditWorkspaceName('');
    setEditWorkspaceDescription('');
    setShowEditForm(false);
  };

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
          <span className="text-2xl group-hover:scale-110 transition-transform duration-300 bg-[#2a2a2a]/60 rounded-md px-4 py-2">{currentWorkspace?.name?.charAt(0) || 'W'}</span>
          <div className="flex-1 text-left">
            <div className="font-semibold text-md">
              {currentWorkspace?.name || 'Select Workspace'}
            </div>
            {currentWorkspace?.description && (
              <div className="text-xs text-[#a0a0a0] truncate">
                {currentWorkspace.description}
              </div>
            )}
          </div>

          {/* Edit Button */}
          {currentWorkspace && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleEditWorkspace();
              }}
              className="p-2 text-[#9b9b9b] hover:text-[#e5e5e5] hover:bg-[#2a2a2a]/60 rounded-md transition-all duration-200"
              title="Edit workspace"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
          )}

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
        <div className="absolute top-full left-0 mt-2 w-full bg-[#1a1a1a]/95 border border-[#2a2a2a]/60 rounded-md shadow-[0_8px_32px_rgba(0,0,0,0.6)] z-50 max-h-96 overflow-hidden backdrop-blur-xl">
          {/* Workspace List */}
          <div className="p-2 max-h-96 overflow-y-auto">
            <div className="text-xs text-[#6b6b6b] px-3 py-2 font-semibold tracking-wider">YOUR WORKSPACES</div>
            {workspaces.length === 0 ? (
              <div className="px-3 py-4 text-sm text-[#6b6b6b] text-center">
                No workspaces yet. Create one to get started!
              </div>
            ) : (
              workspaces.map((workspace) => (
                <button
                  key={workspace.id}
                  onClick={() => handleSelectWorkspace(workspace)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-200 ${
                    currentWorkspace?.id === workspace.id
                      ? 'bg-linear-to-r from-[#2a2a2a]/80 to-[#252525]/80 shadow-[inset_0_1px_2px_rgba(0,0,0,0.3)] border border-[#3a3a3a]/40'
                      : 'hover:bg-[#252525]/60 hover:shadow-[0_2px_8px_rgba(0,0,0,0.3)]'
                  }`}
                >
                  <span className="text-xl">{workspace.name?.charAt(0) || 'W'}</span>
                  <div className="flex-1 text-left">
                    <div className="text-md text-[#e5e5e5] font-medium">{workspace.name}</div>
                    {workspace.description && (
                      <div className="text-sm text-[#6b6b6b] truncate">{workspace.description}</div>
                    )}
                    <div className="text-xs text-[#6b6b6b] mt-1">
                      {workspace.members.length} member{workspace.members.length !== 1 ? 's' : ''}
                    </div>
                  </div>
                  {currentWorkspace?.id === workspace.id && (
                    <svg className="w-4 h-4 text-blue-500 drop-shadow-[0_0_4px_rgba(99,102,241,0.5)]" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>
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
                Create New Workspace
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
                  disabled={!newWorkspaceName.trim()}
                  className="flex-1 px-3 py-2 bg-linear-to-r from-blue-600 to-blue-700 text-white rounded-lg text-sm font-medium hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-[0_2px_8px_rgba(37,99,235,0.3)] hover:shadow-[0_4px_12px_rgba(37,99,235,0.4)]"
                >
                  Create
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
    </div>
  );
}

