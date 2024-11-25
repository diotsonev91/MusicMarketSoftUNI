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
    });
    console.log(this.initialData)
  }

  displayImages: (string | null)[] = []; // Unified array for display, combining existingImages and previews

  ngOnInit(): void {
    if (this.initialData) {
      this.adForm.patchValue(this.initialData); // Pre-fill form with initial data
      this.existingImages = this.initialData.images || [];
      this.updateDisplayImages();
    }
  }
  
  private updateDisplayImages(): void {
    // Merge existingImages and previews for display purposes
    this.displayImages = [...this.existingImages, ...this.fileService.getFiles().map((_, index) => this.getFileUrl(index))];
  }

  onSubmit(): void {
    if (this.adForm.valid) {
      const adData: Partial<AdData> = this.adForm.value;
      const newImages: File[] = this.fileService.getFiles();
  
      console.log('Submitting data:', {
        adData,
        newImages,
        remainingImages: this.existingImages,
      });
  
      // Emit adData, existing images, and new images
      this.formSubmit.emit({
        adData: {
          ...adData,
          remainingImages: this.existingImages, // Send remaining existing images
        },
        images: newImages, // Send newly added images
      });
    } else {
      console.error('Form is invalid');
    }
  }

  onFileChange(event: Event, slotIndex: number): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.fileService.addFile(input.files[0], slotIndex - this.existingImages.length);
      this.updateDisplayImages(); // Refresh displayImages
      this.cdr.markForCheck();
    }
  }
  
  removeImage(index: number): void {
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

  onDragStart(event: DragEvent, slotIndex: number): void {
    if (event?.dataTransfer) {
      event.dataTransfer.setData('text/plain', slotIndex.toString());
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onDrop(event: DragEvent, targetIndex: number): void {
    event.preventDefault();
    const draggedIndex = Number(event.dataTransfer?.getData('text/plain'));
  
    if (draggedIndex !== targetIndex) {
      // Swap logic for unified array
      [this.displayImages[draggedIndex], this.displayImages[targetIndex]] = [
        this.displayImages[targetIndex],
        this.displayImages[draggedIndex],
      ];
  
      // Sync back to `existingImages` and `fileService`
      this.syncImagesWithDisplay();
      this.cdr.markForCheck();
    }
  }

  private syncImagesWithDisplay(): void {
    const numExisting = this.existingImages.length;
    this.existingImages = this.displayImages.slice(0, numExisting).filter(Boolean) as string[]; // Update existingImages
    this.fileService.clearFiles();
    this.displayImages.slice(numExisting).forEach((preview, index) => {
      if (preview) {
        this.fileService.addFile(new File([], preview), index);
      }
    });
  }

  removeExistingImage(index: number): void {
    const removedImage = this.existingImages.splice(index, 1)[0]; // Remove the image
    console.log(`Removed image: ${removedImage}`);
    this.cdr.markForCheck(); // Trigger change detection to update the UI
  }
  
}
