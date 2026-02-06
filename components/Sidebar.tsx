
import React from 'react';
import { ModuleType } from '../types';
import { APP_MODULES } from '../modules/registry';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  activeModules: ModuleType[];
  userName: string;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, activeModules, userName }) => {
  return (
    <div className="w-64 bg-slate-900 text-white flex flex-col h-full transition-all duration-300">
      <div className="p-8">
        <div className="flex items-center space-x-3 space-x-reverse">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-900/50">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
          <h1 className="text-2xl font-black bg-gradient-to-l from-white to-slate-400 bg-clip-text text-transparent">
            ZENITH
          </h1>
        </div>
      </div>

      <nav className="flex-1 mt-4 px-4 space-y-6 overflow-y-auto custom-scrollbar">
        <SidebarItem 
          active={activeTab === 'dashboard'} 
          onClick={() => setActiveTab('dashboard')}
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>}
          label="الرئيسية"
        />

        {APP_MODULES.map(module => (
          <div key={module.type} className="space-y-1">
            <div className="flex items-center justify-between px-4 py-2">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                {module.label}
              </span>
              {!activeModules.includes(module.type) && (
                <span className="bg-slate-800 text-slate-500 text-[9px] px-1.5 py-0.5 rounded border border-slate-700">مغلق</span>
              )}
            </div>
            {module.tabs.map(tab => (
              <SidebarItem 
                key={tab.id}
                active={activeTab === tab.id} 
                onClick={() => setActiveTab(tab.id)}
                disabled={!activeModules.includes(module.type)}
                icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={module.icon} /></svg>}
                label={tab.label}
              />
            ))}
          </div>
        ))}
      </nav>

      <div className="p-4 bg-slate-800/50 m-4 rounded-2xl border border-slate-700/30">
        <div className="flex items-center space-x-3 space-x-reverse">
          <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center text-white font-bold border-2 border-slate-700 shadow-inner">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-bold truncate">{userName}</p>
            <p className="text-[10px] text-slate-400 truncate">المسؤول الرئيسي</p>
          </div>
        </div>
      </div>
    </div>
  );
};

interface SidebarItemProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  disabled?: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ active, onClick, icon, label, disabled }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full flex items-center space-x-3 space-x-reverse px-4 py-2.5 rounded-xl transition-all duration-300 group ${
        active 
          ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
          : disabled 
            ? 'opacity-20 grayscale cursor-not-allowed' 
            : 'text-slate-400 hover:bg-slate-800 hover:text-white'
      }`}
    >
      <div className={`${active ? 'text-white' : 'text-slate-500 group-hover:text-blue-400'} transition-colors`}>
        {icon}
      </div>
      <span className="font-semibold text-sm">{label}</span>
    </button>
  );
};

export default Sidebar;
