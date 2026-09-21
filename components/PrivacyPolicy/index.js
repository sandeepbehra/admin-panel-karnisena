"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useLocale } from "next-intl";
import { Mail, Phone, ShieldCheck, ArrowLeft } from "lucide-react";

// =====================================================================
// BILINGUAL PRIVACY POLICY DATA
// =====================================================================
const policyData = {
  header: {
    badge: { en: "Legal & Compliance", hin: "कानूनी और अनुपालन" },
    title: { en: "Privacy Policy", hin: "गोपनीयता नीति" },
    lastUpdated: { en: "Last Updated: September 2026", hin: "अंतिम अपडेट: सितंबर 2026" }
  },
  intro: {
    en: "Karni Sena is committed to protecting the privacy of visitors, members, supporters, volunteers, and other users of its website.",
    hin: "करणी सेना अपने आगंतुकों, सदस्यों, समर्थकों, स्वयंसेवकों और अपनी वेबसाइट के अन्य उपयोगकर्ताओं की गोपनीयता की रक्षा के लिए प्रतिबद्ध है।"
  },
  sections: [
    {
      id: "information-we-collect",
      title: { en: "Information We Collect", hin: "हम जो जानकारी एकत्र करते हैं" },
      content: {
        en: [
          "We may collect information that you voluntarily provide to us, including your name, mobile number, email address, address, membership details, registration information, and other information submitted through our website.",
          "Where online payments are available, payment transactions may be processed through third-party payment service providers."
        ],
        hin: [
          "हम वह जानकारी एकत्र कर सकते हैं जो आप स्वेच्छा से हमें प्रदान करते हैं, जिसमें आपका नाम, मोबाइल नंबर, ईमेल पता, पता, सदस्यता विवरण, पंजीकरण जानकारी और हमारी वेबसाइट के माध्यम से प्रस्तुत अन्य जानकारी शामिल है।",
          "जहां ऑनलाइन भुगतान उपलब्ध हैं, भुगतान लेनदेन तीसरे पक्ष के भुगतान सेवा प्रदाताओं के माध्यम से संसाधित किए जा सकते हैं।"
        ]
      }
    },
    {
      id: "how-we-use",
      title: { en: "How We Use Your Information", hin: "हम आपकी जानकारी का उपयोग कैसे करते हैं" },
      introText: {
        en: "The information we collect may be used to:",
        hin: "हमारे द्वारा एकत्र की गई जानकारी का उपयोग निम्न के लिए किया जा सकता है:"
      },
      list: {
        en: [
          "Process membership and registration requests",
          "Respond to enquiries and communications",
          "Provide information about Karni Sena activities and events",
          "Process donations or other payments",
          "Improve our website and services",
          "Maintain website security",
          "Comply with applicable legal requirements"
        ],
        hin: [
          "सदस्यता और पंजीकरण अनुरोधों को संसाधित करना",
          "पूछताछ और संचार का जवाब देना",
          "करणी सेना की गतिविधियों और कार्यक्रमों के बारे में जानकारी प्रदान करना",
          "दान या अन्य भुगतानों को संसाधित करना",
          "हमारी वेबसाइट और सेवाओं में सुधार करना",
          "वेबसाइट सुरक्षा बनाए रखना",
          "लागू कानूनी आवश्यकताओं का पालन करना"
        ]
      }
    },
    {
      id: "protection-of-information",
      title: { en: "Protection of Information", hin: "जानकारी की सुरक्षा" },
      content: {
        en: [
          "Karni Sena takes reasonable measures to protect personal information from unauthorized access, misuse, alteration, or disclosure.",
          "However, no method of transmitting or storing information electronically can be guaranteed to be completely secure."
        ],
        hin: [
          "करणी सेना व्यक्तिगत जानकारी को अनधिकृत पहुंच, दुरुपयोग, परिवर्तन या प्रकटीकरण से बचाने के लिए उचित उपाय करती है।",
          "हालाँकि, इलेक्ट्रॉनिक रूप से जानकारी प्रसारित करने या संग्रहीत करने की किसी भी विधि के पूरी तरह से सुरक्षित होने की गारंटी नहीं दी जा सकती है।"
        ]
      }
    },
    {
      id: "sharing-of-information",
      title: { en: "Sharing of Information", hin: "जानकारी साझा करना" },
      content: {
        en: [
          "We do not sell or rent your personal information. Information may be shared with service providers or other parties where necessary to operate the website, process transactions, provide requested services, or comply with applicable law."
        ],
        hin: [
          "हम आपकी व्यक्तिगत जानकारी को बेचते या किराए पर नहीं देते हैं। वेबसाइट संचालित करने, लेनदेन संसाधित करने, अनुरोधित सेवाएं प्रदान करने, या लागू कानून का पालन करने के लिए आवश्यक होने पर सेवा प्रदाताओं या अन्य पक्षों के साथ जानकारी साझा की जा सकती है।"
        ]
      }
    },
    {
      id: "cookies",
      title: { en: "Cookies", hin: "कुकीज़" },
      content: {
        en: [
          "Our website may use cookies and similar technologies to improve website functionality, analyze usage, and provide a better user experience."
        ],
        hin: [
          "हमारी वेबसाइट कार्यक्षमता में सुधार करने, उपयोग का विश्लेषण करने और बेहतर उपयोगकर्ता अनुभव प्रदान करने के लिए कुकीज़ और समान तकनीकों का उपयोग कर सकती है।"
        ]
      }
    },
    {
      id: "third-party-websites",
      title: { en: "Third-Party Websites", hin: "तृतीय-पक्ष वेबसाइटें" },
      content: {
        en: [
          "Our website may contain links to third-party websites and social media platforms. Karni Sena is not responsible for the privacy policies or practices of those external websites."
        ],
        hin: [
          "हमारी वेबसाइट में तृतीय-पक्ष वेबसाइटों और सोशल मीडिया प्लेटफार्मों के लिंक हो सकते हैं। करणी सेना उन बाहरी वेबसाइटों की गोपनीयता नीतियों या प्रथाओं के लिए ज़िम्मेदार नहीं है।"
        ]
      }
    },
    {
      id: "your-privacy-choices",
      title: { en: "Your Privacy Choices", hin: "आपके गोपनीयता विकल्प" },
      content: {
        en: [
          "You may contact us regarding your personal information, including requests for correction or deletion, subject to applicable law and legitimate organizational requirements."
        ],
        hin: [
          "लागू कानून और वैध संगठनात्मक आवश्यकताओं के अधीन, आप सुधार या हटाने के अनुरोधों सहित अपनी व्यक्तिगत जानकारी के संबंध में हमसे संपर्क कर सकते हैं।"
        ]
      }
    },
    {
      id: "changes-to-this-policy",
      title: { en: "Changes to This Policy", hin: "इस नीति में परिवर्तन" },
      content: {
        en: [
          "Karni Sena may update this Privacy Policy from time to time. Any changes will be published on this page with an updated effective date."
        ],
        hin: [
          "करणी सेना समय-समय पर इस गोपनीयता नीति को अपडेट कर सकती है। कोई भी परिवर्तन इस पृष्ठ पर एक अद्यतन प्रभावी तिथि के साथ प्रकाशित किया जाएगा।"
        ]
      }
    }
  ],
  contact: {
    title: { en: "Contact Us", hin: "हमसे संपर्क करें" },
    email: "karnisena27@gmail.com",
    phone: "+91- 8010118118"
  }
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
};

