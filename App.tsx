
import React, { useState, useEffect, useMemo } from 'react';
import { Company, ModuleType, AppState, Account, JournalEntry, AccountType, Product, Warehouse, Employee, Lead, PayrollRecord, User } from './types';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './modules/core/Dashboard';
import Registration from './modules/core/Registration';
import WorkspaceSelector from './modules/core/WorkspaceSelector';
import Auth from './modules/core/Auth';
import { APP_MODULES } from './modules/registry';
import { DUMMY_DATA } from './initialData';

const INITIAL_ACCOUNTS: Account[] = [
  { id: '1', code: '1101', name: 'الصندوق', type: AccountType.ASSET, balance: 0 },
  { id: '2', code: '1102', name: 'البنك', type: AccountType.ASSET, balance: 0 },
  { id: '3', code: '1201', name: 'حسابات المدينين', type: AccountType.ASSET, balance: 0 },
  { id: '4', code: '2101', name: 'حسابات الدائنين', type: AccountType.LIABILITY, balance: 0 },
  { id: '5', code: '3101', name: 'رأس المال', type: AccountType.EQUITY, balance: 0 },
  { id: '6', code: '4101', name: 'إيراد المبيعات', type: AccountType.REVENUE, balance: 0 },
  { id: '7', code: '5101', name: 'مصاريف تشغيلية', type: AccountType.EXPENSE, balance: 0 },
];

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('zenith_erp_state');
    // If we have saved state, use it; otherwise, use our comprehensive DUMMY_DATA
    if (saved) return JSON.parse(saved);
    return DUMMY_DATA;
  });

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isCreatingWorkspace, setIsCreatingWorkspace] = useState(false);

  useEffect(() => {
    localStorage.setItem('zenith_erp_state', JSON.stringify(state));
  }, [state]);

  const currentUser = useMemo(() => 
    state.users.find(u => u.id === state.currentUserId) || null
  , [state.users, state.currentUserId]);

  const currentCompany = useMemo(() => 
    state.companies.find(c => c.id === state.currentCompanyId) || null
  , [state.companies, state.currentCompanyId]);

  const handleRegisterUser = (enterpriseName: string, adminName: string, email: string, pass: string) => {
    const userId = crypto.randomUUID();
    const companyId = crypto.randomUUID();

    const newUser: User = {
      id: userId,
      name: adminName,
      email,
      password: pass,
      companyIds: [companyId]
    };

    const newCompany: Company = {
      id: companyId,
      name: enterpriseName,
      adminEmail: email,
      activeModules: [ModuleType.ACCOUNTING],
      createdAt: Date.now(),
    };

    setState(prev => ({
      ...prev,
      users: [...prev.users, newUser],
      currentUserId: userId,
      companies: [...prev.companies, newCompany],
      currentCompanyId: companyId,
      accounts: { ...prev.accounts, [companyId]: INITIAL_ACCOUNTS },
      entries: { ...prev.entries, [companyId]: [] },
      products: { ...prev.products, [companyId]: [] },
      warehouses: { ...prev.warehouses, [companyId]: [] },
      employees: { ...prev.employees, [companyId]: [] },
      leads: { ...prev.leads, [companyId]: [] },
      payrolls: { ...prev.payrolls, [companyId]: [] },
    }));
  };

  const handleLogin = (user: User) => {
    setState(prev => ({ ...prev, currentUserId: user.id }));
  };

  const handleRegisterCompany = (companyName: string, email: string) => {
    if (!state.currentUserId) return;
    const id = crypto.randomUUID();
    const newCompany: Company = {
      id: id,
      name: companyName,
      adminEmail: email,
      activeModules: [ModuleType.ACCOUNTING],
      createdAt: Date.now(),
    };

    setState(prev => ({
      ...prev,
      companies: [...prev.companies, newCompany],
      currentCompanyId: id,
      users: prev.users.map(u => u.id === prev.currentUserId ? { ...u, companyIds: [...u.companyIds, id] } : u),
      accounts: { ...prev.accounts, [id]: INITIAL_ACCOUNTS },
      entries: { ...prev.entries, [id]: [] },
      products: { ...prev.products, [id]: [] },
      warehouses: { ...prev.warehouses, [id]: [] },
      employees: { ...prev.employees, [id]: [] },
      leads: { ...prev.leads, [id]: [] },
      payrolls: { ...prev.payrolls, [id]: [] },
    }));
    setIsCreatingWorkspace(false);
  };

  const updateList = <T extends { id: string }>(
    key: keyof Omit<AppState, 'companies' | 'currentCompanyId' | 'users' | 'currentUserId'>,
    action: 'add' | 'edit' | 'delete',
    item: T | string
  ) => {
    if (!state.currentCompanyId) return;
    const cid = state.currentCompanyId;
    
    setState(prev => {
      const record = prev[key] as unknown as Record<string, T[]>;
      const currentList = record[cid] || [];
      let newList: T[];

      if (action === 'add') {
        newList = [...currentList, item as T];
      } else if (action === 'edit') {
        const editedItem = item as T;
        newList = currentList.map(i => i.id === editedItem.id ? editedItem : i);
      } else {
        const idToDelete = item as string;
        newList = currentList.filter(i => i.id !== idToDelete);
      }

      return {
        ...prev,
        [key]: { ...record, [cid]: newList }
      };
    });
  };

  const addJournalEntry = (entry: Omit<JournalEntry, 'id'>) => {
    if (!state.currentCompanyId) return;
    const companyId = state.currentCompanyId;
    const newEntry: JournalEntry = { ...entry, id: crypto.randomUUID() };

    setState(prev => {
      const companyAccounts = prev.accounts[companyId].map(acc => {
        const lines = entry.lines.filter(l => l.accountId === acc.id);
        const totalDebit = lines.reduce((sum, l) => sum + l.debit, 0);
        const totalCredit = lines.reduce((sum, l) => sum + l.credit, 0);
        
        let newBalance = acc.balance;
        if (acc.type === AccountType.ASSET || acc.type === AccountType.EXPENSE) {
          newBalance += (totalDebit - totalCredit);
        } else {
          newBalance += (totalCredit - totalDebit);
        }

        return { ...acc, balance: newBalance };
      });

      return {
        ...prev,
        entries: {
          ...prev.entries,
          [companyId]: [...prev.entries[companyId], newEntry]
        },
        accounts: {
          ...prev.accounts,
          [companyId]: companyAccounts
        }
      };
    });
  };

  const toggleModule = (module: ModuleType) => {
    if (!state.currentCompanyId) return;
    setState(prev => ({
      ...prev,
      companies: prev.companies.map(c => {
        if (c.id === prev.currentCompanyId) {
          const activeModules = c.activeModules.includes(module)
            ? c.activeModules.filter(m => m !== module)
            : [...c.activeModules, module];
          return { ...c, activeModules };
        }
        return c;
      })
    }));
  };

  // AUTH BRANCH
  if (!state.currentUserId) {
    return (
      <Auth 
        users={state.users} 
        onAuthSuccess={handleLogin} 
        onRegisterUser={handleRegisterUser} 
      />
    );
  }

  // TENANT BRANCH
  if (!state.currentCompanyId) {
    const userCompanies = state.companies.filter(c => currentUser?.companyIds.includes(c.id));
    
    if (userCompanies.length > 0 && !isCreatingWorkspace) {
      return (
        <WorkspaceSelector 
          companies={userCompanies}
          onSelect={(id) => setState(p => ({...p, currentCompanyId: id}))}
          onCreateNew={() => setIsCreatingWorkspace(true)}
        />
      );
    }

    return (
      <Registration 
        onRegister={handleRegisterCompany} 
        hasCompanies={userCompanies.length > 0}
        onBackToList={() => setIsCreatingWorkspace(false)}
      />
    );
  }

  const renderActiveContent = () => {
    if (activeTab === 'dashboard') {
      return (
        <Dashboard 
          company={currentCompany!} 
          onToggleModule={toggleModule} 
          totalBalance={state.accounts[state.currentCompanyId!]?.find(a => a.code === '1101')?.balance || 0}
          transactionsCount={state.entries[state.currentCompanyId!]?.length || 0}
        />
      );
    }

    const cid = state.currentCompanyId!;
    for (const module of APP_MODULES) {
      const tab = module.tabs.find(t => t.id === activeTab);
      if (tab) {
        if (!currentCompany?.activeModules.includes(module.type)) {
          return (
            <div className="flex flex-col items-center justify-center h-full text-slate-500 animate-in fade-in zoom-in duration-300">
              <svg className="w-20 h-20 mb-6 text-rose-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <h2 className="text-2xl font-bold text-slate-800">هذه الوحدة غير مفعّلة</h2>
              <p className="mt-2">تحتاج شركتك لتفعيل وحدة ({module.label}) من لوحة التحكم للوصول لهذه الصفحة.</p>
              <button onClick={() => setActiveTab('dashboard')} className="mt-8 px-6 py-2 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800">العودة للرئيسية</button>
            </div>
          );
        }

        const Component = tab.component;
        const props: any = {
          accounts: state.accounts[cid] || [],
          entries: state.entries[cid] || [],
          products: state.products[cid] || [],
          warehouses: state.warehouses[cid] || [],
          employees: state.employees[cid] || [],
          leads: state.leads[cid] || [],
          payrolls: state.payrolls[cid] || [],
          onAction: (entity: string, action: string, data: any) => {
            const map: any = { coa: 'accounts', journal: 'entries', products: 'products', warehouses: 'warehouses', employees: 'employees', payroll: 'payrolls', leads: 'leads' };
            updateList(map[tab.id], action as any, data);
          },
          onAdd: tab.id === 'journal' ? addJournalEntry : undefined,
          onPostInvoice: tab.id === 'invoices' ? addJournalEntry : undefined
        };
        
        return <Component {...props} />;
      }
    }
    return <div>الصفحة غير موجودة</div>;
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 font-['Noto_Sans_Arabic']" dir="rtl">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        activeModules={currentCompany?.activeModules || []} 
        userName={currentUser?.name || ''}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          companyName={currentCompany?.name || ''} 
          onLogout={() => setState(prev => ({ ...prev, currentUserId: null, currentCompanyId: null }))} 
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">{renderActiveContent()}</main>
      </div>
    </div>
  );
};

export default App;
