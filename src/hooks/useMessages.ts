
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export type ChatMessage = {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  profiles: {
    username: string;
    avatar_url?: string;
  };
};

export function useMessages() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const { user } = useAuth();

  // Fetch messages
  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          id,
          user_id,
          content,
          created_at,
          profiles (
            username,
            avatar_url
          )
        `)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to load messages');
    } finally {
      setIsLoading(false);
    }
  };

  // Send message
  const sendMessage = async (content: string) => {
    if (!user || !content.trim()) return;

    setIsSending(true);
    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          content: content.trim(),
          user_id: user.id,
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setIsSending(false);
    }
  };

  // Download chat history
  const downloadChatHistory = (format: 'json' | 'txt') => {
    if (messages.length === 0) {
      toast.error('No messages to download');
      return;
    }

    let content: string;
    let filename: string;
    let mimeType: string;

    if (format === 'json') {
      content = JSON.stringify(messages, null, 2);
      filename = 'chat_history.json';
      mimeType = 'application/json';
    } else {
      content = messages
        .map(msg => {
          const timestamp = new Date(msg.created_at).toLocaleString();
          return `${timestamp} - ${msg.profiles.username}: ${msg.content}`;
        })
        .join('\n');
      filename = 'chat_history.txt';
      mimeType = 'text/plain';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success(`Chat history downloaded as ${filename}`);
  };

  // Set up real-time subscription
  useEffect(() => {
    fetchMessages();

    const channel = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages'
        },
        async (payload) => {
          // Fetch the new message with profile data
          const { data, error } = await supabase
            .from('messages')
            .select(`
              id,
              user_id,
              content,
              created_at,
              profiles (
                username,
                avatar_url
              )
            `)
            .eq('id', payload.new.id)
            .single();

          if (!error && data) {
            setMessages(prev => [...prev, data]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    messages,
    isLoading,
    isSending,
    sendMessage,
    downloadChatHistory,
    refetchMessages: fetchMessages
  };
}
