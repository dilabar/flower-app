import { Component, Input, Output, EventEmitter, OnInit, AfterViewInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ArrangementsService } from '../../services/arrangements.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AccountService } from '../../services/account.service';
import { AuthService } from '../../services/auth.service';
interface Ingredient {
  id: number;
  name: string;
  color: string;
  image: string;
}
@Component({
  selector: 'app-arrangement-modal',
  standalone: true,
  templateUrl: './arrangement-modal.component.html',
  styleUrls: ['./arrangement-modal.component.css'],
  imports: [FormsModule, CommonModule],
})
export class ArrangementModalComponent implements OnInit, AfterViewInit {
  @Input() arrangementobj: any;
  @Input() mtype: any;
  @Input() ingredients: any[] = [];
  @Input() colors: any[] = [];
  @Input() wedding_styles: any[] = [];
  @Output() onSave = new EventEmitter<any>();
  isEditMode: boolean = false
  newIngredients: any[] = [];
  ingredientChoices: any[] = [];

  selectedIngredient: any = {};
  selectedQuantity: number = 1;
  selectedStyle: string = '';
  typeChoices: any[] = [];
  colorChoices: any[] = [];
  weddingStyleChoices: any[] = [];
  selectedType: number | null = null;
  selectedColor: number | null = null;
  selectedWeddingStyle: number | null = null;

  isShareable: boolean = false;
  imagePreview: string | ArrayBuffer | null | undefined;;
  user_id: any;
  arrangement: any = {};
  selectedColors: number[] = []; // Array to hold multiple selected color IDs
  selectedWeddingStyles: number[] = []; // Array to hold multiple selected wedding style IDs
  ingredients1: Ingredient[] = [
    { id: 1, name: 'Yellow Butter Cup Dahlias', color: 'Soft Yellow', image: 'path_to_image1' },
    { id: 2, name: 'White Rose', color: 'White', image: 'path_to_image2' },
    // Add more ingredients as needed
  ];


  constructor(
    public activeModal: NgbActiveModal,
    private arrangementsService: ArrangementsService,
    private accountService: AccountService,
    private auth: AuthService
  ) { 
    
  }

  ngOnInit(): void {
    this.user_id = this.auth.getUserInfo().id;
    console.log(this.arrangement);
    if (this.mtype == 'edit') {

      this.arrangement = this.arrangementobj
      console.log(this.arrangement);
      this.imagePreview = `http://localhost:5000/uploads/${this.arrangement.image_filename}`

      this.newIngredients = Array.isArray(this.ingredients) ? [...this.ingredients] : [];

      this.selectedType = this.arrangement.type_id;
      // this.selectedColor = this.arrangement.color_id;
      // this.selectedWeddingStyle = this.arrangement.wedding_style_id;
      this.selectedColors = Array.isArray(this.colors) ? [...this.colors] : [];
      this.selectedWeddingStyles = Array.isArray(this.wedding_styles) ? [...this.wedding_styles] : [];
      // Check the arrangement object
      this.arrangement.total_cost=(this.arrangement.labour_cost+this.arrangement.item_cost).toFixed(2)
      this.isShareable = !!this.arrangement?.is_shareable; // Converts 1/0 or true/false to boolean

    }
    this.loadLaborCost();






    this.loadTypeChoices();
    this.loadColorChoices();
    this.loadWeddingStyleChoices();

    this.arrangementsService.getIngredientChoices().subscribe((response: any) => {
      this.ingredientChoices = Array.isArray(response.ingredients) ? response.ingredients : [];
      this.setDefaultIngredients();
    });


  }

  loadLaborCost(): void {
    this.accountService.getLaborCost(this.user_id).subscribe((data) => {
      // if(this.arrangement && this.arrangement.cost_per_min){
      this.arrangement.cost_per_min = data.labor_cost_minute

      // }
    });
  }
  loadTypeChoices(): void {
    this.arrangementsService.getTypeChoices().subscribe((response: any) => {
      this.typeChoices = response.types || [];

      if (this.arrangement && this.arrangement.type_id) {
        this.selectedType = this.arrangement.type_id;
      }
    });
  }

  loadColorChoices(): void {
    this.arrangementsService.getColorChoices().subscribe((response: any) => {
      this.colorChoices = response.colors || [];
      // console.log(this.colorChoices);

      // Preselect colors if this is an edit mode and colors are already assigned
      if (this.arrangement && Array.isArray(this.selectedColors)) {
        this.selectedColors = this.selectedColors.map((color: any) => color.id);
      }
    });
  }

  loadWeddingStyleChoices(): void {
    this.arrangementsService.getWeddingStyleChoices().subscribe((response: any) => {
      this.weddingStyleChoices = response.styles || [];
      if (this.arrangement && Array.isArray(this.selectedWeddingStyles)) {
        this.selectedWeddingStyles = this.selectedWeddingStyles.map((weddingStyle: any) => weddingStyle.id);
      }
    });
  }

