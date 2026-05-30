/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Check, Gift, Sparkles, Phone, Shield } from 'lucide-react';
import { NAVI_MUMBAI_AREAS } from '../data';
import { db } from '../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

interface TrialBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function TrialBookingModal({ isOpen, onClose, onSuccess }: TrialBookingModalProps) {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !location) {
      setErrorStatus('Please fill in all required fields (Name, Phone and Service Location).');
      return;
    }
    setErrorStatus('');
    setIsSubmitting(true);

    try {
      const combinedLocation = specificArea ? `${location} - ${specificArea}` : location;
      const finalNotes = `Address: ${address}\n\n${notes}`;

      const payload = {
        name: name.substring(0, 200),
        phone: phone.substring(0, 30),
        email: email ? email.substring(0, 254) : '',
        location: combinedLocation.substring(0, 500),
        notes: finalNotes.substring(0, 2000),
        source: 'Website Trial Booking Modal',
        timestamp: new Date().toISOString()
      };

      await addDoc(collection(db, 'trial_requests'), payload);

      // Async Google Sheet Notification via Webhook
      (async () => {
        try {
          await fetch('https://script.google.com/macros/s/AKfycbyPG6MtFFVed-4HmT2bQaoSp2_8cYCjZUOSuh-9z2xJpNVZ897hCLpF0l2dB4PAWW5loQ/exec', {
            method: 'POST'
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
        } catch (e) { 
          console.error("Google Sheet update failed:", e); 
        }
      })();

      setShowSuccess(true);
      onSuccess();
    } catch (err: any) {
      if (err.message && err.message.includes('permissions')) {
        setErrorStatus('Please ensure phone is minimum 10 digits and required fields are valid.');
      } else {
        setErrorStatus('Network connection issue. Please verify your connection or reach us via WhatsApp.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsAppRedirect = () => {
    const text = `Hello Infantree Team, I\'ve just requested a Trial Massage & Bath Session for ₹1,299. My name is ${name} and phone is ${phone}. Can you help me finalize the specialist schedule?`;
    window.open(`https://wa.me/917304367566?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/80 backdrop-blur-sm animate-fade-in" id="trial-modal-overlay">
      <div 
        className="relative w-full max-w-xl bg-stone-50 border border-stone-200 shadow-2xl rounded-2xl overflow-hidden max-h-[92vh] flex flex-col animate-scale-up" 
        id="trial-booking-modal"
      >
        {/* Top banner highlighting trial savings info */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-800 px-6 py-4.5 text-white flex items-center justify-between" id="trial-modal-header">
          <div>
            <div className="flex items-center gap-1.5 text-xs bg-emerald-900/60 text-emerald-200 w-fit px-2 py-0.5 rounded-full font-sans font-medium tracking-wide border border-emerald-700/40 mb-1">
              <Sparkles className="w-3 h-3 text-teal-300" /> Professional Home trial
            </div>
            <h3 className="font-display text-base font-semibold tracking-tight">Book At-Home Trial Visit</h3>
          </div>
          <button 
            onClick={onClose} 
            className="text-stone-300 hover:text-white hover:bg-emerald-700/50 p-1.5 rounded-full transition-all cursor-pointer"
            aria-label="Close"
            id="close-trial-modal-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form or Success State */}
        <div className="overflow-y-auto p-6 sm:p-8 flex-1" id="trial-modal-body">
          {!showSuccess ? (
            <form onSubmit={handleSubmit} className="space-y-5" id="trial-form">
              {/* Highlight Box showing pricing info in premium visual form */}
              <div className="bg-stone-150 rounded-xl p-4 border border-stone-200 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between" id="trial-fee-banner">
                <div className="space-y-0.5">
                  <div className="text-[10px] uppercase font-bold text-stone-500 tracking-wider">Session Fee</div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xl font-display font-semibold text-stone-850">₹1,299</span>
                    <span className="text-xs text-stone-500 font-sans">single-visit demo</span>
                  </div>
                </div>
                <div className="bg-emerald-50 text-emerald-950 p-2.5 rounded-lg border border-emerald-100 flex items-start gap-2 max-w-xs shrink-1">
                  <Gift className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
                  <div className="text-[11px] leading-tight font-medium" id="trial-waiver-incentive">
                    <strong className="text-emerald-900">Caregiver Match Guaranteed</strong>. We prioritize matching you with a specialist that best aligns with your timings and baby's growth needs!
                  </div>
                </div>
              </div>

              {/* Form Input elements */}
              <div className="space-y-4" id="trial-inputs-section">
                <div>
                  <label htmlFor="trial-name" className="block text-xs font-semibold text-stone-600 mb-1">Parent’s Full Name *</label>
                  <input
                    type="text"
                    id="trial-name"
                    required
                    placeholder="Enter parent’s full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2 border border-stone-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-transparent transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="trial-phone" className="block text-xs font-semibold text-stone-600 mb-1">WhatsApp Mobile *</label>
                    <input
                      type="tel"
                      id="trial-phone"
                      required
                      placeholder="e.g. +91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2 border border-stone-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-transparent transition-all"
                    />
                  </div>

                  <div>
                    <label htmlFor="trial-email" className="block text-xs font-semibold text-stone-600 mb-1">Email <span className="text-stone-400 font-normal">(Optional)</span></label>
                    <input
                      type="email"
                      id="trial-email"
                      placeholder="yours@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2 border border-stone-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="trial-location" className="block text-xs font-semibold text-stone-600 mb-1">Physical Area/Sector in Navi Mumbai &amp; Mumbai *</label>
                  <select
                    id="trial-location"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3.5 py-2 border border-stone-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-transparent transition-all text-stone-700 cursor-pointer"
                  >
                    <option value="">Select Location</option>
                    {NAVI_MUMBAI_AREAS.map((area) => (
                      <option key={area} value={area}>{area}</option>
                    ))}
                    <option value="Other Navi Mumbai">Other Navi Mumbai &amp; Mumbai Sector</option>
                  </select>
                </div>

                {(location === 'Mumbai' || location === 'Other Navi Mumbai') && (
                  <div>
                    <label htmlFor="trial-specificArea" className="block text-xs font-semibold text-stone-600 mb-1">
                      {location === 'Mumbai' ? 'Write your area name *' : 'Mention your area name, such as Mansarovar, Khandeshwar, etc. *'}
                    </label>
                    <input
                      type="text"
                      id="trial-specificArea"
                      required
                      value={specificArea}
                      onChange={(e) => setSpecificArea(e.target.value)}
                      placeholder={location === 'Mumbai' ? 'e.g. Dadar, Bandra, Andheri, etc.' : 'e.g. Mansarovar, Khandeshwar...'}
                      className="w-full px-3.5 py-2 border border-stone-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-transparent transition-all"
                    />
                  </div>
                )}

                <div>
                  <label htmlFor="trial-address" className="block text-xs font-semibold text-stone-600 mb-1">Full Serviceable Address *</label>
                  <textarea
                    id="trial-address"
                    rows={2}
                    required
                    placeholder="Enter complete building name, wing, flat number, street..."
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3.5 py-2 border border-stone-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="trial-notes" className="block text-xs font-semibold text-stone-600 mb-1">Preferred Time & Baby\'s Age / Expected Due Date <span className="text-stone-400 font-normal">(Optional)</span></label>
                  <textarea
                    id="trial-notes"
                    rows={2}
                    placeholder="e.g. Baby is 1 month old, afternoon preference, normal birth recovery support..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3.5 py-2 border border-stone-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {errorStatus && (
                <div className="text-xs text-rose-700 bg-rose-50 p-3 rounded-lg border border-rose-200" id="trial-error-div">
                  {errorStatus}
                </div>
              )}

              {/* Secure guarantee text */}
              <div className="flex items-center gap-1.5 text-stone-500 bg-stone-100 p-2.5 rounded-lg border border-stone-200">
                <Shield className="w-3.5 h-3.5 text-emerald-800 shrink-0" />
                <span className="text-[10px] font-medium leading-none">Strict physical hygiene protocol followed: caregiver sanitizes and wears clean protective gear.</span>
              </div>

              {/* CTAs */}
              <div className="flex gap-3 pt-2" id="trial-ctas">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold py-3.5 px-4 rounded-xl text-[11px] uppercase tracking-widest transition-all focus:outline-none disabled:opacity-75 cursor-pointer text-center"
                  id="trial-submit-btn"
                >
                  {isSubmitting ? 'Requesting Home Slot...' : 'Book At-Home Trial'}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-3.5 border border-stone-300 text-stone-600 rounded-xl text-[11px] uppercase tracking-widest hover:bg-stone-100 transition-all font-semibold cursor-pointer"
                  id="trial-cancel-btn"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="py-8 text-center space-y-6" id="trial-success-screen">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto" id="trial-success-icon">
                <Check className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h4 className="font-display text-base font-bold text-stone-900 tracking-tight">Home Trial Service Requested!</h4>
                <p className="text-xs text-stone-600 max-w-sm mx-auto">
                  We have registered your at-home baby massage & safety bath trial in <strong className="text-stone-800">{location}</strong> for <span className="text-stone-800 font-medium">{name}</span>.
                </p>
                <div className="bg-emerald-50 text-emerald-950 p-3 rounded-xl border border-emerald-100 max-w-sm mx-auto text-xs space-y-1">
                  <div className="font-bold">Total Trial Fee: ₹1,299</div>
                  <div className="text-[11px] text-stone-600 font-normal">Our caregiver coordinator calls within 2 hours to confirm your ideal time slot in Navi Mumbai &amp; Mumbai.</div>
                </div>
              </div>

              <div className="pt-4 max-w-sm mx-auto space-y-3" id="trial-success-cta-block">
                <button
                  onClick={handleWhatsAppRedirect}
                  className="w-full bg-[#128C7E] hover:bg-[#075E54] text-white py-3.5 px-4 rounded-xl text-[11px] uppercase tracking-widest font-semibold transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                  id="trial-whatsapp-redirect"
                >
                  Confirm Speedily on WhatsApp
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-stone-500 hover:text-stone-800 text-xs py-1.5 transition-colors font-medium underline block w-full"
                  id="trial-success-close"
                >
                  Return to Main Site
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
