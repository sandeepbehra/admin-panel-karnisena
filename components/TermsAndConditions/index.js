import React from 'react';
import { motion } from 'framer-motion';

const termsData = [
  {
    id: 1,
    title: "Website Use",
    content: "The website is provided for informational, membership, registration, communication, and other legitimate organizational purposes. You agree not to use the website for any unlawful, fraudulent, harmful, or unauthorized purpose."
  },
  {
    id: 2,
    title: "User Information",
    content: "Users are responsible for providing accurate and complete information when submitting forms, registering for activities, becoming members, or making payments through the website."
  },
  {
    id: 3,
    title: "Membership and Registration",
    content: "Memberships, registrations, applications, and participation in activities may be subject to approval and additional terms specified by Karni Sena. Karni Sena reserves the right to accept, reject, suspend, or cancel any membership or registration where permitted under applicable rules and policies."
  },
  {
    id: 4,
    title: "Donations and Payments",
    content: "Where the website provides donation, contribution, registration, or payment facilities, users are responsible for ensuring that the information provided during the transaction is accurate. Payments may be processed through third-party payment service providers and may be subject to their respective terms and conditions."
  },
  {
    id: 5,
    title: "Intellectual Property",
    content: "Unless otherwise stated, the content available on this website, including text, logos, graphics, photographs, videos, documents, and other materials, is owned by or used by Karni Sena with appropriate authorization. Website content may not be copied, reproduced, modified, distributed, or commercially used without prior permission, except where permitted by law."
  },
  {
    id: 6,
    title: "User-Submitted Content",
    content: "If you submit photographs, comments, information, documents, or other content through the website, you are responsible for ensuring that you have the necessary rights and permissions to submit such content. Karni Sena reserves the right to remove content that is unlawful, misleading, offensive, inappropriate, or otherwise inconsistent with applicable policies or law."
  },
  {
    id: 7,
    title: "Third-Party Links",
    content: "The website may contain links to third-party websites or services. Such links are provided for convenience, and Karni Sena does not control or guarantee the accuracy, availability, or policies of third-party websites."
  },
  {
    id: 8,
    title: "Disclaimer",
    content: "Karni Sena makes reasonable efforts to provide accurate and up-to-date information on the website. However, information may occasionally contain errors, omissions, or inaccuracies."
  },
  {
    id: 9,
    title: "Limitation of Liability",
    content: "To the maximum extent permitted by applicable law, Karni Sena shall not be liable for any loss or damage arising from the use of, or inability to use, this website or its content."
  },
  {
    id: 10,
    title: "Changes to the Website and Terms",
    content: "Karni Sena may modify, update, suspend, or discontinue any part of the website and may revise these Terms and Conditions from time to time. Updated terms will be published on this page. Continued use of the website after changes are published constitutes acceptance of the revised terms."
  },
  {
    id: 11,
    title: "Governing Law",
    content: "These Terms and Conditions shall be governed by and interpreted in accordance with the applicable laws of India."
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

export default function TermsAndConditions() {
  return (
    <main className="min-h-screen bg-gray-50 py-16 px-6 sm:px-12 lg:px-24 text-gray-800 selection:bg-gray-200">
      <motion.div 
        className="max-w-4xl mx-auto bg-white p-8 sm:p-12 lg:p-16 rounded-2xl shadow-sm border border-gray-100"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants} className="mb-12 border-b border-gray-200 pb-8">
          <h1 className="text-4xl font-light tracking-tight text-gray-900 mb-4">
            Terms and Conditions
          </h1>
          <p className="text-lg text-gray-500 leading-relaxed">
            Welcome to the official website of Karni Sena. By accessing or using this website, you agree to comply with these Terms and Conditions.
          </p>
        </motion.div>

        <section className="space-y-10">
          {termsData.map((term) => (
            <motion.div key={term.id} variants={itemVariants}>
              <h2 className="text-xl font-medium text-gray-900 mb-3 flex items-baseline">
                <span className="text-gray-400 text-sm font-semibold mr-3">{term.id}.</span>
                {term.title}
              </h2>
              <p className="text-gray-600 leading-relaxed ml-7">
                {term.content}
              </p>
            </motion.div>
          ))}

          {/* Contact Section */}
          <motion.div variants={itemVariants} className="mt-12 pt-8 border-t border-gray-200">
            <h2 className="text-xl font-medium text-gray-900 mb-4 flex items-baseline">
              <span className="text-gray-400 text-sm font-semibold mr-3">12.</span>
              Contact
            </h2>
            <p className="text-gray-600 leading-relaxed ml-7 mb-4">
              For questions regarding these Terms and Conditions, please contact Karni Sena through the official contact details provided on the website.
            </p>
            <div className="ml-7 bg-gray-50 p-6 rounded-lg inline-block border border-gray-100">
              <div className="flex items-center mb-3">
                <span className="font-medium text-gray-900 w-20">Email:</span>
                <a href="mailto:karnisena27@gmail.com" className="text-blue-600 hover:text-blue-800 transition-colors">
                  karnisena27@gmail.com
                </a>
              </div>
              <div className="flex items-center">
                <span className="font-medium text-gray-900 w-20">Phone:</span>
                <a href="tel:+918010118118" className="text-gray-600 hover:text-gray-900 transition-colors">
                  +91- 8010118118
                </a>
              </div>
            </div>
          </motion.div>
        </section>
      </motion.div>
    </main>
  );
}