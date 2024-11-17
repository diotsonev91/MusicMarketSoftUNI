import { Injectable } from '@angular/core';
import { NgxImageCompressService } from 'ngx-image-compress';

@Injectable({
  providedIn: 'root', // Makes it available globally
})
export class SharedUtilService {
  constructor(private imageCompress: NgxImageCompressService) {}

  /**
   * Converts a file to Base64 format
   */
  convertToBase64(file: File): Promise<string | ArrayBuffer | null> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }

  /**
   * Compresses an image and returns the compressed Base64 string
   */
  async compressImage(file: File, quality: number = 50, maxSize: number = 50): Promise<string> {
    try {
      const base64 = (await this.convertToBase64(file)) as string;
      const compressedImage = await this.imageCompress.compressFile(base64, -1, quality, maxSize);
      return compressedImage;
    } catch (error) {
      console.error('Error compressing image:', error);
      throw error;
    }
  }
}
