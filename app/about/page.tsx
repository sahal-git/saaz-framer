import { Card } from "@/components/ui/card";
import { Frame, Sparkles, Shield, Zap } from "lucide-react";

export default function About() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">About SAAZ FRAMER</h1>
        <p className="text-lg text-muted-foreground mb-12">
          SAAZ FRAMER is a professional image framing tool designed for photographers, artists, and creative professionals who want to enhance their work with beautiful frames and watermarks.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="p-6">
            <div className="flex flex-col items-center text-center">
              <div className="p-3 rounded-lg bg-primary/10 mb-4">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Professional Quality</h2>
              <p className="text-muted-foreground">
                Create stunning, high-quality framed images that stand out in any portfolio or gallery.
              </p>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex flex-col items-center text-center">
              <div className="p-3 rounded-lg bg-primary/10 mb-4">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Protect Your Work</h2>
              <p className="text-muted-foreground">
                Add custom watermarks to protect your intellectual property while maintaining image quality.
              </p>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex flex-col items-center text-center">
              <div className="p-3 rounded-lg bg-primary/10 mb-4">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Fast & Easy</h2>
              <p className="text-muted-foreground">
                Intuitive interface designed for efficiency, letting you create beautiful frames in minutes.
              </p>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex flex-col items-center text-center">
              <div className="p-3 rounded-lg bg-primary/10 mb-4">
                <Frame className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Custom Frames</h2>
              <p className="text-muted-foreground">
                Use our premium frame collection or upload your own custom frames for unique results.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}