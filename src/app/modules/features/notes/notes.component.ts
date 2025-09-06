import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

interface Note {
  id: number;
  title: string;
  content: string;
  category: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  isPinned: boolean;
  color: string;
}

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss']
})
export class NotesComponent implements OnInit {
  notesForm: FormGroup;
  notes: Note[] = [];
  filteredNotes: Note[] = [];
  selectedNote: Note | null = null;
  isEditing = false;
  searchQuery = '';
  selectedCategory = 'all';
  sortBy = 'updatedAt';
  sortOrder: 'asc' | 'desc' = 'desc';

  categories = [
    { value: 'all', label: 'All Notes' },
    { value: 'study', label: 'Study Notes' },
    { value: 'lecture', label: 'Lecture Notes' },
    { value: 'assignment', label: 'Assignments' },
    { value: 'research', label: 'Research' },
    { value: 'personal', label: 'Personal' }
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
    this.notesForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      content: ['', [Validators.required, Validators.minLength(10)]],
      category: ['study', Validators.required],
      tags: [''],
      color: ['#fef3c7']
    });
  }

  ngOnInit(): void {
    this.loadNotes();
    this.filterNotes();
  }

  loadNotes(): void {
    // Load from localStorage or API
    const savedNotes = localStorage.getItem('smart-notes');
    if (savedNotes) {
      this.notes = JSON.parse(savedNotes).map((note: any) => ({
        ...note,
        createdAt: new Date(note.createdAt),
        updatedAt: new Date(note.updatedAt)
      }));
    } else {
      // Sample data
      this.notes = [
        {
          id: 1,
          title: 'Angular Fundamentals',
          content: 'Angular is a platform and framework for building single-page client applications using HTML and TypeScript. Key concepts include components, services, directives, and dependency injection.',
          category: 'study',
          tags: ['angular', 'frontend', 'typescript'],
          createdAt: new Date('2024-01-15'),
          updatedAt: new Date('2024-01-15'),
          isPinned: true,
          color: '#dbeafe'
        },
        {
          id: 2,
          title: 'Machine Learning Basics',
          content: 'Machine learning is a subset of artificial intelligence that enables computers to learn and improve from experience without being explicitly programmed. It includes supervised, unsupervised, and reinforcement learning.',
          category: 'lecture',
          tags: ['ml', 'ai', 'data-science'],
          createdAt: new Date('2024-01-14'),
          updatedAt: new Date('2024-01-14'),
          isPinned: false,
          color: '#dcfce7'
        }
      ];
    }
    this.filterNotes();
  }

  saveNotes(): void {
    localStorage.setItem('smart-notes', JSON.stringify(this.notes));
  }

  onSubmit(): void {
    if (this.notesForm.valid) {
      const formValue = this.notesForm.value;
      const tags = formValue.tags ? formValue.tags.split(',').map((tag: string) => tag.trim()) : [];

      if (this.isEditing && this.selectedNote) {
        // Update existing note
        const index = this.notes.findIndex(note => note.id === this.selectedNote!.id);
        this.notes[index] = {
          ...this.selectedNote,
          ...formValue,
          tags,
          updatedAt: new Date()
        };
      } else {
        // Create new note
        const newNote: Note = {
          id: Date.now(),
          title: formValue.title,
          content: formValue.content,
          category: formValue.category,
          tags,
          createdAt: new Date(),
          updatedAt: new Date(),
          isPinned: false,
          color: formValue.color
        };
        this.notes.unshift(newNote);
      }

      this.saveNotes();
      this.filterNotes();
      this.resetForm();
    }
  }

  editNote(note: Note): void {
    this.selectedNote = note;
    this.isEditing = true;
    this.notesForm.patchValue({
      title: note.title,
      content: note.content,
      category: note.category,
      tags: note.tags.join(', '),
      color: note.color
    });
  }

  deleteNote(note: Note): void {
    if (confirm('Are you sure you want to delete this note?')) {
      this.notes = this.notes.filter(n => n.id !== note.id);
      this.saveNotes();
      this.filterNotes();
      if (this.selectedNote?.id === note.id) {
        this.resetForm();
      }
    }
  }

  pinNote(note: Note): void {
    note.isPinned = !note.isPinned;
    this.saveNotes();
    this.filterNotes();
  }

  resetForm(): void {
    this.notesForm.reset({
      title: '',
      content: '',
      category: 'study',
      tags: '',
      color: '#fef3c7'
    });
    this.selectedNote = null;
    this.isEditing = false;
  }

  filterNotes(): void {
    let filtered = [...this.notes];

    // Filter by category
    if (this.selectedCategory !== 'all') {
      filtered = filtered.filter(note => note.category === this.selectedCategory);
    }

    // Filter by search query
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(note =>
        note.title.toLowerCase().includes(query) ||
        note.content.toLowerCase().includes(query) ||
        note.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Sort notes
    filtered.sort((a, b) => {
      // Pinned notes first
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;

      // Then by selected sort criteria
      let aValue = a[this.sortBy as keyof Note];
      let bValue = b[this.sortBy as keyof Note];

      if (aValue instanceof Date && bValue instanceof Date) {
        return this.sortOrder === 'asc' 
          ? aValue.getTime() - bValue.getTime()
          : bValue.getTime() - aValue.getTime();
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return this.sortOrder === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return 0;
    });

    this.filteredNotes = filtered;
  }

  onSearchChange(): void {
    this.filterNotes();
  }

  onCategoryChange(): void {
    this.filterNotes();
  }

  onSortChange(): void {
    this.filterNotes();
  }

  exportNotes(): void {
    const dataStr = JSON.stringify(this.notes, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'smart-notes-export.json';
    link.click();
    URL.revokeObjectURL(url);
  }

  getCategoryIcon(category: string): string {
    const icons: { [key: string]: string } = {
      'study': '📚',
      'lecture': '🎓',
      'assignment': '📝',
      'research': '🔬',
      'personal': '👤',
      'all': '📄'
    };
    return icons[category] || '📄';
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }

  trackByNoteId(index: number, note: Note): number {
    return note.id;
  }
}
