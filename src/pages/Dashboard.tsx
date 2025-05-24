
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, User, LogOut, Edit, Save, X } from 'lucide-react';
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 pt-16">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
            <p className="text-gray-400">Welcome back, {profile?.username || user?.email}</p>
          </div>
          <Button
            onClick={logout}
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-800"
          >
            <LogOut size={16} className="mr-2" />
            Logout
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Profile Card */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-white flex items-center">
                <User size={20} className="mr-2" />
                Profile
              </h2>
              {!isEditing && (
                <Button
                  onClick={() => setIsEditing(true)}
                  variant="outline"
                  size="sm"
                  className="border-gray-600 text-gray-300 hover:bg-gray-800"
                >
                  <Edit size={16} className="mr-1" />
                  Edit
                </Button>
              )}
            </div>

            <div className="space-y-6">
              {/* Avatar */}
              <div className="flex items-center space-x-4">
                <img
                  src={formData.avatar_url || profile?.avatar_url}
                  alt="Avatar"
                  className="w-16 h-16 rounded-full bg-gray-700"
                />
                <div className="flex-1">
                  {isEditing ? (
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
                  ) : (
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Avatar</p>
                      <p className="text-white truncate">{profile?.avatar_url || 'No avatar set'}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Username */}
              <div>
                {isEditing ? (
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
                ) : (
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Username</p>
                    <p className="text-white">{profile?.username}</p>
                  </div>
                )}
              </div>

              {/* Email */}
              <div>
                <p className="text-sm text-gray-400 mb-1">Email</p>
                <p className="text-white">{user?.email}</p>
              </div>

              {/* Action Buttons */}
              {isEditing && (
                <div className="flex space-x-3 pt-4">
                  <Button
                    onClick={handleSave}
                    variant="glow"
                    isLoading={isLoading}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  >
                    <Save size={16} className="mr-1" />
                    Save
                  </Button>
                  <Button
                    onClick={handleCancel}
                    variant="outline"
                    disabled={isLoading}
                    className="border-gray-600 text-gray-300 hover:bg-gray-800"
                  >
                    <X size={16} className="mr-1" />
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 shadow-2xl">
            <h2 className="text-xl font-semibold text-white mb-6">Quick Actions</h2>
            
            <div className="space-y-4">
              <Link to="/chat">
                <Button
                  variant="glow"
                  fullWidth
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 justify-start"
                >
                  <MessageSquare size={20} className="mr-3" />
                  Start Chatting
                </Button>
              </Link>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-700/50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-purple-400">0</p>
                  <p className="text-sm text-gray-400">Messages Sent</p>
                </div>
                <div className="bg-gray-700/50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-indigo-400">0</p>
                  <p className="text-sm text-gray-400">Chats Created</p>
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
