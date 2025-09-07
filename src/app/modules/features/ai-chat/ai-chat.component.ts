import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { AiChatService, ChatMessage, ChatRequest, ChatResponse } from '../../../core/services/ai-chat.service';
import { ENABLE_BACKEND_API, AI_CHAT_CONFIG } from '../../../core/config/ai-chat.config';

interface QuickAction {
  label: string;
  text: string;
  icon: string;
}

@Component({
  selector: 'app-ai-chat',
  templateUrl: './ai-chat.component.html',
  styleUrls: ['./ai-chat.component.scss']
})
export class AiChatComponent implements OnInit, AfterViewInit {
  @ViewChild('messageInput') messageInput!: ElementRef;
  
  messages: ChatMessage[] = [];
  newMessage = '';
  isTyping = false;
  isRecording = false;
  errorMessage = '';
  suggestions: string[] = [];
  
  // 🔧 CONFIGURATION: Set to true when backend API is ready
  USE_BACKEND_API = ENABLE_BACKEND_API; // Made public for template access
  
  quickActions: QuickAction[] = [
    { label: 'Explain Concept', text: 'Can you explain this concept in simple terms?', icon: 'fas fa-lightbulb' },
    { label: 'Study Tips', text: 'Give me some study tips for this subject', icon: 'fas fa-graduation-cap' },
    { label: 'Quiz Me', text: 'Create a quiz to test my knowledge', icon: 'fas fa-question-circle' },
    { label: 'Summarize', text: 'Can you summarize this topic?', icon: 'fas fa-file-alt' }
  ];

  constructor(private aiChatService: AiChatService) {}

  ngOnInit(): void {
    this.addWelcomeMessage();
    
    // 🔧 BACKEND API: Uncomment when backend is ready
    if (this.USE_BACKEND_API) {
      this.loadChatHistory();
      this.loadSuggestions();
    }
  }

  ngAfterViewInit(): void {
    this.scrollToBottom();
  }

  addWelcomeMessage(): void {
    this.messages.push({
      id: 1,
      text: 'Hello! I\'m your AI study assistant. How can I help you today?',
      isUser: false,
      timestamp: new Date()
    });
  }

  sendMessage(): void {
    if (this.newMessage.trim()) {
      const userMessage: ChatMessage = {
        id: Date.now(),
        text: this.newMessage,
        isUser: true,
        timestamp: new Date()
      };

      this.messages.push(userMessage);
      this.isTyping = true;
      this.errorMessage = '';
      const messageText = this.newMessage;
      this.newMessage = '';
      this.scrollToBottom();

      // 🔧 BACKEND API: Choose between mock or real API
      if (this.USE_BACKEND_API) {
        this.sendMessageToBackend(messageText);
      } else {
        this.sendMockMessage(messageText);
      }
    }
  }

  // 🔧 BACKEND API: Real backend communication (uncomment when backend is ready)
  private sendMessageToBackend(messageText: string): void {
    const request: ChatRequest = {
      message: messageText,
      userId: this.getCurrentUserId()
    };

    this.aiChatService.sendMessage(request).subscribe({
      next: (response: ChatResponse) => {
        const aiMessage: ChatMessage = {
          id: Date.now(),
          text: response.message,
          isUser: false,
          timestamp: new Date(response.timestamp)
        };

        this.messages.push(aiMessage);
        this.isTyping = false;
        this.scrollToBottom();

        // Update suggestions if provided
        if (response.suggestions) {
          this.suggestions = response.suggestions;
        }
      },
      error: (error) => {
        console.error('Error sending message:', error);
        this.errorMessage = 'Sorry, I encountered an error. Please try again.';
        this.isTyping = false;
        
        // Add fallback message
        const fallbackMessage: ChatMessage = {
          id: Date.now(),
          text: 'I apologize, but I\'m having trouble connecting right now. Please try again in a moment.',
          isUser: false,
          timestamp: new Date()
        };
        this.messages.push(fallbackMessage);
        this.scrollToBottom();
      }
    });
  }

