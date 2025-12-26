'use client';

import { useState, useEffect } from 'react';
import { getUser, logout } from '@/lib/auth';
import { useRouter } from 'next/navigation';

export default function AccountSettings() {
  const router = useRouter();
  const [user, setUser] = useState<{ id: string; email: string; name: string } | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const currentUser = getUser();
    if (currentUser) {
      setUser(currentUser);
      setName(currentUser.name);
      setEmail(currentUser.email);
    }
  }, []);

  const handleSaveProfile = () => {
    // TODO: Implement API call to update user profile
    console.log('Saving profile:', { name, email });
  };

  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    // TODO: Implement API call to change password
    console.log('Changing password');
    setShowPasswordSection(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleDeleteAccount = () => {
    // TODO: Implement API call to delete account
    console.log('Deleting account');
    logout();
    router.push('/auth/login');
  };

  if (!user) {
    return <div className="text-[#6b6b6b] text-xs">Loading...</div>;
  }

  return (
    <div className="max-w-2xl space-y-4">
      {/* Profile Section */}
      <div>
        <h3 className="text-sm font-semibold text-[#e5e5e5] mb-3">Profile</h3>
        <div className="space-y-3">
          {/* Avatar */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#2a2a2a]/60 rounded-full flex items-center justify-center text-lg font-semibold text-[#e5e5e5]">
              {name.charAt(0).toUpperCase()}
            </div>
            <div className="text-xs text-[#9b9b9b]">
              Your avatar is generated from your name's first letter
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-xs font-medium text-[#e5e5e5] mb-1.5">
              Preferred name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-2 py-1.5 bg-[#1f1f1f]/80 text-[#e5e5e5] border border-[#2a2a2a]/60 rounded-md text-xs outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Account Security Section */}
      <div className="border-t border-[#2a2a2a]/60 pt-4">
        <h3 className="text-sm font-semibold text-[#e5e5e5] mb-3">Account security</h3>
        <div className="space-y-3">
          {/* Email */}
          <div>
            <label className="block text-xs font-medium text-[#e5e5e5] mb-1.5">Email</label>
            <div className="flex gap-1.5">
              <input
                type="email"
                value={email}
                readOnly
                className="flex-1 px-2 py-1.5 bg-[#1f1f1f]/80 text-[#9b9b9b] border border-[#2a2a2a]/60 rounded-md text-xs outline-none"
              />
              <button className="px-3 py-1.5 bg-[#2a2a2a]/80 text-[#e5e5e5] rounded-md text-xs hover:bg-[#3a3a3a]/80 transition-all">
                Change email
              </button>
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-medium text-[#e5e5e5] mb-1.5">Password</label>
            {!showPasswordSection ? (
              <div className="flex items-center justify-between p-2 bg-[#1f1f1f]/80 border border-[#2a2a2a]/60 rounded-md">
                <span className="text-xs text-[#9b9b9b]">Set a permanent password to login to your account.</span>
                <button
                  onClick={() => setShowPasswordSection(true)}
                  className="px-3 py-1.5 bg-[#2a2a2a]/80 text-[#e5e5e5] rounded-md text-xs hover:bg-[#3a3a3a]/80 transition-all whitespace-nowrap ml-2"
                >
                  Add password
                </button>
              </div>
            ) : (
              <div className="space-y-2 p-3 bg-[#1f1f1f]/80 border border-[#2a2a2a]/60 rounded-md">
                <input
                  type="password"
                  placeholder="Current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-2 py-1.5 bg-[#0f0f0f]/80 text-[#e5e5e5] border border-[#2a2a2a]/60 rounded-md text-xs outline-none focus:ring-1 focus:ring-blue-500/50"
                />
                <input
                  type="password"
                  placeholder="New password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-2 py-1.5 bg-[#0f0f0f]/80 text-[#e5e5e5] border border-[#2a2a2a]/60 rounded-md text-xs outline-none focus:ring-1 focus:ring-blue-500/50"
                />
                <input
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-2 py-1.5 bg-[#0f0f0f]/80 text-[#e5e5e5] border border-[#2a2a2a]/60 rounded-md text-xs outline-none focus:ring-1 focus:ring-blue-500/50"
                />
                <div className="flex gap-1.5">
                  <button
                    onClick={handleChangePassword}
                    className="px-3 py-1.5 bg-blue-600 text-white rounded-md text-xs hover:bg-blue-700 transition-all"
                  >
                    Save password
                  </button>
                  <button
                    onClick={() => {
                      setShowPasswordSection(false);
                      setCurrentPassword('');
                      setNewPassword('');
                      setConfirmPassword('');
                    }}
                    className="px-3 py-1.5 bg-[#2a2a2a]/80 text-[#e5e5e5] rounded-md text-xs hover:bg-[#3a3a3a]/80 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Save Profile Button */}
      <div className="border-t border-[#2a2a2a]/60 pt-4">
        <button
          onClick={handleSaveProfile}
          className="px-4 py-2 bg-blue-600 text-white rounded-md text-xs font-medium hover:bg-blue-700 transition-all"
        >
          Save changes
        </button>
      </div>

      {/* Danger Zone */}
      <div className="border-t border-[#2a2a2a]/60 pt-4">
        <h3 className="text-sm font-semibold text-red-400 mb-3">Danger zone</h3>
        <div className="p-3 bg-red-900/10 border border-red-500/20 rounded-md">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h4 className="text-xs font-semibold text-[#e5e5e5] mb-0.5">Delete account</h4>
              <p className="text-xs text-[#9b9b9b]">
                Permanently delete your account and all associated data. This action cannot be undone.
              </p>
            </div>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="px-3 py-1.5 bg-red-600/20 text-red-400 rounded-md text-xs hover:bg-red-600/30 transition-all border border-red-500/30 whitespace-nowrap"
            >
              Delete account
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
              <h3 className="text-sm font-semibold text-red-400 mb-2">Delete Account</h3>
              <p className="text-xs text-[#9b9b9b] mb-4">
                Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently deleted.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleDeleteAccount}
                  className="flex-1 px-3 py-2 bg-red-600 text-white rounded-md text-xs font-medium hover:bg-red-700 transition-all"
                >
                  Yes, delete my account
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-3 py-2 bg-[#2a2a2a]/80 text-[#e5e5e5] rounded-md text-xs font-medium hover:bg-[#3a3a3a]/80 transition-all"
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

