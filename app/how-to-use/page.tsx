import { Card } from "@/components/ui/card";
import { Frame, Upload, Type, Download, Settings, Image as ImageIcon, Crop, Palette, Share } from "lucide-react";

const steps = [
  {
    icon: Upload,
    title: "Upload Your Frame Template",
    description: "Start by uploading your frame template. Use a high-resolution PNG with transparent background for best results.",
    tips: [
      "Use PNG format for transparency",
      "Recommended size: 2000x2000 pixels",
      "Keep file size under 5MB for optimal performance"
    ]
  },
  {
    icon: ImageIcon,
    title: "Select Your Images",
    description: "Choose the photos you want to frame. You can upload multiple images at once for batch processing.",
    tips: [
      "Supports JPG, PNG, and WebP formats",
      "No file size limitation",
      "Maintains original image quality"
    ]
  },
  {
    icon: Crop,
    title: "Crop and Adjust",
    description: "Use our intuitive cropping tool to perfectly position your images within the frame.",
    tips: [
      "Maintains aspect ratio automatically",
      "Drag to reposition the crop area",
      "Preview before applying changes"
    ]
  },
  {
    icon: Settings,
    title: "Customize Frame Settings",
    description: "Fine-tune the frame appearance by adjusting opacity and other parameters to achieve the perfect look.",
    tips: [
      "Adjust frame opacity",
      "Preview changes in real-time",
      "Save settings for future use"
    ]
  },
  {
    icon: Download,
    title: "Export Your Creation",
    description: "Download your framed images in high quality, ready for sharing or printing.",
    tips: [
      "Exports in high-resolution JPEG",
      "Batch download all images",
      "Maintains original image quality"
    ]
  },
  {
    icon: Share,
    title: "Share Your Work",
    description: "Share your beautifully framed images directly on social media or with your clients.",
    tips: [
      "Perfect for Instagram posts",
      "Ideal for client galleries",
      "Professional portfolio presentation"
    ]
  }
];

export default function HowToUse() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-6">How to Use SAAZ FRAMER</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Create professionally framed images in minutes with our easy-to-use tool. 
            Follow these simple steps to get started.
          </p>
        </div>

        <div className="grid gap-8">
          {steps.map((step, index) => (
            <Card key={index} className="p-6 transition-all hover:shadow-lg">
              <div className="flex flex-col md:flex-row md:items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <step.icon className="w-8 h-8 text-primary" />
                  </div>
                </div>
                <div className="flex-grow">
                  <h2 className="text-2xl font-semibold mb-3">
                    {index + 1}. {step.title}
                  </h2>
                  <p className="text-muted-foreground mb-4">{step.description}</p>
                  <div className="bg-muted rounded-lg p-4">
                    <h3 className="font-medium mb-2">Pro Tips:</h3>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      {step.tips.map((tip, tipIndex) => (
                        <li key={tipIndex}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Card className="mt-12 p-6 bg-primary/5 border-primary/20">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-primary/10">
              <Palette className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2">Need Help?</h2>
              <p className="text-muted-foreground mb-4">
                If you need additional assistance or have specific questions, don't hesitate to reach out. 
                We're here to help you create the perfect framed images.
              </p>
              <a 
                href="/contact" 
                className="text-primary hover:text-primary/80 font-medium inline-flex items-center"
              >
                Contact Support
                <span className="ml-2">→</span>
              </a>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}