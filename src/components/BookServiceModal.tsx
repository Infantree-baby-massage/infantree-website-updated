/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState } from 'react';
import { X, CheckCircle, ShieldCheck, ArrowRight } from 'lucide-react';
import { BASIC_PLANS, NAVI_MUMBAI_AREAS } from '../data';
import { db } from '../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

interface BookServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPlanId?: string;
  onSuccess: () => void;
}

export default function BookServiceModal({ isOpen, onClose, initialPlanId, onSuccess }: BookServiceModalProps) {
  const [selectedPlanId, setSelectedPlanId] = useState(initialPlanId || BASIC_PLANS[0].id);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState('');
  const [specificArea, setSpecificArea] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorStatus, setErrorStatus] = useState('');

  if (!isOpen) return null;

  const currentPlanObj = BASIC_PLANS.find(p => p.id === selectedPlanId) || BASIC_PLANS[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !location) {
      setErrorStatus('Please fill in all requested fields (Name, Phone and Area).');
      return;
    }
    setErrorStatus('');
    setIsSubmitting(true);

    try {
      const combinedLocation = specificArea ? `${location} - ${specificArea}` : location;
      const finalNotes = `Address: ${address}\n\n${notes}`;

      const payload = {
        srNo: '', 
        timestamp: new Date().toISOString(), 
        name: name.substring(0, 200), 
        phone: phone.substring(0, 30), 
        location: combinedLocation.substring(0, 500), 
        notes: finalNotes.substring(0, 2000), 
        email: email ? email.substring(0, 254) : '', 
        address: address.substring(0, 500), 
        selectedPlan: currentPlanObj.name.substring(0, 200) 
      };

      // 1. Save to Firebase
      await addDoc(collection(db, 'bookings'), payload);

      // 2. Send to Google Sheets
    console.log("Payload check:", JSON.stringify(payload));

    try {
      await fetch(
        'https://script.google.com/macros/s/AKfycbyi4Pz-5HfhT0R30K36LXBHM5igRznUrxQud-aeZrAVNxBfxg8sEScYcOhiVllPzkFoJQ/exec',
        {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }
      );
      
      setShowSuccess(true);
      onSuccess();
    } catch (err: any) {
      console.error(err);
      setErrorStatus('Network error or connection failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
      
    const handleWhatsAppRedirect = () => {
    const text = `Hello Infantree Team, I have just secured a slot on your website under the name: ${name} (${phone}) for the ${currentPlanObj.name}. Can we please configure my schedule?`;
    window.open(`https://wa.me/917304367566?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/80 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-stone-50 border border-stone-200 shadow-2xl rounded-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="bg-emerald-800 px-6 py-4 text-white flex items-center justify-between">
          <h3 className="font-display text-base font-semibold">Configure Care Subscription</h3>
          <button onClick={onClose} className="text-white p-1.5 rounded-full hover:bg-emerald-700/60"><X className="w-5 h-5" /></button>
        </div>
        
        <div className="overflow-y-auto p-6 flex-1">
          {!showSuccess ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Form inputs are kept same as your previous code */}
              <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2 border rounded" required />
              <input type="tel" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full p-2 border rounded" required />
              <select value={location} onChange={(e) => setLocation(e.target.value)} className="w-full p-2 border rounded" required>
                <option value="">Select Area</option>
                {NAVI_MUMBAI_AREAS.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
              <textarea placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} className="w-full p-2 border rounded" required />
              
              <button type="submit" disabled={isSubmitting} className="w-full bg-emerald-800 text-white py-3 rounded-xl font-semibold">
                {isSubmitting ? 'Securing...' : 'Secure My Care Slot'}
              </button>
            </form>
          ) : (
            <div className="text-center py-10">
              <CheckCircle className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
              <p>Success! Your request has been sent.</p>
              <button onClick={handleWhatsAppRedirect} className="mt-4 bg-[#128C7E] text-white py-2 px-6 rounded-lg">Confirm via WhatsApp</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
