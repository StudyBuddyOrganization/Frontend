import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  @Input() isCollapsed = false;
  
  menuItems = [
    {
      title: 'Dashboard',
      icon: '🏠',
      route: '/dashboard',
      active: false
    },
    {
      title: 'My Courses',
      icon: '📚',
      route: '/courses',
      active: false,
      badge: '3'
    },
    {
      title: 'Study Plans',
      icon: '📋',
      route: '/study-plans',
      active: false
    },
    {
      title: 'Progress',
      icon: '📊',
      route: '/progress',
      active: false
    },
    {
      title: 'AI Tutor',
      icon: '🤖',
      route: '/ai-tutor',
      active: false,
      badge: 'New'
    },
    {
      title: 'Notes',
      icon: '📝',
      route: '/notes',
      active: false
    },
    {
      title: 'Flashcards',
      icon: '🃏',
      route: '/flashcards',
      active: false
    },
    {
      title: 'Quiz',
      icon: '❓',
      route: '/quiz',
      active: false
    }
  ];

  bottomMenuItems = [
    {
      title: 'Settings',
      icon: '⚙️',
      route: '/settings',
      active: false
    },
    {
      title: 'Help',
      icon: '❓',
      route: '/help',
      active: false
    }
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.updateActiveItems();
  }

  updateActiveItems(): void {
    const currentRoute = this.router.url;
    this.menuItems.forEach(item => {
      item.active = currentRoute === item.route || currentRoute.startsWith(item.route + '/');
    });
    this.bottomMenuItems.forEach(item => {
      item.active = currentRoute === item.route || currentRoute.startsWith(item.route + '/');
    });
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
    this.updateActiveItems();
  }

  toggleCollapse(): void {
    this.isCollapsed = !this.isCollapsed;
  }
}
