import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, Mic, Camera, MoreVertical, MessageCircle, ChevronRight,
    Home, User, Settings, ChevronLeft, ShieldCheck, Sparkles, Plus,
    Wifi, Battery, ArrowRight, Calendar, Clock, CheckCircle2, Loader2, MapPin,
    MousePointer2, ChevronDown
} from 'lucide-react';
import axios from 'axios';

// --- LIVE DATA ENGINE ---

const useBrandData = (companyName) => {
    const [data, setData] = useState({
        logo: null,
        description: null,
        industry: 'General',
        sitelinks: [],
        offer: 'Get 20% off your first query',
        isLoading: false,
        isLoaded: false
    });

    const timeoutRef = useRef(null);

    const getSitelinks = (industry) => {
        switch (industry) {
            case 'Finance': return ['Login', 'Credit Cards', 'Loans', 'Find ATM', 'Support', 'Rates'];
            case 'Hospitality': return ['Book Room', 'Suites', 'Offers', 'Dining', 'Spa', 'Gallery'];
            case 'Food': return ['Order Online', 'Menu', 'Track Order', 'Locations', 'Deals', 'Nutrition'];
            case 'Retail': return ['Men', 'Women', 'New', 'Sale', 'Stores', 'Track'];
            case 'Healthcare': return ['Appointments', 'Doctors', 'Specialties', 'Locations', 'Portal', 'Services'];
            case 'Tech': return ['Products', 'Solutions', 'Pricing', 'Developers', 'Support', 'Login'];
            default: return ['About Us', 'Services', 'Contact', 'Careers', 'Blog', 'Support'];
        }
    };

    const determineIndustry = (name, text = '') => {
        const lower = (name + ' ' + text).toLowerCase();
        if (lower.match(/bank|finance|capital|credit|invest/)) return 'Finance';
        if (lower.match(/hotel|resort|travel|stay|vacation/)) return 'Hospitality';
        if (lower.match(/food|pizza|burger|cafe|restaurant/)) return 'Food';
        if (lower.match(/shop|store|retail|fashion|wear|shoe/)) return 'Retail';
        if (lower.match(/health|doctor|clinic|care|medical/)) return 'Healthcare';
        if (lower.match(/tech|software|app|data|cloud|cyber/)) return 'Tech';
        return 'General';
    };

    const getOffer = (industry, name) => {
        switch (industry) {
            case 'Finance': return `Special Low Interest Personal Loan for you!`;
            case 'Hospitality': return `Get 25% off your next stay at ${name}`;
            case 'Food': return `Free delivery on your first order`;
            case 'Retail': return `Flash Sale! Extra 20% off today`;
            case 'Healthcare': return `Free consultation for new patients`;
            case 'Tech': return `Start your 14-day free trial`;
            default: return `Get 20% off your first order with ${name}`;
        }
    };

    useEffect(() => {
        if (!companyName || companyName.trim().length < 2) {
            setData(prev => ({ ...prev, isLoading: false, isLoaded: false }));
            return;
        }

        setData(prev => ({ ...prev, isLoading: true, isLoaded: false }));

        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        // Debounce 600ms
        timeoutRef.current = setTimeout(async () => {
            try {
                const cleanName = companyName.trim();
                const domain = cleanName.toLowerCase().replace(/[^a-z0-9]/g, '') + '.com';

                // 1. Google Favicon API
                const logoUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;

                // 2. Wikipedia Summary
                let description = '';
                try {
                    const wikiRes = await axios.get(`https://en.wikipedia.org/api/rest_v1/page/summary/${cleanName}`);
                    if (wikiRes.data && wikiRes.data.extract) {
                        description = wikiRes.data.extract.split('.')[0] + '.';
                    }
                } catch (e) {
                    description = `Official verified business account for ${cleanName}. Connect with us for the best experience.`;
                }

                const industry = determineIndustry(cleanName, description);

                setData({
                    logo: logoUrl,
                    description: description,
                    industry: industry,
                    sitelinks: getSitelinks(industry),
                    offer: getOffer(industry, cleanName),
                    isLoading: false,
                    isLoaded: true
                });

            } catch (error) {
                console.error("Fetch error", error);
                setData(prev => ({ ...prev, isLoading: false, isLoaded: true }));
            }
        }, 600);

        return () => clearTimeout(timeoutRef.current);
    }, [companyName]);

    return data;
};


