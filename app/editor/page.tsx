"use client";

import { useState, useRef, useEffect } from "react";
import { Upload, Image as ImageIcon, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { ImageCropper } from "@/components/image-cropper";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function Editor() {
  const [frame, setFrame] = useState<string | null>(null);
  const [frameAspect, setFrameAspect] = useState<number>(1);
  const [images, setImages] = useState<string[]>([]);
  const [pendingImages, setPendingImages] = useState<string[]>([]);
  const [frameOpacity, setFrameOpacity] = useState([0.8]);
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (frame) {
      const img = new Image();
      img.onload = () => {
        setFrameAspect(img.width / img.height);
      };
      img.src = frame;
    }
  }, [frame]);

  const handleFrameUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setFrame(event.target?.result as string);
      toast.success("Frame uploaded successfully");
    };
    reader.readAsDataURL(file);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;

    const newPendingImages: string[] = [];
    Array.from(files).forEach(file => {
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} is not an image file`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        newPendingImages.push(event.target?.result as string);
        if (newPendingImages.length === files.length) {
          setPendingImages(newPendingImages);
          setCurrentImageIndex(0);
          setIsCropperOpen(true);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleCropComplete = (croppedImageUrl: string) => {
    setImages(prev => [...prev, croppedImageUrl]);
    
    if (currentImageIndex < pendingImages.length - 1) {
      setCurrentImageIndex(prev => prev + 1);
    } else {
      setPendingImages([]);
      setCurrentImageIndex(0);
      setIsCropperOpen(false);
      toast.success("All images processed successfully");
    }
  };

  const processImage = async (imageUrl: string): Promise<string> => {
    if (!frame) return imageUrl;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return imageUrl;

    const baseImage = new Image();
    const frameImage = new Image();

    try {
      await new Promise((resolve, reject) => {
        baseImage.onload = resolve;
        baseImage.onerror = reject;
        baseImage.src = imageUrl;
      });

      await new Promise((resolve, reject) => {
        frameImage.onload = resolve;
        frameImage.onerror = reject;
        frameImage.src = frame;
      });

      const maxSize = 2000;
      let width, height;
      
      if (frameAspect > 1) {
        width = maxSize;
        height = maxSize / frameAspect;
      } else {
        height = maxSize;
        width = maxSize * frameAspect;
      }

      canvas.width = width;
      canvas.height = height;

      const scale = Math.max(width / baseImage.width, height / baseImage.height);
      const x = (width - baseImage.width * scale) / 2;
      const y = (height - baseImage.height * scale) / 2;

      ctx.drawImage(baseImage, x, y, baseImage.width * scale, baseImage.height * scale);
      ctx.globalAlpha = frameOpacity[0];
      ctx.drawImage(frameImage, 0, 0, width, height);

      return canvas.toDataURL('image/jpeg', 0.9);
    } catch (error) {
      console.error('Error processing image:', error);
      return imageUrl;
    }
  };

  const downloadAllImages = async () => {
    if (!frame || images.length === 0) return;
    setIsProcessing(true);
    toast.info("Processing images...");

    try {
      for (let i = 0; i < images.length; i++) {
        const processedImage = await processImage(images[i]);
        const link = document.createElement('a');
        link.download = `framed-image-${i + 1}.jpg`;
        link.href = processedImage;
        link.click();
        await new Promise(resolve => setTimeout(resolve, 500)); // Delay between downloads
      }
      toast.success(`${images.length} images downloaded successfully`);
    } catch (error) {
      toast.error("Error processing images");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">Frame Your Images</h1>
        
        {!frame ? (
          <Card className="p-12 text-center border-2 border-dashed border-primary/20 hover:border-primary/40 transition-colors">
            <div className="mb-8">
              <Upload className="w-16 h-16 mx-auto mb-6 text-primary animate-bounce" />
              <h2 className="text-2xl font-semibold mb-3">Upload Frame Template</h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Start by uploading your frame template. We recommend using a high-resolution image with transparent background.
              </p>
            </div>
            <Input
              type="file"
              accept="image/*"
              onChange={handleFrameUpload}
              className="max-w-sm mx-auto"
            />
          </Card>
        ) : (
          <>
            <Card className="p-8 mb-8 bg-gradient-to-br from-background to-muted">
              <div className="space-y-6">
                <div>
                  <Label className="text-lg mb-2">Frame Opacity</Label>
                  <Slider
                    value={frameOpacity}
                    onValueChange={setFrameOpacity}
                    min={0}
                    max={1}
                    step={0.1}
                    className="mt-3"
                  />
                </div>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="lg" className="w-full">
                      <Upload className="w-5 h-5 mr-2" />
                      Upload Images to Frame
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Select Images</DialogTitle>
                    </DialogHeader>
                    <Input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="mt-4"
                    />
                  </DialogContent>
                </Dialog>
              </div>
            </Card>

            {images.length > 0 && (
              <Card className="p-8 bg-gradient-to-br from-background to-muted">
                <h2 className="text-2xl font-semibold mb-6">Preview</h2>
                <div 
                  ref={previewRef}
                  className="relative rounded-lg overflow-hidden mb-6 bg-background/50"
                  style={{ aspectRatio: frameAspect }}
                >
                  <img
                    src={images[images.length - 1]}
                    alt="Preview"
                    className="absolute inset-0 w-full h-full object-contain"
                  />
                  <img
                    src={frame}
                    alt="Frame"
                    className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                    style={{ opacity: frameOpacity[0] }}
                  />
                </div>
                <Button 
                  size="lg"
                  onClick={downloadAllImages}
                  disabled={isProcessing}
                  className="w-full bg-primary hover:bg-primary/90"
                >
                  <Download className="w-5 h-5 mr-2" />
                  {isProcessing ? 'Processing...' : `Download ${images.length} Image${images.length > 1 ? 's' : ''}`}
                </Button>
              </Card>
            )}
          </>
        )}
      </div>

      {pendingImages.length > 0 && (
        <ImageCropper
          imageUrl={pendingImages[currentImageIndex]}
          aspect={frameAspect}
          onCropComplete={handleCropComplete}
          isOpen={isCropperOpen}
          onClose={() => {
            setIsCropperOpen(false);
            setPendingImages([]);
            setCurrentImageIndex(0);
          }}
          totalImages={pendingImages.length}
          currentImage={currentImageIndex + 1}
        />
      )}
    </div>
  );
}