export default function PrivacyPolicy() {
  const locale = useLocale();

  const t = (dataObj) => {
    if (!dataObj) return "";
    return locale === "hi" ? dataObj.hin : dataObj.en;
  };

  return (
    <main className="w-full min-h-screen bg-[#FBFBF9] selection:bg-karni-saffron selection:text-white py-24 relative overflow-hidden flex flex-col items-center">
      
      {/* ========================================================= */}
      {/* BACKGROUND SHADERS                                        */}
      {/* ========================================================= */}
      <motion.div 
        animate={{ scale: [1, 1.05, 1], opacity: [0.15, 0.25, 0.15] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="fixed top-[-10%] right-[-5%] w-[40vw] h-[40vw] rounded-full bg-gradient-to-bl from-karni-saffron/20 to-transparent blur-[120px] pointer-events-none"
      />
      <div className="fixed top-[20%] left-[-10%] w-[500px] h-[500px] bg-karni-red/5 rounded-full blur-[150px] pointer-events-none" />

      {/* ========================================================= */}
      {/* HEADER SECTION                                            */}
      {/* ========================================================= */}
      <div className="w-full max-w-4xl px-6 lg:px-12 mb-10 relative z-10 flex flex-col items-center text-center">
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="flex items-center justify-center gap-2 mb-4 bg-white/60 backdrop-blur-md px-4 py-1.5 rounded-full border border-karni-saffron/20 shadow-sm">
          <ShieldCheck size={16} className="text-karni-saffron" strokeWidth={2} />
          <span className="font-sans text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-karni-saffron">
            {t(policyData.header.badge)}
          </span>
        </motion.div>

        <motion.h1 initial="hidden" animate="visible" variants={fadeUp} className="font-serif text-4xl sm:text-5xl text-foreground leading-[1.1] tracking-tight mb-4">
          {t(policyData.header.title)}
        </motion.h1>

        <motion.p initial="hidden" animate="visible" variants={fadeUp} className="font-sans text-xs sm:text-sm font-bold uppercase tracking-widest text-neutral-400">
          {t(policyData.header.lastUpdated)}
        </motion.p>
      </div>

      {/* ========================================================= */}
      {/* COMPACT DOCUMENT CONTAINER                                */}
      {/* ========================================================= */}
      <motion.div 
        initial="hidden" animate="visible" variants={fadeUp}
        className="w-full max-w-4xl px-4 sm:px-6 relative z-10"
      >
        <div className="bg-white rounded-[2rem] border border-black/5 shadow-[0_15px_40px_rgba(0,0,0,0.04)] overflow-hidden">
          
          {/* Intro Block */}
          <div className="p-8 sm:p-12 bg-gradient-to-br from-karni-saffron/5 to-transparent border-b border-black/5">
            <p className="font-serif text-lg sm:text-xl text-foreground leading-relaxed text-center sm:text-left">
              {t(policyData.intro)}
            </p>
          </div>

          {/* Policy Sections */}
          <div className="p-8 sm:p-12 flex flex-col gap-10">
            {policyData.sections.map((section, idx) => (
              <section key={section.id} className="flex flex-col gap-4">
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-serif text-2xl text-karni-saffron/30 font-bold select-none">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <h2 className="font-serif text-xl sm:text-2xl text-foreground">
                    {t(section.title)}
                  </h2>
                </div>
                
                <div className="pl-0 sm:pl-10 flex flex-col gap-3">
                  {/* Standard Paragraphs */}
                  {section.content && t(section.content).map((paragraph, pIdx) => (
                    <p key={pIdx} className="font-sans text-sm sm:text-base text-neutral-600 leading-relaxed">
                      {paragraph}
                    </p>
                  ))}

                  {/* Render Lists */}
                  {section.list && (
                    <div className="flex flex-col gap-3">
                      <p className="font-sans text-sm sm:text-base text-neutral-600 leading-relaxed font-semibold">
                        {t(section.introText)}
                      </p>
                      <ul className="flex flex-col gap-2 pl-2">
                        {t(section.list).map((listItem, lIdx) => (
                          <li key={lIdx} className="flex items-start gap-3">
                            <span className="w-1.5 h-1.5 rounded-full bg-karni-red shrink-0 mt-2" />
                            <span className="font-sans text-sm sm:text-base text-neutral-600 leading-relaxed">
                              {listItem}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </section>
            ))}
          </div>

          {/* Contact Footer attached to Document */}
          <div className="p-8 sm:p-12 bg-[#FBFBF9] border-t border-black/5 flex flex-col sm:flex-row items-center justify-between gap-6">
            <h3 className="font-serif text-xl text-foreground">
              {t(policyData.contact.title)}
            </h3>
            
            <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
              <a 
                href={`mailto:${policyData.contact.email}`}
                className="flex items-center gap-2 text-neutral-600 hover:text-karni-saffron transition-colors duration-300 group"
              >
                <Mail size={16} className="text-karni-saffron" />
                <span className="font-sans text-xs sm:text-sm font-semibold">{policyData.contact.email}</span>
              </a>

              <a 
                href={`tel:${policyData.contact.phone.replace(/[^0-9+]/g, '')}`}
                className="flex items-center gap-2 text-neutral-600 hover:text-karni-saffron transition-colors duration-300 group"
              >
                <Phone size={16} className="text-karni-saffron" />
                <span className="font-sans text-xs sm:text-sm font-semibold">{policyData.contact.phone}</span>
              </a>
            </div>
          </div>

        </div>
      </motion.div>

      {/* ========================================================= */}
      {/* BOTTOM NAVIGATION ACTION                                  */}
      {/* ========================================================= */}
      <motion.div 
        initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
        className="mt-16 relative z-10"
      >
        <Link 
          href="/" 
          className="flex items-center gap-3 px-8 py-4 bg-white text-foreground border border-black/10 rounded-full font-sans text-xs font-bold uppercase tracking-widest hover:border-karni-saffron hover:text-karni-saffron shadow-sm hover:shadow-md transition-all duration-300 group"
        >
          <ArrowLeft size={16} strokeWidth={2.5} className="group-hover:-translate-x-1 transition-transform duration-300" />
          {locale === "hi" ? "होम पर वापस जाएँ" : "Back to Home"}
        </Link>
      </motion.div>

    </main>
  );
}