  // 🔧 MOCK RESPONSES: Temporary mock responses (remove when backend is ready)
  private sendMockMessage(messageText: string): void {
    // Simulate AI response with more realistic responses
    const delay = AI_CHAT_CONFIG.MOCK.MIN_DELAY + 
                  Math.random() * (AI_CHAT_CONFIG.MOCK.MAX_DELAY - AI_CHAT_CONFIG.MOCK.MIN_DELAY);
    
    setTimeout(() => {
      const responses = AI_CHAT_CONFIG.MOCK.RESPONSES.map(response => 
        response.replace('this', `"${messageText}"`)
      );
      
      const aiMessage: ChatMessage = {
        id: Date.now(),
        text: responses[Math.floor(Math.random() * responses.length)],
        isUser: false,
        timestamp: new Date()
      };
      
      this.messages.push(aiMessage);
      this.isTyping = false;
      this.scrollToBottom();
    }, delay);
  }

  sendQuickMessage(text: string): void {
    this.newMessage = text;
    this.sendMessage();
  }

  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  attachFile(): void {
    // Placeholder for file attachment functionality
    console.log('File attachment clicked');
    // In a real app, this would open a file picker
  }

  startVoiceInput(): void {
    if (!this.isRecording) {
      this.isRecording = true;
      console.log('Starting voice input...');
      // In a real app, this would start speech recognition
      
      // Simulate voice input
      setTimeout(() => {
        this.isRecording = false;
        this.newMessage = 'This is a simulated voice input message';
      }, 2000);
    }
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      const chatMessages = document.querySelector('.chat-messages');
      if (chatMessages) {
        chatMessages.scrollTop = chatMessages.scrollHeight;
      }
    }, 100);
  }

  // 🔧 BACKEND API: Load chat history from backend (uncomment when backend is ready)
  private loadChatHistory(): void {
    this.aiChatService.getChatHistory().subscribe({
      next: (history: ChatMessage[]) => {
        if (history && history.length > 0) {
          this.messages = history;
          this.scrollToBottom();
        }
      },
      error: (error) => {
        console.error('Error loading chat history:', error);
        // Continue with welcome message if history fails to load
      }
    });
  }

  // 🔧 BACKEND API: Load suggestions from backend (uncomment when backend is ready)
  private loadSuggestions(): void {
    this.aiChatService.getStudySuggestions().subscribe({
      next: (suggestions: string[]) => {
        this.suggestions = suggestions;
      },
      error: (error) => {
        console.error('Error loading suggestions:', error);
        // Use default suggestions if backend fails
        this.suggestions = [
          'Explain this concept',
          'Give me study tips',
          'Create a quiz',
          'Summarize this topic'
        ];
      }
    });
  }

  private getCurrentUserId(): string {
    // Get user ID from auth service or localStorage
    return localStorage.getItem('userId') || 'anonymous';
  }

  // 🔧 BACKEND API: Clear chat history (uncomment when backend is ready)
  clearChatHistory(): void {
    if (this.USE_BACKEND_API) {
      this.aiChatService.clearChatHistory().subscribe({
        next: () => {
          this.messages = [];
          this.addWelcomeMessage();
          this.errorMessage = '';
        },
        error: (error) => {
          console.error('Error clearing chat history:', error);
          this.errorMessage = 'Failed to clear chat history. Please try again.';
        }
      });
    } else {
      // Mock clear - just clear local messages
      this.messages = [];
      this.addWelcomeMessage();
      this.errorMessage = '';
    }
  }

  retryLastMessage(): void {
    if (this.messages.length > 0) {
      const lastUserMessage = this.messages
        .filter(msg => msg.isUser)
        .pop();
      
      if (lastUserMessage) {
        this.newMessage = lastUserMessage.text;
        this.sendMessage();
      }
    }
  }
}
