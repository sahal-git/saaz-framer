"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Mail, MessageSquare, Send } from "lucide-react";

export default function Contact() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      message: formData.get('message'),
    };

    // Send email using mailto link
    const subject = encodeURIComponent('SAAZ Framer');
    const body = encodeURIComponent(`
Name: ${data.name}
Email: ${data.email}

Message:
${data.message}
    `);
    window.location.href = `mailto:sahalbuac@gmail.com?subject=${subject}&body=${body}`;
    
    toast.success("Opening your email client...");
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Contact Us</h1>
        <p className="text-lg text-muted-foreground mb-12">
          Have questions or feedback? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
        </p>

        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" placeholder="Your name" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="your@email.com" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                name="message"
                placeholder="Your message..."
                className="min-h-[150px]"
                required
              />
            </div>

            <Button type="submit" className="w-full">
              <Send className="w-4 h-4 mr-2" />
              Send Message
            </Button>
          </form>
        </Card>

        <div className="mt-12 grid sm:grid-cols-2 gap-6">
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <Mail className="w-6 h-6 text-primary" />
              <div>
                <h2 className="font-semibold">Email Us</h2>
                <p className="text-sm text-muted-foreground">sahalbuac@gmail.com</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <a 
              href="https://instagram.com/sa.halk" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-4"
            >
              <MessageSquare className="w-6 h-6 text-primary" />
              <div>
                <h2 className="font-semibold">Live Chat</h2>
                <p className="text-sm text-muted-foreground">Chat on Instagram @sa.halk</p>
              </div>
            </a>
          </Card>
        </div>
      </div>
    </div>
  );
}