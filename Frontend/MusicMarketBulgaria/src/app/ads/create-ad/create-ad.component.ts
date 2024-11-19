import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
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

  files: (File | null)[] = Array(5).fill(null); // Initialize with 5 empty slots

  constructor(
    private fb: FormBuilder,
    private adService: AdService,
    private cdr: ChangeDetectorRef // For manual change detection
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
    this.adForm.reset();
    this.files = Array(5).fill(null); // Clear file slots
    this.cdr.markForCheck(); // Ensure UI updates
  }

  /**
   * Handles file selection for a specific slot
   */
  onFileChange(event: Event, slotIndex: number): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.files[slotIndex] = input.files[0]; // Store the selected file
      this.cdr.markForCheck();
    }
  }

  /**
   * Returns a local object URL for file preview
   */
  getFileUrl(slotIndex: number): string | null {
    const file = this.files[slotIndex];
    return file ? URL.createObjectURL(file) : null;
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
    event.preventDefault();
  }

  /**
   * Handles drop
   */
  onDrop(event: DragEvent, targetIndex: number): void {
    event.preventDefault();

    const draggedIndex = Number(event.dataTransfer?.getData('text/plain'));

    if (draggedIndex !== targetIndex) {
      // Swap the files between slots
      [this.files[targetIndex], this.files[draggedIndex]] = [this.files[draggedIndex], this.files[targetIndex]];
      this.cdr.markForCheck();
    }
  }
}
