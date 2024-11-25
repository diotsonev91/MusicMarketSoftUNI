import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  private files: (File | null)[] = Array(5).fill(null); // Store up to 5 files
  private filePreviews: (string | null)[] = Array(5).fill(null); // Allow null for previews

  /**
   * Adds a file and updates its preview URL.
   */
  addFile(file: File, slotIndex: number): void {
    // Revoke old preview URL if it exists
    if (this.filePreviews[slotIndex]) {
      URL.revokeObjectURL(this.filePreviews[slotIndex]!);
    }

    this.files[slotIndex] = file; // Update the file
    this.filePreviews[slotIndex] = URL.createObjectURL(file); // Create a new preview URL
  }

  /**
   * Gets the preview URL for a specific slot.
   */
  getFilePreview(slotIndex: number): string | null {
    return this.filePreviews[slotIndex];
  }

  /**
   * Clears the file and its preview for a specific slot.
   */
  removeFile(slotIndex: number): void {
    if (this.filePreviews[slotIndex]) {
      URL.revokeObjectURL(this.filePreviews[slotIndex]!); // Revoke the preview URL
      this.filePreviews[slotIndex] = null;
    }

    this.files[slotIndex] = null; // Clear the file
  }

  /**
   * Swaps files and previews between two slots.
   */
  swapFiles(index1: number, index2: number): void {
    [this.files[index1], this.files[index2]] = [
      this.files[index2],
      this.files[index1],
    ];
    [this.filePreviews[index1], this.filePreviews[index2]] = [
      this.filePreviews[index2],
      this.filePreviews[index1],
    ];
  }

  /**
   * Clears all files and previews.
   */
  clearFiles(): void {
    for (let i = 0; i < this.files.length; i++) {
      if (this.filePreviews[i]) {
        URL.revokeObjectURL(this.filePreviews[i]!);
        this.filePreviews[i] = null;
      }
      this.files[i] = null;
    }
  }

  /**
   * Gets all valid files.
   */
  public getFiles(): File[] {
    return this.files.filter((file) => file !== null) as File[];
  }
}
