import { Card } from "@/components/ui/card";
import { Frame, Upload, Crop, Settings, Download, Share, ImageIcon, Palette } from "lucide-react";

const steps = [
  {
    icon: Frame,
    title: "Upload Frame Template",
    description: "Start by uploading your frame template. This will be the overlay applied to all your images.",
    tips: [
      "Use PNG format with transparent background",
      "Recommended resolution: 2000x2000 pixels",
      "Keep file size under 5MB for best performance"
    ]
  },
  {
    icon: Upload,
    title: "Select Images",
    description: "Upload one or multiple images that you want to frame. The app supports batch processing for efficiency.",
    tips: [
      "Supports JPG, PNG, and WebP formats",
      "Upload multiple images at once",
      "No limit on number of images"
    ]
  },
  {
    icon: Crop,
    title: "Interactive Cropping",
    description: "Use our smart cropping tool to perfectly position each image within the frame's aspect ratio.",
    tips: [
      "Maintains frame's aspect ratio",
      "Drag to reposition image",
      "Zoom and pan for precise control",
      "Batch process multiple images sequentially"
    ]
  },
  {
    icon: Settings,
    title: "Customize Frame Settings",
    description: "Fine-tune the frame's appearance using our intuitive controls for the perfect look.",
    tips: [
      "Adjust frame opacity",
      "Real-time preview",
      "Settings apply to all images in batch"
    ]
  },
  {
    icon: Download,
    title: "Download Framed Images",
    description: "Export your beautifully framed images in high quality, ready for use.",
    tips: [
      "High-resolution JPEG output",
      "Batch download all images",
      "Maintains image quality",
      "Automatic sequential naming"
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
            Transform your images with professional frames in just a few simple steps. 
            Our intuitive workflow makes it easy to create stunning framed images for your portfolio.
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

        <div className="grid md:grid-cols-2 gap-6 mt-12">
          <Card className="p-6 bg-primary/5 border-primary/20">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <ImageIcon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-2">Batch Processing</h2>
                <p className="text-muted-foreground">
                  Save time by processing multiple images at once. Upload a batch of images and apply the same frame settings to all of them efficiently.
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-primary/5 border-primary/20">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <Palette className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-2">Need Help?</h2>
                <p className="text-muted-foreground mb-4">
                  Have questions or need assistance? Our support team is here to help you create perfect framed images.
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
    </div>
  );
}