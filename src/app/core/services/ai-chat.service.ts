import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface ChatMessage {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
  isTyping?: boolean;
}

export interface ChatRequest {
  message: string;
  userId?: string;
  sessionId?: string;
}

export interface ChatResponse {
  message: string;
  sessionId: string;
  timestamp: string;
  suggestions?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class AiChatService {
  // 🔧 BACKEND CONFIGURATION: Update this URL when backend is ready
  private apiUrl = 'http://localhost:3000/api/ai-chat'; // Replace with your actual backend URL
  private sessionId: string;

  constructor(private http: HttpClient) {
    this.sessionId = this.generateSessionId();
  }

  sendMessage(request: ChatRequest): Observable<ChatResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getAuthToken()}` // Add authentication if needed
    });

    const payload = {
      ...request,
      sessionId: this.sessionId
    };

    return this.http.post<ChatResponse>(this.apiUrl, payload, { headers })
      .pipe(
        map(response => ({
          ...response,
          timestamp: new Date().toISOString()
        })),
        catchError(this.handleError)
      );
  }

  getChatHistory(sessionId?: string): Observable<ChatMessage[]> {
    const id = sessionId || this.sessionId;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getAuthToken()}`
    });

    return this.http.get<ChatMessage[]>(`${this.apiUrl}/history/${id}`, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  clearChatHistory(sessionId?: string): Observable<void> {
    const id = sessionId || this.sessionId;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getAuthToken()}`
    });

    return this.http.delete<void>(`${this.apiUrl}/history/${id}`, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  getStudySuggestions(topic?: string): Observable<string[]> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getAuthToken()}`
    });

    const params = topic ? { topic } : {};

    return this.http.get<string[]>(`${this.apiUrl}/suggestions`, { 
      headers,
      params: params as any
    })
      .pipe(
        catchError(this.handleError)
      );
  }

  private generateSessionId(): string {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  private getAuthToken(): string {
    // Get token from localStorage, sessionStorage, or auth service
    return localStorage.getItem('authToken') || '';
  }

  private handleError(error: any): Observable<never> {
    console.error('AI Chat Service Error:', error);
    
    let errorMessage = 'An error occurred while communicating with the AI service.';
    
    if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.message) {
      errorMessage = error.message;
    }

    return throwError(() => new Error(errorMessage));
  }
}
