'use client';

import { useState } from 'react';
import { Page } from '@/types/blocks';

interface SharePageModalProps {
  page: Page;
  isOpen: boolean;
  onClose: () => void;
}

export default function SharePageModal({ page, isOpen, onClose }: SharePageModalProps) {
  const [inviteLink, setInviteLink] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);

  // Generate invite link and access code when modal opens
  const generateInviteLink = () => {
    const token = `${Date.now()}_${Math.random().toString(36).substr(2, 16)}`;
    const link = `${window.location.origin}/page/${page.id}?token=${token}`;
    setInviteLink(link);
    
    // Generate a 6-character unique code
    const code = Math.random().toString(36).substr(2, 6).toUpperCase();
    setAccessCode(code);
  };

  // Copy invite link to clipboard
  const copyInviteLink = async () => {
    if (!inviteLink) {
      generateInviteLink();
      return;
    }
    
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Copy access code to clipboard
  const copyAccessCode = async () => {
    if (!accessCode) {
      generateInviteLink();
      return;
    }
    
    try {
      await navigator.clipboard.writeText(accessCode);
      setCodeCopied(true);
      setTimeout(() => setCodeCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-linear-to-br from-[#1f1f1f]/95 to-[#1a1a1a]/95 border border-[#2a2a2a]/60 rounded-xl shadow-[0_20px_60px_rgba(0,0,0,0.6)] w-full max-w-md backdrop-blur-xl">
          {/* Header */}
          <div className="px-6 py-4 border-b border-[#2a2a2a]/60 bg-linear-to-r from-[#252525]/50 to-transparent">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-[#e5e5e5]">Share Page</h2>
                <p className="text-sm text-[#6b6b6b] mt-1">
                  Share "{page.title}" with others
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-[#6b6b6b] hover:text-[#e5e5e5] transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="px-6 py-4 space-y-4">
            {/* Invite Link Section */}
            <div>
              <label className="block text-sm font-medium text-[#e5e5e5] mb-2">
                Invite Link
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inviteLink || 'Click generate to create invite link'}
                  readOnly
                  className="flex-1 px-3 py-2 bg-[#191919]/80 text-[#e3e3e3] border border-[#2f2f2f]/60 rounded-lg text-sm outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/30"
                />
                <button
                  onClick={inviteLink ? copyInviteLink : generateInviteLink}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  {inviteLink ? (copied ? 'Copied!' : 'Copy') : 'Generate'}
                </button>
              </div>
              <p className="text-xs text-[#6b6b6b] mt-1">
                Anyone with this link can access the page
              </p>
            </div>

            {/* Access Code Section */}
            <div>
              <label className="block text-sm font-medium text-[#e5e5e5] mb-2">
                Access Code
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={accessCode || 'Generate link to get access code'}
                  readOnly
                  className="flex-1 px-3 py-2 bg-[#191919]/80 text-[#e3e3e3] border border-[#2f2f2f]/60 rounded-lg text-sm outline-none font-mono tracking-wider"
                />
                <button
                  onClick={copyAccessCode}
                  disabled={!accessCode}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {codeCopied ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <p className="text-xs text-[#6b6b6b] mt-1">
                Users can enter this code manually to access the page
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-[#2a2a2a]/60 bg-linear-to-r from-transparent to-[#252525]/50">
            <button
              onClick={onClose}
              className="w-full px-4 py-2 bg-[#2a2a2a] hover:bg-[#3a3a3a] text-[#e5e5e5] rounded-lg text-sm font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

