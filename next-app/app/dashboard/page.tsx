'use client';

import { useState, useEffect } from 'react';
import { Company, ModuleType, Account, AccountType } from '../../types';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import Dashboard from '../../modules/core/Dashboard';
import { APP_MODULES } from '../../modules/registry';

const findActiveComponent = (activeTab: string): React.FC<any> | null => {
  if (activeTab === 'dashboard') {
    return Dashboard;
  }
  for (const module of APP_MODULES) {
    const tab = module.tabs.find(t => t.id === activeTab);
    if (tab) {
      return tab.component;
    }
  }
  return null;
};

export default function DashboardPage() {
  const [currentCompany, setCurrentCompany] = useState<Company | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [accounts, setAccounts] = useState<Account[]>([]);

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const response = await fetch('/api/companies');
        const companies = await response.json();
        const mockCompany: Company = {
          id: '1',
          name: 'شركة تجارية',
          admin_email: 'admin@example.com',
          createdAt: new Date().toISOString(),
          activeModules: ['ACCOUNTING', 'INVENTORY', 'HR', 'CRM']
        };
        setCurrentCompany(mockCompany);
        setCompanies(companies);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching company data:', error);
        setLoading(false);
      }
    };

    fetchCompanyData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (activeTab !== 'dashboard' && currentCompany) {
        try {
          const response = await fetch(`/api/${activeTab}?companyId=${currentCompany.id}`);
          const data = await response.json();
          // You might need to handle different data structures here
          // For now, we'll assume a simple array for each tab
          if (activeTab === 'coa') {
            setAccounts(data);
          } // Add similar blocks for other tabs
        } catch (error) {
          console.error(`Error fetching ${activeTab} data:`, error);
        }
      }
    };

    fetchData();
  }, [activeTab, currentCompany]);

  const handleLogout = () => {
    console.log("Logout action here");
  };

  const handleAction = async (entity: string, action: string, data: any) => {
    if (!currentCompany) return;

    let url = `/api/${entity}`;
    let method = 'POST';

    if (action === 'edit') {
      url += `/${data.id}`;
      method = 'PUT';
    } else if (action === 'delete') {
      url += `/${data.id}`;
      method = 'DELETE';
    }

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...data, companyId: currentCompany.id }),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${action} ${entity}`);
      }

      // Refetch data to update the UI
      const fetchDataResponse = await fetch(`/api/${entity}?companyId=${currentCompany.id}`);
      const updatedData = await fetchDataResponse.json();
      if (entity === 'coa') {
        setAccounts(updatedData);
      }
      // Add similar blocks for other tabs

    } catch (error) {
      console.error(`Error in handleAction for ${entity}:`, error);
    }
  };

  const ActiveComponent = findActiveComponent(activeTab);

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
          companyName={currentCompany ? currentCompany.name : ''}
          onLogout={handleLogout}
        />
        
        <main className="flex-1 overflow-y-auto custom-scrollbar p-8 bg-slate-100">
          {activeTab === 'dashboard' && ActiveComponent ? (
            <Dashboard 
              company={currentCompany!}
              onToggleModule={(module: ModuleType) => {
                console.log('Toggle module:', module);
              }}
              totalBalance={50000}
              transactionsCount={150}
            />
          ) : ActiveComponent ? (
            <ActiveComponent 
              accounts={accounts} 
              onAction={handleAction} 
              company={currentCompany} 
            />
          ) : (
            <div className="text-center py-20">
              <h2 className="text-2xl font-bold text-slate-700">مكون غير موجود</h2>
              <p className="text-slate-500 mt-2">عذرًا، لم نتمكن من العثور على المكون المطابق لهذا التبويب.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
