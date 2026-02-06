
import React, { useState } from 'react';
import { User } from '../../types';

interface AuthProps {
  onAuthSuccess: (user: User) => void;
  users: User[];
  onRegisterUser: (enterpriseName: string, adminName: string, email: string, pass: string) => void;
}

const Auth: React.FC<AuthProps> = ({ onAuthSuccess, users, onRegisterUser }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [enterpriseName, setEnterpriseName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      const user = users.find(u => u.email === email && u.password === password);
      if (user) {
        onAuthSuccess(user);
      } else {
        setError('خطأ في البريد الإلكتروني أو كلمة المرور');
      }
    } else {
      if (users.some(u => u.email === email)) {
        setError('هذا البريد الإلكتروني مسجل مسبقاً');
        return;
      }
      onRegisterUser(enterpriseName, name, email, password);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 relative overflow-hidden" dir="rtl">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-indigo-600/20 blur-[100px] rounded-full"></div>

      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl p-10 relative z-10 border border-white/10 animate-in fade-in zoom-in duration-500">
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-500/40 mb-4 transform -rotate-3">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">ZENITH ERP</h1>
          <p className="text-slate-500 mt-2 font-medium text-center">
            {isLogin ? 'مرحباً بعودتك! سجل دخولك للمتابعة' : 'أنشئ حسابك ومساحة عمل شركتك في ثوانٍ'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-100 text-rose-600 text-sm font-bold rounded-2xl flex items-center animate-in fade-in slide-in-from-top-1">
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <>
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 mr-1">اسم المنشأة / الشركة</label>
                <input
                  type="text"
                  value={enterpriseName}
                  onChange={(e) => setEnterpriseName(e.target.value)}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-50 focus:bg-white transition-all font-bold"
                  placeholder="مثال: شركة الحلول الذكية"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 mr-1">اسم المسؤول (الأدمن)</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-50 focus:bg-white transition-all font-bold"
                  placeholder="اسمك الكامل..."
                  required
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 mr-1">البريد الإلكتروني</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-50 focus:bg-white transition-all font-bold"
              placeholder="user@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 mr-1">كلمة المرور</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-50 focus:bg-white transition-all font-bold"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-slate-900 text-white font-black py-5 rounded-[1.5rem] hover:bg-black transform transition-all active:scale-[0.98] shadow-xl shadow-slate-200 mt-4 text-lg"
          >
            {isLogin ? 'تسجيل الدخول' : 'تأسيس الحساب والشركة'}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-slate-100 text-center">
          <p className="text-slate-500 font-medium">
            {isLogin ? 'ليس لديك حساب؟' : 'لديك حساب بالفعل؟'}
            <button
              onClick={() => { setIsLogin(!isLogin); setError(''); }}
              className="mr-2 text-blue-600 font-black hover:underline underline-offset-4"
            >
              {isLogin ? 'ابدأ كمنشأة جديدة' : 'سجل دخولك'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
