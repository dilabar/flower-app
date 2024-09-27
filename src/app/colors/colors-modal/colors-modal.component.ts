import { Component, Input, AfterViewInit, Renderer2 } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-colors-modal',
  standalone: true,
  templateUrl: './colors-modal.component.html',
  styleUrls: ['./colors-modal.component.css'],
  imports: [CommonModule, FormsModule]
})
export class ColorsModalComponent implements AfterViewInit {
  @Input() color: any = { color_name: '', color_hex: '#FFFFFF' };
  @Input() isEdit = false;

  constructor(public activeModal: NgbActiveModal, private renderer: Renderer2) {}

  ngAfterViewInit(): void {
    this.updateModalBackdropZIndex();
  }

  updateModalBackdropZIndex(): void {
    const modalBackdrop = document.querySelector('.modal-backdrop');
    if (modalBackdrop) {
      this.renderer.setStyle(modalBackdrop, 'z-index', '1050');
    }
  }

  save(): void {
    if (this.color.color_name && this.color.color_hex) {
      this.activeModal.close(this.color);
    }
  }

  close(): void {
    this.activeModal.dismiss();
  }
}
