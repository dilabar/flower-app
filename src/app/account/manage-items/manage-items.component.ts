import { Component, OnInit, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AccountService } from '../../services/account.service';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AddContractModalComponent } from './add-contract-modal/add-contract-modal.component';

@Component({
  selector: 'app-manage-items',
  standalone: true,
  templateUrl: './manage-items.component.html',
  styleUrls: ['./manage-items.component.css'],
  imports: [CommonModule, RouterModule, SidebarComponent]
})
export class ManageItemsComponent implements OnInit {
  currentView: string = 'contracts';  // Default view
  contracts: any[] = [];
  letters: any[] = [];

  constructor(
    private accountService: AccountService,
    private modalService: NgbModal,
    private renderer: Renderer2  // Renderer for DOM manipulation
  ) {}

  ngOnInit(): void {
    this.loadContracts();  // Load contracts by default
  }

  showContracts(): void {
    this.currentView = 'contracts';
    this.loadContracts();
  }

  showLetters(): void {
    this.currentView = 'letters';
    this.loadLetters();
  }

  loadContracts(): void {
    const userId = this.getUserId();  // Fetch user ID from localStorage
    this.accountService.getContracts(userId).subscribe((data) => {
      this.contracts = data;
    });
  }

  loadLetters(): void {
    const userId = this.getUserId();
    this.accountService.getLetters(userId).subscribe((data) => {
      this.letters = data;
    });
  }

  editContract(contractId: number): void {
    // Logic to edit a contract
  }

  deleteContract(contractId: number): void {
    this.accountService.deleteContract(contractId).subscribe(() => {
      this.loadContracts();
    });
  }

  editLetter(letterId: number): void {
    // Logic to edit a letter
  }

  deleteLetter(letterId: number): void {
    this.accountService.deleteLetter(letterId).subscribe(() => {
      this.loadLetters();
    });
  }

  // Method to get user ID (assuming it's stored in localStorage or in the auth service)
  getUserId(): number {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.id;
  }

  // Open Add Contract Modal
  openAddContractModal(contractData: any = null): void {
    const modalRef: NgbModalRef = this.modalService.open(AddContractModalComponent, { backdrop: 'static' });
    modalRef.componentInstance.contractData = contractData;

    modalRef.result.then((result) => {
      if (result === 'saved') {
        this.loadContracts();  // Reload contracts when the modal is closed
      }
    }).catch((error) => {
      console.log('Modal dismissed:', error);
    });

    // Ensure the modal is rendered before adjusting the z-index
    setTimeout(() => {
      const modalBackdrop = document.querySelector('.modal-backdrop');
      const modalDialog = document.querySelector('.modal-dialog');

      if (modalDialog && modalBackdrop) {
        // Set modal dialog z-index higher than modal backdrop
        this.renderer.setStyle(modalDialog, 'z-index', '1070');
        this.renderer.setStyle(modalBackdrop, 'z-index', '1050');
      }
    }, 0);
  }
}
