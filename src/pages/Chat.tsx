
import React, { useState, useRef, useEffect } from 'react';
import { Send, Menu, X, Download, Bot, User } from 'lucide-react';
import Button from '@/components/Button';
import { useMessages } from '@/hooks/useMessages';
import { useAIChat } from '@/hooks/useAIChat';
import { useAuth } from '@/contexts/AuthContext';

const Chat = () => {
  const [inputValue, setInputValue] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages, isLoading, isSending, sendMessage, downloadChatHistory } = useMessages();
  const { generateAIResponse, isAITyping } = useAIChat();
  const { user, profile, logout } = useAuth();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAITyping]);

  const handleSend = async () => {
    if (!inputValue.trim() || isSending) return;
    
    const messageContent = inputValue.trim();
    setInputValue('');
    
    // Send user message
    await sendMessage(messageContent);
    
    // Generate and send AI response
    try {
      const aiResponse = await generateAIResponse(messageContent);
      await sendMessage(aiResponse);
    } catch (error) {
      console.error('Error generating AI response:', error);
    }
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
      <div className="flex h-screen items-center justify-center bg-gray-900">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-500 border-t-transparent"></div>
          <p className="text-white">Loading chat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-900 pt-16">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 w-80 bg-gray-800 border-r border-gray-700 
        transform transition-transform duration-300 ease-in-out lg:transform-none pt-16 lg:pt-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        hidden lg:block
      `}>
        <div className="flex flex-col h-full p-4">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Chats</h2>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>

          {/* New Chat Button */}
          <Button
            variant="outline"
            fullWidth
            className="mb-6 border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            + New Chat
          </Button>

          {/* Chat History - Placeholder */}
          <div className="flex-1 space-y-2">
            <div className="text-gray-400 text-sm mb-2">Recent Chats</div>
            <div className="p-3 rounded-lg bg-gray-700/50 text-gray-300 text-sm cursor-pointer hover:bg-gray-700">
              Global Chat Room
            </div>
          </div>

          {/* Download Section */}
          <div className="mt-auto">
            <div className="relative">
              <Button
                onClick={() => setShowDownloadMenu(!showDownloadMenu)}
                variant="outline"
                fullWidth
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
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
        <div className="lg:hidden bg-gray-800 border-b border-gray-700 p-4 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-400 hover:text-white"
          >
            <Menu size={24} />
          </button>
          <h1 className="text-xl font-semibold text-white">Chat</h1>
          <div className="w-6" />
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center max-w-md p-8">
                <Bot size={48} className="mx-auto mb-4 text-purple-400" />
                <h2 className="text-2xl font-bold text-white mb-2">How can I help you today?</h2>
                <p className="text-gray-400">Start a conversation by typing a message below. I'm here to assist you with questions, provide information, or just chat!</p>
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto">
              {messages.map((message, index) => {
                const isUser = message.user_id === user?.id;
                const isBot = message.profiles.username === 'Xel AI' || message.content.includes('AI');
                
                return (
                  <div key={message.id} className={`py-6 px-4 ${index % 2 === 1 ? 'bg-gray-800/50' : ''}`}>
                    <div className="flex items-start space-x-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        isBot ? 'bg-purple-600' : 'bg-gray-600'
                      }`}>
                        {isBot ? (
                          <Bot size={16} className="text-white" />
                        ) : (
                          <User size={16} className="text-white" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="font-medium text-white">
                            {isBot ? 'Xel AI' : message.profiles.username}
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatTime(message.created_at)}
                          </span>
                        </div>
                        <div className="text-gray-100 whitespace-pre-wrap break-words">
                          {message.content}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {/* AI Typing Indicator */}
              {isAITyping && (
                <div className="py-6 px-4 bg-gray-800/50">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0">
                      <Bot size={16} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-medium text-white">Xel AI</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <span className="text-gray-400 ml-2">Xel AI is typing...</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-700 bg-gray-900 p-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex space-x-4">
              <div className="flex-1 relative">
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Message Xel AI..."
                  className="w-full bg-gray-800 border border-gray-600 rounded-xl px-4 py-3 pr-12 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none max-h-32"
                  rows={1}
                  onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement;
                    target.style.height = 'auto';
                    target.style.height = Math.min(target.scrollHeight, 128) + 'px';
                  }}
                />
                <button
                  onClick={handleSend}
                  disabled={!inputValue.trim() || isSending || isAITyping}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSending ? (
                    <div className="w-4 h-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    <Send size={16} className="text-white" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
