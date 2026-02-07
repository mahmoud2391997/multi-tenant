'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      router.push('/dashboard');
    } else {
      const { error } = await response.json();
      alert(error);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-slate-50">
      <div className="w-full max-w-sm p-8 bg-white shadow-lg rounded-2xl">
        <h1 className="text-2xl font-bold text-center mb-6">تسجيل الدخول</h1>
        <div className="space-y-4">
          <input
            type="email"
            placeholder="البريد الإلكتروني"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none border border-slate-100 focus:ring-2 focus:ring-slate-900"
          />
          <input
            type="password"
            placeholder="كلمة المرور"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 rounded-xl outline-none border border-slate-100 focus:ring-2 focus:ring-slate-900"
          />
          <button
            onClick={handleLogin}
            className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition-colors"
          >
            تسجيل الدخول
          </button>
        </div>
        <p className="text-center text-sm text-slate-500 mt-4">
          ليس لديك حساب؟{' '}
          <Link href="/signup" className="font-bold text-slate-900">
            إنشاء حساب
          </Link>
        </p>
      </div>
    </div>
  );
}
