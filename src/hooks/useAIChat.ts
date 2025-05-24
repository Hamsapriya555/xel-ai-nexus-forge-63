
import { useState } from 'react';

export function useAIChat() {
  const [isAITyping, setIsAITyping] = useState(false);

  const generateAIResponse = async (userMessage: string): Promise<string> => {
    setIsAITyping(true);
    
    // Simulate AI thinking time
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    const responses = [
      `That's an interesting point about "${userMessage.slice(0, 20)}...". Let me think about that. From my perspective, this relates to several key concepts in AI and technology.`,
      
      `I understand you're asking about "${userMessage.slice(0, 30)}...". This is a complex topic that touches on various aspects of artificial intelligence and human interaction.`,
      
      `Great question! When you mention "${userMessage.slice(0, 25)}...", it reminds me of the broader implications of AI development and how we can better serve human needs.`,
      
      `You've raised an important point. The topic of "${userMessage.slice(0, 20)}..." is something I've been trained to consider from multiple angles. Here's my analysis...`,
      
      `That's a fascinating observation about "${userMessage.slice(0, 30)}...". In the context of AI and machine learning, this connects to fundamental questions about intelligence and communication.`,
      
      `I appreciate your question about "${userMessage.slice(0, 25)}...". This is exactly the kind of thoughtful inquiry that helps me provide more meaningful responses.`,
      
      `Thank you for sharing that. When you discuss "${userMessage.slice(0, 20)}...", it opens up interesting possibilities for how AI can better understand and assist with human challenges.`,
      
      `Your message about "${userMessage.slice(0, 30)}..." touches on some key principles in artificial intelligence. Let me break this down for you.`,
      
      `I find your perspective on "${userMessage.slice(0, 25)}..." quite compelling. This relates to ongoing research in AI ethics and practical applications.`,
      
      `That's a thought-provoking question. The subject of "${userMessage.slice(0, 20)}..." involves several layers that are worth exploring together.`
    ];
    
    // Add some contextual responses based on keywords
    const lowerMessage = userMessage.toLowerCase();
    let response = '';
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      response = `Hello! I'm Xel AI, your intelligent assistant. I'm here to help you with questions, provide insights, and engage in meaningful conversations. What would you like to discuss today?`;
    } else if (lowerMessage.includes('how are you')) {
      response = `I'm doing well, thank you for asking! As an AI, I'm always ready to help and learn from our conversations. I'm curious about what brings you here today. How can I assist you?`;
    } else if (lowerMessage.includes('weather')) {
      response = `I don't have access to real-time weather data, but I'd be happy to discuss weather patterns, climate science, or help you think about weather-related planning. What specific aspect of weather interests you?`;
    } else if (lowerMessage.includes('code') || lowerMessage.includes('programming')) {
      response = `I'd be glad to help with coding! Whether you're working on web development, data science, algorithms, or any other programming challenge, I can provide guidance, explain concepts, or help debug issues. What programming topic are you working on?`;
    } else if (lowerMessage.includes('explain') || lowerMessage.includes('what is')) {
      response = `I love explaining things! I can break down complex topics into understandable parts, provide examples, and help you grasp new concepts. What would you like me to explain?`;
    } else {
      // Use random response for general messages
      response = responses[Math.floor(Math.random() * responses.length)];
    }
    
    setIsAITyping(false);
    return response;
  };

  return {
    generateAIResponse,
    isAITyping
  };
}
