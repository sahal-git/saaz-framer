"use client";

import { HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Frame, Upload, Type, Download, Settings } from "lucide-react";

const steps = [
  {
    icon: Upload,
    title: "Upload Your Image",
    description: "Start by uploading the image you want to frame. We support most common image formats including JPG, PNG, and WebP."
  },
  {
    icon: Frame,
    title: "Choose Your Frame",
    description: "Select from our collection of frames or upload your own custom frame overlay to perfectly complement your image."
  },
  {
    icon: Settings,
    title: "Customize",
    description: "Adjust frame position, scale, and opacity. Add custom watermarks and fine-tune every aspect of your composition."
  },
  {
    icon: Type,
    title: "Add Watermark",
    description: "Protect your work by adding a custom watermark. Control its position, size, and rotation to match your style."
  },
  {
    icon: Download,
    title: "Download",
    description: "Once satisfied with your creation, download the final image in high quality, ready for sharing or printing."
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
          <DialogTitle className="text-2xl font-bold">How to Use SAAZ FRAMER</DialogTitle>
        </DialogHeader>
        <div className="mt-4 space-y-6">
          {steps.map((step, index) => (
            <Card key={index} className="p-4">
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <step.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">
                    {index + 1}. {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}