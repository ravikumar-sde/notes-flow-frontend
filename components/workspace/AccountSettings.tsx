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
    return <div className="text-[#6b6b6b]">Loading...</div>;
  }

  return (
    <div className="max-w-2xl space-y-6">
      {/* Profile Section */}
      <div>
        <h3 className="text-md font-semibold text-[#e5e5e5] mb-4">Profile</h3>
        <div className="space-y-4">
          {/* Avatar */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-[#2a2a2a]/60 rounded-full flex items-center justify-center text-2xl font-semibold text-[#e5e5e5]">
              {name.charAt(0).toUpperCase()}
            </div>
            <div className="text-sm text-[#9b9b9b]">
              Your avatar is generated from your name's first letter
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-[#e5e5e5] mb-2">
              Preferred name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-[#1f1f1f]/80 text-[#e5e5e5] border border-[#2a2a2a]/60 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Account Security Section */}
      <div className="border-t border-[#2a2a2a]/60 pt-6">
        <h3 className="text-md font-semibold text-[#e5e5e5] mb-4">Account security</h3>
        <div className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-[#e5e5e5] mb-2">Email</label>
            <div className="flex gap-2">
              <input
                type="email"
                value={email}
                readOnly
                className="flex-1 px-3 py-2 bg-[#1f1f1f]/80 text-[#9b9b9b] border border-[#2a2a2a]/60 rounded-lg outline-none"
              />
              <button className="px-4 py-2 bg-[#2a2a2a]/80 text-[#e5e5e5] rounded-lg text-sm hover:bg-[#3a3a3a]/80 transition-all">
                Change email
              </button>
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-[#e5e5e5] mb-2">Password</label>
            {!showPasswordSection ? (
              <div className="flex items-center justify-between p-3 bg-[#1f1f1f]/80 border border-[#2a2a2a]/60 rounded-lg">
                <span className="text-sm text-[#9b9b9b]">Set a permanent password to login to your account.</span>
                <button
                  onClick={() => setShowPasswordSection(true)}
                  className="px-4 py-2 bg-[#2a2a2a]/80 text-[#e5e5e5] rounded-lg text-sm hover:bg-[#3a3a3a]/80 transition-all"
                >
                  Add password
                </button>
              </div>
            ) : (
              <div className="space-y-3 p-4 bg-[#1f1f1f]/80 border border-[#2a2a2a]/60 rounded-lg">
                <input
                  type="password"
                  placeholder="Current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0f0f0f]/80 text-[#e5e5e5] border border-[#2a2a2a]/60 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/50"
                />
                <input
                  type="password"
                  placeholder="New password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0f0f0f]/80 text-[#e5e5e5] border border-[#2a2a2a]/60 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/50"
                />
                <input
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0f0f0f]/80 text-[#e5e5e5] border border-[#2a2a2a]/60 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/50"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleChangePassword}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-all"
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
                    className="px-4 py-2 bg-[#2a2a2a]/80 text-[#e5e5e5] rounded-lg text-sm hover:bg-[#3a3a3a]/80 transition-all"
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
      <div className="border-t border-[#2a2a2a]/60 pt-6">
        <button
          onClick={handleSaveProfile}
          className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all"
        >
          Save changes
        </button>
      </div>

      {/* Danger Zone */}
      <div className="border-t border-[#2a2a2a]/60 pt-6">
        <h3 className="text-md font-semibold text-red-400 mb-4">Danger zone</h3>
        <div className="p-4 bg-red-900/10 border border-red-500/20 rounded-lg">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="text-sm font-semibold text-[#e5e5e5] mb-1">Delete account</h4>
              <p className="text-sm text-[#9b9b9b]">
                Permanently delete your account and all associated data. This action cannot be undone.
              </p>
            </div>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="px-4 py-2 bg-red-600/20 text-red-400 rounded-lg text-sm hover:bg-red-600/30 transition-all border border-red-500/30"
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
          <div className="fixed inset-0 flex items-center justify-center z-60 p-4">
            <div className="bg-[#1a1a1a]/95 border border-red-500/30 rounded-xl shadow-[0_20px_60px_rgba(0,0,0,0.6)] w-full max-w-md backdrop-blur-xl p-6">
              <h3 className="text-lg font-semibold text-red-400 mb-2">Delete Account</h3>
              <p className="text-sm text-[#9b9b9b] mb-6">
                Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently deleted.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleDeleteAccount}
                  className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-all"
                >
                  Yes, delete my account
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-2.5 bg-[#2a2a2a]/80 text-[#e5e5e5] rounded-lg font-medium hover:bg-[#3a3a3a]/80 transition-all"
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

