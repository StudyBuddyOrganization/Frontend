import { Component, OnInit } from '@angular/core';
import { AuthService, User } from '../../core/services/auth.service';

interface FeatureCard {
  id: number;
  title: string;
  description: string;
  icon: string;
  color: string;
  status: 'active' | 'new' | 'beta';
  route: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  user: User | null = null;

  stats = [
    { icon: '📚', value: '12', label: 'Courses Completed' },
    { icon: '⏱️', value: '24h', label: 'Study Time' },
    { icon: '🎯', value: '85%', label: 'Progress' },
    { icon: '🏆', value: '5', label: 'Achievements' }
  ];

  featureCards: FeatureCard[] = [
    {
      id: 1,
      title: 'PDF Summary',
      description: 'Transform your PDFs into concise, intelligent summaries',
      icon: '📄',
      color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      status: 'active',
      route: '/dashboard/features/pdf-summary'
    },
    {
      id: 2,
      title: 'AI Chat',
      description: 'Get instant answers and study help from our AI tutor',
      icon: '🤖',
      color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      status: 'new',
      route: '/dashboard/features/ai-chat'
    },
    {
      id: 3,
      title: 'Word to PDF',
      description: 'Convert Word documents to PDF format instantly',
      icon: '📝',
      color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      status: 'active',
      route: '/dashboard/features/word-pdf'

    },
    {
      id: 4,
      title: 'Smart Notes',
      description: 'Create, organize, and manage your study notes',
      icon: '📝',
      color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      status: 'active',
      route: '/dashboard/features/notes'
    },
    {
      id: 5,
      title: 'Study Planner',
      description: 'Plan your study schedule with AI-powered recommendations',
      icon: '📅',
      color: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      status: 'beta',
      route: '/dashboard/features/study-planner'
    },
    {
      id: 6,
      title: 'Quiz Generator',
      description: 'Create and take quizzes to test your knowledge',
      icon: '❓',
      color: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      status: 'active',
      route: '/dashboard/features/quiz-generator'
    }
  ];

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.user = user;
    });
  }
}
