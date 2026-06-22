import React from 'react';
import { 
  IconRobot, 
  IconCircleCheck, 
  IconRotate, 
  IconTrendingUp
} from '@tabler/icons-react';
import { twMerge } from 'tailwind-merge';

export type TabType = 'today' | 'habits' | 'analytics' | 'coach';

interface NavigationProps {
  activeTab: TabType;
  onChangeTab: (tab: TabType) => void;
}

export default function Navigation({ activeTab, onChangeTab }: NavigationProps) {
  const tabs = [
    { id: 'today', label: 'Hoy', icon: IconCircleCheck },
    { id: 'habits', label: 'Hábitos', icon: IconRotate },
    { id: 'analytics', label: 'Progreso', icon: IconTrendingUp },
    { id: 'coach', label: 'Mentor IA', icon: IconRobot },
  ] as const;

  return (
    <nav className="flex border-t border-border-primary bg-bg-secondary shrink-0 overflow-x-auto no-scrollbar">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        
        return (
          <button
            key={tab.id}
            onClick={() => onChangeTab(tab.id as TabType)}
            className={twMerge(
              "flex-1 min-w-[70px] py-3 px-1 text-xs flex flex-col items-center gap-1.5 transition-all border-t-2 border-b-2 cursor-pointer",
              isActive 
                ? "border-t-primary border-b-transparent text-primary bg-primary/5" 
                : "border-transparent text-text-secondary hover:text-text-primary hover:bg-black/5 dark:hover:bg-white/5"
            )}
            role="tab"
            aria-selected={isActive}
            aria-label={tab.label}
          >
            <Icon size={20} stroke={isActive ? 2 : 1.5} />
            <span className="font-medium text-[11px]">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
