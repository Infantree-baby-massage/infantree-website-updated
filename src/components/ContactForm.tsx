/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Mail, Phone, MessageSquare, MapPin, Send, CheckCircle2 } from 'lucide-react';
import { NAVI_MUMBAI_AREAS } from '../data';
import { db } from '../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

export default function ContactForm() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState('');
  const [specificArea, setSpecificArea] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorText, setErrorText] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !location) {
      setErrorText('Name, phone number, and location are required.');
      return;
    }
    setErrorText('');
    setIsSubmitting(true);

    try {
      const combinedLocation = specificArea ? `${location} - ${specificArea}` : location;

      const payload = {
        name: name.substring(0, 200),
        phone: phone.substring(0, 30),
        email: email ? email.substring(0, 254) : '',
        location: combinedLocation.substring(0, 500),
        serviceInterest: 'General Inquiry / Custom Program',
        message: message ? message.substring(0, 2000) : '',
        source: 'Contact Form Bottom Section',
        timestamp: new Date().toISOString()
      };

      await addDoc(collection(db, 'leads'), payload);

      // Async Email Notification
      fetch('https://formsubmit.co/ajax/Mohdaslamshah987@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          _subject: `New Infantree Inquiry: ${payload.name}`,
          Name: payload.name,
          Phone: payload.phone,
          Email: payload.email,
          Location: payload.location,
          Message: payload.message
        })
      }).catch(() => {});

      setIsSuccess(true);
      setName('');
      setPhone('');
      setEmail('');
      setLocation('');
      setSpecificArea('');
      setMessage('');
    } catch (err: any) {
      if (err.message && err.message.includes('permissions')) {
        setErrorText('Please ensure phone is minimum 10 digits and required fields are valid.');
      } else {
        setErrorText('Connection error. Please try again or click the WhatsApp buttons directly.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white border border-stone-200/80 rounded-2xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-12 max-w-4xl mx-auto" id="contact-form-block">
      {/* Detail Block */}
      <div className="bg-emerald-950 text-white p-8 md:col-span-5 flex flex-col justify-between" id="contact-details-side">
        <div className="space-y-6">
          <div>
            <h4 className="font-display text-xl font-bold tracking-tight text-white">Infantree Core</h4>
            <p className="text-emerald-250 text-xs mt-1 font-sans">
              Connect with our baby care advisors and configure your home visit timings today.
            </p>
          </div>

          <div className="space-y-4 text-xs font-sans text-emerald-100" id="contact-quick-info">
            <a href="https://wa.me/917304367566" target="_blank" rel="noreferrer" className="flex items-center gap-3 hover:text-white transition-colors">
              <span className="w-8 h-8 rounded-full bg-emerald-900 flex items-center justify-center text-teal-300">
                <MessageSquare className="w-4 h-4" />
              </span>
              <div>
                <p className="text-[10px] uppercase text-emerald-300 font-bold leading-none tracking-wider">WhatsApp Consultation</p>
                <p className="text-sm font-semibold mt-0.5 font-sans">+91 7304367566</p>
              </div>
            </a>

            <a href="tel:+917304367566" className="flex items-center gap-3 hover:text-white transition-colors">
              <span className="w-8 h-8 rounded-full bg-emerald-900 flex items-center justify-center text-teal-300">
                <Phone className="w-4 h-4" />
              </span>
              <div>
                <p className="text-[10px] uppercase text-emerald-300 font-bold leading-none tracking-wider">Direct Voice Assistance</p>
                <p className="text-sm font-semibold mt-0.5 font-sans">+91 7304367566</p>
              </div>
            </a>

            <div className="flex items-start gap-3">
              <span className="w-8 h-8 rounded-full bg-emerald-900 flex items-center justify-center text-teal-300 mt-0.5">
                <MapPin className="w-4 h-4" />
              </span>
              <div>
                <p className="text-[10px] uppercase text-emerald-300 font-bold leading-none tracking-wider">Service Coverage</p>
                <p className="text-sm mt-0.5 leading-tight font-medium">Navi Mumbai &amp; Mumbai District (15+ sectors covered daily)</p>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-emerald-900 text-[9px] text-emerald-200/60 font-sans tracking-widest uppercase font-semibold">
          Daily Slots: 9:00 AM — 6:00 PM • Safe Touch Protocol
        </div>
      </div>

      {/* Input Fields block */}
      <div className="p-8 md:col-span-7 bg-stone-50" id="contact-fields-side">
        {isSuccess ? (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-8 animate-fade-in" id="contact-feedback-success">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center border border-emerald-200">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h5 className="font-display text-base font-semibold text-stone-900 tracking-tight">Inquiry Captured Successfully</h5>
              <p className="text-xs text-stone-600 max-w-sm mt-1 mx-auto leading-relaxed">
                Thank you for reaching out to Infantree. Our advisor is reviewing your location and will call or text you shortly on VIP status.
              </p>
            </div>
            <button
              onClick={() => setIsSuccess(false)}
              className="text-emerald-800 hover:text-emerald-900 text-xs font-semibold underline transition-all bg-transparent border-0 cursor-pointer"
            >
              Send another message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4" id="contact-form-element">
            <div>
              <h5 className="font-display text-sm font-semibold text-stone-900 tracking-tight mb-1">Inquire for Customized Calendar</h5>
              <p className="text-stone-500 text-xs leading-none">We will coordinate expert caregivers near your sector.</p>
            </div>

            <div className="space-y-3" id="contact-fields-grp">
              <div>
                <label htmlFor="contact-name" className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1">Parent Name *</label>
                <input
                  type="text"
                  id="contact-name"
                  required
                  placeholder="e.g. Priya Nair"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:ring-emerald-700"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="contact-phone" className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1">WhatsApp Mobile *</label>
                  <input
                    type="tel"
                    id="contact-phone"
                    required
                    placeholder="+91 98XXX XXX55"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:ring-emerald-700 font-sans text-stone-850"
                  />
                </div>

                <div>
                  <label htmlFor="contact-email" className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1">Email <span className="font-normal text-stone-400 font-sans">(Optional)</span></label>
                  <input
                    type="email"
                    id="contact-email"
                    placeholder="name@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:ring-emerald-700"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="contact-location" className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1">Your Navi Mumbai or Mumbai Location *</label>
                <select
                  id="contact-location"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2.5 border border-stone-300 rounded-lg text-sm bg-white text-stone-700 cursor-pointer focus:outline-none focus:ring-1 focus:ring-emerald-700"
                >
                  <option value="">Select Area / Sector</option>
                  {NAVI_MUMBAI_AREAS.map((area) => (
                    <option key={area} value={area}>{area}</option>
                  ))}
                  <option value="Other Navi Mumbai">Other Sector</option>
                </select>
              </div>

              {(location === 'Mumbai' || location === 'Other Navi Mumbai') && (
                <div>
                  <label htmlFor="contact-specificArea" className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1 mt-4">
                    {location === 'Mumbai' ? 'Write your area name *' : 'Mention your area name, such as Mansarovar, Khandeshwar, etc. *'}
                  </label>
                  <input
                    type="text"
                    id="contact-specificArea"
                    required
                    value={specificArea}
                    onChange={(e) => setSpecificArea(e.target.value)}
                    placeholder={location === 'Mumbai' ? 'e.g. Dadar, Bandra, Andheri, etc.' : 'e.g. Mansarovar, Khandeshwar...'}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:ring-emerald-700"
                  />
                </div>
              )}

              <div>
                <label htmlFor="contact-message" className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1">Notes regarding baby\'s age / due date <span className="font-normal text-stone-400 font-sans">(Optional)</span></label>
                <textarea
                  id="contact-message"
                  rows={2}
                  placeholder="e.g. Baby born on 12th May, need daily session in morning hours..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:ring-emerald-700"
                />
              </div>
            </div>

            {errorText && (
              <div className="text-xs text-rose-700 bg-rose-50 p-2.5 rounded border border-rose-200">
                {errorText}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-emerald-950 hover:bg-emerald-900 text-white font-semibold text-[10px] font-sans py-3.5 rounded-xl uppercase tracking-widest transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:opacity-75"
              id="contact-submit-btn"
            >
              <Send className="w-3.5 h-3.5" />
              {isSubmitting ? 'Submitting Inquiry...' : 'Submit Contact Inquiry'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
