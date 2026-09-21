"use client";
import React, { useState } from "react";
import SigninPage from "../SignInPage";


const LandingPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(""); // e.g., "join", "event_register"

  const handleOpenModal = (type = "join") => {
    setModalType(type);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen w-full bg-white text-[#4A4A4A] relative selection:bg-[#fa9e19] selection:text-white overflow-hidden md:overflow-visible">
      {/* <Navbar onOpenModal={() => handleOpenModal("join")} /> */}

      <main className="flex flex-col w-full">
        {/* B. Mission & Objectives */}
        {/* A light off-white section to break up the page flow */}
        <section id="mission" className="relative">
          {/* <MissionVision /> */}
        </section>
        <section>
         <SigninPage/>
         </section>

        <section id="about" className="relative">
          {/* <AboutOrganization /> */}
        </section>
      </main>
    </div>
  );
};

export default LandingPage;
