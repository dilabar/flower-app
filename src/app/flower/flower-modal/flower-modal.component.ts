import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { ColorsService } from '../../services/colors.service';
import { FlowerService } from '../../services/flower.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-flower-modal',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './flower-modal.component.html',
  styleUrl: './flower-modal.component.css'
})
export class FlowerModalComponent implements OnInit, AfterViewInit {
  @Input() flower: any;
  @Input() mtype: any;
  addFlowerForm!: FormGroup; 
  imageUrl: string | ArrayBuffer | null | undefined;
  availableColors: any;
  userColors: any;
  userId: any;
  currentFlowerId: any
  constructor(private fb: FormBuilder,private auth:AuthService,
    private flowerService: FlowerService,
    public activeModal: NgbActiveModal,
    private colorsService:ColorsService){

  }
  ngOnInit(): void {
    this.userId=this.auth.getUserInfo().id;
      // Initialize the add flower form
      this.addFlowerForm = this.fb.group({
        name: ['', Validators.required],
        color_id: ['', Validators.required],
        stems_per_bunch: ['', Validators.required],
        cost_per_stem: ['', Validators.required],
        cost_per_bunch: ['', Validators.required],
        supplier: [''],
        image: [''],
        user_id:this.auth.getUserInfo().id
      });
      //load color
      console.log(this.flower);
      console.log(this.mtype);
      
      this.loadUserColors()
      if(this.mtype=='edit'){
        this.imageUrl = this.flower.imageUrl;
        this.addFlowerForm.patchValue({
          name: this.flower.name,
          color_id: this.flower.color_id,
          stems_per_bunch: this.flower.stems_per_bunch,
          cost_per_stem: this.flower.cost_per_stem,
          cost_per_bunch: this.flower.cost_per_bunch,
          supplier: this.flower.supplier || '',
          user_id: this.auth.getUserInfo().id
        });
      }
  }
  ngAfterViewInit(): void {
    const modalBackdrop = document.querySelector('.modal-backdrop');
    if (modalBackdrop) {
      modalBackdrop.setAttribute('style', 'z-index: 1045;');
    }
    const modal = document.querySelector('.modal');
    if (modal) {
      modal.setAttribute('style', 'z-index: 1055;');
    }
  }
  loadUserColors(): void {
    this.colorsService.getUserColors(this.userId).subscribe(
      (response) => {
        console.log(response);
        
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

  submitFlower(): void {
    if (this.addFlowerForm.valid) {
      const formData = new FormData();
      const formValues = this.addFlowerForm.value;

      Object.keys(formValues).forEach((key) => {
        formData.append(key, formValues[key]);
      });

      const imageFile = this.addFlowerForm.get('image')?.value;
      if (imageFile) {
        formData.append('image', imageFile);
      }

      if (this.mtype =='edit') {
        this.flowerService.updateFlower(this.currentFlowerId, formData).subscribe(
          (res) => {
            this.close();
          },
          (error) => {
            console.error('Error updating flower:', error);
          }
        );
      } else {
        this.flowerService.addFlower(formData).subscribe(
          (res) => {
            // this.flowers.push(res.flower);

            this.close("1");
          },
          (error) => {
            console.error('Error adding flower:', error);
          }
        );
      }
    }
  }

  onCostperstem(event:any){
    const cost_per_bunch = Number(event.target.value); // Get the selected color ID from the dropdown
    const stems_per_bunch = Number(this.addFlowerForm.get("stems_per_bunch")?.value); // Get the selected color ID from the dropdown
    this.addFlowerForm.patchValue({
  
      cost_per_stem: (cost_per_bunch/stems_per_bunch).toFixed(2)
   
    });
  
  }
  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imageUrl = e.target?.result;  // Update the image preview with the new file
      };
      reader.readAsDataURL(file);

      this.addFlowerForm.patchValue({
        image: file  // Update the form with the selected file
      });
    }
  }

  deleteFlower(flower_id:any){
    const user_id=this.auth.getUserInfo().id;
    
    this.flowerService.deleteFlower(flower_id,user_id).subscribe(res=>{
    // this.loadflower();
    this.close();

  },
    (error) => {
      console.error('Error Deleting flower:', error);
    })
  }
  close(st="0"): void {
    this.activeModal.dismiss(st);
  }
}
