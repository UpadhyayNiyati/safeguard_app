// 'use client';

// import { useState, useEffect } from 'react';
// import Footer from '@/components/footer';
// import { Plus, Trash2, Phone, Edit2 } from 'lucide-react';

// interface Contact {
//   id: string;
//   name: string;
//   relationship: string;
//   phone: string;
// }

// export default function EmergencyContacts() {
//   const [contacts, setContacts] = useState<Contact[]>([]);
//   const [showForm, setShowForm] = useState(false);
//   const [editingId, setEditingId] = useState<string | null>(null);
//   const [formData, setFormData] = useState({
//     name: '',
//     relationship: '',
//     phone: '',
//   });

//   // Load contacts from localStorage
//   useEffect(() => {
//     const saved = localStorage.getItem('emergencyContacts');
//     if (saved) {
//       setContacts(JSON.parse(saved));
//     }
//   }, []);

//   // Save contacts to localStorage
//   const saveContacts = (updatedContacts: Contact[]) => {
//     localStorage.setItem('emergencyContacts', JSON.stringify(updatedContacts));
//     setContacts(updatedContacts);
//   };

//   const handleAddContact = (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!formData.name || !formData.phone) {
//       alert('Please fill in all fields');
//       return;
//     }

//     if (editingId) {
//       // Update existing contact
//       const updated = contacts.map((c) =>
//         c.id === editingId
//           ? { ...c, ...formData }
//           : c
//       );
//       saveContacts(updated);
//       setEditingId(null);
//     } else {
//       // Add new contact
//       const newContact: Contact = {
//         id: Date.now().toString(),
//         ...formData,
//       };
//       saveContacts([...contacts, newContact]);
//     }

//     setFormData({ name: '', relationship: '', phone: '' });
//     setShowForm(false);
//   };

//   const handleDeleteContact = (id: string) => {
//     if (confirm('Are you sure you want to delete this contact?')) {
//       saveContacts(contacts.filter((c) => c.id !== id));
//     }
//   };

//   const handleEditContact = (contact: Contact) => {
//     setFormData({
//       name: contact.name,
//       relationship: contact.relationship,
//       phone: contact.phone,
//     });
//     setEditingId(contact.id);
//     setShowForm(true);
//   };

//   return (
//     <main className="min-h-screen flex flex-col bg-background">
//       <section className="flex-1 py-16 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
//         <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
//           {/* Header */}
//           <div className="mb-12">
//             <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
//               Emergency Contacts
//             </h1>
//             <p className="text-lg text-foreground/70">
//               Store and manage important contacts for quick access during emergencies
//             </p>
//           </div>

//           {/* Add Contact Button */}
//           {!showForm && (
//             <button
//               onClick={() => setShowForm(true)}
//               className="mb-8 px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
//             >
//               <Plus size={20} />
//               Add Emergency Contact
//             </button>
//           )}

//           {/* Add/Edit Form */}
//           {showForm && (
//             <div className="mb-12 p-8 bg-card rounded-xl border border-border">
//               <h2 className="text-2xl font-bold mb-6 text-foreground">
//                 {editingId ? 'Edit Contact' : 'Add New Contact'}
//               </h2>
              
//               <form onSubmit={handleAddContact} className="space-y-6">
//                 <div>
//                   <label className="block text-sm font-semibold text-foreground mb-2">
//                     Full Name
//                   </label>
//                   <input
//                     type="text"
//                     value={formData.name}
//                     onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                     placeholder="Enter name"
//                     className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-semibold text-foreground mb-2">
//                     Relationship
//                   </label>
//                   <input
//                     type="text"
//                     value={formData.relationship}
//                     onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
//                     placeholder="e.g., Mother, Friend, Colleague"
//                     className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-semibold text-foreground mb-2">
//                     Phone Number
//                   </label>
//                   <input
//                     type="tel"
//                     value={formData.phone}
//                     onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
//                     placeholder="Enter phone number"
//                     className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
//                   />
//                 </div>

//                 <div className="flex gap-4">
//                   <button
//                     type="submit"
//                     className="flex-1 px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
//                   >
//                     {editingId ? 'Update Contact' : 'Save Contact'}
//                   </button>
//                   <button
//                     type="button"
//                     onClick={() => {
//                       setShowForm(false);
//                       setEditingId(null);
//                       setFormData({ name: '', relationship: '', phone: '' });
//                     }}
//                     className="flex-1 px-6 py-3 border-2 border-primary text-primary font-semibold rounded-lg hover:bg-primary/5 transition-colors"
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               </form>
//             </div>
//           )}

