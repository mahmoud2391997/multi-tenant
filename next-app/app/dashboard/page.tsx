'use client';

import { useState, useEffect } from 'react';
import { Company, ModuleType } from '../../../types';
import Sidebar from '../../../components/Sidebar';
import Header from '../../../components/Header';
import Dashboard from '../../../modules/core/Dashboard';
import { APP_MODULES } from '../../../modules/registry';

export default function DashboardPage() {
  const [currentCompany, setCurrentCompany] = useState<Company | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data for now - replace with actual API calls
    const mockCompany: Company = {
      id: '1',
      name: 'شركة تجارية',
      admin_email: 'admin@example.com',
      createdAt: new Date().toISOString(),
      activeModules: ['ACCOUNTING', 'INVENTORY', 'HR']
    };
    
    setCurrentCompany(mockCompany);
    setCompanies([mockCompany]);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-slate-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 font-['Noto_Sans_Arabic']" dir="rtl">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        activeModules={currentCompany?.activeModules || []}
        userName="Admin User"
      />
      
      <div className="flex-1 flex flex-col">
        <Header 
          companies={companies}
          currentCompany={currentCompany}
          onCompanyChange={setCurrentCompany}
        />
        
        <main className="flex-1 overflow-y-auto custom-scrollbar">
          <Dashboard 
            company={currentCompany!}
            onToggleModule={(module: ModuleType) => {
              console.log('Toggle module:', module);
            }}
            totalBalance={50000}
            transactionsCount={150}
          />
        </main>
      </div>
    </div>
  );
}
