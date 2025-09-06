import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

interface StudySession {
  id: number;
  title: string;
  subject: string;
  duration: number; // in minutes
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in-progress' | 'completed';
  scheduledDate: Date;
  startTime: string;
  endTime: string;
  description: string;
  color: string;
}

interface StudyGoal {
  id: number;
  title: string;
  description: string;
  targetDate: Date;
  progress: number; // 0-100
  status: 'active' | 'completed' | 'paused';
  subject: string;
  color: string;
}

@Component({
  selector: 'app-study-planner',
  templateUrl: './study-planner.component.html',
  styleUrls: ['./study-planner.component.scss']
})
export class StudyPlannerComponent implements OnInit {
  sessionForm: FormGroup;
  goalForm: FormGroup;
  studySessions: StudySession[] = [];
  studyGoals: StudyGoal[] = [];
  filteredSessions: StudySession[] = [];
  selectedDate = new Date();
  viewMode: 'calendar' | 'list' = 'calendar';
  selectedSession: StudySession | null = null;
  isEditingSession = false;
  isEditingGoal = false;

  subjects = [
    'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science',
    'English', 'History', 'Geography', 'Economics', 'Psychology', 'Other'
  ];

  priorities = [
    { value: 'low', label: 'Low', color: '#10b981' },
    { value: 'medium', label: 'Medium', color: '#f59e0b' },
    { value: 'high', label: 'High', color: '#ef4444' }
  ];

  colors = [
    { value: '#fef3c7', name: 'Yellow' },
    { value: '#dbeafe', name: 'Blue' },
    { value: '#dcfce7', name: 'Green' },
    { value: '#fce7f3', name: 'Pink' },
    { value: '#e0e7ff', name: 'Purple' },
    { value: '#f3f4f6', name: 'Gray' }
  ];

