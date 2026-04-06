// app/dashboard/page.tsx

// export default function DashboardPage() {
//   return (
//     <div>
//       <h1>Dashboard</h1>
//       <p>Welcome to your dashboard!</p>
//     </div>
//   );
// }










// 'use client';

// import { useState, useEffect } from 'react';
// import Link from 'next/link';
// import MapComponent from '@/components/map-component';
// import { 
//   AlertCircle, MapPin, Phone, Clock, Heart, Navigation, Loader, ShieldAlert, Zap, Brain, 
//   ExternalLink, CheckCircle, MapPinOff 
// } from 'lucide-react';
// import { Button } from '@/components/ui/button';

// // --- Interfaces for TypeScript Type Safety ---
// interface EmergencyContact {
//   name: string;
//   phone: string;
//   relation?: string;
// }

// interface ServiceDetails {
//   name: string;
//   distance: number;
//   phone: string;
//   address: string;
//   lat: number;
//   lon: number;
//   directions_url: string;
// }

// interface NearbyServicesState {
//   [key: string]: ServiceDetails;
// }

// interface AiAnalysisResult {
//   severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
//   recommendation: string;
//   services_needed: string[];
// }

// const INDIA_EMERGENCY_NUMBERS = {
//   police: '100',
//   ambulance: '102',
//   fire: '101',
//   all: '112'
// };

// export default function DashboardPage() {
//   // --- State with Proper Typing ---
//   const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([]);
//   const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [nearbyServices, setNearbyServices] = useState<NearbyServicesState>({});
//   const [searching, setSearching] = useState(false);
//   const [selectedService, setSelectedService] = useState<string>('');
//   const [aiAnalysis, setAiAnalysis] = useState<AiAnalysisResult | null>(null);
//   const [showAiInput, setShowAiInput] = useState(false);
//   const [aiDescription, setAiDescription] = useState('');
//   const [aiLoading, setAiLoading] = useState(false);
//   const [mapHtml, setMapHtml] = useState<string>('');
//   const [showMap, setShowMap] = useState(false);
//   const [expandedService, setExpandedService] = useState<string | null>(null);

//   useEffect(() => {
//     // Get user location
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           setUserLocation({
//             lat: position.coords.latitude,
//             lng: position.coords.longitude,
//           });
//           setLoading(false);
//         },
//         (error) => {
//           console.log('Location error:', error);
//           // Default to India - New Delhi
//           setUserLocation({ lat: 28.6139, lng: 77.2090 });
//           setLoading(false);
//         }
//       );
//     }

//     // Load emergency contacts from localStorage
//     const saved = localStorage.getItem('emergencyContacts');
//     if (saved) {
//       try {
//         setEmergencyContacts(JSON.parse(saved));
//       } catch (e) {
//         console.error("Failed to parse contacts", e);
//       }
//     }
//   }, []);

//   const findNearestService = async (serviceType: string) => {
//     if (!userLocation) {
//       alert('Please enable location services to find nearby services');
//       return;
//     }
    
//     setSearching(true);
//     setSelectedService(serviceType);
//     setExpandedService(serviceType);
    
//     try {
//       const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
//       const response = await fetch(`${apiUrl}/api/find-nearby`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           lat: userLocation.lat,
//           lon: userLocation.lng,
//           type: serviceType === 'fire' ? 'fire_station' : serviceType
//         }),
//         credentials: 'include'
//       });

//       const data = await response.json();

//       if (response.ok) {
//         // Fix: Explicitly typing 'prev' in the state setter
//         setNearbyServices((prev: NearbyServicesState) => ({
//           ...prev,
//           [serviceType]: {
//             name: data.name,
//             distance: data.distance,
//             phone: data.phone,
//             address: data.address,
//             lat: data.lat,
//             lon: data.lon,
//             directions_url: data.directions_url
//           }
//         }));
//         setMapHtml(data.map_html || '');
//         setShowMap(true);
//       } else {
//         // Fallback if backend not running
//         const mockServices: Record<string, Partial<ServiceDetails>> = {
//           police: { name: 'Nearby Police Station', distance: 2.5, phone: '100', address: 'City Center, Your City', lat: userLocation.lat + 0.01, lon: userLocation.lng + 0.01 },
//           hospital: { name: 'General Hospital', distance: 1.8, phone: '102', address: 'Medical District, Your City', lat: userLocation.lat - 0.02, lon: userLocation.lng + 0.02 },
//           fire: { name: 'Fire Department', distance: 3.2, phone: '101', address: 'Industrial Area, Your City', lat: userLocation.lat + 0.02, lon: userLocation.lng - 0.01 }
//         };
        
//         const selected = mockServices[serviceType];
//         if (selected) {
//           setNearbyServices((prev: NearbyServicesState) => ({
//             ...prev,
//             [serviceType]: {
//               ...(selected as ServiceDetails),
//               directions_url: `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${selected.lat},${selected.lon}`
//             }
//           }));
//           setShowMap(true);
//         }
//       }
//     } catch (error) {
//       console.error('Error finding services:', error);
//       const mockServices: Record<string, Partial<ServiceDetails>> = {
//         police: { name: 'Nearest Police Station', distance: 2.5, phone: '100', address: 'Your City Center', lat: userLocation.lat + 0.01, lon: userLocation.lng + 0.01 },
//         hospital: { name: 'City Hospital', distance: 1.8, phone: '102', address: 'Medical Area', lat: userLocation.lat - 0.02, lon: userLocation.lng + 0.02 },
//         fire: { name: 'Fire Station', distance: 3.2, phone: '101', address: 'Fire Station Area', lat: userLocation.lat + 0.02, lon: userLocation.lng - 0.01 }
//       };
      
//       const selected = mockServices[serviceType];
//       if (selected && userLocation) {
//         setNearbyServices((prev: NearbyServicesState) => ({
//           ...prev,
//           [serviceType]: {
//             ...(selected as ServiceDetails),
//             directions_url: `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${selected.lat},${selected.lon}`
//           }
//         }));
//         setShowMap(true);
//       }
//     } finally {
//       setSearching(false);
//     }
//   };

//   const handleAiAnalysis = async () => {
//     if (!aiDescription.trim()) {
//       alert('Please describe the emergency situation');
//       return;
//     }

//     setAiLoading(true);
//     try {
//       const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
//       const response = await fetch(`${apiUrl}/api/ai-alert`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           description: aiDescription,
//           location: userLocation || { lat: 28.6139, lng: 77.2090 },
//           contacts: emergencyContacts
//         }),
//         credentials: 'include'
//       });

//       const data = await response.json();
//       setAiAnalysis(data);
//     } catch (error) {
//       console.error('AI Analysis Error:', error);
//       const description = aiDescription.toLowerCase();
//       let severity: AiAnalysisResult['severity'] = 'MEDIUM';
//       let services = ['hospital'];
      
//       if (description.includes('unconscious') || description.includes('bleeding') || description.includes('fire')) {
//         severity = 'CRITICAL';
//         services = ['hospital', 'police', 'fire'];
//       } else if (description.includes('injury') || description.includes('accident')) {
//         severity = 'HIGH';
//         services = ['hospital', 'police'];
//       }
      
//       setAiAnalysis({
//         severity,
//         recommendation: severity === 'CRITICAL' ? 'CALL 112 IMMEDIATELY!' : 'Contact emergency services',
//         services_needed: services
//       });
//     } finally {
//       setAiLoading(false);
//     }
//   };

//   const callEmergency = (number: string) => {
//     window.location.href = `tel:${number}`;
//   };

//   return (
//     <main className="min-h-screen flex flex-col bg-background">
      
//       {/* Hero Section */}
//       <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/10 pt-16 pb-12">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
//             <div>
//               <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent leading-tight">
//                 Safety at Every Step
//               </h1>
//               <p className="text-lg text-foreground/70 mb-8 leading-relaxed">
//                 Access emergency services instantly, locate nearby hospitals, police stations, and fire departments. Keep your loved ones safe with AI-powered emergency response.
//               </p>
//               <div className="flex flex-col sm:flex-row gap-4">
//                 <button
//                   onClick={() => callEmergency(INDIA_EMERGENCY_NUMBERS.all)}
//                   className="px-8 py-3 bg-gradient-to-r from-destructive to-orange-500 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
//                 >
//                   <AlertCircle size={20} />
//                   Emergency Call ({INDIA_EMERGENCY_NUMBERS.all})
//                 </button>
//                 <Link
//                   href="/emergency-contacts"
//                   className="px-8 py-3 border-2 border-primary text-primary font-semibold rounded-lg hover:bg-primary/5 transition-colors text-center"
//                 >
//                   My Contacts
//                 </Link>
//               </div>
//             </div>
//             <div className="relative h-64 md:h-96 rounded-xl overflow-hidden shadow-2xl">
//               {!loading && userLocation ? (
//                 <MapComponent location={userLocation} />
//               ) : (
//                 <div className="w-full h-full bg-muted flex items-center justify-center">
//                   <div className="text-center">
//                     <Clock className="mx-auto mb-2 text-muted-foreground animate-spin" size={32} />
//                     <p className="text-muted-foreground">Loading map...</p>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Quick Emergency Numbers */}
//       <section className="py-8 bg-card border-b border-border">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <h3 className="text-xl font-bold mb-6 text-center text-foreground">Quick Emergency Numbers (India)</h3>
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//             {[
//               { name: 'Police', number: INDIA_EMERGENCY_NUMBERS.police, color: 'from-blue-600 to-blue-700' },
//               { name: 'Ambulance', number: INDIA_EMERGENCY_NUMBERS.ambulance, color: 'from-red-600 to-red-700' },
//               { name: 'Fire', number: INDIA_EMERGENCY_NUMBERS.fire, color: 'from-orange-600 to-orange-700' },
//               { name: 'All Services', number: INDIA_EMERGENCY_NUMBERS.all, color: 'from-primary to-secondary' }
//             ].map((service) => (
//               <button
//                 key={service.number}
//                 onClick={() => callEmergency(service.number)}
//                 className={`p-4 bg-gradient-to-br ${service.color} text-white rounded-lg hover:shadow-lg transition-all hover:scale-105`}
//               >
//                 <div className="text-2xl font-bold">{service.number}</div>
//                 <div className="text-sm">{service.name}</div>
//               </button>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* AI Smart Alert Section */}
//       <section className="py-12 bg-gradient-to-r from-secondary/10 to-primary/10 border-b border-primary/20">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex items-start gap-4">
//             <Brain className="w-8 h-8 text-secondary flex-shrink-0 mt-1" />
//             <div className="flex-1">
//               <h2 className="text-2xl font-bold text-foreground mb-2 flex items-center gap-2">
//                 <Zap size={24} />
//                 AI-Powered Emergency Analysis
//               </h2>
//               <p className="text-foreground/70 mb-4">Describe your emergency and let AI analyze the severity and recommend actions.</p>
//               {!showAiInput ? (
//                 <Button
//                   onClick={() => setShowAiInput(true)}
//                   className="bg-secondary hover:bg-secondary/90 text-white"
//                 >
//                   Describe Your Emergency
//                 </Button>
//               ) : (
//                 <div className="space-y-3 mt-3">
//                   <textarea
//                     value={aiDescription}
//                     onChange={(e) => setAiDescription(e.target.value)}
//                     placeholder="Describe what's happening... (e.g., 'Person injured in car accident', 'Fire in building', 'Medical emergency')"
//                     className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-secondary"
//                     rows={3}
//                   />
//                   <div className="flex gap-2">
//                     <Button
//                       onClick={handleAiAnalysis}
//                       disabled={aiLoading}
//                       className="bg-secondary hover:bg-secondary/90 text-white disabled:opacity-50"
//                     >
//                       {aiLoading ? <Loader className="animate-spin mr-2" size={16} /> : <Brain size={16} className="mr-2" />}
//                       Analyze with AI
//                     </Button>
//                     <Button
//                       onClick={() => {
//                         setShowAiInput(false);
//                         setAiAnalysis(null);
//                         setAiDescription('');
//                       }}
//                       variant="outline"
//                       className="border-secondary text-secondary hover:bg-secondary/10"
//                     >
//                       Cancel
//                     </Button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* AI Analysis Results */}
//           {aiAnalysis && (
//             <div className="mt-6 p-6 bg-card rounded-xl border border-secondary/30">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//                 <div>
//                   <p className="text-sm font-semibold text-foreground mb-2">Severity Level:</p>
//                   <p className={`text-2xl font-bold flex items-center gap-2 ${
//                     aiAnalysis.severity === 'CRITICAL' ? 'text-destructive' :
//                     aiAnalysis.severity === 'HIGH' ? 'text-orange-500' :
//                     aiAnalysis.severity === 'MEDIUM' ? 'text-yellow-500' :
//                     'text-green-500'
//                   }`}>
//                     <AlertCircle size={24} />
//                     {aiAnalysis.severity}
//                   </p>
//                 </div>
//                 <div>
//                   <p className="text-sm font-semibold text-foreground mb-2">Recommendation:</p>
//                   <p className="text-foreground/70">{aiAnalysis.recommendation}</p>
//                 </div>
//               </div>

//               {aiAnalysis.services_needed && aiAnalysis.services_needed.length > 0 && (
//                 <div>
//                   <p className="text-sm font-semibold text-foreground mb-3">Contact These Services:</p>
//                   <div className="space-y-2">
//                     {aiAnalysis.services_needed.map((service: string) => (
//                       <button
//                         key={service}
//                         onClick={() => findNearestService(service)}
//                         className="w-full px-4 py-2 text-left bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors font-semibold flex items-center justify-between"
//                       >
//                         <span>Find Nearest {service.charAt(0).toUpperCase() + service.slice(1)}</span>
//                         <MapPin size={16} />
//                       </button>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       </section>

//       {/* Emergency Services Section */}
//       <section className="py-16 bg-background">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <h2 className="text-4xl font-bold mb-4 text-center bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
//             Find Nearest Services
//           </h2>
//           <p className="text-center text-foreground/70 mb-12">Locate nearest police station, hospital, or fire department in seconds</p>
          
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             {/* Police Stations */}
//             <div 
//               className="p-8 bg-card rounded-xl border border-border hover:shadow-lg transition-all cursor-pointer"
//               onClick={() => findNearestService('police')}
//             >
//               <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
//                 <AlertCircle size={28} className="text-blue-600 dark:text-blue-400" />
//               </div>
//               <h3 className="text-2xl font-bold mb-2 text-foreground">Police Stations</h3>
//               <p className="text-foreground/70 mb-6">Report crimes or seek emergency assistance</p>
//               <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
//                 {searching && selectedService === 'police' ? (
//                   <><Loader className="animate-spin mr-2" size={16} /> Finding...</>
//                 ) : (
//                   <><MapPin className="mr-2" size={16} /> Find Nearest Police Station</>
//                 )}
//               </Button>
//               {nearbyServices.police && expandedService === 'police' && (
//                 <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
//                   <div className="flex items-start justify-between mb-2">
//                     <div>
//                       <p className="font-semibold text-foreground">{nearbyServices.police.name}</p>
//                       <p className="text-sm text-foreground/70">{nearbyServices.police.address}</p>
//                     </div>
//                     <span className="bg-blue-600 text-white px-2 py-1 rounded text-sm font-bold">
//                       {nearbyServices.police.distance} km
//                     </span>
//                   </div>
//                   <div className="flex gap-2">
//                     <a 
//                       href={`tel:${nearbyServices.police.phone}`}
//                       className="flex-1 px-3 py-2 bg-blue-600 text-white text-center rounded hover:bg-blue-700 text-sm font-semibold flex items-center justify-center gap-1"
//                     >
//                       <Phone size={14} /> Call
//                     </a>
//                     <a 
//                       href={nearbyServices.police.directions_url}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="flex-1 px-3 py-2 border border-blue-600 text-blue-600 text-center rounded hover:bg-blue-50 dark:hover:bg-blue-950 text-sm font-semibold flex items-center justify-center gap-1"
//                     >
//                       <Navigation size={14} /> Direction
//                     </a>
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Hospitals */}
//             <div 
//               className="p-8 bg-card rounded-xl border border-border hover:shadow-lg transition-all cursor-pointer"
//               onClick={() => findNearestService('hospital')}
//             >
//               <div className="w-14 h-14 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center mb-4">
//                 <Heart size={28} className="text-red-600 dark:text-red-400" />
//               </div>
//               <h3 className="text-2xl font-bold mb-2 text-foreground">Hospitals</h3>
//               <p className="text-foreground/70 mb-6">Get medical assistance and treatment</p>
//               <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
//                 {searching && selectedService === 'hospital' ? (
//                   <><Loader className="animate-spin mr-2" size={16} /> Finding...</>
//                 ) : (
//                   <><MapPin className="mr-2" size={16} /> Find Nearest Hospital</>
//                 )}
//               </Button>
//               {nearbyServices.hospital && expandedService === 'hospital' && (
//                 <div className="mt-4 p-4 bg-red-50 dark:bg-red-950 rounded-lg border border-red-200 dark:border-red-800">
//                   <div className="flex items-start justify-between mb-2">
//                     <div>
//                       <p className="font-semibold text-foreground">{nearbyServices.hospital.name}</p>
//                       <p className="text-sm text-foreground/70">{nearbyServices.hospital.address}</p>
//                     </div>
//                     <span className="bg-red-600 text-white px-2 py-1 rounded text-sm font-bold">
//                       {nearbyServices.hospital.distance} km
//                     </span>
//                   </div>
//                   <div className="flex gap-2">
//                     <a 
//                       href={`tel:${nearbyServices.hospital.phone}`}
//                       className="flex-1 px-3 py-2 bg-red-600 text-white text-center rounded hover:bg-red-700 text-sm font-semibold flex items-center justify-center gap-1"
//                     >
//                       <Phone size={14} /> Call
//                     </a>
//                     <a 
//                       href={nearbyServices.hospital.directions_url}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="flex-1 px-3 py-2 border border-red-600 text-red-600 text-center rounded hover:bg-red-50 dark:hover:bg-red-950 text-sm font-semibold flex items-center justify-center gap-1"
//                     >
//                       <Navigation size={14} /> Direction
//                     </a>
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Fire Stations */}
//             <div 
//               className="p-8 bg-card rounded-xl border border-border hover:shadow-lg transition-all cursor-pointer"
//               onClick={() => findNearestService('fire')}
//             >
//               <div className="w-14 h-14 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mb-4">
//                 <Zap size={28} className="text-orange-600 dark:text-orange-400" />
//               </div>
//               <h3 className="text-2xl font-bold mb-2 text-foreground">Fire Stations</h3>
//               <p className="text-foreground/70 mb-6">Fire safety and rescue services</p>
//               <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white">
//                 {searching && selectedService === 'fire' ? (
//                   <><Loader className="animate-spin mr-2" size={16} /> Finding...</>
//                 ) : (
//                   <><MapPin className="mr-2" size={16} /> Find Nearest Fire Station</>
//                 )}
//               </Button>
//               {nearbyServices.fire && expandedService === 'fire' && (
//                 <div className="mt-4 p-4 bg-orange-50 dark:bg-orange-950 rounded-lg border border-orange-200 dark:border-orange-800">
//                   <div className="flex items-start justify-between mb-2">
//                     <div>
//                       <p className="font-semibold text-foreground">{nearbyServices.fire.name}</p>
//                       <p className="text-sm text-foreground/70">{nearbyServices.fire.address}</p>
//                     </div>
//                     <span className="bg-orange-600 text-white px-2 py-1 rounded text-sm font-bold">
//                       {nearbyServices.fire.distance} km
//                     </span>
//                   </div>
//                   <div className="flex gap-2">
//                     <a 
//                       href={`tel:${nearbyServices.fire.phone}`}
//                       className="flex-1 px-3 py-2 bg-orange-600 text-white text-center rounded hover:bg-orange-700 text-sm font-semibold flex items-center justify-center gap-1"
//                     >
//                       <Phone size={14} /> Call
//                     </a>
//                     <a 
//                       href={nearbyServices.fire.directions_url}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="flex-1 px-3 py-2 border border-orange-600 text-orange-600 text-center rounded hover:bg-orange-50 dark:hover:bg-orange-950 text-sm font-semibold flex items-center justify-center gap-1"
//                     >
//                       <Navigation size={14} /> Direction
//                     </a>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Map Display */}
//       {showMap && mapHtml && (
//         <section className="py-12 bg-muted/50 border-t border-border">
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//             <h2 className="text-3xl font-bold mb-6 text-foreground">Interactive Map</h2>
//             <div className="rounded-xl overflow-hidden shadow-xl border border-border" dangerouslySetInnerHTML={{ __html: mapHtml }} />
//           </div>
//         </section>
//       )}

//       {/* Quick Tips Section */}
//       <section className="py-16 bg-gradient-to-r from-primary/5 to-secondary/5 border-t border-border">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <h2 className="text-3xl font-bold mb-12 text-center text-foreground">
//             Essential Safety Tips
//           </h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {[
//               { title: 'Stay Calm', desc: 'Keep your mind clear during emergencies. Take deep breaths and assess the situation.' },
//               { title: 'Call Immediately', desc: 'Ring 112 or specific emergency numbers (100, 101, 102) as soon as possible.' },
//               { title: 'Share Location', desc: 'Enable location sharing with emergency contacts for faster assistance.' },
//               { title: 'First Aid Ready', desc: 'Keep basic first aid supplies and know how to use them.' }
//             ].map((tip, i) => (
//               <div key={i} className="p-6 bg-card rounded-lg border border-border hover:shadow-md transition-shadow">
//                 <div className="flex items-start gap-4">
//                   <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
//                   <div>
//                     <h3 className="font-bold text-foreground mb-2">{tip.title}</h3>
//                     <p className="text-foreground/70">{tip.desc}</p>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>
//     </main>
//   );
// }



























// 'use client';

// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import Link from 'next/link';
// import MapComponent from '@/components/map-component';
// import { 
//   AlertCircle, MapPin, Phone, Clock, Heart, Navigation, Loader, 
//   ShieldAlert, Zap, Brain, ExternalLink, CheckCircle 
// } from 'lucide-react';
// import { Button } from '@/components/ui/button';

// // --- Interfaces ---
// interface EmergencyContact {
//   name: string;
//   phone: string;
//   relation?: string;
// }

// interface ServiceDetails {
//   name: string;
//   distance: number;
//   phone: string;
//   address: string;
//   lat: number;
//   lon: number;
//   directions_url: string;
// }

// interface NearbyServicesState {
//   [key: string]: ServiceDetails;
// }

// interface AiAnalysisResult {
//   severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
//   recommendation: string;
//   services_needed: string[];
// }

