import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { getErrorMessage } from '../services/api';
import Button from '../components/Button';
import Card from '../components/Card';

const Settings = () => {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    university: user?.university || '',
    program: user?.program || '',
  });
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [saving, setSaving] = useState(false);
  const [changingPw, setChangingPw] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleProfileSave = async () => {
    setSaving(true);
    setError('');
    setMessage('');
    try {
      await api.put('/api/auth/me', profile);
      setMessage('Profile updated successfully!');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    if (passwords.new !== passwords.confirm) {
      setError('New passwords do not match.');
      return;
    }
    if (passwords.new.length < 6) {
      setError('New password must be at least 6 characters.');
      return;
    }
    setChangingPw(true);
    setError('');
    setMessage('');
    try {
      await api.put('/api/auth/password', passwords);
      setMessage('Password changed successfully!');
      setPasswords({ current: '', new: '', confirm: '' });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setChangingPw(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-500 mt-1">Manage your profile and security.</p>
      </div>
      {message && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm mb-4">{message}</div>}
      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">{error}</div>}
      <div className="space-y-6">
        <Card>
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Profile Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
              <input type="text" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
              <input type="email" value={profile.email} disabled className="w-full px-4 py-2.5 border border-slate-200 rounded-lg bg-slate-50 text-slate-500 cursor-not-allowed" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">University</label>
                <input type="text" value={profile.university} onChange={(e) => setProfile({ ...profile, university: e.target.value })} className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Program</label>
                <input type="text" value={profile.program} onChange={(e) => setProfile({ ...profile, program: e.target.value })} className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-colors" />
              </div>
            </div>
            <div className="flex justify-end">
              <Button variant="primary" onClick={handleProfileSave} disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</Button>
            </div>
          </div>
        </Card>
        <Card>
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Security</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Current Password</label>
              <input type="password" value={passwords.current} onChange={(e) => setPasswords({ ...passwords, current: e.target.value })} className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-colors" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">New Password</label>
                <input type="password" value={passwords.new} onChange={(e) => setPasswords({ ...passwords, new: e.target.value })} className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Confirm Password</label>
                <input type="password" value={passwords.confirm} onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })} className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-colors" />
              </div>
            </div>
            <div className="flex justify-end">
              <Button variant="primary" onClick={handlePasswordChange} disabled={changingPw}>{changingPw ? 'Changing...' : 'Change Password'}</Button>
            </div>
          </div>
        </Card>
        <Card>
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Session</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-slate-900">Logout</p>
              <p className="text-sm text-slate-500">Sign out of your account on this device</p>
            </div>
            <Button variant="danger" onClick={logout}>Logout</Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Settings;