import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatBadgeModule } from '@angular/material/badge';
import { AuthService } from '../core/services/auth.service';

interface MenuItem {
  label: string;
  icon: string;
  route: string;
  roles?: string[];
}

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatBadgeModule
  ],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss'
})
export class MainLayoutComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  sidenavOpened = true;
  currentUser = this.authService.getUser();

  menuItems: MenuItem[] = [
    {
      label: 'Dashboard',
      icon: 'dashboard',
      route: '/home'
    },
    {
      label: 'Account Management',
      icon: 'account_circle',
      route: '/accounts',
      roles: ['super_admin', 'admin']
    },
    {
      label: 'Users',
      icon: 'people',
      route: '/users',
      roles: ['super_admin', 'admin']
    }
  ];

  isSuperAdmin(): boolean {
    return this.currentUser?.role === 'super_admin';
  }

  isAdmin(): boolean {
    return this.currentUser?.role === 'admin';
  }

  get visibleMenuItems(): MenuItem[] {
    if (!this.currentUser) return [];
    
    return this.menuItems.filter(item => {
      if (!item.roles) return true;
      return item.roles.includes(this.currentUser?.role || '');
    });
  }

  toggleSidenav(): void {
    this.sidenavOpened = !this.sidenavOpened;
  }

  logout(): void {
    this.authService.logout();
  }
}
