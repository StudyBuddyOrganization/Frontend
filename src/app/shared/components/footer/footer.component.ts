import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  currentYear = new Date().getFullYear();
  
  quickLinks = [
    { title: 'About Us', route: '/about' },
    { title: 'Courses', route: '/courses' },
    { title: 'Study Plans', route: '/study-plans' },
    { title: 'AI Tutor', route: '/ai-tutor' },
    { title: 'Progress', route: '/progress' }
  ];

  supportLinks = [
    { title: 'Help Center', route: '/help' },
    { title: 'Contact Us', route: '/contact' },
    { title: 'Privacy Policy', route: '/privacy' },
    { title: 'Terms of Service', route: '/terms' },
    { title: 'FAQ', route: '/faq' }
  ];

  socialLinks = [
    { name: 'Facebook', icon: '📘', url: '#' },
    { name: 'Twitter', icon: '🐦', url: '#' },
    { name: 'Instagram', icon: '📷', url: '#' },
    { name: 'LinkedIn', icon: '💼', url: '#' },
    { name: 'YouTube', icon: '📺', url: '#' }
  ];

  constructor() {}

  ngOnInit(): void {}
}
