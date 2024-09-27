import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  imports: [CommonModule, RouterModule],
})
export class SidebarComponent {
  sidebarLinks = [
    { label: 'Profile', route: '/account/profile', icon: 'bi-person' },
    { label: 'Secret Key', route: '/account/secret_key', icon: 'bi-key' },
    { label: 'Labor Cost', route: '/account/labor_cost', icon: 'bi-cash' },
    { label: 'Break Down Price', route: '/account/break_down_price', icon: 'bi-bar-chart' },
    { label: 'Transfer Price', route: '/account/transfer_price', icon: 'bi-shuffle' },
    { label: 'Delivery and Set Up Price', route: '/account/delivery_set_up_price', icon: 'bi-truck' },
    { label: 'Plan & Card', route: '/account/plan_card', icon: 'bi-credit-card' },
    { label: 'Settings', route: '/account/settings', icon: 'bi-gear' },
    { label: 'Contracts', route: '/account/manage_items', icon: 'bi-file-text' },
    { label: 'Arrangement Type', route: '/account/arrangement_type', icon: 'bi-file-text' }
  ];
}
