'use client'

import Link from 'next/link';
import { Mail, MapPin, Phone, Instagram, Twitter, Linkedin, Facebook, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-background to-muted mt-20 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-gradient-to-br from-primary to-secondary rounded-lg">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                SafeGuard
              </span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Your trusted emergency safety companion for peace of mind and protection.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
            <div className="flex flex-col gap-2">
              <Link href="/" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                Home
              </Link>
              <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                About Us
              </Link>
              <Link href="/emergency-contacts" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                Emergency Contacts
              </Link>
              <Link href="/support" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                Support
              </Link>
            </div>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Resources</h3>
            <div className="flex flex-col gap-2">
              <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                Contact Us
              </Link>
              <a href="#privacy" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                Privacy Policy
              </a>
              <a href="#terms" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                Terms of Service
              </a>
              <a href="#faq" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                FAQ
              </a>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Contact</h3>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Phone size={16} className="text-primary flex-shrink-0" />
                <span>Emergency: 112 / Police: 100</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Mail size={16} className="text-primary flex-shrink-0" />
                <span>support@safeguard.app</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <MapPin size={16} className="text-primary flex-shrink-0" />
                <span>Available Across India</span>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border my-8"></div>

        {/* Social & Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">
            © 2024 SafeGuard. All rights reserved.
          </p>
          
          <div className="flex items-center gap-4">
            <p className="text-muted-foreground text-sm">Follow us:</p>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-muted hover:bg-primary hover:text-white text-foreground transition-all duration-300"
              title="Instagram"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-muted hover:bg-primary hover:text-white text-foreground transition-all duration-300"
              title="Twitter"
            >
              <Twitter className="w-5 h-5" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-muted hover:bg-primary hover:text-white text-foreground transition-all duration-300"
              title="LinkedIn"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-muted hover:bg-primary hover:text-white text-foreground transition-all duration-300"
              title="Facebook"
            >
              <Facebook className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
