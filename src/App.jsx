import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Mic, Camera, MoreVertical, MessageCircle, ChevronRight,
  Home, User, Settings, ChevronLeft, ShieldCheck, Sparkles, Plus,
  Wifi, Battery, ArrowRight, Calendar, Clock, CheckCircle2
} from 'lucide-react';

// --- MAIN APP COMPONENT ---

function App() {
  const [page, setPage] = useState(1); // 1, 2, or 3
  const [companyName, setCompanyName] = useState('');
  const [scene, setScene] = useState('google');

  // Auto-transition: Google → RCS after 3.5 seconds
  useEffect(() => {
    if (!companyName.trim()) {
      setScene('google');
      return;
    }

    // Reset to google immediately when name changes
    setScene('google');

    const timer = setTimeout(() => {
      setScene('rcs');
    }, 3500);

    return () => clearTimeout(timer);
  }, [companyName]);

  return (
    <div className="min-h-screen bg-[#F8F9FA] antialiased font-sans">

      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#DDDDDD] transition-all duration-200">
        <div className="max-w-7xl mx-auto px-8 h-16 flex items-center">
          <div className="flex items-center select-none cursor-pointer" onClick={() => { setPage(1); setCompanyName(''); }}>
            <span className="text-2xl font-bold text-[#BD2949]">e</span>
            <span className="text-2xl font-normal text-[#000000]">ngati</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

            {/* LEFT COLUMN: Wizard Form */}
            <div className="lg:sticky lg:top-24 z-10">
              <AnimatePresence mode="wait">
                {page === 1 && (
                  <Page1
                    key="p1"
                    companyName={companyName}
                    setCompanyName={setCompanyName}
                    onNext={() => setPage(2)}
                  />
                )}
                {page === 2 && (
                  <Page2
                    key="p2"
                    companyName={companyName}
                    onBack={() => setPage(1)}
                    onSubmit={() => setPage(3)}
                  />
                )}
                {page === 3 && (
                  <Page3
                    key="p3"
                    companyName={companyName}
                    onReset={() => { setCompanyName(''); setPage(1); }}
                  />
                )}
              </AnimatePresence>
            </div>

            {/* RIGHT COLUMN: Phone Mockup */}
            <div className="space-y-8 flex justify-center lg:block">
              <PhoneStudio companyName={companyName} scene={scene} />
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}

// --- PHONE STUDIO CONTAINER ---

function PhoneStudio({ companyName, scene }) {
  return (
    <div className="relative mx-auto w-full max-w-[380px] perspective-1000">

      {/* Phone Chassis - Black Frame */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative bg-[#1F1F1F] rounded-[56px] p-3 shadow-2xl ring-1 ring-white/10"
      >

        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-[#1F1F1F] rounded-b-3xl z-20 pointer-events-none" />

        {/* Screen */}
        <div
          className="relative bg-white rounded-[44px] overflow-hidden flex flex-col w-full h-full backface-hidden"
          style={{ aspectRatio: '9/19.5' }}
        >

          {/* Status Bar */}
          <div className="h-12 bg-white flex items-center justify-between px-8 text-xs font-medium z-20 flex-shrink-0 select-none">
            <span className="text-[#000000]">9:41</span>
            <div className="flex items-center gap-1.5">
              <Wifi className="w-4 h-4 text-[#000000]" />
              <Battery className="w-5 h-5 text-[#000000]" />
            </div>
          </div>

          {/* Scene Container - CRITICAL: flex-1 for proper height */}
          <div className="flex-1 overflow-hidden relative">
            <AnimatePresence mode="wait">
              {scene === 'google' && (
                <GoogleSearchScene key="google" companyName={companyName} />
              )}
              {scene === 'rcs' && (
                <RCSChatScene key="rcs" companyName={companyName} />
              )}
            </AnimatePresence>
          </div>

        </div>
      </motion.div>

      {/* Reflection/Glare effect (optional polish) */}
      <div className="absolute inset-x-4 top-4 h-1/3 bg-gradient-to-b from-white/5 to-transparent rounded-[48px] pointer-events-none z-10 mix-blend-overlay" />
    </div>
  );
}

// --- SCENE 1: GOOGLE SEARCH ---

function GoogleSearchScene({ companyName }) {
  const brandName = companyName || 'Centre For Sight';
  const brandUrl = brandName.toLowerCase().replace(/[^a-z0-9]/g, '') + '.net';

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="h-full bg-white flex flex-col overflow-hidden"
    >

      {/* SEARCH BAR - Top */}
      <div className="p-4 flex-shrink-0">
        <div className="bg-[#F8F9FA] rounded-full px-4 py-2.5 flex items-center gap-3 shadow-sm border border-transparent">
          <Search className="w-4 h-4 text-[#5F6368]" />
          <span className="text-sm text-[#5F6368] flex-1 truncate font-normal">
            {brandName.toLowerCase()} appointment...
          </span>
          <Mic className="w-4 h-4 text-[#1A73E8]" />
          <Camera className="w-4 h-4 text-[#1A73E8]" />
        </div>
      </div>

      {/* FILTER TABS (Visual only) */}
      <div className="px-4 pb-2 flex gap-6 border-b border-[#DADCE0] overflow-x-hidden text-sm font-medium text-[#5F6368]">
        <span className="text-[#1A73E8] pb-2 border-b-2 border-[#1A73E8]">All</span>
        <span className="pb-2">Images</span>
        <span className="pb-2">Videos</span>
        <span className="pb-2">News</span>
      </div>

      {/* SCROLLABLE RESULTS AREA */}
      <div className="flex-1 overflow-y-auto px-4 py-4 hide-scrollbar">

        {/* Website Card */}
        <div className="mb-3 pb-3 border-b border-[#DADCE0]">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {brandName[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0 flex flex-col">
              <div className="font-normal text-sm text-[#202124] truncate leading-tight">
                {brandName}
              </div>
              <div className="text-xs text-[#5F6368] truncate leading-tight">
                https://www.{brandUrl}
              </div>
            </div>
            <MoreVertical className="w-5 h-5 text-[#5F6368] flex-shrink-0" />
          </div>

          {/* MAIN RESULT TITLE - Blue Link */}
          <h2 className="text-xl font-normal text-[#1A73E8] mb-1 cursor-pointer hover:underline leading-snug">
            {brandName}
          </h2>

          {/* DESCRIPTION TEXT */}
          <p className="text-sm text-[#4D5156] leading-relaxed mb-4">
            {brandName} ~ India's leading eye care network offers advanced
            technology & expert specialists for LASIK, cataract, retina & glaucoma.
          </p>

          {/* EXPANDABLE OPTIONS - 6 Items */}
          <div className="space-y-0 mb-4 border-t border-[#F1F3F4]">
            <ExpandableOption text="Book Your Eye Care Visit" />
            <ExpandableOption text="Safdarjung Enclave" />
            <ExpandableOption text="Eye Specialist Near Me" />
            <ExpandableOption text="Eye Hospital in Dwarka, Delhi" />
            <ExpandableOption text="Eye Hospital in Preet Vihar ..." />
            <ExpandableOption text="Eye Hospitals in India" />
          </div>

          {/* RCS CHAT BUTTON - White with Border */}
          <button className="w-full bg-white border border-[#DADCE0] rounded-lg py-3 px-4 flex items-center gap-3 hover:bg-[#F8F9FA] transition-colors shadow-sm mb-4 group relative overflow-hidden">

            <div className="w-9 h-9 rounded-full bg-[#1A73E8] flex items-center justify-center flex-shrink-0 z-10">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 text-left z-10">
              <div className="text-sm font-medium text-[#202124]">
                Chat with {brandName}
              </div>
              <div className="text-xs text-[#5F6368]">
                On Google Messages
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-[#5F6368] z-10" />

            <div className="absolute inset-0 bg-gray-50 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>

          {/* LOCATIONS SECTION */}
          <div className="pt-3 border-t border-[#DADCE0]">
            <h3 className="text-lg font-normal text-[#202124] mb-2">
              Locations
            </h3>
            {/* Map Placeholder */}
            <div className="h-24 bg-gray-100 rounded-lg w-full flex items-center justify-center">
              <span className="text-[#5F6368] text-xs">Map View</span>
            </div>
          </div>

        </div>

      </div>

      {/* BOTTOM NAVIGATION - Fixed */}
      <div className="h-14 bg-white border-t border-[#DADCE0] flex items-center justify-around px-4 flex-shrink-0 pb-1">
        <NavIcon icon="home" active />
        <NavIcon icon="search" />
        <NavIcon icon="profile" />
        <NavIcon icon="settings" />
      </div>

    </motion.div>
  );
}

// --- SCENE 2: RCS CHAT ---

function RCSChatScene({ companyName }) {
  const brandName = companyName || 'Centre For Sight';
  const brandInitial = brandName[0].toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="h-full bg-[#F5F7FA] flex flex-col"
    >

      {/* CHAT HEADER */}
      <div className="bg-white border-b border-[#DADCE0] px-4 py-2.5 flex items-center gap-3 flex-shrink-0 shadow-sm z-10">
        <button className="p-1 -ml-1 hover:bg-gray-100 rounded-full">
          <ChevronLeft className="w-6 h-6 text-[#5F6368]" />
        </button>
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
          {brandInitial}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <h3 className="font-medium text-[#202124] text-sm truncate">
              {brandName}
            </h3>
            <ShieldCheck className="w-3.5 h-3.5 text-[#1A73E8]" fill="#1A73E8" color="white" />
          </div>
          <p className="text-xs text-[#5F6368] truncate">
            Business Account • Usually replies instantly
          </p>
        </div>
        <button className="p-2 hover:bg-gray-100 rounded-full">
          <MoreVertical className="w-5 h-5 text-[#5F6368]" />
        </button>
      </div>

      {/* MESSAGES CONTAINER */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5 bg-[#FFFFFF]">

        {/* Date Divider */}
        <div className="flex justify-center">
          <span className="text-[10px] font-medium text-[#5F6368] bg-[#F1F3F4] px-3 py-1 rounded-full">Today</span>
        </div>

        {/* Welcome Message */}
        <div className="flex gap-2.5 items-end group">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs flex-shrink-0 shadow-sm">
            {brandInitial}
          </div>
          <div className="bg-[#F1F3F4] rounded-2xl rounded-bl-sm p-3 max-w-[78%]">
            <p className="text-sm text-[#202124] leading-relaxed">
              Hi there! 👋 Welcome to {brandName}. How can we help you today?
            </p>
            <span className="text-[10px] text-[#5F6368] mt-1 block opacity-70">9:42 AM</span>
          </div>
        </div>

        {/* Rich Card */}
        <div className="flex gap-2.5">
          <div className="w-8 h-8 flex-shrink-0" />
          <div className="bg-white border border-[#DADCE0] rounded-2xl shadow-sm overflow-hidden max-w-[85%]">
            <div className="aspect-video bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
              <Sparkles className="w-10 h-10 text-purple-400" />
            </div>
            <div className="p-4 space-y-3">
              <div>
                <h4 className="font-semibold text-[#202124] text-sm mb-1">
                  Special Offer for You! 🎉
                </h4>
                <p className="text-xs text-[#5F6368] leading-relaxed">
                  Get 20% off your first order with {brandName}. Exclusive RCS customer benefit.
                </p>
              </div>
              <div className="flex gap-2 pt-1">
                <button className="flex-1 bg-[#F1F3F4] text-[#1A73E8] rounded-full py-2 px-3 text-xs font-medium hover:bg-[#E8F0FE] transition-colors">
                  Claim Offer
                </button>
                <button className="flex-1 border border-[#DADCE0] text-[#1A73E8] rounded-full py-2 px-3 text-xs font-medium hover:bg-[#F8F9FA] transition-colors">
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Typing Indicator */}
        <div className="flex gap-2.5 items-end">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs flex-shrink-0 shadow-sm">
            {brandInitial}
          </div>
          <div className="bg-[#F1F3F4] rounded-2xl rounded-bl-sm px-4 py-3">
            <div className="flex gap-1">
              <span className="w-1.5 h-1.5 bg-[#5F6368] rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
              <span className="w-1.5 h-1.5 bg-[#5F6368] rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} />
              <span className="w-1.5 h-1.5 bg-[#5F6368] rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
            </div>
          </div>
        </div>

      </div>

      {/* INPUT BAR - Fixed Bottom */}
      <div className="bg-white border-t border-[#DADCE0] p-3 flex items-center gap-2 flex-shrink-0 pb-6">
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors bg-[#F1F3F4]">
          <Plus className="w-5 h-5 text-[#444746]" />
        </button>
        <div className="flex-1 bg-[#F1F3F4] rounded-full px-4 py-2.5 text-sm text-[#5F6368] cursor-text">
          Type a message...
        </div>
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <Mic className="w-5 h-5 text-[#444746]" />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <Camera className="w-5 h-5 text-[#444746]" />
        </button>
      </div>

    </motion.div>
  );
}

// --- WIZARD PAGES ---

function Page1({ companyName, setCompanyName, onNext }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="space-y-8 max-w-lg"
    >
      <button className="flex items-center gap-2 text-[#666666] hover:text-[#000000] transition-colors group">
        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        <span className="text-sm font-medium">Back to edit name</span>
      </button>

      <div className="space-y-6">
        <h1 className="text-5xl font-bold text-[#000000] leading-[1.15] tracking-tight">
          Autonomous Agents for <span className="text-[#BD2949]">RCS</span> Messaging.
        </h1>
        <p className="text-lg text-[#666666] leading-relaxed">
          Scale support and sales without increasing headcount. Deploy GenAI agents
          that resolve complex queries on RCS.
        </p>
      </div>

      <div className="space-y-4 pt-2">
        <label className="block">
          <span className="text-sm font-semibold text-[#000000] mb-2 block">
            Company Name
          </span>
          <input
            type="text"
            placeholder="e.g Center for Sight"
            className="w-full px-4 py-3.5 rounded-lg border border-[#DDDDDD] text-base text-[#000000] placeholder:text-[#999999] focus:border-[#BD2949] focus:outline-none focus:ring-2 focus:ring-[#BD2949]/20 transition-all bg-white"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && companyName.trim() && onNext()}
            autoFocus
          />
        </label>

        <button
          onClick={onNext}
          disabled={!companyName.trim()}
          className="w-full py-4 bg-[#BD2949] text-white rounded-lg font-semibold text-base hover:bg-[#A02340] disabled:bg-[#F1F3F4] disabled:text-[#999999] disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 disabled:hover:translate-y-0 disabled:shadow-none"
        >
          See your brand live
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>

      <p className="text-xs text-[#666666]">
        By submitting, you agree to Engati's Terms of Use.
        <a href="https://www.engati.ai/termsofuse" className="text-[#BD2949] hover:underline ml-1 font-medium" target="_blank" rel="noreferrer">View terms</a>
      </p>
    </motion.div>
  );
}

function Page2({ companyName, onBack, onSubmit }) {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    revenue: '',
    date: '',
    time: ''
  });

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.4 }}
      className="space-y-8 max-w-lg"
    >
      <button onClick={onBack} className="flex items-center gap-2 text-[#666666] hover:text-[#000000] transition-colors group">
        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        <span className="text-sm font-medium">Back to edit name</span>
      </button>

      <div className="space-y-3">
        <h2 className="text-4xl font-bold text-[#000000] leading-tight tracking-tight">
          Get your custom <span className="text-[#BD2949]">RCS</span> demo
        </h2>
        <p className="text-base text-[#666666] leading-relaxed">
          See how <span className="font-semibold text-[#000000]">{companyName}</span> can increase engagement by 5-8x with RCS.
        </p>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); onSubmit(form); }} className="space-y-5">

        {/* Two Column Row */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-[#000000] mb-2 block">Full Name</label>
            <input type="text" placeholder="Adam" required className="w-full px-4 py-3 rounded-lg border border-[#DDDDDD] text-[#000000] placeholder:text-[#999999] focus:border-[#BD2949] focus:outline-none focus:ring-2 focus:ring-[#BD2949]/20 transition-all" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
          </div>
          <div>
            <label className="text-sm font-medium text-[#000000] mb-2 block">Company Mail</label>
            <input type="email" placeholder="test@test.com" required className="w-full px-4 py-3 rounded-lg border border-[#DDDDDD] text-[#000000] placeholder:text-[#999999] focus:border-[#BD2949] focus:outline-none focus:ring-2 focus:ring-[#BD2949]/20 transition-all" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-[#000000] mb-2 block">Phone Number</label>
          <input type="tel" placeholder="+91 9999999999" className="w-full px-4 py-3 rounded-lg border border-[#DDDDDD] text-[#000000] placeholder:text-[#999999] focus:border-[#BD2949] focus:outline-none focus:ring-2 focus:ring-[#BD2949]/20 transition-all" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        </div>

        <div>
          <label className="text-sm font-medium text-[#000000] mb-2 block">Annual Revenue</label>
          <div className="relative">
            <select className="w-full px-4 py-3 rounded-lg border border-[#DDDDDD] text-[#000000] bg-white appearance-none cursor-pointer focus:border-[#BD2949] focus:outline-none focus:ring-2 focus:ring-[#BD2949]/20 transition-all" value={form.revenue} onChange={(e) => setForm({ ...form, revenue: e.target.value })}>
              <option value="">Select</option>
              <option value="<10cr">&lt;10 cr</option>
              <option value="10-50cr">10-50 cr</option>
              <option value=">50cr">&gt;50 cr</option>
            </select>
            <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666666] pointer-events-none rotate-90" />
          </div>
        </div>

        {/* Date and Time Row */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-[#000000] mb-2 block">Preferred Date</label>
            <div className="relative">
              <input type="text" placeholder="dd/mm/yyyy" className="w-full px-4 py-3 rounded-lg border border-[#DDDDDD] text-[#000000] placeholder:text-[#999999] focus:border-[#BD2949] focus:outline-none focus:ring-2 focus:ring-[#BD2949]/20 pr-10 transition-all" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#999999] pointer-events-none" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-[#000000] mb-2 block">Time</label>
            <div className="relative">
              <input type="text" placeholder="--:--:--" className="w-full px-4 py-3 rounded-lg border border-[#DDDDDD] text-[#000000] placeholder:text-[#999999] focus:border-[#BD2949] focus:outline-none focus:ring-2 focus:ring-[#BD2949]/20 pr-10 transition-all" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
              <Clock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#999999] pointer-events-none" />
            </div>
          </div>
        </div>

        <button type="submit" className="w-full py-4 bg-[#BD2949] text-white rounded-lg font-semibold text-base hover:bg-[#A02340] transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0">
          Request Demo
          <Calendar className="w-5 h-5" />
        </button>

        <p className="text-xs text-[#666666] text-center pt-2">
          By submitting, you agree to Engati's Terms of Use.
          <a href="https://www.engati.ai/termsofuse" className="text-[#BD2949] hover:underline ml-1" target="_blank" rel="noreferrer">View terms</a>
        </p>
      </form>
    </motion.div>
  );
}

function Page3({ companyName, onReset }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-8 text-center py-12"
    >
      <div className="flex justify-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 15 }}
          className="w-24 h-24 rounded-full bg-[#E8F5E9] flex items-center justify-center"
        >
          <CheckCircle2 className="w-12 h-12 text-[#34A853]" />
        </motion.div>
      </div>

      <div className="space-y-4">
        <h2 className="text-4xl font-bold text-[#000000] tracking-tight">Demo Request Received!</h2>
        <p className="text-lg text-[#666666] max-w-md mx-auto leading-relaxed">
          Thanks for your interest in <span className="font-semibold text-[#000000]">{companyName}</span> on RCS.<br />
          We've sent a confirmation to your email.
        </p>
      </div>

      <div className="pt-4">
        <button onClick={onReset} className="text-[#BD2949] font-semibold hover:underline text-base transition-colors">
          Start a new preview
        </button>
      </div>
    </motion.div>
  );
}

// --- HELPERS ---

function ExpandableOption({ text }) {
  return (
    <div className="py-2.5 border-b border-[#F1F3F4] flex items-center justify-between hover:bg-[#F8F9FA] -mx-4 px-4 cursor-pointer transition-colors group">
      <span className="text-sm text-[#202124] group-hover:text-[#1A73E8]">{text}</span>
      <ChevronRight className="w-4 h-4 text-[#70757A] flex-shrink-0" />
    </div>
  );
}

function NavIcon({ icon, active }) {
  const iconColor = active ? '#1A73E8' : '#5F6368';
  const icons = {
    home: Home,
    search: Search,
    profile: User,
    settings: Settings
  };
  const Icon = icons[icon];

  return (
    <div className="flex flex-col items-center gap-1 cursor-pointer">
      <div className={`p-0.5 rounded-full ${active ? '' : ''}`}>
        <Icon className="w-6 h-6" style={{ color: iconColor }} />
      </div>
    </div>
  );
}

export default App;
