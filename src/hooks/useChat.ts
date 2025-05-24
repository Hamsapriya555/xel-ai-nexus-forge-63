import { useState, useEffect } from 'react';
import { chatApi } from '@/lib/api';
import { Chat, Message } from '@/types/chat';

export function useChat() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch chats on mount
  useEffect(() => {
    const loadChats = async () => {
      try {
        setIsLoading(true);
        const fetchedChats = await chatApi.getChats();
        setChats(fetchedChats);
        if (fetchedChats.length > 0) {
          setActiveChat(fetchedChats[0]);
        }
      } catch (error) {
        console.error('Error fetching chats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadChats();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  };

  const createNewChat = async () => {
    try {
      const newChat = await chatApi.createChat();
      setChats(prevChats => [newChat, ...prevChats]);
      setActiveChat(newChat);
      return newChat;
    } catch (error) {
      console.error('Error creating new chat:', error);
      return null;
    }
  };

  const selectChat = (chatId: string) => {
    const chat = chats.find(c => c.id === chatId);
    if (chat) {
      setActiveChat(chat);
    }
  };

  const sendMessage = async () => {
    if (!inputValue.trim() || !activeChat) return;

    const messageContent = inputValue.trim();
    setInputValue('');
    setIsTyping(true);

    try {
      console.log('Sending message:', messageContent);
      
      // Send user message to API (this adds the message to the chat internally)
      await chatApi.sendMessage(activeChat.id, messageContent);
      console.log('User message sent to API');
      
      // Get updated chat with the user message from API
      const updatedChats = await chatApi.getChats();
      const updatedActiveChat = updatedChats.find(chat => chat.id === activeChat.id);
      
      if (updatedActiveChat) {
        setActiveChat(updatedActiveChat);
        setChats(updatedChats);
      }
      
      // Get AI response
      const aiResponse = await chatApi.getAIResponse(activeChat.id, messageContent);
      console.log('AI response received:', aiResponse);
      
      // Get final updated chat with AI response
      const finalChats = await chatApi.getChats();
      const finalActiveChat = finalChats.find(chat => chat.id === activeChat.id);
      
      if (finalActiveChat) {
        setActiveChat(finalActiveChat);
        setChats(finalChats);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsTyping(false);
    }
  };

  return {
    chats,
    activeChat,
    inputValue,
    isTyping,
    isLoading,
    handleInputChange,
    createNewChat,
    selectChat,
    sendMessage,
    setInputValue
  };
}
