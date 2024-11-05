"use client";

import { useState, useRef } from 'react';
import ReactCrop, { type Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Check, X } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface ImageCropperProps {
  imageUrl: string;
  aspect?: number;
  onCropComplete: (croppedImageUrl: string) => void;
  isOpen: boolean;
  onClose: () => void;
  totalImages?: number;
  currentImage?: number;
}

export function ImageCropper({
  imageUrl,
  aspect,
  onCropComplete,
  isOpen,
  onClose,
  totalImages,
  currentImage,
}: ImageCropperProps) {
  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    width: 90,
    height: aspect ? 90 / aspect : 90,
    x: 5,
    y: 5,
  });
  
  const imageRef = useRef<HTMLImageElement>(null);

  const getCroppedImg = () => {
    if (!imageRef.current) return;

    const canvas = document.createElement('canvas');
    const image = imageRef.current;
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = crop.width * scaleX;
    canvas.height = crop.height * scaleY;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width * scaleX,
      crop.height * scaleY
    );

    const croppedImageUrl = canvas.toDataURL('image/jpeg', 0.9);
    onCropComplete(croppedImageUrl);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Crop Image</span>
            {totalImages && currentImage && (
              <span className="text-sm text-muted-foreground">
                Image {currentImage} of {totalImages}
              </span>
            )}
          </DialogTitle>
        </DialogHeader>
        
        <div className="mt-4">
          {totalImages && currentImage && (
            <div className="mb-4">
              <Progress value={(currentImage / totalImages) * 100} className="h-2" />
              <p className="text-sm text-muted-foreground mt-2 text-center">
                {Math.round((currentImage / totalImages) * 100)}% Complete
              </p>
            </div>
          )}
          
          <div className="bg-muted rounded-lg p-4">
            <ReactCrop
              crop={crop}
              onChange={(c) => setCrop(c)}
              aspect={aspect}
              className="max-h-[60vh] rounded-lg overflow-hidden"
            >
              <img
                ref={imageRef}
                src={imageUrl}
                alt="Crop me"
                className="max-w-full max-h-[60vh] object-contain"
              />
            </ReactCrop>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" onClick={onClose}>
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button onClick={getCroppedImg} className="min-w-[120px]">
            <Check className="w-4 h-4 mr-2" />
            Apply Crop
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}