import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService, User } from '../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, AfterViewInit {
  user: User | null = null;
  profileForm: FormGroup;
  isEditing = false;
  isLoading = false;
  showSuccessMessage = false;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.profileForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.user = user;
      if (user) {
        this.profileForm.patchValue({
          name: user.name,
          email: user.email
        });
      }
    });
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (!this.isEditing) {
      // Reset form to original values when canceling edit
      this.profileForm.patchValue({
        name: this.user?.name,
        email: this.user?.email
      });
    }
  }

  updateProfile(): void {
    if (this.profileForm.valid && this.user) {
      this.isLoading = true;
      
      // Simulate API call
      setTimeout(() => {
        const updatedUser: User = {
          ...this.user!,
          name: this.profileForm.value.name,
          email: this.profileForm.value.email
        };
        
        // Update user using auth service
        this.authService.updateProfile(updatedUser);
        
        this.user = updatedUser;
        this.isEditing = false;
        this.isLoading = false;
        this.showSuccessMessage = true;
        
        // Hide success message after 3 seconds
        setTimeout(() => {
          this.showSuccessMessage = false;
        }, 3000);
      }, 1000);
    }
  }

  logout(): void {
    this.authService.logout();
  }

  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  changeAvatar(): void {
    // Placeholder for avatar change functionality
    // In a real app, this would open a file picker or camera
    console.log('Change avatar clicked');
    // You could implement file upload logic here
  }

  ngAfterViewInit(): void {
    // Animate counters when component is loaded
    this.animateCounters();
  }

  private animateCounters(): void {
    const statCards = document.querySelectorAll('.stat-card');
    
    statCards.forEach((card, index) => {
      const counter = card.querySelector('.counter') as HTMLElement;
      const target = parseInt(card.getAttribute('data-count') || '0');
      const duration = 2000; // 2 seconds
      const increment = target / (duration / 16); // 60fps
      let current = 0;
      
      // Add delay for staggered animation
      setTimeout(() => {
        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          if (counter) {
            counter.textContent = Math.floor(current).toString();
          }
        }, 16);
      }, index * 200); // 200ms delay between each card
    });
  }
}
