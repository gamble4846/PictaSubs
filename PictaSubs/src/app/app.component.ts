import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    FormsModule,
    NzCardModule,
    NzFormModule,
    NzInputNumberModule,
    NzInputModule,
    NzButtonModule,
    NzIconModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements AfterViewInit {
  title = 'PictaSubs';

  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  canvasWidth: number = 1920;
  canvasHeight: number = 1080;
  canvasText: string = '';
  fontSize: number = 16;
  private ctx!: CanvasRenderingContext2D;
  private defaultWidth: number = 400;
  private defaultHeight: number = 300;

  ngAfterViewInit() {
    this.initializeCanvas();
  }

  initializeCanvas() {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;
    this.drawCanvas();
  }

  updateCanvas() {
    this.drawCanvas();
  }

  updateCanvasText() {
    console.log('updateCanvasText called with:', this.canvasText);
    this.drawCanvas();
  }

  resetCanvas() {
    this.canvasWidth = this.defaultWidth;
    this.canvasHeight = this.defaultHeight;
    this.canvasText = '';
    this.updateCanvas();
  }

  clearCanvas() {
    if (!this.ctx) return;
    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    
    // Just draw a light background
    this.ctx.fillStyle = '#f0f0f0';
    this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
  }

  private drawCanvas() {
    if (!this.ctx) return;
    
    console.log('drawCanvas called, canvasText:', this.canvasText);
    
    // Clear the canvas
    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    
    // Set background
    this.ctx.fillStyle = '#f0f0f0';
    this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
    
    // Draw a border
    this.ctx.strokeStyle = '#333';
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(0, 0, this.canvasWidth, this.canvasHeight);
    
    // Add canvas dimensions text
    this.ctx.fillStyle = '#333';
    this.ctx.font = `${this.fontSize}px Arial`;
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(`Canvas: ${this.canvasWidth}x${this.canvasHeight}`, this.canvasWidth / 2, this.canvasHeight / 2);
    
    // Add user text and images if provided
    if (this.canvasText.trim()) {
      console.log('Drawing user text:', this.canvasText);
      this.drawTextWithImages(this.canvasText, this.canvasWidth / 2, this.canvasHeight - 30, this.canvasWidth - 60);
    } else {
      console.log('No text to draw or text is empty');
    }
  }

  private drawTextWithImages(text: string, x: number, y: number, maxWidth: number) {
    // Split text by image URLs in format (image:URL)
    const imageUrlRegex = /\(image:([^)]+)\)/gi;
    const parts = text.split(imageUrlRegex);
    
    let currentY = y;
    const lineHeight = this.fontSize + 4;
    const imageHeight = 80; // Smaller image height for inline display
    const imageWidth = 120; // Fixed image width for inline display
    const imageMargin = 10; // Margin around images
    
    // Set text properties
    this.ctx!.fillStyle = '#000000';
    this.ctx!.font = `${this.fontSize}px Arial`;
    this.ctx!.textAlign = 'center';
    this.ctx!.textBaseline = 'bottom';
    
    // Build lines of content
    const lines: Array<{type: 'text' | 'image', content: string, width: number}>[] = [];
    let currentLine: Array<{type: 'text' | 'image', content: string, width: number}> = [];
    let currentLineWidth = 0;
    
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      
      if (i % 2 === 1) {
        // This is an image URL
        const imageTotalWidth = imageWidth + imageMargin * 2;
        
        if (currentLineWidth + imageTotalWidth > maxWidth) {
          // Start new line
          if (currentLine.length > 0) {
            lines.push([...currentLine]);
            currentLine = [];
            currentLineWidth = 0;
          }
        }
        
        currentLine.push({type: 'image', content: part, width: imageTotalWidth});
        currentLineWidth += imageTotalWidth;
        
      } else if (part.trim()) {
        // This is text
        const words = part.trim().split(' ');
        
        for (let j = 0; j < words.length; j++) {
          const word = words[j];
          const wordWidth = this.ctx!.measureText(word + ' ').width;
          
          if (currentLineWidth + wordWidth > maxWidth) {
            // Start new line
            if (currentLine.length > 0) {
              lines.push([...currentLine]);
              currentLine = [];
              currentLineWidth = 0;
            }
          }
          
          currentLine.push({type: 'text', content: word + ' ', width: wordWidth});
          currentLineWidth += wordWidth;
        }
      }
    }
    
    // Add the last line
    if (currentLine.length > 0) {
      lines.push(currentLine);
    }
    
    // Draw all lines
    for (let lineIndex = lines.length - 1; lineIndex >= 0; lineIndex--) {
      const line = lines[lineIndex];
      const lineWidth = line.reduce((sum, item) => sum + item.width, 0);
      let currentX = x - lineWidth / 2; // Center the line
      let maxItemHeight = lineHeight;
      
      for (let itemIndex = 0; itemIndex < line.length; itemIndex++) {
        const item = line[itemIndex];
        
        if (item.type === 'image') {
          const imageX = currentX + imageMargin;
          this.drawImageFromUrl(item.content, imageX + imageWidth/2, currentY, imageWidth, imageHeight);
          maxItemHeight = Math.max(maxItemHeight, imageHeight + imageMargin * 2);
        } else {
          this.ctx!.fillText(item.content, currentX + item.width/2, currentY);
        }
        
        currentX += item.width;
      }
      
      currentY -= maxItemHeight;
    }
  }

  private drawImageFromUrl(url: string, x: number, y: number, maxWidth: number, maxHeight: number) {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      // Calculate aspect ratio to maintain proportions
      const aspectRatio = img.width / img.height;
      let drawWidth = maxWidth;
      let drawHeight = drawWidth / aspectRatio;
      
      if (drawHeight > maxHeight) {
        drawHeight = maxHeight;
        drawWidth = drawHeight * aspectRatio;
      }
      
      // Center the image horizontally
      const drawX = x - drawWidth / 2;
      const drawY = y - drawHeight;
      
      this.ctx!.drawImage(img, drawX, drawY, drawWidth, drawHeight);
    };
    
    img.onerror = () => {
      console.error('Failed to load image:', url);
      // Draw a placeholder rectangle
      this.ctx!.fillStyle = '#ccc';
      this.ctx!.fillRect(x - maxWidth/2, y - maxHeight, maxWidth, maxHeight);
      this.ctx!.fillStyle = '#666';
      this.ctx!.font = '14px Arial';
      this.ctx!.textAlign = 'center';
      this.ctx!.textBaseline = 'middle';
      this.ctx!.fillText('Image failed to load', x, y - maxHeight/2);
    };
    
    img.src = url;
  }
}