// const INDIA_EMERGENCY_NUMBERS = {
//   police: '100',
//   ambulance: '102',
//   fire: '101',
//   all: '112'
// };

// export default function DashboardPage() {
//   const router = useRouter();

//   // --- State ---
//   const [authChecking, setAuthChecking] = useState(true);
//   const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([]);
//   const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [nearbyServices, setNearbyServices] = useState<NearbyServicesState>({});
//   const [searching, setSearching] = useState(false);
//   const [selectedService, setSelectedService] = useState<string>('');
//   const [aiAnalysis, setAiAnalysis] = useState<AiAnalysisResult | null>(null);
//   const [showAiInput, setShowAiInput] = useState(false);
//   const [aiDescription, setAiDescription] = useState('');
//   const [aiLoading, setAiLoading] = useState(false);
//   const [mapHtml, setMapHtml] = useState<string>('');
//   const [showMap, setShowMap] = useState(false);
//   const [expandedService, setExpandedService] = useState<string | null>(null);

//   // --- Auth & Data Initialization ---
//   useEffect(() => {
//     const token = localStorage.getItem('auth_token');
//     if (!token) {
//       router.push('/landing');
//     } else {
//       setAuthChecking(false);
//     }

//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
//           setLoading(false);
//         },
//         () => {
//           setUserLocation({ lat: 28.6139, lng: 77.2090 }); // Default Delhi
//           setLoading(false);
//         }
//       );
//     }

//     const saved = localStorage.getItem('emergencyContacts');
//     if (saved) {
//       try { setEmergencyContacts(JSON.parse(saved)); } catch (e) { console.error(e); }
//     }
//   }, [router]);

//   // --- Logic Functions ---
//   const callEmergency = (number: string) => {
//     window.location.href = `tel:${number}`;
//   };

//   const findNearestService = async (serviceType: string) => {
//     if (!userLocation) return alert('Please enable location services');

//     setSearching(true);
//     setSelectedService(serviceType);
//     setExpandedService(serviceType);

//     try {
//       const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
//       const response = await fetch(`${apiUrl}/api/find-nearby`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           lat: userLocation.lat,
//           lon: userLocation.lng,
//           type: serviceType === 'fire' ? 'fire_station' : serviceType
//         }),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         setNearbyServices(prev => ({
//           ...prev,
//           [serviceType]: data
//         }));
//         setMapHtml(data.map_html || '');
//         setShowMap(true);
//       } else {
//         throw new Error('Backend error');
//       }
//     } catch (error) {
//       // Fallback Logic for Directions and Details
//       const mockLoc = {
//         police: { name: 'City Police Station', lat: 0.01, lon: 0.01, phone: '100' },
//         hospital: { name: 'City General Hospital', lat: -0.01, lon: 0.02, phone: '102' },
//         fire: { name: 'Main Fire Station', lat: 0.02, lon: -0.01, phone: '101' }
//       }[serviceType as 'police' | 'hospital' | 'fire'];

//       const destLat = userLocation.lat + mockLoc.lat;
//       const destLon = userLocation.lng + mockLoc.lon;

//       setNearbyServices(prev => ({
//         ...prev,
//         [serviceType]: {
//           name: mockLoc.name,
//           distance: 1.5,
//           phone: mockLoc.phone,
//           address: 'Main Road, Near Center',
//           lat: destLat,
//           lon: destLon,
//           directions_url: `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${destLat},${destLon}`
//         }
//       }));
//       setShowMap(true);
//     } finally {
//       setSearching(false);
//     }
//   };

//   const handleAiAnalysis = async () => {
//     if (!aiDescription.trim()) return alert('Describe the situation');
//     setAiLoading(true);
    
//     // Mocking AI Response for functionality
//     setTimeout(() => {
//       const desc = aiDescription.toLowerCase();
//       let severity: AiAnalysisResult['severity'] = 'MEDIUM';
//       let services = ['hospital'];

//       if (desc.includes('fire') || desc.includes('breath')) {
//         severity = 'CRITICAL';
//         services = ['fire', 'hospital'];
//       }

//       setAiAnalysis({
//         severity,
//         recommendation: severity === 'CRITICAL' ? 'EVACUATE AND CALL 112' : 'Proceed to nearest facility',
//         services_needed: services
//       });
//       setAiLoading(false);
//     }, 1500);
//   };

//   if (authChecking) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 to-blue-700">
//         <Loader className="h-10 w-10 animate-spin text-white" />
//       </div>
//     );
//   }

//   return (
//     <main className="min-h-screen flex flex-col bg-background">
      
//       {/* Hero Section */}
//       <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/10 pt-16 pb-12">
//         <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
//           <div>
//             <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
//               Safety at Every Step
//             </h1>
//             <p className="text-lg text-foreground/70 mb-8">
//               Instant access to emergency services. Locate hospitals, police, and fire stations with AI-powered assistance.
//             </p>
//             <div className="flex flex-col sm:flex-row gap-4">
//               <Button 
//                 size="lg" 
//                 variant="destructive"
//                 className="bg-red-600 hover:bg-red-700 shadow-lg"
//                 onClick={() => callEmergency(INDIA_EMERGENCY_NUMBERS.all)}
//               >
//                 <AlertCircle className="mr-2" /> Emergency Call (112)
//               </Button>
//               <Link href="/emergency-contacts">
//                 <Button size="lg" variant="outline" className="w-full sm:w-auto">My Contacts</Button>
//               </Link>
//             </div>
//           </div>
//           <div className="h-64 md:h-96 rounded-xl overflow-hidden shadow-2xl bg-muted">
//             {!loading && userLocation ? (
//               <MapComponent location={userLocation} />
//             ) : (
//               <div className="h-full flex flex-col items-center justify-center">
//                 <Clock className="animate-spin mb-2" />
//                 <p>Locating you...</p>
//               </div>
//             )}
//           </div>
//         </div>
//       </section>

//       {/* Quick Numbers */}
//       <section className="py-8 bg-card border-b">
//         <div className="max-w-7xl mx-auto px-4">
//           <h3 className="text-center font-bold mb-6">Quick Dial (India)</h3>
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//             {[
//               { label: 'Police', num: '100', color: 'from-blue-600 to-blue-800' },
//               { label: 'Ambulance', num: '102', color: 'from-red-600 to-red-800' },
//               { label: 'Fire', num: '101', color: 'from-orange-600 to-orange-800' },
//               { label: 'All', num: '112', color: 'from-indigo-600 to-indigo-800' },
//             ].map((s) => (
//               <button 
//                 key={s.num}
//                 onClick={() => callEmergency(s.num)}
//                 className={`p-4 rounded-xl bg-gradient-to-br ${s.color} text-white hover:scale-105 transition-transform shadow-md`}
//               >
//                 <div className="text-2xl font-bold">{s.num}</div>
//                 <div className="text-xs opacity-80">{s.label}</div>
//               </button>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* AI Analysis */}
//       <section className="py-12 bg-gradient-to-r from-secondary/5 to-primary/5">
//         <div className="max-w-7xl mx-auto px-4">
//           <div className="flex gap-4 items-start">
//             <Brain className="text-primary h-8 w-8" />
//             <div className="flex-1">
//               <h2 className="text-2xl font-bold flex items-center gap-2">AI Smart Alert</h2>
//               <p className="text-muted-foreground mb-4">Describe your situation for immediate severity analysis.</p>
              
//               {!showAiInput ? (
//                 <Button onClick={() => setShowAiInput(true)}>Analyze Emergency</Button>
//               ) : (
//                 <div className="space-y-4">
//                   <textarea 
//                     className="w-full p-4 rounded-lg border bg-background"
//                     rows={3}
//                     placeholder="e.g. Someone is unconscious near the park..."
//                     value={aiDescription}
//                     onChange={(e) => setAiDescription(e.target.value)}
//                   />
//                   <div className="flex gap-2">
//                     <Button onClick={handleAiAnalysis} disabled={aiLoading}>
//                       {aiLoading ? <Loader className="animate-spin mr-2" /> : <Zap className="mr-2" />}
//                       Start Analysis
//                     </Button>
//                     <Button variant="ghost" onClick={() => setShowAiInput(false)}>Cancel</Button>
//                   </div>
//                 </div>
//               )}

//               {aiAnalysis && (
//                 <div className="mt-6 p-6 rounded-xl border bg-card shadow-sm">
//                   <div className="flex justify-between items-center mb-4">
//                     <div>
//                       <span className="text-sm font-medium">Severity</span>
//                       <div className={`text-xl font-bold ${aiAnalysis.severity === 'CRITICAL' ? 'text-red-600' : 'text-yellow-600'}`}>
//                         {aiAnalysis.severity}
//                       </div>
//                     </div>
//                     <div className="text-right">
//                       <span className="text-sm font-medium">Rec</span>
//                       <p className="text-sm">{aiAnalysis.recommendation}</p>
//                     </div>
//                   </div>
//                   <div className="grid gap-2">
//                     {aiAnalysis.services_needed.map(s => (
//                       <Button key={s} variant="secondary" onClick={() => findNearestService(s)} className="justify-between">
//                         Locate {s} <MapPin size={16} />
//                       </Button>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Service Cards */}
//       <section className="py-16 px-4 max-w-7xl mx-auto">
//         <h2 className="text-3xl font-bold text-center mb-12">Find Nearest Help</h2>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//           {['police', 'hospital', 'fire'].map((type) => (
//             <div key={type} className="p-8 bg-card border rounded-2xl hover:shadow-xl transition-all">
//               <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 
//                 ${type === 'police' ? 'bg-blue-100 text-blue-600' : 
//                   type === 'hospital' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'}`}
//               >
//                 {type === 'police' ? <ShieldAlert /> : type === 'hospital' ? <Heart /> : <Zap />}
//               </div>
//               <h3 className="text-2xl font-bold capitalize mb-2">{type}</h3>
//               <p className="text-muted-foreground mb-6">Quickest response for {type} emergencies.</p>
              
//               <Button 
//                 className="w-full"
//                 onClick={() => findNearestService(type)}
//                 disabled={searching && selectedService === type}
//               >
//                 {searching && selectedService === type ? <Loader className="animate-spin" /> : 'Find Nearest'}
//               </Button>

//               {nearbyServices[type] && expandedService === type && (
//                 <div className="mt-6 p-4 rounded-lg bg-muted/50 border border-primary/10">
//                   <div className="flex justify-between items-start mb-4">
//                     <div>
//                       <h4 className="font-bold text-sm">{nearbyServices[type].name}</h4>
//                       <p className="text-xs text-muted-foreground">{nearbyServices[type].address}</p>
//                     </div>
//                     <span className="text-xs font-black bg-primary/10 p-1 rounded">{nearbyServices[type].distance}km</span>
//                   </div>
//                   <div className="grid grid-cols-2 gap-2">
//                     <Button size="sm" className="gap-1" onClick={() => callEmergency(nearbyServices[type].phone)}>
//                       <Phone size={14}/> Call
//                     </Button>
//                     <a 
//                       href={nearbyServices[type].directions_url} 
//                       target="_blank" 
//                       className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-outline border border-input hover:bg-accent h-9 px-3 gap-1"
//                     >
//                       <Navigation size={14}/> Route
//                     </a>
//                   </div>
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* Safety Tips */}
//       <section className="py-16 bg-muted/30">
//         <div className="max-w-7xl mx-auto px-4">
//           <h2 className="text-2xl font-bold text-center mb-8">Safety Essentials</h2>
//           <div className="grid md:grid-cols-2 gap-4">
//             {[
//               { t: 'Stay Calm', d: 'Breathe. Clear thinking saves lives.' },
//               { t: 'Location First', d: 'Identify your surroundings before calling.' },
//               { t: 'Share Info', d: 'Keep emergency contacts updated in your profile.' },
//               { t: 'Know First Aid', d: 'Basic CPR knowledge is critical.' },
//             ].map((tip, i) => (
//               <div key={i} className="flex gap-4 p-4 bg-background rounded-lg border">
//                 <CheckCircle className="text-green-500 shrink-0" />
//                 <div>
//                   <h4 className="font-bold">{tip.t}</h4>
//                   <p className="text-sm text-muted-foreground">{tip.d}</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>
//     </main>
//   );
// }














































// 'use client';

// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import Link from 'next/link';
// import MapComponent from '@/components/map-component';
// import { 
//   AlertCircle, MapPin, Phone, Clock, Heart, Navigation, Loader, 
//   ShieldAlert, Zap, Brain, ExternalLink, CheckCircle 
// } from 'lucide-react';
// import { Button } from '@/components/ui/button';

// // --- Interfaces ---
// interface EmergencyContact {
//   name: string;
//   phone: string;
//   relation?: string;
// }

// interface ServiceDetails {
//   name: string;
//   distance: number;
//   phone: string;
//   address: string;
//   lat: number;
//   lon: number;
//   directions_url: string;
// }

// interface NearbyServicesState {
//   [key: string]: ServiceDetails;
// }

// interface AiAnalysisResult {
//   severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
//   recommendation: string;
//   services_needed: string[];
// }

// const INDIA_EMERGENCY_NUMBERS = {
//   police: '100',
//   ambulance: '102',
//   fire: '101',
//   all: '112'
// };

// export default function DashboardPage() {
//   const router = useRouter();

//   // --- State ---
//   const [authChecking, setAuthChecking] = useState(true);
//   const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([]);
//   const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [nearbyServices, setNearbyServices] = useState<NearbyServicesState>({});
//   const [searching, setSearching] = useState(false);
//   const [selectedService, setSelectedService] = useState<string>('');
//   const [aiAnalysis, setAiAnalysis] = useState<AiAnalysisResult | null>(null);
//   const [showAiInput, setShowAiInput] = useState(false);
//   const [aiDescription, setAiDescription] = useState('');
//   const [aiLoading, setAiLoading] = useState(false);
//   const [mapHtml, setMapHtml] = useState<string>('');
//   const [showMap, setShowMap] = useState(false);
//   const [expandedService, setExpandedService] = useState<string | null>(null);

//   // --- Auth & Data Initialization ---
//   useEffect(() => {
//     const token = localStorage.getItem('auth_token');
//     if (!token) {
//       router.push('/auth/landing');
//     } else {
//       setAuthChecking(false);
//     }

//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
//           setLoading(false);
//         },
//         () => {
//           setUserLocation({ lat: 28.6139, lng: 77.2090 }); // Default Delhi
//           setLoading(false);
//         }
//       );
//     }

//     const saved = localStorage.getItem('emergencyContacts');
//     if (saved) {
//       try { setEmergencyContacts(JSON.parse(saved)); } catch (e) { console.error(e); }
//     }
//   }, [router]);

//   // --- Logic Functions ---
//   const callEmergency = (number: string) => {
//     window.location.href = `tel:${number}`;
//   };

//   const findNearestService = async (serviceType: string) => {
//     if (!userLocation) return alert('Please enable location services');

//     setSearching(true);
//     setSelectedService(serviceType);
//     setExpandedService(serviceType);

//     try {
//       const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
//       const response = await fetch(`${apiUrl}/api/find-nearby`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           lat: userLocation.lat,
//           lon: userLocation.lng,
//           type: serviceType === 'fire' ? 'fire_station' : serviceType
//         }),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         setNearbyServices(prev => ({ ...prev, [serviceType]: data }));
//         setMapHtml(data.map_html || '');
//         setShowMap(true);
//       } else {
//         throw new Error('Backend error');
//       }
//     } catch (error) {
//       // Fallback Logic for Directions and Details
//       const mockServices: Record<string, any> = {
//         police: { name: 'Nearest Police Station', lat: 0.01, lon: 0.01, phone: '100', color: 'blue' },
//         hospital: { name: 'City Hospital', lat: -0.02, lon: 0.02, phone: '102', color: 'red' },
//         fire: { name: 'Fire Station', lat: 0.02, lon: -0.01, phone: '101', color: 'orange' }
//       };

//       const selected = mockServices[serviceType];
//       const destLat = userLocation.lat + selected.lat;
//       const destLon = userLocation.lng + selected.lon;

//       setNearbyServices(prev => ({
//         ...prev,
//         [serviceType]: {
//           name: selected.name,
//           distance: 1.8,
//           phone: selected.phone,
//           address: 'Locality Center, Your City',
//           lat: destLat,
//           lon: destLon,
//           directions_url: `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${destLat},${destLon}`
//         }
//       }));
//       setShowMap(true);
//     } finally {
//       setSearching(false);
//     }
//   };

//   const handleAiAnalysis = async () => {
//     if (!aiDescription.trim()) return alert('Describe the situation');
//     setAiLoading(true);
    
//     setTimeout(() => {
//       const desc = aiDescription.toLowerCase();
//       let severity: AiAnalysisResult['severity'] = 'MEDIUM';
//       let services = ['hospital'];

//       if (desc.includes('fire') || desc.includes('unconscious') || desc.includes('bleeding')) {
//         severity = 'CRITICAL';
//         services = ['hospital', 'police', 'fire'];
//       }

//       setAiAnalysis({
//         severity,
//         recommendation: severity === 'CRITICAL' ? 'CALL 112 IMMEDIATELY!' : 'Contact emergency services',
//         services_needed: services
//       });
//       setAiLoading(false);
//     }, 1200);
//   };

//   if (authChecking) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 to-blue-700">
//         <Loader className="h-10 w-10 animate-spin text-white" />
//       </div>
//     );
//   }

//   return (
//     <main className="min-h-screen flex flex-col bg-background">
      
//       {/* Hero Section */}
//       <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/10 pt-16 pb-12">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
//             <div>
//               <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent leading-tight">
//                 Safety at Every Step
//               </h1>
//               <p className="text-lg text-foreground/70 mb-8 leading-relaxed">
//                 Access emergency services instantly, locate nearby hospitals, police stations, and fire departments. Keep your loved ones safe with AI-powered emergency response.
//               </p>
//               <div className="flex flex-col sm:flex-row gap-4">
//                 <button
//                   onClick={() => callEmergency(INDIA_EMERGENCY_NUMBERS.all)}
//                   className="px-8 py-3 bg-gradient-to-r from-destructive to-orange-500 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
//                 >
//                   <AlertCircle size={20} />
//                   Emergency Call ({INDIA_EMERGENCY_NUMBERS.all})
//                 </button>
//                 <Link
//                   href="/emergency-contacts"
//                   className="px-8 py-3 border-2 border-primary text-primary font-semibold rounded-lg hover:bg-primary/5 transition-colors text-center"
//                 >
//                   My Contacts
//                 </Link>
//               </div>
//             </div>
//             <div className="relative h-64 md:h-96 rounded-xl overflow-hidden shadow-2xl bg-muted">
//               {!loading && userLocation ? (
//                 <MapComponent location={userLocation} />
//               ) : (
//                 <div className="w-full h-full flex flex-col items-center justify-center">
//                   <Clock className="mx-auto mb-2 text-muted-foreground animate-spin" size={32} />
//                   <p className="text-muted-foreground">Loading map...</p>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Quick Emergency Numbers */}
//       <section className="py-8 bg-card border-b border-border">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <h3 className="text-xl font-bold mb-6 text-center text-foreground">Quick Emergency Numbers (India)</h3>
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//             {[
//               { name: 'Police', number: INDIA_EMERGENCY_NUMBERS.police, color: 'from-blue-600 to-blue-700' },
//               { name: 'Ambulance', number: INDIA_EMERGENCY_NUMBERS.ambulance, color: 'from-red-600 to-red-700' },
//               { name: 'Fire', number: INDIA_EMERGENCY_NUMBERS.fire, color: 'from-orange-600 to-orange-700' },
//               { name: 'All Services', number: INDIA_EMERGENCY_NUMBERS.all, color: 'from-primary to-secondary' }
//             ].map((service) => (
//               <button
//                 key={service.number}
//                 onClick={() => callEmergency(service.number)}
//                 className={`p-4 bg-gradient-to-br ${service.color} text-white rounded-lg hover:shadow-lg transition-all hover:scale-105`}
//               >
//                 <div className="text-2xl font-bold">{service.number}</div>
//                 <div className="text-sm">{service.name}</div>
//               </button>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* AI Smart Alert Section */}
//       <section className="py-12 bg-gradient-to-r from-secondary/10 to-primary/10 border-b border-primary/20">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex items-start gap-4">
//             <Brain className="w-8 h-8 text-secondary flex-shrink-0 mt-1" />
//             <div className="flex-1">
//               <h2 className="text-2xl font-bold text-foreground mb-2 flex items-center gap-2">
//                 <Zap size={24} />
//                 AI-Powered Emergency Analysis
//               </h2>
//               <p className="text-foreground/70 mb-4">Describe your emergency and let AI analyze the severity and recommend actions.</p>
//               {!showAiInput ? (
//                 <Button
//                   onClick={() => setShowAiInput(true)}
//                   className="bg-secondary hover:bg-secondary/90 text-white"
//                 >
//                   Describe Your Emergency
//                 </Button>
//               ) : (
//                 <div className="space-y-3 mt-3">
//                   <textarea
//                     value={aiDescription}
//                     onChange={(e) => setAiDescription(e.target.value)}
//                     placeholder="Describe what's happening... (e.g., 'Person injured in car accident', 'Fire in building')"
//                     className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-secondary"
//                     rows={3}
//                   />
//                   <div className="flex gap-2">
//                     <Button
//                       onClick={handleAiAnalysis}
//                       disabled={aiLoading}
//                       className="bg-secondary hover:bg-secondary/90 text-white disabled:opacity-50"
//                     >
//                       {aiLoading ? <Loader className="animate-spin mr-2" size={16} /> : <Brain size={16} className="mr-2" />}
//                       Analyze with AI
//                     </Button>
//                     <Button
//                       onClick={() => { setShowAiInput(false); setAiAnalysis(null); setAiDescription(''); }}
//                       variant="outline"
//                       className="border-secondary text-secondary hover:bg-secondary/10"
//                     >
//                       Cancel
//                     </Button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* AI Analysis Results */}
//           {aiAnalysis && (
//             <div className="mt-6 p-6 bg-card rounded-xl border border-secondary/30">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//                 <div>
//                   <p className="text-sm font-semibold text-foreground mb-2">Severity Level:</p>
//                   <p className={`text-2xl font-bold flex items-center gap-2 ${
//                     aiAnalysis.severity === 'CRITICAL' ? 'text-destructive' :
//                     aiAnalysis.severity === 'HIGH' ? 'text-orange-500' :
//                     aiAnalysis.severity === 'MEDIUM' ? 'text-yellow-500' : 'text-green-500'
//                   }`}>
//                     <AlertCircle size={24} /> {aiAnalysis.severity}
//                   </p>
//                 </div>
//                 <div>
//                   <p className="text-sm font-semibold text-foreground mb-2">Recommendation:</p>
//                   <p className="text-foreground/70">{aiAnalysis.recommendation}</p>
//                 </div>
//               </div>
//               {aiAnalysis.services_needed && (
//                 <div>
//                   <p className="text-sm font-semibold text-foreground mb-3">Contact These Services:</p>
//                   <div className="space-y-2">
//                     {aiAnalysis.services_needed.map((service) => (
//                       <button
//                         key={service}
//                         onClick={() => findNearestService(service)}
//                         className="w-full px-4 py-2 text-left bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors font-semibold flex items-center justify-between"
//                       >
//                         <span>Find Nearest {service.charAt(0).toUpperCase() + service.slice(1)}</span>
//                         <MapPin size={16} />
//                       </button>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       </section>

