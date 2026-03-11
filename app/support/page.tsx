'use client';

import { useState } from 'react';
import Footer from '@/components/footer';
import { ChevronDown, Mail, Phone, MessageSquare } from 'lucide-react';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

const faqItems: FAQItem[] = [
  {
    id: 1,
    question: 'How do I add emergency contacts?',
    answer:
      'Navigate to the Emergency Contacts page, click "Add Emergency Contact", and fill in the contact information including name, relationship, and phone number. Your contacts will be saved securely on your device.',
  },
  {
    id: 2,
    question: 'Is my location data private and secure?',
    answer:
      'Yes, your location data is only accessed when you request it and is used solely for finding nearby emergency services. We do not store or share your location without your explicit consent.',
  },
  {
    id: 3,
    question: 'How accurate is the emergency services location feature?',
    answer:
      'Our location feature uses your device\'s GPS and map data to provide real-time locations of nearby services. Accuracy typically ranges from 5-50 meters depending on your device and signal strength.',
  },
  {
    id: 4,
    question: 'Can I call emergency services directly from the app?',
    answer:
      'Yes! The app provides quick-dial buttons to contact emergency services. Simply tap the emergency alert button or the phone number associated with any service to call immediately.',
  },
  {
    id: 5,
    question: 'Does the app work offline?',
    answer:
      'Basic features like calling emergency numbers and accessing saved contacts work offline. However, map functionality and finding nearby services require an internet connection.',
  },
  {
    id: 6,
    question: 'What if I forget to save an emergency contact?',
    answer:
      'You can add contacts anytime by going to the Emergency Contacts page. We recommend adding important contacts immediately for quick access during emergencies.',
  },
  {
    id: 7,
    question: 'How do I delete a contact?',
    answer:
      'Go to Emergency Contacts, find the contact you want to delete, and click the "Delete" button. You\'ll be asked to confirm the deletion to prevent accidental removals.',
  },
  {
    id: 8,
    question: 'Is this app a replacement for calling emergency services?',
    answer:
      'No, this app is a supplemental tool only. In life-threatening situations, always call official emergency services (911, 112, or your local emergency number) immediately.',
  },
];

export default function Support() {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <main className="min-h-screen flex flex-col bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent text-center">
            Support & Help
          </h1>
          <p className="text-xl text-center text-foreground/70 max-w-2xl mx-auto">
            Find answers to common questions and get help using SafeGuard
          </p>
        </div>
      </section>

      {/* Support Options */}
      <section className="py-16 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-12 text-center text-foreground">How Can We Help?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {/* Email Support */}
            <div className="p-8 bg-card rounded-xl border border-border hover:shadow-lg transition-shadow text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Mail size={32} className="text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-foreground">Email Support</h3>
              <p className="text-foreground/70 mb-4">
                Get in touch with our support team via email
              </p>
              <a
                href="mailto:support@safeguard.app"
                className="text-primary font-semibold hover:text-primary/80 transition-colors"
              >
                support@safeguard.app
              </a>
            </div>

            {/* Phone Support */}
            <div className="p-8 bg-card rounded-xl border border-border hover:shadow-lg transition-shadow text-center">
              <div className="w-16 h-16 bg-secondary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Phone size={32} className="text-secondary" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-foreground">Phone Support</h3>
              <p className="text-foreground/70 mb-4">
                Call our support team during business hours
              </p>
              <a
                href="tel:1-800-SAFEGUARD"
                className="text-primary font-semibold hover:text-primary/80 transition-colors"
              >
                1-800-SAFEGUARD
              </a>
            </div>

            {/* Live Chat */}
            <div className="p-8 bg-card rounded-xl border border-border hover:shadow-lg transition-shadow text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <MessageSquare size={32} className="text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-foreground">Live Chat</h3>
              <p className="text-foreground/70 mb-4">
                Chat with our support team in real-time
              </p>
              <button className="text-primary font-semibold hover:text-primary/80 transition-colors">
                Start Chat
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gradient-to-b from-card to-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-4 text-center bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Frequently Asked Questions
          </h2>
          <p className="text-center text-foreground/70 mb-12">
            Quick answers to help you get the most out of SafeGuard
          </p>

          <div className="space-y-4">
            {faqItems.map((item) => (
              <div
                key={item.id}
                className="border border-border rounded-lg overflow-hidden hover:border-primary/50 transition-colors"
              >
                <button
                  onClick={() => toggleExpand(item.id)}
                  className="w-full px-6 py-4 bg-card hover:bg-card/80 transition-colors flex items-center justify-between"
                >
                  <h3 className="text-left font-semibold text-foreground">{item.question}</h3>
                  <ChevronDown
                    size={24}
                    className={`text-primary flex-shrink-0 transition-transform ${
                      expandedId === item.id ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                
                {expandedId === item.id && (
                  <div className="px-6 py-4 bg-background border-t border-border">
                    <p className="text-foreground/70 leading-relaxed">{item.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-16 bg-background">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8 text-center text-foreground">
            Didn't Find Your Answer?
          </h2>

          <form onSubmit={(e) => { e.preventDefault(); alert('Thank you for your message!'); }} className="space-y-6 p-8 bg-card rounded-xl border border-border">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Your Name
              </label>
              <input
                type="text"
                placeholder="Enter your name"
                required
                className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Email Address
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                required
                className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Subject
              </label>
              <input
                type="text"
                placeholder="What is this about?"
                required
                className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Message
              </label>
              <textarea
                placeholder="Describe your issue or question"
                rows={5}
                required
                className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
            >
              Send Message
            </button>
          </form>
        </div>
      </section>

      {/* Important Info Banner */}
      <section className="py-12 bg-destructive/10 border-y border-destructive/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-4">
            <div className="flex-shrink-0 text-3xl">⚠️</div>
            <div>
              <h3 className="font-bold text-destructive mb-2">Emergency Disclaimer</h3>
              <p className="text-destructive/80">
                This app is a supplemental tool only. In life-threatening situations or true emergencies, always call official emergency services (911, 112, or your local emergency number) immediately. Do not rely solely on this app for emergency assistance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* <Footer /> */}
    </main>
  );
}