// --- MAIN APP COMPONENT ---

function AppV2() {
    const [page, setPage] = useState(1);
    const [companyName, setCompanyName] = useState('');

    const brandData = useBrandData(companyName);

    return (
        <div className="min-h-screen bg-[#F8F9FA] antialiased font-sans overflow-hidden relative flex flex-col">

            {/* MESH GRADIENT */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{ x: [0, 100, 0], y: [0, -50, 0], opacity: [0.3, 0.5, 0.3] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-gradient-to-br from-purple-200/40 to-blue-200/40 rounded-full blur-3xl"
                />
            </div>

            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#DDDDDD] transition-all duration-200">
                <div className="max-w-7xl mx-auto px-8 h-16 flex items-center">
                    <div className="flex items-center select-none cursor-pointer" onClick={() => { setPage(1); setCompanyName(''); }}>
                        <span className="text-2xl font-bold text-[#BD2949]">e</span>
                        <span className="text-2xl font-normal text-[#000000]">ngati</span>
                    </div>
                </div>
            </header>

            {/* Main Content - Centered */}
            <main className="flex-1 flex items-center pt-24 pb-16 relative z-10 w-full">
                <div className="max-w-7xl mx-auto px-8 w-full">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                        {/* LEFT: Wizard Form */}
                        <div className="z-20">
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

                        {/* RIGHT: Phone Studio */}
                        <div className="flex justify-center lg:block origin-top lg:scale-[0.85]">
                            <PhoneStudio
                                companyName={companyName}
                                brandData={brandData}
                            />
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
}

// --- PHONE STUDIO CONTAINER ---

function PhoneStudio({ companyName, brandData }) {
    const [scene, setScene] = useState('google');
    const [cursorState, setCursorState] = useState('hidden'); // 'hidden', 'waiting', 'moving', 'clicked'

    // Automation Sequence
    useEffect(() => {
        if (!companyName.trim()) {
            setScene('google');
            setCursorState('hidden');
            return;
        }

        if (brandData.isLoading) {
            setScene('google');
            setCursorState('hidden');
        }

        if (brandData.isLoaded && scene === 'google') {
            let t1, t2, t3;
            // 1. Wait 2s
            t1 = setTimeout(() => {
                setCursorState('waiting');
                // 2. Move
                t2 = setTimeout(() => {
                    setCursorState('moving');
                    // 3. Click
                    t3 = setTimeout(() => {
                        setCursorState('clicked');
                        setTimeout(() => setScene('rcs'), 300);
                    }, 1200);
                }, 100);
            }, 2000);
            return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
        }
    }, [brandData, companyName, scene]);


    return (
        <div className="relative mx-auto w-full max-w-[380px] perspective-1000">

            {/* Phone Chassis */}
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="relative bg-[#1F1F1F] rounded-[56px] p-3 shadow-2xl ring-1 ring-white/10"
            >
                {/* Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-[#1F1F1F] rounded-b-3xl z-30 pointer-events-none" />

                {/* Screen */}
                <div
                    className="relative bg-white rounded-[44px] overflow-hidden flex flex-col w-full h-full backface-hidden"
                    style={{ aspectRatio: '9/19.5' }}
                >
                    {/* Status Bar */}
                    <div className="h-12 bg-white flex items-center justify-between px-8 text-xs font-medium z-30 flex-shrink-0 select-none relative">
                        <span className="text-[#000000]">9:41</span>
                        <div className="flex items-center gap-1.5">
                            <Wifi className="w-4 h-4 text-[#000000]" />
                            <Battery className="w-5 h-5 text-[#000000]" />
                        </div>
                    </div>

                    {/* Scene Container */}
                    <div className="flex-1 overflow-hidden relative z-10">
                        <AnimatePresence mode="wait">
                            {scene === 'google' && <GoogleSearchScene key="google" companyName={companyName} brandData={brandData} />}
                            {scene === 'rcs' && <RCSChatScene key="rcs" companyName={companyName} brandData={brandData} />}
                        </AnimatePresence>

                        {/* Analyzing State */}
                        <AnimatePresence>
                            {brandData.isLoading && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-white/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center text-center p-6 space-y-4">
                                    <div className="relative">
                                        <div className="w-16 h-16 rounded-full border-4 border-[#F1F3F4] border-t-[#1A73E8] animate-spin" />
                                        <div className="absolute inset-0 flex items-center justify-center"><Sparkles className="w-6 h-6 text-[#1A73E8] animate-pulse" /></div>
                                    </div>
                                    <div><h3 className="text-lg font-semibold text-gray-900">Scanning Brand Assets...</h3><p className="text-sm text-gray-500">Fetching Logo & Context</p></div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Cursor Overlay */}
                        <AnimatePresence>
                            {cursorState !== 'hidden' && <CursorOverlay state={cursorState} />}
                        </AnimatePresence>
                    </div>

                    {/* Glass Reflection */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent pointer-events-none z-40 mix-blend-overlay rounded-[44px]" />

                </div>
            </motion.div>
        </div>
    );
}

function CursorOverlay({ state }) {
    const variants = {
        hidden: { opacity: 0, x: 200, y: 700, scale: 1 },
        waiting: { opacity: 1, x: 200, y: 500, scale: 1 },
        moving: { x: 150, y: 350, scale: 1, transition: { duration: 1, ease: "easeInOut" } },
        clicked: { x: 150, y: 350, scale: 0.8, transition: { duration: 0.1 } }
    };
    return (
        <motion.div variants={variants} initial="hidden" animate={state} exit={{ opacity: 0 }} className="absolute top-0 left-0 z-[60] pointer-events-none">
            <div className="relative"><MousePointer2 className="w-8 h-8 text-black/80 fill-black/20 drop-shadow-xl" strokeWidth={1.5} />{state === 'clicked' && <span className="absolute -top-4 -right-4 w-8 h-8 bg-white/50 rounded-full animate-ping" />}</div>
        </motion.div>
    );
}


// --- SCENES ---

function GoogleSearchScene({ companyName, brandData }) {
    const brandName = companyName || 'Your Brand';
    const brandUrl = brandName.toLowerCase().replace(/[^a-z0-9]/g, '') + '.com';

    return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.4 }} className="h-full bg-white flex flex-col overflow-hidden">
            <div className="p-4 flex-shrink-0">
                <div className="bg-[#F8F9FA] rounded-full px-4 py-2.5 flex items-center gap-3 shadow-sm border border-transparent">
                    <Search className="w-4 h-4 text-[#5F6368]" /><span className="text-sm text-[#5F6368] flex-1 truncate font-normal">{brandName.toLowerCase()}</span><Mic className="w-4 h-4 text-[#1A73E8]" /><Camera className="w-4 h-4 text-[#1A73E8]" />
                </div>
            </div>
            <div className="px-4 pb-2 flex gap-6 border-b border-[#DADCE0] overflow-x-hidden text-sm font-medium text-[#5F6368]">
                <span className="text-[#1A73E8] pb-2 border-b-2 border-[#1A73E8]">All</span><span className="pb-2">Images</span><span className="pb-2">News</span><span className="pb-2">Maps</span>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-4 hide-scrollbar pb-6 relative">
                <div className="mb-3 pb-3 border-b border-[#DADCE0]">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-7 h-7 rounded-full bg-[#F1F3F4] border border-[#DADCE0] flex items-center justify-center overflow-hidden flex-shrink-0 p-0.5">
                            {brandData.logo ? <img src={brandData.logo} alt="logo" className="w-full h-full object-contain" /> : <span className="text-[#1A73E8] text-xs font-bold">{brandName[0]?.toUpperCase() || 'C'}</span>}
                        </div>
                        <div className="flex-1 min-w-0 flex flex-col"><div className="font-normal text-sm text-[#202124] truncate leading-tight">{brandName}</div><div className="text-xs text-[#5F6368] truncate leading-tight">https://www.{brandUrl}</div></div><MoreVertical className="w-5 h-5 text-[#5F6368] flex-shrink-0" />
                    </div>
                    <h2 className="text-xl font-normal text-[#1A73E8] mb-1 cursor-pointer hover:underline leading-snug">{brandName} - Official Site</h2>
                    <div className="text-sm text-[#4D5156] leading-relaxed mb-4 min-h-[40px]">{brandData.description || 'Loading brand description...'}</div>
                    <div className="space-y-0 mb-4 border-t border-[#F1F3F4]">{brandData.sitelinks.map((link, idx) => <ExpandableOption key={idx} text={link} />)}</div>
                    <motion.button whileTap={{ scale: 0.95 }} className="w-full bg-white border border-[#DADCE0] rounded-lg py-3 px-4 flex items-center gap-3 hover:bg-[#F8F9FA] transition-colors shadow-sm mb-4 group relative overflow-hidden">
                        <div className="w-9 h-9 rounded-full bg-[#1A73E8] flex items-center justify-center flex-shrink-0 z-10"><MessageCircle className="w-5 h-5 text-white" /></div>
                        <div className="flex-1 text-left z-10"><div className="text-sm font-medium text-[#202124]">Chat with {brandName}</div><div className="text-xs text-[#5F6368]">On Google Messages</div></div><ChevronRight className="w-5 h-5 text-[#5F6368] z-10" />
                    </motion.button>
                    <div className="pt-3 border-t border-[#DADCE0]">
                        <h3 className="text-lg font-normal text-[#202124] mb-2">Locations</h3>
                        <div className="h-24 bg-gray-100 rounded-lg w-full flex items-center justify-center gap-2"><MapPin className="w-4 h-4 text-[#5F6368]" /><span className="text-[#5F6368] text-xs">View on Map</span></div>
                    </div>
                </div>
            </div>
            <div className="h-14 bg-white border-t border-[#DADCE0] flex items-center justify-around px-4 flex-shrink-0 pb-1">
                <NavIcon icon="home" active /><NavIcon icon="search" /><NavIcon icon="profile" /><NavIcon icon="settings" />
            </div>
        </motion.div>
    );
}

function RCSChatScene({ companyName, brandData }) {
    const brandName = companyName || 'Your Brand';
    const brandInitial = brandName[0]?.toUpperCase() || 'Y';

    return (
        <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.4 }} className="h-full bg-[#F5F7FA] flex flex-col">
            <div className="bg-white border-b border-[#DADCE0] px-4 py-2.5 flex items-center gap-3 flex-shrink-0 shadow-sm z-10">
                <button className="p-1 -ml-1 hover:bg-gray-100 rounded-full"><ChevronLeft className="w-6 h-6 text-[#5F6368]" /></button>
                <div className="w-9 h-9 rounded-full bg-white border border-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-sm p-0.5">
                    {brandData.logo ? <img src={brandData.logo} alt="av" className="w-full h-full object-contain" /> : <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">{brandInitial}</div>}
                </div>
                <div className="flex-1 min-w-0"><div className="flex items-center gap-1.5"><h3 className="font-medium text-[#202124] text-sm truncate">{brandName}</h3><ShieldCheck className="w-3.5 h-3.5 text-[#1A73E8]" fill="#1A73E8" color="white" /></div><p className="text-xs text-[#5F6368] truncate">Verified Business Account</p></div>
                <button className="p-2 hover:bg-gray-100 rounded-full"><MoreVertical className="w-5 h-5 text-[#5F6368]" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-5 bg-[#FFFFFF] pb-20">
                <div className="flex justify-center"><span className="text-[10px] font-medium text-[#5F6368] bg-[#F1F3F4] px-3 py-1 rounded-full">Today</span></div>
                <div className="flex gap-2.5 items-end group">
                    <div className="w-8 h-8 rounded-full bg-white border border-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-sm p-0.5">
                        {brandData.logo ? <img src={brandData.logo} alt="av" className="w-full h-full object-contain" /> : <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs">{brandInitial}</div>}
                    </div>
                    <div className="bg-[#F1F3F4] rounded-2xl rounded-bl-sm p-3 max-w-[78%]"><p className="text-sm text-[#202124] leading-relaxed">Hi there! 👋 Welcome to {brandName}. How can we help you today?</p><span className="text-[10px] text-[#5F6368] mt-1 block opacity-70">Read • 9:42 AM</span></div>
                </div>
                <div className="flex gap-2.5">
                    <div className="w-8 h-8 flex-shrink-0" />
                    <div className="bg-white border border-[#DADCE0] rounded-2xl shadow-sm overflow-hidden max-w-[85%]">
                        <div className="aspect-video bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center"><Sparkles className="w-10 h-10 text-purple-400" /></div>
                        <div className="p-4 space-y-3"><div><h4 className="font-semibold text-[#202124] text-sm mb-1">Special {brandData.industry} Offer 🎉</h4><p className="text-xs text-[#5F6368] leading-relaxed">{brandData.offer}</p></div><div className="flex gap-2 pt-1"><button className="flex-1 bg-[#F1F3F4] text-[#1A73E8] rounded-full py-2 px-3 text-xs font-medium hover:bg-[#E8F0FE] transition-colors">Claim</button><button className="flex-1 border border-[#DADCE0] text-[#1A73E8] rounded-full py-2 px-3 text-xs font-medium hover:bg-[#F8F9FA] transition-colors">Details</button></div></div>
                    </div>
                </div>
            </div>
            <div className="bg-white border-t border-[#DADCE0] p-3 flex items-center gap-2 flex-shrink-0 pb-6">
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors bg-[#F1F3F4]"><Plus className="w-5 h-5 text-[#444746]" /></button><div className="flex-1 bg-[#F1F3F4] rounded-full px-4 py-2.5 text-sm text-[#5F6368] cursor-text">Type a message...</div><button className="p-2 hover:bg-gray-100 rounded-full transition-colors"><Mic className="w-5 h-5 text-[#444746]" /></button>
            </div>
        </motion.div>
    );
}

// --- WIZARD PAGES ---

function Page1({ companyName, setCompanyName, onNext }) {
    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }} className="space-y-8 max-w-lg">
            <div className="h-6"></div>
            <div className="space-y-6">
                <h1 className="text-5xl font-bold text-[#000000] leading-[1.15] tracking-tight">Autonomous Agents for <span className="text-[#BD2949]">RCS</span> Messaging.</h1>
                <p className="text-lg text-[#666666] leading-relaxed">Scale support and sales without increasing headcount. Deploy GenAI agents that resolve complex queries on RCS.</p>
            </div>
            <div className="space-y-4 pt-2">
                <label className="block">
                    <span className="text-sm font-semibold text-[#000000] mb-2 block">Company Name</span>
                    <input type="text" placeholder="e.g SpaceX" className="w-full px-4 py-3.5 rounded-lg border border-[#DDDDDD] text-base text-[#000000] placeholder:text-[#999999] focus:border-[#BD2949] focus:outline-none focus:ring-2 focus:ring-[#BD2949]/20 transition-all bg-white shadow-sm" value={companyName} onChange={(e) => setCompanyName(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && companyName.trim() && onNext()} autoFocus />
                </label>
                <button onClick={onNext} disabled={!companyName.trim()} className="w-full py-4 bg-[#BD2949] text-white rounded-lg font-semibold text-base hover:bg-[#A02340] disabled:bg-[#F1F3F4] disabled:text-[#999999] disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 disabled:hover:translate-y-0 disabled:shadow-none">
                    See your brand live <ArrowRight className="w-5 h-5" />
                </button>
            </div>
            <p className="text-xs text-[#666666]">By submitting, you agree to Engati's Terms of Use. <a href="https://www.engati.ai/termsofuse" className="text-[#BD2949] hover:underline ml-1 font-medium" target="_blank" rel="noreferrer">View terms</a></p>
        </motion.div>
    );
}

// --- GOOGLE SHEETS BACKEND ---
// FUTURE: Replace SCRIPT_URL with Salesforce Web-to-Lead endpoint
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbx7JxrZRuuXwpdNHtozxkvBnXWGeO7M-5i_TRaXJAIDN2FvEIllVodSXmIxIdj__NRW/exec";

function Page2({ companyName, onBack, onSubmit }) {
    const [form, setForm] = useState({ fullName: '', email: '', phone: '', revenue: '', date: '', time: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown on outside click
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = {
            companyName: companyName, // From props
            fullName: form.fullName,
            email: form.email,
            phone: form.phone,
            revenue: form.revenue,
            date: form.date,
            time: form.time
        };

        try {
            await fetch(SCRIPT_URL, {
                method: 'POST',
                // Using 'no-cors' allows us to send data without failing on CORS preflight.
                // However, we won't get a response JSON back (opaque response). This is fine for simple fire-and-forget.
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            // Since we can't read the response in no-cors, assume success if network request completes.
            onSubmit(formData); // Go to Page 3
        } catch (error) {
            console.error("Submission Error:", error);
            alert("Something went wrong submitting your request. Please try again.");
            setIsSubmitting(false);
        }
    };

    return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.4 }} className="space-y-6 max-w-lg">
            <button onClick={onBack} className="flex items-center gap-2 text-[#666666] hover:text-[#000000] transition-colors group">
                <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" /> <span className="text-sm font-medium">Back to edit name</span>
            </button>
            <div className="space-y-2">
                <h2 className="text-4xl font-bold text-[#000000] leading-tight tracking-tight">Get your custom <span className="text-[#BD2949]">RCS</span> audit</h2>
                <p className="text-base text-[#666666] leading-relaxed">See how <span className="font-semibold text-[#000000]">{companyName}</span> can increase engagement.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div><label className="text-sm font-medium text-[#000000] mb-1.5 block">Full Name</label><input type="text" placeholder="Adam" className="w-full px-4 py-3 rounded-lg border border-[#DDDDDD] text-[#000000] focus:border-[#BD2949] focus:outline-none focus:ring-2 focus:ring-[#BD2949]/20 transition-all font-medium" value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} /></div>
                    <div><label className="text-sm font-medium text-[#000000] mb-1.5 block">Work Email</label><input type="email" placeholder="adam@work.com" className="w-full px-4 py-3 rounded-lg border border-[#DDDDDD] text-[#000000] focus:border-[#BD2949] focus:outline-none focus:ring-2 focus:ring-[#BD2949]/20 transition-all font-medium" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
                </div>

                <div><label className="text-sm font-medium text-[#000000] mb-1.5 block">Phone Number</label><input type="tel" placeholder="+91..." className="w-full px-4 py-3 rounded-lg border border-[#DDDDDD] text-[#000000] focus:border-[#BD2949] focus:outline-none focus:ring-2 focus:ring-[#BD2949]/20 transition-all font-medium" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></div>

                {/* CUSTOM SELECT: REVENUE */}
                <CustomSelect
                    label="Annual Revenue"
                    value={form.revenue}
                    options={["< 10 Cr", "10 Cr - 50 Cr", "50 Cr - 100 Cr", "100 Cr - 500 Cr", "500 Cr+"]}
                    onChange={(val) => setForm({ ...form, revenue: val })}
                />

                {/* SCHEDULING GRID - NATIVE PICKERS - FIXED OVERLAYS */}
                <div>
                    <label className="text-sm font-medium text-[#000000] mb-1.5 block">Schedule Audit</label>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="relative group">
                            <div className="w-full px-4 py-3 rounded-lg border border-[#DDDDDD] bg-white text-left flex items-center gap-3 text-[#000000] group-hover:border-[#BD2949] transition-colors overflow-hidden pointer-events-none">
                                <Calendar className="w-5 h-5 text-[#BD2949] flex-shrink-0" />
                                <span className={`text-sm font-medium truncate ${form.date ? 'text-black' : 'text-[#666666]'}`}>
                                    {form.date ? new Date(form.date).toLocaleDateString() : 'Select Date'}
                                </span>
                            </div>
                            <input
                                type="date"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                value={form.date}
                                onChange={(e) => setForm({ ...form, date: e.target.value })}
                                required
                                onClick={(e) => {
                                    try {
                                        e.target.showPicker();
                                    } catch (error) {
                                        // fallback for older browsers
                                    }
                                }}
                            />
                        </div>
                        <div className="relative group">
                            <div className="w-full px-4 py-3 rounded-lg border border-[#DDDDDD] bg-white text-left flex items-center gap-3 text-[#000000] group-hover:border-[#BD2949] transition-colors overflow-hidden pointer-events-none">
                                <Clock className="w-5 h-5 text-[#BD2949] flex-shrink-0" />
                                <span className={`text-sm font-medium truncate ${form.time ? 'text-black' : 'text-[#666666]'}`}>
                                    {form.time || 'Select Time'}
                                </span>
                            </div>
                            <input
                                type="time"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                value={form.time}
                                onChange={(e) => setForm({ ...form, time: e.target.value })}
                                required
                                onClick={(e) => {
                                    try {
                                        e.target.showPicker();
                                    } catch (error) {
                                        // fallback
                                    }
                                }}
                            />
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-[#BD2949] text-white rounded-lg font-bold text-base hover:bg-[#A02340] disabled:bg-[#F1F3F4] disabled:text-[#999999] disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5 mt-4"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Processing Request...
                        </>
                    ) : (
                        "Request Custom Audit"
                    )}
                </button>
            </form>
        </motion.div >
    );
}


