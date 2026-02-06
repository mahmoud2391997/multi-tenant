
import { AppState, ModuleType, AccountType } from './types';

const DEMO_USER_ID = 'demo-user-123';
const DEMO_COMPANY_ID = 'demo-corp-456';

export const DUMMY_DATA: AppState = {
  users: [
    {
      id: DEMO_USER_ID,
      name: 'أدمن التجربة',
      email: 'demo@zenith.com',
      password: '123',
      companyIds: [DEMO_COMPANY_ID]
    }
  ],
  currentUserId: null,
  companies: [
    {
      id: DEMO_COMPANY_ID,
      name: 'شركة زينيث للحلول الذكية',
      adminEmail: 'demo@zenith.com',
      activeModules: [ModuleType.ACCOUNTING, ModuleType.INVENTORY, ModuleType.HR, ModuleType.CRM],
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 30 // 30 days ago
    }
  ],
  currentCompanyId: null,
  accounts: {
    [DEMO_COMPANY_ID]: [
      { id: '1', code: '1101', name: 'الصندوق الرئيسي', type: AccountType.ASSET, balance: 15000 },
      { id: '2', code: '1102', name: 'بنك الراجحي', type: AccountType.ASSET, balance: 85000 },
      { id: '3', code: '1201', name: 'حسابات العملاء', type: AccountType.ASSET, balance: 5000 },
      { id: '4', code: '2101', name: 'الموردين', type: AccountType.LIABILITY, balance: 20000 },
      { id: '5', code: '3101', name: 'رأس المال', type: AccountType.EQUITY, balance: 75000 },
      { id: '6', code: '4101', name: 'إيراد المبيعات', type: AccountType.REVENUE, balance: 10000 },
    ]
  },
  entries: {
    [DEMO_COMPANY_ID]: [
      {
        id: 'jv-1',
        date: '2024-02-01',
        reference: 'JV-INIT-01',
        description: 'القيد الافتتاحي - إيداع رأس المال',
        lines: [
          { accountId: '2', description: 'إيداع بنكي', debit: 75000, credit: 0 },
          { accountId: '5', description: 'رأس مال مؤسس', debit: 0, credit: 75000 },
        ]
      }
    ]
  },
  products: {
    [DEMO_COMPANY_ID]: [
      { id: 'p1', name: 'ماك بوك برو M3', sku: 'MBP-M3-01', price: 9500, stock: 15, category: 'إلكترونيات' },
      { id: 'p2', name: 'أيفون 15 برو', sku: 'IP-15-P', price: 4500, stock: 45, category: 'إلكترونيات' },
    ]
  },
  warehouses: {
    [DEMO_COMPANY_ID]: [
      { id: 'w1', name: 'مستودع الرياض المركزي', location: 'حي السلي', capacity: 5000, occupancy: 1200 },
    ]
  },
  employees: {
    [DEMO_COMPANY_ID]: [
      { id: 'e1', name: 'خالد المنصور', role: 'محاسب مالي', department: 'المالية', salary: 8500, status: 'ACTIVE' },
      { id: 'e2', name: 'سارة القحطاني', role: 'مديرة مبيعات', department: 'المبيعات', salary: 12000, status: 'ACTIVE' },
    ]
  },
  payrolls: {
    [DEMO_COMPANY_ID]: [
      { id: 'pr1', month: 'يناير 2024', status: 'PAID', amount: 20500, date: '2024-01-31' },
    ]
  },
  leads: {
    [DEMO_COMPANY_ID]: [
      { id: 'l1', name: 'مجموعة الفوزان', company: 'الفوزان للتجارة', value: 150000, stage: 'NEGOTIATION', chance: 75 },
    ]
  }
};
