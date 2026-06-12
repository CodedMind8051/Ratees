'use client';
import  { useState } from 'react';
import { UserPen, KeyRound, LogOut, X, Check } from 'lucide-react';
import { toast } from 'sonner';

interface ProfileDropdownProps {
  onClose: () => void;
}

type ModalType = 'username' | 'password' | null;

export default function ProfileDropdown({ onClose }: ProfileDropdownProps) {
  const [modal, setModal] = useState<ModalType>(null);
  const [newUsername, setNewUsername] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUsernameChange = async () => {
    if (!newUsername.trim()) return;
    setLoading(true);
    // BACKEND: PATCH /api/user/username { username: newUsername }
    await new Promise(r => setTimeout(r, 800));
    setLoading(false);
    toast.success('Username updated successfully');
    setModal(null);
    onClose();
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    // BACKEND: PATCH /api/user/password { currentPassword, newPassword }
    await new Promise(r => setTimeout(r, 800));
    setLoading(false);
    toast.success('Password changed successfully');
    setModal(null);
    onClose();
  };

  return (
    <>
      <div className="absolute right-0 top-full mt-2 w-56 bg-card border border-border rounded-xl shadow-2xl fade-in z-50 overflow-hidden">
        <div className="px-4 py-3 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-amber-600 flex items-center justify-center text-sm font-bold text-primary-foreground">
              AR
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Arjun Rao</p>
              <p className="text-xs text-muted-foreground">arjun@cinevault.app</p>
            </div>
          </div>
        </div>

        <div className="py-1">
          <button
            onClick={() => setModal('username')}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-secondary transition-colors"
          >
            <UserPen size={15} className="text-muted-foreground" />
            Change Username
          </button>
          <button
            onClick={() => setModal('password')}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-secondary transition-colors"
          >
            <KeyRound size={15} className="text-muted-foreground" />
            Change Password
          </button>
        </div>

        <div className="border-t border-border py-1">
          <button
            onClick={() => { toast.success('Logged out'); onClose(); }}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-accent hover:bg-accent/10 transition-colors"
          >
            <LogOut size={15} />
            Sign Out
          </button>
        </div>
      </div>

      {/* Username Modal */}
      {modal === 'username' && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" onClick={() => setModal(null)}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div className="relative bg-card border border-border rounded-2xl p-6 w-full max-w-sm fade-in" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-semibold">Change Username</h3>
              <button onClick={() => setModal(null)} className="p-1.5 rounded-lg hover:bg-secondary"><X size={16} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wide">New Username</label>
                <input
                  type="text"
                  value={newUsername}
                  onChange={e => setNewUsername(e.target.value)}
                  placeholder="Enter new username"
                  className="w-full bg-secondary border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                />
              </div>
              <div className="flex gap-3">
                <button onClick={() => setModal(null)} className="flex-1 py-2.5 rounded-lg border border-border text-sm font-medium hover:bg-secondary transition-colors">Cancel</button>
                <button
                  onClick={handleUsernameChange}
                  disabled={loading || !newUsername.trim()}
                  className="flex-1 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-amber-400 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                >
                  {loading ? <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" /> : <Check size={14} />}
                  {loading ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Password Modal */}
      {modal === 'password' && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" onClick={() => setModal(null)}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div className="relative bg-card border border-border rounded-2xl p-6 w-full max-w-sm fade-in" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-semibold">Change Password</h3>
              <button onClick={() => setModal(null)} className="p-1.5 rounded-lg hover:bg-secondary"><X size={16} /></button>
            </div>
            <div className="space-y-4">
              {[
                { label: 'Current Password', val: currentPassword, set: setCurrentPassword },
                { label: 'New Password', val: newPassword, set: setNewPassword },
                { label: 'Confirm New Password', val: confirmPassword, set: setConfirmPassword },
              ].map(({ label, val, set }, i) => (
                <div key={`pwd-field-${i}`}>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wide">{label}</label>
                  <input
                    type="password"
                    value={val}
                    onChange={e => set(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-secondary border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                  />
                </div>
              ))}
              <div className="flex gap-3">
                <button onClick={() => setModal(null)} className="flex-1 py-2.5 rounded-lg border border-border text-sm font-medium hover:bg-secondary transition-colors">Cancel</button>
                <button
                  onClick={handlePasswordChange}
                  disabled={loading}
                  className="flex-1 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-amber-400 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                >
                  {loading ? <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" /> : <Check size={14} />}
                  {loading ? 'Updating...' : 'Update'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}