//       {/* Emergency Services Section */}
//       <section className="py-16 bg-background">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <h2 className="text-4xl font-bold mb-4 text-center bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
//             Find Nearest Services
//           </h2>
//           <p className="text-center text-foreground/70 mb-12">Locate nearest police station, hospital, or fire department in seconds</p>
          
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             {/* Police */}
//             <div className="p-8 bg-card rounded-xl border border-border hover:shadow-lg transition-all cursor-pointer" onClick={() => findNearestService('police')}>
//               <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
//                 <AlertCircle size={28} className="text-blue-600 dark:text-blue-400" />
//               </div>
//               <h3 className="text-2xl font-bold mb-2">Police Stations</h3>
//               <p className="text-foreground/70 mb-6">Report crimes or seek emergency assistance</p>
//               <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
//                 {searching && selectedService === 'police' ? <Loader className="animate-spin mr-2" size={16} /> : <MapPin className="mr-2" size={16} />}
//                 Find Nearest Police Station
//               </Button>
//               {nearbyServices.police && expandedService === 'police' && (
//                 <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200">
//                   <div className="flex justify-between mb-2">
//                     <span className="font-bold text-sm">{nearbyServices.police.name}</span>
//                     <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs">{nearbyServices.police.distance} km</span>
//                   </div>
//                   <div className="flex gap-2">
//                     <Button size="sm" className="flex-1 bg-blue-600" onClick={(e) => { e.stopPropagation(); callEmergency(nearbyServices.police.phone); }}>
//                       <Phone size={14} className="mr-1"/> Call
//                     </Button>
//                     <a href={nearbyServices.police.directions_url} target="_blank" className="flex-1 bg-white border border-blue-600 text-blue-600 text-sm py-2 rounded text-center font-bold flex items-center justify-center gap-1">
//                       <Navigation size={14}/> Direction
//                     </a>
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Hospital */}
//             <div className="p-8 bg-card rounded-xl border border-border hover:shadow-lg transition-all cursor-pointer" onClick={() => findNearestService('hospital')}>
//               <div className="w-14 h-14 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center mb-4">
//                 <Heart size={28} className="text-red-600 dark:text-red-400" />
//               </div>
//               <h3 className="text-2xl font-bold mb-2">Hospitals</h3>
//               <p className="text-foreground/70 mb-6">Get medical assistance and treatment</p>
//               <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
//                 {searching && selectedService === 'hospital' ? <Loader className="animate-spin mr-2" size={16} /> : <MapPin className="mr-2" size={16} />}
//                 Find Nearest Hospital
//               </Button>
//               {nearbyServices.hospital && expandedService === 'hospital' && (
//                 <div className="mt-4 p-4 bg-red-50 dark:bg-red-950 rounded-lg border border-red-200">
//                    <div className="flex justify-between mb-2">
//                     <span className="font-bold text-sm">{nearbyServices.hospital.name}</span>
//                     <span className="bg-red-600 text-white px-2 py-1 rounded text-xs">{nearbyServices.hospital.distance} km</span>
//                   </div>
//                   <div className="flex gap-2">
//                     <Button size="sm" className="flex-1 bg-red-600" onClick={(e) => { e.stopPropagation(); callEmergency(nearbyServices.hospital.phone); }}>
//                       <Phone size={14} className="mr-1"/> Call
//                     </Button>
//                     <a href={nearbyServices.hospital.directions_url} target="_blank" className="flex-1 bg-white border border-red-600 text-red-600 text-sm py-2 rounded text-center font-bold flex items-center justify-center gap-1">
//                       <Navigation size={14}/> Direction
//                     </a>
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Fire */}
//             <div className="p-8 bg-card rounded-xl border border-border hover:shadow-lg transition-all cursor-pointer" onClick={() => findNearestService('fire')}>
//               <div className="w-14 h-14 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mb-4">
//                 <Zap size={28} className="text-orange-600 dark:text-orange-400" />
//               </div>
//               <h3 className="text-2xl font-bold mb-2">Fire Stations</h3>
//               <p className="text-foreground/70 mb-6">Fire safety and rescue services</p>
//               <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white">
//                 {searching && selectedService === 'fire' ? <Loader className="animate-spin mr-2" size={16} /> : <MapPin className="mr-2" size={16} />}
//                 Find Nearest Fire Station
//               </Button>
//               {nearbyServices.fire && expandedService === 'fire' && (
//                 <div className="mt-4 p-4 bg-orange-50 dark:bg-orange-950 rounded-lg border border-orange-200">
//                   <div className="flex justify-between mb-2">
//                     <span className="font-bold text-sm">{nearbyServices.fire.name}</span>
//                     <span className="bg-orange-600 text-white px-2 py-1 rounded text-xs">{nearbyServices.fire.distance} km</span>
//                   </div>
//                   <div className="flex gap-2">
//                     <Button size="sm" className="flex-1 bg-orange-600" onClick={(e) => { e.stopPropagation(); callEmergency(nearbyServices.fire.phone); }}>
//                       <Phone size={14} className="mr-1"/> Call
//                     </Button>
//                     <a href={nearbyServices.fire.directions_url} target="_blank" className="flex-1 bg-white border border-orange-600 text-orange-600 text-sm py-2 rounded text-center font-bold flex items-center justify-center gap-1">
//                       <Navigation size={14}/> Direction
//                     </a>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Map Display */}
//       {showMap && mapHtml && (
//         <section className="py-12 bg-muted/50 border-t border-border">
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//             <h2 className="text-3xl font-bold mb-6">Interactive Map</h2>
//             <div className="rounded-xl overflow-hidden shadow-xl border border-border" dangerouslySetInnerHTML={{ __html: mapHtml }} />
//           </div>
//         </section>
//       )}

//       {/* Safety Tips Section */}
//       <section className="py-16 bg-gradient-to-r from-primary/5 to-secondary/5 border-t border-border">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <h2 className="text-3xl font-bold mb-12 text-center">Essential Safety Tips</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {[
//               { title: 'Stay Calm', desc: 'Keep your mind clear during emergencies. Take deep breaths and assess the situation.' },
//               { title: 'Call Immediately', desc: 'Ring 112 or specific emergency numbers (100, 101, 102) as soon as possible.' },
//               { title: 'Share Location', desc: 'Enable location sharing with emergency contacts for faster assistance.' },
//               { title: 'First Aid Ready', desc: 'Keep basic first aid supplies and know how to use them.' }
//             ].map((tip, i) => (
//               <div key={i} className="p-6 bg-card rounded-lg border border-border hover:shadow-md transition-shadow">
//                 <div className="flex items-start gap-4">
//                   <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
//                   <div>
//                     <h3 className="font-bold text-foreground mb-2">{tip.title}</h3>
//                     <p className="text-foreground/70">{tip.desc}</p>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>
//     </main>
//   );
// }












// 'use client';

// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import Link from 'next/link';
// import MapComponent from '@/components/map-component';
// import { 
//   AlertCircle, MapPin, Phone, Clock, Heart, Navigation, Loader, 
//   ShieldAlert, Zap, Brain, ExternalLink, CheckCircle 
// } from 'lucide-react';
// import { Button } from '@/components/ui/button';

// // --- Interfaces ---
// interface EmergencyContact {
//   name: string;
//   phone: string;
//   relation?: string;
// }

// interface ServiceDetails {
//   name: string;
//   distance: number;
//   phone: string;
//   address: string;
//   lat: number;
//   lon: number;
//   directions_url: string;
// }

// interface NearbyServicesState {
//   [key: string]: ServiceDetails;
// }

// interface AiAnalysisResult {
//   severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
//   recommendation: string;
//   services_needed: string[];
// }

// const INDIA_EMERGENCY_NUMBERS = {
//   police: '100',
//   ambulance: '102',
//   fire: '101',
//   all: '112'
// };

// export default function DashboardPage() {
//   const router = useRouter();

//   // --- State ---
//   const [authChecking, setAuthChecking] = useState(true);
//   const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([]);
//   const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [nearbyServices, setNearbyServices] = useState<NearbyServicesState>({});
//   const [searching, setSearching] = useState(false);
//   const [selectedService, setSelectedService] = useState<string>('');
//   const [aiAnalysis, setAiAnalysis] = useState<AiAnalysisResult | null>(null);
//   const [showAiInput, setShowAiInput] = useState(false);
//   const [aiDescription, setAiDescription] = useState('');
//   const [aiLoading, setAiLoading] = useState(false);
//   const [mapHtml, setMapHtml] = useState<string>('');
//   const [showMap, setShowMap] = useState(false);
//   const [expandedService, setExpandedService] = useState<string | null>(null);

//   // --- Auth & Data Initialization ---
//   useEffect(() => {
//     const token = localStorage.getItem('auth_token');
//     if (!token) {
//       router.push('/auth/landing');
//     } else {
//       setAuthChecking(false);
//     }

//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
//           setLoading(false);
//         },
//         () => {
//           setUserLocation({ lat: 28.6139, lng: 77.2090 }); // Default Delhi
//           setLoading(false);
//         }
//       );
//     }

//     const saved = localStorage.getItem('emergencyContacts');
//     if (saved) {
//       try { setEmergencyContacts(JSON.parse(saved)); } catch (e) { console.error(e); }
//     }
//   }, [router]);

//   // --- Logic Functions ---
//   const callEmergency = (number: string) => {
//     window.location.href = `tel:${number}`;
//   };

//   const findNearestService = async (serviceType: string) => {
//     if (!userLocation) return alert('Please enable location services');

//     // ✅ Added Token Retrieval
//     const token = localStorage.getItem('auth_token'); 
//     if (!token) {
//       alert("Session expired. Please log in again.");
//       router.push('/auth/login');
//       return;
//     }

//     setSearching(true);
//     setSelectedService(serviceType);
//     setExpandedService(serviceType);

//     try {
//       const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
//       const response = await fetch(`${apiUrl}/api/find-nearby`, {
//         method: 'POST',
//         headers: { 
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}` // ✅ Added Authorization Header
//         },
//         body: JSON.stringify({
//           lat: userLocation.lat,
//           lon: userLocation.lng,
//           type: serviceType === 'fire' ? 'fire_station' : serviceType
//         }),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         setNearbyServices(prev => ({ ...prev, [serviceType]: data }));
//         setMapHtml(data.map_html || '');
//         setShowMap(true);
//       } else {
//         // ✅ Added 401 Unauthorized handling
//         if (response.status === 401) {
//             localStorage.removeItem('auth_token');
//             router.push('/auth/login');
//             return;
//         }
//         throw new Error(data.error || 'Backend error');
//       }
//     } catch (error) {
//       console.error("Fetch error:", error);
//       // Fallback Logic for Directions and Details
//       const mockServices: Record<string, any> = {
//         police: { name: 'Nearest Police Station', lat: 0.01, lon: 0.01, phone: '100', color: 'blue' },
//         hospital: { name: 'City Hospital', lat: -0.02, lon: 0.02, phone: '102', color: 'red' },
//         fire: { name: 'Fire Station', lat: 0.02, lon: -0.01, phone: '101', color: 'orange' }
//       };

//       const selected = mockServices[serviceType];
//       const destLat = userLocation.lat + (selected?.lat || 0);
//       const destLon = userLocation.lng + (selected?.lon || 0);

//       setNearbyServices(prev => ({
//         ...prev,
//         [serviceType]: {
//           name: selected?.name || 'Service Found',
//           distance: 1.8,
//           phone: selected?.phone || '112',
//           address: 'Locality Center, Your City',
//           lat: destLat,
//           lon: destLon,
//           directions_url: `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${destLat},${destLon}`
//         }
//       }));
//       setShowMap(true);
//     } finally {
//       setSearching(false);
//     }
//   };

//   const handleAiAnalysis = async () => {
//     if (!aiDescription.trim()) return alert('Describe the situation');
//     setAiLoading(true);
    
//     setTimeout(() => {
//       const desc = aiDescription.toLowerCase();
//       let severity: AiAnalysisResult['severity'] = 'MEDIUM';
//       let services = ['hospital'];

//       if (desc.includes('fire') || desc.includes('unconscious') || desc.includes('bleeding')) {
//         severity = 'CRITICAL';
//         services = ['hospital', 'police', 'fire'];
//       }

//       setAiAnalysis({
//         severity,
//         recommendation: severity === 'CRITICAL' ? 'CALL 112 IMMEDIATELY!' : 'Contact emergency services',
//         services_needed: services
//       });
//       setAiLoading(false);
//     }, 1200);
//   };

//   if (authChecking) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 to-blue-700">
//         <Loader className="h-10 w-10 animate-spin text-white" />
//       </div>
//     );
//   }

//   return (
//     <main className="min-h-screen flex flex-col bg-background">
      
//       {/* Hero Section */}
//       <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/10 pt-16 pb-12">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
//             <div>
//               <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent leading-tight">
//                 Safety at Every Step
//               </h1>
//               <p className="text-lg text-foreground/70 mb-8 leading-relaxed">
//                 Access emergency services instantly, locate nearby hospitals, police stations, and fire departments. Keep your loved ones safe with AI-powered emergency response.
//               </p>
//               <div className="flex flex-col sm:flex-row gap-4">
//                 <button
//                   onClick={() => callEmergency(INDIA_EMERGENCY_NUMBERS.all)}
//                   className="px-8 py-3 bg-gradient-to-r from-destructive to-orange-500 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
//                 >
//                   <AlertCircle size={20} />
//                   Emergency Call ({INDIA_EMERGENCY_NUMBERS.all})
//                 </button>
//                 <Link
//                   href="/emergency-contacts"
//                   className="px-8 py-3 border-2 border-primary text-primary font-semibold rounded-lg hover:bg-primary/5 transition-colors text-center"
//                 >
//                   My Contacts
//                 </Link>
//               </div>
//             </div>
//             <div className="relative h-64 md:h-96 rounded-xl overflow-hidden shadow-2xl bg-muted">
//               {!loading && userLocation ? (
//                 <MapComponent location={userLocation} />
//               ) : (
//                 <div className="w-full h-full flex flex-col items-center justify-center">
//                   <Clock className="mx-auto mb-2 text-muted-foreground animate-spin" size={32} />
//                   <p className="text-muted-foreground">Loading map...</p>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Quick Emergency Numbers */}
//       <section className="py-8 bg-card border-b border-border">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <h3 className="text-xl font-bold mb-6 text-center text-foreground">Quick Emergency Numbers (India)</h3>
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//             {[
//               { name: 'Police', number: INDIA_EMERGENCY_NUMBERS.police, color: 'from-blue-600 to-blue-700' },
//               { name: 'Ambulance', number: INDIA_EMERGENCY_NUMBERS.ambulance, color: 'from-red-600 to-red-700' },
//               { name: 'Fire', number: INDIA_EMERGENCY_NUMBERS.fire, color: 'from-orange-600 to-orange-700' },
//               { name: 'All Services', number: INDIA_EMERGENCY_NUMBERS.all, color: 'from-primary to-secondary' }
//             ].map((service) => (
//               <button
//                 key={service.number}
//                 onClick={() => callEmergency(service.number)}
//                 className={`p-4 bg-gradient-to-br ${service.color} text-white rounded-lg hover:shadow-lg transition-all hover:scale-105`}
//               >
//                 <div className="text-2xl font-bold">{service.number}</div>
//                 <div className="text-sm">{service.name}</div>
//               </button>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* AI Smart Alert Section */}
//       <section className="py-12 bg-gradient-to-r from-secondary/10 to-primary/10 border-b border-primary/20">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex items-start gap-4">
//             <Brain className="w-8 h-8 text-secondary flex-shrink-0 mt-1" />
//             <div className="flex-1">
//               <h2 className="text-2xl font-bold text-foreground mb-2 flex items-center gap-2">
//                 <Zap size={24} />
//                 AI-Powered Emergency Analysis
//               </h2>
//               <p className="text-foreground/70 mb-4">Describe your emergency and let AI analyze the severity and recommend actions.</p>
//               {!showAiInput ? (
//                 <Button
//                   onClick={() => setShowAiInput(true)}
//                   className="bg-secondary hover:bg-secondary/90 text-white"
//                 >
//                   Describe Your Emergency
//                 </Button>
//               ) : (
//                 <div className="space-y-3 mt-3">
//                   <textarea
//                     value={aiDescription}
//                     onChange={(e) => setAiDescription(e.target.value)}
//                     placeholder="Describe what's happening... (e.g., 'Person injured in car accident', 'Fire in building')"
//                     className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-secondary"
//                     rows={3}
//                   />
//                   <div className="flex gap-2">
//                     <Button
//                       onClick={handleAiAnalysis}
//                       disabled={aiLoading}
//                       className="bg-secondary hover:bg-secondary/90 text-white disabled:opacity-50"
//                     >
//                       {aiLoading ? <Loader className="animate-spin mr-2" size={16} /> : <Brain size={16} className="mr-2" />}
//                       Analyze with AI
//                     </Button>
//                     <Button
//                       onClick={() => { setShowAiInput(false); setAiAnalysis(null); setAiDescription(''); }}
//                       variant="outline"
//                       className="border-secondary text-secondary hover:bg-secondary/10"
//                     >
//                       Cancel
//                     </Button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* AI Analysis Results */}
//           {aiAnalysis && (
//             <div className="mt-6 p-6 bg-card rounded-xl border border-secondary/30">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//                 <div>
//                   <p className="text-sm font-semibold text-foreground mb-2">Severity Level:</p>
//                   <p className={`text-2xl font-bold flex items-center gap-2 ${
//                     aiAnalysis.severity === 'CRITICAL' ? 'text-destructive' :
//                     aiAnalysis.severity === 'HIGH' ? 'text-orange-500' :
//                     aiAnalysis.severity === 'MEDIUM' ? 'text-yellow-500' : 'text-green-500'
//                   }`}>
//                     <AlertCircle size={24} /> {aiAnalysis.severity}
//                   </p>
//                 </div>
//                 <div>
//                   <p className="text-sm font-semibold text-foreground mb-2">Recommendation:</p>
//                   <p className="text-foreground/70">{aiAnalysis.recommendation}</p>
//                 </div>
//               </div>
//               {aiAnalysis.services_needed && (
//                 <div>
//                   <p className="text-sm font-semibold text-foreground mb-3">Contact These Services:</p>
//                   <div className="space-y-2">
//                     {aiAnalysis.services_needed.map((service) => (
//                       <button
//                         key={service}
//                         onClick={() => findNearestService(service)}
//                         className="w-full px-4 py-2 text-left bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors font-semibold flex items-center justify-between"
//                       >
//                         <span>Find Nearest {service.charAt(0).toUpperCase() + service.slice(1)}</span>
//                         <MapPin size={16} />
//                       </button>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       </section>

//       {/* Emergency Services Section */}
//       <section className="py-16 bg-background">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <h2 className="text-4xl font-bold mb-4 text-center bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
//             Find Nearest Services
//           </h2>
//           <p className="text-center text-foreground/70 mb-12">Locate nearest police station, hospital, or fire department in seconds</p>
          
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             {/* Police */}
//             <div className="p-8 bg-card rounded-xl border border-border hover:shadow-lg transition-all cursor-pointer" onClick={() => findNearestService('police')}>
//               <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
//                 <AlertCircle size={28} className="text-blue-600 dark:text-blue-400" />
//               </div>
//               <h3 className="text-2xl font-bold mb-2">Police Stations</h3>
//               <p className="text-foreground/70 mb-6">Report crimes or seek emergency assistance</p>
//               <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
//                 {searching && selectedService === 'police' ? <Loader className="animate-spin mr-2" size={16} /> : <MapPin className="mr-2" size={16} />}
//                 Find Nearest Police Station
//               </Button>
//               {nearbyServices.police && expandedService === 'police' && (
//                 <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200">
//                   <div className="flex justify-between mb-2">
//                     <span className="font-bold text-sm">{nearbyServices.police.name}</span>
//                     <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs">{nearbyServices.police.distance} km</span>
//                   </div>
//                   <div className="flex gap-2">
//                     <Button size="sm" className="flex-1 bg-blue-600" onClick={(e) => { e.stopPropagation(); callEmergency(nearbyServices.police.phone); }}>
//                       <Phone size={14} className="mr-1"/> Call
//                     </Button>
//                     <a href={nearbyServices.police.directions_url} target="_blank" className="flex-1 bg-white border border-blue-600 text-blue-600 text-sm py-2 rounded text-center font-bold flex items-center justify-center gap-1">
//                       <Navigation size={14}/> Direction
//                     </a>
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Hospital */}
//             <div className="p-8 bg-card rounded-xl border border-border hover:shadow-lg transition-all cursor-pointer" onClick={() => findNearestService('hospital')}>
//               <div className="w-14 h-14 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center mb-4">
//                 <Heart size={28} className="text-red-600 dark:text-red-400" />
//               </div>
//               <h3 className="text-2xl font-bold mb-2">Hospitals</h3>
//               <p className="text-foreground/70 mb-6">Get medical assistance and treatment</p>
//               <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
//                 {searching && selectedService === 'hospital' ? <Loader className="animate-spin mr-2" size={16} /> : <MapPin className="mr-2" size={16} />}
//                 Find Nearest Hospital
//               </Button>
//               {nearbyServices.hospital && expandedService === 'hospital' && (
//                 <div className="mt-4 p-4 bg-red-50 dark:bg-red-950 rounded-lg border border-red-200">
//                    <div className="flex justify-between mb-2">
//                     <span className="font-bold text-sm">{nearbyServices.hospital.name}</span>
//                     <span className="bg-red-600 text-white px-2 py-1 rounded text-xs">{nearbyServices.hospital.distance} km</span>
//                   </div>
//                   <div className="flex gap-2">
//                     <Button size="sm" className="flex-1 bg-red-600" onClick={(e) => { e.stopPropagation(); callEmergency(nearbyServices.hospital.phone); }}>
//                       <Phone size={14} className="mr-1"/> Call
//                     </Button>
//                     <a href={nearbyServices.hospital.directions_url} target="_blank" className="flex-1 bg-white border border-red-600 text-red-600 text-sm py-2 rounded text-center font-bold flex items-center justify-center gap-1">
//                       <Navigation size={14}/> Direction
//                     </a>
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Fire */}
//             <div className="p-8 bg-card rounded-xl border border-border hover:shadow-lg transition-all cursor-pointer" onClick={() => findNearestService('fire')}>
//               <div className="w-14 h-14 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mb-4">
//                 <Zap size={28} className="text-orange-600 dark:text-orange-400" />
//               </div>
//               <h3 className="text-2xl font-bold mb-2">Fire Stations</h3>
//               <p className="text-foreground/70 mb-6">Fire safety and rescue services</p>
//               <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white">
//                 {searching && selectedService === 'fire' ? <Loader className="animate-spin mr-2" size={16} /> : <MapPin className="mr-2" size={16} />}
//                 Find Nearest Fire Station
//               </Button>
//               {nearbyServices.fire && expandedService === 'fire' && (
//                 <div className="mt-4 p-4 bg-orange-50 dark:bg-orange-950 rounded-lg border border-orange-200">
//                   <div className="flex justify-between mb-2">
//                     <span className="font-bold text-sm">{nearbyServices.fire.name}</span>
//                     <span className="bg-orange-600 text-white px-2 py-1 rounded text-xs">{nearbyServices.fire.distance} km</span>
//                   </div>
//                   <div className="flex gap-2">
//                     <Button size="sm" className="flex-1 bg-orange-600" onClick={(e) => { e.stopPropagation(); callEmergency(nearbyServices.fire.phone); }}>
//                       <Phone size={14} className="mr-1"/> Call
//                     </Button>
//                     <a href={nearbyServices.fire.directions_url} target="_blank" className="flex-1 bg-white border border-orange-600 text-orange-600 text-sm py-2 rounded text-center font-bold flex items-center justify-center gap-1">
//                       <Navigation size={14}/> Direction
//                     </a>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Map Display */}
//       {showMap && mapHtml && (
//         <section className="py-12 bg-muted/50 border-t border-border">
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//             <h2 className="text-3xl font-bold mb-6">Interactive Map</h2>
//             <div className="rounded-xl overflow-hidden shadow-xl border border-border" dangerouslySetInnerHTML={{ __html: mapHtml }} />
//           </div>
//         </section>
//       )}

