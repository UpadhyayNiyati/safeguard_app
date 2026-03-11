'use client';

import { useState } from 'react';
import Footer from '@/components/footer';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production, this would send to a backend API
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <main className="min-h-screen flex flex-col bg-background">

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Get In Touch
          </h1>
          <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
            Have questions? We're here to help. Contact us anytime.
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16 bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {/* Email */}
            <div className="p-8 bg-card rounded-xl border border-border hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Mail size={32} className="text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-foreground">Email</h3>
              <p className="text-foreground/70 mb-4">
                Send us an email and we'll respond as soon as possible
              </p>
              <a
                href="mailto:support@safeguard.app"
                className="text-primary font-semibold hover:text-primary/80 transition-colors"
              >
                support@safeguard.app
              </a>
            </div>

            {/* Phone */}
            <div className="p-8 bg-card rounded-xl border border-border hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                <Phone size={32} className="text-secondary" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-foreground">Phone</h3>
              <p className="text-foreground/70 mb-4">
                Call us during business hours Monday to Friday
              </p>
              <a
                href="tel:1-800-SAFEGUARD"
                className="text-primary font-semibold hover:text-primary/80 transition-colors"
              >
                1-800-SAFEGUARD
              </a>
            </div>

            {/* Location */}
            <div className="p-8 bg-card rounded-xl border border-border hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                <MapPin size={32} className="text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-foreground">Office</h3>
              <p className="text-foreground/70 mb-4">
                Visit us at our headquarters
              </p>
              <p className="text-primary font-semibold">
                Available Nationwide
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-16 bg-gradient-to-b from-card to-background flex-1">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-4 text-center bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Send us a Message
          </h2>
          <p className="text-center text-foreground/70 mb-8">
            Fill out the form below and we'll get back to you as soon as possible
          </p>

          {submitted && (
            <div className="mb-8 p-4 bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-600 text-green-700 dark:text-green-100 rounded-lg text-center font-semibold">
              Thank you for your message! We'll be in touch soon.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 p-8 bg-background rounded-xl border border-border">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                required
                className="w-full px-4 py-3 rounded-lg border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                className="w-full px-4 py-3 rounded-lg border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Subject
              </label>
              <select
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select a subject</option>
                <option value="general">General Inquiry</option>
                <option value="support">Technical Support</option>
                <option value="feedback">Feedback</option>
                <option value="partnership">Partnership</option>
                <option value="bug">Report a Bug</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Message
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us what's on your mind"
                rows={6}
                required
                className="w-full px-4 py-3 rounded-lg border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              <Send size={20} />
              Send Message
            </button>
          </form>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-12 text-center bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Response Time
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 bg-card rounded-lg border border-border">
              <h3 className="text-lg font-bold text-foreground mb-2">General Inquiries</h3>
              <p className="text-foreground/70">24-48 hours</p>
            </div>
            <div className="p-6 bg-card rounded-lg border border-border">
              <h3 className="text-lg font-bold text-foreground mb-2">Technical Support</h3>
              <p className="text-foreground/70">4-8 hours</p>
            </div>
            <div className="p-6 bg-card rounded-lg border border-border">
              <h3 className="text-lg font-bold text-foreground mb-2">Bug Reports</h3>
              <p className="text-foreground/70">2-4 hours</p>
            </div>
            <div className="p-6 bg-card rounded-lg border border-border">
              <h3 className="text-lg font-bold text-foreground mb-2">Emergency Issues</h3>
              <p className="text-foreground/70">Call us immediately at 1-800-SAFEGUARD</p>
            </div>
          </div>
        </div>
      </section>

      {/* <Footer /> */}
    </main>
  );
}
