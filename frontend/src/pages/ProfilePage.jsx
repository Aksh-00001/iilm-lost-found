import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    department: user?.department || '',
    phone: user?.phone || '',
  });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  const handleProfileChange = (e) => setProfileForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const handlePasswordChange = (e) => setPasswordForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!profileForm.name.trim()) return toast.error('Name is required');
    setProfileLoading(true);
    try {
      const { data } = await api.put('/auth/profile', profileForm);
      updateUser(data.user);
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      return toast.error('Please fill in all password fields');
    }
    if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
      return toast.error('New passwords do not match');
    }
    if (passwordForm.newPassword.length < 6) {
      return toast.error('New password must be at least 6 characters');
    }
    setPasswordLoading(true);
    try {
      await api.put('/auth/change-password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setPasswordForm({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
      toast.success('Password changed successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="page-title">Profile Settings</h1>
          <p className="text-slate-500 mt-1">Manage your account details and preferences</p>
        </div>

        {/* Profile Header Card */}
        <div className="card p-6 mb-6 flex items-center gap-5">
          <div className="w-16 h-16 bg-navy-800 rounded-2xl flex items-center justify-center text-white text-2xl font-display font-bold flex-shrink-0">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="font-display font-semibold text-navy-900 text-xl">{user?.name}</h2>
            <p className="text-slate-500 text-sm">{user?.email}</p>
            <p className="text-slate-400 text-xs mt-0.5">
              Member since {user?.createdAt ? format(new Date(user.createdAt), 'MMMM yyyy') : '—'}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-slate-100 rounded-xl mb-6">
          {['profile', 'password'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all capitalize ${
                activeTab === tab ? 'bg-white text-navy-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab === 'profile' ? 'Edit Profile' : 'Change Password'}
            </button>
          ))}
        </div>

        {activeTab === 'profile' && (
          <div className="card p-6">
            <h3 className="font-display font-semibold text-navy-900 mb-5">Personal Information</h3>
            <form onSubmit={handleProfileSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={profileForm.name}
                  onChange={handleProfileChange}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
                <input
                  type="email"
                  value={user?.email}
                  className="input-field bg-slate-50 cursor-not-allowed text-slate-500"
                  disabled
                />
                <p className="text-xs text-slate-400 mt-1">Email cannot be changed</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Department</label>
                <input
                  type="text"
                  name="department"
                  value={profileForm.department}
                  onChange={handleProfileChange}
                  placeholder="e.g., B.Tech Computer Science"
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={profileForm.phone}
                  onChange={handleProfileChange}
                  placeholder="e.g., +91 9876543210"
                  className="input-field"
                />
              </div>

              <button
                type="submit"
                disabled={profileLoading}
                className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {profileLoading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>}
                {profileLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>
        )}

        {activeTab === 'password' && (
          <div className="card p-6">
            <h3 className="font-display font-semibold text-navy-900 mb-5">Change Password</h3>
            <form onSubmit={handlePasswordSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Current Password *</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordChange}
                  placeholder="Enter current password"
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">New Password *</label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                  placeholder="At least 6 characters"
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Confirm New Password *</label>
                <input
                  type="password"
                  name="confirmNewPassword"
                  value={passwordForm.confirmNewPassword}
                  onChange={handlePasswordChange}
                  placeholder="Repeat new password"
                  className="input-field"
                  required
                />
              </div>

              <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                <p className="text-amber-800 text-sm font-medium mb-1">Password Requirements</p>
                <ul className="text-amber-700 text-xs space-y-1">
                  <li className="flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${passwordForm.newPassword.length >= 6 ? 'bg-green-500' : 'bg-amber-400'}`}></span>
                    At least 6 characters
                  </li>
                </ul>
              </div>

              <button
                type="submit"
                disabled={passwordLoading}
                className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {passwordLoading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>}
                {passwordLoading ? 'Changing...' : 'Change Password'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