//       {/* Safety Tips Section */}
//       <section className="py-16 bg-gradient-to-r from-primary/5 to-secondary/5 border-t border-border">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <h2 className="text-3xl font-bold mb-12 text-center">Essential Safety Tips</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {[
//               { title: 'Stay Calm', desc: 'Keep your mind clear during emergencies. Take deep breaths and assess the situation.' },
//               { title: 'Call Immediately', desc: 'Ring 112 or specific emergency numbers (100, 101, 102) as soon as possible.' },
//               { title: 'Share Location', desc: 'Enable location sharing with emergency contacts for faster assistance.' },
//               { title: 'First Aid Ready', desc: 'Keep basic first aid supplies and know how to use them.' }
//             ].map((tip, i) => (
//               <div key={i} className="p-6 bg-card rounded-lg border border-border hover:shadow-md transition-shadow">
//                 <div className="flex items-start gap-4">
//                   <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
//                   <div>
//                     <h3 className="font-bold text-foreground mb-2">{tip.title}</h3>
//                     <p className="text-foreground/70">{tip.desc}</p>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>
//     </main>
//   );
// }
















// 'use client';

// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import Link from 'next/link';
// import MapComponent from '@/components/map-component';
// import { 
//   AlertCircle, MapPin, Phone, Clock, Heart, Navigation, Loader, 
//   ShieldAlert, Zap, Brain, ExternalLink, CheckCircle, User 
// } from 'lucide-react';
// import { Button } from '@/components/ui/button';

// // --- Interfaces ---
// interface EmergencyContact {
//   name: string;
//   phone: string;
//   relation?: string;
// }

// interface ServiceDetails {
//   name: string;
//   distance: number;
//   phone: string;
//   address: string;
//   lat: number;
//   lon: number;
//   directions_url: string;
// }

// interface NearbyServicesState {
//   [key: string]: ServiceDetails;
// }

// interface AiAnalysisResult {
//   severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
//   recommendation: string;
//   services_needed: string[];
// }

// const INDIA_EMERGENCY_NUMBERS = {
//   police: '100',
//   ambulance: '102',
//   fire: '101',
//   all: '112'
// };

// export default function DashboardPage() {
//   const router = useRouter();

//   // --- State ---
//   const [authChecking, setAuthChecking] = useState(true);
//   const [userName, setUserName] = useState<string | null>(null); // Added for user name functionality
//   const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([]);
//   const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [nearbyServices, setNearbyServices] = useState<NearbyServicesState>({});
//   const [searching, setSearching] = useState(false);
//   const [selectedService, setSelectedService] = useState<string>('');
//   const [aiAnalysis, setAiAnalysis] = useState<AiAnalysisResult | null>(null);
//   const [showAiInput, setShowAiInput] = useState(false);
//   const [aiDescription, setAiDescription] = useState('');
//   const [aiLoading, setAiLoading] = useState(false);
//   const [mapHtml, setMapHtml] = useState<string>('');
//   const [showMap, setShowMap] = useState(false);
//   const [expandedService, setExpandedService] = useState<string | null>(null);

//   // --- Auth & Data Initialization ---
//   useEffect(() => {
//     // 1. Give the browser 100ms to ensure LocalStorage is synced
//     const checkAuth = () => {
//       const token = localStorage.getItem('auth_token');
//       const name = localStorage.getItem('user_name'); // Attempt to get stored name
      
//       if (!token) {
//         console.log("Dashboard: No token found, redirecting to landing...");
//         router.push('/auth/landing');
//       } else {
//         console.log("Dashboard: Token found, access granted.");
//         setUserName(name || "User"); // Fallback to "User" if name isn't found
//         setAuthChecking(false);
//       }
//     };

//     const timeoutId = setTimeout(checkAuth, 100);

//     // 2. Load Location
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
//           setLoading(false);
//         },
//         () => {
//           setUserLocation({ lat: 28.6139, lng: 77.2090 }); 
//           setLoading(false);
//         }
//       );
//     }

//     // 3. Load Contacts
//     const saved = localStorage.getItem('emergencyContacts');
//     if (saved) {
//       try { setEmergencyContacts(JSON.parse(saved)); } catch (e) { console.error(e); }
//     }

//     return () => clearTimeout(timeoutId);
//   }, [router]);

//   // --- Logic Functions ---
//   const callEmergency = (number: string) => {
//     window.location.href = `tel:${number}`;
//   };

//   const findNearestService = async (serviceType: string) => {
//     if (!userLocation) return alert('Please enable location services');

//     const token = localStorage.getItem('auth_token'); 
//     if (!token) {
//       alert("Session expired. Please log in again.");
//       router.push('/auth/login');
//       return;
//     }

//     setSearching(true);
//     setSelectedService(serviceType);
//     setExpandedService(serviceType);

//     try {
//       const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
//       const response = await fetch(`${apiUrl}/api/find-nearby`, {
//         method: 'POST',
//         headers: { 
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}` 
//         },
//         body: JSON.stringify({
//           lat: userLocation.lat,
//           lon: userLocation.lng,
//           type: serviceType === 'fire' ? 'fire_station' : serviceType
//         }),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         setNearbyServices(prev => ({ ...prev, [serviceType]: data }));
//         setMapHtml(data.map_html || '');
//         setShowMap(true);
//       } else {
//         if (response.status === 401) {
//             localStorage.removeItem('auth_token');
//             router.push('/auth/login');
//             return;
//         }
//         throw new Error(data.error || 'Backend error');
//       }
//     } catch (error) {
//       console.error("Fetch error:", error);
//       const mockServices: Record<string, any> = {
//         police: { name: 'Nearest Police Station', lat: 0.01, lon: 0.01, phone: '100', color: 'blue' },
//         hospital: { name: 'City Hospital', lat: -0.02, lon: 0.02, phone: '102', color: 'red' },
//         fire: { name: 'Fire Station', lat: 0.02, lon: -0.01, phone: '101', color: 'orange' }
//       };

//       const selected = mockServices[serviceType];
//       const destLat = userLocation.lat + (selected?.lat || 0);
//       const destLon = userLocation.lng + (selected?.lon || 0);

//       setNearbyServices(prev => ({
//         ...prev,
//         [serviceType]: {
//           name: selected?.name || 'Service Found',
//           distance: 1.8,
//           phone: selected?.phone || '112',
//           address: 'Locality Center, Your City',
//           lat: destLat,
//           lon: destLon,
//           directions_url: `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${destLat},${destLon}`
//         }
//       }));
//       setShowMap(true);
//     } finally {
//       setSearching(false);
//     }
//   };

//   const handleAiAnalysis = async () => {
//     if (!aiDescription.trim()) return alert('Describe the situation');
//     setAiLoading(true);
    
//     setTimeout(() => {
//       const desc = aiDescription.toLowerCase();
//       let severity: AiAnalysisResult['severity'] = 'MEDIUM';
//       let services = ['hospital'];

//       if (desc.includes('fire') || desc.includes('unconscious') || desc.includes('bleeding')) {
//         severity = 'CRITICAL';
//         services = ['hospital', 'police', 'fire'];
//       }

//       setAiAnalysis({
//         severity,
//         recommendation: severity === 'CRITICAL' ? 'CALL 112 IMMEDIATELY!' : 'Contact emergency services',
//         services_needed: services
//       });
//       setAiLoading(false);
//     }, 1200);
//   };

//   if (authChecking) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 to-blue-700">
//         <Loader className="h-10 w-10 animate-spin text-white" />
//       </div>
//     );
//   }

//   return (
//     <main className="min-h-screen flex flex-col bg-background">
      
//       {/* Hero Section */}
//       <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/10 pt-16 pb-12">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//           {/* User Welcome Badge */}
//           <div className="mb-6 flex items-center gap-2 bg-primary/10 w-fit px-4 py-1.5 rounded-full border border-primary/20">
//             <User size={16} className="text-primary" />
//             <span className="text-sm font-medium text-primary">Welcome back, {userName}</span>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
//             <div>
//               <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent leading-tight">
//                 Safety at Every Step
//               </h1>
//               <p className="text-lg text-foreground/70 mb-8 leading-relaxed">
//                 Access emergency services instantly, locate nearby hospitals, police stations, and fire departments. Keep your loved ones safe with AI-powered emergency response.
//               </p>
//               <div className="flex flex-col sm:flex-row gap-4">
//                 <button
//                   onClick={() => callEmergency(INDIA_EMERGENCY_NUMBERS.all)}
//                   className="px-8 py-3 bg-gradient-to-r from-destructive to-orange-500 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
//                 >
//                   <AlertCircle size={20} />
//                   Emergency Call ({INDIA_EMERGENCY_NUMBERS.all})
//                 </button>
//                 <Link
//                   href="/emergency-contacts"
//                   className="px-8 py-3 border-2 border-primary text-primary font-semibold rounded-lg hover:bg-primary/5 transition-colors text-center"
//                 >
//                   My Contacts
//                 </Link>
//               </div>
//             </div>
//             <div className="relative h-64 md:h-96 rounded-xl overflow-hidden shadow-2xl bg-muted">
//               {!loading && userLocation ? (
//                 <MapComponent location={userLocation} />
//               ) : (
//                 <div className="w-full h-full flex flex-col items-center justify-center">
//                   <Clock className="mx-auto mb-2 text-muted-foreground animate-spin" size={32} />
//                   <p className="text-muted-foreground">Loading map...</p>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Quick Emergency Numbers */}
//       <section className="py-8 bg-card border-b border-border">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <h3 className="text-xl font-bold mb-6 text-center text-foreground">Quick Emergency Numbers (India)</h3>
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//             {[
//               { name: 'Police', number: INDIA_EMERGENCY_NUMBERS.police, color: 'from-blue-600 to-blue-700' },
//               { name: 'Ambulance', number: INDIA_EMERGENCY_NUMBERS.ambulance, color: 'from-red-600 to-red-700' },
//               { name: 'Fire', number: INDIA_EMERGENCY_NUMBERS.fire, color: 'from-orange-600 to-orange-700' },
//               { name: 'All Services', number: INDIA_EMERGENCY_NUMBERS.all, color: 'from-primary to-secondary' }
//             ].map((service) => (
//               <button
//                 key={service.number}
//                 onClick={() => callEmergency(service.number)}
//                 className={`p-4 bg-gradient-to-br ${service.color} text-white rounded-lg hover:shadow-lg transition-all hover:scale-105`}
//               >
//                 <div className="text-2xl font-bold">{service.number}</div>
//                 <div className="text-sm">{service.name}</div>
//               </button>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* AI Smart Alert Section */}
//       <section className="py-12 bg-gradient-to-r from-secondary/10 to-primary/10 border-b border-primary/20">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex items-start gap-4">
//             <Brain className="w-8 h-8 text-secondary flex-shrink-0 mt-1" />
//             <div className="flex-1">
//               <h2 className="text-2xl font-bold text-foreground mb-2 flex items-center gap-2">
//                 <Zap size={24} />
//                 AI-Powered Emergency Analysis
//               </h2>
//               <p className="text-foreground/70 mb-4">Describe your emergency and let AI analyze the severity and recommend actions.</p>
//               {!showAiInput ? (
//                 <Button
//                   onClick={() => setShowAiInput(true)}
//                   className="bg-secondary hover:bg-secondary/90 text-white"
//                 >
//                   Describe Your Emergency
//                 </Button>
//               ) : (
//                 <div className="space-y-3 mt-3">
//                   <textarea
//                     value={aiDescription}
//                     onChange={(e) => setAiDescription(e.target.value)}
//                     placeholder="Describe what's happening... (e.g., 'Person injured in car accident', 'Fire in building')"
//                     className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-secondary"
//                     rows={3}
//                   />
//                   <div className="flex gap-2">
//                     <Button
//                       onClick={handleAiAnalysis}
//                       disabled={aiLoading}
//                       className="bg-secondary hover:bg-secondary/90 text-white disabled:opacity-50"
//                     >
//                       {aiLoading ? <Loader className="animate-spin mr-2" size={16} /> : <Brain size={16} className="mr-2" />}
//                       Analyze with AI
//                     </Button>
//                     <Button
//                       onClick={() => { setShowAiInput(false); setAiAnalysis(null); setAiDescription(''); }}
//                       variant="outline"
//                       className="border-secondary text-secondary hover:bg-secondary/10"
//                     >
//                       Cancel
//                     </Button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* AI Analysis Results */}
//           {aiAnalysis && (
//             <div className="mt-6 p-6 bg-card rounded-xl border border-secondary/30">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//                 <div>
//                   <p className="text-sm font-semibold text-foreground mb-2">Severity Level:</p>
//                   <p className={`text-2xl font-bold flex items-center gap-2 ${
//                     aiAnalysis.severity === 'CRITICAL' ? 'text-destructive' :
//                     aiAnalysis.severity === 'HIGH' ? 'text-orange-500' :
//                     aiAnalysis.severity === 'MEDIUM' ? 'text-yellow-500' : 'text-green-500'
//                   }`}>
//                     <AlertCircle size={24} /> {aiAnalysis.severity}
//                   </p>
//                 </div>
//                 <div>
//                   <p className="text-sm font-semibold text-foreground mb-2">Recommendation:</p>
//                   <p className="text-foreground/70">{aiAnalysis.recommendation}</p>
//                 </div>
//               </div>
//               {aiAnalysis.services_needed && (
//                 <div>
//                   <p className="text-sm font-semibold text-foreground mb-3">Contact These Services:</p>
//                   <div className="space-y-2">
//                     {aiAnalysis.services_needed.map((service) => (
//                       <button
//                         key={service}
//                         onClick={() => findNearestService(service)}
//                         className="w-full px-4 py-2 text-left bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors font-semibold flex items-center justify-between"
//                       >
//                         <span>Find Nearest {service.charAt(0).toUpperCase() + service.slice(1)}</span>
//                         <MapPin size={16} />
//                       </button>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       </section>

//       {/* Emergency Services Section */}
//       <section className="py-16 bg-background">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <h2 className="text-4xl font-bold mb-4 text-center bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
//             Find Nearest Services
//           </h2>
//           <p className="text-center text-foreground/70 mb-12">Locate nearest police station, hospital, or fire department in seconds</p>
          
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             {/* Police */}
//             <div className="p-8 bg-card rounded-xl border border-border hover:shadow-lg transition-all cursor-pointer" onClick={() => findNearestService('police')}>
//               <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
//                 <AlertCircle size={28} className="text-blue-600 dark:text-blue-400" />
//               </div>
//               <h3 className="text-2xl font-bold mb-2">Police Stations</h3>
//               <p className="text-foreground/70 mb-6">Report crimes or seek emergency assistance</p>
//               <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
//                 {searching && selectedService === 'police' ? <Loader className="animate-spin mr-2" size={16} /> : <MapPin className="mr-2" size={16} />}
//                 Find Nearest Police Station
//               </Button>
//               {nearbyServices.police && expandedService === 'police' && (
//                 <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200">
//                   <div className="flex justify-between mb-2">
//                     <span className="font-bold text-sm">{nearbyServices.police.name}</span>
//                     <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs">{nearbyServices.police.distance} km</span>
//                   </div>
//                   <div className="flex gap-2">
//                     <Button size="sm" className="flex-1 bg-blue-600" onClick={(e) => { e.stopPropagation(); callEmergency(nearbyServices.police.phone); }}>
//                       <Phone size={14} className="mr-1"/> Call
//                     </Button>
//                     <a href={nearbyServices.police.directions_url} target="_blank" className="flex-1 bg-white border border-blue-600 text-blue-600 text-sm py-2 rounded text-center font-bold flex items-center justify-center gap-1">
//                       <Navigation size={14}/> Direction
//                     </a>
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Hospital */}
//             <div className="p-8 bg-card rounded-xl border border-border hover:shadow-lg transition-all cursor-pointer" onClick={() => findNearestService('hospital')}>
//               <div className="w-14 h-14 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center mb-4">
//                 <Heart size={28} className="text-red-600 dark:text-red-400" />
//               </div>
//               <h3 className="text-2xl font-bold mb-2">Hospitals</h3>
//               <p className="text-foreground/70 mb-6">Get medical assistance and treatment</p>
//               <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
//                 {searching && selectedService === 'hospital' ? <Loader className="animate-spin mr-2" size={16} /> : <MapPin className="mr-2" size={16} />}
//                 Find Nearest Hospital
//               </Button>
//               {nearbyServices.hospital && expandedService === 'hospital' && (
//                 <div className="mt-4 p-4 bg-red-50 dark:bg-red-950 rounded-lg border border-red-200">
//                    <div className="flex justify-between mb-2">
//                     <span className="font-bold text-sm">{nearbyServices.hospital.name}</span>
//                     <span className="bg-red-600 text-white px-2 py-1 rounded text-xs">{nearbyServices.hospital.distance} km</span>
//                   </div>
//                   <div className="flex gap-2">
//                     <Button size="sm" className="flex-1 bg-red-600" onClick={(e) => { e.stopPropagation(); callEmergency(nearbyServices.hospital.phone); }}>
//                       <Phone size={14} className="mr-1"/> Call
//                     </Button>
//                     <a href={nearbyServices.hospital.directions_url} target="_blank" className="flex-1 bg-white border border-red-600 text-red-600 text-sm py-2 rounded text-center font-bold flex items-center justify-center gap-1">
//                       <Navigation size={14}/> Direction
//                     </a>
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Fire */}
//             <div className="p-8 bg-card rounded-xl border border-border hover:shadow-lg transition-all cursor-pointer" onClick={() => findNearestService('fire')}>
//               <div className="w-14 h-14 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mb-4">
//                 <Zap size={28} className="text-orange-600 dark:text-orange-400" />
//               </div>
//               <h3 className="text-2xl font-bold mb-2">Fire Stations</h3>
//               <p className="text-foreground/70 mb-6">Fire safety and rescue services</p>
//               <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white">
//                 {searching && selectedService === 'fire' ? <Loader className="animate-spin mr-2" size={16} /> : <MapPin className="mr-2" size={16} />}
//                 Find Nearest Fire Station
//               </Button>
//               {nearbyServices.fire && expandedService === 'fire' && (
//                 <div className="mt-4 p-4 bg-orange-50 dark:bg-orange-950 rounded-lg border border-orange-200">
//                   <div className="flex justify-between mb-2">
//                     <span className="font-bold text-sm">{nearbyServices.fire.name}</span>
//                     <span className="bg-orange-600 text-white px-2 py-1 rounded text-xs">{nearbyServices.fire.distance} km</span>
//                   </div>
//                   <div className="flex gap-2">
//                     <Button size="sm" className="flex-1 bg-orange-600" onClick={(e) => { e.stopPropagation(); callEmergency(nearbyServices.fire.phone); }}>
//                       <Phone size={14} className="mr-1"/> Call
//                     </Button>
//                     <a href={nearbyServices.fire.directions_url} target="_blank" className="flex-1 bg-white border border-orange-600 text-orange-600 text-sm py-2 rounded text-center font-bold flex items-center justify-center gap-1">
//                       <Navigation size={14}/> Direction
//                     </a>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Map Display */}
//       {showMap && mapHtml && (
//         <section className="py-12 bg-muted/50 border-t border-border">
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//             <h2 className="text-3xl font-bold mb-6">Interactive Map</h2>
//             <div className="rounded-xl overflow-hidden shadow-xl border border-border" dangerouslySetInnerHTML={{ __html: mapHtml }} />
//           </div>
//         </section>
//       )}

//       {/* Safety Tips Section */}
//       <section className="py-16 bg-gradient-to-r from-primary/5 to-secondary/5 border-t border-border">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <h2 className="text-3xl font-bold mb-12 text-center">Essential Safety Tips</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {[
//               { title: 'Stay Calm', desc: 'Keep your mind clear during emergencies. Take deep breaths and assess the situation.' },
//               { title: 'Call Immediately', desc: 'Ring 112 or specific emergency numbers (100, 101, 102) as soon as possible.' },
//               { title: 'Share Location', desc: 'Enable location sharing with emergency contacts for faster assistance.' },
//               { title: 'First Aid Ready', desc: 'Keep basic first aid supplies and know how to use them.' }
//             ].map((tip, i) => (
//               <div key={i} className="p-6 bg-card rounded-lg border border-border hover:shadow-md transition-shadow">
//                 <div className="flex items-start gap-4">
//                   <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
//                   <div>
//                     <h3 className="font-bold text-foreground mb-2">{tip.title}</h3>
//                     <p className="text-foreground/70">{tip.desc}</p>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>
//     </main>
//   );
// }



