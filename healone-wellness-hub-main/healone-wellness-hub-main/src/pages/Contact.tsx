import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Contact = () => (
  <div className="min-h-screen">
    <div className="bg-nature py-16">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl lg:text-5xl font-display font-bold">Contact <span className="text-gradient-primary">Us</span></h1>
        <p className="text-muted-foreground mt-4">We'd love to hear from you. Reach out anytime!</p>
      </div>
    </div>
    <div className="container mx-auto px-4 py-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <h2 className="text-2xl font-display font-bold mb-6">Get in Touch</h2>
          <form className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input type="text" placeholder="Your Name" className="px-4 py-3 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
              <input type="email" placeholder="Your Email" className="px-4 py-3 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
            <input type="text" placeholder="Subject" className="w-full px-4 py-3 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
            <textarea placeholder="Your Message" rows={5} className="w-full px-4 py-3 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none" />
            <Button className="gap-2"><Send className="h-4 w-4" /> Send Message</Button>
          </form>
        </div>
        <div className="space-y-6">
          <h2 className="text-2xl font-display font-bold mb-6">Contact Information</h2>
          {[
            { icon: Phone, label: 'Phone', value: '+91 98765 43210' },
            { icon: Mail, label: 'Email', value: 'hello@healone.com' },
            { icon: MapPin, label: 'Address', value: '123 Wellness Street, Green Park, New Delhi, India - 110016' },
          ].map(item => (
            <div key={item.label} className="flex items-start gap-4 p-4 bg-card rounded-xl border">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <item.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">{item.label}</h3>
                <p className="text-sm text-muted-foreground">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default Contact;
