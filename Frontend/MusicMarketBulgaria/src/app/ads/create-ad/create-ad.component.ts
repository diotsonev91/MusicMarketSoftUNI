import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Categories } from '../ad_enums/categories.enum';
import { SubCategories } from '../ad_enums/subCategories.enum';
import { DeliveryType } from '../ad_enums/delivery-type.enum';
import { Condition } from '../ad_enums/condition.enum';
import { AdService } from '../ad.service';

@Component({
  selector: 'app-create-ad',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './create-ad.component.html',
  styleUrls: ['./create-ad.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateAdComponent {
  adForm: FormGroup;

  categories = Object.values(Categories);
  subCategories = Object.values(SubCategories);
  deliveryTypes = Object.values(DeliveryType);
  conditions = Object.values(Condition);

  files: (File | null)[] = Array(5).fill(null); // Array to store up to 5 files
  private filePreviews: Map<number, string> = new Map(); // Cache for file previews

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
    private adService: AdService,
    private cdr: ChangeDetectorRef // Manual change detection
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
  }

  /**
   * Handles form submission
   */
  onSubmit(): void {
    if (this.adForm.valid) {
      const formData = this.adForm.value;

      // Pass the form data and selected files to the service
      this.adService.createAd(formData, this.files.filter((file) => file !== null) as File[]).subscribe({
        next: (response) => {
          console.log('Ad created successfully:', response);
          this.resetForm();
        },
        error: (err) => console.error('Failed to create ad:', err),
      });
    } else {
      console.error('Form is invalid');
    }
  }

  /**
   * Resets the form and file slots
   */
  private resetForm(): void {
    // Clear form and file cache
    this.files.forEach((_file, index) => {
      if (this.filePreviews.has(index)) {
        URL.revokeObjectURL(this.filePreviews.get(index)!);
      }
    });

    this.filePreviews.clear();
    this.files = Array(5).fill(null); // Reset files
    this.adForm.reset();
    this.cdr.markForCheck();
  }

  /**
   * Handles file selection for a specific slot
   */
  onFileChange(event: Event, slotIndex: number): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      // Revoke old URL and store new file
      if (this.filePreviews.has(slotIndex)) {
        URL.revokeObjectURL(this.filePreviews.get(slotIndex)!);
        this.filePreviews.delete(slotIndex);
      }

      this.files[slotIndex] = input.files[0]; // Store the selected file
      this.cdr.markForCheck(); // Update UI
    }
  }

  /**
   * Returns a local object URL for file preview
   */
  getFileUrl(slotIndex: number): string | null {
    const file = this.files[slotIndex];
    if (!file) return null;

    if (!this.filePreviews.has(slotIndex)) {
      const url = URL.createObjectURL(file);
      this.filePreviews.set(slotIndex, url); // Cache the preview
    }

    return this.filePreviews.get(slotIndex) || null;
  }

  /**
   * Handles drag start
   */
  onDragStart(event: DragEvent, slotIndex: number): void {
    if (event?.dataTransfer) {
      event.dataTransfer.setData('text/plain', slotIndex.toString());
    }
  }

  /**
   * Handles drag over
   */
  onDragOver(event: DragEvent): void {
    event.preventDefault(); // Allow drop
  }

  /**
   * Handles drop
   */
  onDrop(event: DragEvent, targetIndex: number): void {
    event.preventDefault();

    const draggedIndex = Number(event.dataTransfer?.getData('text/plain'));
    if (draggedIndex !== targetIndex) {
      // Swap files between slots
      [this.files[targetIndex], this.files[draggedIndex]] = [this.files[draggedIndex], this.files[targetIndex]];
      this.cdr.markForCheck(); // Update UI
    }
  }
}