// 'use client';

// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import Link from 'next/link';
// import MapComponent from '@/components/map-component';
// import { 
//   AlertCircle, MapPin, Phone, Clock, Heart, Navigation, Loader, 
//   ShieldAlert, Zap, Brain, ExternalLink, CheckCircle, User 
// } from 'lucide-react';
// import { Button } from '@/components/ui/button';

// // --- Interfaces ---
// interface EmergencyContact {
//   name: string;
//   phone: string;
//   relation?: string;
// }

// interface ServiceDetails {
//   name: string;
//   distance: number;
//   phone: string;
//   address: string;
//   lat: number;
//   lon: number;
//   directions_url: string;
// }

// interface NearbyServicesState {
//   [key: string]: ServiceDetails;
// }

// interface AiAnalysisResult {
//   severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
//   recommendation: string;
//   services_needed: string[];
// }

// const INDIA_EMERGENCY_NUMBERS = {
//   police: '100',
//   ambulance: '102',
//   fire: '101',
//   all: '112'
// };

// export default function DashboardPage() {
//   const router = useRouter();

//   // --- State ---
//   const [authChecking, setAuthChecking] = useState(true);
//   const [userName, setUserName] = useState<string | null>(null);
//   const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([]);
//   const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [nearbyServices, setNearbyServices] = useState<NearbyServicesState>({});
//   const [searching, setSearching] = useState(false);
//   const [selectedService, setSelectedService] = useState<string>('');
//   const [aiAnalysis, setAiAnalysis] = useState<AiAnalysisResult | null>(null);
//   const [showAiInput, setShowAiInput] = useState(false);
//   const [aiDescription, setAiDescription] = useState('');
//   const [aiLoading, setAiLoading] = useState(false);
//   const [mapHtml, setMapHtml] = useState<string>('');
//   const [showMap, setShowMap] = useState(false);
//   const [expandedService, setExpandedService] = useState<string | null>(null);

//   // --- Auth & Data Initialization ---
//   useEffect(() => {
//     // 1. Give the browser 100ms to ensure LocalStorage is synced
//     const checkAuth = () => {
//       const token = localStorage.getItem('auth_token');
//       const storedName = localStorage.getItem('user_name');
      
//       if (!token) {
//         console.log("Dashboard: No token found, redirecting to landing...");
//         router.push('/auth/landing');
//       } else {
//         console.log("Dashboard: Token found, access granted.");
//         // Logic to ensure "User" is replaced by the actual name
//         setUserName(storedName || "Guest"); 
//         setAuthChecking(false);
//       }
//     };

//     const timeoutId = setTimeout(checkAuth, 100);

//     // 2. Load Location
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
//           setLoading(false);
//         },
//         () => {
//           setUserLocation({ lat: 28.6139, lng: 77.2090 }); 
//           setLoading(false);
//         }
//       );
//     }

//     // 3. Load Contacts
//     const saved = localStorage.getItem('emergencyContacts');
//     if (saved) {
//       try { setEmergencyContacts(JSON.parse(saved)); } catch (e) { console.error(e); }
//     }

//     return () => clearTimeout(timeoutId);
//   }, [router]);

//   // --- Logic Functions ---
//   const callEmergency = (number: string) => {
//     window.location.href = `tel:${number}`;
//   };

//   const findNearestService = async (serviceType: string) => {
//     if (!userLocation) return alert('Please enable location services');

//     const token = localStorage.getItem('auth_token'); 
//     if (!token) {
//       alert("Session expired. Please log in again.");
//       router.push('/auth/login');
//       return;
//     }

//     setSearching(true);
//     setSelectedService(serviceType);
//     setExpandedService(serviceType);

//     try {
//       const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
//       const response = await fetch(`${apiUrl}/api/find-nearby`, {
//         method: 'POST',
//         headers: { 
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}` 
//         },
//         body: JSON.stringify({
//           lat: userLocation.lat,
//           lon: userLocation.lng,
//           type: serviceType === 'fire' ? 'fire_station' : serviceType
//         }),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         setNearbyServices(prev => ({ ...prev, [serviceType]: data }));
//         setMapHtml(data.map_html || '');
//         setShowMap(true);
//       } else {
//         if (response.status === 401) {
//             localStorage.removeItem('auth_token');
//             router.push('/auth/login');
//             return;
//         }
//         throw new Error(data.error || 'Backend error');
//       }
//     } catch (error) {
//       console.error("Fetch error:", error);
//       const mockServices: Record<string, any> = {
//         police: { name: 'Nearest Police Station', lat: 0.01, lon: 0.01, phone: '100', color: 'blue' },
//         hospital: { name: 'City Hospital', lat: -0.02, lon: 0.02, phone: '102', color: 'red' },
//         fire: { name: 'Fire Station', lat: 0.02, lon: -0.01, phone: '101', color: 'orange' }
//       };

//       const selected = mockServices[serviceType];
//       const destLat = userLocation.lat + (selected?.lat || 0);
//       const destLon = userLocation.lng + (selected?.lon || 0);

//       setNearbyServices(prev => ({
//         ...prev,
//         [serviceType]: {
//           name: selected?.name || 'Service Found',
//           distance: 1.8,
//           phone: selected?.phone || '112',
//           address: 'Locality Center, Your City',
//           lat: destLat,
//           lon: destLon,
//           directions_url: `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${destLat},${destLon}`
//         }
//       }));
//       setShowMap(true);
//     } finally {
//       setSearching(false);
//     }
//   };

//   const handleAiAnalysis = async () => {
//     if (!aiDescription.trim()) return alert('Describe the situation');
//     setAiLoading(true);
    
//     setTimeout(() => {
//       const desc = aiDescription.toLowerCase();
//       let severity: AiAnalysisResult['severity'] = 'MEDIUM';
//       let services = ['hospital'];

//       if (desc.includes('fire') || desc.includes('unconscious') || desc.includes('bleeding')) {
//         severity = 'CRITICAL';
//         services = ['hospital', 'police', 'fire'];
//       }

//       setAiAnalysis({
//         severity,
//         recommendation: severity === 'CRITICAL' ? 'CALL 112 IMMEDIATELY!' : 'Contact emergency services',
//         services_needed: services
//       });
//       setAiLoading(false);
//     }, 1200);
//   };

//   if (authChecking) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 to-blue-700">
//         <Loader className="h-10 w-10 animate-spin text-white" />
//       </div>
//     );
//   }

//   return (
//     <main className="min-h-screen flex flex-col bg-background">
      
//       {/* Hero Section */}
//       <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/10 pt-16 pb-12">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//           {/* User Welcome Badge */}
//           <div className="mb-6 flex items-center gap-2 bg-primary/10 w-fit px-4 py-1.5 rounded-full border border-primary/20">
//             <User size={16} className="text-primary" />
//             <span className="text-sm font-medium text-primary">Welcome back, {userName}</span>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
//             <div>
//               <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent leading-tight">
//                 Safety at Every Step
//               </h1>
//               <p className="text-lg text-foreground/70 mb-8 leading-relaxed">
//                 Access emergency services instantly, locate nearby hospitals, police stations, and fire departments. Keep your loved ones safe with AI-powered emergency response.
//               </p>
//               <div className="flex flex-col sm:flex-row gap-4">
//                 <button
//                   onClick={() => callEmergency(INDIA_EMERGENCY_NUMBERS.all)}
//                   className="px-8 py-3 bg-gradient-to-r from-destructive to-orange-500 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
//                 >
//                   <AlertCircle size={20} />
//                   Emergency Call ({INDIA_EMERGENCY_NUMBERS.all})
//                 </button>
//                 <Link
//                   href="/emergency-contacts"
//                   className="px-8 py-3 border-2 border-primary text-primary font-semibold rounded-lg hover:bg-primary/5 transition-colors text-center"
//                 >
//                   My Contacts
//                 </Link>
//               </div>
//             </div>
//             <div className="relative h-64 md:h-96 rounded-xl overflow-hidden shadow-2xl bg-muted">
//               {!loading && userLocation ? (
//                 <MapComponent location={userLocation} />
//               ) : (
//                 <div className="w-full h-full flex flex-col items-center justify-center">
//                   <Clock className="mx-auto mb-2 text-muted-foreground animate-spin" size={32} />
//                   <p className="text-muted-foreground">Loading map...</p>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Quick Emergency Numbers */}
//       <section className="py-8 bg-card border-b border-border">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <h3 className="text-xl font-bold mb-6 text-center text-foreground">Quick Emergency Numbers (India)</h3>
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//             {[
//               { name: 'Police', number: INDIA_EMERGENCY_NUMBERS.police, color: 'from-blue-600 to-blue-700' },
//               { name: 'Ambulance', number: INDIA_EMERGENCY_NUMBERS.ambulance, color: 'from-red-600 to-red-700' },
//               { name: 'Fire', number: INDIA_EMERGENCY_NUMBERS.fire, color: 'from-orange-600 to-orange-700' },
//               { name: 'All Services', number: INDIA_EMERGENCY_NUMBERS.all, color: 'from-primary to-secondary' }
//             ].map((service) => (
//               <button
//                 key={service.number}
//                 onClick={() => callEmergency(service.number)}
//                 className={`p-4 bg-gradient-to-br ${service.color} text-white rounded-lg hover:shadow-lg transition-all hover:scale-105`}
//               >
//                 <div className="text-2xl font-bold">{service.number}</div>
//                 <div className="text-sm">{service.name}</div>
//               </button>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* AI Smart Alert Section */}
//       <section className="py-12 bg-gradient-to-r from-secondary/10 to-primary/10 border-b border-primary/20">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex items-start gap-4">
//             <Brain className="w-8 h-8 text-secondary flex-shrink-0 mt-1" />
//             <div className="flex-1">
//               <h2 className="text-2xl font-bold text-foreground mb-2 flex items-center gap-2">
//                 <Zap size={24} />
//                 AI-Powered Emergency Analysis
//               </h2>
//               <p className="text-foreground/70 mb-4">Describe your emergency and let AI analyze the severity and recommend actions.</p>
//               {!showAiInput ? (
//                 <Button
//                   onClick={() => setShowAiInput(true)}
//                   className="bg-secondary hover:bg-secondary/90 text-white"
//                 >
//                   Describe Your Emergency
//                 </Button>
//               ) : (
//                 <div className="space-y-3 mt-3">
//                   <textarea
//                     value={aiDescription}
//                     onChange={(e) => setAiDescription(e.target.value)}
//                     placeholder="Describe what's happening... (e.g., 'Person injured in car accident', 'Fire in building')"
//                     className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-secondary"
//                     rows={3}
//                   />
//                   <div className="flex gap-2">
//                     <Button
//                       onClick={handleAiAnalysis}
//                       disabled={aiLoading}
//                       className="bg-secondary hover:bg-secondary/90 text-white disabled:opacity-50"
//                     >
//                       {aiLoading ? <Loader className="animate-spin mr-2" size={16} /> : <Brain size={16} className="mr-2" />}
//                       Analyze with AI
//                     </Button>
//                     <Button
//                       onClick={() => { setShowAiInput(false); setAiAnalysis(null); setAiDescription(''); }}
//                       variant="outline"
//                       className="border-secondary text-secondary hover:bg-secondary/10"
//                     >
//                       Cancel
//                     </Button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* AI Analysis Results */}
//           {aiAnalysis && (
//             <div className="mt-6 p-6 bg-card rounded-xl border border-secondary/30">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//                 <div>
//                   <p className="text-sm font-semibold text-foreground mb-2">Severity Level:</p>
//                   <p className={`text-2xl font-bold flex items-center gap-2 ${
//                     aiAnalysis.severity === 'CRITICAL' ? 'text-destructive' :
//                     aiAnalysis.severity === 'HIGH' ? 'text-orange-500' :
//                     aiAnalysis.severity === 'MEDIUM' ? 'text-yellow-500' : 'text-green-500'
//                   }`}>
//                     <AlertCircle size={24} /> {aiAnalysis.severity}
//                   </p>
//                 </div>
//                 <div>
//                   <p className="text-sm font-semibold text-foreground mb-2">Recommendation:</p>
//                   <p className="text-foreground/70">{aiAnalysis.recommendation}</p>
//                 </div>
//               </div>
//               {aiAnalysis.services_needed && (
//                 <div>
//                   <p className="text-sm font-semibold text-foreground mb-3">Contact These Services:</p>
//                   <div className="space-y-2">
//                     {aiAnalysis.services_needed.map((service) => (
//                       <button
//                         key={service}
//                         onClick={() => findNearestService(service)}
//                         className="w-full px-4 py-2 text-left bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors font-semibold flex items-center justify-between"
//                       >
//                         <span>Find Nearest {service.charAt(0).toUpperCase() + service.slice(1)}</span>
//                         <MapPin size={16} />
//                       </button>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       </section>

//       {/* Emergency Services Section */}
//       <section className="py-16 bg-background">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <h2 className="text-4xl font-bold mb-4 text-center bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
//             Find Nearest Services
//           </h2>
//           <p className="text-center text-foreground/70 mb-12">Locate nearest police station, hospital, or fire department in seconds</p>
          
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             {/* Police */}
//             <div className="p-8 bg-card rounded-xl border border-border hover:shadow-lg transition-all cursor-pointer" onClick={() => findNearestService('police')}>
//               <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
//                 <AlertCircle size={28} className="text-blue-600 dark:text-blue-400" />
//               </div>
//               <h3 className="text-2xl font-bold mb-2">Police Stations</h3>
//               <p className="text-foreground/70 mb-6">Report crimes or seek emergency assistance</p>
//               <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
//                 {searching && selectedService === 'police' ? <Loader className="animate-spin mr-2" size={16} /> : <MapPin className="mr-2" size={16} />}
//                 Find Nearest Police Station
//               </Button>
//               {nearbyServices.police && expandedService === 'police' && (
//                 <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200">
//                   <div className="flex justify-between mb-2">
//                     <span className="font-bold text-sm">{nearbyServices.police.name}</span>
//                     <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs">{nearbyServices.police.distance} km</span>
//                   </div>
//                   <div className="flex gap-2">
//                     <Button size="sm" className="flex-1 bg-blue-600" onClick={(e) => { e.stopPropagation(); callEmergency(nearbyServices.police.phone); }}>
//                       <Phone size={14} className="mr-1"/> Call
//                     </Button>
//                     <a href={nearbyServices.police.directions_url} target="_blank" className="flex-1 bg-white border border-blue-600 text-blue-600 text-sm py-2 rounded text-center font-bold flex items-center justify-center gap-1">
//                       <Navigation size={14}/> Direction
//                     </a>
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Hospital */}
//             <div className="p-8 bg-card rounded-xl border border-border hover:shadow-lg transition-all cursor-pointer" onClick={() => findNearestService('hospital')}>
//               <div className="w-14 h-14 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center mb-4">
//                 <Heart size={28} className="text-red-600 dark:text-red-400" />
//               </div>
//               <h3 className="text-2xl font-bold mb-2">Hospitals</h3>
//               <p className="text-foreground/70 mb-6">Get medical assistance and treatment</p>
//               <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
//                 {searching && selectedService === 'hospital' ? <Loader className="animate-spin mr-2" size={16} /> : <MapPin className="mr-2" size={16} />}
//                 Find Nearest Hospital
//               </Button>
//               {nearbyServices.hospital && expandedService === 'hospital' && (
//                 <div className="mt-4 p-4 bg-red-50 dark:bg-red-950 rounded-lg border border-red-200">
//                    <div className="flex justify-between mb-2">
//                     <span className="font-bold text-sm">{nearbyServices.hospital.name}</span>
//                     <span className="bg-red-600 text-white px-2 py-1 rounded text-xs">{nearbyServices.hospital.distance} km</span>
//                   </div>
//                   <div className="flex gap-2">
//                     <Button size="sm" className="flex-1 bg-red-600" onClick={(e) => { e.stopPropagation(); callEmergency(nearbyServices.hospital.phone); }}>
//                       <Phone size={14} className="mr-1"/> Call
//                     </Button>
//                     <a href={nearbyServices.hospital.directions_url} target="_blank" className="flex-1 bg-white border border-red-600 text-red-600 text-sm py-2 rounded text-center font-bold flex items-center justify-center gap-1">
//                       <Navigation size={14}/> Direction
//                     </a>
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Fire */}
//             <div className="p-8 bg-card rounded-xl border border-border hover:shadow-lg transition-all cursor-pointer" onClick={() => findNearestService('fire')}>
//               <div className="w-14 h-14 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mb-4">
//                 <Zap size={28} className="text-orange-600 dark:text-orange-400" />
//               </div>
//               <h3 className="text-2xl font-bold mb-2">Fire Stations</h3>
//               <p className="text-foreground/70 mb-6">Fire safety and rescue services</p>
//               <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white">
//                 {searching && selectedService === 'fire' ? <Loader className="animate-spin mr-2" size={16} /> : <MapPin className="mr-2" size={16} />}
//                 Find Nearest Fire Station
//               </Button>
//               {nearbyServices.fire && expandedService === 'fire' && (
//                 <div className="mt-4 p-4 bg-orange-50 dark:bg-orange-950 rounded-lg border border-orange-200">
//                   <div className="flex justify-between mb-2">
//                     <span className="font-bold text-sm">{nearbyServices.fire.name}</span>
//                     <span className="bg-orange-600 text-white px-2 py-1 rounded text-xs">{nearbyServices.fire.distance} km</span>
//                   </div>
//                   <div className="flex gap-2">
//                     <Button size="sm" className="flex-1 bg-orange-600" onClick={(e) => { e.stopPropagation(); callEmergency(nearbyServices.fire.phone); }}>
//                       <Phone size={14} className="mr-1"/> Call
//                     </Button>
//                     <a href={nearbyServices.fire.directions_url} target="_blank" className="flex-1 bg-white border border-orange-600 text-orange-600 text-sm py-2 rounded text-center font-bold flex items-center justify-center gap-1">
//                       <Navigation size={14}/> Direction
//                     </a>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Map Display */}
//       {showMap && mapHtml && (
//         <section className="py-12 bg-muted/50 border-t border-border">
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//             <h2 className="text-3xl font-bold mb-6">Interactive Map</h2>
//             <div className="rounded-xl overflow-hidden shadow-xl border border-border" dangerouslySetInnerHTML={{ __html: mapHtml }} />
//           </div>
//         </section>
//       )}

//       {/* Safety Tips Section */}
//       <section className="py-16 bg-gradient-to-r from-primary/5 to-secondary/5 border-t border-border">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <h2 className="text-3xl font-bold mb-12 text-center">Essential Safety Tips</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {[
//               { title: 'Stay Calm', desc: 'Keep your mind clear during emergencies. Take deep breaths and assess the situation.' },
//               { title: 'Call Immediately', desc: 'Ring 112 or specific emergency numbers (100, 101, 102) as soon as possible.' },
//               { title: 'Share Location', desc: 'Enable location sharing with emergency contacts for faster assistance.' },
//               { title: 'First Aid Ready', desc: 'Keep basic first aid supplies and know how to use them.' }
//             ].map((tip, i) => (
//               <div key={i} className="p-6 bg-card rounded-lg border border-border hover:shadow-md transition-shadow">
//                 <div className="flex items-start gap-4">
//                   <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
//                   <div>
//                     <h3 className="font-bold text-foreground mb-2">{tip.title}</h3>
//                     <p className="text-foreground/70">{tip.desc}</p>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>
//     </main>
//   );
// }









// 'use client';

// import { useState, useEffect, useCallback } from 'react';
// import { useRouter } from 'next/navigation';
// import Link from 'next/link';
// import MapComponent from '@/components/map-component';
// import { 
//   AlertCircle, MapPin, Phone, Clock, Heart, Navigation, Loader, 
//   ShieldAlert, Zap, Brain, ExternalLink, CheckCircle, User 
// } from 'lucide-react';
// import { Button } from '@/components/ui/button';

// // --- Interfaces ---
// interface EmergencyContact {
//   name: string;
//   phone: string;
//   relation?: string;
// }

// interface ServiceDetails {
//   name: string;
//   distance: number;
//   phone: string;
//   address: string;
//   lat: number;
//   lon: number;
//   directions_url: string;
// }

// interface NearbyServicesState {
//   [key: string]: ServiceDetails;
// }

// interface AiAnalysisResult {
//   severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
//   recommendation: string;
//   services_needed: string[];
// }

// const INDIA_EMERGENCY_NUMBERS = {
//   police: '100',
//   ambulance: '102',
//   fire: '101',
//   all: '112'
// };

// export default function DashboardPage() {
//   const router = useRouter();

//   // --- State ---
//   const [authChecking, setAuthChecking] = useState(true);
//   const [userName, setUserName] = useState<string | null>(null);
//   const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([]);
//   const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [nearbyServices, setNearbyServices] = useState<NearbyServicesState>({});
//   const [searching, setSearching] = useState(false);
//   const [selectedService, setSelectedService] = useState<string>('');
//   const [aiAnalysis, setAiAnalysis] = useState<AiAnalysisResult | null>(null);
//   const [showAiInput, setShowAiInput] = useState(false);
//   const [aiDescription, setAiDescription] = useState('');
//   const [aiLoading, setAiLoading] = useState(false);
//   const [mapHtml, setMapHtml] = useState<string>('');
//   const [showMap, setShowMap] = useState(false);
//   const [expandedService, setExpandedService] = useState<string | null>(null);

//   // --- Auth & Data Initialization ---
//   useEffect(() => {
//     const checkAuth = () => {
//       const token = localStorage.getItem('auth_token');
//       const storedName = localStorage.getItem('user_name');
//       const storedEmail = localStorage.getItem('user_email');
      
//       if (!token) {
//         router.push('/auth/landing');
//         return;
//       }

//       // Advanced name resolution logic
//       if (storedName && storedName !== "null" && storedName !== "undefined") {
//         setUserName(storedName);
//       } else if (storedEmail && storedEmail !== "null") {
//         setUserName(storedEmail.split('@')[0]); // Fallback to email prefix
//       } else {
//         try {
//           const base64Url = token.split('.')[1];
//           if (base64Url) {
//             const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
//             const decoded = JSON.parse(window.atob(base64));
//             setUserName(decoded.name || decoded.sub || "User");
//           }
//         } catch (e) {
//           setUserName("Authorized User");
//         }
//       }
//       setAuthChecking(false);
//     };

//     checkAuth();

//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
//           setLoading(false);
//         },
//         () => {
//           setUserLocation({ lat: 28.6139, lng: 77.2090 }); // Default New Delhi
//           setLoading(false);
//         }
//       );
//     }

//     const saved = localStorage.getItem('emergencyContacts');
//     if (saved) {
//       try { setEmergencyContacts(JSON.parse(saved)); } catch (e) { console.error(e); }
//     }
//   }, [router]);

