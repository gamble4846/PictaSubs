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
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
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
  fontSize: number = 100;
  fontColor: string = '#ffffff';
  fontFamily: string = 'Komikax';
  textStrokeColor: string = '#000000';
  textStrokeSize: number = 10;
  imageBorderColor: string = '#000000';
  imageBorderSize: number = 0;
  textBold: boolean = false;
  textItalic: boolean = false;
  textUnderline: boolean = false;
  textMarginBottom: number = 30;
  backgroundImage: string | null = null;
  private ctx!: CanvasRenderingContext2D;
  private defaultWidth: number = 1920;
  private defaultHeight: number = 1080;

  // Timeline functionality
  canvasStates: Array<{
    canvasWidth: number;
    canvasHeight: number;
    canvasText: string;
    fontSize: number;
    fontColor: string;
    fontFamily: string;
    textStrokeColor: string;
    textStrokeSize: number;
    imageBorderColor: string;
    imageBorderSize: number;
    textBold: boolean;
    textItalic: boolean;
    textUnderline: boolean;
    textMarginBottom: number;
    backgroundImage: string | null;
    timestamp: Date;
  }> = [];
  currentStateIndex: number = -1;
  defaultState: any = null;

  ngAfterViewInit() {
    this.initializeCanvas();
    this.initializeDefaultState();
  }

  initializeCanvas() {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;
    this.drawCanvas();
  }

  initializeDefaultState() {
    const defaultState = {
      canvasWidth: this.canvasWidth,
      canvasHeight: this.canvasHeight,
      canvasText: this.canvasText,
      fontSize: this.fontSize,
      fontColor: this.fontColor,
      fontFamily: this.fontFamily,
      textStrokeColor: this.textStrokeColor,
      textStrokeSize: this.textStrokeSize,
      imageBorderColor: this.imageBorderColor,
      imageBorderSize: this.imageBorderSize,
      textBold: this.textBold,
      textItalic: this.textItalic,
      textUnderline: this.textUnderline,
      textMarginBottom: this.textMarginBottom,
      backgroundImage: this.backgroundImage,
      timestamp: new Date()
    };

    this.canvasStates = [defaultState];
    this.currentStateIndex = 0;

    console.log('Default state initialized:', this.canvasStates.length, 'states');
  }

  saveCurrentState() {
    const currentState = {
      canvasWidth: this.canvasWidth,
      canvasHeight: this.canvasHeight,
      canvasText: this.canvasText,
      fontSize: this.fontSize,
      fontColor: this.fontColor,
      fontFamily: this.fontFamily,
      textStrokeColor: this.textStrokeColor,
      textStrokeSize: this.textStrokeSize,
      imageBorderColor: this.imageBorderColor,
      imageBorderSize: this.imageBorderSize,
      textBold: this.textBold,
      textItalic: this.textItalic,
      textUnderline: this.textUnderline,
      textMarginBottom: this.textMarginBottom,
      backgroundImage: this.backgroundImage,
      timestamp: new Date()
    };

    // Update the current state
    this.canvasStates[this.currentStateIndex] = currentState;
  }

  setAsDefault() {
    // Save the current canvas properties as the new default
    this.defaultState = {
      canvasWidth: this.canvasWidth,
      canvasHeight: this.canvasHeight,
      canvasText: this.canvasText,
      fontSize: this.fontSize,
      fontColor: this.fontColor,
      fontFamily: this.fontFamily,
      textStrokeColor: this.textStrokeColor,
      textStrokeSize: this.textStrokeSize,
      imageBorderColor: this.imageBorderColor,
      imageBorderSize: this.imageBorderSize,
      textBold: this.textBold,
      textItalic: this.textItalic,
      textUnderline: this.textUnderline,
      textMarginBottom: this.textMarginBottom,
      backgroundImage: this.backgroundImage
    };
  }

  resetCanvas() {
    if (this.defaultState) {
      // Use custom default state
      this.canvasWidth = this.defaultState.canvasWidth;
      this.canvasHeight = this.defaultState.canvasHeight;
      this.canvasText = this.defaultState.canvasText;
      this.fontColor = this.defaultState.fontColor;
      this.fontFamily = this.defaultState.fontFamily;
      this.fontSize = this.defaultState.fontSize;
      this.textStrokeColor = this.defaultState.textStrokeColor;
      this.textStrokeSize = this.defaultState.textStrokeSize;
      this.imageBorderColor = this.defaultState.imageBorderColor;
      this.imageBorderSize = this.defaultState.imageBorderSize;
      this.textBold = this.defaultState.textBold;
      this.textItalic = this.defaultState.textItalic;
      this.textUnderline = this.defaultState.textUnderline;
      this.textMarginBottom = this.defaultState.textMarginBottom;
      this.backgroundImage = this.defaultState.backgroundImage;
    } else {
      // Use original hardcoded defaults
      this.canvasWidth = this.defaultWidth;
      this.canvasHeight = this.defaultHeight;
      this.canvasText = '';
      this.fontColor = '#ffffff';
      this.fontFamily = 'Komikax';
      this.fontSize = 100;
      this.textStrokeColor = '#000000';
      this.textStrokeSize = 10;
      this.imageBorderColor = '#000000';
      this.imageBorderSize = 0;
      this.textBold = false;
      this.textItalic = false;
      this.textUnderline = false;
      this.textMarginBottom = 30;
      this.backgroundImage = null;
    }
    this.updateCanvas();
  }

  addNewState() {
    const newState = {
      canvasWidth: this.canvasWidth,
      canvasHeight: this.canvasHeight,
      canvasText: this.canvasText,
      fontSize: this.fontSize,
      fontColor: this.fontColor,
      fontFamily: this.fontFamily,
      textStrokeColor: this.textStrokeColor,
      textStrokeSize: this.textStrokeSize,
      imageBorderColor: this.imageBorderColor,
      imageBorderSize: this.imageBorderSize,
      textBold: this.textBold,
      textItalic: this.textItalic,
      textUnderline: this.textUnderline,
      textMarginBottom: this.textMarginBottom,
      backgroundImage: this.backgroundImage,
      timestamp: new Date()
    };

    // Remove any states after current index (if we're not at the end)
    if (this.currentStateIndex < this.canvasStates.length - 1) {
      this.canvasStates = this.canvasStates.slice(0, this.currentStateIndex + 1);
    }

    this.canvasStates.push(newState);
    this.currentStateIndex = this.canvasStates.length - 1;

    // Reset canvas to default values for the new state
    this.resetCanvas();
  }

  updateCanvas() {
    this.drawCanvas();
  }

  updateCanvasText() {
    this.updateCanvas();
  }

  onBackgroundImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.backgroundImage = e.target?.result as string;
        this.updateCanvas();
      };
      reader.readAsDataURL(file);
    }
  }

  clearBackgroundImage() {
    this.backgroundImage = null;
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

    // Redraw everything except the background and border, and wait for images to load
    this.drawCanvasForDownload().then(() => {
      // Download the canvas with transparent background and no border
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

    // Draw background image if set, otherwise use default background
    if (this.backgroundImage) {
      this.drawBackgroundImage();
    } else {
      // Set default background
      this.ctx.fillStyle = '#f0f0f0';
      this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
      
      // Draw border and text
      this.drawBorderAndText();
    }
  }

  private drawBackgroundImage() {
    const img = new Image();
    img.onload = () => {
      // Calculate aspect ratio to maintain proportions
      const aspectRatio = img.width / img.height;
      let drawWidth = this.canvasWidth;
      let drawHeight = drawWidth / aspectRatio;

      if (drawHeight > this.canvasHeight) {
        drawHeight = this.canvasHeight;
        drawWidth = drawHeight * aspectRatio;
      }

      // Center the image
      const drawX = (this.canvasWidth - drawWidth) / 2;
      const drawY = (this.canvasHeight - drawHeight) / 2;

      this.ctx!.drawImage(img, drawX, drawY, drawWidth, drawHeight);
      
      // Draw border and text after background image
      this.drawBorderAndText();
    };
    img.onerror = () => {
      console.error('Failed to load background image');
      // Fallback to default background
      this.ctx!.fillStyle = '#f0f0f0';
      this.ctx!.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
      this.drawBorderAndText();
    };
    img.src = this.backgroundImage!;
  }

  private drawBorderAndText() {
    // Draw a border
    this.ctx!.strokeStyle = '#333';
    this.ctx!.lineWidth = 2;
    this.ctx!.strokeRect(0, 0, this.canvasWidth, this.canvasHeight);

    // Add user text and images if provided
    if (this.canvasText.trim()) {
      console.log('Drawing user text:', this.canvasText);
      this.drawTextWithImages(this.canvasText, this.canvasWidth / 2, this.canvasHeight - this.textMarginBottom, this.canvasWidth - 60);
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
      this.drawTextWithImages(this.canvasText, this.canvasWidth / 2, this.canvasHeight - this.textMarginBottom, this.canvasWidth - 60);
    }
  }

  private drawCanvasForDownload(): Promise<void> {
    if (!this.ctx) return Promise.resolve();

    // Clear the canvas (this makes it transparent)
    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

    // Add user text and images if provided (no border)
    if (this.canvasText.trim()) {
      return this.drawTextWithImagesAsync(this.canvasText, this.canvasWidth / 2, this.canvasHeight - this.textMarginBottom, this.canvasWidth - 60);
    }

    return Promise.resolve();
  }

  private drawTextWithImages(text: string, x: number, y: number, maxWidth: number) {
    // Split text by newlines first to handle line breaks from textarea
    const textLines = text.split('\n');
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

    // Process each line separately
    for (let lineIndex = textLines.length - 1; lineIndex >= 0; lineIndex--) {
      const lineText = textLines[lineIndex].trim();
      
      if (!lineText) {
        // Empty line - just add line height
        currentY -= lineHeight;
        continue;
      }

      // Split line by image URLs in format (image:URL,width:100px,height:100px)
      const imageUrlRegex = /\(image:([^,]+)(?:,width:(\d+)px,height:(\d+)px)?\)/gi;
      let match;
      const parts: Array<{ type: 'text' | 'image', content: string, width?: number, height?: number }> = [];
      let lastIndex = 0;

      // Find all image matches and split text accordingly
      while ((match = imageUrlRegex.exec(lineText)) !== null) {
        // Add text before the image
        const textBefore = lineText.substring(lastIndex, match.index);
        if (textBefore.trim()) {
          parts.push({ type: 'text', content: textBefore.trim() });
        }

        // Add the image
        const url = match[1];
        const width = match[2] ? parseInt(match[2]) : 120;
        const height = match[3] ? parseInt(match[3]) : 80;
        parts.push({ type: 'image', content: url, width: width, height: height });

        lastIndex = match.index + match[0].length;
      }

      // Add remaining text after the last image
      const textAfter = lineText.substring(lastIndex);
      if (textAfter.trim()) {
        parts.push({ type: 'text', content: textAfter.trim() });
      }

      // If no parts were created (no images found), treat the entire line as a text part
      if (parts.length === 0 && lineText.trim()) {
        parts.push({ type: 'text', content: lineText.trim() });
      }

      // Build lines of content for this text line
      const lines: Array<{ type: 'text' | 'image', content: string, width: number, imageWidth?: number, imageHeight?: number }>[] = [];
      let currentLine: Array<{ type: 'text' | 'image', content: string, width: number, imageWidth?: number, imageHeight?: number }> = [];
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

            currentLine.push({ type: 'text', content: word + ' ', width: wordWidth });
            currentLineWidth += wordWidth;
          }
        }
      }

      // Add the last line
      if (currentLine.length > 0) {
        lines.push(currentLine);
      }

      // Draw all lines for this text line
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
            this.drawImageFromUrl(item.content, imageX + imgWidth / 2, currentY, imgWidth, imgHeight);
            maxItemHeight = Math.max(maxItemHeight, imgHeight + imageMargin * 2);
          } else {
            // Apply stroke if enabled
            if (this.textStrokeSize > 0) {
              this.ctx!.strokeStyle = this.textStrokeColor;
              this.ctx!.lineWidth = this.textStrokeSize;
              this.ctx!.strokeText(item.content, currentX + item.width / 2, currentY);
            }

            // Draw the main text
            this.ctx!.fillStyle = this.fontColor;
            this.ctx!.fillText(item.content, currentX + item.width / 2, currentY);

            // Apply underline if enabled
            if (this.textUnderline) {
              const textMetrics = this.ctx!.measureText(item.content);
              const underlineY = currentY + 2; // Position underline below text
              this.ctx!.strokeStyle = this.fontColor;
              this.ctx!.lineWidth = 1;
              this.ctx!.beginPath();
              this.ctx!.moveTo(currentX + item.width / 2 - textMetrics.width / 2, underlineY);
              this.ctx!.lineTo(currentX + item.width / 2 + textMetrics.width / 2, underlineY);
              this.ctx!.stroke();
            }
          }

          currentX += item.width;
        }

        currentY -= maxItemHeight;
      }
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
        this.ctx!.strokeRect(drawX - this.imageBorderSize / 2, drawY - this.imageBorderSize / 2,
          drawWidth + this.imageBorderSize, drawHeight + this.imageBorderSize);
      }

      this.ctx!.drawImage(img, drawX, drawY, drawWidth, drawHeight);
    };

    img.onerror = () => {
      console.error('Failed to load image:', url);
      // Draw a placeholder rectangle
      this.ctx!.fillStyle = '#ccc';
      this.ctx!.fillRect(x - maxWidth / 2, y - maxHeight, maxWidth, maxHeight);
      this.ctx!.fillStyle = '#666';
      this.ctx!.font = `14px ${this.fontFamily}`;
      this.ctx!.textAlign = 'center';
      this.ctx!.textBaseline = 'middle';
      this.ctx!.fillText('Image failed to load', x, y - maxHeight / 2);
    };

    img.src = url;
  }

  private drawTextWithImagesAsync(text: string, x: number, y: number, maxWidth: number): Promise<void> {
    return new Promise<void>((resolve) => {
      // Split text by newlines first to handle line breaks from textarea
      const textLines = text.split('\n');
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

      // Collect all image promises
      const imagePromises: Promise<void>[] = [];

      // Process each line separately
      for (let lineIndex = textLines.length - 1; lineIndex >= 0; lineIndex--) {
        const lineText = textLines[lineIndex].trim();
        
        if (!lineText) {
          // Empty line - just add line height
          currentY -= lineHeight;
          continue;
        }

        // Split line by image URLs in format (image:URL,width:100px,height:100px)
        const imageUrlRegex = /\(image:([^,]+)(?:,width:(\d+)px,height:(\d+)px)?\)/gi;
        let match;
        const parts: Array<{ type: 'text' | 'image', content: string, width?: number, height?: number }> = [];
        let lastIndex = 0;

        // Find all image matches and split text accordingly
        while ((match = imageUrlRegex.exec(lineText)) !== null) {
          // Add text before the image
          const textBefore = lineText.substring(lastIndex, match.index);
          if (textBefore.trim()) {
            parts.push({ type: 'text', content: textBefore.trim() });
          }

          // Add the image
          const url = match[1];
          const width = match[2] ? parseInt(match[2]) : 120;
          const height = match[3] ? parseInt(match[3]) : 80;
          parts.push({ type: 'image', content: url, width: width, height: height });

          lastIndex = match.index + match[0].length;
        }

        // Add remaining text after the last image
        const textAfter = lineText.substring(lastIndex);
        if (textAfter.trim()) {
          parts.push({ type: 'text', content: textAfter.trim() });
        }

        // If no parts were created (no images found), treat the entire line as a text part
        if (parts.length === 0 && lineText.trim()) {
          parts.push({ type: 'text', content: lineText.trim() });
        }

        // Build lines of content for this text line
        const lines: Array<{ type: 'text' | 'image', content: string, width: number, imageWidth?: number, imageHeight?: number }>[] = [];
        let currentLine: Array<{ type: 'text' | 'image', content: string, width: number, imageWidth?: number, imageHeight?: number }> = [];
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

              currentLine.push({ type: 'text', content: word + ' ', width: wordWidth });
              currentLineWidth += wordWidth;
            }
          }
        }

        // Add the last line
        if (currentLine.length > 0) {
          lines.push(currentLine);
        }

        // Draw all lines for this text line
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
              const imgPromise = this.drawImageFromUrlAsync(item.content, imageX + imgWidth / 2, currentY, imgWidth, imgHeight);
              imagePromises.push(imgPromise);
              maxItemHeight = Math.max(maxItemHeight, imgHeight + imageMargin * 2);
            } else {
              // Apply stroke if enabled
              if (this.textStrokeSize > 0) {
                this.ctx!.strokeStyle = this.textStrokeColor;
                this.ctx!.lineWidth = this.textStrokeSize;
                this.ctx!.strokeText(item.content, currentX + item.width / 2, currentY);
              }

              // Draw the main text
              this.ctx!.fillStyle = this.fontColor;
              this.ctx!.fillText(item.content, currentX + item.width / 2, currentY);

              // Apply underline if enabled
              if (this.textUnderline) {
                const textMetrics = this.ctx!.measureText(item.content);
                const underlineY = currentY + 2; // Position underline below text
                this.ctx!.strokeStyle = this.fontColor;
                this.ctx!.lineWidth = 1;
                this.ctx!.beginPath();
                this.ctx!.moveTo(currentX + item.width / 2 - textMetrics.width / 2, underlineY);
                this.ctx!.lineTo(currentX + item.width / 2 + textMetrics.width / 2, underlineY);
                this.ctx!.stroke();
              }
            }

            currentX += item.width;
          }

          currentY -= maxItemHeight;
        }
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
          this.ctx!.strokeRect(drawX - this.imageBorderSize / 2, drawY - this.imageBorderSize / 2,
            drawWidth + this.imageBorderSize, drawHeight + this.imageBorderSize);
        }

        this.ctx!.drawImage(img, drawX, drawY, drawWidth, drawHeight);
        resolve();
      };

      img.onerror = () => {
        console.error('Failed to load image:', url);
        // Draw a placeholder rectangle
        this.ctx!.fillStyle = '#ccc';
        this.ctx!.fillRect(x - maxWidth / 2, y - maxHeight, maxWidth, maxHeight);
        this.ctx!.fillStyle = '#666';
        this.ctx!.font = `14px ${this.fontFamily}`;
        this.ctx!.textAlign = 'center';
        this.ctx!.textBaseline = 'middle';
        this.ctx!.fillText('Image failed to load', x, y - maxHeight / 2);
        resolve(); // Resolve even on error to continue the process
      };

      img.src = url;
    });
  }

  loadCanvasState(state: any) {
    this.canvasWidth = state.canvasWidth;
    this.canvasHeight = state.canvasHeight;
    this.canvasText = state.canvasText;
    this.fontSize = state.fontSize;
    this.fontColor = state.fontColor;
    this.fontFamily = state.fontFamily;
    this.textStrokeColor = state.textStrokeColor;
    this.textStrokeSize = state.textStrokeSize;
    this.imageBorderColor = state.imageBorderColor;
    this.imageBorderSize = state.imageBorderSize;
    this.textBold = state.textBold;
    this.textItalic = state.textItalic;
    this.textUnderline = state.textUnderline;
    this.textMarginBottom = state.textMarginBottom;
    this.backgroundImage = state.backgroundImage;

    this.updateCanvas();
  }

  goToPrevious() {
    if (this.currentStateIndex > 0) {
      this.currentStateIndex--;
      this.loadCanvasState(this.canvasStates[this.currentStateIndex]);
    }
  }

  goToNext() {
    if (this.currentStateIndex < this.canvasStates.length - 1) {
      this.currentStateIndex++;
      this.loadCanvasState(this.canvasStates[this.currentStateIndex]);
    }
  }

  goToState(index: number) {
    if (index >= 0 && index < this.canvasStates.length) {
      this.currentStateIndex = index;
      this.loadCanvasState(this.canvasStates[this.currentStateIndex]);
    }
  }

  canGoPrevious(): boolean {
    return this.currentStateIndex > 0;
  }

  canGoNext(): boolean {
    return this.currentStateIndex < this.canvasStates.length - 1;
  }

  private statesAreEqual(state1: any, state2: any): boolean {
    return state1.canvasWidth === state2.canvasWidth &&
      state1.canvasHeight === state2.canvasHeight &&
      state1.canvasText === state2.canvasText &&
      state1.fontSize === state2.fontSize &&
      state1.fontColor === state2.fontColor &&
      state1.fontFamily === state2.fontFamily &&
      state1.textStrokeColor === state2.textStrokeColor &&
      state1.textStrokeSize === state2.textStrokeSize &&
      state1.imageBorderColor === state2.imageBorderColor &&
      state1.imageBorderSize === state2.imageBorderSize &&
      state1.textBold === state2.textBold &&
      state1.textItalic === state2.textItalic &&
      state1.textUnderline === state2.textUnderline &&
      state1.textMarginBottom === state2.textMarginBottom &&
      state1.backgroundImage === state2.backgroundImage;
  }
}
