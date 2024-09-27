import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';  // Import CommonModule for ngIf, ngFor, and ngClass
import { FlowerService } from '../services/flower.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ColorsService } from '../services/colors.service';
import { AuthService } from '../services/auth.service';
import { FlowerModalComponent } from './flower-modal/flower-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-flower',
  standalone: true,
  templateUrl: './flower.component.html',
  styleUrls: ['./flower.component.css'],
  imports: [CommonModule, ReactiveFormsModule,FormsModule]  // Ensure CommonModule is imported
})
export class FlowerComponent implements OnInit {
  flowers: any[] = [];
  listView: boolean = false;
  showModal: boolean = false;
  addFlowerForm!: FormGroup;  // Non-null assertion to inform TypeScript that this will be initialized
  userId: number=1;
  availableColors: any;
  userColors: any;
  imageUrl: any;
  isEditMode: boolean | undefined;
  currentFlowerId: any;
  filteredFlowers: any[]=[];

  searchDescription: string = '';
  searchName: string = '';
  searchColor: string = '';
  searchType: string = '';
  isAscending: boolean=false;

  currentPage: number = 1;
  perPage: number = 10; // Number of arrangements per page
  totalFlowers: number = 0;
  totalPages: number = 0;

  constructor(private auth:AuthService, private modalService: NgbModal ,private flowerService: FlowerService,private colorsService: ColorsService, private fb: FormBuilder) { }

