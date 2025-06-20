import { Component, OnInit } from '@angular/core';
import { createWorker, PSM } from 'tesseract.js';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../environments/firebase';


@Component({
  selector: 'app-scanfood',
  templateUrl: './scanfood.page.html',
  styleUrls: ['./scanfood.page.scss'],
  standalone: false
})
export class ScanfoodPage implements OnInit {

  uploadedFile: string | ArrayBuffer | null = null;
  uploadedFileName: string = '';
  isImage: boolean = false;
  fileDescription: string = '';

  constructor() {}

  ngOnInit() {}

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;
    this.handleFileInput(file);
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFileInput(files[0]);
    }
  }

  async handleFileInput(file: File): Promise<void> {
    this.uploadedFileName = file.name;

    if (!file.type.startsWith('image/')) {
      this.isImage = false;
      this.uploadedFile = 'document';
      this.fileDescription = 'Document uploaded. Nutrition extraction works best with nutrition label images.';
      return;
    }

    this.isImage = true;

    try {
      const imageData = await this.readFileAsDataURL(file);
      const upscaledImage = await this.resizeImage(imageData as string); // 🔧 ADDED

      const worker = await createWorker('eng');
await worker.setParameters({
  preserve_interword_spaces: '1',
  tessedit_pageseg_mode: PSM.SINGLE_BLOCK // equivalent to mode 6
});
      const { data } = await worker.recognize(upscaledImage); // 🧠 MODIFIED
      const rawText = data.text;
      await worker.terminate();

      this.uploadedFile = imageData;
      this.fileDescription = this.extractNutritionSummary(rawText);

      console.log('✅ Nutrition summary extracted.');
      await this.saveToFirestore(this.uploadedFileName, this.fileDescription);

    } catch (error) {
      console.error('❌ Error during OCR:', error);
    }
  }

  private readFileAsDataURL(file: File): Promise<string | ArrayBuffer> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result!);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // 🔧 ADDED: Upscale small image to improve OCR accuracy
  private resizeImage(imageData: string): Promise<string> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width * 2;
        canvas.height = img.height * 2;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/png'));
      };
      img.src = imageData;
    });
  }

  extractNutritionSummary(text: string): string {
    const summary: string[] = ['Nutrition Summary:'];

    const extractMultiple = (labels: string[], unit = '') => {
      for (const label of labels) {
        const regex = new RegExp(`${label}\\s*:?\\s*([\\d\\.]+)${unit}`, 'i');
        const match = text.match(regex);
        if (match) return `- ${label}: ${match[1]}${unit}`;
      }
      return '';
    };

    const items = [
      extractMultiple(['Calories']),
      extractMultiple(['Total Fat'], 'g'),
      extractMultiple(['Saturated Fat'], 'g'),
      extractMultiple(['Trans Fat'], 'g'),
      extractMultiple(['Cholesterol'], 'mg'),
      extractMultiple(['Sodium'], 'mg'),
      extractMultiple(['Total Carbohydrate'], 'g'),
      extractMultiple(['Dietary Fiber'], 'g'),
      extractMultiple(['Total Sugars'], 'g'),
      extractMultiple(['Added Sugars', 'Includes \\d+g Added Sugars'], 'g'),
      extractMultiple(['Protein'], 'g'),
      extractMultiple(['Vitamin D'], 'mcg'),
      extractMultiple(['Calcium'], 'mg'),
      extractMultiple(['Iron'], 'mg'),
      extractMultiple(['Potassium'], 'mg')
    ].filter(Boolean);

    return summary.concat(items).join('\n');
  }

  async saveToFirestore(fileName: string, summary: string) {
    try {
      await addDoc(collection(db, 'nutritionSummaries'), {
        fileName,
        summary,
        timestamp: new Date()
      });
      console.log('✅ Nutrition data saved to Firestore.');
    } catch (e) {
      console.error('❌ Error saving to Firestore:', e);
    }
  }
}
