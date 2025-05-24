
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, User, Edit, Save, X, Settings, Shield, Bell } from 'lucide-react';
import Button from '@/components/Button';
import InputField from '@/components/InputField';
import { useAuth } from '@/contexts/AuthContext';

const Dashboard = () => {
  const { user, profile, logout, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: profile?.username || '',
    avatar_url: profile?.avatar_url || '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await updateProfile(formData);
      setIsEditing(false);
    } catch (error) {
      // Error handled in auth context
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      username: profile?.username || '',
      avatar_url: profile?.avatar_url || '',
    });
    setIsEditing(false);
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 pt-16">
      <div className="max-w-6xl mx-auto p-4 sm:p-6">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-gray-400">Welcome back, {profile?.username || user?.email}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card - Full width on mobile, spans 2 columns on desktop */}
          <div className="lg:col-span-2 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl shadow-2xl">
            {/* Profile Header */}
            <div className="p-6 border-b border-gray-700">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <img
                    src={formData.avatar_url || profile?.avatar_url}
                    alt="Avatar"
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gray-700 object-cover"
                  />
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white">{profile?.username}</h2>
                    <p className="text-gray-400 text-sm sm:text-base">{user?.email}</p>
                    <div className="flex items-center mt-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                      <span className="text-green-400 text-sm">Active</span>
                    </div>
                  </div>
                </div>
                {!isEditing && (
                  <Button
                    onClick={() => setIsEditing(true)}
                    variant="outline"
                    size="sm"
                    className="border-gray-600 text-gray-300 hover:bg-gray-700 w-full sm:w-auto"
                  >
                    <Edit size={16} className="mr-2" />
                    Edit Profile
                  </Button>
                )}
              </div>
            </div>

            {/* Profile Content */}
            <div className="p-6">
              {isEditing ? (
                <div className="space-y-6">
                  <InputField
                    id="username"
                    name="username"
                    type="text"
                    label="Username"
                    placeholder="Enter username"
                    value={formData.username}
                    onChange={handleChange}
                    fullWidth
                  />
                  
                  <InputField
                    id="avatar_url"
                    name="avatar_url"
                    type="url"
                    label="Avatar URL"
                    placeholder="https://..."
                    value={formData.avatar_url}
                    onChange={handleChange}
                    fullWidth
                  />

                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <Button
                      onClick={handleSave}
                      variant="glow"
                      isLoading={isLoading}
                      className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                    >
                      <Save size={16} className="mr-2" />
                      Save Changes
                    </Button>
                    <Button
                      onClick={handleCancel}
                      variant="outline"
                      disabled={isLoading}
                      className="border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                      <X size={16} className="mr-2" />
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-400">Username</label>
                      <p className="text-white mt-1">{profile?.username}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-400">Email</label>
                      <p className="text-white mt-1">{user?.email}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-400">Member Since</label>
                      <p className="text-white mt-1">
                        {new Date(profile?.created_at || '').toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-400">Status</label>
                      <div className="flex items-center mt-1">
                        <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                        <span className="text-green-400">Active</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Actions */}
            <div className="p-6 border-t border-gray-700 bg-gray-900/50">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button className="flex items-center justify-center p-3 bg-gray-700/50 hover:bg-gray-700 rounded-lg transition-colors text-gray-300">
                  <Settings size={16} className="mr-2" />
                  <span className="text-sm">Settings</span>
                </button>
                <button className="flex items-center justify-center p-3 bg-gray-700/50 hover:bg-gray-700 rounded-lg transition-colors text-gray-300">
                  <Shield size={16} className="mr-2" />
                  <span className="text-sm">Privacy</span>
                </button>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white justify-center"
                >
                  Logout
                </Button>
              </div>
            </div>
          </div>

          {/* Quick Actions Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 shadow-2xl">
              <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
              
              <div className="space-y-3">
                <Link to="/chat" className="block">
                  <Button
                    variant="glow"
                    fullWidth
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 justify-start"
                  >
                    <MessageSquare size={20} className="mr-3" />
                    Start Chatting
                  </Button>
                </Link>

                <Button
                  variant="outline"
                  fullWidth
                  className="border-gray-600 text-gray-300 hover:bg-gray-700 justify-start"
                >
                  <Bell size={20} className="mr-3" />
                  Notifications
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 shadow-2xl">
              <h3 className="text-lg font-semibold text-white mb-4">Activity</h3>
              
              <div className="space-y-4">
                <div className="bg-gray-700/50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Messages Sent</span>
                    <span className="text-2xl font-bold text-purple-400">0</span>
                  </div>
                </div>
                
                <div className="bg-gray-700/50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Chats Created</span>
                    <span className="text-2xl font-bold text-indigo-400">0</span>
                  </div>
                </div>
                
                <div className="bg-gray-700/50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Time Online</span>
                    <span className="text-lg font-semibold text-green-400">Active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
