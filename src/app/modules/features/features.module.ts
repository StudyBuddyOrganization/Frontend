import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../core/guards/auth.guard';

// Feature Components
import { NotesComponent } from './notes/notes.component';
import { QuizGeneratorComponent } from './quiz-generator/quiz-generator.component';
import { StudyPlannerComponent } from './study-planner/study-planner.component';
import { AiChatComponent } from './ai-chat/ai-chat.component';
import { PdfSummaryComponent } from './pdf-summary/pdf-summary.component';
import { WordPdfComponent } from './word-pdf/word-pdf.component';

// Feature Routes
const routes: Routes = [
  {
    path: '',
    redirectTo: 'notes',
    pathMatch: 'full'
  },
  {
    path: 'notes',
    component: NotesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'quiz-generator',
    component: QuizGeneratorComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'study-planner',
    component: StudyPlannerComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'ai-chat',
    component: AiChatComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'pdf-summary',
    component: PdfSummaryComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'word-pdf',
    component: WordPdfComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  declarations: [
    NotesComponent,
    QuizGeneratorComponent,
    StudyPlannerComponent,
    AiChatComponent,
    PdfSummaryComponent,
    WordPdfComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  exports: [
    NotesComponent,
    QuizGeneratorComponent,
    StudyPlannerComponent,
    AiChatComponent,
    PdfSummaryComponent,
    WordPdfComponent
  ]
})
export class FeaturesModule { }
