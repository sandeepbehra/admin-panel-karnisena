"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useLocale } from "next-intl";
import { ArrowRight, MapPin, Mail, Phone, ArrowUpRight } from "lucide-react";
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";
import MembershipCTA from "@/components/MembershipCTA"; // Imported the Membership CTA

// =====================================================================
// BILINGUAL DATA DICTIONARY
// =====================================================================
const contentData = {
  ctaTitle1: { en: "Stand for ", hin: "खड़े हों " },
  ctaHighlight: { en: "Heritage", hin: "विरासत" },
  ctaTitle2: { en: " & Truth.", hin: " और सत्य के लिए ।" },
  ctaDesc: { 
    en: "Join thousands of youth and community leaders working on the ground to preserve our roots, protect our history, and uplift the underprivileged.", 
    hin: "हमारी जड़ों को संरक्षित करने, हमारे इतिहास की रक्षा करने और वंचितों के उत्थान के लिए जमीनी स्तर पर काम कर रहे हजारों युवाओं और सामुदायिक नेताओं से जुड़ें।" 
  },
  btnText: { en: "Become a Member", hin: "सदस्य बनें" },
  bioDesc: {
    en: "A nationwide socio-cultural movement committed to historical integrity, cultural pride, social justice, and grassroots community welfare under the guiding principle of ",
    hin: "ऐतिहासिक अखंडता, सांस्कृतिक गौरव, सामाजिक न्याय और जमीनी स्तर पर सामुदायिक कल्याण के लिए प्रतिबद्ध एक राष्ट्रव्यापी सामाजिक-सांस्कृतिक आंदोलन, जिसका मार्गदर्शक सिद्धांत है "
  },
  bioHighlight: { en: "Nation First", hin: "राष्ट्र प्रथम" },
  orgTitle: { en: "Organization", hin: "संगठन" },
  eventsTitle: { en: "Key Events", hin: "प्रमुख कार्यक्रम" },
  contactTitle: { en: "Contact", hin: "संपर्क" },
  address: { en: "C-1002, ESSAL TOWER, PILOT COURT, GURGAON", hin: "सी-1002, एस्सल टॉवर, पायलट कोर्ट, गुड़गांव" },
  copyright: { en: "Karni Sena. All Rights Reserved.", hin: "करणी सेना। सर्वाधिकार सुरक्षित।" },
  cancellation: { en: "Cancellation & Refund Policy", hin: "रद्दीकरण और धनवापसी नीति" },
  privacy: { en: "Privacy Policy", hin: "गोपनीयता नीति" },
  terms: { en: "Terms of Service", hin: "सेवा की शर्तें" }
};

const socialLinks = [
  { icon: FaInstagram, href: "https://www.instagram.com/karnisena1/", name: "Instagram" },
  { icon: FaFacebookF, href: "https://www.facebook.com/mykarnisena/", name: "Facebook" },
  { icon: FaYoutube, href: "https://www.youtube.com/@KarniSenaOfficial", name: "YouTube" },
  { icon: FaTwitter, href: "https://x.com/mykarnisena", name: "Twitter" }
];

const quickLinks = [
  { name: { en: "Home", hin: "होम" }, href: "/" },
  { name: { en: "About Us", hin: "हमारे बारे में" }, href: "/about-us" },
  { name: { en: "Events", hin: "कार्यक्रम" }, href: "/events" },
  // Flagged the Membership link so we can render the CTA instead
  { name: { en: "Membership", hin: "सदस्यता" }, href: "/join-us", isMembershipCTA: true },
];

