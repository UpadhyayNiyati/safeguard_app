import Footer from '@/components/footer';
import Link from 'next/link';
import { CheckCircle, Target, Heart } from 'lucide-react';

export default function About() {
  return (
    <main className="min-h-screen flex flex-col bg-background">

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            About SafeGuard
          </h1>
          <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
            Empowering people with instant access to emergency services and peace of mind
          </p>
        </div>
      </section>

      {/* Our Mission */}
      <section className="py-16 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6 text-foreground">Our Mission</h2>
              <p className="text-lg text-foreground/70 mb-6 leading-relaxed">
                At SafeGuard, we believe that everyone deserves quick and easy access to emergency services. Our mission is to reduce response times and save lives by providing real-time emergency service locator and communication tools.
              </p>
              <p className="text-lg text-foreground/70 leading-relaxed">
                We're committed to building technology that empowers people to stay safe and connected during critical moments when every second counts.
              </p>
            </div>
            <div className="relative h-64 md:h-96 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl flex items-center justify-center">
              <div className="text-6xl">🛡️</div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 bg-gradient-to-b from-card to-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-12 text-center bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Our Core Values
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Safety First */}
            <div className="p-8 bg-background rounded-xl border border-border hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Heart size={32} className="text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-foreground">Safety First</h3>
              <p className="text-foreground/70">
                Your safety and well-being are our top priority. Every feature is designed with you in mind.
              </p>
            </div>

            {/* Reliability */}
            <div className="p-8 bg-background rounded-xl border border-border hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                <CheckCircle size={32} className="text-secondary" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-foreground">Reliability</h3>
              <p className="text-foreground/70">
                You can count on us when it matters most. We maintain the highest standards of service quality.
              </p>
            </div>

            {/* Accessibility */}
            <div className="p-8 bg-background rounded-xl border border-border hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                <Target size={32} className="text-accent" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-foreground">Accessibility</h3>
              <p className="text-foreground/70">
                Easy to use, available to everyone, designed to work in any emergency situation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Features */}
      <section className="py-16 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-12 text-center bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Key Features
          </h2>
          
          <div className="space-y-6">
            <div className="flex gap-4 p-6 bg-card rounded-lg border border-border hover:border-primary/50 transition-colors">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary/10">
                  <CheckCircle className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground mb-1">Real-Time GPS Location</h3>
                <p className="text-foreground/70">Accurately locate your position and find nearby emergency services in seconds</p>
              </div>
            </div>

            <div className="flex gap-4 p-6 bg-card rounded-lg border border-border hover:border-primary/50 transition-colors">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-secondary/10">
                  <CheckCircle className="h-6 w-6 text-secondary" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground mb-1">Multiple Service Types</h3>
                <p className="text-foreground/70">Find police stations, hospitals, fire departments, and other emergency services</p>
              </div>
            </div>

            <div className="flex gap-4 p-6 bg-card rounded-lg border border-border hover:border-primary/50 transition-colors">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-accent/10">
                  <CheckCircle className="h-6 w-6 text-accent" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground mb-1">Emergency Contact Management</h3>
                <p className="text-foreground/70">Save and quickly contact your loved ones during emergencies</p>
              </div>
            </div>

            <div className="flex gap-4 p-6 bg-card rounded-lg border border-border hover:border-primary/50 transition-colors">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-destructive/10">
                  <CheckCircle className="h-6 w-6 text-destructive" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground mb-1">One-Click Emergency Calling</h3>
                <p className="text-foreground/70">Instantly call emergency services or saved contacts with a single tap</p>
              </div>
            </div>

            <div className="flex gap-4 p-6 bg-card rounded-lg border border-border hover:border-primary/50 transition-colors">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary/10">
                  <CheckCircle className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground mb-1">Offline Support</h3>
                <p className="text-foreground/70">Call emergency services even without internet connection</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Important Notice */}
      <section className="py-12 bg-destructive/10 border-y border-destructive/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-4">
            <div className="flex-shrink-0 text-3xl">⚠️</div>
            <div>
              <h3 className="font-bold text-destructive mb-2">Important Disclaimer</h3>
              <p className="text-destructive/80">
                SafeGuard is a supplemental tool designed to assist in finding emergency services. In life-threatening situations, always call your local emergency number (911 in the US, 112 in Europe, or your country's equivalent) immediately. This app should not be relied upon as your sole means of emergency communication.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* <Footer /> */}
    </main>
  );
}
