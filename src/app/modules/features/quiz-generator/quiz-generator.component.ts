import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface Quiz {
  id: number;
  title: string;
  subject: string;
  questions: Question[];
  createdAt: Date;
}

@Component({
  selector: 'app-quiz-generator',
  templateUrl: './quiz-generator.component.html',
  styleUrls: ['./quiz-generator.component.scss']
})
export class QuizGeneratorComponent implements OnInit {
  quizzes: Quiz[] = [];
  currentQuiz: Quiz | null = null;
  currentQuestionIndex = 0;
  selectedAnswers: number[] = [];
  showResults = false;
  score = 0;
  isGenerating = false;

  newQuiz: Quiz = {
    id: 0,
    title: '',
    subject: '',
    questions: [],
    createdAt: new Date()
  };

  newQuizForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.newQuizForm = this.fb.group({
      title: ['', Validators.required],
      subject: ['', Validators.required]
    });
    this.loadQuizzes();
  }

  loadQuizzes(): void {
    // Mock data
    this.quizzes = [
      {
        id: 1,
        title: 'Mathematics Basics',
        subject: 'Mathematics',
        questions: [
          {
            id: 1,
            question: 'What is 2 + 2?',
            options: ['3', '4', '5', '6'],
            correctAnswer: 1,
            explanation: '2 + 2 equals 4.'
          },
          {
            id: 2,
            question: 'What is the square root of 16?',
            options: ['2', '4', '8', '16'],
            correctAnswer: 1,
            explanation: 'The square root of 16 is 4.'
          }
        ],
        createdAt: new Date()
      }
    ];
  }

  generateQuiz(): void {
    if (!this.newQuizForm.valid) return;

    this.isGenerating = true;
    
    // Simulate AI generation
    setTimeout(() => {
      this.newQuiz.id = Date.now();
      this.newQuiz.questions = this.generateQuestions();
      this.quizzes.unshift({ ...this.newQuiz });
      this.resetForm();
      this.isGenerating = false;
    }, 2000);
  }

  generateQuestions(): Question[] {
    // Mock question generation
    return [
      {
        id: 1,
        question: `What is a key concept in ${this.newQuiz.subject}?`,
        options: ['Option A', 'Option B', 'Option C', 'Option D'],
        correctAnswer: 1,
        explanation: 'This is the correct answer because...'
      },
      {
        id: 2,
        question: `Which of the following is true about ${this.newQuiz.subject}?`,
        options: ['Statement 1', 'Statement 2', 'Statement 3', 'Statement 4'],
        correctAnswer: 2,
        explanation: 'This statement is correct because...'
      }
    ];
  }

  startQuiz(quiz: Quiz): void {
    this.currentQuiz = quiz;
    this.currentQuestionIndex = 0;
    this.selectedAnswers = new Array(quiz.questions.length).fill(-1);
    this.showResults = false;
    this.score = 0;
  }

  selectAnswer(answerIndex: number): void {
    this.selectedAnswers[this.currentQuestionIndex] = answerIndex;
  }

  nextQuestion(): void {
    if (this.currentQuestionIndex < this.currentQuiz!.questions.length - 1) {
      this.currentQuestionIndex++;
    }
  }

  previousQuestion(): void {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
    }
  }

  submitQuiz(): void {
    this.calculateScore();
    this.showResults = true;
  }

  calculateScore(): void {
    this.score = 0;
    this.currentQuiz!.questions.forEach((question, index) => {
      if (this.selectedAnswers[index] === question.correctAnswer) {
        this.score++;
      }
    });
  }

  resetQuiz(): void {
    this.currentQuiz = null;
    this.currentQuestionIndex = 0;
    this.selectedAnswers = [];
    this.showResults = false;
    this.score = 0;
  }

  resetForm(): void {
    this.newQuizForm.reset();
  }

  deleteQuiz(id: number): void {
    this.quizzes = this.quizzes.filter(q => q.id !== id);
  }

  get currentQuestion(): Question | null {
    if (!this.currentQuiz) return null;
    return this.currentQuiz.questions[this.currentQuestionIndex];
  }

  get isLastQuestion(): boolean {
    if (!this.currentQuiz) return false;
    return this.currentQuestionIndex === this.currentQuiz.questions.length - 1;
  }

  get isFirstQuestion(): boolean {
    return this.currentQuestionIndex === 0;
  }

  get percentageScore(): number {
    if (!this.currentQuiz) return 0;
    return Math.round((this.score / this.currentQuiz.questions.length) * 100);
  }
}

