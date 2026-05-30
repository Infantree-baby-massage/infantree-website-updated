/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, CheckCircle, ShieldCheck, Calendar, ArrowRight, PhoneCall } from 'lucide-react';
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
        name: name.substring(0, 200),
        phone: phone.substring(0, 30),
        email: email ? email.substring(0, 254) : '',
        location: combinedLocation.substring(0, 500),
        selectedPlan: currentPlanObj.name.substring(0, 200),
        notes: finalNotes.substring(0, 2000),
        source: 'Website Subscription Reservation',
        timestamp: new Date().toISOString()
      };

      await addDoc(collection(db, 'bookings'), payload);
fetch('https://script.google.com/macros/s/AKfycbyPG6MtFFVed-4HmT2bQaoSp2_8cYCjZUOSuh-9z2xJpNVZ897hCLpF0l2dB4PAWW5loQ/exec', {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).catch((e) => console.error("Sheet update failed:", e));
      // Async Email Notification
      fetch('https://formsubmit.co/ajax/Mohdaslamshah987@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          _subject: `New Infantree Booking: ${payload.name}`,
          Name: payload.name,
          Phone: payload.phone,
          Email: payload.email,
          Location: payload.location,
          Plan: payload.selectedPlan,
          Notes: payload.notes
        })
      }).catch(() => {});

      setShowSuccess(true);
      onSuccess();
    } catch (err: any) {
      if (err.message && err.message.includes('permissions')) {
        setErrorStatus('Please ensure phone is minimum 10 digits and required fields are valid.');
      } else {
        setErrorStatus('Network exception. Please check your internet connection or try again directly.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsAppRedirect = () => {
    const text = `Hello Infantree Team, I have just secured a slot on your website under the name: ${name} (${phone}) for the ${currentPlanObj.name}. Can we please configure my schedule?`;
    window.open(`https://wa.me/917304367566?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/80 backdrop-blur-sm animate-fade-in" id="booking-modal-overlay">
      <div 
        className="relative w-full max-w-2xl bg-stone-50 border border-stone-200 shadow-2xl rounded-2xl overflow-hidden max-h-[90vh] flex flex-col animate-scale-up" 
        id="booking-modal"
      >
        {/* Header decoration */}
        <div className="bg-emerald-800 px-6 py-4 text-white flex items-center justify-between" id="booking-modal-header">
          <div>
            <h3 className="font-display text-base font-semibold tracking-tight">Configure Care Subscription</h3>
            <p className="text-xs text-emerald-100 font-sans tracking-wide">Private & hygienic home visits in Navi Mumbai &amp; Mumbai</p>
          </div>
          <button 
            onClick={onClose} 
            className="text-white hover:bg-emerald-700/60 p-1.5 rounded-full transition-colors cursor-pointer" 
            aria-label="Close"
            id="close-booking-modal-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="overflow-y-auto p-6 sm:p-8 flex-1" id="booking-modal-body">
          {!showSuccess ? (
            <form onSubmit={handleSubmit} className="space-y-6" id="booking-form">
              {/* Plan Quick-Selector */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-2">Selected Care Program</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2" id="plan-quick-selectors">
                  {BASIC_PLANS.map((plan) => (
                    <button
                      key={plan.id}
                      type="button"
                      onClick={() => setSelectedPlanId(plan.id)}
                      className={`p-3 text-left border rounded-xl flex flex-col justify-between transition-all cursor-pointer ${
                        selectedPlanId === plan.id
                          ? 'border-emerald-700 bg-emerald-50/70 text-emerald-950 shadow-sm ring-1 ring-emerald-700'
                          : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-700'
                      }`}
                      id={`selector-${plan.id}`}
                    >
                      <span className="text-xs font-semibold leading-tight line-clamp-1">{plan.name.replace('Monthly Plan', '')}</span>
                      <span className="font-display text-xs font-semibold mt-1 hover:text-stone-900">₹{plan.price.toLocaleString('en-IN')}<span className="text-[10px] font-sans text-stone-500">/m</span></span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Service Features checklist preview */}
              <div className="bg-stone-100 p-4 rounded-xl border border-stone-200/80" id="plan-features-preview">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">Included in Program</span>
                <ul className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 text-xs text-stone-600">
                  {currentPlanObj.features.slice(0, 4).map((f, idx) => (
                    <li key={idx} className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0"></span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Input Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" id="form-inputs-group">
                <div>
                  <label htmlFor="name" className="block text-xs font-semibold text-stone-600 mb-1">Mother’s / Parent’s Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    required
                    placeholder="Enter full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2 border border-stone-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-xs font-semibold text-stone-600 mb-1">WhatsApp / Contact Number *</label>
                  <input
                    type="tel"
                    id="phone"
                    required
                    placeholder="e.g. +91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2 border border-stone-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-xs font-semibold text-stone-600 mb-1">Email Address <span className="text-stone-400 font-normal">(Optional)</span></label>
                  <input
                    type="email"
                    id="email"
                    placeholder="name@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2 border border-stone-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="location" className="block text-xs font-semibold text-stone-600 mb-1">Navi Mumbai &amp; Mumbai Service Area *</label>
                  <select
                    id="location"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-stone-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-transparent transition-all text-stone-700"
                  >
                    <option value="">Select your Sector / Location</option>
                    {NAVI_MUMBAI_AREAS.map((area) => (
                      <option key={area} value={area}>{area}</option>
                    ))}
                    <option value="Other Navi Mumbai">Other Navi Mumbai &amp; Mumbai Area</option>
                  </select>
                </div>
              </div>

              {(location === 'Mumbai' || location === 'Other Navi Mumbai') && (
                <div>
                  <label htmlFor="specificArea" className="block text-xs font-semibold text-stone-600 mb-1 mt-4">
                    {location === 'Mumbai' ? 'Write your area name *' : 'Mention your area name, such as Mansarovar, Khandeshwar, etc. *'}
                  </label>
                  <input
                    type="text"
                    id="specificArea"
                    required
                    value={specificArea}
                    onChange={(e) => setSpecificArea(e.target.value)}
                    placeholder={location === 'Mumbai' ? 'e.g. Dadar, Bandra, Andheri, etc.' : 'e.g. Mansarovar, Khandeshwar...'}
                    className="w-full px-3.5 py-2 border border-stone-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-transparent transition-all"
                  />
                </div>
              )}

              <div>
                <label htmlFor="address" className="block text-xs font-semibold text-stone-600 mb-1 mt-1">Full Serviceable Address *</label>
                <textarea
                  id="address"
                  rows={2}
                  required
                  placeholder="Enter complete building name, wing, flat number, street..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3.5 py-2 border border-stone-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-transparent transition-all mb-4"
                />
              </div>

              <div>
                <label htmlFor="notes" className="block text-xs font-semibold text-stone-600 mb-1">Specific Requests or Health Concerns <span className="text-stone-400 font-normal">(Optional)</span></label>
                <textarea
                  id="notes"
                  rows={2}
                  placeholder="e.g. support after delivery, baby is 20 days old, preferred timing..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2 border border-stone-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-transparent transition-all"
                />
              </div>

              {errorStatus && (
                <div className="text-xs text-rose-700 bg-rose-50 p-3 rounded-lg border border-rose-200" id="error-banner">
                  {errorStatus}
                </div>
              )}

              {/* Urgency & CTAs */}
              <div className="pt-2 border-t border-stone-200" id="modal-submit-sec">
                <div className="flex items-center gap-1.5 text-amber-800 bg-amber-50/60 p-2.5 rounded-lg border border-amber-100 mb-4">
                  <ShieldCheck className="w-4 h-4 shrink-0 text-amber-700" />
                  <span className="text-[11px] leading-tight font-medium">Limited Slot Guarantee: Placing this request preserves your prioritized allocation status for 24 hours.</span>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold py-3.5 px-4 rounded-xl text-[11px] uppercase tracking-widest transition-all focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:ring-offset-2 disabled:opacity-75 flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                    id="submit-booking-reservation"
                  >
                    {isSubmitting ? 'Securing Premium Slot...' : 'Secure My Care Slot'}
                    <ArrowRight className="w-3.5 h-3.5 animate-pulse" />
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-5 py-3.5 border border-stone-300 text-stone-600 rounded-xl text-[11px] uppercase tracking-widest hover:bg-stone-100 transition-all font-semibold cursor-pointer text-center"
                    id="cancel-booking-btn"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <div className="py-10 text-center space-y-6 animate-fade-in" id="success-screen">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto" id="success-icon-container">
                <CheckCircle className="w-10 h-10" />
              </div>
              <div className="space-y-2">
                <h4 className="font-display text-lg font-semibold text-stone-850 tracking-tight">Your Care Program is Tentatively Secured!</h4>
                <p className="text-sm text-stone-600 max-w-md mx-auto">
                  Thank you, <strong className="text-stone-800">{name}</strong>. We have captured your subscription request for the <strong className="text-emerald-800 font-medium">{currentPlanObj.name}</strong> in {location}.
                </p>
                <p className="text-xs text-stone-500 max-w-sm mx-auto bg-stone-100 p-2.5 rounded-lg border border-stone-200">
                  Our service coordinator will phone you shortly at <span className="font-sans text-stone-800 font-semibold">{phone}</span> to schedule caregivers hygiene checks.
                </p>
              </div>

              <div className="pt-4 max-w-sm mx-auto space-y-3" id="success-redirection-actions">
                <button
                  onClick={handleWhatsAppRedirect}
                  className="w-full bg-[#128C7E] hover:bg-[#075E54] text-white py-3.5 px-4 rounded-xl text-[11px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 font-semibold shadow-sm cursor-pointer"
                  id="success-whatsapp-button"
                >
                  Confirm Speedily via WhatsApp
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-stone-500 hover:text-stone-800 text-xs py-2 block w-full text-center transition-colors font-medium underline"
                  id="success-close-button"
                >
                  Return to Home
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