//   // --- Logic Functions ---
//   const callEmergency = (number: string) => {
//     if (typeof window !== 'undefined') {
//       window.location.href = `tel:${number}`;
//     }
//   };

//   const findNearestService = async (serviceType: string) => {
//     if (!userLocation) return alert('Please enable location services');
    
//     const token = localStorage.getItem('auth_token'); 
//     if (!token) {
//       router.push('/auth/login');
//       return;
//     }

//     setSearching(true);
//     setSelectedService(serviceType);
//     setExpandedService(serviceType);

//     try {
//       const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
//       const response = await fetch(`${apiUrl}/api/find-nearby`, {
//         method: 'POST',
//         headers: { 
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}` 
//         },
//         body: JSON.stringify({
//           lat: userLocation.lat,
//           lon: userLocation.lng,
//           service_type: serviceType === 'fire' ? 'fire_station' : serviceType
//         }),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         setNearbyServices(prev => ({ 
//           ...prev, 
//           [serviceType]: {
//             name: data.name || `Nearest ${serviceType}`,
//             distance: parseFloat(data.distance?.toFixed(2) || "0"),
//             phone: data.phone || INDIA_EMERGENCY_NUMBERS.all,
//             address: data.address || "Location found near you",
//             lat: data.lat,
//             lon: data.lon,
//             directions_url: data.directions_url || `https://www.google.com/maps/dir/?api=1&destination=${data.lat},${data.lon}`
//           }
//         }));
//         if (data.map_html) setMapHtml(data.map_html);
//         setShowMap(true);
//       } else {
//         throw new Error('Service lookup failed');
//       }
//     } catch (error) {
//       console.error("Fetch error:", error);
//       alert("Could not fetch nearby services. Please check your connection.");
//     } finally {
//       setSearching(false);
//     }
//   };

//   const handleAiAnalysis = async () => {
//     if (!aiDescription.trim()) return alert('Please describe the situation');
//     setAiLoading(true);
    
//     // Artificial delay for UX "Analysis" feel
//     setTimeout(() => {
//       const desc = aiDescription.toLowerCase();
//       let severity: AiAnalysisResult['severity'] = 'MEDIUM';
//       let services = ['hospital'];

//       if (desc.includes('fire') || desc.includes('smoke') || desc.includes('burn')) {
//         severity = 'CRITICAL';
//         services = ['fire', 'hospital'];
//       } else if (desc.includes('accident') || desc.includes('blood') || desc.includes('breath')) {
//         severity = 'CRITICAL';
//         services = ['hospital', 'police'];
//       } else if (desc.includes('theft') || desc.includes('fight') || desc.includes('stranger')) {
//         severity = 'HIGH';
//         services = ['police'];
//       }

//       setAiAnalysis({ 
//         severity, 
//         recommendation: severity === 'CRITICAL' 
//           ? 'IMMEDIATE ACTION REQUIRED: Call 112 now and move to safety.' 
//           : 'Stay alert. We recommend contacting the nearest relevant service below.', 
//         services_needed: services 
//       });
//       setAiLoading(false);
//     }, 1500);
//   };

//   if (authChecking) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-background">
//         <div className="flex flex-col items-center gap-4">
//           <Loader className="h-12 w-12 animate-spin text-primary" />
//           <p className="text-muted-foreground animate-pulse">Securing session...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <main className="min-h-screen flex flex-col bg-background text-foreground">
//       {/* Hero Section */}
//       <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/10 pt-20 pb-16">
//         <div className="max-w-7xl mx-auto px-6 lg:px-8">
//           <div className="mb-8 flex items-center gap-2 bg-primary/10 w-fit px-4 py-2 rounded-full border border-primary/20 transition-all hover:bg-primary/15">
//             <User size={16} className="text-primary" />
//             <span className="text-sm font-semibold text-primary">Welcome back, {userName}</span>
//           </div>

//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
//             <div className="space-y-8">
//               <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent leading-[1.1]">
//                 Safety at <br />Every Step
//               </h1>
//               <p className="text-xl text-muted-foreground max-w-lg leading-relaxed">
//                 Instant access to emergency services. Locate hospitals, police, and fire stations with AI-driven insights to keep you and your loved ones protected.
//               </p>
//               <div className="flex flex-col sm:flex-row gap-4 pt-4">
//                 <button 
//                   onClick={() => callEmergency(INDIA_EMERGENCY_NUMBERS.all)} 
//                   className="px-8 py-4 bg-gradient-to-r from-destructive to-orange-600 text-white font-bold rounded-xl hover:scale-105 transition-all flex items-center justify-center gap-3 shadow-xl shadow-destructive/20"
//                 >
//                   <AlertCircle size={22} /> Emergency Call ({INDIA_EMERGENCY_NUMBERS.all})
//                 </button>
//                 <Link 
//                   href="/emergency-contacts" 
//                   className="px-8 py-4 border-2 border-primary/30 text-primary font-bold rounded-xl hover:bg-primary/5 transition-all text-center flex items-center justify-center"
//                 >
//                   My Contacts
//                 </Link>
//               </div>
//             </div>
            
//             <div className="relative h-[400px] rounded-3xl overflow-hidden shadow-2xl border-4 border-background group">
//               {!loading && userLocation ? (
//                 <MapComponent location={userLocation} />
//               ) : (
//                 <div className="w-full h-full flex flex-col items-center justify-center bg-muted/50">
//                   <Loader className="mb-4 text-primary animate-spin" size={40} />
//                   <p className="text-muted-foreground font-medium">Pinpointing your location...</p>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Quick Emergency Numbers */}
//       <section className="py-12 bg-card border-y border-border/50">
//         <div className="max-w-7xl mx-auto px-6">
//           <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-4">
//             <h3 className="text-2xl font-bold tracking-tight">Quick Connect</h3>
//             <span className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-md">Official India Emergency Lines</span>
//           </div>
//           <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
//             {[
//               { name: 'Police', number: INDIA_EMERGENCY_NUMBERS.police, color: 'from-blue-600 to-indigo-700', icon: ShieldAlert },
//               { name: 'Ambulance', number: INDIA_EMERGENCY_NUMBERS.ambulance, color: 'from-red-600 to-rose-700', icon: Heart },
//               { name: 'Fire', number: INDIA_EMERGENCY_NUMBERS.fire, color: 'from-orange-600 to-amber-700', icon: Zap },
//               { name: 'SOS All', number: INDIA_EMERGENCY_NUMBERS.all, color: 'from-slate-800 to-slate-900', icon: AlertCircle }
//             ].map((service) => (
//               <button 
//                 key={service.number} 
//                 onClick={() => callEmergency(service.number)} 
//                 className={`group relative p-6 bg-gradient-to-br ${service.color} text-white rounded-2xl hover:shadow-2xl transition-all hover:-translate-y-1 text-left overflow-hidden`}
//               >
//                 <service.icon className="absolute right-[-10px] bottom-[-10px] w-24 h-24 opacity-10 group-hover:scale-110 transition-transform" />
//                 <div className="text-3xl font-black mb-1">{service.number}</div>
//                 <div className="text-sm font-medium opacity-90 uppercase tracking-widest">{service.name}</div>
//               </button>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* AI Smart Alert */}
//       <section className="py-20 bg-gradient-to-b from-transparent to-secondary/5">
//         <div className="max-w-5xl mx-auto px-6">
//           <div className="bg-card border border-border shadow-sm rounded-3xl p-8 md:p-12">
//             <div className="flex items-start gap-6">
//               <div className="p-4 bg-secondary/10 rounded-2xl">
//                 <Brain className="w-10 h-10 text-secondary" />
//               </div>
//               <div className="flex-1 space-y-4">
//                 <h2 className="text-3xl font-bold">AI Response Assistant</h2>
//                 <p className="text-muted-foreground text-lg">Not sure who to call? Describe the situation in plain words, and our AI will determine the priority and necessary services.</p>
                
//                 {!showAiInput ? (
//                   <Button 
//                     onClick={() => setShowAiInput(true)} 
//                     size="lg"
//                     className="bg-secondary hover:bg-secondary/90 text-white px-8 rounded-xl"
//                   >
//                     Start Analysis
//                   </Button>
//                 ) : (
//                   <div className="space-y-4 mt-6 animate-in fade-in slide-in-from-top-4">
//                     <textarea 
//                       value={aiDescription} 
//                       onChange={(e) => setAiDescription(e.target.value)} 
//                       placeholder="e.g., There is a car accident on the main road and someone is injured..." 
//                       className="w-full px-5 py-4 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-secondary transition-all min-h-[120px] text-lg"
//                     />
//                     <div className="flex gap-3">
//                       <Button 
//                         onClick={handleAiAnalysis} 
//                         disabled={aiLoading || !aiDescription.trim()} 
//                         className="bg-secondary hover:bg-secondary/90 text-white px-6 py-6 rounded-xl flex-1 md:flex-none"
//                       >
//                         {aiLoading ? <Loader className="animate-spin mr-2" size={20} /> : <Zap size={20} className="mr-2" />} 
//                         Analyze Situation
//                       </Button>
//                       <Button 
//                         onClick={() => { setShowAiInput(false); setAiAnalysis(null); }} 
//                         variant="ghost" 
//                         className="px-6 py-6 rounded-xl"
//                       >
//                         Cancel
//                       </Button>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {aiAnalysis && (
//               <div className="mt-10 p-8 bg-muted/30 rounded-2xl border border-secondary/20 animate-in zoom-in-95">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
//                   <div>
//                     <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Severity Assessment</p>
//                     <div className={`text-3xl font-black flex items-center gap-3 ${aiAnalysis.severity === 'CRITICAL' ? 'text-destructive' : 'text-orange-500'}`}>
//                       <ShieldAlert size={32} /> {aiAnalysis.severity}
//                     </div>
//                   </div>
//                   <div>
//                     <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Protocol</p>
//                     <p className="text-lg font-medium leading-tight">{aiAnalysis.recommendation}</p>
//                   </div>
//                 </div>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//                   {aiAnalysis.services_needed.map((service) => (
//                     <button 
//                       key={service} 
//                       onClick={() => findNearestService(service)} 
//                       className="group px-6 py-4 bg-background border border-border rounded-xl hover:border-primary transition-all flex items-center justify-between shadow-sm hover:shadow-md"
//                     >
//                       <span className="font-bold capitalize">Locate {service}</span>
//                       <MapPin size={18} className="text-primary group-hover:translate-y-[-2px] transition-transform" />
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </section>

//       {/* Services Grid */}
//       <section className="py-24 bg-background">
//         <div className="max-w-7xl mx-auto px-6">
//           <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
//             <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">Nearby Help</h2>
//             <p className="text-muted-foreground text-lg">One-tap navigation to the closest emergency facilities based on your live coordinates.</p>
//           </div>
          
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//             {['police', 'hospital', 'fire'].map((type) => (
//               <div 
//                 key={type} 
//                 className="group p-8 bg-card rounded-3xl border border-border hover:border-primary/50 hover:shadow-2xl transition-all duration-300"
//               >
//                 <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 transition-transform group-hover:scale-110 ${
//                   type === 'police' ? 'bg-blue-100 text-blue-600' : 
//                   type === 'hospital' ? 'bg-red-100 text-red-600' : 
//                   'bg-orange-100 text-orange-600'
//                 }`}>
//                   {type === 'police' && <ShieldAlert size={32} />}
//                   {type === 'hospital' && <Heart size={32} />}
//                   {type === 'fire' && <Zap size={32} />}
//                 </div>
//                 <h3 className="text-2xl font-bold mb-3 capitalize">{type} Services</h3>
//                 <p className="text-muted-foreground mb-8 line-clamp-2">Get coordinates and contact info for the nearest {type} station.</p>
                
//                 <Button 
//                   onClick={() => findNearestService(type)}
//                   className={`w-full py-6 rounded-xl font-bold text-lg shadow-lg transition-all ${
//                     type === 'police' ? 'bg-blue-600 hover:bg-blue-700' : 
//                     type === 'hospital' ? 'bg-red-600 hover:bg-red-700' : 
//                     'bg-orange-600 hover:bg-orange-700'
//                   }`}
//                 >
//                   {searching && selectedService === type ? <Loader className="animate-spin" size={24} /> : "Find Nearest"}
//                 </Button>

//                 {nearbyServices[type] && expandedService === type && (
//                   <div className="mt-8 p-6 bg-muted/50 rounded-2xl border border-border space-y-4 animate-in slide-in-from-bottom-2">
//                     <div>
//                       <p className="font-black text-lg leading-tight mb-1">{nearbyServices[type].name}</p>
//                       <p className="text-sm text-muted-foreground">{nearbyServices[type].distance} km away</p>
//                     </div>
//                     <div className="flex gap-2">
//                       <Button 
//                         variant="default"
//                         size="sm" 
//                         className="flex-1 rounded-lg h-11" 
//                         onClick={(e) => { e.stopPropagation(); callEmergency(nearbyServices[type].phone); }}
//                       >
//                         <Phone size={16} className="mr-2"/> Call
//                       </Button>
//                       <a 
//                         href={nearbyServices[type].directions_url} 
//                         target="_blank" 
//                         rel="noopener noreferrer"
//                         className="flex-1 bg-background border border-border text-sm rounded-lg flex items-center justify-center gap-2 font-bold hover:bg-muted transition-colors"
//                       >
//                         <Navigation size={16}/> Route
//                       </a>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Map Display */}
//       {showMap && mapHtml && (
//         <section className="py-20 bg-muted/30 border-t border-border animate-in fade-in duration-700">
//           <div className="max-w-7xl mx-auto px-6">
//             <div className="flex items-center justify-between mb-8">
//               <h2 className="text-3xl font-bold">Location Overview</h2>
//               <Button variant="ghost" onClick={() => setShowMap(false)}>Close Map</Button>
//             </div>
//             <div 
//               className="rounded-3xl overflow-hidden shadow-2xl border border-border bg-card min-h-[500px]" 
//               dangerouslySetInnerHTML={{ __html: mapHtml }} 
//             />
//           </div>
//         </section>
//       )}

//       {/* Safety Tips Section */}
//       <section className="py-24 bg-card border-t border-border">
//         <div className="max-w-7xl mx-auto px-6">
//           <h2 className="text-3xl md:text-4xl font-bold mb-16 text-center">Safety Guidelines</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//             {[
//               { title: 'Stay Calm & Composed', desc: 'Panic clouds judgment. Take a moment to breathe before acting.' },
//               { title: 'Immediate Reporting', desc: 'Don\'t hesitate. Even a 30-second delay can change outcomes in emergencies.' },
//               { title: 'Precise Location', desc: 'When calling, mention visible landmarks if GPS is unavailable.' },
//               { title: 'Basic First Aid', desc: 'Apply pressure to wounds and keep the person warm until help arrives.' }
//             ].map((tip, i) => (
//               <div key={i} className="p-8 bg-background rounded-2xl border border-border hover:border-primary/20 transition-colors flex items-start gap-6">
//                 <div className="mt-1">
//                   <CheckCircle className="w-8 h-8 text-green-500" />
//                 </div>
//                 <div>
//                   <h3 className="text-xl font-bold mb-2">{tip.title}</h3>
//                   <p className="text-muted-foreground leading-relaxed">{tip.desc}</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Footer-like spacing */}
//       <footer className="py-12 border-t border-border/40 text-center text-muted-foreground text-sm">
//         <p>© 2026 Emergency Response AI. All emergency data is sourced from official channels.</p>
//       </footer>
//     </main>
//   );
// }




// 'use client';

// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import Link from 'next/link';
// import MapComponent from '@/components/map-component';
// import { 
//   AlertCircle, MapPin, Phone, Clock, Heart, Navigation, Loader, 
//   ShieldAlert, Zap, Brain, CheckCircle, User 
// } from 'lucide-react';
// import { Button } from '@/components/ui/button';

// // --- Interfaces ---
// interface ServiceDetails {
//   name: string;
//   distance: number;
//   phone: string;
//   address: string;
//   lat: number;
//   lon: number;
//   directions_url: string;
// }

// interface NearbyServicesState {
//   [key: string]: ServiceDetails;
// }

// interface AiAnalysisResult {
//   severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
//   recommendation: string;
//   services_needed: string[];
// }

// const INDIA_EMERGENCY_NUMBERS = {
//   police: '100',
//   ambulance: '102',
//   fire: '101',
//   all: '112'
// };

// export default function DashboardPage() {
//   const router = useRouter();

//   // --- State ---
//   const [authChecking, setAuthChecking] = useState(true);
//   const [userName, setUserName] = useState<string | null>(null);
//   const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [nearbyServices, setNearbyServices] = useState<NearbyServicesState>({});
//   const [searching, setSearching] = useState(false);
//   const [selectedService, setSelectedService] = useState<string>('');
//   const [aiAnalysis, setAiAnalysis] = useState<AiAnalysisResult | null>(null);
//   const [showAiInput, setShowAiInput] = useState(false);
//   const [aiDescription, setAiDescription] = useState('');
//   const [aiLoading, setAiLoading] = useState(false);
//   const [mapHtml, setMapHtml] = useState<string>('');
//   const [showMap, setShowMap] = useState(false);
//   const [expandedService, setExpandedService] = useState<string | null>(null);

//   // --- Auth & Data Initialization ---
//   useEffect(() => {
//     const checkAuth = () => {
//       const token = localStorage.getItem('auth_token');
//       const storedName = localStorage.getItem('user_name');
      
//       if (!token) {
//         router.push('/auth/landing');
//         return;
//       }

//       if (storedName && storedName !== "null") {
//         setUserName(storedName);
//       } else {
//         try {
//           const base64Url = token.split('.')[1];
//           const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
//           const decoded = JSON.parse(window.atob(base64));
//           setUserName(decoded.name || decoded.sub || "Authorized User");
//         } catch (e) {
//           setUserName("Authorized User");
//         }
//       }
//       setAuthChecking(false);
//     };

//     checkAuth();

//     // IMPROVED GEOLOCATION: Watching for high accuracy
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           console.log("Location detected:", position.coords.latitude, position.coords.longitude);
//           setUserLocation({ 
//             lat: position.coords.latitude, 
//             lng: position.coords.longitude 
//           });
//           setLoading(false);
//         },
//         (error) => {
//           console.error("Geolocation Error:", error);
//           // Fallback to New Delhi if user denies permission
//           setUserLocation({ lat: 28.6139, lng: 77.2090 });
//           setLoading(false);
//         },
//         { 
//           enableHighAccuracy: true, 
//           timeout: 10000, 
//           maximumAge: 0 
//         }
//       );
//     }
//   }, [router]);

//   // --- Logic Functions ---
//   const callEmergency = (number: string) => {
//     window.location.href = `tel:${number}`;
//   };

//   const findNearestService = async (serviceType: string) => {
//     // CRITICAL: Check if location is available
//     if (loading || !userLocation) {
//         return alert('Still pinpointing your precise location. Please wait...');
//     }
    
//     const token = localStorage.getItem('auth_token'); 
//     setSearching(true);
//     setSelectedService(serviceType);
//     setExpandedService(serviceType);

//     try {
//       const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
//       const typeParam = serviceType === 'fire' ? 'fire_station' : serviceType;

//       const response = await fetch(`${apiUrl}/api/find-nearby`, {
//         method: 'POST',
//         headers: { 
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}` 
//         },
//         body: JSON.stringify({
//           // SENDING YOUR ACTUAL DETECTED COORDINATES
//           lat: userLocation.lat,
//           lon: userLocation.lng,
//           service_type: typeParam
//         }),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         // FIXED TYPO: replaced {data.lat} with ${data.lat}
//         const gMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${data.lat},${data.lon}`;

//         setNearbyServices(prev => ({ 
//           ...prev, 
//           [serviceType]: {
//             name: data.name || `Nearest ${serviceType}`,
//             distance: parseFloat(data.distance?.toFixed(2) || "0"),
//             phone: data.phone || INDIA_EMERGENCY_NUMBERS.all,
//             address: data.address || "Location identified",
//             lat: data.lat,
//             lon: data.lon,
//             directions_url: data.directions_url || gMapsUrl
//           }
//         }));

//         if (data.map_html) {
//           setMapHtml(data.map_html);
//           setShowMap(true);
//         }

//         const element = document.getElementById('services-section');
//         element?.scrollIntoView({ behavior: 'smooth' });

//       } else {
//         alert(data.error || 'Failed to fetch nearby services.');
//       }
//     } catch (error) {
//       console.error("Fetch error:", error);
//       alert("Connection error. Please ensure your server is running and location permissions are enabled.");
//     } finally {
//       setSearching(false);
//     }
//   };

//   const handleAiAnalysis = async () => {
//     if (!aiDescription.trim()) return alert('Please describe the emergency');
//     setAiLoading(true);
    
//     setTimeout(() => {
//       const desc = aiDescription.toLowerCase();
//       let severity: AiAnalysisResult['severity'] = 'MEDIUM';
//       let services = ['hospital'];

//       if (desc.includes('fire') || desc.includes('smoke') || desc.includes('burn')) {
//         severity = 'CRITICAL';
//         services = ['fire', 'hospital'];
//       } else if (desc.includes('accident') || desc.includes('blood') || desc.includes('breath') || desc.includes('unconscious')) {
//         severity = 'CRITICAL';
//         services = ['hospital', 'police'];
//       } else if (desc.includes('theft') || desc.includes('robbery') || desc.includes('fight')) {
//         severity = 'HIGH';
//         services = ['police'];
//       }

//       setAiAnalysis({ 
//         severity, 
//         recommendation: severity === 'CRITICAL' 
//           ? 'IMMEDIATE ACTION: Call 112 and move to a safe distance.' 
//           : 'Stay alert. Contact the nearest suggested service below.', 
//         services_needed: services 
//       });
//       setAiLoading(false);
//     }, 1200);
//   };

//   if (authChecking) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-background">
//         <Loader className="h-10 w-10 animate-spin text-primary" />
//       </div>
//     );
//   }

//   return (
//     <main className="min-h-screen flex flex-col bg-background text-foreground">
//       {/* Hero Section */}
//       <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/10 pt-20 pb-16">
//         <div className="max-w-7xl mx-auto px-6 lg:px-8">
//           <div className="mb-8 flex items-center gap-2 bg-primary/10 w-fit px-4 py-2 rounded-full border border-primary/20">
//             <User size={16} className="text-primary" />
//             <span className="text-sm font-semibold text-primary">Welcome back, {userName}</span>
//           </div>

