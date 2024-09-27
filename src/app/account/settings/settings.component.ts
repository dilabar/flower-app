import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
  imports: [CommonModule, RouterModule, SidebarComponent]  // Import necessary modules and sidebar component
})
export class SettingsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    // Future initialization logic goes here
  }
}
