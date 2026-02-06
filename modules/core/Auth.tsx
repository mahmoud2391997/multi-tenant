
import React, { useState } from 'react';

interface AuthProps {
  onAuthSuccess: (user: any) => void;
  onRegisterUser: (name: string, email: string, pass: string, company: string) => void;
}

const Auth: React.FC<AuthProps> = ({ onAuthSuccess, onRegisterUser }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (isLogin) {
      try {
        const response = await fetch('http://localhost:3000/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || 'Login failed');
        }
        onAuthSuccess(data.user);
      } catch (err: any) {
        setError(err.message);
      }
    } else {
      onRegisterUser(name, email, password, companyName);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-slate-800 mb-6">
          {isLogin ? 'تسجيل الدخول' : 'إنشاء حساب جديد'}
        </h1>
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <div className="mb-4">
                <label className="block text-slate-600 mb-2" htmlFor="name">
                  الاسم الكامل
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                  required
                />
              </div>
              <div className="mb-4">
              <label className="block text-slate-600 mb-2" htmlFor="companyName">
                اسم الشركة
              </label>
              <input
                type="text"
                id="companyName"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                required
              />
            </div>
            </>
          )}
          <div className="mb-4">
            <label className="block text-slate-600 mb-2" htmlFor="email">
              البريد الإلكتروني
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-slate-600 mb-2" htmlFor="password">
              كلمة المرور
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <button
            type="submit"
            className="w-full bg-slate-900 text-white font-bold py-2 px-4 rounded-lg hover:bg-slate-800 transition duration-200"
          >
            {isLogin ? 'دخول' : 'تسجيل'}
          </button>
        </form>
        <p className="text-center text-slate-600 mt-6">
          {isLogin ? 'ليس لديك حساب؟' : 'لديك حساب بالفعل؟'}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-slate-800 font-bold hover:underline focus:outline-none ml-2"
          >
            {isLogin ? 'أنشئ حساباً' : 'سجّل الدخول'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Auth;