  ngOnInit(): void {
console.log(this.auth.getUserInfo().id);

this.loadflower();

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
    this.loadUserColors();
  }
loadflower(){
  this.flowerService.getFlowers(this.userId, this.currentPage, this.perPage).subscribe(
    (response) => {
      console.log(response);
      
      // Update the flower images to point to the Flask server
      this.flowers = response.flowers.map((flower: { image_filename: any; }) => {
        return {
          ...flower,
          imageUrl: `https://chasin619.pythonanywhere.com/uploads/${flower.image_filename}`
        };
      });
      this.totalFlowers = response.total;
      this.totalPages = response.pages;
      this.updateFilteredFlowrs(); // Update displayed arrangements
    },
    (error) => {
      console.error('Error fetching flowers:', error);
    }
  );
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
  switchToListView(): void {
    this.listView = true;
  }

  switchToGalleryView(): void {
    this.listView = false;
  }

  openAddFlowerModal(): void {
    this.isEditMode = false;  
    this.addFlowerForm.reset();  
    this.imageUrl = null;  
    this.showModal = true;
    this.addFlowerForm.patchValue({
      user_id:this.auth.getUserInfo().id
    })
  }

  closeModal(): void {
    this.showModal = false;
  }

  // submitFlower(): void {
  //   if (this.addFlowerForm.valid) {
  //     const formData = new FormData();

  //     // Append form fields to FormData object
  //     formData.append('name', this.addFlowerForm.get('name')?.value);
  //     formData.append('color_id', this.addFlowerForm.get('color')?.value);
  //     formData.append('stems_per_bunch', this.addFlowerForm.get('stems_per_bunch')?.value);
  //     formData.append('cost_per_stem', this.addFlowerForm.get('cost_per_stem')?.value);
  //     formData.append('cost_per_bunch', this.addFlowerForm.get('cost_per_bunch')?.value);
  //     formData.append('supplier', this.addFlowerForm.get('supplier')?.value || '');
  //     formData.append('user_id', this.addFlowerForm.get('user_id')?.value);

  //     // Handle image file if selected
  //     const imageFile = this.addFlowerForm.get('image')?.value;
  //     if (imageFile) {
  //       formData.append('image', imageFile);
  //     }

  //     // Call the flower service to add a new flower (API integration)
  //     this.flowerService.addFlower(formData).subscribe(
  //       (res) => {
  //         console.log('Flower added successfully:', res);
  //         this.flowers.push(res.flower);  // Update flowers array with the new flower
  //       },
  //       (error) => {
  //         console.error('Error adding flower:', error);
  //       }
  //     );

  //     this.closeModal();  // Close the modal after submitting
  //   }
  // }
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

  openEditFlowerModal(flower: any): void {
    console.log(flower);
    
    this.isEditMode = true;  
    this.currentFlowerId = flower.id;  
    this.imageUrl = flower.imageUrl;  // Show the current image in the modal

    // Patch form with flower details
    this.addFlowerForm.patchValue({
      name: flower.name,
      color_id: flower.color_id,
      stems_per_bunch: flower.stems_per_bunch,
      cost_per_stem: flower.cost_per_stem,
      cost_per_bunch: flower.cost_per_bunch,
      supplier: flower.supplier || '',
      user_id: this.auth.getUserInfo().id
    });

    this.showModal = true;
  }
  deleteFlower(flower_id:any){
    const user_id=this.auth.getUserInfo().id;
    
    this.flowerService.deleteFlower(flower_id,user_id).subscribe(res=>{
    this.loadflower();
    this.closeModal();

  },
    (error) => {
      console.error('Error Deleting flower:', error);
    })
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

      if (this.isEditMode) {
        this.flowerService.updateFlower(this.currentFlowerId, formData).subscribe(
          (res) => {
            this.loadflower();
            this.closeModal();
          },
          (error) => {
            console.error('Error updating flower:', error);
          }
        );
      } else {
        this.flowerService.addFlower(formData).subscribe(
          (res) => {
            // this.flowers.push(res.flower);
            this.loadflower();

            this.closeModal();
          },
          (error) => {
            console.error('Error adding flower:', error);
          }
        );
      }
    }
  }
  updateFlowerInArray(updatedFlower: any): void {
    const index = this.flowers.findIndex(flower => flower.id === this.currentFlowerId);
    if (index !== -1) {
      this.flowers[index] = updatedFlower;
    }
  }
  selectedColor: any;  // Holds the selected color value

onColorSelect(event: any) {
  const selectedColorId = event.target.value;
  console.log(selectedColorId)
  
  // Find the selected color from the userColors array
  const selectedColor = this.userColors.find((color:any) =>color.id == selectedColorId);
  console.log(selectedColor);
  
  // Update the selectedColor variable to the actual color code (assuming the object has a color hex or value)
  this.selectedColor = selectedColor ? selectedColor.color_hex : '';
  
}
onCostperstem(event:any){
  const cost_per_bunch = Number(event.target.value); // Get the selected color ID from the dropdown
  const stems_per_bunch = Number(this.addFlowerForm.get("stems_per_bunch")?.value); // Get the selected color ID from the dropdown
  this.addFlowerForm.patchValue({

    cost_per_stem: (cost_per_bunch/stems_per_bunch).toFixed(2)
 
  });

}
selectcolor(event:any){
  const selectedColorId = Number(event.target.value); // Get the selected color ID from the dropdown
  console.log("Selected Color ID:", selectedColorId);

  // Filter the flowers based on the selected color ID (assuming flower.color_id stores the color ID)
  const filteredFlowers = this.flowers.filter(flower => flower.color_id === selectedColorId);

  // Log the filtered flowers to check if the filter is working
  console.log("Filtered Flowers:", filteredFlowers);

  // You can now store or use the filtered flowers as needed in your component
  this.filteredFlowers = filteredFlowers;
  
}
// calculteCostperstem(){
//   const stem_per_bunch =this.addFlowerForm.get('stems_per_bunch')?.value;
//   const cost_per_bunch =this.addFlowerForm.get('tota_cost')?.value;//todo change to cost_per_buncg

//   this.addFlowerForm.patchValue({
//     cost_per_stem:(stem_per_bunch/cost_per_bunch)
//   })


// }
openModal(flower: any,mtype='edit'): void {
  // Fetch the arrangement details by ID to ensure all data is available

      const modalRef = this.modalService.open(FlowerModalComponent,{ windowClass: 'custom-modal', size: 'lg' });
      modalRef.componentInstance.flower = flower; // Use the fetched arrangement data
      modalRef.componentInstance.mtype=mtype;
      modalRef.result.then((updatedFlower) => {
        console.log(updatedFlower);
        
        if (updatedFlower) {
          // this.updateArrangementInList(updatedArrangement);
        }
      }).catch((error) => {
        console.log('Modal closed:', error);
      });
  
}

searchFlowers(): void {
  console.log('Search triggered with the following params:');
  this.filteredFlowers = this.flowers.filter(flower => {


    const matchesName = this.searchName ? 
    flower.name.toLowerCase().includes(this.searchName.toLowerCase()) : true;

    const matchesColor = this.searchColor ? 
    flower.color.includes(this.searchColor) : true;


    return matchesName && matchesColor;
});
    // Reset to the first page whenever a search is performed
    this.currentPage = 1;
    this.totalFlowers = this.filteredFlowers.length;
    this.totalPages = Math.ceil(this.totalFlowers / this.perPage);
}
    // Reset filters and display all arrangements again
    resetFilters(): void {
      this.searchDescription = '';
      this.searchName = '';
      this.searchColor = '';
      this.searchType = '';
      this.filteredFlowers = [...this.flowers]; // Reset to original arrangements
    }
    toggleSort() {
      this.isAscending = !this.isAscending; // Toggle the sort direction
      // this.sortArrangements(); // Call the function to sort the arrangements based on the current direction
  }
  updateFilteredFlowrs(): void {
    const startIndex = (this.currentPage - 1) * this.perPage;
    const endIndex = startIndex + this.perPage;
    console.log(startIndex,endIndex);
    
    this.filteredFlowers = this.flowers
  }
  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page; // Update current page
      this.loadflower(); // Fetch new data for the updated page
    }
  }
}