function Page3({ companyName, onReset }) {
    return (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8 text-center py-12">
            <div className="flex justify-center"><motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring' }} className="w-24 h-24 rounded-full bg-[#E8F5E9] flex items-center justify-center"><CheckCircle2 className="w-12 h-12 text-[#34A853]" /></motion.div></div>
            <div className="space-y-4"><h2 className="text-4xl font-bold text-[#000000] tracking-tight">Audit Request Received!</h2><p className="text-lg text-[#666666] max-w-md mx-auto leading-relaxed">We've sent a confirmation for <span className="font-semibold text-[#000000]">{companyName}</span>.</p></div>
            <div className="pt-4"><button onClick={onReset} className="text-[#BD2949] font-semibold hover:underline text-base">Start a new preview</button></div>
        </motion.div>
    );
}

function ExpandableOption({ text }) {
    return (
        <div className="py-2.5 border-b border-[#F1F3F4] flex items-center justify-between hover:bg-[#F8F9FA] -mx-4 px-4 cursor-pointer transition-colors group">
            <span className="text-sm text-[#202124] group-hover:text-[#1A73E8]">{text}</span><ChevronRight className="w-4 h-4 text-[#70757A] flex-shrink-0" />
        </div>
    );
}

function NavIcon({ icon, active }) {
    const icons = { home: Home, search: Search, profile: User, settings: Settings };
    const Icon = icons[icon];
    return <div className="flex flex-col items-center gap-1 cursor-pointer"><div className={`p-0.5 rounded-full`}><Icon className="w-6 h-6" style={{ color: active ? '#1A73E8' : '#5F6368' }} /></div></div>;
}

