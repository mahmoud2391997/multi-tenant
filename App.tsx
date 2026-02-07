
import React, { useState, useEffect, useMemo } from 'react';
import { Company, ModuleType, AppState, Account, JournalEntry, AccountType, Product, Warehouse, Employee, Lead, PayrollRecord, User } from './types';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './modules/core/Dashboard';
import Registration from './modules/core/Registration';
import WorkspaceSelector from './modules/core/WorkspaceSelector';
import Auth from './modules/core/Auth';
import { APP_MODULES } from './modules/registry';

// API Base URL - Backend server runs on port 3001
const API_BASE_URL = 'http://localhost:3001';

const DEFAULT_COMPANY: Company = {
  id: 'default-company',
  name: 'شركة افتراضية',
  adminEmail: 'admin@default.com',
  activeModules: [ModuleType.ACCOUNTING],
  createdAt: Date.now(),
};

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('zenith_erp_state');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved state');
      }
    }
    return {
      users: [],
      currentUserId: null,
      companies: [],
      currentCompanyId: null,
      accounts: {},
      entries: {},
      products: {},
      warehouses: {},
      employees: {},
      leads: {},
      payrolls: {},
      invoices: {},
    };
  });

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isCreatingWorkspace, setIsCreatingWorkspace] = useState(false);

  useEffect(() => {
    // Fetch users (this will also test backend connection)
    fetch(`${API_BASE_URL}/users`)
      .then(res => {
        if (!res.ok) {
          throw new Error(`Server returned ${res.status}`);
        }
        return res.json();
      })
      .then(users => {
        console.log('✅ Backend connected - Users fetched:', users.length);
        setState(prevState => ({ ...prevState, users }));
      })
      .catch(err => {
        console.error('❌ Backend connection failed:', err);
        alert('⚠️ Cannot connect to backend server. Make sure the server is running on port 3001.');
      });
    
    // Fetch companies with active modules
    fetch(`${API_BASE_URL}/companies`)
      .then(res => res.json())
      .then(companies => {
        console.log('✅ Companies fetched with active modules:', companies.length);
        setState(prevState => ({ ...prevState, companies }));
      })
      .catch(err => {
        console.error('Error fetching companies:', err);
      });
  }, []);

  // Fetch entity data when company changes
  useEffect(() => {
    if (state.currentCompanyId) {
      const entities = ['accounts', 'journal-entries', 'products', 'warehouses', 'employees', 'leads', 'payroll-records'];
      entities.forEach(entity => {
        fetchEntityData(entity, state.currentCompanyId);
      });
    }
  }, [state.currentCompanyId]);

  // Initialize empty arrays for new companies
  useEffect(() => {
    if (state.currentCompanyId && !state.entries[state.currentCompanyId]) {
      setState(prev => ({
        ...prev,
        entries: { ...prev.entries, [state.currentCompanyId]: [] }
      }));
    }
  }, [state.currentCompanyId, state.entries]);

  useEffect(() => {
    localStorage.setItem('zenith_erp_state', JSON.stringify(state));
  }, [state]);

  const currentUser = useMemo(() => 
    state.users.find(u => u.id === state.currentUserId) || null
  , [state.users, state.currentUserId]);

  const currentCompany = useMemo(() => 
    state.companies.find(c => c.id === state.currentCompanyId) || DEFAULT_COMPANY
  , [state.companies, state.currentCompanyId]);

  const handleLogin = async (user: User) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${user.id}`);
      const userData = await response.json();
      
      if (userData.memberships && userData.memberships.length > 0) {
        const companies = userData.memberships.map((m: any) => ({
          ...m.company,
          createdAt: m.company.created_at,
          activeModules: m.company.active_modules?.map((am: any) => am.module_name) || []
        }));
        const firstCompany = companies[0];
        
        // Clear localStorage to force fresh data
        localStorage.removeItem('zenith_erp_state');
        
        setState(prev => ({ 
          ...prev, 
          currentUserId: user.id,
          currentCompanyId: firstCompany.id,
          companies
        }));
      } else {
        setState(prev => ({ 
          ...prev, 
          currentUserId: user.id,
          companies: []
        }));
      }
    } catch (error) {
      console.error('Error fetching user companies:', error);
      setState(prev => ({ ...prev, currentUserId: user.id }));
    }
  };

  const handleRegisterUser = async (name: string, email: string, password: string, companyName: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, companyName }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Registration failed');
      
      setState(prev => ({ 
        ...prev, 
        currentUserId: data.user.id,
        currentCompanyId: data.company.id,
        companies: [{ ...data.company, activeModules: ['ACCOUNTING'] }],
      }));
    } catch (err: any) {
      console.error('Registration error:', err.message);
      throw err;
    }
  };

  const handleRegisterCompany = async (companyName: string, email: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: 'Admin User', 
          email: email, 
          password: 'default123', 
          companyName: companyName 
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Registration failed');
      
      // Clear localStorage to force fresh data
      localStorage.removeItem('zenith_erp_state');
      
      setState(prev => ({
        ...prev,
        currentCompanyId: data.company.id,
        companies: [...prev.companies, data.company],
        users: [...prev.users, data.user],
      }));
      setIsCreatingWorkspace(false);
    } catch (err: any) {
      console.error('Company registration error:', err.message);
      alert('Registration failed: ' + err.message);
    }
  };

  // API Service Functions
  const apiCall = async (method: string, endpoint: string, data?: any) => {
    console.log(`API Call: ${method} ${endpoint}`, data);
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: data ? JSON.stringify(data) : undefined,
    });
    
    console.log(`API Response status: ${response.status} ${response.statusText}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API Error Response:`, errorText);
      throw new Error(errorText || 'API call failed');
    }
    
    // Handle 204 No Content responses (like delete operations)
    if (response.status === 204) {
      console.log(`API Response: No content (204)`);
      return null; // or return a success indicator
    }
    
    const result = await response.json();
    console.log(`API Response data:`, result);
    return result;
  };

  const fetchEntityData = async (entity: string, companyId?: string) => {
    try {
      const endpoint = companyId ? `/${entity}?companyId=${companyId}` : `/${entity}`;
      console.log(`Fetching ${entity} for companyId: ${companyId}`);
      const data = await apiCall('GET', endpoint);
      console.log(`Fetched ${entity} data:`, data);
      
      if (companyId && data && Array.isArray(data)) {
        // Map backend entity names to frontend state keys
        const entityToStateKey: Record<string, string> = {
          'accounts': 'accounts',
          'journal-entries': 'entries',
          'products': 'products',
          'warehouses': 'warehouses',
          'employees': 'employees',
          'leads': 'leads',
          'payroll-records': 'payrolls'
        };
        
        const stateKey = entityToStateKey[entity] || entity;
        console.log(`Setting state for ${stateKey} with ${data.length} items`);
        setState(prev => ({
          ...prev,
          [stateKey]: { ...prev[stateKey as keyof AppState], [companyId]: data }
        }));
      } else if (companyId && data === null) {
        // Handle case where data is null (shouldn't happen for GET requests but just in case)
        console.log(`Received null data for ${entity}, using empty array`);
        const entityToStateKey: Record<string, string> = {
          'accounts': 'accounts',
          'journal-entries': 'entries',
          'products': 'products',
          'warehouses': 'warehouses',
          'employees': 'employees',
          'leads': 'leads',
          'payroll-records': 'payrolls'
        };
        
        const stateKey = entityToStateKey[entity] || entity;
        setState(prev => ({
          ...prev,
          [stateKey]: { ...prev[stateKey as keyof AppState], [companyId]: [] }
        }));
      } else {
        console.warn(`No valid data or invalid format for ${entity}:`, data);
      }
    } catch (error) {
      console.error(`Error fetching ${entity}:`, error);
      // Don't throw the error to prevent logging out
    }
  };

  const updateEntity = async <T extends { id: string }>(
    entity: string,
    action: 'add' | 'edit' | 'delete',
    item: T | string,
    companyId?: string
  ) => {
    try {
      let result;
      
      if (action === 'add') {
        const addItem = item as any;
        console.log(`Adding ${entity} with data:`, { ...addItem, companyId: companyId });
        result = await apiCall('POST', `/${entity}`, { ...addItem, companyId: companyId });
      } else if (action === 'edit') {
        const editItem = item as T;
        console.log(`Editing ${entity} with data:`, { ...editItem, companyId: companyId });
        result = await apiCall('PUT', `/${entity}/${editItem.id}`, { ...editItem, companyId: companyId });
      } else {
        const idToDelete = item as string;
        console.log(`Deleting ${entity} with id:`, idToDelete);
        await apiCall('DELETE', `/${entity}/${idToDelete}`);
        result = idToDelete;
      }
      
      console.log(`${action} ${entity} result:`, result);
      
      // Refresh the entity data after operation
      if (companyId) {
        await fetchEntityData(entity, companyId);
      }
      
      return result;
    } catch (error) {
      console.error(`Error updating ${entity}:`, error);
      throw error;
    }
  };

  const updateList = async <T extends { id: string }>(
    key: keyof Omit<AppState, 'companies' | 'currentCompanyId' | 'users' | 'currentUserId'>,
    action: 'add' | 'edit' | 'delete',
    item: T | string
  ) => {
    if (!state.currentCompanyId) return;
    const cid = state.currentCompanyId;
    
    try {
      const entityMap: Record<string, string> = {
        accounts: 'accounts',
        entries: 'journal-entries',
        products: 'products',
        warehouses: 'warehouses',
        employees: 'employees',
        leads: 'leads',
        payrolls: 'payroll-records',
        'payroll-records': 'payroll-records'
      };
      
      const entity = entityMap[key as string];
      if (!entity) {
        console.error(`No entity mapping found for key: ${key}`);
        return;
      }
      
      await updateEntity(entity, action, item, cid);
    } catch (error) {
      console.error(`Error in updateList for ${key}:`, error);
    }
  };

  const addJournalEntry = async (entry: Omit<JournalEntry, 'id'>) => {
    if (!state.currentCompanyId) return;
    const companyId = state.currentCompanyId;
    
    try {
      const response = await fetch(`${API_BASE_URL}/journal-entries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...entry, companyId }),
      });
      
      if (!response.ok) throw new Error('Failed to create journal entry');
      const newEntry = await response.json();
      
      setState(prev => ({
        ...prev,
        entries: { ...prev.entries, [companyId]: [...(prev.entries[companyId] || []), newEntry] }
      }));
      
      console.log('Journal entry saved successfully:', newEntry);
    } catch (error) {
      console.error('Error adding journal entry:', error);
      alert('فشل في حفظ القيد');
    }
  };

  const toggleModule = async (module: ModuleType) => {
    if (!state.currentCompanyId) return;
    const cid = state.currentCompanyId;
    const company = state.companies.find(c => c.id === cid);
    const isActive = company?.activeModules?.includes(module);
    
    try {
      if (isActive) {
        await fetch(`${API_BASE_URL}/active-modules/company/${cid}/module/${module}`, { method: 'DELETE' });
      } else {
        await fetch(`${API_BASE_URL}/active-modules`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ companyId: cid, moduleName: module }),
        });
      }
      
      // Refresh companies from server to get updated active modules from database
      const companiesResponse = await fetch(`${API_BASE_URL}/companies`);
      const updatedCompanies = await companiesResponse.json();
      
      setState(prev => ({
        ...prev,
        companies: updatedCompanies,
      }));
    } catch (error) {
      console.error('Error toggling module:', error);
    }
  };

  // AUTH BRANCH - Show login/registration when not authenticated
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
    // Show Registration when no company selected
    return (
      <Registration 
        onRegister={handleRegisterCompany} 
        hasCompanies={false}
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
        if (!(currentCompany?.activeModules || []).includes(module.type)) {
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
          accounts: state.accounts?.[cid] || [],
          entries: state.entries?.[cid] || [],
          products: state.products?.[cid] || [],
          warehouses: state.warehouses?.[cid] || [],
          employees: state.employees?.[cid] || [],
          payroll: state.payrolls?.[cid] || [],
          payrolls: state.payrolls?.[cid] || [],
          leads: state.leads?.[cid] || [],
          invoices: state.entries?.[cid]?.filter(entry => entry.reference?.startsWith('INV-') || entry.reference?.startsWith('PAY-')) || [],
          onAction: (entity: string, action: string, data: any) => {
            const map: any = { coa: 'accounts', journal: 'entries', products: 'products', warehouses: 'warehouses', employees: 'employees', payroll: 'payroll-records', leads: 'leads' };
            updateList(map[entity], action as any, data);
          },
          onRefresh: async () => {
            // Refresh the current active tab's data
            const tabEntityMap: Record<string, string> = {
              'dashboard': 'accounts', // Dashboard shows accounts summary
              'coa': 'accounts',
              'journal': 'journal-entries',
              'products': 'products',
              'warehouses': 'warehouses',
              'employees': 'employees',
              'payroll': 'payroll-records',
              'leads': 'leads',
              'invoices': 'journal-entries'
            };
            
            const entityToRefresh = tabEntityMap[activeTab] || 'products';
            console.log(`Refreshing ${entityToRefresh} for tab ${activeTab}`);
            await fetchEntityData(entityToRefresh, cid);
          },
          onPostInvoice: addJournalEntry,
          onEdit: async (entry: any) => {
            console.log('Editing invoice:', entry);
            try {
              const result = await updateEntity('journal-entries', 'edit', entry, cid);
              console.log('Edit result:', result);
              if (result) {
                setState(prev => ({
                  ...prev,
                  entries: { ...prev.entries, [cid]: (prev.entries[cid] || []).map(e => e.id === entry.id ? { ...e, ...entry } : e) }
                }));
              }
            } catch (error) {
              console.error('Edit error:', error);
              alert('فشل تحديث الفاتورة');
            }
          },
          onDelete: async (id: string) => {
            try {
              await fetch(`http://localhost:3001/journal-entries/${id}`, { method: 'DELETE' });
              setState(prev => ({
                ...prev,
                entries: { ...prev.entries, [cid]: (prev.entries[cid] || []).filter(e => e.id !== id) }
              }));
            } catch (error) {
              alert('فشل حذف الفاتورة');
            }
          },
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
