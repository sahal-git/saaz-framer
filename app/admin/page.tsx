"use client";

import { useState } from "react";
import { Upload, Settings, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";

export default function Admin() {
  const [frameImage, setFrameImage] = useState<string | null>(null);
  const [opacity, setOpacity] = useState([0.8]);
  const [scale, setScale] = useState([1]);

  const handleFrameUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setFrameImage(event.target?.result as string);
      toast.success("Frame uploaded successfully");
    };
    reader.readAsDataURL(file);
  };

  const saveSettings = () => {
    // Save settings to localStorage
    const settings = {
      frameImage,
      opacity: opacity[0],
      scale: scale[0],
    };
    localStorage.setItem("saazFramerSettings", JSON.stringify(settings));
    toast.success("Settings saved successfully");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Admin Settings</h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Column - Settings */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Frame Settings</h2>
            
            <div className="space-y-6">
              <div>
                <Label htmlFor="frameUpload">Default Frame Image</Label>
                <Input
                  id="frameUpload"
                  type="file"
                  accept="image/*"
                  onChange={handleFrameUpload}
                  className="mt-2"
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <div>
                  <Label>Frame Opacity</Label>
                  <Slider
                    value={opacity}
                    onValueChange={setOpacity}
                    min={0}
                    max={1}
                    step={0.1}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label>Frame Scale</Label>
                  <Slider
                    value={scale}
                    onValueChange={setScale}
                    min={0.5}
                    max={2}
                    step={0.1}
                    className="mt-2"
                  />
                </div>
              </div>

              <Button onClick={saveSettings} className="w-full">
                <Save className="w-4 h-4 mr-2" />
                Save Settings
              </Button>
            </div>
          </Card>

          {/* Right Column - Preview */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Frame Preview</h2>
            
            <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
              {!frameImage ? (
                <div className="text-center p-8">
                  <Settings className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    Upload a frame to see preview
                  </p>
                </div>
              ) : (
                <div className="relative w-full h-full">
                  <img
                    src={frameImage}
                    alt="Frame Preview"
                    className="absolute inset-0 w-full h-full object-contain"
                    style={{
                      opacity: opacity[0],
                      transform: `scale(${scale[0]})`,
                    }}
                  />
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}