//           {/* Contacts Grid */}
//           {contacts.length > 0 ? (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {contacts.map((contact) => (
//                 <div key={contact.id} className="p-6 bg-card rounded-xl border border-border hover:shadow-lg transition-shadow">
//                   <h3 className="text-xl font-bold text-foreground mb-2">{contact.name}</h3>
//                   <p className="text-foreground/70 mb-4 text-sm">{contact.relationship}</p>
                  
//                   <div className="space-y-3">
//                     <a
//                       href={`tel:${contact.phone}`}
//                       className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors font-semibold text-sm"
//                     >
//                       <Phone size={18} />
//                       {contact.phone}
//                     </a>
                    
//                     <div className="flex gap-2">
//                       <button
//                         onClick={() => handleEditContact(contact)}
//                         className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-secondary hover:bg-secondary/10 rounded-lg transition-colors font-semibold text-sm"
//                       >
//                         <Edit2 size={16} />
//                         Edit
//                       </button>
//                       <button
//                         onClick={() => handleDeleteContact(contact.id)}
//                         className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors font-semibold text-sm"
//                       >
//                         <Trash2 size={16} />
//                         Delete
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <div className="text-center py-16">
//               <div className="text-6xl mb-4">📋</div>
//               <h2 className="text-2xl font-bold text-foreground mb-2">No Contacts Yet</h2>
//               <p className="text-foreground/70 mb-6">Add your first emergency contact to get started</p>
//               <button
//                 onClick={() => setShowForm(true)}
//                 className="px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-lg hover:opacity-90 transition-opacity inline-flex items-center gap-2"
//               >
//                 <Plus size={20} />
//                 Add Contact
//               </button>
//             </div>
//           )}
//         </div>
//       </section>

//       {/* <Footer /> */}
//     </main>
//   );
// }




// 'use client';

// import { useState, useEffect } from 'react';
// import Footer from '@/components/footer';
// import { Plus, Trash2, Phone, Edit2 } from 'lucide-react';

// interface Contact {
//   id: string;
//   name: string;
//   relationship: string;
//   phone: string;
// }

// const API_URL = "http://127.0.0.1:5000/api";

// export default function EmergencyContacts() {
//   const [contacts, setContacts] = useState<Contact[]>([]);
//   const [showForm, setShowForm] = useState(false);
//   const [editingId, setEditingId] = useState<string | null>(null);
//   const [formData, setFormData] = useState({
//     name: '',
//     relationship: '',
//     phone: '',
//   });

//   // ✅ FIXED: Added explicit return type to satisfy TypeScript
//   const getAuthHeader = (): Record<string, string> => {
//     if (typeof window === 'undefined') return {}; // Safety check for SSR
//     const token = localStorage.getItem('access_token'); 
//     return token ? { 'Authorization': `Bearer ${token}` } : {};
//   };

//   // ✅ FETCH CONTACTS
//   const fetchContacts = async () => {
//     try {
//       const res = await fetch(`${API_URL}/contacts`, {
//         method: "GET",
//         headers: {
//           ...getAuthHeader(),
//         },
//       });

