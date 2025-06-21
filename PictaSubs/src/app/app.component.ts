import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzColorPickerModule } from 'ng-zorro-antd/color-picker';

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
    NzIconModule,
    NzCheckboxModule,
    NzColorPickerModule
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
  fontColor: string = '#000000';
  fontFamily: string = 'Arial';
  textStrokeColor: string = '#000000';
  textStrokeSize: number = 0;
  imageBorderColor: string = '#000000';
  imageBorderSize: number = 0;
  textBold: boolean = false;
  textItalic: boolean = false;
  textUnderline: boolean = false;
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
    this.fontColor = '#000000';
    this.fontFamily = 'Arial';
    this.textStrokeColor = '#000000';
    this.textStrokeSize = 0;
    this.imageBorderColor = '#000000';
    this.imageBorderSize = 0;
    this.textBold = false;
    this.textItalic = false;
    this.textUnderline = false;
    this.updateCanvas();
  }

  clearCanvas() {
    if (!this.ctx) return;
    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    
    // Just draw a light background
    this.ctx.fillStyle = '#f0f0f0';
    this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
  }

  downloadCanvas() {
    if (!this.canvasRef?.nativeElement || !this.ctx) return;
    
    const canvas = this.canvasRef.nativeElement;
    
    // Store original background color
    const originalFillStyle = this.ctx.fillStyle;
    
    // Temporarily make background transparent
    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    
    // Redraw everything except the background and wait for images to load
    this.drawCanvasWithoutBackgroundWithImages().then(() => {
      // Download the canvas with transparent background
      const link = document.createElement('a');
      link.download = `pictasubs-canvas-${new Date().getTime()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      
      // Restore the original background
      this.ctx.fillStyle = originalFillStyle;
      this.drawCanvas();
    });
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
    
    // Add user text and images if provided
    if (this.canvasText.trim()) {
      console.log('Drawing user text:', this.canvasText);
      this.drawTextWithImages(this.canvasText, this.canvasWidth / 2, this.canvasHeight - 30, this.canvasWidth - 60);
    } else {
      console.log('No text to draw or text is empty');
    }
  }

  private drawCanvasWithoutBackground() {
    if (!this.ctx) return;
    
    // Clear the canvas (this makes it transparent)
    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    
    // Draw a border
    this.ctx.strokeStyle = '#333';
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(0, 0, this.canvasWidth, this.canvasHeight);
    
    // Add user text and images if provided
    if (this.canvasText.trim()) {
      this.drawTextWithImages(this.canvasText, this.canvasWidth / 2, this.canvasHeight - 30, this.canvasWidth - 60);
    }
  }

  private drawTextWithImages(text: string, x: number, y: number, maxWidth: number) {
    // Split text by image URLs in format (image:URL,width:100px,height:100px)
    const imageUrlRegex = /\(image:([^,]+)(?:,width:(\d+)px,height:(\d+)px)?\)/gi;
    let match;
    const parts: Array<{type: 'text' | 'image', content: string, width?: number, height?: number}> = [];
    let lastIndex = 0;
    
    // Find all image matches and split text accordingly
    while ((match = imageUrlRegex.exec(text)) !== null) {
      // Add text before the image
      const textBefore = text.substring(lastIndex, match.index);
      if (textBefore.trim()) {
        parts.push({type: 'text', content: textBefore.trim()});
      }
      
      // Add the image
      const url = match[1];
      const width = match[2] ? parseInt(match[2]) : 120;
      const height = match[3] ? parseInt(match[3]) : 80;
      parts.push({type: 'image', content: url, width: width, height: height});
      
      lastIndex = match.index + match[0].length;
    }
    
    // Add remaining text after the last image
    const textAfter = text.substring(lastIndex);
    if (textAfter.trim()) {
      parts.push({type: 'text', content: textAfter.trim()});
    }
    
    // If no parts were created (no images found), treat the entire text as a text part
    if (parts.length === 0 && text.trim()) {
      parts.push({type: 'text', content: text.trim()});
    }
    
    console.log('Parts created:', parts);
    
    let currentY = y;
    const lineHeight = this.fontSize + 4;
    const imageMargin = 10; // Margin around images
    
    // Set text properties
    this.ctx!.fillStyle = this.fontColor;
    
    // Build font string based on formatting options
    let fontStyle = '';
    if (this.textItalic) {
      fontStyle += 'italic ';
    }
    
    let fontWeight = '';
    if (this.textBold) {
      fontWeight = 'bold ';
    }
    
    this.ctx!.font = `${fontStyle}${fontWeight}${this.fontSize}px ${this.fontFamily}`;
    this.ctx!.textAlign = 'center';
    this.ctx!.textBaseline = 'bottom';
    
    // Build lines of content
    const lines: Array<{type: 'text' | 'image', content: string, width: number, imageWidth?: number, imageHeight?: number}>[] = [];
    let currentLine: Array<{type: 'text' | 'image', content: string, width: number, imageWidth?: number, imageHeight?: number}> = [];
    let currentLineWidth = 0;
    
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      
      if (part.type === 'image') {
        // This is an image
        const imageWidth = part.width || 120;
        const imageHeight = part.height || 80;
        const imageTotalWidth = imageWidth + imageMargin * 2;
        
        if (currentLineWidth + imageTotalWidth > maxWidth) {
          // Start new line
          if (currentLine.length > 0) {
            lines.push([...currentLine]);
            currentLine = [];
            currentLineWidth = 0;
          }
        }
        
        currentLine.push({
          type: 'image', 
          content: part.content, 
          width: imageTotalWidth,
          imageWidth: imageWidth,
          imageHeight: imageHeight
        });
        currentLineWidth += imageTotalWidth;
        
      } else if (part.type === 'text') {
        // This is text
        const words = part.content.split(' ');
        
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
    
    console.log('Lines created:', lines);
    
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
          const imgWidth = item.imageWidth || 120;
          const imgHeight = item.imageHeight || 80;
          this.drawImageFromUrl(item.content, imageX + imgWidth/2, currentY, imgWidth, imgHeight);
          maxItemHeight = Math.max(maxItemHeight, imgHeight + imageMargin * 2);
        } else {
          // Apply stroke if enabled
          if (this.textStrokeSize > 0) {
            this.ctx!.strokeStyle = this.textStrokeColor;
            this.ctx!.lineWidth = this.textStrokeSize;
            this.ctx!.strokeText(item.content, currentX + item.width/2, currentY);
          }
          
          // Draw the main text
          this.ctx!.fillStyle = this.fontColor;
          this.ctx!.fillText(item.content, currentX + item.width/2, currentY);
          
          // Apply underline if enabled
          if (this.textUnderline) {
            const textMetrics = this.ctx!.measureText(item.content);
            const underlineY = currentY + 2; // Position underline below text
            this.ctx!.strokeStyle = this.fontColor;
            this.ctx!.lineWidth = 1;
            this.ctx!.beginPath();
            this.ctx!.moveTo(currentX + item.width/2 - textMetrics.width/2, underlineY);
            this.ctx!.lineTo(currentX + item.width/2 + textMetrics.width/2, underlineY);
            this.ctx!.stroke();
          }
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
      
      // Draw image border if enabled
      if (this.imageBorderSize > 0) {
        this.ctx!.strokeStyle = this.imageBorderColor;
        this.ctx!.lineWidth = this.imageBorderSize;
        this.ctx!.strokeRect(drawX - this.imageBorderSize/2, drawY - this.imageBorderSize/2, 
                           drawWidth + this.imageBorderSize, drawHeight + this.imageBorderSize);
      }
      
      this.ctx!.drawImage(img, drawX, drawY, drawWidth, drawHeight);
    };
    
    img.onerror = () => {
      console.error('Failed to load image:', url);
      // Draw a placeholder rectangle
      this.ctx!.fillStyle = '#ccc';
      this.ctx!.fillRect(x - maxWidth/2, y - maxHeight, maxWidth, maxHeight);
      this.ctx!.fillStyle = '#666';
      this.ctx!.font = `14px ${this.fontFamily}`;
      this.ctx!.textAlign = 'center';
      this.ctx!.textBaseline = 'middle';
      this.ctx!.fillText('Image failed to load', x, y - maxHeight/2);
    };
    
    img.src = url;
  }

  private drawCanvasWithoutBackgroundWithImages(): Promise<void> {
    if (!this.ctx) return Promise.resolve();
    
    // Clear the canvas (this makes it transparent)
    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    
    // Draw a border
    this.ctx.strokeStyle = '#333';
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(0, 0, this.canvasWidth, this.canvasHeight);
    
    // Add user text and images if provided
    if (this.canvasText.trim()) {
      return this.drawTextWithImagesAsync(this.canvasText, this.canvasWidth / 2, this.canvasHeight - 30, this.canvasWidth - 60);
    }
    
    return Promise.resolve();
  }

  private drawTextWithImagesAsync(text: string, x: number, y: number, maxWidth: number): Promise<void> {
    return new Promise<void>((resolve) => {
      // Split text by image URLs in format (image:URL,width:100px,height:100px)
      const imageUrlRegex = /\(image:([^,]+)(?:,width:(\d+)px,height:(\d+)px)?\)/gi;
      let match;
      const parts: Array<{type: 'text' | 'image', content: string, width?: number, height?: number}> = [];
      let lastIndex = 0;
      
      // Find all image matches and split text accordingly
      while ((match = imageUrlRegex.exec(text)) !== null) {
        // Add text before the image
        const textBefore = text.substring(lastIndex, match.index);
        if (textBefore.trim()) {
          parts.push({type: 'text', content: textBefore.trim()});
        }
        
        // Add the image
        const url = match[1];
        const width = match[2] ? parseInt(match[2]) : 120;
        const height = match[3] ? parseInt(match[3]) : 80;
        parts.push({type: 'image', content: url, width: width, height: height});
        
        lastIndex = match.index + match[0].length;
      }
      
      // Add remaining text after the last image
      const textAfter = text.substring(lastIndex);
      if (textAfter.trim()) {
        parts.push({type: 'text', content: textAfter.trim()});
      }
      
      // If no parts were created (no images found), treat the entire text as a text part
      if (parts.length === 0 && text.trim()) {
        parts.push({type: 'text', content: text.trim()});
      }
      
      let currentY = y;
      const lineHeight = this.fontSize + 4;
      const imageMargin = 10; // Margin around images
      
      // Set text properties
      this.ctx!.fillStyle = this.fontColor;
      
      // Build font string based on formatting options
      let fontStyle = '';
      if (this.textItalic) {
        fontStyle += 'italic ';
      }
      
      let fontWeight = '';
      if (this.textBold) {
        fontWeight = 'bold ';
      }
      
      this.ctx!.font = `${fontStyle}${fontWeight}${this.fontSize}px ${this.fontFamily}`;
      this.ctx!.textAlign = 'center';
      this.ctx!.textBaseline = 'bottom';
      
      // Build lines of content
      const lines: Array<{type: 'text' | 'image', content: string, width: number, imageWidth?: number, imageHeight?: number}>[] = [];
      let currentLine: Array<{type: 'text' | 'image', content: string, width: number, imageWidth?: number, imageHeight?: number}> = [];
      let currentLineWidth = 0;
      
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        
        if (part.type === 'image') {
          // This is an image
          const imageWidth = part.width || 120;
          const imageHeight = part.height || 80;
          const imageTotalWidth = imageWidth + imageMargin * 2;
          
          if (currentLineWidth + imageTotalWidth > maxWidth) {
            // Start new line
            if (currentLine.length > 0) {
              lines.push([...currentLine]);
              currentLine = [];
              currentLineWidth = 0;
            }
          }
          
          currentLine.push({
            type: 'image', 
            content: part.content, 
            width: imageTotalWidth,
            imageWidth: imageWidth,
            imageHeight: imageHeight
          });
          currentLineWidth += imageTotalWidth;
          
        } else if (part.type === 'text') {
          // This is text
          const words = part.content.split(' ');
          
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
      
      // Collect all image promises
      const imagePromises: Promise<void>[] = [];
      
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
            const imgWidth = item.imageWidth || 120;
            const imgHeight = item.imageHeight || 80;
            const imgPromise = this.drawImageFromUrlAsync(item.content, imageX + imgWidth/2, currentY, imgWidth, imgHeight);
            imagePromises.push(imgPromise);
            maxItemHeight = Math.max(maxItemHeight, imgHeight + imageMargin * 2);
          } else {
            // Apply stroke if enabled
            if (this.textStrokeSize > 0) {
              this.ctx!.strokeStyle = this.textStrokeColor;
              this.ctx!.lineWidth = this.textStrokeSize;
              this.ctx!.strokeText(item.content, currentX + item.width/2, currentY);
            }
            
            // Draw the main text
            this.ctx!.fillStyle = this.fontColor;
            this.ctx!.fillText(item.content, currentX + item.width/2, currentY);
            
            // Apply underline if enabled
            if (this.textUnderline) {
              const textMetrics = this.ctx!.measureText(item.content);
              const underlineY = currentY + 2; // Position underline below text
              this.ctx!.strokeStyle = this.fontColor;
              this.ctx!.lineWidth = 1;
              this.ctx!.beginPath();
              this.ctx!.moveTo(currentX + item.width/2 - textMetrics.width/2, underlineY);
              this.ctx!.lineTo(currentX + item.width/2 + textMetrics.width/2, underlineY);
              this.ctx!.stroke();
            }
          }
          
          currentX += item.width;
        }
        
        currentY -= maxItemHeight;
      }
      
      // Wait for all images to load
      Promise.all(imagePromises).then(() => {
        resolve();
      });
    });
  }

  private drawImageFromUrlAsync(url: string, x: number, y: number, maxWidth: number, maxHeight: number): Promise<void> {
    return new Promise<void>((resolve, reject) => {
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
        
        // Draw image border if enabled
        if (this.imageBorderSize > 0) {
          this.ctx!.strokeStyle = this.imageBorderColor;
          this.ctx!.lineWidth = this.imageBorderSize;
          this.ctx!.strokeRect(drawX - this.imageBorderSize/2, drawY - this.imageBorderSize/2, 
                             drawWidth + this.imageBorderSize, drawHeight + this.imageBorderSize);
        }
        
        this.ctx!.drawImage(img, drawX, drawY, drawWidth, drawHeight);
        resolve();
      };
      
      img.onerror = () => {
        console.error('Failed to load image:', url);
        // Draw a placeholder rectangle
        this.ctx!.fillStyle = '#ccc';
        this.ctx!.fillRect(x - maxWidth/2, y - maxHeight, maxWidth, maxHeight);
        this.ctx!.fillStyle = '#666';
        this.ctx!.font = `14px ${this.fontFamily}`;
        this.ctx!.textAlign = 'center';
        this.ctx!.textBaseline = 'middle';
        this.ctx!.fillText('Image failed to load', x, y - maxHeight/2);
        resolve(); // Resolve even on error to continue the process
      };
      
      img.src = url;
    });
  }
}
