import { Component, OnInit } from '@angular/core';

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

@Component({
  selector: 'app-ai-chat',
  templateUrl: './ai-chat.component.html',
  styleUrls: ['./ai-chat.component.scss']
})
export class AiChatComponent implements OnInit {
  messages: Message[] = [];
  newMessage = '';
  isTyping = false;

  constructor() {}

  ngOnInit(): void {
    this.addWelcomeMessage();
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
      this.messages.push({
        id: Date.now(),
        text: this.newMessage,
        isUser: true,
        timestamp: new Date()
      });

      this.isTyping = true;
      this.newMessage = '';

      // Simulate AI response
      setTimeout(() => {
        this.messages.push({
          id: Date.now(),
          text: 'I understand your question. Let me help you with that!',
          isUser: false,
          timestamp: new Date()
        });
        this.isTyping = false;
      }, 1500);
    }
  }

  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }
}
