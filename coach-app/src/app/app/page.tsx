"use client";

import React, { useState } from "react";
import Header from "@/components/layout/Header";
import Navigation, { TabType } from "@/components/layout/Navigation";
import CoachTab from "@/components/tabs/CoachTab";
import AffirmationsTab from "@/components/tabs/AffirmationsTab";
import GoalsTab from "@/components/tabs/GoalsTab";
import GratitudeTab from "@/components/tabs/GratitudeTab";
import VisualizeTab from "@/components/tabs/VisualizeTab";
import * as fpixel from "@/utils/fpixel";

export default function AppHome() {
  const [activeTab, setActiveTab] = useState<TabType>("coach");

  React.useEffect(() => {
    const handleTabChange = (event: Event) => {
      const customEvent = event as CustomEvent<TabType>;
      if (customEvent.detail) {
        setActiveTab(customEvent.detail);
      }
    };
    window.addEventListener("change-tab", handleTabChange);
    return () => window.removeEventListener("change-tab", handleTabChange);
  }, []);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("checkout") === "success") {
        // Track Purchase and Subscribe events for Meta Pixel
        fpixel.event("Purchase", {
          value: 5.99,
          currency: "USD",
          content_name: "Plan Premium Mensual",
          content_category: "Suscripción"
        });
        fpixel.event("Subscribe", {
          value: 5.99,
          currency: "USD",
          content_name: "Plan Premium Mensual",
          content_category: "Suscripción"
        });

        // Clean URL after short delay to prevent double tracking on page refreshes while ensuring network transmission
        setTimeout(() => {
          const cleanUrl = window.location.pathname + window.location.hash;
          window.history.replaceState(null, "", cleanUrl);
        }, 2000);
      }
    }
  }, []);

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden bg-background transition-colors duration-300 sm:relative sm:min-h-screen sm:flex sm:items-center sm:justify-center sm:py-8 sm:px-4">
      <div className="w-full h-full max-w-[680px] sm:h-[780px] bg-bg-primary sm:border border-border-secondary sm:rounded-3xl sm:shadow-2xl overflow-hidden flex flex-col relative border-border-primary/80 transition-colors duration-300">
        <Header />
        
        {/* Contenedor principal del contenido de las pestañas */}
        <main className="flex-1 relative overflow-hidden bg-bg-primary">
          <div className={`absolute inset-0 transition-all duration-200 ${activeTab === "coach" ? "opacity-100 pointer-events-auto z-10 scale-100" : "opacity-0 pointer-events-none z-0 scale-[0.98]"}`}>
            <CoachTab />
          </div>
          <div className={`absolute inset-0 transition-all duration-200 ${activeTab === "afirmaciones" ? "opacity-100 pointer-events-auto z-10 scale-100" : "opacity-0 pointer-events-none z-0 scale-[0.98]"}`}>
            <AffirmationsTab />
          </div>
          <div className={`absolute inset-0 transition-all duration-200 ${activeTab === "metas" ? "opacity-100 pointer-events-auto z-10 scale-100" : "opacity-0 pointer-events-none z-0 scale-[0.98]"}`}>
            <GoalsTab />
          </div>
          <div className={`absolute inset-0 transition-all duration-200 ${activeTab === "gratitud" ? "opacity-100 pointer-events-auto z-10 scale-100" : "opacity-0 pointer-events-none z-0 scale-[0.98]"}`}>
            <GratitudeTab />
          </div>
          <div className={`absolute inset-0 transition-all duration-200 ${activeTab === "visualizar" ? "opacity-100 pointer-events-auto z-10 scale-100" : "opacity-0 pointer-events-none z-0 scale-[0.98]"}`}>
            <VisualizeTab />
          </div>
        </main>

        <Navigation activeTab={activeTab} onChangeTab={setActiveTab} />
      </div>
    </div>
  );
}