//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
//             <div className="space-y-8">
//               <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent leading-[1.1]">
//                 Safety at <br />Every Step
//               </h1>
//               <p className="text-xl text-muted-foreground max-w-lg leading-relaxed">
//                 Instant access to emergency services. Locate hospitals, police, and fire stations with AI-driven insights to keep you and your loved ones protected.
//               </p>
//               <div className="flex flex-col sm:flex-row gap-4 pt-4">
//                 <button 
//                   onClick={() => callEmergency(INDIA_EMERGENCY_NUMBERS.all)} 
//                   className="px-8 py-4 bg-gradient-to-r from-destructive to-orange-600 text-white font-bold rounded-xl hover:scale-105 transition-all flex items-center justify-center gap-3 shadow-xl"
//                 >
//                   <AlertCircle size={22} /> Emergency Call ({INDIA_EMERGENCY_NUMBERS.all})
//                 </button>
//                 <Link 
//                   href="/emergency-contacts" 
//                   className="px-8 py-4 border-2 border-primary/30 text-primary font-bold rounded-xl hover:bg-primary/5 transition-all text-center flex items-center justify-center"
//                 >
//                   My Contacts
//                 </Link>
//               </div>
//             </div>
            
//             <div className="relative h-[400px] rounded-3xl overflow-hidden shadow-2xl border-4 border-background">
//               {!loading && userLocation ? (
//                 <MapComponent location={userLocation} />
//               ) : (
//                 <div className="w-full h-full flex flex-col items-center justify-center bg-muted/50">
//                   <Loader className="mb-4 text-primary animate-spin" size={40} />
//                   <p className="text-muted-foreground font-medium">Pinpointing location...</p>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Quick Emergency Numbers Section */}
//       <section className="py-12 bg-card border-y border-border/50">
//         <div className="max-w-7xl mx-auto px-6">
//           <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-4">
//             <h3 className="text-2xl font-bold tracking-tight">Quick Connect</h3>
//             <span className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-md">Official India Emergency Lines</span>
//           </div>
//           <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
//             {[
//               { name: 'Police', number: INDIA_EMERGENCY_NUMBERS.police, color: 'from-blue-600 to-indigo-700', icon: ShieldAlert },
//               { name: 'Ambulance', number: INDIA_EMERGENCY_NUMBERS.ambulance, color: 'from-red-600 to-rose-700', icon: Heart },
//               { name: 'Fire', number: INDIA_EMERGENCY_NUMBERS.fire, color: 'from-orange-600 to-amber-700', icon: Zap },
//               { name: 'SOS All', number: INDIA_EMERGENCY_NUMBERS.all, color: 'from-slate-800 to-slate-900', icon: AlertCircle }
//             ].map((service) => (
//               <button 
//                 key={service.number} 
//                 onClick={() => callEmergency(service.number)} 
//                 className={`group relative p-6 bg-gradient-to-br ${service.color} text-white rounded-2xl hover:shadow-2xl transition-all hover:-translate-y-1 text-left overflow-hidden`}
//               >
//                 <service.icon className="absolute right-[-10px] bottom-[-10px] w-24 h-24 opacity-10 group-hover:scale-110 transition-transform" />
//                 <div className="text-3xl font-black mb-1">{service.number}</div>
//                 <div className="text-sm font-medium opacity-90 uppercase tracking-widest">{service.name}</div>
//               </button>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* AI Smart Alert Section */}
//       <section className="py-20 bg-gradient-to-b from-transparent to-secondary/5">
//         <div className="max-w-5xl mx-auto px-6">
//           <div className="bg-card border border-border shadow-sm rounded-3xl p-8 md:p-12">
//             <div className="flex items-start gap-6">
//               <div className="p-4 bg-secondary/10 rounded-2xl">
//                 <Brain className="w-10 h-10 text-secondary" />
//               </div>
//               <div className="flex-1 space-y-4">
//                 <h2 className="text-3xl font-bold">AI Response Assistant</h2>
//                 <p className="text-muted-foreground text-lg">Describe the situation in plain words, and our AI will determine the priority and necessary services.</p>
                
//                 {!showAiInput ? (
//                   <Button 
//                     onClick={() => setShowAiInput(true)} 
//                     size="lg"
//                     className="bg-secondary hover:bg-secondary/90 text-white px-8 rounded-xl"
//                   >
//                     Start Analysis
//                   </Button>
//                 ) : (
//                   <div className="space-y-4 mt-6 animate-in fade-in slide-in-from-top-4">
//                     <textarea 
//                       value={aiDescription} 
//                       onChange={(e) => setAiDescription(e.target.value)} 
//                       placeholder="e.g., Someone is unconscious and breathing is difficult..." 
//                       className="w-full px-5 py-4 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-secondary transition-all min-h-[120px] text-lg"
//                     />
//                     <div className="flex gap-3">
//                       <Button 
//                         onClick={handleAiAnalysis} 
//                         disabled={aiLoading || !aiDescription.trim()} 
//                         className="bg-secondary hover:bg-secondary/90 text-white px-6 py-6 rounded-xl flex-1 md:flex-none"
//                       >
//                         {aiLoading ? <Loader className="animate-spin mr-2" size={20} /> : <Zap size={20} className="mr-2" />} 
//                         Analyze Situation
//                       </Button>
//                       <Button 
//                         onClick={() => { setShowAiInput(false); setAiAnalysis(null); }} 
//                         variant="ghost" 
//                         className="px-6 py-6 rounded-xl"
//                       >
//                         Cancel
//                       </Button>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {aiAnalysis && (
//               <div className="mt-10 p-8 bg-muted/30 rounded-2xl border border-secondary/20 animate-in zoom-in-95">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
//                   <div>
//                     <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Severity Assessment</p>
//                     <div className={`text-3xl font-black flex items-center gap-3 ${aiAnalysis.severity === 'CRITICAL' ? 'text-destructive' : 'text-orange-500'}`}>
//                       <ShieldAlert size={32} /> {aiAnalysis.severity}
//                     </div>
//                   </div>
//                   <div>
//                     <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Protocol</p>
//                     <p className="text-lg font-medium leading-tight">{aiAnalysis.recommendation}</p>
//                   </div>
//                 </div>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//                   {aiAnalysis.services_needed.map((service) => (
//                     <button 
//                       key={service} 
//                       onClick={() => findNearestService(service)} 
//                       className="group px-6 py-4 bg-background border border-border rounded-xl hover:border-primary transition-all flex items-center justify-between shadow-sm hover:shadow-md"
//                     >
//                       <span className="font-bold capitalize">
//                         {searching && selectedService === service ? "Locating..." : `Locate ${service}`}
//                       </span>
//                       {searching && selectedService === service ? (
//                         <Loader size={18} className="animate-spin text-primary" />
//                       ) : (
//                         <MapPin size={18} className="text-primary group-hover:translate-y-[-2px] transition-transform" />
//                       )}
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </section>

//       {/* Services Grid Section */}
//       <section id="services-section" className="py-24 bg-background">
//         <div className="max-w-7xl mx-auto px-6">
//           <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
//             <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">Nearby Help</h2>
//             <p className="text-muted-foreground text-lg">One-tap navigation to the closest emergency facilities.</p>
//           </div>
          
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//             {['police', 'hospital', 'fire'].map((type) => (
//               <div 
//                 key={type} 
//                 className="group p-8 bg-card rounded-3xl border border-border hover:border-primary/50 hover:shadow-2xl transition-all duration-300"
//               >
//                 <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 transition-transform group-hover:scale-110 ${
//                   type === 'police' ? 'bg-blue-100 text-blue-600' : 
//                   type === 'hospital' ? 'bg-red-100 text-red-600' : 
//                   'bg-orange-100 text-orange-600'
//                 }`}>
//                   {type === 'police' && <ShieldAlert size={32} />}
//                   {type === 'hospital' && <Heart size={32} />}
//                   {type === 'fire' && <Zap size={32} />}
//                 </div>
//                 <h3 className="text-2xl font-bold mb-3 capitalize">{type} Services</h3>
//                 <p className="text-muted-foreground mb-8 line-clamp-2">Get direct coordinates for the nearest {type} station.</p>
                
//                 <Button 
//                   onClick={() => findNearestService(type)}
//                   className={`w-full py-6 rounded-xl font-bold text-lg shadow-lg transition-all ${
//                     type === 'police' ? 'bg-blue-600 hover:bg-blue-700' : 
//                     type === 'hospital' ? 'bg-red-600 hover:bg-red-700' : 
//                     'bg-orange-600 hover:bg-orange-700'
//                   }`}
//                 >
//                   {searching && selectedService === type ? <Loader className="animate-spin" size={24} /> : "Find Nearest"}
//                 </Button>

//                 {nearbyServices[type] && expandedService === type && (
//                   <div className="mt-8 p-6 bg-muted/50 rounded-2xl border border-border space-y-4 animate-in slide-in-from-bottom-2">
//                     <div>
//                       <p className="font-black text-lg leading-tight mb-1">{nearbyServices[type].name}</p>
//                       <p className="text-sm text-muted-foreground">{nearbyServices[type].distance} km away</p>
//                     </div>
//                     <div className="flex gap-2">
//                       <Button 
//                         variant="default"
//                         size="sm" 
//                         className="flex-1 rounded-lg h-11" 
//                         onClick={(e) => { e.stopPropagation(); callEmergency(nearbyServices[type].phone); }}
//                       >
//                         <Phone size={16} className="mr-2"/> Call
//                       </Button>
//                       <a 
//                         href={nearbyServices[type].directions_url} 
//                         target="_blank" 
//                         rel="noopener noreferrer"
//                         className="flex-1 bg-background border border-border text-sm rounded-lg flex items-center justify-center gap-2 font-bold hover:bg-muted transition-colors"
//                       >
//                         <Navigation size={16}/> Route
//                       </a>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Map Display Section */}
//       {showMap && mapHtml && (
//         <section className="py-20 bg-muted/30 border-t border-border animate-in fade-in duration-700">
//           <div className="max-w-7xl mx-auto px-6">
//             <div className="flex items-center justify-between mb-8">
//               <h2 className="text-3xl font-bold">Location Overview</h2>
//               <Button variant="ghost" onClick={() => setShowMap(false)}>Close Map</Button>
//             </div>
//             <div 
//               className="rounded-3xl overflow-hidden shadow-2xl border border-border bg-card min-h-[500px]" 
//               dangerouslySetInnerHTML={{ __html: mapHtml }} 
//             />
//           </div>
//         </section>
//       )}

//       {/* Safety Tips Section */}
//       <section className="py-24 bg-card border-t border-border">
//         <div className="max-w-7xl mx-auto px-6">
//           <h2 className="text-3xl md:text-4xl font-bold mb-16 text-center">Safety Guidelines</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//             {[
//               { title: 'Stay Calm & Composed', desc: 'Panic clouds judgment. Take a moment to breathe before acting.' },
//               { title: 'Immediate Reporting', desc: 'Don\'t hesitate. Every second counts in an emergency.' },
//               { title: 'Precise Location', desc: 'Identify visible landmarks if GPS signal is weak.' },
//               { title: 'Basic First Aid', desc: 'Maintain composure and assist victims while waiting for help.' }
//             ].map((tip, i) => (
//               <div key={i} className="p-8 bg-background rounded-2xl border border-border hover:border-primary/20 transition-colors flex items-start gap-6">
//                 <div className="mt-1">
//                   <CheckCircle className="w-8 h-8 text-green-500" />
//                 </div>
//                 <div>
//                   <h3 className="text-xl font-bold mb-2">{tip.title}</h3>
//                   <p className="text-muted-foreground leading-relaxed">{tip.desc}</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       <footer className="py-12 border-t border-border/40 text-center text-muted-foreground text-sm">
//         <p>© 2026 Emergency Response AI. India's Safety Initiative.</p>
//       </footer>
//     </main>
//   );
// }




// 'use client';

// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import Link from 'next/link';
// import MapComponent from '@/components/map-component';
// import { 
//   AlertCircle, MapPin, Phone, Clock, Heart, Navigation, Loader, 
//   ShieldAlert, Zap, Brain, CheckCircle, User 
// } from 'lucide-react';
// import { Button } from '@/components/ui/button';

// // --- Interfaces ---
// interface ServiceDetails {
//   name: string;
//   distance: number;
//   phone: string;
//   address: string;
//   lat: number;
//   lon: number;
//   directions_url: string;
// }

// interface NearbyServicesState {
//   [key: string]: ServiceDetails;
// }

// interface AiAnalysisResult {
//   severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
//   recommendation: string;
//   services_needed: string[];
// }

// const INDIA_EMERGENCY_NUMBERS = {
//   police: '100',
//   ambulance: '102',
//   fire: '101',
//   all: '112'
// };

// export default function DashboardPage() {
//   const router = useRouter();

//   // --- State ---
//   const [authChecking, setAuthChecking] = useState(true);
//   const [userName, setUserName] = useState<string | null>(null);
//   const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [nearbyServices, setNearbyServices] = useState<NearbyServicesState>({});
//   const [searching, setSearching] = useState(false);
//   const [selectedService, setSelectedService] = useState<string>('');
//   const [aiAnalysis, setAiAnalysis] = useState<AiAnalysisResult | null>(null);
//   const [showAiInput, setShowAiInput] = useState(false);
//   const [aiDescription, setAiDescription] = useState('');
//   const [aiLoading, setAiLoading] = useState(false);
//   const [mapHtml, setMapHtml] = useState<string>('');
//   const [showMap, setShowMap] = useState(false);
//   const [expandedService, setExpandedService] = useState<string | null>(null);

//   // --- Auth & Data Initialization ---
//   useEffect(() => {
//     const checkAuth = () => {
//       const token = localStorage.getItem('auth_token');
//       const storedName = localStorage.getItem('user_name');
      
//       if (!token) {
//         router.push('/auth/landing');
//         return;
//       }

//       if (storedName && storedName !== "null") {
//         setUserName(storedName);
//       } else {
//         try {
//           const base64Url = token.split('.')[1];
//           const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
//           const decoded = JSON.parse(window.atob(base64));
//           setUserName(decoded.name || decoded.sub || "Authorized User");
//         } catch (e) {
//           setUserName("Authorized User");
//         }
//       }
//       setAuthChecking(false);
//     };

//     checkAuth();

//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           console.log("Location detected:", position.coords.latitude, position.coords.longitude);
//           setUserLocation({ 
//             lat: position.coords.latitude, 
//             lng: position.coords.longitude 
//           });
//           setLoading(false);
//         },
//         (error) => {
//           console.error("Geolocation Error:", error);
//           setUserLocation({ lat: 28.6139, lng: 77.2090 });
//           setLoading(false);
//         },
//         { 
//           enableHighAccuracy: true, 
//           timeout: 10000, 
//           maximumAge: 0 
//         }
//       );
//     }
//   }, [router]);

//   // --- Logic Functions ---
//   const callEmergency = (number: string) => {
//     window.location.href = `tel:${number}`;
//   };

//   const findNearestService = async (serviceType: string) => {
//     if (loading || !userLocation) {
//         return alert('Still pinpointing your precise location. Please wait...');
//     }
    
//     const token = localStorage.getItem('auth_token'); 
//     setSearching(true);
//     setSelectedService(serviceType);
//     setExpandedService(serviceType);

//     try {
//       const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
//       const typeParam = serviceType === 'fire' ? 'fire_station' : serviceType;

//       const response = await fetch(`${apiUrl}/api/find-nearby`, {
//         method: 'POST',
//         headers: { 
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}` 
//         },
//         body: JSON.stringify({
//           lat: userLocation.lat,
//           lon: userLocation.lng,
//           service_type: typeParam
//         }),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         // FIX: Fixed the template literal syntax for the Google Maps URL
//         const gMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${data.lat},${data.lon}`;

//         setNearbyServices(prev => ({ 
//           ...prev, 
//           [serviceType]: {
//             name: data.name || `Nearest ${serviceType}`,
//             distance: parseFloat(data.distance?.toFixed(2) || "0"),
//             phone: data.phone || INDIA_EMERGENCY_NUMBERS.all,
//             address: data.address || "Location identified",
//             lat: data.lat,
//             lon: data.lon,
//             directions_url: gMapsUrl
//           }
//         }));

//         if (data.map_html) {
//           setMapHtml(data.map_html);
//           setShowMap(true);
//         }

//         const element = document.getElementById('services-section');
//         element?.scrollIntoView({ behavior: 'smooth' });

//       } else {
//         // HANDLE 503/404 specifically
//         alert(data.error || 'The map service is busy. Please wait 5 seconds and click search again.');
//       }
//     } catch (error) {
//       console.error("Fetch error:", error);
//       alert("Cannot connect to server. Check if your Flask backend is running on port 5000.");
//     } finally {
//       setSearching(false);
//     }
//   };

//   const handleAiAnalysis = async () => {
//     if (!aiDescription.trim()) return alert('Please describe the emergency');
//     setAiLoading(true);
    
//     setTimeout(() => {
//       const desc = aiDescription.toLowerCase();
//       let severity: AiAnalysisResult['severity'] = 'MEDIUM';
//       let services = ['hospital'];

//       if (desc.includes('fire') || desc.includes('smoke') || desc.includes('burn')) {
//         severity = 'CRITICAL';
//         services = ['fire', 'hospital'];
//       } else if (desc.includes('accident') || desc.includes('blood') || desc.includes('breath') || desc.includes('unconscious')) {
//         severity = 'CRITICAL';
//         services = ['hospital', 'police'];
//       } else if (desc.includes('theft') || desc.includes('robbery') || desc.includes('fight')) {
//         severity = 'HIGH';
//         services = ['police'];
//       }

//       setAiAnalysis({ 
//         severity, 
//         recommendation: severity === 'CRITICAL' 
//           ? 'IMMEDIATE ACTION: Call 112 and move to a safe distance.' 
//           : 'Stay alert. Contact the nearest suggested service below.', 
//         services_needed: services 
//       });
//       setAiLoading(false);
//     }, 1200);
//   };

//   if (authChecking) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-background">
//         <Loader className="h-10 w-10 animate-spin text-primary" />
//       </div>
//     );
//   }

//   return (
//     <main className="min-h-screen flex flex-col bg-background text-foreground">
//       {/* Hero Section */}
//       <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/10 pt-20 pb-16">
//         <div className="max-w-7xl mx-auto px-6 lg:px-8">
//           <div className="mb-8 flex items-center gap-2 bg-primary/10 w-fit px-4 py-2 rounded-full border border-primary/20">
//             <User size={16} className="text-primary" />
//             <span className="text-sm font-semibold text-primary">Welcome back, {userName}</span>
//           </div>

//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
//             <div className="space-y-8">
//               <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent leading-[1.1]">
//                 Safety at <br />Every Step
//               </h1>
//               <p className="text-xl text-muted-foreground max-w-lg leading-relaxed">
//                 Instant access to emergency services. Locate hospitals, police, and fire stations with AI-driven insights to keep you and your loved ones protected.
//               </p>
//               <div className="flex flex-col sm:flex-row gap-4 pt-4">
//                 <button 
//                   onClick={() => callEmergency(INDIA_EMERGENCY_NUMBERS.all)} 
//                   className="px-8 py-4 bg-gradient-to-r from-destructive to-orange-600 text-white font-bold rounded-xl hover:scale-105 transition-all flex items-center justify-center gap-3 shadow-xl"
//                 >
//                   <AlertCircle size={22} /> Emergency Call ({INDIA_EMERGENCY_NUMBERS.all})
//                 </button>
//                 <Link 
//                   href="/main/emergency-contacts" 
//                   className="px-8 py-4 border-2 border-primary/30 text-primary font-bold rounded-xl hover:bg-primary/5 transition-all text-center flex items-center justify-center"
//                 >
//                   My Contacts
//                 </Link>
//               </div>
//             </div>
            
//             <div className="relative h-[400px] rounded-3xl overflow-hidden shadow-2xl border-4 border-background">
//               {!loading && userLocation ? (
//                 <MapComponent location={userLocation} />
//               ) : (
//                 <div className="w-full h-full flex flex-col items-center justify-center bg-muted/50">
//                   <Loader className="mb-4 text-primary animate-spin" size={40} />
//                   <p className="text-muted-foreground font-medium">Pinpointing location...</p>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Emergency Numbers Section */}
//       <section className="py-12 bg-card border-y border-border/50">
//         <div className="max-w-7xl mx-auto px-6">
//           <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-4">
//             <h3 className="text-2xl font-bold tracking-tight">Quick Connect</h3>
//             <span className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-md">Official India Emergency Lines</span>
//           </div>
//           <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
//             {[
//               { name: 'Police', number: INDIA_EMERGENCY_NUMBERS.police, color: 'from-blue-600 to-indigo-700', icon: ShieldAlert },
//               { name: 'Ambulance', number: INDIA_EMERGENCY_NUMBERS.ambulance, color: 'from-red-600 to-rose-700', icon: Heart },
//               { name: 'Fire', number: INDIA_EMERGENCY_NUMBERS.fire, color: 'from-orange-600 to-amber-700', icon: Zap },
//               { name: 'SOS All', number: INDIA_EMERGENCY_NUMBERS.all, color: 'from-slate-800 to-slate-900', icon: AlertCircle }
//             ].map((service) => (
//               <button 
//                 key={service.number} 
//                 onClick={() => callEmergency(service.number)} 
//                 className={`group relative p-6 bg-gradient-to-br ${service.color} text-white rounded-2xl hover:shadow-2xl transition-all hover:-translate-y-1 text-left overflow-hidden`}
//               >
//                 <service.icon className="absolute right-[-10px] bottom-[-10px] w-24 h-24 opacity-10 group-hover:scale-110 transition-transform" />
//                 <div className="text-3xl font-black mb-1">{service.number}</div>
//                 <div className="text-sm font-medium opacity-90 uppercase tracking-widest">{service.name}</div>
//               </button>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* AI Assistant Section */}
//       <section className="py-20 bg-gradient-to-b from-transparent to-secondary/5">
//         <div className="max-w-5xl mx-auto px-6">
//           <div className="bg-card border border-border shadow-sm rounded-3xl p-8 md:p-12">
//             <div className="flex items-start gap-6">
//               <div className="p-4 bg-secondary/10 rounded-2xl">
//                 <Brain className="w-10 h-10 text-secondary" />
//               </div>
//               <div className="flex-1 space-y-4">
//                 <h2 className="text-3xl font-bold">AI Response Assistant</h2>
//                 <p className="text-muted-foreground text-lg">Describe the situation in plain words, and our AI will determine the priority and necessary services.</p>
                
