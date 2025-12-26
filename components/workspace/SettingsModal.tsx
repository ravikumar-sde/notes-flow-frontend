'use client';

import { useState } from 'react';
import AccountSettings from './AccountSettings';
import WorkspaceGeneralSettings from './WorkspaceGeneralSettings';
import PeopleManagement from './PeopleManagement';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type SettingsSection = 'account' | 'workspace-general' | 'workspace-people';

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [activeSection, setActiveSection] = useState<SettingsSection>('account');

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-3">
        <div className="bg-[#1a1a1a]/95 border border-[#2a2a2a]/60 rounded-lg shadow-[0_20px_60px_rgba(0,0,0,0.6)] w-full max-w-4xl h-[80vh] backdrop-blur-xl flex overflow-hidden">
          {/* Sidebar */}
          <div className="w-48 bg-[#0f0f0f]/50 border-r border-[#2a2a2a]/60 p-3 overflow-y-auto">
            {/* Account Section */}
            <div className="mb-4">
              <div className="text-[10px] text-[#6b6b6b] px-2 py-1.5 font-semibold tracking-wider">
                ACCOUNT
              </div>
              <button
                onClick={() => setActiveSection('account')}
                className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md transition-all duration-200 ${
                  activeSection === 'account'
                    ? 'bg-[#2a2a2a]/80 text-[#e5e5e5]'
                    : 'text-[#9b9b9b] hover:bg-[#252525]/60 hover:text-[#e5e5e5]'
                }`}
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="text-xs font-medium">Account</span>
              </button>
            </div>

            {/* Workspace Section */}
            <div>
              <div className="text-[10px] text-[#6b6b6b] px-2 py-1.5 font-semibold tracking-wider">
                WORKSPACE
              </div>
              <button
                onClick={() => setActiveSection('workspace-general')}
                className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md transition-all duration-200 ${
                  activeSection === 'workspace-general'
                    ? 'bg-[#2a2a2a]/80 text-[#e5e5e5]'
                    : 'text-[#9b9b9b] hover:bg-[#252525]/60 hover:text-[#e5e5e5]'
                }`}
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-xs font-medium">General</span>
              </button>
              <button
                onClick={() => setActiveSection('workspace-people')}
                className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md transition-all duration-200 mt-0.5 ${
                  activeSection === 'workspace-people'
                    ? 'bg-[#2a2a2a]/80 text-[#e5e5e5]'
                    : 'text-[#9b9b9b] hover:bg-[#252525]/60 hover:text-[#e5e5e5]'
                }`}
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <span className="text-xs font-medium">People</span>
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Header */}
            <div className="px-4 py-3 border-b border-[#2a2a2a]/60 bg-[#0f0f0f]/30 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-[#e5e5e5]">
                {activeSection === 'account' && 'Account Settings'}
                {activeSection === 'workspace-general' && 'Workspace Settings'}
                {activeSection === 'workspace-people' && 'People Management'}
              </h2>
              <button
                onClick={onClose}
                className="text-[#6b6b6b] hover:text-[#e5e5e5] transition-colors p-1 hover:bg-[#2a2a2a]/60 rounded-md"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {activeSection === 'account' && <AccountSettings />}
              {activeSection === 'workspace-general' && <WorkspaceGeneralSettings />}
              {activeSection === 'workspace-people' && <PeopleManagement />}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

