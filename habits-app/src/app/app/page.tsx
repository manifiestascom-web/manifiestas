"use client";

import React, { useState } from "react";
import Header from "@/components/layout/Header";
import Navigation, { TabType } from "@/components/layout/Navigation";
import TodayTab from "@/components/tabs/TodayTab";
import HabitsListTab from "@/components/tabs/HabitsListTab";
import AnalyticsTab from "@/components/tabs/AnalyticsTab";
import CoachTab from "@/components/tabs/CoachTab";

export default function AppHome() {
  const [activeTab, setActiveTab] = useState<TabType>("today");

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

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden bg-background transition-colors duration-300 sm:relative sm:min-h-screen sm:flex sm:items-center sm:justify-center sm:py-8 sm:px-4">
      <div className="w-full h-full max-w-[680px] sm:h-[780px] bg-bg-primary sm:border border-border-secondary sm:rounded-3xl sm:shadow-2xl overflow-hidden flex flex-col relative border-border-primary/80 transition-colors duration-300">
        <Header />
        
        {/* Contenedor principal del contenido de las pestañas */}
        <main className="flex-1 relative overflow-hidden bg-bg-primary">
          <div className={`absolute inset-0 transition-all duration-200 ${activeTab === "today" ? "opacity-100 pointer-events-auto z-10 scale-100" : "opacity-0 pointer-events-none z-0 scale-[0.98]"}`}>
            <TodayTab />
          </div>
          <div className={`absolute inset-0 transition-all duration-200 ${activeTab === "habits" ? "opacity-100 pointer-events-auto z-10 scale-100" : "opacity-0 pointer-events-none z-0 scale-[0.98]"}`}>
            <HabitsListTab />
          </div>
          <div className={`absolute inset-0 transition-all duration-200 ${activeTab === "analytics" ? "opacity-100 pointer-events-auto z-10 scale-100" : "opacity-0 pointer-events-none z-0 scale-[0.98]"}`}>
            <AnalyticsTab />
          </div>
          <div className={`absolute inset-0 transition-all duration-200 ${activeTab === "coach" ? "opacity-100 pointer-events-auto z-10 scale-100" : "opacity-0 pointer-events-none z-0 scale-[0.98]"}`}>
            <CoachTab />
          </div>
        </main>

        <Navigation activeTab={activeTab} onChangeTab={setActiveTab} />
      </div>
    </div>
  );
}