  setDefaultIngredients(): void {
    if (Array.isArray(this.ingredients) && this.ingredients.length > 0) {
      this.newIngredients = this.ingredients.map((ingredient) => {
        const matchedIngredient = this.ingredientChoices.find(
          (choice) => choice.name === ingredient.name
        );
        return {
          ...ingredient,
          flower_id: matchedIngredient ? matchedIngredient.id : null,
        };
      });
      this.calculateItemCost();
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

  addIngredient(): void {
    if (this.selectedIngredient && this.selectedIngredient.id && this.selectedQuantity > 0) {
      // Check if the flower is already in the newIngredients array
      
      const existingIngredient = this.newIngredients.find(
        (ingredient) => ingredient.flower_id === this.selectedIngredient.id
      );

      if (existingIngredient) {
        // If the flower already exists, update the quantity
        existingIngredient.quantity += this.selectedQuantity;
      } else {
        // Otherwise, add the new ingredient
        this.newIngredients.push({
          flower_id: this.selectedIngredient.id,
          name: this.selectedIngredient.name,
          quantity: this.selectedQuantity,
          cost_per_stem: this.selectedIngredient.cost_per_stem,
        });
      }

      this.calculateItemCost();
      this.selectedIngredient = {};
      this.selectedQuantity = 1;
      this.calculateProfitAndMargin()

    }
  }
  calculateItemCost() {
    const totalCost = this.newIngredients.reduce((accumulator, ingredient) => {
      return accumulator + (ingredient.quantity * ingredient.cost_per_stem);
    }, 0);  // Starting value of the accumulator is 0
  
    // Round off the total cost to 2 decimal places
    this.arrangement.item_cost = parseFloat(totalCost.toFixed(2));  // Starting value of the accumulator is 0

  }
  removeIngredient(index: number): void {
    this.newIngredients.splice(index, 1);
    this.calculateItemCost();

    this.calculateProfitAndMargin();
  }
  calculateItemCostAndProfit(){
    this.calculateItemCost()
    this.calculateProfitAndMargin()
  }
  onImageChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }
  saveArrangement() {
    const formData = new FormData();
    formData.append('name', this.arrangement.name || '');
    formData.append('description', this.arrangement.description || '');
    formData.append('type_id', this.selectedType?.toString() || this.arrangement.type_id);
    // formData.append('color_id', this.selectedColor?.toString() || this.arrangement.color_id);
    // formData.append('wedding_style_id', this.selectedWeddingStyle?.toString() || this.arrangement.wedding_style_id);
    formData.append('cost_per_min', this.arrangement.cost_per_min || 0);
    formData.append('labour_time', this.arrangement.labour_time || 0);
    formData.append('labour_cost', this.arrangement.labour_cost || 0);
    formData.append('item_cost', this.arrangement.item_cost || 0);
    formData.append('profit', this.arrangement.profit || 0);
    formData.append('margin', this.arrangement.margin || 0);
    formData.append('price', this.arrangement.price || 0);
    formData.append('is_shareable', this.isShareable ? 'true' : 'false');
    formData.append('ingredients', JSON.stringify(this.newIngredients));
    formData.append('user_id', this.user_id);
    formData.append('wedding_styles', JSON.stringify(this.selectedWeddingStyles));
    formData.append('colors', JSON.stringify(this.selectedColors));
    const imageInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (imageInput.files && imageInput.files.length > 0) {
      formData.append('image', imageInput.files[0]);
    }
    this.arrangementsService.addArrangement(formData).subscribe(
      (response) => {
        this.onSave.emit(this.arrangement);
        this.activeModal.close();
      },
      (error) => {
        console.error('Error updating arrangement:', error);
      }
    );


  }
  updateArrangement(): void {
    const formData = new FormData();
    formData.append('id', this.arrangement.id);
    formData.append('name', this.arrangement.name || '');
    formData.append('description', this.arrangement.description || '');
    formData.append('type_id', this.selectedType?.toString() || this.arrangement.type_id);
    // formData.append('color_id', this.selectedColor?.toString() || this.arrangement.color_id);
    // formData.append('wedding_style_id', this.selectedWeddingStyle?.toString() || this.arrangement.wedding_style_id);
    formData.append('cost_per_min', this.arrangement.cost_per_min || 0);
    formData.append('labour_time', this.arrangement.labour_time || 0);
    formData.append('labour_cost', this.arrangement.labour_cost || 0);
    formData.append('item_cost', this.arrangement.item_cost || 0);
    formData.append('profit', this.arrangement.profit || 0);
    formData.append('margin', this.arrangement.margin || 0);
    formData.append('price', this.arrangement.price || 0);




    // Log to ensure the value of isShareable
    // console.log('Is Shareable:', this.isShareable);

    // Ensure that true/false is converted to string for FormData
    formData.append('is_shareable', this.isShareable ? 'true' : 'false');

    //console.log('Ingredients sent to the server:', this.newIngredients);
    formData.append('ingredients', JSON.stringify(this.newIngredients));
    formData.append('wedding_styles', JSON.stringify(this.selectedWeddingStyles));
    formData.append('colors', JSON.stringify(this.selectedColors));

    const imageInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (imageInput.files && imageInput.files.length > 0) {
      formData.append('image', imageInput.files[0]);
    }

    this.arrangementsService.updateArrangement(formData).subscribe(
      (response) => {
        this.onSave.emit(this.arrangement);
        this.activeModal.close();
      },
      (error) => {
        console.error('Error updating arrangement:', error);
      }
    );
  }

  calculateLaborCost(): void {
    const costPerMin = this.arrangement.cost_per_min || 0;
    const laborTime = this.arrangement.labour_time || 0;

    // Calculate labor cost
    this.arrangement.labour_cost = costPerMin * laborTime;

    // Recalculate profit and margin
    this.calculateProfitAndMargin();
  }

  calculateProfitAndMargin(): void {
    const yourPrice = this.arrangement.price || 0;
    const itemCost = this.arrangement.item_cost || 0;
    const laborCost = this.arrangement.labour_cost || 0;
    console.log(itemCost,yourPrice,laborCost);
    
    // Calculate profit
    this.arrangement.profit =(yourPrice - (itemCost + laborCost)).toFixed(2);
    this.arrangement.total_cost =(itemCost + laborCost).toFixed(2);

    // Calculate margin
    if (yourPrice > 0) {
      this.arrangement.margin = (this.arrangement.profit / yourPrice * 100).toFixed(2);
    } else {
      this.arrangement.margin = 0;
    }
  }
  deleteArrangement(arrangement_id: any) {
    const user_id = this.auth.getUserInfo().id;

    this.arrangementsService.deleteArrangement(arrangement_id, user_id).subscribe(res => {
      this.close();

    },
      (error) => {
        console.error('Error Deleting flower:', error);
      })
  }
  selectColor(colorId: number): void {
    const index = this.selectedColors.indexOf(colorId);
    if (index === -1) {
      // Add the color if it's not already selected
      this.selectedColors.push(colorId);
    } else {
      // Remove the color if it's already selected
      this.selectedColors.splice(index, 1);
    }
  }
  selectStyle(styleId: number): void {
    const index = this.selectedWeddingStyles.indexOf(styleId);
    if (index === -1) {
      // Add the style if it's not already selected
      this.selectedWeddingStyles.push(styleId);
    } else {
      // Remove the style if it's already selected
      this.selectedWeddingStyles.splice(index, 1);
    }
  }
  toggleColorSelection(colorId: number) {
    const index = this.selectedColors.indexOf(colorId);
    if (index === -1) {
      // If color is not selected, add it
      this.selectedColors.push(colorId);
    } else {
      // If color is already selected, remove it
      this.selectedColors.splice(index, 1);
    }
  }
  toggleStyleSelection(styleId: number) {
    const index = this.selectedWeddingStyles.indexOf(styleId);
    if (index === -1) {
      // If style is not selected, add it
      this.selectedWeddingStyles.push(styleId);
    } else {
      // If style is already selected, remove it
      this.selectedWeddingStyles.splice(index, 1);
    }
  }
  filteredIngredients = [...this.ingredients1]; // Initially display all ingredients
  selectedIngredients: Ingredient[] = [];

  // Filter ingredients as the user types
  filterIngredients(event: Event) {
    const searchTerm = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredIngredients = this.ingredients.filter(ingredient => 
      ingredient.name.toLowerCase().includes(searchTerm)
    );
  }

  // Toggle ingredient selection
  toggleIngredientSelection(ingredient: Ingredient) {
    const index = this.selectedIngredients.indexOf(ingredient);
    if (index === -1) {
      // If ingredient is not selected, add it
      this.selectedIngredients.push(ingredient);
    } else {
      // If ingredient is already selected, remove it
      this.selectedIngredients.splice(index, 1);
    }
  }
  incrementQuantity(ingredient: any) {
    ingredient.quantity++;
    this.calculateItemCost();

    this.calculateProfitAndMargin();
  }
  
  decrementQuantity(ingredient: any) {
    if (ingredient.quantity > 1) {
      ingredient.quantity--;
      this.calculateItemCost();

    this.calculateProfitAndMargin();  
    }
  }
  close(): void {
    this.activeModal.dismiss();
  }
}
