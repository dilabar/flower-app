import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';  // Import FormBuilder and ReactiveFormsModule
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AccountService } from '../../../services/account.service';

@Component({
  selector: 'app-add-contract-modal',
  standalone: true,
  templateUrl: './add-contract-modal.component.html',
  styleUrls: ['./add-contract-modal.component.css'],
  imports: [CommonModule, ReactiveFormsModule],  // Import ReactiveFormsModule
})
export class AddContractModalComponent {
  @Input() contractData: any = {
    name: '',
    non_refundable_retainer: '',
    content: ''
  };

  contractForm: FormGroup;

  constructor(
    public activeModal: NgbActiveModal,
    private accountService: AccountService,
    private fb: FormBuilder  // Inject FormBuilder
  ) {
    // Initialize the form group
    this.contractForm = this.fb.group({
      name: [this.contractData.name || ''],
      non_refundable_retainer: [this.contractData.non_refundable_retainer || ''],
      content: [this.contractData.content || '']
    });
  }

  saveContract(): void {
    if (this.contractForm.valid) {
      const user = JSON.parse(localStorage.getItem('user') || '{}');  // Get the user from localStorage
      const contractData = {
        ...this.contractForm.value,
        user_id: user.id  // Include the user_id in the contract data
      };
      this.accountService.saveContract(contractData).subscribe(
        (response: any) => {
          this.activeModal.close();  // Close the modal on success
        },
        (error: any) => {
          console.error('Error saving contract:', error);  // Log the error
        }
      );
    }
  }
  
}
