import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-secret-key',
  standalone: true,
  templateUrl: './secret-key.component.html',
  styleUrls: ['./secret-key.component.css'],
  imports: [CommonModule, RouterModule, SidebarComponent]  // Import necessary modules and the sidebar component
})
export class SecretKeyComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    // Initialization logic will go here in the future
  }
}
