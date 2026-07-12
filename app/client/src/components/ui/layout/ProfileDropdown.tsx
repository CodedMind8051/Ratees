import { useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { UserPen, KeyRound, LogOut, X, Check, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { useMutation } from '@apollo/client/react';
import { UPDATE_USERNAME, UPDATE_PASSWORD } from '@/lib/graphql/query/user.query';
import { authClient } from '@/lib/auth-client';

interface SessionUser {
  id: string;
  name: string;
  email: string;
  image?: string;
}

interface ProfileDropdownProps {
  onClose: () => void;
  user: SessionUser | null;
}

type ModalType = 'username' | 'password' | null;

function ModalShell({
  icon,
  title,
  onClose,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return createPortal(
    <AnimatePresence>
      <div
        data-click-outside-ignore
        onMouseDown={e => e.stopPropagation()}
        onTouchStart={e => e.stopPropagation()}
      >
        <motion.div
          className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={onClose}
        />
        <div className="fixed inset-0 z-[101] flex items-end sm:items-center justify-center pointer-events-none">
          <motion.div
            className="pointer-events-auto w-full sm:max-w-sm sm:mx-4 max-h-[88vh] overflow-y-auto rounded-t-3xl sm:rounded-2xl border border-border bg-card shadow-2xl"
            initial={{ y: 48, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 48, opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            onClick={e => e.stopPropagation()}
          >
            {/* mobile drag handle */}
            <div className="flex justify-center pt-3 sm:hidden">
              <div className="h-1 w-9 rounded-full bg-border" />
            </div>

            <div className="flex items-center gap-3 px-5 pt-4 sm:pt-5 pb-4 border-b border-border">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
                {icon}
              </div>
              <h3 className="flex-1 text-[15px] font-semibold text-foreground tracking-tight">{title}</h3>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-5 pb-[calc(env(safe-area-inset-bottom)+1.25rem)] sm:pb-5">{children}</div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>,
    document.body,
  );
}


function Avatar({ user, size }: { user: SessionUser | null; size: number }) {
  const [failed, setFailed] = useState(false);
  const showImage = !!user?.image && !failed;

  return showImage ? (
    <img
      src={user!.image ? user!.image : '/assets/no_image.png'}
      alt=""
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      style={{ width: size, height: size }}
      className="rounded-full object-cover shrink-0  ring-primary/20"
    />
  ) : (
    <div
      style={{ width: size, height: size }}
      className="rounded-full bg-primary/10 ring-2 ring-primary/20 flex items-center justify-center font-bold text-primary shrink-0"
    >
      {user?.name?.charAt(0).toUpperCase() || '?'}
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="block text-[11px] font-medium uppercase tracking-wide text-muted-foreground mb-1.5">{children}</label>;
}

function PasswordInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative">
      <input
        type={visible ? 'text' : 'password'}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-secondary/60 border border-border rounded-xl pl-3.5 pr-10 py-2.5 text-sm text-foreground placeholder-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60 transition-all"
      />
      <button
        type="button"
        tabIndex={-1}
        onClick={() => setVisible(v => !v)}
        className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-md text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        aria-label={visible ? 'Hide password' : 'Show password'}
      >
        {visible ? <EyeOff size={14} /> : <Eye size={14} />}
      </button>
    </div>
  );
}

export default function ProfileDropdown({ onClose, user }: ProfileDropdownProps) {
  const [modal, setModal] = useState<ModalType>(null);
  const [newUsername, setNewUsername] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [updateUsernameMutation, { loading: usernameLoading }] = useMutation(UPDATE_USERNAME);
  const [updatePasswordMutation, { loading: passwordLoading }] = useMutation(UPDATE_PASSWORD);

  const loading = usernameLoading || passwordLoading;

  const closeModal = () => {
    setModal(null);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleUsernameChange = async () => {
    if (!newUsername.trim()) return;
    try {
      await updateUsernameMutation({ variables: { username: newUsername } });
      toast.success('Username updated successfully');
      closeModal();
      onClose();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to update username';
      toast.error(message);
    }
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    try {
      await updatePasswordMutation({ variables: { currentPassword, newPassword } });
      toast.success('Password changed successfully');
      closeModal();
      onClose();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to change password';
      toast.error(message);
    }
  };

  const handleSignOut = async () => {
    await authClient.signOut();
    toast.success('Logged out');
    onClose();
  };

  const passwordsMismatch = confirmPassword.length > 0 && newPassword !== confirmPassword;

  return (
    <>
      <div className="absolute right-0 top-full mt-2 w-64 rounded-2xl border border-border bg-card shadow-2xl fade-in z-50 overflow-hidden">
        <div className="px-4 py-4 bg-gradient-to-b from-secondary/50 to-transparent border-b border-border">
          <div className="flex items-center gap-3">
            <Avatar user={user} size={44} />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">{user?.name || 'User'}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email || ''}</p>
            </div>
          </div>
        </div>

        <div className="py-1.5">
          <button
            onClick={() => setModal('username')}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-secondary transition-colors cursor-pointer"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-secondary text-muted-foreground">
              <UserPen size={14} />
            </span>
            Change Username
          </button>
          <button
            onClick={() => setModal('password')}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-secondary transition-colors cursor-pointer"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-secondary text-muted-foreground">
              <KeyRound size={14} />
            </span>
            Change Password
          </button>
        </div>

        <div className="border-t border-border py-1.5">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
              <LogOut size={14} />
            </span>
            Sign Out
          </button>
        </div>
      </div>

      {/* Username Modal */}
      {modal === 'username' && (
        <ModalShell icon={<UserPen size={16} />} title="Change Username" onClose={closeModal}>
          <FieldLabel>New Username</FieldLabel>
          <input
            type="text"
            value={newUsername}
            onChange={e => setNewUsername(e.target.value)}
            placeholder="Enter new username"
            autoFocus
            className="w-full bg-secondary/60 border border-border rounded-xl px-3.5 py-2.5 text-sm text-foreground placeholder-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60 transition-all"
          />

          <div className="flex gap-2.5 mt-5">
            <button
              onClick={closeModal}
              className="flex-1 py-2.5 rounded-xl border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleUsernameChange}
              disabled={loading || !newUsername.trim()}
              className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 disabled:opacity-40 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              ) : (
                <Check size={14} />
              )}
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </ModalShell>
      )}

      {/* Password Modal */}
      {modal === 'password' && (
        <ModalShell icon={<KeyRound size={16} />} title="Change Password" onClose={closeModal}>
          <div className="space-y-3.5">
            <div>
              <FieldLabel>Current Password</FieldLabel>
              <PasswordInput value={currentPassword} onChange={setCurrentPassword} placeholder="Enter current password" />
            </div>
            <div>
              <FieldLabel>New Password</FieldLabel>
              <PasswordInput value={newPassword} onChange={setNewPassword} placeholder="Enter new password" />
            </div>
            <div>
              <FieldLabel>Confirm Password</FieldLabel>
              <PasswordInput value={confirmPassword} onChange={setConfirmPassword} placeholder="Confirm new password" />
              {passwordsMismatch && (
                <p className="mt-1.5 text-xs text-destructive">Passwords do not match</p>
              )}
              {confirmPassword.length > 0 && !passwordsMismatch && (
                <p className="mt-1.5 flex items-center gap-1 text-xs text-emerald-500">
                  <ShieldCheck size={12} /> Passwords match
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-2.5 mt-5">
            <button
              onClick={closeModal}
              className="flex-1 py-2.5 rounded-xl border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handlePasswordChange}
              disabled={loading || !currentPassword || !newPassword || passwordsMismatch}
              className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 disabled:opacity-40 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              ) : (
                <Check size={14} />
              )}
              {loading ? 'Updating...' : 'Update'}
            </button>
          </div>
        </ModalShell>
      )}
    </>
  );
}