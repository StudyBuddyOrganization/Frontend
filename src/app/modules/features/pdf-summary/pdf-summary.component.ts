import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-pdf-summary',
  templateUrl: './pdf-summary.component.html',
  styleUrls: ['./pdf-summary.component.scss']
})
export class PdfSummaryComponent implements OnInit {
  summaryForm: FormGroup;
  selectedFile: File | null = null;
  isProcessing = false;
  summaryText = '';
  extractedText = '';
  fileName = '';

  constructor(private fb: FormBuilder) {
    this.summaryForm = this.fb.group({
      summaryLength: [500, [Validators.min(100), Validators.max(2000)]],
      file: [null, Validators.required]
    });
  }

  ngOnInit(): void {}

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      this.selectedFile = file;
      this.fileName = file.name;
      this.summaryForm.patchValue({ file: file });
      this.extractTextFromPDF(file);
    } else {
      alert('Please select a valid PDF file');
    }
  }

  extractTextFromPDF(file: File): void {
    // Simulate PDF text extraction
    // In a real application, you would use pdf.js or call an API
    this.extractedText = `This is simulated extracted text from ${file.name}. 
    In a real implementation, this would contain the actual text content from the PDF file. 
    The text extraction would be handled by a PDF parsing library or service.`;
  }

  onSubmit(): void {
    if (this.summaryForm.valid && this.selectedFile) {
      this.isProcessing = true;
      this.summaryText = '';

      // Simulate API call delay
      setTimeout(() => {
        this.generateSummary();
        this.isProcessing = false;
      }, 2000);
    }
  }

  generateSummary(): void {
    const length = this.summaryForm.get('summaryLength')?.value;
    
    // Simulate AI summarization based on length
    const baseText = this.extractedText;
    const words = baseText.split(' ');
    const targetWords = Math.floor(length / 6); // Approximate words per character
    const selectedWords = words.slice(0, targetWords);
    
    this.summaryText = selectedWords.join(' ') + 
      (selectedWords.length < words.length ? '...' : '');
  }

  downloadSummary(): void {
    if (this.summaryText) {
      const blob = new Blob([this.summaryText], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${this.fileName.replace('.pdf', '')}_summary.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }
  }

  resetForm(): void {
    this.summaryForm.reset({ summaryLength: 500 });
    this.selectedFile = null;
    this.summaryText = '';
    this.extractedText = '';
    this.fileName = '';
  }
}
