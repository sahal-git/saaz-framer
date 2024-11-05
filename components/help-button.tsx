"use client";

import { HelpCircle, Frame, Upload, Crop, Settings, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";

const steps = [
  {
    icon: Frame,
    title: "Upload Frame Template",
    description: "Start by uploading your frame template (PNG with transparent background). This is required before you can process any images."
  },
  {
    icon: Upload,
    title: "Select Images",
    description: "Choose one or multiple images to frame. The app supports batch processing, allowing you to frame multiple images with the same settings."
  },
  {
    icon: Crop,
    title: "Interactive Cropping",
    description: "Use our cropping tool to position each image. The crop area automatically maintains the frame's aspect ratio for perfect alignment."
  },
  {
    icon: Settings,
    title: "Adjust Frame Settings",
    description: "Fine-tune the frame's opacity to achieve the perfect blend between your image and the frame overlay."
  },
  {
    icon: Download,
    title: "Batch Download",
    description: "Download all your framed images at once. Files are automatically named sequentially for easy organization."
  }
];

export function HelpButton() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="fixed bottom-4 right-4 h-12 w-12 rounded-full shadow-lg"
        >
          <HelpCircle className="h-6 w-6" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Quick Guide: SAAZ FRAMER</DialogTitle>
        </DialogHeader>
        <div className="mt-4 space-y-4">
          {steps.map((step, index) => (
            <Card key={index} className="p-4 transition-all hover:shadow-sm">
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <step.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-base">
                    {index + 1}. {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
                </div>
              </div>
            </Card>
          ))}
          
          <div className="pt-4 text-sm text-muted-foreground">
            <p className="font-medium">💡 Pro Tip:</p>
            <p>For best results, use PNG frame templates with transparent backgrounds and a resolution of 2000x2000 pixels.</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}