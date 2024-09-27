import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ProfileService } from '../../services/profile.service';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../sidebar/sidebar.component';  // Adjust the import path if needed

@Component({
  selector: 'app-profile',
  standalone: true,
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  imports: [ReactiveFormsModule, CommonModule, SidebarComponent]  // Import necessary modules including SidebarComponent
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  userId: number = 1;  // Replace with the actual user ID from your auth service
  profilePicture: string = 'https://chasin619.pythonanywhere.com/uploads/default-profile.jpg';  // Default URL

  constructor(private fb: FormBuilder, private profileService: ProfileService) {
    this.profileForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone_number: ['', Validators.required],
      address: ['', Validators.required],
      website: ['']
    });
  }

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.profileService.getProfile(this.userId).subscribe((data) => {
      this.profileForm.patchValue(data);
      // Update the profile picture URL to point to the correct Flask URL
      this.profilePicture = data.profile_picture ? `https://chasin619.pythonanywhere.com/uploads/${data.profile_picture}` : this.profilePicture;
    });
  }

  updateProfile(): void {
    if (this.profileForm.valid) {
      const updatedData = { ...this.profileForm.value, user_id: this.userId };
      this.profileService.updateProfile(updatedData).subscribe((response) => {
        console.log('Profile updated successfully');
      });
    }
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('profile_picture', file);
      formData.append('user_id', this.userId.toString());  // Send the user ID with the form data
      this.profileService.uploadProfilePicture(formData).subscribe((response) => {
        this.profilePicture = `https://chasin619.pythonanywhere.com/uploads/${response.filepath}`;
        console.log('Profile picture uploaded successfully');
      });
    }
  }

}
