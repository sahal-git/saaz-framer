"use client";

import { Frame, Palette } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[80vh] text-center">
        <div className="flex items-center gap-2 mb-8">
          <Frame className="w-12 h-12 text-primary" />
          <Palette className="w-8 h-8 text-primary animate-bounce" />
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
          SAAZ FRAMER
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-12">
          Create stunning framed images with professional overlays, custom text, and watermarks. 
          Perfect for photographers, artists, and creative professionals.
        </p>

        <Button 
          size="lg" 
          className="text-lg px-8 py-6"
          onClick={() => router.push('/editor')}
        >
          Start Framing
        </Button>
      </div>

      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Our Features</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Frame className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Professional Frames</h3>
            <p className="text-muted-foreground">Create stunning frames for your images with our professional tools</p>
          </div>
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Palette className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Batch Processing</h3>
            <p className="text-muted-foreground">Frame multiple images at once with the same template</p>
          </div>
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Frame className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Easy Export</h3>
            <p className="text-muted-foreground">Download your framed images in high quality JPEG format</p>
          </div>
        </div>
      </div>

      <footer className="bg-muted py-12 mt-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold mb-4">Navigation</h3>
              <ul className="space-y-2">
                <li><a href="/" className="text-muted-foreground hover:text-primary">Home</a></li>
                <li><a href="/editor" className="text-muted-foreground hover:text-primary">Frame</a></li>
                <li><a href="/about" className="text-muted-foreground hover:text-primary">About</a></li>
                <li><a href="/contact" className="text-muted-foreground hover:text-primary">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Connect</h3>
              <ul className="space-y-2">
                <li><a href="https://instagram.com/sa.halk" target="_blank" className="text-muted-foreground hover:text-primary">Instagram</a></li>
                <li><a href="mailto:sahalbuac@gmail.com" className="text-muted-foreground hover:text-primary">Email</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Contribute</h3>
              <ul className="space-y-2">
                <li><a href="mailto:sahalbuac@gmail.com" className="text-muted-foreground hover:text-primary">Join Development</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><span className="text-muted-foreground">© 2024 SAAZ Framer</span></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}