const keyEvents = [
  {
    name: { en: "National Heritage Summit", hin: "राष्ट्रीय विरासत शिखर सम्मेलन" },
    href: "/events/national-heritage-summit",
    category: { en: "Annual Convention • Jaipur", hin: "वार्षिक अधिवेशन • जयपुर" },
  },
  {
    name: { en: "Youth Empowerment Drive", hin: "युवा सशक्तिकरण अभियान" },
    href: "/events/youth-empowerment-drive",
    category: { en: "Scholarships • Udaipur", hin: "छात्रवृत्ति • उदयपुर" },
  },
  {
    name: { en: "Swachh Bharat Abhiyan", hin: "स्वच्छ भारत अभियान" },
    href: "/events/swachh-bharat-abhiyan",
    category: { en: "Heritage Cleanup • Jodhpur", hin: "विरासत सफाई • जोधपुर" },
  },
];

export default function Footer() {
  const locale = useLocale();
  const currentYear = new Date().getFullYear();

  // Helper function to resolve language safely
  const t = (dataObj) => {
    if (!dataObj) return "";
    const key = locale === "hi" ? "hin" : "en";
    return dataObj[key] || dataObj.en || "";
  };

  return (
    <footer className="w-full flex flex-col font-sans">
      {/* ========================================================= */}
      {/* 1. ELITE PRE-FOOTER CTA (Saffron & Red Gradient)            */}
      {/* ========================================================= */}
      <div className="relative w-full bg-gradient-to-r from-karni-red to-karni-saffron overflow-hidden py-16">
        {/* Subtle texture/pattern overlay */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.15] mix-blend-overlay pointer-events-none" />
        
        <div className="relative max-w-7xl mx-auto px-6 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-10 text-center md:text-left z-10">
          <div className="max-w-2xl">
            <h3 className="font-serif text-4xl sm:text-5xl text-white mb-4 leading-tight drop-shadow-sm">
              {t(contentData.ctaTitle1)} 
              <span className="italic font-light">{t(contentData.ctaHighlight)}</span> 
              {t(contentData.ctaTitle2)}
            </h3>
            <p className="font-sans text-sm sm:text-base text-white/90 leading-relaxed font-medium">
              {t(contentData.ctaDesc)}
            </p>
          </div>
          
          {/* Main Pre-Footer MembershipCTA */}
          <MembershipCTA 
            className="shrink-0 flex items-center justify-center gap-4 px-10 py-5 bg-white text-karni-red font-sans font-bold text-xs uppercase tracking-[0.2em] rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.2)] hover:shadow-[0_15px_50px_rgba(0,0,0,0.3)] hover:bg-[#0a0a0a] hover:text-white hover:-translate-y-1 transition-all duration-500 group"
          >
            {t(contentData.btnText)}
            <ArrowRight size={18} strokeWidth={2.5} className="group-hover:translate-x-1 transition-transform duration-300" />
          </MembershipCTA>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. MAIN FOOTER GRID (Deep Dark Theme)                       */}
      {/* ========================================================= */}
      <div className="w-full bg-[#0a0a0a] pt-20 pb-16 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 lg:gap-12">
          
          {/* Column 1: Brand & Bio (Spans 4 cols) */}
          <div className="lg:col-span-4 flex flex-col">
            <Link href="/" className="relative w-48 h-16 mb-8 inline-block group">
              {/* Using brightness-0 invert to make the logo pure white for the dark background */}
              <Image 
                src="/logo.png" 
                alt="Karni Sena Logo" 
                fill 
                className="object-contain object-left" 
              />
            </Link>
            <p className="font-sans text-sm text-neutral-400 leading-relaxed mb-10 max-w-sm">
              {t(contentData.bioDesc)}
              <span className="text-white font-bold">{t(contentData.bioHighlight)}</span>.
            </p>
            
            {/* Elite Social Links */}
            <div className="flex items-center gap-4">
              {socialLinks.map((social, idx) => (
                <a 
                  key={idx} 
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className="w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-karni-saffron hover:border-karni-saffron hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(250,158,25,0.2)] transition-all duration-300 group"
                >
                  <social.icon size={16} className="group-hover:scale-110 transition-transform duration-300" />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links (Spans 2 cols) */}
          <div className="lg:col-span-2 lg:col-start-6 flex flex-col">
            <h4 className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-white mb-8 flex items-center gap-3">
              <span className="w-3 h-[2px] bg-karni-saffron" />
              {t(contentData.orgTitle)}
            </h4>
            <ul className="flex flex-col gap-5">
              {quickLinks.map((link, idx) => (
                <li key={idx}>
                  {link.isMembershipCTA ? (
                    <MembershipCTA 
                      className="font-sans text-sm text-neutral-400 hover:text-white hover:pl-2 transition-all duration-300 flex items-center group w-full text-left"
                    >
                      {t(link.name)}
                    </MembershipCTA>
                  ) : (
                    <Link 
                      href={link.href}
                      className="font-sans text-sm text-neutral-400 hover:text-white hover:pl-2 transition-all duration-300 flex items-center group"
                    >
                      {t(link.name)}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Key Events */}
          <div className="lg:col-span-3 flex flex-col">
            <h4 className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-white mb-8 flex items-center gap-3">
              <span className="w-3 h-[2px] bg-karni-red" />
              {t(contentData.eventsTitle)}
            </h4>
            <ul className="flex flex-col gap-6">
              {keyEvents.map((event, idx) => (
                <li key={idx}>
                  <Link href={event.href} className="group flex flex-col gap-1.5">
                    <span className="font-sans text-sm text-neutral-500 group-hover:text-karni-saffron transition-colors duration-300 flex items-center justify-between w-full pr-4">
                      {t(event.name)}
                      <ArrowUpRight
                        size={14}
                        className="opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all duration-300 text-karni-saffron"
                      />
                    </span>
                    <span className="font-sans text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-400">
                      {t(event.category)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact Info (Spans 2 cols) */}
          <div className="lg:col-span-2 flex flex-col">
            <h4 className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-white mb-8 flex items-center gap-3">
              <span className="w-3 h-[2px] bg-white/20" />
              {t(contentData.contactTitle)}
            </h4>
            <ul className="flex flex-col gap-6">
              <li className="flex items-start gap-4 text-neutral-400 group">
                <MapPin size={18} className="shrink-0 mt-0.5 text-white/30 group-hover:text-karni-saffron transition-colors duration-300" />
                <span className="font-sans text-sm leading-relaxed group-hover:text-white transition-colors duration-300">
                  {t(contentData.address)}
                </span>
              </li>
              <li className="flex items-center gap-4 text-neutral-400 group">
                <Mail size={18} className="shrink-0 text-white/30 group-hover:text-karni-saffron transition-colors duration-300" />
                <a href="mailto:karnisena27@gmail.com" className="font-sans text-sm hover:text-white transition-colors duration-300">
                  karnisena27@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-4 text-neutral-400 group">
                <Phone size={18} className="shrink-0 text-white/30 group-hover:text-karni-saffron transition-colors duration-300" />
                <a href="tel:+918010118118" className="font-sans text-sm hover:text-white transition-colors duration-300">
                  +91 8010118118
                </a>
              </li>
            </ul>
          </div>

        </div>
      </div>
       
      {/* ========================================================= */}
      {/* 3. BOTTOM COPYRIGHT BAR                                     */}
      {/* ========================================================= */}
      <div className="w-full bg-[#050505]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-sans text-[10px] font-bold text-neutral-600 uppercase tracking-widest text-center md:text-left">
            &copy; {currentYear} {t(contentData.copyright)}
          </p>
          <div className="flex items-center gap-8 font-sans text-[10px] font-bold text-neutral-600 uppercase tracking-widest">
            <Link href="/cancellation-policy" className="hover:text-karni-saffron transition-colors duration-300">
              {t(contentData.cancellation)}
            </Link>
            <Link href="/privacy-policy" className="hover:text-karni-saffron transition-colors duration-300">
              {t(contentData.privacy)}
            </Link>
            <Link href="/terms-and-conditions" className="hover:text-karni-saffron transition-colors duration-300">
              {t(contentData.terms)}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}