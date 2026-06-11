/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Shield, Check, MessageSquare, MessageCircle, Phone, ChevronDown, ChevronUp, Star, MapPin, 
  Sparkles, Gift, Heart, Calendar, Users, Eye, HelpCircle, Activity,
  ChevronLeft, ChevronRight, Quote, Menu, X, ArrowRight, Info
} from 'lucide-react';

// Data & Config
import { BASIC_PLANS, LONG_TERM_PLANS, FAQ_DATA, REVIEWS, NAVI_MUMBAI_AREAS } from './data';

// Components
import BookServiceModal from './components/BookServiceModal';
import TrialBookingModal from './components/TrialBookingModal';
import ContactForm from './components/ContactForm';
import AdminPanel from './components/AdminPanel';
import IramChat from './components/IramChat';

// Generated Premium Images
import infantMassageImg from './assets/images/infant_massage_luxury_1779711045730.png';
import motherWellnessImg from './assets/images/mother_baby_wellness_1779711067828.png';
import aboutMotherCareImg from './assets/images/mother_sari_holding_baby_1779814017449.png';

export default function App() {
  // Navigation: virtual router state
  const [currentTab, setCurrentTab] = useState<'home' | 'programs' | 'longterm' | 'trial' | 'areas' | 'faq' | 'reviews' | 'contact' | 'about'>('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Modal configurations
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [isTrialModalOpen, setIsTrialModalOpen] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<string>('baby-massage-monthly');

  // FAQ Accordion configuration
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);

  // Longterm package tab configuration
  const [selectedLongtermTab, setSelectedLongtermTab] = useState<'baby' | 'mother'>('baby');

  // Reviews slider active index configuration
  const [activeReviewIdx, setActiveReviewIdx] = useState(0);

  const handleNextReview = () => {
    setActiveReviewIdx((prev) => (prev + 1) % REVIEWS.length);
  };

  const handlePrevReview = () => {
    setActiveReviewIdx((prev) => (prev - 1 + REVIEWS.length) % REVIEWS.length);
  };

  // Scroll controls for horizontal reviews carousels
  const reviewsScrollRef = useRef<HTMLDivElement>(null);

  const scrollReviews = (direction: 'left' | 'right') => {
    if (reviewsScrollRef.current) {
      const { scrollLeft, clientWidth } = reviewsScrollRef.current;
      const scrollAmount = clientWidth * 0.85; // Scroll 85% of block width
      reviewsScrollRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const toggleFaq = (idx: number) => {
    setOpenFaqIdx(openFaqIdx === idx ? null : idx);
  };

  const handleBookPlanClick = (planId: string) => {
    setSelectedPlanId(planId);
    setIsBookModalOpen(true);
  };

  const navigateToTab = (tab: 'home' | 'programs' | 'longterm' | 'trial' | 'areas' | 'faq' | 'reviews' | 'contact' | 'about') => {
    setCurrentTab(tab);
    setIsMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const notifySuccess = () => {
    console.log("Database submission registered successfully.");
  };

  // Automatically scroll to top when changing views
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [currentTab]);

  // Find the Care Bundle plan for Featured section
  const careBundle = BASIC_PLANS.find(p => p.recommended || p.id === 'care-bundle-monthly') || BASIC_PLANS[2];

  // Homepage initial preview reviews (Bhagyalaxmi Zende and Khevani Brahmbhatt)
  const previewReviews = REVIEWS.slice(0, 2);

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-700 antialiased selection:bg-emerald-100 selection:text-emerald-950 flex flex-col justify-between">
      
      {/* Dynamic Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/50 shadow-xs" id="main-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo / Brand */}
          <div 
            onClick={() => navigateToTab('home')}
            className="flex items-center cursor-pointer select-none group"
            id="header-brand-logo"
          >
            <div className="flex flex-col">
              <span className="font-serif text-[23px] sm:text-[25px] font-bold text-black tracking-wide leading-none transition-colors group-hover:text-emerald-850">
                Infantree
              </span>
              <span className="text-[8px] sm:text-[9.5px] uppercase tracking-widest text-emerald-800 font-bold block mt-1 font-sans leading-none">
                baby massage & Mother care
              </span>
            </div>
          </div>

          {/* Desktop Navigation Link Toggles */}
          <nav className="hidden lg:flex items-center gap-5 text-xs font-semibold tracking-wider uppercase text-stone-550">
            <button 
              onClick={() => navigateToTab('home')}
              className={`transition-colors py-1.5 px-1 border-b-2 cursor-pointer ${
                currentTab === 'home' 
                  ? 'text-emerald-900 border-emerald-800' 
                  : 'border-transparent hover:text-stone-900 hover:border-stone-300'
              }`}
            >
              Home
            </button>
            <button 
              onClick={() => navigateToTab('about')}
              className={`transition-colors py-1.5 px-1 border-b-2 cursor-pointer ${
                currentTab === 'about' 
                  ? 'text-emerald-900 border-emerald-800' 
                  : 'border-transparent hover:text-stone-900 hover:border-stone-300'
              }`}
            >
              About Us
            </button>
            <button 
              onClick={() => navigateToTab('programs')}
              className={`transition-colors py-1.5 px-1 border-b-2 cursor-pointer ${
                currentTab === 'programs' 
                  ? 'text-emerald-900 border-emerald-800' 
                  : 'border-transparent hover:text-stone-900 hover:border-stone-300'
              }`}
            >
              Monthly Care Programs
            </button>
            <button 
              onClick={() => navigateToTab('longterm')}
              className={`transition-colors py-1.5 px-1 border-b-2 cursor-pointer ${
                currentTab === 'longterm' 
                  ? 'text-emerald-950 border-emerald-800' 
                  : 'border-transparent hover:text-stone-900 hover:border-stone-300'
              }`}
            >
              Extended Care Programs
            </button>
            <button 
              onClick={() => navigateToTab('trial')}
              className={`transition-colors py-1.5 px-1 border-b-2 cursor-pointer ${
                currentTab === 'trial' 
                  ? 'text-emerald-900 border-emerald-800' 
                  : 'border-transparent hover:text-stone-900 hover:border-stone-300'
              }`}
            >
              Start with a Trial
            </button>
            <button 
              onClick={() => navigateToTab('areas')}
              className={`transition-colors py-1.5 px-1 border-b-2 cursor-pointer ${
                currentTab === 'areas' 
                  ? 'text-emerald-900 border-emerald-800' 
                  : 'border-transparent hover:text-stone-900 hover:border-stone-300'
              }`}
            >
              Areas We Serve
            </button>
            <button 
              onClick={() => navigateToTab('reviews')}
              className={`transition-colors py-1.5 px-1 border-b-2 cursor-pointer ${
                currentTab === 'reviews' 
                  ? 'text-emerald-900 border-emerald-800' 
                  : 'border-transparent hover:text-stone-900 hover:border-stone-300'
              }`}
            >
              Real Family Stories
            </button>
            <button 
              onClick={() => navigateToTab('faq')}
              className={`transition-colors py-1.5 px-1 border-b-2 cursor-pointer ${
                currentTab === 'faq' 
                  ? 'text-emerald-900 border-emerald-800' 
                  : 'border-transparent hover:text-stone-900 hover:border-stone-300'
              }`}
            >
              Frequently Asked Questions
            </button>
            <button 
              onClick={() => navigateToTab('contact')}
              className={`transition-colors py-1.5 px-1 border-b-2 cursor-pointer ${
                currentTab === 'contact' 
                  ? 'text-emerald-900 border-emerald-800' 
                  : 'border-transparent hover:text-stone-900 hover:border-stone-300'
              }`}
            >
              Contact Us
            </button>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsTrialModalOpen(true)}
              className="bg-emerald-800 hover:bg-emerald-900 text-white font-medium text-xs font-sans py-2 px-3 sm:px-4 rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
              id="header-cta-trial"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Book Trial</span>
              <span className="sm:hidden">Trial</span>
            </button>

            {/* Elegant Hamburger Menu Toggle */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-stone-700 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
              id="hamburger-menu-btn"
              aria-label="Navigation Menu"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </header>

      {/* Slide-over Premium Side Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden" id="nav-drawer-overlay">
          <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-xs transition-opacity" onClick={() => setIsMenuOpen(false)} />
          
          <div className="absolute inset-y-0 right-0 max-w-full flex">
            <div className="w-screen max-w-xs bg-white shadow-2xl flex flex-col justify-between p-6 divide-y divide-stone-100">
              
              <div className="space-y-6">
                {/* Drawer Header */}
                <div className="flex items-center justify-between pb-4">
                  <div className="flex flex-col">
                    <span className="font-serif text-[21px] font-bold text-black tracking-wide leading-none">
                      Infantree
                    </span>
                    <span className="text-[7.5px] uppercase tracking-widest text-emerald-800 font-bold block mt-1 font-sans">
                      baby massage & Mother care
                    </span>
                  </div>
                  <button 
                    onClick={() => setIsMenuOpen(false)}
                    className="p-1 rounded-md text-stone-400 hover:text-stone-600 hover:bg-stone-50 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Nav Links List */}
                <nav className="space-y-1.5 flex flex-col pt-2 font-sans text-sm font-semibold tracking-wide text-stone-800">
                  <button
                    onClick={() => navigateToTab('home')}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${
                      currentTab === 'home' 
                        ? 'bg-emerald-50/70 text-emerald-900' 
                        : 'hover:bg-stone-50 text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    <Heart className="w-4 h-4 text-emerald-800" />
                    <span>Home</span>
                  </button>

                  <button
                    onClick={() => navigateToTab('about')}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${
                      currentTab === 'about' 
                        ? 'bg-emerald-50/70 text-emerald-900' 
                        : 'hover:bg-stone-50 text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    <Info className="w-4 h-4 text-emerald-800" />
                    <span>About Us</span>
                  </button>

                  <button
                    onClick={() => navigateToTab('programs')}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${
                      currentTab === 'programs' 
                        ? 'bg-emerald-50/70 text-emerald-900' 
                        : 'hover:bg-stone-50 text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    <Activity className="w-4 h-4 text-emerald-800" />
                    <span>Monthly Care Programs</span>
                  </button>

                  <button
                    onClick={() => navigateToTab('longterm')}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${
                      currentTab === 'longterm' 
                        ? 'bg-emerald-50/70 text-emerald-900' 
                        : 'hover:bg-stone-50 text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    <Gift className="w-4 h-4 text-emerald-800" />
                    <span>Extended Care Programs</span>
                  </button>

                  <button
                    onClick={() => navigateToTab('trial')}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${
                      currentTab === 'trial' 
                        ? 'bg-emerald-50/70 text-emerald-900' 
                        : 'hover:bg-stone-50 text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    <Calendar className="w-4 h-4 text-emerald-800" />
                    <span>Start with a Trial</span>
                  </button>

                  <button
                    onClick={() => navigateToTab('areas')}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${
                      currentTab === 'areas' 
                        ? 'bg-emerald-50/70 text-emerald-900' 
                        : 'hover:bg-stone-50 text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    <MapPin className="w-4 h-4 text-emerald-800" />
                    <span>Areas We Serve</span>
                  </button>

                  <button
                    onClick={() => navigateToTab('reviews')}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${
                      currentTab === 'reviews' 
                        ? 'bg-emerald-50/70 text-emerald-900' 
                        : 'hover:bg-stone-50 text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    <Star className="w-4 h-4 text-emerald-800" />
                    <span>Real Family Stories</span>
                  </button>

                  <button
                    onClick={() => navigateToTab('faq')}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${
                      currentTab === 'faq' 
                        ? 'bg-emerald-50/70 text-emerald-900' 
                        : 'hover:bg-stone-50 text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    <HelpCircle className="w-4 h-4 text-emerald-800" />
                    <span>Frequently Asked Questions</span>
                  </button>

                  <button
                    onClick={() => navigateToTab('contact')}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${
                      currentTab === 'contact' 
                        ? 'bg-emerald-50/70 text-emerald-900' 
                        : 'hover:bg-stone-50 text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    <Phone className="w-4 h-4 text-emerald-800" />
                    <span>Contact Us</span>
                  </button>
                </nav>
              </div>

              {/* Drawer Footer and Admin gateway */}
              <div className="pt-4 space-y-4">
                <div className="flex gap-2.5">
                  <a
                    href="https://wa.me/917304367566"
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 bg-[#25D366] hover:bg-[#128C7E] text-white py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5"
                  >
                    <MessageSquare className="w-3.5 h-3.5 fill-white" />
                    <span>WhatsApp</span>
                  </a>
                  <a
                    href="tel:+917304367566"
                    className="flex-1 border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700 py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Desk</span>
                  </a>
                </div>

                <div className="flex items-center justify-between border-t border-stone-100 pt-3">
                  <span className="text-[10px] text-stone-400 font-sans tracking-tight">Staff Access</span>
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      setIsAdminPanelOpen(true);
                    }}
                    className="text-stone-400 hover:text-stone-600 font-mono text-[10px] uppercase tracking-wider flex items-center gap-1"
                  >
                    <Shield className="w-3 h-3 text-emerald-800" />
                    <span>Admin</span>
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Primary Section Render Block */}
      <main className="grow">
        {currentTab === 'home' && (
          <div className="animate-fade-in" id="homepage-content">
            
            {/* 1. HERO SECTION */}
            <section className="relative overflow-hidden py-12 md:py-20 bg-gradient-to-b from-stone-100 via-stone-50 to-stone-50" id="hero-section">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                
                {/* Content Block */}
                <div className="lg:col-span-7 space-y-6 md:space-y-7 text-left order-2 lg:order-1">
                  
                  {/* Urgent Tag & Highlights */}
                  <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-950 px-3.5 py-1.5 rounded-full border border-emerald-100/60 shadow-xs">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-800 animate-pulse shrink-0" />
                    <span className="text-[10px] font-semibold uppercase font-sans tracking-widest text-emerald-900">Limited Daily Slots remaining in Navi Mumbai &amp; Mumbai</span>
                  </div>

                  {/* Emotional display headings */}
                  <h1 className="font-display text-2xl sm:text-3xl font-semibold text-stone-900 leading-[1.2] tracking-tight">
                    Gentle, Reassuring <span className="text-emerald-950 font-bold">Mother &amp; Baby</span> Care.
                  </h1>

                  <p className="text-stone-600 text-xs sm:text-sm leading-relaxed max-w-xl">
                    Restore peace, relaxation, and healthy growth cycles. We deliver specialized newborn baby massage, safety baths, and nourishing post-delivery mother therapies right at your home, hosted strictly by certified, expert female massage professionals.
                  </p>

                  {/* Crucial Urgency Line */}
                  <p className="text-amber-805 text-xs font-sans font-medium flex items-center gap-1.5 bg-amber-50/70 p-2.5 border border-amber-100/60 rounded-xl leading-relaxed max-w-lg">
                    To maintain the highest standard of care, we welcome only 12 families each month. Reserving early ensures your preferred dates and the same dedicated caregiver throughout your family's journey.
                  </p>

                  {/* CTAs */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-1 max-w-md">
                    <button
                      onClick={() => setIsBookModalOpen(true)}
                      className="flex-1 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold py-3 px-5 rounded-xl hover:shadow-md transition-all text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                      id="hero-book-visit-btn"
                    >
                      <span>Book Home Visit</span>
                      <Heart className="w-4 h-4 text-emerald-200 fill-emerald-200" />
                    </button>
                    
                    <button
                      onClick={() => setIsTrialModalOpen(true)}
                      className="flex-1 border border-emerald-800/20 bg-emerald-50/40 hover:bg-emerald-50 text-emerald-950 font-semibold py-3 px-5 rounded-xl transition-all text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Calendar className="w-4 h-4 text-emerald-800" />
                      <span>Book Trial Visit</span>
                    </button>
                  </div>

                  {/* WhatsApp button */}
                  <div className="pt-1">
                    <a
                      href="https://wa.me/917304367566?text=Hi%20Infantree,%20I'd%20love%20to%2520book%20a%20consultation%20for%20post-delivery%20home%2520massages."
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 bg-white border border-stone-200 hover:bg-stone-50 text-stone-700 font-semibold py-2.5 px-5 rounded-xl text-xs transition-colors shadow-xs"
                      id="hero-whatsapp-consult-btn"
                    >
                      <MessageSquare className="w-4 h-4 text-teal-600 fill-teal-600/10" />
                      <span>WhatsApp Professional Consultation</span>
                    </a>
                  </div>

                  {/* Subtle client ratings strip */}
                  <div className="flex items-center gap-4 pt-2" id="hero-mini-trust">
                    <div className="flex text-amber-500 gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                    <span className="text-xs text-stone-550">
                      Rated <strong className="text-stone-800">4.8 / 5</strong> by 320+ new parents in Navi Mumbai &amp; Mumbai.
                    </span>
                  </div>
                </div>

                {/* Visual Block */}
                <div className="lg:col-span-5 order-1 lg:order-2 relative" id="hero-image-block">
                  <div className="aspect-[4/3] sm:aspect-square bg-stone-200 rounded-3xl overflow-hidden border border-stone-200/80 shadow-xl relative" id="hero-img-container">
                    <img
                      src={infantMassageImg}
                      alt="Luxury Infantree at-home newborn massage session"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    {/* Abs Badge overlay */}
                    <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-3 rounded-2xl border border-stone-200/30 hidden sm:flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-950 flex items-center justify-center text-teal-300 shrink-0">
                        <Activity className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="block text-[9px] uppercase tracking-wider font-bold text-stone-500 font-sans leading-none">Safety &amp; Comfort</span>
                        <span className="block text-xs font-semibold text-stone-800 leading-tight mt-0.5">One dedicated caregiver for your family</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </section>

            {/* 2. SMALL TRUST STRIP */}
            <section className="bg-stone-900 text-stone-100 py-6 border-y border-stone-850" id="trust-strip">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center lg:text-left divide-y md:divide-y-0 divide-stone-800/60">
                  <div className="flex items-center gap-3 justify-center lg:justify-start py-1 lg:py-0 lg:pl-4">
                    <div className="w-8 h-8 rounded-full bg-emerald-950 flex items-center justify-center text-emerald-400 shrink-0">
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-100 leading-snug">Expert Female Therapists</h4>
                      <p className="text-[10px] text-stone-400 leading-none mt-0.5">Highly trained & certified</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 justify-center lg:justify-start pt-4 lg:pt-0 lg:pl-6">
                    <div className="w-8 h-8 rounded-full bg-emerald-950 flex items-center justify-center text-emerald-400 shrink-0">
                      <Shield className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-100 leading-snug">Safe for Newborns</h4>
                      <p className="text-[10px] text-stone-400 leading-none mt-0.5">Infant massage professionals</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 justify-center lg:justify-start pt-4 lg:pt-0 lg:pl-6">
                    <div className="w-8 h-8 rounded-full bg-emerald-950 flex items-center justify-center text-emerald-400 shrink-0">
                      <Eye className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-100 leading-snug">Home Visits</h4>
                      <p className="text-[10px] text-stone-400 leading-none mt-0.5">Sanitized outfits & gear</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 justify-center lg:justify-start pt-4 lg:pt-0 lg:pl-6">
                    <div className="w-8 h-8 rounded-full bg-emerald-950 flex items-center justify-center text-emerald-400 shrink-0">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-100 leading-snug">Navi Mumbai &amp; Mumbai Coverage</h4>
                      <p className="text-[10px] text-stone-400 leading-none mt-0.5">Serving 15 local neighborhoods</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* 3. FEATURED PLAN PREVIEW */}
            <section className="py-14 bg-stone-50 border-b border-stone-250/20" id="featured-plan-section">
              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
                <div className="space-y-2">
                  <span className="text-[10px] font-semibold bg-emerald-50 border border-emerald-100/60 text-emerald-800 px-3 py-1 rounded-full uppercase tracking-widest text-center inline-block">Premier Highlight</span>
                  <h2 className="font-display text-2xl font-semibold text-stone-900 tracking-tight">Most Recommended Care Bundle</h2>
                  <p className="text-stone-500 text-xs sm:text-sm max-w-lg mx-auto">
                    A luxurious, synchronized therapeutic sequence for both mother and child. Restores energy, reduces abdominal strain, and comforts newborn milestones.
                  </p>
                </div>

                {/* Single highlighted premium card */}
                <div className="bg-white border-2 border-emerald-800/80 rounded-2xl p-6 sm:p-8 shadow-lg max-w-xl mx-auto text-left relative overflow-hidden">
                  <div className="space-y-5">
                    <div>
                      <h3 className="font-display text-lg font-bold text-stone-900">{careBundle.name}</h3>
                      <p className="text-xs text-stone-500 mt-1 max-w-md">{careBundle.description}</p>
                    </div>

                    <div className="flex items-baseline gap-1 pt-1.5 border-t border-stone-100">
                      <span className="text-xl font-display font-semibold text-stone-800">₹{careBundle.price.toLocaleString('en-IN')}</span>
                      <span className="text-stone-500 text-xs">/month (Consecutive Day Visit Schedule)</span>
                    </div>

                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 text-xs text-stone-650">
                      {careBundle.features.slice(0, 6).map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-800 mt-0.5 shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="pt-4 flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={() => handleBookPlanClick(careBundle.id)}
                        className="flex-1 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold py-3 px-4 rounded-xl text-[10px] uppercase tracking-widest text-center cursor-pointer transition-all shadow-xs"
                      >
                        Secure Care Bundle Complete
                      </button>
                      
                      <button
                        onClick={() => navigateToTab('programs')}
                        className="flex-1 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold py-3 px-4 rounded-xl text-[10px] uppercase tracking-widest text-center cursor-pointer transition-all border border-stone-200/60"
                      >
                        Explore Other Plans <ArrowRight className="w-3.5 h-3.5 inline ml-1.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* 4. REVIEWS PREVIEW */}
            <section className="py-14 bg-stone-100/50" id="reviews-preview-section">
              <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                
                {/* Section Header with Navigation Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-center sm:text-left space-y-2">
                    <span className="text-[10px] font-semibold text-emerald-800 uppercase tracking-widest block font-sans">Real Family Stories</span>
                    <h2 className="font-display text-2xl font-semibold text-stone-900 tracking-tight">Trusted by families across Navi Mumbai &amp; Mumbai</h2>
                  </div>
                  
                  {/* Slider controls */}
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => scrollReviews('left')}
                      className="flex items-center justify-center w-9 h-9 rounded-full bg-white border border-stone-200 hover:border-stone-300 text-stone-600 hover:text-stone-900 shadow-xs transition-colors cursor-pointer"
                      aria-label="Previous testimonials"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => scrollReviews('right')}
                      className="flex items-center justify-center w-9 h-9 rounded-full bg-white border border-stone-200 hover:border-stone-300 text-stone-600 hover:text-stone-900 shadow-xs transition-colors cursor-pointer"
                      aria-label="Next testimonials"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Horizontal Scroll Track containing all 5 reviews */}
                <div 
                  ref={reviewsScrollRef}
                  className="flex gap-6 overflow-x-auto pb-6 pt-2 snap-x snap-mandatory scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden -mx-4 px-4 sm:mx-0 sm:px-0"
                >
                  {REVIEWS.map((rev, idx) => (
                    <div 
                      key={idx} 
                      className="flex-none w-[290px] sm:w-[350px] snap-start bg-white border border-stone-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between relative hover:border-emerald-800/20 hover:shadow-sm transition-all duration-300"
                    >
                      <Quote className="w-12 h-12 text-emerald-800/5 absolute right-4 top-4 pointer-events-none" />
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex text-amber-500 gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="w-3 h-3 fill-current" />
                            ))}
                          </div>
                          <span className="text-stone-400 text-xs font-mono">{rev.date}</span>
                        </div>
                        <p className="text-xs sm:text-xs/relaxed italic text-stone-750 leading-relaxed font-sans">
                          "{rev.comment}"
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                        <div>
                          <h4 className="font-display text-xs font-bold text-stone-900">{rev.name}</h4>
                          <span className="text-[10px] font-medium text-stone-500 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-emerald-800/60 shrink-0" /> {rev.location}
                          </span>
                        </div>
                        <span className="text-[8px] bg-emerald-50 text-emerald-950 border border-emerald-100/60 font-bold uppercase tracking-widest px-2 py-0.5 rounded font-mono">
                          {rev.tag}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="text-center pt-2">
                  <button
                    onClick={() => navigateToTab('reviews')}
                    className="inline-flex items-center gap-2 bg-stone-900 hover:bg-black text-white font-semibold py-3 px-6 rounded-xl text-[10px] uppercase tracking-widest cursor-pointer transition-all shadow-xs"
                  >
                    <span>Read More Family Stories</span>
                    <Star className="w-3.5 h-3.5 fill-amber-300 stroke-amber-300" />
                  </button>
                </div>
              </div>
            </section>

            {/* 5. FINAL CTA */}
            <section className="py-14 bg-emerald-950 text-white relative overflow-hidden" id="final-cta-section">
              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
                <div className="space-y-2">
                  <span className="text-[10px] tracking-widest font-semibold text-teal-300 uppercase block bg-[#128C7E]/40 w-fit mx-auto px-3.5 py-1 rounded-full border border-teal-500/20">Let's Connect</span>
                  <h3 className="font-display text-2xl sm:text-3xl font-semibold leading-tight text-white">Let's coordinate care around your due date.</h3>
                  <p className="text-emerald-200 text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
                    Our dedicated caregivers are available across Navi Mumbai and Mumbai. Reach out to coordinate your personalized home care experience.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2 max-w-md mx-auto">
                  <a
                    href="https://wa.me/917304367566"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full sm:w-auto bg-[#25D366] hover:bg-[#128C7E] text-white py-3.5 px-6 rounded-xl text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 shadow-lg"
                  >
                    <MessageSquare className="w-4 h-4 fill-white" />
                    <span>WhatsApp Us</span>
                  </a>

                  <a
                    href="tel:+917304367566"
                    className="w-full sm:w-auto bg-white hover:bg-stone-100 text-[#075e54] py-3.5 px-6 rounded-xl text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 shadow-lg"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Call Us</span>
                  </a>

                  <button
                    onClick={() => setIsTrialModalOpen(true)}
                    className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-stone-900 py-3.5 px-6 rounded-xl text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-1.5 shadow-lg"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Book Trial</span>
                  </button>
                </div>
              </div>
            </section>

          </div>
        )}

        {/* Tab: PROGRAMS */}
        {currentTab === 'programs' && (
          <div className="animate-fade-in py-12 bg-stone-50" id="programs-tab">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
              
              <div className="text-center max-w-2xl mx-auto space-y-2">
                <span className="text-[10px] font-semibold font-sans text-emerald-800 uppercase tracking-widest block">Daily Home Care</span>
                <h1 className="font-display text-2xl sm:text-3xl font-semibold text-stone-900 tracking-tight">Monthly Home Care Programs</h1>
                <p className="text-stone-500 text-xs sm:text-sm leading-relaxed max-w-lg mx-auto">
                  Enjoy deeply restorative postpartum care in the comfort of your own home. Our transparent pricing allows you to use your preferred massage oils during the sessions.
                </p>
                <div className="pt-2 flex justify-center">
                  <div className="bg-amber-50 border border-amber-200 rounded-lg py-2 px-4 inline-flex items-center gap-2 shadow-xs">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span className="text-[11px] font-semibold text-amber-900 tracking-wide">
                      Book in advance or before your due date for an additional <span className="text-amber-700 font-extrabold text-xs">5-10% discount</span> on all packages!
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-2">
                {BASIC_PLANS.map((plan) => (
                  <div 
                    key={plan.id}
                    className={`flex flex-col justify-between bg-white border rounded-2xl p-6 relative transition-all shadow-md ${
                      plan.recommended ? 'border-emerald-800 ring-1 ring-emerald-850/40' : 'border-stone-200'
                    }`}
                  >
                    {plan.recommended && (
                      <span className="absolute top-0 right-6 -translate-y-1/2 bg-emerald-800 text-white text-[9px] font-semibold uppercase font-sans tracking-widest px-3 py-1 rounded-full shadow-sm">
                        Most Recommended
                      </span>
                    )}

                    <div className="space-y-5">
                      <div>
                        <h3 className="font-display text-lg font-semibold text-stone-900 leading-tight">{plan.name}</h3>
                        <p className="text-xs text-stone-500 mt-1">{plan.description}</p>
                      </div>

                      <div className="flex items-baseline gap-2 flex-wrap" id={`price-display-${plan.id}`}>
  {plan.originalPrice && (
    <span className="text-stone-400 text-sm line-through">
      ₹{plan.originalPrice.toLocaleString('en-IN')}
    </span>
  )}

  <span className="text-xl font-display font-semibold text-stone-800">
    ₹{plan.price.toLocaleString('en-IN')}
  </span>

  <span className="text-stone-500 text-xs font-sans">
    /{plan.durationLabel}
  </span>
</div>

                      {/* Feature checklist */}
                      <ul className="space-y-3 pt-4 border-t border-stone-100 text-xs text-stone-650">
                        {plan.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <Check className="w-3.5 h-3.5 text-emerald-800 shrink-0 mt-0.5" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-6">
                      <button
                        onClick={() => handleBookPlanClick(plan.id)}
                        className={`w-full py-3 px-4 rounded-xl text-[10px] font-semibold uppercase tracking-widest transition-all cursor-pointer text-center ${
                          plan.recommended
                            ? 'bg-emerald-800 hover:bg-emerald-900 text-white shadow'
                            : 'bg-stone-100 hover:bg-stone-200 text-emerald-950 border border-stone-200/50'
                        }`}
                      >
                        Book Program & Reserve Date
                      </button>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        )}

        {/* Tab: LONG TERM PLANS */}
        {currentTab === 'longterm' && (
          <div className="animate-fade-in py-12 bg-stone-50" id="longterm-tab">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
              
              <div className="text-center max-w-2xl mx-auto space-y-3">
                <span className="text-[10px] font-semibold font-sans text-emerald-800 uppercase tracking-widest block">Extended Support</span>
                <h1 className="font-display text-2xl sm:text-3xl font-semibold text-stone-900 tracking-tight">Extended Care Programs</h1>
                <p className="text-stone-550 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
                  Consistent care supports your growing baby and helps mothers gently regain strength. Enjoy preferred rates for extended commitments.
                </p>
                <div className="pt-2 flex justify-center">
                  <div className="bg-amber-50 border border-amber-200 rounded-lg py-2 px-4 inline-flex items-center gap-2 shadow-xs">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span className="text-[11px] font-semibold text-amber-900 tracking-wide">
                      Book in advance or before your due date for an additional <span className="text-amber-700 font-extrabold text-xs">5-10% discount</span> on all packages!
                    </span>
                  </div>
                </div>

                {/* Custom Tab Toggles */}
                <div className="flex bg-stone-200/80 p-1 rounded-xl w-fit mx-auto mt-6" id="longterm-savings-tabs">
                  <button
                    onClick={() => setSelectedLongtermTab('baby')}
                    className={`px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                      selectedLongtermTab === 'baby'
                        ? 'bg-white text-stone-850 shadow-xs'
                        : 'text-stone-550 hover:text-stone-900'
                    }`}
                  >
                    Baby Milestone (3, 6, 12 Months)
                  </button>
                  <button
                    onClick={() => setSelectedLongtermTab('mother')}
                    className={`px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                      selectedLongtermTab === 'mother'
                        ? 'bg-white text-stone-850 shadow-xs'
                        : 'text-stone-550 hover:text-stone-900'
                    }`}
                  >
                    Mother Core Recovery (3 Months)
                  </button>
                </div>
              </div>

              {/* Tab Content Display Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 justify-center">
                {LONG_TERM_PLANS.filter(p => p.targetServiceId === selectedLongtermTab).map((plan) => (
                  <div 
                    key={plan.id}
                    className="bg-white border border-stone-200 rounded-2xl p-6 shadow-md flex flex-col justify-between"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="bg-emerald-55 text-emerald-950 font-semibold uppercase text-[8px] tracking-widest px-2.5 py-1 rounded border border-emerald-100">
                          {plan.months} Month Set
                        </span>
                        <span className="text-xs font-semibold font-sans text-emerald-800 bg-emerald-50/70 px-2.5 py-0.5 rounded">
                          Save {plan.savingPercent}%
                        </span>
                      </div>

                      <div>
                        <h4 className="font-display text-base font-semibold text-stone-900">
                          {plan.months}-Month {selectedLongtermTab === 'baby' ? 'Infant Milestone' : "Mother's Care"} Program
                        </h4>
                        <p className="text-[11px] text-stone-500 font-sans mt-0.5">Consecutive daily home visits sequence</p>
                      </div>

                      <div className="pt-2 border-t border-stone-100">
                        <div className="flex items-baseline gap-1">
                          <span className="text-xl font-display font-semibold text-stone-800">₹{plan.totalPrice.toLocaleString('en-IN')}</span>
                          <span className="text-stone-400 text-xs line-through">₹{plan.originalPrice.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="text-[10px] text-emerald-800 font-semibold font-sans mt-0.5">
                          You save ₹{(plan.originalPrice - plan.totalPrice).toLocaleString('en-IN')} overall
                        </div>
                      </div>
                    </div>

                    <ul className="space-y-2 pt-3 text-xs text-stone-650">
                      {plan.features.map((f, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-emerald-700 font-bold block shrink-0">•</span>
                          <span className="leading-tight">{f}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="pt-6">
                      <button
                        onClick={() => handleBookPlanClick(`${selectedLongtermTab}-tier-longterm-${plan.months}m`)}
                        className="w-full bg-stone-900 hover:bg-black text-white text-[10px] font-semibold py-3 px-4 rounded-xl tracking-widest uppercase transition-all cursor-pointer text-center"
                      >
                        Book Extended Program
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Coordination Callout Line */}
              <div className="bg-emerald-950 text-white p-6 sm:p-8 rounded-2xl shadow-lg flex flex-col sm:flex-row items-center gap-6 justify-between max-w-4xl mx-auto">
                <div className="space-y-1 text-center sm:text-left">
                  <span className="text-[10px] font-semibold bg-teal-900 text-teal-300 px-2 rounded-full uppercase tracking-widest font-sans">Flexible Holds Policy</span>
                  <h4 className="font-display text-base font-semibold text-white">Custom Scheduling Accommodations</h4>
                  <p className="text-emerald-250 text-xs leading-relaxed max-w-xl">
                    Schedules adapt seamlessly. Take family hold breaks or custom healthcare pause blocks during extended care plans without penalty. No lost sessions.
                  </p>
                </div>
                <button
                  onClick={() => setIsTrialModalOpen(true)}
                  className="bg-white hover:bg-emerald-50 text-emerald-950 shadow font-semibold text-xs tracking-wide py-3 px-5 rounded-xl transition-all cursor-pointer block text-center shrink-0"
                >
                  Book Home Trial
                </button>
              </div>

            </div>
          </div>
        )}

        {/* Tab: TRIAL VISIT */}
        {currentTab === 'trial' && (
          <div className="animate-fade-in py-12 bg-stone-50 animate-fade-in" id="trial-tab">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
              
              <div className="text-center max-w-2xl mx-auto space-y-2 mb-10">
                <span className="text-[10px] font-semibold text-emerald-800 uppercase tracking-widest block">No obligations demo</span>
                <h1 className="font-display text-2xl sm:text-3xl font-semibold text-stone-900 tracking-tight">At-Home Newborn Trial Session</h1>
                <p className="text-stone-500 text-xs sm:text-sm">
                  Test the warmth of our care, verify safety compliance, and configure your plan before any recurring financial subscriptions.
                </p>
              </div>

              <div className="bg-white rounded-3xl border border-stone-200/80 p-6 md:p-10 shadow-lg grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-4xl mx-auto">
                <div className="lg:col-span-5">
                  <div className="rounded-2xl overflow-hidden aspect-square bg-stone-100 border border-stone-200 shadow-sm">
                    <img
                      src={motherWellnessImg}
                      alt="Mother holding newborn peacefully"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <div className="lg:col-span-7 space-y-5 text-left">
                  <div className="flex items-baseline gap-2 pb-2 border-b border-stone-100">
                    <span className="text-xl font-display font-semibold text-stone-800">₹1,299</span>
                    <span className="text-stone-500 text-xs">Single At-Home Demo Session Fee</span>
                  </div>

                  <p className="text-stone-650 text-xs sm:text-sm leading-relaxed">
                    A comprehensive single visit. A certified female therapist visits your address, provides a 30-minute comforting baby massage, safely prepares a gentle warm baby bath, and organizes schedule timings.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-2 text-xs text-stone-650 font-sans">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-900 flex items-center justify-center font-bold text-[10px]">1</span>
                      <span>Full 30-min baby massage</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-900 flex items-center justify-center font-bold text-[10px]">2</span>
                      <span>Hygienic post-massage bath</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-900 flex items-center justify-center font-bold text-[10px]">3</span>
                      <span>Pristine specialized sanitizing</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-900 flex items-center justify-center font-bold text-[10px]">4</span>
                      <span>Direct calendar customization</span>
                    </div>
                  </div>

                  <div className="pt-4 flex gap-3">
                    <button
                      onClick={() => setIsTrialModalOpen(true)}
                      className="bg-emerald-800 hover:bg-emerald-900 text-white font-semibold py-3 px-6 rounded-xl text-[10px] uppercase tracking-widest transition-all cursor-pointer shadow-xs"
                    >
                      Configure Trial In Navi Mumbai &amp; Mumbai
                    </button>
                    <a
                      href="https://wa.me/917304367566"
                      target="_blank"
                      rel="noreferrer"
                      className="border border-stone-200 hover:bg-stone-50 text-stone-600 font-semibold py-3 px-6 rounded-xl text-[10px] uppercase tracking-widest flex items-center gap-1.5"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-teal-600" />
                      <span>Chat</span>
                    </a>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Tab: COVREAGE AREAS */}
        {currentTab === 'areas' && (
          <div className="animate-fade-in py-12 bg-stone-50 animate-fade-in" id="areas-tab">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
              
              <div className="text-center max-w-xl mx-auto space-y-2">
                <span className="text-[10px] font-semibold font-sans text-emerald-800 uppercase tracking-widest block font-sans">Our Locations</span>
                <h1 className="font-display text-2xl sm:text-3xl font-semibold text-stone-900">Serving Navi Mumbai &amp; Mumbai</h1>
                <p className="text-stone-500 text-xs sm:text-sm leading-relaxed">
                  Our local caregivers are thoughtfully placed across the city to ensure reliable, timely visits to your home.
                </p>
              </div>

              <div className="bg-white border text-stone-800 p-8 rounded-3xl shadow-md text-center space-y-6">
                <div className="flex flex-wrap items-center justify-center gap-2.5">
                  {NAVI_MUMBAI_AREAS.map((area) => (
                    <span 
                      key={area}
                      className="bg-stone-50 text-stone-750 border border-stone-200/80 font-semibold px-4 py-2.5 rounded-xl text-xs hover:border-emerald-700/60 shadow-xs transition-colors"
                    >
                      {area}
                    </span>
                  ))}
                </div>

                <div className="text-stone-500 text-xs max-w-md mx-auto pt-4 leading-normal bg-stone-50 p-4 rounded-xl border border-stone-100">
                  <Info className="w-4 h-4 text-emerald-800 inline-block mr-1.5 -mt-0.5" />
                  Don't see your specific sector, landmark, or village complex? Reach out directly to our scheduling coordinator to request customized routing.
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Tab: REVIEWS */}
        {currentTab === 'reviews' && (
          <div className="animate-fade-in py-12 bg-stone-50 animate-fade-in" id="reviews-tab">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
              
              <div className="text-center max-w-2xl mx-auto space-y-4">
                <span className="text-[10px] font-semibold text-emerald-800 uppercase tracking-widest block">Authentic Testimony</span>
                <h1 className="font-display text-2xl sm:text-3xl font-semibold text-stone-900">Earning Trust Across Navi Mumbai &amp; Mumbai Families</h1>
                
                <div className="flex flex-col items-center justify-center gap-1.5 pt-1">
                  <div className="flex text-amber-500 gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="text-stone-850 font-display font-semibold text-base uppercase tracking-wide">Overall 4.8/5 Rating</span>
                  <p className="text-xs text-stone-400">Based on 124+ certified local parent testimonials</p>
                </div>
              </div>

              {/* Slider Component kept for luxury presentation interactively */}
              <div className="relative bg-white border border-stone-200 shadow-md p-6 sm:p-10 rounded-2xl max-w-3xl mx-auto overflow-hidden">
                <Quote className="w-16 h-16 text-emerald-800/10 absolute right-6 top-6 pointer-events-none" />
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="bg-emerald-50 text-emerald-950 font-semibold uppercase text-[8px] tracking-widest px-2.5 py-1 rounded border border-emerald-100/60">
                      {REVIEWS[activeReviewIdx].tag}
                    </span>
                    <span className="text-stone-404 text-xs">{REVIEWS[activeReviewIdx].date}</span>
                  </div>

                  <p className="text-xs sm:text-sm italic text-stone-700 leading-relaxed text-center px-4">
                    "{REVIEWS[activeReviewIdx].comment}"
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h5 className="font-display text-xs font-semibold text-stone-900 leading-none">
                      {REVIEWS[activeReviewIdx].name}
                    </h5>
                    <div className="flex items-center gap-1 text-[10px] text-stone-500 mt-1.5">
                      <MapPin className="w-3 h-3 text-emerald-700" />
                      <span>{REVIEWS[activeReviewIdx].location}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1 bg-emerald-50 text-emerald-950 p-2 rounded-lg border border-emerald-100/30 text-[8px] tracking-widest font-bold uppercase">
                    <Check className="w-3 h-3 text-emerald-800" /> Verified Client
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="flex justify-center items-center gap-4">
                <button 
                  onClick={handlePrevReview}
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-white hover:bg-stone-50 border border-stone-200 text-stone-700 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                
                <button 
                  onClick={handleNextReview}
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-white hover:bg-stone-50 border border-stone-200 text-stone-700 transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Also render the full static list of testimonials below to preserve ALL data completely */}
              <div className="border-t border-stone-250/20 pt-10 space-y-6">
                <h3 className="font-display text-sm font-semibold tracking-wider text-stone-900 uppercase text-center">Verified Client Registry</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {REVIEWS.map((rev, idx) => {
                    if (idx === activeReviewIdx) return null; // Avoid exact repeating
                    return (
                      <div key={idx} className="bg-stone-100/40 border border-stone-200 p-5 rounded-xl space-y-3">
                        <div className="flex items-center justify-between text-[11px] text-stone-400">
                          <span className="font-semibold text-stone-500">{rev.name} ({rev.location})</span>
                          <span>{rev.date}</span>
                        </div>
                        <p className="text-xs text-stone-650 italic leading-relaxed">"{rev.comment}"</p>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Tab: FAQ */}
        {currentTab === 'faq' && (
          <div className="animate-fade-in py-12 bg-stone-50 animate-fade-in" id="faq-tab">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
              
              <div className="text-center max-w-xl mx-auto space-y-2">
                <span className="text-[10px] font-semibold text-emerald-800 uppercase tracking-widest block">Answering Queries</span>
                <h1 className="font-display text-2xl sm:text-3xl font-semibold text-stone-900">Frequently Asked Questions</h1>
                <p className="text-stone-500 text-xs sm:text-sm">
                  Learn more about our soothing newborn rituals, our care schedule, and how we ensure a safe environment for your family.
                </p>
              </div>

              <div className="space-y-4 max-w-3xl mx-auto" id="faqs-accordion">
                {FAQ_DATA.map((faq, idx) => {
                  const isOpen = openFaqIdx === idx;
                  return (
                    <div 
                      key={idx}
                      className="bg-white border rounded-2xl overflow-hidden transition-all shadow-xs"
                    >
                      <button
                        onClick={() => toggleFaq(idx)}
                        type="button"
                        className="w-full text-left px-5 py-4 flex items-center justify-between text-stone-900 hover:bg-stone-50 transition-all cursor-pointer"
                      >
                        <span className="font-display text-[13.5px] sm:text-sm font-semibold tracking-tight pr-4 flex items-center gap-2">
                          <HelpCircle className="w-4 h-4 text-emerald-800 shrink-0" />
                          {faq.q}
                        </span>
                        {isOpen ? <ChevronUp className="w-4 h-4 text-stone-500 shrink-0" /> : <ChevronDown className="w-4 h-4 text-stone-500 shrink-0" />}
                      </button>

                      <div 
                        className={`transition-all overflow-hidden ${
                          isOpen ? 'max-h-72 border-t border-stone-100' : 'max-h-0'
                        }`}
                      >
                        <p className="p-5 text-xs text-stone-600 bg-stone-50/50 leading-relaxed font-sans">
                          {faq.a}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          </div>
        )}

        {/* Tab: ABOUT */}
        {currentTab === 'about' && (
          <div className="animate-fade-in py-12 bg-stone-50" id="about-tab">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
              
              {/* Header section with brand colors */}
              <div className="text-center max-w-3xl mx-auto space-y-3">
                <span className="text-[10px] font-semibold bg-emerald-50 border border-emerald-100 text-emerald-850 px-3.5 py-1 rounded-full uppercase tracking-widest block w-fit mx-auto font-mono">
                  OUR PHILOSOPHY & STORY
                </span>
                <h1 className="font-display text-2xl sm:text-3xl font-semibold text-emerald-950 tracking-tight">
                  About Infantree
                </h1>
                <p className="text-stone-500 text-xs sm:text-sm leading-relaxed max-w-2xl mx-auto font-sans">
                  Infantree – Baby Massage & Mother Care is a premium home-care service dedicated to supporting mothers and newborns during the most delicate phase of early parenthood.
                </p>
              </div>

              {/* Two Column Layout: Detailed Story on left, Trust & Protocols on Right */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Column One: The Story */}
                <div className="lg:col-span-12 xl:col-span-7 space-y-6">
                  
                  {/* Premium Wellness Care Illustration */}
                  <div className="aspect-[16/10] sm:aspect-[16/9] bg-stone-200 rounded-3xl overflow-hidden border border-stone-200/80 shadow-md relative">
                    <img
                      src={aboutMotherCareImg}
                      alt="Gentle infant care and therapeutic baby massage illustration"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-900/10 via-transparent to-transparent pointer-events-none" />
                  </div>

                  <div className="bg-white border border-stone-200/65 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs leading-relaxed">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-950 flex items-center justify-center shrink-0">
                        <Heart className="w-5 h-5 text-emerald-300" />
                      </div>
                      <h2 className="font-display text-lg sm:text-xl font-semibold text-emerald-950">
                        Gentle Support. Unhurried Recovery.
                      </h2>
                    </div>

                    <div className="text-xs sm:text-sm text-stone-650 space-y-4 font-sans">
                      <p>
                        We specialize in gentle newborn massage, baby bath assistance, and postnatal mother recovery care through trained and experienced female therapists who understand the importance of comfort, safety, hygiene, and emotional reassurance at home.
                      </p>
                      
                      <p>
                        At Infantree, we believe postpartum recovery and infant care should never feel rushed, stressful, or impersonal. Our approach combines traditional care practices with structured professional standards to create a calm, safe, and trustworthy experience for every family we serve.
                      </p>

                      <p>
                        Our services are thoughtfully designed for modern families seeking dependable and premium-quality mother and baby care within the comfort and privacy of their homes.
                      </p>

                      <p className="font-semibold text-emerald-900 pt-1 border-t border-stone-100">
                        Currently serving families across Navi Mumbai &amp; Mumbai, Infantree continues to build a trusted care ecosystem centered around safety, professionalism, and genuine human care.
                      </p>
                    </div>
                  </div>

                  {/* Corporate Profile block */}
                  <div className="bg-white border border-stone-200/65 rounded-3xl p-6 sm:p-8 space-y-2 shadow-xs leading-relaxed">
                    <span className="text-[9px] font-semibold text-stone-400 font-mono tracking-widest uppercase block">
                      Corporate Profile
                    </span>
                    <p className="text-xs text-stone-600 font-sans">
                      Infantree is a wellness care initiative by <span className="font-semibold text-stone-800">Driblets Food Products Pvt. Ltd.</span>
                    </p>
                  </div>
                </div>

                {/* Column Two: Caregiver screening, protocol highlights, and call-to-actions */}
                <div className="lg:col-span-12 xl:col-span-5 space-y-6">
                  
                  {/* The caregiver guarantee block */}
                  <div className="bg-gradient-to-b from-stone-50 to-stone-100/60 border border-stone-200 rounded-3xl p-6 space-y-5 shadow-xs">
                    <div className="flex items-center gap-2.5">
                      <Shield className="w-5 h-5 text-[#128C7E]" />
                      <h3 className="font-display text-sm font-bold text-stone-900 uppercase tracking-wide">
                        The Caregiver Promise
                      </h3>
                    </div>

                    <p className="text-xs text-stone-600 leading-relaxed font-sans">
                      Every caregiver associated with Infantree undergoes identity verification, background checks, and skill evaluation before becoming part of our care network. We focus on providing consistent, respectful, and compassionate support during every home visit.
                    </p>

                    <div className="border-t border-stone-200/80 pt-4 space-y-3.5">
                      <div className="flex gap-3">
                        <Check className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
                        <div>
                          <span className="block text-xs font-semibold text-stone-850 leading-none">Screened & Certified</span>
                          <span className="block text-[10px] text-stone-500 mt-1">Rigorous background evaluations and professional certifications completed for safety and care assurance.</span>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <Check className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
                        <div>
                          <span className="block text-xs font-semibold text-stone-850 leading-none">Continuous Care Training</span>
                          <span className="block text-[10px] text-stone-500 mt-1">Regular skill updates focused on gentle touch methods and ensuring a safe, clean environment for your baby.</span>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <Check className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
                        <div>
                          <span className="block text-xs font-semibold text-stone-850 leading-none">Compassionate Professional Conduct</span>
                          <span className="block text-[10px] text-stone-500 mt-1">Strict guidelines regarding polite speech, hygiene routines, punctuality, and infant comfort focus.</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Immediate Help Call Actions to drive conversions */}
                  <div className="bg-white border rounded-3xl p-6 text-center space-y-4">
                    <div>
                      <h4 className="font-display text-xs font-bold uppercase tracking-wider text-stone-800">Coordinate With Our Care Team</h4>
                      <p className="text-[10px] text-stone-500 mt-1">Serving fine homes across Vashi, Kharghar, Nerul, Ulwe, Navi Mumbai &amp; Mumbai.</p>
                    </div>

                    <div className="space-y-2">
                      <button
                        onClick={() => setIsTrialModalOpen(true)}
                        className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-semibold py-2.5 px-4 rounded-xl text-xs uppercase tracking-wide cursor-pointer transition-all flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Book A Home Trial</span>
                      </button>

                      <a
                        href="https://wa.me/917304367566"
                        target="_blank"
                        rel="noreferrer"
                        className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-semibold py-2.5 px-4 rounded-xl text-xs uppercase tracking-wide cursor-pointer transition-all flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <MessageSquare className="w-3.5 h-3.5 fill-white" />
                        <span>WhatsApp Consult</span>
                      </a>
                    </div>
                  </div>

                </div>

              </div>

            </div>
          </div>
        )}

        {/* Tab: CONTACT */}
        {currentTab === 'contact' && (
          <div className="animate-fade-in py-12 bg-stone-50 animate-fade-in" id="contact-tab">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
              
              <div className="text-center max-w-2xl mx-auto space-y-2">
                <span className="text-[10px] font-semibold text-emerald-800 uppercase tracking-widest block font-sans">Get In Touch</span>
                <h1 className="font-display text-2xl sm:text-3xl font-semibold text-stone-900 leading-tight">Reserve Your Care Schedule</h1>
                <p className="text-stone-500 text-xs sm:text-sm">
                  Once you reach out, our care team will promptly coordinate a personalized schedule that fits your family's needs.
                </p>
              </div>

              <div className="bg-white rounded-3xl overflow-hidden shadow-lg border border-stone-200 max-w-5xl mx-auto">
                <ContactForm />
              </div>

            </div>
          </div>
        )}
      </main>

      {/* Persistent STICKY BOTTOM ACTIONS FOR WHATSAPP + alerts */}
      <div className="fixed bottom-4 right-4 z-40 flex flex-col items-end gap-2" id="persistent-sticky-whatsapp">
        <a 
          href="https://wa.me/917304367566"
          target="_blank"
          rel="noreferrer"
          className="bg-[#25D366] hover:bg-[#128C7E] text-white p-3.5 sm:p-4 rounded-full shadow-2xl flex items-center justify-center hover:scale-105 transition-all text-sm font-semibold max-w-fit cursor-pointer border border-[#20ba59]/40 gap-2 shrink-0 group animate-bounce"
          id="sticky-whatsapp-bubble"
          title="Instant Help over WhatsApp"
        >
          <img
  src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
  alt="WhatsApp"
  className="w-5 h-5"
/>
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 font-sans tracking-wide text-xs">WhatsApp Care Advisor</span>
        </a>
      </div>

      {/* Footer bar containing Parent Company Driblets Food Products Pvt. Ltd. and exact business details */}
      <footer className="bg-stone-950 text-stone-400 py-12 border-t border-stone-850 text-xs" id="footer-main">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8 pb-10 border-b border-stone-900 leading-snug">
          
          <div className="space-y-4 text-left">
            <div className="flex flex-col">
              <span className="font-serif text-[22px] font-bold text-white tracking-wide leading-none">
                Infantree
              </span>
              <span className="text-[8px] uppercase tracking-widest text-[#128C7E] font-bold block mt-1 font-sans">
                baby massage & Mother care
              </span>
            </div>
            <p className="text-[11px] text-stone-505 max-w-xs leading-relaxed font-sans">
              Refined postpartum care and gentle newborn therapy throughout Navi Mumbai &amp; Mumbai, guided by certified and experienced female professionals.
            </p>
          </div>

          <div className="space-y-3 text-left">
            <h4 className="font-display text-xs font-semibold text-stone-300 tracking-wider uppercase">Our Locations</h4>
            <div className="space-y-1.5 text-[11px] text-stone-500 font-normal">
              <p className="font-medium text-stone-400">Infantree – Baby Massage & Mother Care</p>
              <p className="text-[10px] text-stone-605">A wellness care initiative by Driblets Food Products Pvt. Ltd.</p>
              <p className="text-stone-500 leading-relaxed">Shop 06, Plot-362, Sector 17, Reddy Jewel, Panvel, Raigad, Ulwe, Maharashtra – 410206</p>
              <p className="text-stone-600">Timings: Daily 9:00 AM — 6:00 PM IST</p>
            </div>
          </div>

          <div className="space-y-4 text-left">
            <h4 className="font-display text-xs font-semibold text-stone-300 tracking-wider uppercase">Talk to Us</h4>
            <div className="space-y-2">
              <a href="tel:+917304367566" className="flex items-center gap-2 hover:text-white transition-colors text-[11px]">
                <Phone className="w-3.5 h-3.5 text-teal-400" />
                <span className="font-sans font-semibold">+91 7304367566 (Scheduling Desk)</span>
              </a>
              <a href="https://wa.me/917304367566" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-white transition-colors text-[11px]">
                <MessageSquare className="w-3.5 h-3.5 text-teal-400" />
                <span className="font-sans font-semibold">WhatsApp Care Support: +91 7304367566</span>
              </a>
            </div>
          </div>
          
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[9px] text-stone-500 font-sans tracking-widest uppercase font-semibold">
          <p>© 2026 Infantree. All rights reserved.</p>
          <div className="flex gap-4 text-stone-600">
            <span className="hover:text-stone-400 cursor-pointer" onClick={() => navigateToTab('about')}>About Us</span>
            <span className="hover:text-stone-400 cursor-pointer" onClick={() => navigateToTab('faq')}>Policies</span>
            <span className="hover:text-stone-400 cursor-pointer" onClick={() => navigateToTab('areas')}>Areas We Serve</span>
            <span>EXPERT CERTIFIED PROVIDERS</span>
          </div>
        </div>
      </footer>

      {/* Modals Mounting */}
      <BookServiceModal 
        isOpen={isBookModalOpen} 
        onClose={() => setIsBookModalOpen(false)} 
        initialPlanId={selectedPlanId}
        onSuccess={notifySuccess}
      />

      <TrialBookingModal 
        isOpen={isTrialModalOpen} 
        onClose={() => setIsTrialModalOpen(false)}
        onSuccess={notifySuccess}
      />

      {isAdminPanelOpen && (
        <AdminPanel onClose={() => setIsAdminPanelOpen(false)} />
      )}

<IramChat />

    </div>
  );
}
