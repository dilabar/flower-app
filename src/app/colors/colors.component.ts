import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ColorsService } from '../services/colors.service';
import { ColorsModalComponent } from './colors-modal/colors-modal.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-colors',
  standalone: true,
  templateUrl: './colors.component.html',
  styleUrls: ['./colors.component.css'],
  imports: [CommonModule]
})
export class ColorsComponent implements OnInit {
  availableColors: any[] = [];
  userColors: any[] = [];
  userId = 1;  // Assume we get this from Angular authentication

  constructor(private colorsService: ColorsService, private modalService: NgbModal) {}

  ngOnInit(): void {
    this.loadUserColors();
  }

  loadUserColors(): void {
    this.colorsService.getUserColors(this.userId).subscribe(
      (response) => {
        if (response.success) {
          this.availableColors = response.available_colors;
          this.userColors = response.user_colors;
        }
      },
      (error) => {
        console.error('Error loading colors:', error);
      }
    );
  }

  // Open the modal to add a new color
  openAddColorModal(): void {
    const modalRef = this.modalService.open(ColorsModalComponent);
    modalRef.componentInstance.isEdit = false;

    modalRef.result.then((newColor) => {
      if (newColor) {
        this.colorsService.addColor({ ...newColor, user_id: this.userId }).subscribe(
          (response) => {
            if (response.success) {
              this.userColors.push(newColor);
            } else {
              alert(response.message);
            }
          },
          (error) => {
            console.error('Error adding color:', error);
          }
        );
      }
    }).catch(() => {});
  }

  // Open the modal to edit an existing color
  openEditColorModal(color: any): void {
    const modalRef = this.modalService.open(ColorsModalComponent);
    modalRef.componentInstance.color = { ...color };  // Ensure color object is passed
    modalRef.componentInstance.isEdit = true;

    modalRef.result.then((updatedColor) => {
      if (updatedColor) {
        this.colorsService.updateColor({ ...updatedColor, user_id: this.userId, color_id: color.id }).subscribe(
          (response) => {
            if (response.success) {
              const index = this.userColors.findIndex(c => c.id === updatedColor.id);
              this.userColors[index] = updatedColor;
            } else {
              alert(response.message);
            }
          },
          (error) => {
            console.error('Error updating color:', error);
          }
        );
      }
    }).catch(() => {});
  }
}