//       const data = await res.json();
//       if (res.ok) {
//         setContacts(data);
//       } else {
//         console.error(data.error);
//       }
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   useEffect(() => {
//     fetchContacts();
//   }, []);

//   useEffect(() => {
//     if (contacts.length > 0) {
//       localStorage.setItem('emergencyContacts', JSON.stringify(contacts));
//     }
//   }, [contacts]);

//   // ✅ ADD / UPDATE CONTACT
//   const handleAddContact = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!formData.name || !formData.phone) {
//       alert('Please fill in all fields');
//       return;
//     }

//     try {
//       const url = editingId ? `${API_URL}/contacts/${editingId}` : `${API_URL}/contacts`;
//       const method = editingId ? "PUT" : "POST";

//       const res = await fetch(url, {
//         method: method,
//         headers: {
//           "Content-Type": "application/json",
//           ...getAuthHeader(), // TypeScript is happy now
//         },
//         body: JSON.stringify(formData),
//       });

//       const data = await res.json();
//       if (!res.ok) throw new Error(data.error || "Failed to save contact");

//       fetchContacts();
//       setFormData({ name: '', relationship: '', phone: '' });
//       setShowForm(false);
//       setEditingId(null);

//     } catch (err: any) {
//       alert(err.message);
//     }
//   };

//   // ✅ DELETE CONTACT
//   const handleDeleteContact = async (id: string) => {
//     if (!confirm('Are you sure you want to delete this contact?')) return;

//     try {
//       const res = await fetch(`${API_URL}/contacts/${id}`, {
//         method: "DELETE",
//         headers: {
//           ...getAuthHeader(),
//         },
//       });

//       const data = await res.json();
//       if (!res.ok) throw new Error(data.error || "Failed to delete");

//       fetchContacts();
//     } catch (err: any) {
//       alert(err.message);
//     }
//   };

//   const handleEditContact = (contact: Contact) => {
//     setFormData({
//       name: contact.name,
//       relationship: contact.relationship,
//       phone: contact.phone,
//     });
//     setEditingId(contact.id);
//     setShowForm(true);
//   };

//   return (
//     <main className="min-h-screen flex flex-col bg-background">
//       <section className="flex-1 py-16 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
//         <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

//           <div className="mb-12">
//             <h1 className="text-5xl font-bold mb-4 pb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
//               Emergency Contacts
//             </h1>
//             <p className="text-lg text-foreground/70">
//               Store and manage important contacts for quick access during emergencies
//             </p>
//           </div>

//           {!showForm && (
//             <button
//               onClick={() => setShowForm(true)}
//               className="mb-8 px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
//             >
//               <Plus size={20} />
//               Add Emergency Contact
//             </button>
//           )}

//           {showForm && (
//             <div className="mb-12 p-8 bg-card rounded-xl border border-border">
//               <h2 className="text-2xl font-bold mb-6 text-foreground">
//                 {editingId ? 'Edit Contact' : 'Add New Contact'}
//               </h2>

//               <form onSubmit={handleAddContact} className="space-y-6">
//                 <div>
//                   <label className="block text-sm font-semibold text-foreground mb-2">Full Name</label>
//                   <input
//                     type="text"
//                     value={formData.name}
//                     onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                     placeholder="Enter name"
//                     className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-semibold text-foreground mb-2">Relationship</label>
//                   <input
//                     type="text"
//                     value={formData.relationship}
//                     onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
//                     placeholder="e.g., Mother, Friend, Colleague"
//                     className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-semibold text-foreground mb-2">Phone Number</label>
//                   <input
//                     type="tel"
//                     value={formData.phone}
//                     onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
//                     placeholder="Enter phone number"
//                     className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
//                   />
//                 </div>

//                 <div className="flex gap-4">
//                   <button type="submit" className="flex-1 px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-lg hover:opacity-90 transition-opacity">
//                     {editingId ? 'Update Contact' : 'Save Contact'}
//                   </button>
//                   <button
//                     type="button"
//                     onClick={() => {
//                       setShowForm(false);
//                       setEditingId(null);
//                       setFormData({ name: '', relationship: '', phone: '' });
//                     }}
//                     className="flex-1 px-6 py-3 border-2 border-primary text-primary font-semibold rounded-lg hover:bg-primary/5 transition-colors"
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               </form>
//             </div>
//           )}

//           {contacts.length > 0 ? (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {contacts.map((contact) => (
//                 <div key={contact.id} className="p-6 bg-card rounded-xl border border-border hover:shadow-lg transition-shadow">
//                   <h3 className="text-xl font-bold text-foreground mb-2">{contact.name}</h3>
//                   <p className="text-foreground/70 mb-4 text-sm">{contact.relationship}</p>
//                   <div className="space-y-3">
//                     <a href={`tel:${contact.phone}`} className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors font-semibold text-sm">
//                       <Phone size={18} /> {contact.phone}
//                     </a>
//                     <div className="flex gap-2">
//                       <button onClick={() => handleEditContact(contact)} className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-secondary hover:bg-secondary/10 rounded-lg transition-colors font-semibold text-sm">
//                         <Edit2 size={16} /> Edit
//                       </button>
//                       <button onClick={() => handleDeleteContact(contact.id)} className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors font-semibold text-sm">
//                         <Trash2 size={16} /> Delete
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <div className="text-center py-16">
//               <div className="text-6xl mb-4">📋</div>
//               <h2 className="text-2xl font-bold text-foreground mb-2">No Contacts Yet</h2>
//               <p className="text-foreground/70 mb-6">Add your first emergency contact to get started</p>
//               <button onClick={() => setShowForm(true)} className="px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-lg hover:opacity-90 transition-opacity inline-flex items-center gap-2">
//                 <Plus size={20} /> Add Contact
//               </button>
//             </div>
//           )}
//         </div>
//       </section>
//       {/* <Footer /> */}
//     </main>
//   );
// }



























'use client';

import { useState, useEffect } from 'react';
import Footer from '@/components/footer';
import { Plus, Trash2, Phone, Edit2 } from 'lucide-react';

interface Contact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
}

export default function EmergencyContacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    relationship: '',
    phone: '',
  });

  // Load contacts from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('emergencyContacts');
    if (saved) {
      setContacts(JSON.parse(saved));
    }
  }, []);

  // Save contacts to localStorage
  const saveContacts = (updatedContacts: Contact[]) => {
    localStorage.setItem('emergencyContacts', JSON.stringify(updatedContacts));
    setContacts(updatedContacts);
  };

  const handleAddContact = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone) {
      alert('Please fill in all fields');
      return;
    }

    if (editingId) {
      // Update existing contact
      const updated = contacts.map((c) =>
        c.id === editingId
          ? { ...c, ...formData }
          : c
      );
      saveContacts(updated);
      setEditingId(null);
    } else {
      // Add new contact
      const newContact: Contact = {
        id: Date.now().toString(),
        ...formData,
      };
      saveContacts([...contacts, newContact]);
    }

    setFormData({ name: '', relationship: '', phone: '' });
    setShowForm(false);
  };

  const handleDeleteContact = (id: string) => {
    if (confirm('Are you sure you want to delete this contact?')) {
      saveContacts(contacts.filter((c) => c.id !== id));
    }
  };

  const handleEditContact = (contact: Contact) => {
    setFormData({
      name: contact.name,
      relationship: contact.relationship,
      phone: contact.phone,
    });
    setEditingId(contact.id);
    setShowForm(true);
  };

  return (
    <main className="min-h-screen flex flex-col bg-background">
      <section className="flex-1 py-16 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-12">
            {/* //<h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              //Emergency Contacts
            //</h1> */}

            <h1 className="text-5xl font-bold mb-4 pb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
  Emergency Contacts
</h1>
            <p className="text-lg text-foreground/70">
              Store and manage important contacts for quick access during emergencies
            </p>
          </div>

          {/* Add Contact Button */}
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="mb-8 px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
            >
              <Plus size={20} />
              Add Emergency Contact
            </button>
          )}

          {/* Add/Edit Form */}
          {showForm && (
            <div className="mb-12 p-8 bg-card rounded-xl border border-border">
              <h2 className="text-2xl font-bold mb-6 text-foreground">
                {editingId ? 'Edit Contact' : 'Add New Contact'}
              </h2>
              
              <form onSubmit={handleAddContact} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter name"
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Relationship
                  </label>
                  <input
                    type="text"
                    value={formData.relationship}
                    onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                    placeholder="e.g., Mother, Friend, Colleague"
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Enter phone number"
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
                  >
                    {editingId ? 'Update Contact' : 'Save Contact'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingId(null);
                      setFormData({ name: '', relationship: '', phone: '' });
                    }}
                    className="flex-1 px-6 py-3 border-2 border-primary text-primary font-semibold rounded-lg hover:bg-primary/5 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Contacts Grid */}
          {contacts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {contacts.map((contact) => (
                <div key={contact.id} className="p-6 bg-card rounded-xl border border-border hover:shadow-lg transition-shadow">
                  <h3 className="text-xl font-bold text-foreground mb-2">{contact.name}</h3>
                  <p className="text-foreground/70 mb-4 text-sm">{contact.relationship}</p>
                  
                  <div className="space-y-3">
                    <a
                      href={`tel:${contact.phone}`}
                      className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors font-semibold text-sm"
                    >
                      <Phone size={18} />
                      {contact.phone}
                    </a>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditContact(contact)}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-secondary hover:bg-secondary/10 rounded-lg transition-colors font-semibold text-sm"
                      >
                        <Edit2 size={16} />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteContact(contact.id)}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors font-semibold text-sm"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📋</div>
              <h2 className="text-2xl font-bold text-foreground mb-2">No Contacts Yet</h2>
              <p className="text-foreground/70 mb-6">Add your first emergency contact to get started</p>
              <button
                onClick={() => setShowForm(true)}
                className="px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-lg hover:opacity-90 transition-opacity inline-flex items-center gap-2"
              >
                <Plus size={20} />
                Add Contact
              </button>
            </div>
          )}
        </div>
      </section>

      {/* <Footer /> */}
    </main>
  );
}