  constructor(private fb: FormBuilder) {
    this.sessionForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      subject: ['', Validators.required],
      duration: [60, [Validators.required, Validators.min(15), Validators.max(480)]],
      priority: ['medium', Validators.required],
      scheduledDate: [new Date().toISOString().split('T')[0], Validators.required],
      startTime: ['09:00', Validators.required],
      description: [''],
      color: ['#dbeafe']
    });

    this.goalForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', Validators.required],
      targetDate: ['', Validators.required],
      subject: ['', Validators.required],
      color: ['#dcfce7']
    });
  }

  ngOnInit(): void {
    this.loadData();
    this.filterSessions();
  }

  loadData(): void {
    // Load from localStorage
    const savedSessions = localStorage.getItem('study-sessions');
    const savedGoals = localStorage.getItem('study-goals');

    if (savedSessions) {
      this.studySessions = JSON.parse(savedSessions).map((session: any) => ({
        ...session,
        scheduledDate: new Date(session.scheduledDate)
      }));
    } else {
      // Sample data
      this.studySessions = [
        {
          id: 1,
          title: 'Linear Algebra Review',
          subject: 'Mathematics',
          duration: 120,
          priority: 'high',
          status: 'pending',
          scheduledDate: new Date(),
          startTime: '09:00',
          endTime: '11:00',
          description: 'Review eigenvalues and eigenvectors',
          color: '#dbeafe'
        },
        {
          id: 2,
          title: 'Physics Problem Solving',
          subject: 'Physics',
          duration: 90,
          priority: 'medium',
          status: 'pending',
          scheduledDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
          startTime: '14:00',
          endTime: '15:30',
          description: 'Work on mechanics problems',
          color: '#dcfce7'
        }
      ];
    }

    if (savedGoals) {
      this.studyGoals = JSON.parse(savedGoals).map((goal: any) => ({
        ...goal,
        targetDate: new Date(goal.targetDate)
      }));
    } else {
      this.studyGoals = [
        {
          id: 1,
          title: 'Complete Calculus Course',
          description: 'Finish all calculus chapters and practice problems',
          targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          progress: 45,
          status: 'active',
          subject: 'Mathematics',
          color: '#dbeafe'
        }
      ];
    }
  }

  saveData(): void {
    localStorage.setItem('study-sessions', JSON.stringify(this.studySessions));
    localStorage.setItem('study-goals', JSON.stringify(this.studyGoals));
  }

  onSubmitSession(): void {
    if (this.sessionForm.valid) {
      const formValue = this.sessionForm.value;
      const startTime = new Date(`${formValue.scheduledDate}T${formValue.startTime}`);
      const endTime = new Date(startTime.getTime() + formValue.duration * 60000);

      if (this.isEditingSession && this.selectedSession) {
        // Update existing session
        const index = this.studySessions.findIndex(s => s.id === this.selectedSession!.id);
        this.studySessions[index] = {
          ...this.selectedSession,
          ...formValue,
          endTime: endTime.toTimeString().slice(0, 5),
          scheduledDate: startTime
        };
      } else {
        // Create new session
        const newSession: StudySession = {
          id: Date.now(),
          ...formValue,
          endTime: endTime.toTimeString().slice(0, 5),
          scheduledDate: startTime,
          status: 'pending'
        };
        this.studySessions.unshift(newSession);
      }

      this.saveData();
      this.filterSessions();
      this.resetSessionForm();
    }
  }

  onSubmitGoal(): void {
    if (this.goalForm.valid) {
      const formValue = this.goalForm.value;

      if (this.isEditingGoal) {
        // Update existing goal
        const index = this.studyGoals.findIndex(g => g.id === this.selectedSession!.id);
        this.studyGoals[index] = {
          ...this.studyGoals[index],
          ...formValue,
          targetDate: new Date(formValue.targetDate)
        };
      } else {
        // Create new goal
        const newGoal: StudyGoal = {
          id: Date.now(),
          ...formValue,
          targetDate: new Date(formValue.targetDate),
          progress: 0,
          status: 'active'
        };
        this.studyGoals.unshift(newGoal);
      }

      this.saveData();
      this.resetGoalForm();
    }
  }

  editSession(session: StudySession): void {
    this.selectedSession = session;
    this.isEditingSession = true;
    this.sessionForm.patchValue({
      ...session,
      scheduledDate: session.scheduledDate.toISOString().split('T')[0]
    });
  }

  editGoal(goal: StudyGoal): void {
    this.isEditingGoal = true;
    this.goalForm.patchValue({
      ...goal,
      targetDate: goal.targetDate.toISOString().split('T')[0]
    });
  }

  deleteSession(session: StudySession): void {
    if (confirm('Are you sure you want to delete this study session?')) {
      this.studySessions = this.studySessions.filter(s => s.id !== session.id);
      this.saveData();
      this.filterSessions();
    }
  }

  deleteGoal(goal: StudyGoal): void {
    if (confirm('Are you sure you want to delete this study goal?')) {
      this.studyGoals = this.studyGoals.filter(g => g.id !== goal.id);
      this.saveData();
    }
  }

  startSession(session: StudySession): void {
    session.status = 'in-progress';
    this.saveData();
    this.filterSessions();
  }

  completeSession(session: StudySession): void {
    session.status = 'completed';
    this.saveData();
    this.filterSessions();
  }

  updateGoalProgress(goal: StudyGoal, progress: number): void {
    goal.progress = Math.max(0, Math.min(100, progress));
    if (goal.progress === 100) {
      goal.status = 'completed';
    }
    this.saveData();
  }

  onGoalProgressInput(goal: StudyGoal, event: Event): void {
    const input = event.target as HTMLInputElement;
    this.updateGoalProgress(goal, Number(input.value));
  }

  resetSessionForm(): void {
    this.sessionForm.reset({
      title: '',
      subject: '',
      duration: 60,
      priority: 'medium',
      scheduledDate: new Date().toISOString().split('T')[0],
      startTime: '09:00',
      description: '',
      color: '#dbeafe'
    });
    this.selectedSession = null;
    this.isEditingSession = false;
  }

  resetGoalForm(): void {
    this.goalForm.reset({
      title: '',
      description: '',
      targetDate: '',
      subject: '',
      color: '#dcfce7'
    });
    this.isEditingGoal = false;
  }

  filterSessions(): void {
    const selectedDateStr = this.selectedDate.toDateString();
    this.filteredSessions = this.studySessions.filter(session => 
      session.scheduledDate.toDateString() === selectedDateStr
    );
  }

  onDateChange(): void {
    this.filterSessions();
  }

  getSessionsForDate(date: Date): StudySession[] {
    return this.studySessions.filter(session => 
      session.scheduledDate.toDateString() === date.toDateString()
    );
  }

  getPriorityColor(priority: string): string {
    const priorityObj = this.priorities.find(p => p.value === priority);
    return priorityObj?.color || '#6b7280';
  }

  getStatusColor(status: string): string {
    const colors: { [key: string]: string } = {
      'pending': '#6b7280',
      'in-progress': '#3b82f6',
      'completed': '#10b981'
    };
    return colors[status] || '#6b7280';
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    }).format(date);
  }

  formatTime(time: string): string {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  }

  getDaysInMonth(): Date[] {
    const year = this.selectedDate.getFullYear();
    const month = this.selectedDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days: Date[] = [];

    for (let day = 1; day <= lastDay.getDate(); day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  }

  trackBySessionId(index: number, session: StudySession): number {
    return session.id;
  }

  trackByGoalId(index: number, goal: StudyGoal): number {
    return goal.id;
  }

  prevMonth() {
    this.selectedDate = new Date(this.selectedDate.getFullYear(), this.selectedDate.getMonth() - 1, 1);
    this.filterSessions();
  }

  nextMonth() {
    this.selectedDate = new Date(this.selectedDate.getFullYear(), this.selectedDate.getMonth() + 1, 1);
    this.filterSessions();
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  }
}