
import React, { useState, useRef, useEffect } from 'react';
import { Send, Download, Menu, X } from 'lucide-react';
import Button from '@/components/Button';
import { useMessages } from '@/hooks/useMessages';
import { useAuth } from '@/contexts/AuthContext';

const Chat = () => {
  const [inputValue, setInputValue] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages, isLoading, isSending, sendMessage, downloadChatHistory } = useMessages();
  const { user, profile, logout } = useAuth();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim() || isSending) return;
    
    const messageContent = inputValue.trim();
    setInputValue('');
    await sendMessage(messageContent);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-500 border-t-transparent"></div>
          <p className="text-white">Loading chat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 pt-16">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 w-80 bg-gray-800/90 backdrop-blur-sm border-r border-gray-700 
        transform transition-transform duration-300 ease-in-out lg:transform-none pt-16 lg:pt-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        hidden lg:block
      `}>
        <div className="flex flex-col h-full p-4">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Global Chat</h2>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>

          {/* User Info */}
          <div className="bg-gray-700/50 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-3">
              <img
                src={profile?.avatar_url}
                alt="Avatar"
                className="w-10 h-10 rounded-full bg-gray-600"
              />
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate">{profile?.username}</p>
                <p className="text-gray-400 text-sm truncate">{user?.email}</p>
              </div>
            </div>
            <Button
              onClick={logout}
              variant="outline"
              size="sm"
              className="w-full mt-3 border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              Logout
            </Button>
          </div>

          {/* Download Section */}
          <div className="mt-auto">
            <div className="relative">
              <Button
                onClick={() => setShowDownloadMenu(!showDownloadMenu)}
                variant="outline"
                fullWidth
                className="border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                <Download size={16} className="mr-2" />
                Download Chat
              </Button>
              
              {showDownloadMenu && (
                <div className="absolute bottom-full left-0 right-0 mb-2 bg-gray-700 rounded-lg border border-gray-600 overflow-hidden">
                  <button
                    onClick={() => {
                      downloadChatHistory('json');
                      setShowDownloadMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-white hover:bg-gray-600 transition-colors"
                  >
                    Download as JSON
                  </button>
                  <button
                    onClick={() => {
                      downloadChatHistory('txt');
                      setShowDownloadMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-white hover:bg-gray-600 transition-colors"
                  >
                    Download as TXT
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <div className="lg:hidden bg-gray-800/90 backdrop-blur-sm border-b border-gray-700 p-4 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-400 hover:text-white"
          >
            <Menu size={24} />
          </button>
          <h1 className="text-xl font-semibold text-white">Global Chat</h1>
          <div className="w-6" /> {/* Spacer */}
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <p className="text-gray-400 text-lg mb-2">No messages yet</p>
                <p className="text-gray-500">Be the first to start the conversation!</p>
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <div key={message.id} className="animate-fade-in">
                <div className={`flex items-start space-x-3 ${
                  message.user_id === user?.id ? 'flex-row-reverse space-x-reverse' : ''
                }`}>
                  <img
                    src={message.profiles.avatar_url}
                    alt={message.profiles.username}
                    className="w-8 h-8 rounded-full bg-gray-600 flex-shrink-0"
                  />
                  <div className={`max-w-xs lg:max-w-md xl:max-w-lg ${
                    message.user_id === user?.id ? 'text-right' : ''
                  }`}>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-sm font-medium text-gray-300">
                        {message.profiles.username}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatTime(message.created_at)}
                      </span>
                    </div>
                    <div className={`rounded-lg px-4 py-2 ${
                      message.user_id === user?.id
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white'
                        : 'bg-gray-700 text-gray-100'
                    }`}>
                      <p className="whitespace-pre-wrap break-words">{message.content}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-700 bg-gray-800/50 backdrop-blur-sm p-4">
          <div className="flex space-x-3">
            <div className="flex-1">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message... (Enter to send, Shift+Enter for new line)"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                rows={1}
                style={{
                  minHeight: '44px',
                  maxHeight: '120px',
                  height: 'auto',
                }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = 'auto';
                  target.style.height = Math.min(target.scrollHeight, 120) + 'px';
                }}
              />
            </div>
            <Button
              onClick={handleSend}
              disabled={!inputValue.trim() || isSending}
              variant="glow"
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 px-4 py-3"
            >
              {isSending ? (
                <div className="w-5 h-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <Send size={20} />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
