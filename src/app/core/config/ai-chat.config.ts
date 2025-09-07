// 🔧 AI CHAT CONFIGURATION
// Update these settings when backend API is ready

export const AI_CHAT_CONFIG = {
  // Set to true when backend API is ready
  USE_BACKEND_API: false,
  
  // Backend API Configuration
  BACKEND: {
    // Update this URL when backend is ready
    API_URL: 'http://localhost:3000/api/ai-chat',
    
    // API Endpoints
    ENDPOINTS: {
      SEND_MESSAGE: '/api/ai-chat',
      GET_HISTORY: '/api/ai-chat/history',
      CLEAR_HISTORY: '/api/ai-chat/history',
      GET_SUGGESTIONS: '/api/ai-chat/suggestions'
    },
    
    // Request timeout in milliseconds
    TIMEOUT: 30000,
    
    // Retry configuration
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000
  },
  
  // Mock Configuration (used when USE_BACKEND_API is false)
  MOCK: {
    // Response delay range in milliseconds
    MIN_DELAY: 1500,
    MAX_DELAY: 2500,
    
    // Mock responses
    RESPONSES: [
      'I understand your question. Let me help you with that!',
      'That\'s a great question! Here\'s what I think...',
      'I can definitely help you with that concept. Let me explain...',
      'Interesting question! Let me break this down for you...',
      'I\'d be happy to help you understand this better...',
      'Great question! This is an important topic. Here\'s my perspective...',
      'I can help you with that. Let me provide some insights...',
      'That\'s a thoughtful question. Here\'s what I know...'
    ],
    
    // Default suggestions
    DEFAULT_SUGGESTIONS: [
      'Explain this concept',
      'Give me study tips',
      'Create a quiz',
      'Summarize this topic',
      'Provide examples',
      'Compare with other concepts'
    ]
  }
};

// 🔧 QUICK SWITCH: Change this to true when backend is ready
export const ENABLE_BACKEND_API = AI_CHAT_CONFIG.USE_BACKEND_API;
