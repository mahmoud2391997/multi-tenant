
import React, { useState } from 'react';
import { Account, JournalEntry, AccountType } from '../../types';

interface InvoicesProps {
  accounts: Account[];
  onPostInvoice: (entry: Omit<JournalEntry, 'id'>) => void;
}

const Invoices: React.FC<InvoicesProps> = ({ accounts, onPostInvoice }) => {
  const [customer, setCustomer] = useState('');
  const [amount, setAmount] = useState<number | ''>('');
  const [status, setStatus] = useState<'IDLE' | 'SUCCESS'>('IDLE');

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = Number(amount);
    if (numAmount <= 0) return;

    const arAcc = accounts.find(a => a.code === '1201');
    const salesAcc = accounts.find(a => a.code === '4101');

    if (!arAcc || !salesAcc) return;

    onPostInvoice({
      date: new Date().toISOString().split('T')[0],
      reference: `INV-${Math.floor(Math.random() * 10000)}`,
      description: `فاتورة مبيعات عميل: ${customer}`,
      lines: [
        { accountId: arAcc.id, description: `استحقاق عميل: ${customer}`, debit: numAmount, credit: 0 },
        { accountId: salesAcc.id, description: `إثبات إيراد مبيعات: ${customer}`, debit: 0, credit: numAmount },
      ]
    });

    triggerSuccess();
  };

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = Number(amount);
    if (numAmount <= 0) return;

    const cashAcc = accounts.find(a => a.code === '1101');
    const arAcc = accounts.find(a => a.code === '1201');

    if (!cashAcc || !arAcc) return;

    onPostInvoice({
      date: new Date().toISOString().split('T')[0],
      reference: `PAY-${Math.floor(Math.random() * 10000)}`,
      description: `سند قبض نقدية من عميل: ${customer}`,
      lines: [
        { accountId: cashAcc.id, description: `تحصيل نقدية من: ${customer}`, debit: numAmount, credit: 0 },
        { accountId: arAcc.id, description: `تخفيض حساب المدين: ${customer}`, debit: 0, credit: numAmount },
      ]
    });

    triggerSuccess();
  };

  const triggerSuccess = () => {
    setStatus('SUCCESS');
    setTimeout(() => setStatus('IDLE'), 3000);
    setCustomer('');
    setAmount('');
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-slate-900">الفواتير والتحصيل</h2>
          <p className="text-slate-500 text-sm mt-1">توليد القيود المحاسبية الآلية للعمليات التجارية</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-10">
        {/* Sales Invoice Section */}
        <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-xl transition-all relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -mr-10 -mt-10 group-hover:scale-110 transition-transform"></div>
          
          <div className="flex items-center space-x-4 space-x-reverse mb-8">
            <div className="bg-blue-600 p-3 rounded-2xl text-white shadow-lg shadow-blue-200">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            </div>
            <h3 className="text-xl font-black text-slate-800">فاتورة مبيعات جديدة</h3>
          </div>
          
          <form onSubmit={handleCreateInvoice} className="space-y-6">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 mb-2">
              <p className="text-[10px] font-black text-blue-600 uppercase mb-2">القيد الآلي المتولد:</p>
              <div className="flex justify-between text-xs font-bold text-slate-500">
                <span>(+) حساب المدينين</span>
                <span>(-) حساب المبيعات</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">اسم العميل / الجهة</label>
              <input 
                type="text" 
                value={customer}
                onChange={e => setCustomer(e.target.value)}
                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-100 focus:bg-white transition-all font-bold" 
                placeholder="أدخل اسم العميل..."
                required
              />
            </div>
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">إجمالي قيمة الفاتورة (ريال)</label>
              <input 
                type="number" 
                value={amount}
                onChange={e => setAmount(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-100 focus:bg-white transition-all font-black text-2xl" 
                placeholder="0.00"
                required
              />
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white font-black py-5 rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 hover:-translate-y-1">
              ترحيل الفاتورة للقيد العام
            </button>
          </form>
        </div>

        {/* Payment Receipt Section */}
        <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-xl transition-all relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-full -mr-10 -mt-10 group-hover:scale-110 transition-transform"></div>

          <div className="flex items-center space-x-4 space-x-reverse mb-8">
            <div className="bg-emerald-500 p-3 rounded-2xl text-white shadow-lg shadow-emerald-200">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            </div>
            <h3 className="text-xl font-black text-slate-800">سند قبض نقدية</h3>
          </div>

          <form onSubmit={handlePayment} className="space-y-6">
            <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 mb-2">
              <p className="text-[10px] font-black text-emerald-600 uppercase mb-2">القيد الآلي المتولد:</p>
              <div className="flex justify-between text-xs font-bold text-slate-500">
                <span>(+) حساب الصندوق</span>
                <span>(-) حساب المدينين</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">تحصيل من العميل</label>
              <input 
                type="text" 
                value={customer}
                onChange={e => setCustomer(e.target.value)}
                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-100 focus:bg-white transition-all font-bold" 
                placeholder="اسم العميل المسدد..."
                required
              />
            </div>
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">المبلغ المستلم (ريال)</label>
              <input 
                type="number" 
                value={amount}
                onChange={e => setAmount(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-100 focus:bg-white transition-all font-black text-2xl text-emerald-700" 
                placeholder="0.00"
                required
              />
            </div>
            <button type="submit" className="w-full bg-emerald-600 text-white font-black py-5 rounded-2xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 hover:-translate-y-1">
              تسجيل سند القبض والترحيل
            </button>
          </form>
        </div>
      </div>

      {status === 'SUCCESS' && (
        <div className="fixed bottom-12 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-8 py-5 rounded-3xl shadow-2xl animate-in slide-in-from-bottom flex items-center z-50 border border-slate-700">
          <div className="bg-emerald-500 p-2 rounded-full ml-4">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
          </div>
          <div>
            <p className="font-black text-lg">تمت العملية بنجاح</p>
            <p className="text-slate-400 text-xs">تم ترحيل القيد المحاسبي آلياً لميزان المراجعة</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Invoices;
