import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-plan-card',
  standalone: true,
  templateUrl: './plan-card.component.html',
  styleUrls: ['./plan-card.component.css'],
  imports: [CommonModule, RouterModule, SidebarComponent]  // Import necessary modules and sidebar component
})
export class PlanCardComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    // Future initialization logic goes here
  }
}