//                 {!showAiInput ? (
//                   <Button 
//                     onClick={() => setShowAiInput(true)} 
//                     size="lg"
//                     className="bg-secondary hover:bg-secondary/90 text-white px-8 rounded-xl"
//                   >
//                     Start Analysis
//                   </Button>
//                 ) : (
//                   <div className="space-y-4 mt-6 animate-in fade-in slide-in-from-top-4">
//                     <textarea 
//                       value={aiDescription} 
//                       onChange={(e) => setAiDescription(e.target.value)} 
//                       placeholder="e.g., Someone is unconscious and breathing is difficult..." 
//                       className="w-full px-5 py-4 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-secondary transition-all min-h-[120px] text-lg"
//                     />
//                     <div className="flex gap-3">
//                       <Button 
//                         onClick={handleAiAnalysis} 
//                         disabled={aiLoading || !aiDescription.trim()} 
//                         className="bg-secondary hover:bg-secondary/90 text-white px-6 py-6 rounded-xl flex-1 md:flex-none"
//                       >
//                         {aiLoading ? <Loader className="animate-spin mr-2" size={20} /> : <Zap size={20} className="mr-2" />} 
//                         Analyze Situation
//                       </Button>
//                       <Button 
//                         onClick={() => { setShowAiInput(false); setAiAnalysis(null); }} 
//                         variant="ghost" 
//                         className="px-6 py-6 rounded-xl"
//                       >
//                         Cancel
//                       </Button>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {aiAnalysis && (
//               <div className="mt-10 p-8 bg-muted/30 rounded-2xl border border-secondary/20 animate-in zoom-in-95">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
//                   <div>
//                     <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Severity Assessment</p>
//                     <div className={`text-3xl font-black flex items-center gap-3 ${aiAnalysis.severity === 'CRITICAL' ? 'text-destructive' : 'text-orange-500'}`}>
//                       <ShieldAlert size={32} /> {aiAnalysis.severity}
//                     </div>
//                   </div>
//                   <div>
//                     <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Protocol</p>
//                     <p className="text-lg font-medium leading-tight">{aiAnalysis.recommendation}</p>
//                   </div>
//                 </div>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//                   {aiAnalysis.services_needed.map((service) => (
//                     <button 
//                       key={service} 
//                       onClick={() => findNearestService(service)} 
//                       className="group px-6 py-4 bg-background border border-border rounded-xl hover:border-primary transition-all flex items-center justify-between shadow-sm hover:shadow-md"
//                     >
//                       <span className="font-bold capitalize">
//                         {searching && selectedService === service ? "Locating..." : `Locate ${service}`}
//                       </span>
//                       {searching && selectedService === service ? (
//                         <Loader size={18} className="animate-spin text-primary" />
//                       ) : (
//                         <MapPin size={18} className="text-primary group-hover:translate-y-[-2px] transition-transform" />
//                       )}
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </section>

//       {/* Services Grid */}
//       <section id="services-section" className="py-24 bg-background">
//         <div className="max-w-7xl mx-auto px-6">
//           <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
//             <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">Nearby Help</h2>
//             <p className="text-muted-foreground text-lg">One-tap navigation to the closest emergency facilities.</p>
//           </div>
          
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//             {['police', 'hospital', 'fire_station'].map((type) => (
//               <div 
//                 key={type} 
//                 className="group p-8 bg-card rounded-3xl border border-border hover:border-primary/50 hover:shadow-2xl transition-all duration-300"
//               >
//                 <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 transition-transform group-hover:scale-110 ${
//                   type === 'police' ? 'bg-blue-100 text-blue-600' : 
//                   type === 'hospital' ? 'bg-red-100 text-red-600' : 
//                   'bg-orange-100 text-orange-600'
//                 }`}>
//                   {type === 'police' && <ShieldAlert size={32} />}
//                   {type === 'hospital' && <Heart size={32} />}
//                   {type === 'fire_station' && <Zap size={32} />}
//                 </div>
//                 <h3 className="text-2xl font-bold mb-3 capitalize">{type} Services</h3>
//                 <p className="text-muted-foreground mb-8 line-clamp-2">Get direct coordinates for the nearest {type} station.</p>
                
//                 <Button 
//                   onClick={() => findNearestService(type)}
//                   className={`w-full py-6 rounded-xl font-bold text-lg shadow-lg transition-all ${
//                     type === 'police' ? 'bg-blue-600 hover:bg-blue-700' : 
//                     type === 'hospital' ? 'bg-red-600 hover:bg-red-700' : 
//                     'bg-orange-600 hover:bg-orange-700'
//                   }`}
//                 >
//                   {searching && selectedService === type ? <Loader className="animate-spin" size={24} /> : "Find Nearest"}
//                 </Button>

//                 {nearbyServices[type] && expandedService === type && (
//                   <div className="mt-8 p-6 bg-muted/50 rounded-2xl border border-border space-y-4 animate-in slide-in-from-bottom-2">
//                     <div>
//                       <p className="font-black text-lg leading-tight mb-1">{nearbyServices[type].name}</p>
//                       <p className="text-sm text-muted-foreground">{nearbyServices[type].distance} km away</p>
//                     </div>
//                     <div className="flex gap-2">
//                       <Button 
//                         variant="default"
//                         size="sm" 
//                         className="flex-1 rounded-lg h-11" 
//                         onClick={(e) => { e.stopPropagation(); callEmergency(nearbyServices[type].phone); }}
//                       >
//                         <Phone size={16} className="mr-2"/> Call
//                       </Button>
//                       <a 
//                         href={nearbyServices[type].directions_url} 
//                         target="_blank" 
//                         rel="noopener noreferrer"
//                         className="flex-1 bg-background border border-border text-sm rounded-lg flex items-center justify-center gap-2 font-bold hover:bg-muted transition-colors"
//                       >
//                         <Navigation size={16}/> Route
//                       </a>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Map Section */}
//       {showMap && mapHtml && (
//         <section className="py-20 bg-muted/30 border-t border-border animate-in fade-in duration-700">
//           <div className="max-w-7xl mx-auto px-6">
//             <div className="flex items-center justify-between mb-8">
//               <h2 className="text-3xl font-bold">Location Overview</h2>
//               <Button variant="ghost" onClick={() => setShowMap(false)}>Close Map</Button>
//             </div>
//             <div 
//               className="rounded-3xl overflow-hidden shadow-2xl border border-border bg-card min-h-[500px]" 
//               dangerouslySetInnerHTML={{ __html: mapHtml }} 
//             />
//           </div>
//         </section>
//       )}

//       {/* Safety Tips */}
//       <section className="py-24 bg-card border-t border-border">
//         <div className="max-w-7xl mx-auto px-6">
//           <h2 className="text-3xl md:text-4xl font-bold mb-16 text-center">Safety Guidelines</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//             {[
//               { title: 'Stay Calm & Composed', desc: 'Panic clouds judgment. Take a moment to breathe before acting.' },
//               { title: 'Immediate Reporting', desc: 'Don\'t hesitate. Every second counts in an emergency.' },
//               { title: 'Precise Location', desc: 'Identify visible landmarks if GPS signal is weak.' },
//               { title: 'Basic First Aid', desc: 'Maintain composure and assist victims while waiting for help.' }
//             ].map((tip, i) => (
//               <div key={i} className="p-8 bg-background rounded-2xl border border-border hover:border-primary/20 transition-colors flex items-start gap-6">
//                 <div className="mt-1">
//                   <CheckCircle className="w-8 h-8 text-green-500" />
//                 </div>
//                 <div>
//                   <h3 className="text-xl font-bold mb-2">{tip.title}</h3>
//                   <p className="text-muted-foreground leading-relaxed">{tip.desc}</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       <footer className="py-12 border-t border-border/40 text-center text-muted-foreground text-sm">
//         <p>© 2026 Emergency Response AI. India's Safety Initiative.</p>
//       </footer>
//     </main>
//   );
// }



'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import MapComponent from '@/components/map-component';
import { 
  AlertCircle, MapPin, Phone, Clock, Heart, Navigation, Loader, 
  ShieldAlert, Zap, Brain, CheckCircle, User 
} from 'lucide-react';
import { Button } from '@/components/ui/button';

// --- Interfaces ---
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

export default function DashboardPage() {
  const router = useRouter();

  // --- State ---
  const [authChecking, setAuthChecking] = useState(true);
  const [userName, setUserName] = useState<string | null>(null);
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

  // --- Auth & Data Initialization ---
  useEffect(() => {
    const checkAuth = () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
      const storedName = typeof window !== 'undefined' ? localStorage.getItem('user_name') : null;
      
      if (!token) {
        router.push('/auth/landing');
        return;
      }

      if (storedName && storedName !== "null") {
        setUserName(storedName);
      } else {
        try {
          const base64Url = token.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const decoded = JSON.parse(window.atob(base64));
          setUserName(decoded.name || decoded.sub || "Authorized User");
        } catch (e) {
          setUserName("Authorized User");
        }
      }
      setAuthChecking(false);
    };

    checkAuth();

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({ 
            lat: position.coords.latitude, 
            lng: position.coords.longitude 
          });
          setLoading(false);
        },
        (error) => {
          console.error("Geolocation Error:", error);
          setUserLocation({ lat: 28.6139, lng: 77.2090 });
          setLoading(false);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    }
  }, [router]);

  // --- Logic Functions ---
  const callEmergency = (number: string) => {
    window.location.href = `tel:${number}`;
  };

  const findNearestService = async (serviceType: string) => {
    if (loading || !userLocation) {
        return alert('Still pinpointing your precise location. Please wait...');
    }
    
    const token = localStorage.getItem('auth_token'); 
    if (!token) return alert("Session expired. Please login again.");

    setSearching(true);
    setSelectedService(serviceType);
    setExpandedService(serviceType);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const typeParam = (serviceType === 'fire' || serviceType === 'fire_station') ? 'fire_station' : serviceType;

      const response = await fetch(`${apiUrl}/api/find-nearby`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({
          lat: userLocation.lat,
          lon: userLocation.lng,
          service_type: typeParam
        }),
      });

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server error: Received unexpected response format.");
      }

      const data = await response.json();

      if (response.ok) {
        // FIX: Corrected template literal syntax and standard Google Maps URL format
        // const gMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${data.lat},${data.lon}&travelmode=driving`;
        const gMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${data.lat},${data.lon}&travelmode=driving`;
        // Inside findNearestService function...
        // Fix the URL generation line:
            // const gMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${data.lat},${data.lon}&travelmode=driving`;
        const resolvedAddress = data.service_address || data.address || "Location identified";

        setNearbyServices(prev => ({ 
          ...prev, 
          [serviceType]: {
            name: data.name || `Nearest ${serviceType}`,
            distance: parseFloat(data.distance?.toFixed(2) || "0"),
            phone: data.phone || INDIA_EMERGENCY_NUMBERS.all,
            address: resolvedAddress,
            lat: data.lat,
            lon: data.lon,
            directions_url: gMapsUrl
          }
        }));

        if (data.map_html) {
          setMapHtml(data.map_html);
          setShowMap(true);
        }

        // Search History Logging (Silent error handling to avoid disrupting UI)
        fetch(`${apiUrl}/api/search-history`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
          },
          body: JSON.stringify({
            service_type: serviceType,
            search_address: `${userLocation.lat}, ${userLocation.lng}`,
            found_service_name: data.name,
            found_service_address: resolvedAddress,
            distance_km: data.distance,
            found_service_phone: data.phone
          }),
        }).catch(err => console.error("History log failed:", err));

        document.getElementById('services-section')?.scrollIntoView({ behavior: 'smooth' });

      } else {
        alert(data.error || 'Server error occurred.');
      }
    } catch (error) {
      console.error("Fetch error:", error);
      alert("Cannot connect to server. Ensure the backend is running and CORS is allowed.");
    } finally {
      setSearching(false);
    }
  };

  const handleAiAnalysis = async () => {
    if (!aiDescription.trim()) return alert('Please describe the emergency');
    setAiLoading(true);
    
    setTimeout(() => {
      const desc = aiDescription.toLowerCase();
      let severity: AiAnalysisResult['severity'] = 'MEDIUM';
      let services = ['hospital'];

      if (desc.includes('fire') || desc.includes('smoke') || desc.includes('burn')) {
        severity = 'CRITICAL';
        services = ['fire_station', 'hospital'];
      } else if (desc.includes('accident') || desc.includes('blood') || desc.includes('unconscious')) {
        severity = 'CRITICAL';
        services = ['hospital', 'police'];
      } else if (desc.includes('theft') || desc.includes('robbery')) {
        severity = 'HIGH';
        services = ['police'];
      }

      setAiAnalysis({ 
        severity, 
        recommendation: severity === 'CRITICAL' 
          ? 'IMMEDIATE ACTION: Call 112 and move to a safe distance.' 
          : 'Stay alert. Contact the nearest suggested service below.', 
        services_needed: services 
      });
      setAiLoading(false);
    }, 1200);
  };

  if (authChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <main className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/10 pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="mb-8 flex items-center gap-2 bg-primary/10 w-fit px-4 py-2 rounded-full border border-primary/20">
            <User size={16} className="text-primary" />
            <span className="text-sm font-semibold text-primary">Welcome back, {userName}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent leading-[1.1]">
                Safety at <br />Every Step
              </h1>
              <p className="text-xl text-muted-foreground max-w-lg leading-relaxed">
                Instant access to emergency services. Locate hospitals, police, and fire stations with AI-driven insights to keep you and your loved ones protected.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button 
                  onClick={() => callEmergency(INDIA_EMERGENCY_NUMBERS.all)} 
                  className="px-8 py-4 bg-gradient-to-r from-destructive to-orange-600 text-white font-bold rounded-xl hover:scale-105 transition-all flex items-center justify-center gap-3 shadow-xl"
                >
                  <AlertCircle size={22} /> Emergency Call ({INDIA_EMERGENCY_NUMBERS.all})
                </button>
                <Link 
                  href="/main/emergency-contacts" 
                  className="px-8 py-4 border-2 border-primary/30 text-primary font-bold rounded-xl hover:bg-primary/5 transition-all text-center flex items-center justify-center"
                >
                  My Contacts
                </Link>
              </div>
            </div>
            
            <div className="relative h-[400px] rounded-3xl overflow-hidden shadow-2xl border-4 border-background">
              {!loading && userLocation ? (
                <MapComponent location={userLocation} />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-muted/50">
                  <Loader className="mb-4 text-primary animate-spin" size={40} />
                  <p className="text-muted-foreground font-medium">Pinpointing location...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Quick Connect Grid */}
      <section className="py-12 bg-card border-y border-border/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-4">
            <h3 className="text-2xl font-bold tracking-tight">Quick Connect</h3>
            <span className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-md">Official India Emergency Lines</span>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'Police', number: INDIA_EMERGENCY_NUMBERS.police, color: 'from-blue-600 to-indigo-700', icon: ShieldAlert },
              { name: 'Ambulance', number: INDIA_EMERGENCY_NUMBERS.ambulance, color: 'from-red-600 to-rose-700', icon: Heart },
              { name: 'Fire', number: INDIA_EMERGENCY_NUMBERS.fire, color: 'from-orange-600 to-amber-700', icon: Zap },
              { name: 'SOS All', number: INDIA_EMERGENCY_NUMBERS.all, color: 'from-slate-800 to-slate-900', icon: AlertCircle }
            ].map((service) => (
              <button 
                key={service.number} 
                onClick={() => callEmergency(service.number)} 
                className={`group relative p-6 bg-gradient-to-br ${service.color} text-white rounded-2xl hover:shadow-2xl transition-all hover:-translate-y-1 text-left overflow-hidden`}
              >
                <service.icon className="absolute right-[-10px] bottom-[-10px] w-24 h-24 opacity-10 group-hover:scale-110 transition-transform" />
                <div className="text-3xl font-black mb-1">{service.number}</div>
                <div className="text-sm font-medium opacity-90 uppercase tracking-widest">{service.name}</div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* AI Assistant Section */}
      <section className="py-20 bg-gradient-to-b from-transparent to-secondary/5 px-6">
        <div className="max-w-5xl mx-auto bg-card border border-border shadow-sm rounded-3xl p-8 md:p-12">
          <div className="flex items-start gap-6">
            <div className="p-4 bg-secondary/10 rounded-2xl">
              <Brain className="w-10 h-10 text-secondary" />
            </div>
            <div className="flex-1 space-y-4">
              <h2 className="text-3xl font-bold">AI Response Assistant</h2>
              <p className="text-muted-foreground text-lg">Describe the situation, and our AI will determine the priority and necessary services.</p>
              
              {!showAiInput ? (
                <Button 
                  onClick={() => setShowAiInput(true)} 
                  size="lg"
                  className="bg-secondary hover:bg-secondary/90 text-white px-8 rounded-xl"
                >
                  Start Analysis
                </Button>
              ) : (
                <div className="space-y-4 mt-6 animate-in fade-in slide-in-from-top-4">
                  <textarea 
                    value={aiDescription} 
                    onChange={(e) => setAiDescription(e.target.value)} 
                    placeholder="e.g., Someone is unconscious and breathing is difficult..." 
                    className="w-full px-5 py-4 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-secondary transition-all min-h-[120px] text-lg"
                  />
                  <div className="flex gap-3">
                    <Button 
                      onClick={handleAiAnalysis} 
                      disabled={aiLoading || !aiDescription.trim()} 
                      className="bg-secondary hover:bg-secondary/90 text-white px-6 py-6 rounded-xl flex-1 md:flex-none"
                    >
                      {aiLoading ? <Loader className="animate-spin mr-2" size={20} /> : <Zap size={20} className="mr-2" />} 
                      Analyze Situation
                    </Button>
                    <Button 
                      onClick={() => { setShowAiInput(false); setAiAnalysis(null); }} 
                      variant="ghost" 
                      className="px-6 py-6 rounded-xl"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {aiAnalysis && (
            <div className="mt-10 p-8 bg-muted/30 rounded-2xl border border-secondary/20 animate-in zoom-in-95">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Severity Assessment</p>
                  <div className={`text-3xl font-black flex items-center gap-3 ${aiAnalysis.severity === 'CRITICAL' ? 'text-destructive' : 'text-orange-500'}`}>
                    <ShieldAlert size={32} /> {aiAnalysis.severity}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Protocol</p>
                  <p className="text-lg font-medium leading-tight">{aiAnalysis.recommendation}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {aiAnalysis.services_needed.map((service) => (
                  <button 
                    key={service} 
                    onClick={() => findNearestService(service)} 
                    className="group px-6 py-4 bg-background border border-border rounded-xl hover:border-primary transition-all flex items-center justify-between shadow-sm hover:shadow-md"
                  >
                    <span className="font-bold capitalize">
                      {searching && selectedService === service ? "Locating..." : `Locate ${service.replace('_', ' ')}`}
                    </span>
                    <MapPin size={18} className="text-primary group-hover:translate-y-[-2px] transition-transform" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Nearby Services Grid */}
      <section id="services-section" className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">Nearby Help</h2>
            <p className="text-muted-foreground text-lg">One-tap navigation to the closest emergency facilities.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {['police', 'hospital', 'fire_station'].map((type) => (
              <div 
                key={type} 
                className="group p-8 bg-card rounded-3xl border border-border hover:border-primary/50 hover:shadow-2xl transition-all duration-300"
              >
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 transition-transform group-hover:scale-110 ${
                  type === 'police' ? 'bg-blue-100 text-blue-600' : 
                  type === 'hospital' ? 'bg-red-100 text-red-600' : 
                  'bg-orange-100 text-orange-600'
                }`}>
                  {type === 'police' && <ShieldAlert size={32} />}
                  {type === 'hospital' && <Heart size={32} />}
                  {type === 'fire_station' && <Zap size={32} />}
                </div>
                <h3 className="text-2xl font-bold mb-3 capitalize">{type.replace('_', ' ')}</h3>
                <p className="text-muted-foreground mb-8 line-clamp-2">Get direct coordinates for the nearest {type.replace('_', ' ')}.</p>
                
                <Button 
                  onClick={() => findNearestService(type)}
                  className={`w-full py-6 rounded-xl font-bold text-lg shadow-lg transition-all ${
                    type === 'police' ? 'bg-blue-600 hover:bg-blue-700' : 
                    type === 'hospital' ? 'bg-red-600 hover:bg-red-700' : 
                    'bg-orange-600 hover:bg-orange-700'
                  }`}
                >
                  {searching && selectedService === type ? <Loader className="animate-spin" size={24} /> : "Find Nearest"}
                </Button>

                {nearbyServices[type] && expandedService === type && (
                  <div className="mt-8 p-6 bg-muted/50 rounded-2xl border border-border space-y-4 animate-in slide-in-from-bottom-2">
                    <div>
                      <p className="font-black text-lg leading-tight mb-1">{nearbyServices[type].name}</p>
                      <p className="text-sm text-muted-foreground">{nearbyServices[type].distance} km away</p>
                      <p className="text-xs text-muted-foreground mt-2 italic">{nearbyServices[type].address}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="default"
                        size="sm" 
                        className="flex-1 rounded-lg h-11" 
                        onClick={(e) => { e.stopPropagation(); callEmergency(nearbyServices[type].phone); }}
                      >
                        <Phone size={16} className="mr-2"/> Call
                      </Button>
                      <a 
                        href={nearbyServices[type].directions_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex-1 bg-background border border-border text-sm rounded-lg flex items-center justify-center gap-2 font-bold hover:bg-muted transition-colors"
                      >
                        <Navigation size={16}/> Route
                      </a>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Map Section */}
      {showMap && mapHtml && (
        <section className="py-20 bg-muted/30 border-t border-border animate-in fade-in duration-700 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold">Location Overview</h2>
              <Button variant="ghost" onClick={() => setShowMap(false)}>Close Map</Button>
            </div>
            <div 
              className="rounded-3xl overflow-hidden shadow-2xl border border-border bg-card min-h-[500px]" 
              dangerouslySetInnerHTML={{ __html: mapHtml }} 
            />
          </div>
        </section>
      )}

      {/* Safety Tips Section */}
      <section className="py-24 bg-card border-t border-border">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-16 text-center">Safety Guidelines</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { title: 'Stay Calm & Composed', desc: 'Panic clouds judgment. Take a moment to breathe before acting.' },
              { title: 'Immediate Reporting', desc: 'Don\'t hesitate. Every second counts in an emergency.' },
              { title: 'Precise Location', desc: 'Identify visible landmarks if GPS signal is weak.' },
              { title: 'Basic First Aid', desc: 'Maintain composure and assist victims while waiting for help.' }
            ].map((tip, i) => (
              <div key={i} className="p-8 bg-background rounded-2xl border border-border hover:border-primary/20 transition-colors flex items-start gap-6">
                <div className="mt-1">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">{tip.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{tip.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="py-12 border-t border-border/40 text-center text-muted-foreground text-sm">
        <p>© 2026 Emergency Response AI. India's Safety Initiative.</p>
      </footer>
    </main>
  );
}