import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Categories } from '../ad_enums/categories.enum';
import { SubCategories } from '../ad_enums/subCategories.enum';
import { DeliveryType } from '../ad_enums/delivery-type.enum';
import { Condition } from '../ad_enums/condition.enum';
import { AdService } from '../ad.service';
import { SharedUtilService } from '../../shared/util/shared-util.service';

@Component({
  selector: 'app-create-ad',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './create-ad.component.html',
  styleUrls: ['./create-ad.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush, // Optimize rendering
})
export class CreateAdComponent {
  adForm: FormGroup;

  categories = Object.values(Categories);
  subCategories = Object.values(SubCategories);
  deliveryTypes = Object.values(DeliveryType);
  conditions = Object.values(Condition);

  files: (File | null)[] = Array(5).fill(null); // Initialize with 5 empty slots
  compressedImages: string[] = Array(5).fill(''); // Store compressed Base64 images

  constructor(
    private fb: FormBuilder,
    private adService: AdService,
    private sharedUtilService: SharedUtilService, // For handling compression
    private cdr: ChangeDetectorRef // Needed for manual change detection with OnPush
  ) {
    this.adForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      category: ['', Validators.required],
      subCategory: ['', Validators.required],
      deliveryType: ['', Validators.required],
      condition: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  /**
   * Handles form submission
   */
  onSubmit(): void {
    if (this.adForm.valid) {
      const formData = this.adForm.value;

      // Pass the form data and compressed images to the service
      this.adService.createAd(formData, this.compressedImages.filter((img) => img)).subscribe({
        next: (response) => {
          console.log('Ad created successfully:', response);
          this.resetForm(); // Clear form and images after successful submission
        },
        error: (err) => console.error('Failed to create ad:', err),
      });
    } else {
      console.error('Form is invalid');
    }
  }

  /**
   * Resets the form and image slots
   */
  private resetForm(): void {
    this.adForm.reset();
    this.files = Array(5).fill(null);
    this.compressedImages = Array(5).fill('');
    this.cdr.markForCheck(); // Ensure UI updates
  }

  /**
   * Handles file selection for a specific slot
   */
  async onFileChange(event: Event, slotIndex: number): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.files[slotIndex] = file;

      try {
        // Compress and store the image
        const compressedBase64 = await this.sharedUtilService.compressImage(file, 50, 300);
        this.compressedImages[slotIndex] = compressedBase64;
      } catch (error) {
        console.error('Error compressing image:', error);
      }

      this.cdr.markForCheck(); // Update view manually
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
    event.preventDefault(); // Prevent default to allow drop
  }

  /**
   * Handles drop
   */
  onDrop(event: DragEvent, targetIndex: number): void {
    event.preventDefault();

    // Get the index of the dragged slot
    const draggedIndex = Number(event.dataTransfer?.getData('text/plain'));

    if (draggedIndex !== targetIndex) {
      // Swap the files and compressed images between slots
      [this.files[targetIndex], this.files[draggedIndex]] = [
        this.files[draggedIndex],
        this.files[targetIndex],
      ];
      [this.compressedImages[targetIndex], this.compressedImages[draggedIndex]] = [
        this.compressedImages[draggedIndex],
        this.compressedImages[targetIndex],
      ];

      this.cdr.markForCheck(); // Trigger UI update manually
    }
  }
}
