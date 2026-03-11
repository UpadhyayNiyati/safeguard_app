'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import MapComponent from '@/components/map-component';
import { 
  AlertCircle, MapPin, Phone, Clock, Heart, Navigation, Loader, ShieldAlert, Zap, Brain, 
  ExternalLink, CheckCircle, MapPinOff 
} from 'lucide-react';
import { Button } from '@/components/ui/button';

// --- Interfaces for TypeScript Type Safety ---
interface EmergencyContact {
  name: string;
  phone: string;
  relation?: string;
}

interface ServiceDetails {
  name: string;
  distance: number;
  phone: string;
  address: string;
  lat: number;
  lon: number;
  directions_url: string;
}

interface NearbyServicesState {
  [key: string]: ServiceDetails;
}

interface AiAnalysisResult {
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  recommendation: string;
  services_needed: string[];
}

const INDIA_EMERGENCY_NUMBERS = {
  police: '100',
  ambulance: '102',
  fire: '101',
  all: '112'
};

export default function Home() {
  // --- State with Proper Typing ---
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [nearbyServices, setNearbyServices] = useState<NearbyServicesState>({});
  const [searching, setSearching] = useState(false);
  const [selectedService, setSelectedService] = useState<string>('');
  const [aiAnalysis, setAiAnalysis] = useState<AiAnalysisResult | null>(null);
  const [showAiInput, setShowAiInput] = useState(false);
  const [aiDescription, setAiDescription] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [mapHtml, setMapHtml] = useState<string>('');
  const [showMap, setShowMap] = useState(false);
  const [expandedService, setExpandedService] = useState<string | null>(null);

  useEffect(() => {
    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setLoading(false);
        },
        (error) => {
          console.log('Location error:', error);
          // Default to India - New Delhi
          setUserLocation({ lat: 28.6139, lng: 77.2090 });
          setLoading(false);
        }
      );
    }

    // Load emergency contacts from localStorage
    const saved = localStorage.getItem('emergencyContacts');
    if (saved) {
      try {
        setEmergencyContacts(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse contacts", e);
      }
    }
  }, []);

  const findNearestService = async (serviceType: string) => {
    if (!userLocation) {
      alert('Please enable location services to find nearby services');
      return;
    }
    
    setSearching(true);
    setSelectedService(serviceType);
    setExpandedService(serviceType);
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/find-nearby`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lat: userLocation.lat,
          lon: userLocation.lng,
          type: serviceType === 'fire' ? 'fire_station' : serviceType
        }),
        credentials: 'include'
      });

      const data = await response.json();

      if (response.ok) {
        // Fix: Explicitly typing 'prev' in the state setter
        setNearbyServices((prev: NearbyServicesState) => ({
          ...prev,
          [serviceType]: {
            name: data.name,
            distance: data.distance,
            phone: data.phone,
            address: data.address,
            lat: data.lat,
            lon: data.lon,
            directions_url: data.directions_url
          }
        }));
        setMapHtml(data.map_html || '');
        setShowMap(true);
      } else {
        // Fallback if backend not running
        const mockServices: Record<string, Partial<ServiceDetails>> = {
          police: { name: 'Nearby Police Station', distance: 2.5, phone: '100', address: 'City Center, Your City', lat: userLocation.lat + 0.01, lon: userLocation.lng + 0.01 },
          hospital: { name: 'General Hospital', distance: 1.8, phone: '102', address: 'Medical District, Your City', lat: userLocation.lat - 0.02, lon: userLocation.lng + 0.02 },
          fire: { name: 'Fire Department', distance: 3.2, phone: '101', address: 'Industrial Area, Your City', lat: userLocation.lat + 0.02, lon: userLocation.lng - 0.01 }
        };
        
        const selected = mockServices[serviceType];
        if (selected) {
          setNearbyServices((prev: NearbyServicesState) => ({
            ...prev,
            [serviceType]: {
              ...(selected as ServiceDetails),
              directions_url: `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${selected.lat},${selected.lon}`
            }
          }));
          setShowMap(true);
        }
      }
    } catch (error) {
      console.error('Error finding services:', error);
      const mockServices: Record<string, Partial<ServiceDetails>> = {
        police: { name: 'Nearest Police Station', distance: 2.5, phone: '100', address: 'Your City Center', lat: userLocation.lat + 0.01, lon: userLocation.lng + 0.01 },
        hospital: { name: 'City Hospital', distance: 1.8, phone: '102', address: 'Medical Area', lat: userLocation.lat - 0.02, lon: userLocation.lng + 0.02 },
        fire: { name: 'Fire Station', distance: 3.2, phone: '101', address: 'Fire Station Area', lat: userLocation.lat + 0.02, lon: userLocation.lng - 0.01 }
      };
      
      const selected = mockServices[serviceType];
      if (selected && userLocation) {
        setNearbyServices((prev: NearbyServicesState) => ({
          ...prev,
          [serviceType]: {
            ...(selected as ServiceDetails),
            directions_url: `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${selected.lat},${selected.lon}`
          }
        }));
        setShowMap(true);
      }
    } finally {
      setSearching(false);
    }
  };

  const handleAiAnalysis = async () => {
    if (!aiDescription.trim()) {
      alert('Please describe the emergency situation');
      return;
    }

    setAiLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/ai-alert`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: aiDescription,
          location: userLocation || { lat: 28.6139, lng: 77.2090 },
          contacts: emergencyContacts
        }),
        credentials: 'include'
      });

      const data = await response.json();
      setAiAnalysis(data);
    } catch (error) {
      console.error('AI Analysis Error:', error);
      const description = aiDescription.toLowerCase();
      let severity: AiAnalysisResult['severity'] = 'MEDIUM';
      let services = ['hospital'];
      
      if (description.includes('unconscious') || description.includes('bleeding') || description.includes('fire')) {
        severity = 'CRITICAL';
        services = ['hospital', 'police', 'fire'];
      } else if (description.includes('injury') || description.includes('accident')) {
        severity = 'HIGH';
        services = ['hospital', 'police'];
      }
      
      setAiAnalysis({
        severity,
        recommendation: severity === 'CRITICAL' ? 'CALL 112 IMMEDIATELY!' : 'Contact emergency services',
        services_needed: services
      });
    } finally {
      setAiLoading(false);
    }
  };

  const callEmergency = (number: string) => {
    window.location.href = `tel:${number}`;
  };

  return (
    <main className="min-h-screen flex flex-col bg-background">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/10 pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent leading-tight">
                Safety at Every Step
              </h1>
              <p className="text-lg text-foreground/70 mb-8 leading-relaxed">
                Access emergency services instantly, locate nearby hospitals, police stations, and fire departments. Keep your loved ones safe with AI-powered emergency response.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => callEmergency(INDIA_EMERGENCY_NUMBERS.all)}
                  className="px-8 py-3 bg-gradient-to-r from-destructive to-orange-500 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                >
                  <AlertCircle size={20} />
                  Emergency Call ({INDIA_EMERGENCY_NUMBERS.all})
                </button>
                <Link
                  href="/emergency-contacts"
                  className="px-8 py-3 border-2 border-primary text-primary font-semibold rounded-lg hover:bg-primary/5 transition-colors text-center"
                >
                  My Contacts
                </Link>
              </div>
            </div>
            <div className="relative h-64 md:h-96 rounded-xl overflow-hidden shadow-2xl">
              {!loading && userLocation ? (
                <MapComponent location={userLocation} />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <div className="text-center">
                    <Clock className="mx-auto mb-2 text-muted-foreground animate-spin" size={32} />
                    <p className="text-muted-foreground">Loading map...</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Quick Emergency Numbers */}
      <section className="py-8 bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-xl font-bold mb-6 text-center text-foreground">Quick Emergency Numbers (India)</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Police', number: INDIA_EMERGENCY_NUMBERS.police, color: 'from-blue-600 to-blue-700' },
              { name: 'Ambulance', number: INDIA_EMERGENCY_NUMBERS.ambulance, color: 'from-red-600 to-red-700' },
              { name: 'Fire', number: INDIA_EMERGENCY_NUMBERS.fire, color: 'from-orange-600 to-orange-700' },
              { name: 'All Services', number: INDIA_EMERGENCY_NUMBERS.all, color: 'from-primary to-secondary' }
            ].map((service) => (
              <button
                key={service.number}
                onClick={() => callEmergency(service.number)}
                className={`p-4 bg-gradient-to-br ${service.color} text-white rounded-lg hover:shadow-lg transition-all hover:scale-105`}
              >
                <div className="text-2xl font-bold">{service.number}</div>
                <div className="text-sm">{service.name}</div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* AI Smart Alert Section */}
      <section className="py-12 bg-gradient-to-r from-secondary/10 to-primary/10 border-b border-primary/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-start gap-4">
            <Brain className="w-8 h-8 text-secondary flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-foreground mb-2 flex items-center gap-2">
                <Zap size={24} />
                AI-Powered Emergency Analysis
              </h2>
              <p className="text-foreground/70 mb-4">Describe your emergency and let AI analyze the severity and recommend actions.</p>
              {!showAiInput ? (
                <Button
                  onClick={() => setShowAiInput(true)}
                  className="bg-secondary hover:bg-secondary/90 text-white"
                >
                  Describe Your Emergency
                </Button>
              ) : (
                <div className="space-y-3 mt-3">
                  <textarea
                    value={aiDescription}
                    onChange={(e) => setAiDescription(e.target.value)}
                    placeholder="Describe what's happening... (e.g., 'Person injured in car accident', 'Fire in building', 'Medical emergency')"
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-secondary"
                    rows={3}
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={handleAiAnalysis}
                      disabled={aiLoading}
                      className="bg-secondary hover:bg-secondary/90 text-white disabled:opacity-50"
                    >
                      {aiLoading ? <Loader className="animate-spin mr-2" size={16} /> : <Brain size={16} className="mr-2" />}
                      Analyze with AI
                    </Button>
                    <Button
                      onClick={() => {
                        setShowAiInput(false);
                        setAiAnalysis(null);
                        setAiDescription('');
                      }}
                      variant="outline"
                      className="border-secondary text-secondary hover:bg-secondary/10"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* AI Analysis Results */}
          {aiAnalysis && (
            <div className="mt-6 p-6 bg-card rounded-xl border border-secondary/30">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <p className="text-sm font-semibold text-foreground mb-2">Severity Level:</p>
                  <p className={`text-2xl font-bold flex items-center gap-2 ${
                    aiAnalysis.severity === 'CRITICAL' ? 'text-destructive' :
                    aiAnalysis.severity === 'HIGH' ? 'text-orange-500' :
                    aiAnalysis.severity === 'MEDIUM' ? 'text-yellow-500' :
                    'text-green-500'
                  }`}>
                    <AlertCircle size={24} />
                    {aiAnalysis.severity}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground mb-2">Recommendation:</p>
                  <p className="text-foreground/70">{aiAnalysis.recommendation}</p>
                </div>
              </div>

              {aiAnalysis.services_needed && aiAnalysis.services_needed.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-foreground mb-3">Contact These Services:</p>
                  <div className="space-y-2">
                    {aiAnalysis.services_needed.map((service: string) => (
                      <button
                        key={service}
                        onClick={() => findNearestService(service)}
                        className="w-full px-4 py-2 text-left bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors font-semibold flex items-center justify-between"
                      >
                        <span>Find Nearest {service.charAt(0).toUpperCase() + service.slice(1)}</span>
                        <MapPin size={16} />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Emergency Services Section */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-4 text-center bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Find Nearest Services
          </h2>
          <p className="text-center text-foreground/70 mb-12">Locate nearest police station, hospital, or fire department in seconds</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Police Stations */}
            <div 
              className="p-8 bg-card rounded-xl border border-border hover:shadow-lg transition-all cursor-pointer"
              onClick={() => findNearestService('police')}
            >
              <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                <AlertCircle size={28} className="text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold mb-2 text-foreground">Police Stations</h3>
              <p className="text-foreground/70 mb-6">Report crimes or seek emergency assistance</p>
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                {searching && selectedService === 'police' ? (
                  <><Loader className="animate-spin mr-2" size={16} /> Finding...</>
                ) : (
                  <><MapPin className="mr-2" size={16} /> Find Nearest Police Station</>
                )}
              </Button>
              {nearbyServices.police && expandedService === 'police' && (
                <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-foreground">{nearbyServices.police.name}</p>
                      <p className="text-sm text-foreground/70">{nearbyServices.police.address}</p>
                    </div>
                    <span className="bg-blue-600 text-white px-2 py-1 rounded text-sm font-bold">
                      {nearbyServices.police.distance} km
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <a 
                      href={`tel:${nearbyServices.police.phone}`}
                      className="flex-1 px-3 py-2 bg-blue-600 text-white text-center rounded hover:bg-blue-700 text-sm font-semibold flex items-center justify-center gap-1"
                    >
                      <Phone size={14} /> Call
                    </a>
                    <a 
                      href={nearbyServices.police.directions_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 px-3 py-2 border border-blue-600 text-blue-600 text-center rounded hover:bg-blue-50 dark:hover:bg-blue-950 text-sm font-semibold flex items-center justify-center gap-1"
                    >
                      <Navigation size={14} /> Direction
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Hospitals */}
            <div 
              className="p-8 bg-card rounded-xl border border-border hover:shadow-lg transition-all cursor-pointer"
              onClick={() => findNearestService('hospital')}
            >
              <div className="w-14 h-14 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center mb-4">
                <Heart size={28} className="text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-2xl font-bold mb-2 text-foreground">Hospitals</h3>
              <p className="text-foreground/70 mb-6">Get medical assistance and treatment</p>
              <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
                {searching && selectedService === 'hospital' ? (
                  <><Loader className="animate-spin mr-2" size={16} /> Finding...</>
                ) : (
                  <><MapPin className="mr-2" size={16} /> Find Nearest Hospital</>
                )}
              </Button>
              {nearbyServices.hospital && expandedService === 'hospital' && (
                <div className="mt-4 p-4 bg-red-50 dark:bg-red-950 rounded-lg border border-red-200 dark:border-red-800">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-foreground">{nearbyServices.hospital.name}</p>
                      <p className="text-sm text-foreground/70">{nearbyServices.hospital.address}</p>
                    </div>
                    <span className="bg-red-600 text-white px-2 py-1 rounded text-sm font-bold">
                      {nearbyServices.hospital.distance} km
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <a 
                      href={`tel:${nearbyServices.hospital.phone}`}
                      className="flex-1 px-3 py-2 bg-red-600 text-white text-center rounded hover:bg-red-700 text-sm font-semibold flex items-center justify-center gap-1"
                    >
                      <Phone size={14} /> Call
                    </a>
                    <a 
                      href={nearbyServices.hospital.directions_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 px-3 py-2 border border-red-600 text-red-600 text-center rounded hover:bg-red-50 dark:hover:bg-red-950 text-sm font-semibold flex items-center justify-center gap-1"
                    >
                      <Navigation size={14} /> Direction
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Fire Stations */}
            <div 
              className="p-8 bg-card rounded-xl border border-border hover:shadow-lg transition-all cursor-pointer"
              onClick={() => findNearestService('fire')}
            >
              <div className="w-14 h-14 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mb-4">
                <Zap size={28} className="text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="text-2xl font-bold mb-2 text-foreground">Fire Stations</h3>
              <p className="text-foreground/70 mb-6">Fire safety and rescue services</p>
              <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white">
                {searching && selectedService === 'fire' ? (
                  <><Loader className="animate-spin mr-2" size={16} /> Finding...</>
                ) : (
                  <><MapPin className="mr-2" size={16} /> Find Nearest Fire Station</>
                )}
              </Button>
              {nearbyServices.fire && expandedService === 'fire' && (
                <div className="mt-4 p-4 bg-orange-50 dark:bg-orange-950 rounded-lg border border-orange-200 dark:border-orange-800">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-foreground">{nearbyServices.fire.name}</p>
                      <p className="text-sm text-foreground/70">{nearbyServices.fire.address}</p>
                    </div>
                    <span className="bg-orange-600 text-white px-2 py-1 rounded text-sm font-bold">
                      {nearbyServices.fire.distance} km
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <a 
                      href={`tel:${nearbyServices.fire.phone}`}
                      className="flex-1 px-3 py-2 bg-orange-600 text-white text-center rounded hover:bg-orange-700 text-sm font-semibold flex items-center justify-center gap-1"
                    >
                      <Phone size={14} /> Call
                    </a>
                    <a 
                      href={nearbyServices.fire.directions_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 px-3 py-2 border border-orange-600 text-orange-600 text-center rounded hover:bg-orange-50 dark:hover:bg-orange-950 text-sm font-semibold flex items-center justify-center gap-1"
                    >
                      <Navigation size={14} /> Direction
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Map Display */}
      {showMap && mapHtml && (
        <section className="py-12 bg-muted/50 border-t border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold mb-6 text-foreground">Interactive Map</h2>
            <div className="rounded-xl overflow-hidden shadow-xl border border-border" dangerouslySetInnerHTML={{ __html: mapHtml }} />
          </div>
        </section>
      )}

      {/* Quick Tips Section */}
      <section className="py-16 bg-gradient-to-r from-primary/5 to-secondary/5 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-12 text-center text-foreground">
            Essential Safety Tips
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { title: 'Stay Calm', desc: 'Keep your mind clear during emergencies. Take deep breaths and assess the situation.' },
              { title: 'Call Immediately', desc: 'Ring 112 or specific emergency numbers (100, 101, 102) as soon as possible.' },
              { title: 'Share Location', desc: 'Enable location sharing with emergency contacts for faster assistance.' },
              { title: 'First Aid Ready', desc: 'Keep basic first aid supplies and know how to use them.' }
            ].map((tip, i) => (
              <div key={i} className="p-6 bg-card rounded-lg border border-border hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-foreground mb-2">{tip.title}</h3>
                    <p className="text-foreground/70">{tip.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}