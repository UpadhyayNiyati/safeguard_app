'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-lg hover:opacity-80 transition">
            <div className="p-1.5 bg-gradient-to-br from-primary to-secondary rounded-lg">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              SafeGuard
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            <Link href="/">
              <Button variant="ghost" size="sm">Home</Button>
            </Link>
            <Link href="/about">
              <Button variant="ghost" size="sm">About</Button>
            </Link>
            <Link href="/emergency-contacts">
              <Button variant="ghost" size="sm">Contacts</Button>
            </Link>
            <Link href="/support">
              <Button variant="ghost" size="sm">Support</Button>
            </Link>
            <Link href="/contact">
              <Button variant="ghost" size="sm">Contact Us</Button>
            </Link>
            <div className="ml-2 border-l border-border pl-2">
              <Link href="/emergency-contacts">
                <Button className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white" onClick={() => setIsOpen(false)}>
                  Get Started
                </Button>
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 hover:bg-muted rounded-lg transition"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden border-t border-border bg-card/80 backdrop-blur">
            <div className="flex flex-col p-4 gap-2">
              <Link href="/" onClick={() => setIsOpen(false)}>
                <Button variant="ghost" className="w-full justify-start">Home</Button>
              </Link>
              <Link href="/about" onClick={() => setIsOpen(false)}>
                <Button variant="ghost" className="w-full justify-start">About</Button>
              </Link>
              <Link href="/emergency-contacts" onClick={() => setIsOpen(false)}>
                <Button variant="ghost" className="w-full justify-start">Contacts</Button>
              </Link>
              <Link href="/support" onClick={() => setIsOpen(false)}>
                <Button variant="ghost" className="w-full justify-start">Support</Button>
              </Link>
              <Link href="/contact" onClick={() => setIsOpen(false)}>
                <Button variant="ghost" className="w-full justify-start">Contact Us</Button>
              </Link>
              <Link href="/emergency-contacts" onClick={() => setIsOpen(false)}>
                <Button className="w-full bg-gradient-to-r from-primary to-secondary text-white">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
