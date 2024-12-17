import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnDestroy,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Categories } from '../ad_enums/categories.enum';
import { SubCategories } from '../ad_enums/subCategories.enum';
import { DeliveryType } from '../ad_enums/delivery-type.enum';
import { Condition } from '../ad_enums/condition.enum';
import { FileService } from '../file.service';
import { AdData } from '../ad-data.model';

@Component({
  selector: 'app-ad-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './ad-form.component.html',
  styleUrls: ['./ad-form.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdFormComponent implements OnInit {
  @Input() initialData: Partial<AdData> = {}; // Data to pre-fill the form for editing
  @Input() submitButtonText: string = 'Submit'; // Button text, e.g., "Create" or "Update"
  @Output() formSubmit = new EventEmitter<{ adData: Partial<AdData>; images: File[] }>(); // Emits both form data and images
  


  adForm: FormGroup;
  categories = Object.values(Categories);
  subCategories = Object.values(SubCategories);
  deliveryTypes = Object.values(DeliveryType);
  conditions = Object.values(Condition);
  images: File[] = []; // New files to upload
  existingImages: string[] = []; // URLs or paths of existing images

  formConfig = {
    title: {
      label: 'Заглавие',
      placeholder: 'Например: Китара Fender Stratocaster',
      validationMessage: 'Заглавието е задължително и трябва да има поне 5 символа.',
    },
    price: {
      label: 'Цена(в лева)',
      placeholder: 'Въведете цена',
      validationMessage: 'Цената е задължителна и трябва да е положителна.',
    },
    location: {
      label: 'локация на артикула',
      placeholder: 'Въведете локация',
      validationMessage: 'Локацията е задължителна и трябва да има поне 2 символа.',
    },
    category: {
      label: 'Категория',
      placeholder: 'Избери категория',
    },
    subCategory: {
      label: 'Подкатегория',
      placeholder: 'Избери подкатегория',
    },
    description: {
      label: 'Описание',
      placeholder: 'Напиши детайли за обявата',
      validationMessage: 'Описанието е задължително и трябва да има поне 10 символа.',
    },
    deliveryType: {
      label: 'Тип на доставката',
      placeholder: 'Избери начин на доставка',
    },
    condition: {
      label: 'Състояние',
      placeholder: 'Избери състояние',
    },
  };

  constructor(
    private fb: FormBuilder,
    private fileService: FileService,
    private cdr: ChangeDetectorRef
  ) {
    this.adForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      category: ['', Validators.required],
      subCategory: ['', Validators.required],
      deliveryType: ['', Validators.required],
      condition: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(10)]],
      price: [null, [Validators.required, Validators.min(0)]],
      location: ['',[Validators.required, Validators.min(2)]]
    });
    console.log(this.initialData)
  }

  displayImages: (string | null)[] = []; // Unified array for display, combining existingImages and previews

  ngOnInit(): void {
    
    // Clear FileService state to ensure no lingering images
  this.fileService.clearFiles();

  // Reset component state
  this.existingImages = [];
  this.displayImages = [];
    if (this.initialData) {
      this.adForm.patchValue(this.initialData); // Pre-fill form with initial data
      this.existingImages = this.initialData.images || [];
      this.updateDisplayImages();
    }
  }
  
  private updateDisplayImages(): void {
    const newPreviews = this.fileService.getFiles()
      .map((_, index) => this.getFileUrl(index))
      .filter((preview) => preview !== null); // Ensure no null previews
  
    // Merge existing and new images while avoiding duplicates
    this.displayImages = Array.from(new Set([...this.existingImages, ...newPreviews]));
  
    console.log('Updated displayImages:', this.displayImages);
    console.log('Existing images:', this.existingImages);
    console.log('FileService files:', this.fileService.getFiles());
  
    this.cdr.markForCheck(); // Trigger UI update
  }

  onSubmit(): void {
    this.adForm.markAllAsTouched(); 
    if (this.adForm.valid) {
      const adData: Partial<AdData> = this.adForm.value;
      const newImages: File[] = this.fileService.getFiles();
      console.log("AD DATA ON SUBMIT ON AD FORM", this.adForm.value)
      this.formSubmit.emit({
        adData: {
          ...adData,
          remainingImages: this.existingImages, // Send only valid existing images
        },
        images: newImages, // Send newly added images
      });
    } else {
      console.error('Form is invalid');
    }
  }

  onFileChange(event: Event, slotIndex: number): void {
    event.preventDefault(); //
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.fileService.addFile(input.files[0], slotIndex - this.existingImages.length);
      this.updateDisplayImages(); // Refresh displayImages

      input.value = ''; // Reset file input to allow the same file to be re-added
      this.cdr.markForCheck();
    }
  }
  
  removeImage(index: number,  event: MouseEvent): void {
    console.log('removeImage triggered by:', event.target);
    console.log('removeImage event classList:', (event.target as HTMLElement).classList);
    event.stopPropagation(); 

    // Ensure the click is only from the button
  if (!(event.target as HTMLElement).classList.contains('remove-image-btn')) {
    console.log("Click ignored as it wasn't on the remove button");
    return;
  }

    console.log("remove image triggered!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
    const isExistingImage = index < this.existingImages.length;
    if (isExistingImage) {
      this.removeExistingImage(index);
    } else {
      const newIndex = index - this.existingImages.length;
      this.fileService.removeFile(newIndex);
      this.updateDisplayImages(); // Refresh displayImages
      this.cdr.markForCheck();
    }
  }
  
  getFileUrl(slotIndex: number): string | null {
    return this.fileService.getFilePreview(slotIndex);
  }

  

  removeExistingImage(index: number): void {
    const removedImage = this.existingImages.splice(index, 1)[0]; // Remove the image
    console.log(`Removed image: ${removedImage}`);
    this.cdr.markForCheck(); // Trigger change detection to update the UI
  }
  
}