// --- HELPER COMPONENTS ---

function CustomSelect({ label, value, options, onChange }) {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (ref.current && !ref.current.contains(event.target)) setIsOpen(false);
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={ref}>
            <label className="text-sm font-medium text-[#000000] mb-1.5 block">{label}</label>
            <div
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full px-4 py-3 rounded-lg border ${isOpen ? 'border-[#BD2949] ring-2 ring-[#BD2949]/20' : 'border-[#DDDDDD]'} bg-white text-[#000000] flex items-center justify-between cursor-pointer transition-all shadow-sm hover:border-[#BD2949]`}
            >
                <span className={`font-medium ${value ? 'text-black' : 'text-[#999999]'}`}>{value || `Select ${label}`}</span>
                <ChevronDown className={`w-5 h-5 text-[#666666] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.98 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-[#DDDDDD] z-50 overflow-hidden"
                    >
                        {options.map((opt) => (
                            <div
                                key={opt}
                                className={`px-4 py-3 cursor-pointer text-sm font-medium transition-colors ${value === opt ? 'bg-[#BD2949]/5 text-[#BD2949]' : 'text-[#000000] hover:bg-[#F8F9FA]'}`}
                                onClick={() => { onChange(opt); setIsOpen(false); }}
                            >
                                {opt}
                            </div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}



export default AppV2;
