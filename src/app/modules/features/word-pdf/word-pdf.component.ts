import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-word-pdf',
  templateUrl: './word-pdf.component.html',
  styleUrls: ['./word-pdf.component.scss']
})
export class WordPdfComponent implements OnInit {
  selectedFile: File | null = null;
  isDragOver = false;
  isConverting = false;
  conversionProgress = 0;
  convertedFile: string | null = null;

  constructor() {}

  ngOnInit(): void {}

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFile(files[0]);
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.handleFile(input.files[0]);
    }
  }

  private handleFile(file: File): void {
    // Check if file is a Word document
    const allowedTypes = [
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      alert('Please select a valid Word document (.doc or .docx)');
      return;
    }

    // Check file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      alert('File size must be less than 10MB');
      return;
    }

    this.selectedFile = file;
    this.convertedFile = null;
  }

  convertToPdf(): void {
    if (!this.selectedFile) return;

    this.isConverting = true;
    this.conversionProgress = 0;

    // Simulate conversion process
    const interval = setInterval(() => {
      this.conversionProgress += Math.random() * 15;
      if (this.conversionProgress >= 100) {
        this.conversionProgress = 100;
        clearInterval(interval);
        this.completeConversion();
      }
    }, 200);
  }

  private completeConversion(): void {
    // Simulate PDF generation
    setTimeout(() => {
      this.isConverting = false;
      this.convertedFile = this.generateMockPdf();
    }, 500);
  }

  private generateMockPdf(): string {
    // In a real application, this would generate an actual PDF
    // For demo purposes, we'll create a mock PDF blob
    const mockPdfContent = `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
>>
endobj

4 0 obj
<<
/Length 44
>>
stream
BT
/F1 12 Tf
72 720 Td
(Converted from Word document) Tj
ET
endstream
endobj

xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000204 00000 n 
trailer
<<
/Size 5
/Root 1 0 R
>>
startxref
297
%%EOF`;

    const blob = new Blob([mockPdfContent], { type: 'application/pdf' });
    return URL.createObjectURL(blob);
  }

  getPdfFileName(): string {
    if (!this.selectedFile) return 'converted.pdf';
    const baseName = this.selectedFile.name.replace(/\.[^/.]+$/, '');
    return `${baseName}.pdf`;
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  clearFile(): void {
    this.selectedFile = null;
    this.convertedFile = null;
    this.isConverting = false;
    this.conversionProgress = 0;
  }

  ngOnDestroy(): void {
    // Clean up object URLs to prevent memory leaks
    if (this.convertedFile) {
      URL.revokeObjectURL(this.convertedFile);
    }
  }
}