"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa";
import { X } from "lucide-react";
import { useLocale } from "next-intl";

// =====================================================================
// BILINGUAL TOOLTIP DATA
// =====================================================================
const contentData = {
  tooltipTitle: {
    en: "Have questions?",
    hin: "कोई प्रश्न है?"
  },
  tooltipDesc: {
    en: "Chat directly with our central helpdesk on WhatsApp.",
    hin: "व्हाट्सएप पर हमारे केंद्रीय हेल्पडेस्क से सीधे चैट करें।"
  }
};

export default function WhatsAppWidget() {
  const [showTooltip, setShowTooltip] = useState(false);
  const locale = useLocale(); // If you want to customize the pre-filled message by language

  // Helper function to safely grab the correct language string
  const t = (dataObj) => {
    if (!dataObj) return "";
    return locale === "hi" ? dataObj.hin : dataObj.en;
  };

  // =====================================================================
  // CONFIGURATION
  // =====================================================================
  const phoneNumber = "918010118118"; 
  
  // Pre-filled message when they open WhatsApp
  const defaultMessage = locale === "hi" 
    ? "जय भवानी! मैं करणी सेना की सदस्यता और कार्यों के बारे में अधिक जानकारी चाहता/चाहती हूँ।" 
    : "Jai Bhavani! I would like to know more about Karni Sena initiatives and membership.";
    
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(defaultMessage)}`;

  // Auto-show the tooltip after 4 seconds to grab attention smoothly
  useEffect(() => {
    const timer = setTimeout(() => setShowTooltip(true), 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 lg:bottom-10 lg:right-10 z-[100] flex flex-col items-end gap-4 pointer-events-none">
      
      {/* ========================================================= */}
      {/* 1. GLASSMORPHIC TOOLTIP BUBBLE                            */}
      {/* ========================================================= */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9, transition: { duration: 0.2 } }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="pointer-events-auto relative bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.12)] border border-black/5 flex items-start gap-3 max-w-[240px]"
          >
            {/* Close Button */}
            <button 
              onClick={() => setShowTooltip(false)}
              className="absolute -top-2 -right-2 bg-white border border-black/5 text-neutral-400 hover:text-karni-red rounded-full p-1 shadow-sm transition-colors duration-300"
            >
              <X size={12} strokeWidth={3} />
            </button>

            <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center shrink-0">
              <FaWhatsapp size={18} className="text-[#25D366]" />
            </div>
            
            <div className="flex flex-col pt-0.5">
              <span className="font-sans text-[11px] font-bold uppercase tracking-widest text-foreground mb-1">
                {t(contentData.tooltipTitle)}
              </span>
              <span className="font-sans text-xs text-neutral-500 leading-snug">
                {t(contentData.tooltipDesc)}
              </span>
            </div>

            {/* Bubble Tail */}
            <div className="absolute -bottom-2 right-6 w-4 h-4 bg-white border-b border-r border-black/5 transform rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================= */}
      {/* 2. THE FLOATING ACTION BUTTON (FAB)                       */}
      {/* ========================================================= */}
      <div className="pointer-events-auto relative">
        {/* Continuous soft glowing pulse effect */}
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0, 0.4] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 bg-[#25D366] rounded-full blur-md"
        />

        {/* The Actual Button */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={() => setShowTooltip(true)}
          className="relative flex items-center justify-center w-14 h-14 lg:w-16 lg:h-16 bg-[#25D366] text-white rounded-full shadow-[0_10px_30px_rgba(37,211,102,0.4)] hover:shadow-[0_15px_40px_rgba(37,211,102,0.6)] hover:-translate-y-1 transition-all duration-300 group"
          aria-label="Chat on WhatsApp"
        >
          <FaWhatsapp size={28} className="lg:w-8 lg:h-8 transform group-hover:scale-110 transition-transform duration-300" />
        </a>
      </div>

    </div>
  );
}