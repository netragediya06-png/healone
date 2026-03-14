import { Link } from 'react-router-dom';
import { Leaf, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-foreground text-background/80">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Leaf className="h-6 w-6 text-primary" />
              <span className="font-display text-xl font-bold text-background">HealOne</span>
            </div>
            <p className="text-sm leading-relaxed text-background/60 mb-4">
              Your trusted partner in Ayurvedic wellness. We bring ancient wisdom to modern living through natural remedies and holistic health solutions.
            </p>
            <div className="space-y-2 text-sm text-background/50">
              <p className="flex items-center gap-2"><Phone className="h-4 w-4" /> +91 98765 43210</p>
              <p className="flex items-center gap-2"><Mail className="h-4 w-4" /> hello@healone.com</p>
              <p className="flex items-center gap-2"><MapPin className="h-4 w-4" /> New Delhi, India</p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-background mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              {['Home', 'Products', 'Remedies', 'Yoga', 'Blog', 'Dosha Quiz'].map(link => (
                <li key={link}>
                  <Link to={`/${link.toLowerCase().replace(' ', '-')}`} className="text-background/50 hover:text-primary transition-colors">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-display font-semibold text-background mb-4">Categories</h4>
            <ul className="space-y-2 text-sm">
              {['Wellness Juices', 'Herbal Powders', 'Tablets', 'Herbal Oils', 'Skin Care', 'Immunity'].map(cat => (
                <li key={cat}>
                  <Link to={`/products?category=${encodeURIComponent(cat)}`} className="text-background/50 hover:text-primary transition-colors">
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-display font-semibold text-background mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              {[
                { label: 'About Us', path: '/about' },
                { label: 'Contact Us', path: '/contact' },
                { label: 'FAQ', path: '/faq' },
                { label: 'Privacy Policy', path: '/privacy' },
                { label: 'Shipping Policy', path: '/shipping' },
                { label: 'Returns & Refunds', path: '/returns' },
              ].map(link => (
                <li key={link.label}>
                  <Link to={link.path} className="text-background/50 hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-background/10 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-background/40">© 2026 HealOne. All rights reserved.</p>
          <div className="flex items-center gap-4 text-sm text-background/40">
            <span>🌿 100% Natural</span>
            <span>🔬 Lab Tested</span>
            <span>📦 Free Shipping 500+</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
