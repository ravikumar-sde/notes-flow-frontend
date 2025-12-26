'use client';

import { useState } from 'react';
import { useWorkspace } from '@/contexts/WorkspaceContext';

export default function WorkspaceGeneralSettings() {
  const { currentWorkspace, updateWorkspace, deleteWorkspace, isLoading } = useWorkspace();
  const [workspaceName, setWorkspaceName] = useState(currentWorkspace?.name || '');
  const [workspaceDescription, setWorkspaceDescription] = useState(currentWorkspace?.description || '');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  if (!currentWorkspace) {
    return (
      <div className="text-[#6b6b6b] text-center py-6 text-xs">
        No workspace selected. Please select a workspace first.
      </div>
    );
  }

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await updateWorkspace(currentWorkspace.id, workspaceName, workspaceDescription || undefined);
    } catch (error) {
      console.error('Failed to update workspace:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteWorkspace(currentWorkspace.id);
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error('Failed to delete workspace:', error);
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-4">
      {/* Workspace Icon */}
      <div>
        <h3 className="text-sm font-semibold text-[#e5e5e5] mb-3">Workspace icon</h3>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#2a2a2a]/60 rounded-lg flex items-center justify-center text-lg font-semibold text-[#e5e5e5]">
            {workspaceName.charAt(0).toUpperCase() || 'W'}
          </div>
          <div className="text-xs text-[#9b9b9b]">
            Your workspace icon is generated from the workspace name's first letter
          </div>
        </div>
      </div>

      {/* Workspace Name */}
      <div>
        <label className="block text-xs font-medium text-[#e5e5e5] mb-1.5">
          Workspace name
        </label>
        <input
          type="text"
          value={workspaceName}
          onChange={(e) => setWorkspaceName(e.target.value)}
          className="w-full px-2 py-1.5 bg-[#1f1f1f]/80 text-[#e5e5e5] border border-[#2a2a2a]/60 rounded-md text-xs outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
          placeholder="Enter workspace name"
        />
      </div>

      {/* Workspace Description */}
      <div>
        <label className="block text-xs font-medium text-[#e5e5e5] mb-1.5">
          Description
        </label>
        <textarea
          value={workspaceDescription}
          onChange={(e) => setWorkspaceDescription(e.target.value)}
          rows={3}
          className="w-full px-2 py-1.5 bg-[#1f1f1f]/80 text-[#e5e5e5] border border-[#2a2a2a]/60 rounded-md text-xs outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all resize-none"
          placeholder="Add a description for your workspace (optional)"
        />
      </div>

      {/* Save Button */}
      <div className="border-t border-[#2a2a2a]/60 pt-4">
        <button
          onClick={handleSave}
          disabled={!workspaceName.trim() || isSaving || isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md text-xs font-medium hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
        >
          {isSaving && (
            <svg className="animate-spin h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          )}
          {isSaving ? 'Saving...' : 'Save changes'}
        </button>
      </div>

      {/* Danger Zone */}
      <div className="border-t border-[#2a2a2a]/60 pt-4">
        <h3 className="text-sm font-semibold text-red-400 mb-3">Danger zone</h3>
        <div className="p-3 bg-red-900/10 border border-red-500/20 rounded-md">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h4 className="text-xs font-semibold text-[#e5e5e5] mb-0.5">Delete workspace</h4>
              <p className="text-xs text-[#9b9b9b]">
                Permanently delete this workspace and all its pages. This action cannot be undone.
              </p>
            </div>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="px-3 py-1.5 bg-red-600/20 text-red-400 rounded-md text-xs hover:bg-red-600/30 transition-all border border-red-500/30 whitespace-nowrap"
            >
              Delete workspace
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <>
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-60"
            onClick={() => setShowDeleteConfirm(false)}
          />
          <div className="fixed inset-0 flex items-center justify-center z-60 p-3">
            <div className="bg-[#1a1a1a]/95 border border-red-500/30 rounded-lg shadow-[0_20px_60px_rgba(0,0,0,0.6)] w-full max-w-sm backdrop-blur-xl p-4">
              <h3 className="text-sm font-semibold text-red-400 mb-2">Delete Workspace</h3>
              <p className="text-xs text-[#9b9b9b] mb-4">
                Are you sure you want to delete "{currentWorkspace.name}"? This action cannot be undone and all pages in this workspace will be permanently deleted.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex-1 px-3 py-2 bg-red-600 text-white rounded-md text-xs font-medium hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
                >
                  {isDeleting && (
                    <svg className="animate-spin h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  )}
                  {isDeleting ? 'Deleting...' : 'Yes, delete workspace'}
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={isDeleting}
                  className="flex-1 px-3 py-2 bg-[#2a2a2a]/80 text-[#e5e5e5] rounded-md text-xs font-medium hover:bg-[#3a3a3a]/80 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

