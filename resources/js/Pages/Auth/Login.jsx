import React, { useState } from 'react';
import { Link, useForm } from '@inertiajs/react';
import { ShieldCheck, Store, Lock, Mail, Eye, EyeOff, Sparkles, ArrowRight } from 'lucide-react';

export default function Login({ status, canResetPassword }) {
  const { data, setData, post, processing, errors, reset } = useForm({
    email: '',
    password: '',
    remember: true,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [activeTheme, setActiveTheme] = useState('modern'); // 'modern' | 'minimal' | 'dark'

  function fillLogin(email, pwd) {
    setData((prev) => ({
      ...prev,
      email,
      password: pwd,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    post('/login', {
      onFinish: () => reset('password'),
    });
  }

  // Theme styling definitions for live customizability
  const themeStyles = {
    modern: {
      bg: 'bg-gradient-to-br from-[#F0F2FA] via-[#F6F7FB] to-[#E9EDFB]',
      card: 'bg-white/90 backdrop-blur-xl border border-white/60 shadow-xl shadow-[#3F51D7]/5',
      primaryBtn: 'bg-[#3F51D7] hover:bg-[#3142BD] text-white shadow-md shadow-[#3F51D7]/20',
      accentBadge: 'bg-[#EEF0FD] text-[#3F51D7]',
      focusRing: 'focus:border-[#3F51D7] focus:ring-2 focus:ring-[#3F51D7]/20',
    },
    minimal: {
      bg: 'bg-white',
      card: 'bg-white border border-[#E6E8EF] shadow-none',
      primaryBtn: 'bg-[#182033] hover:bg-black text-white shadow-none',
      accentBadge: 'bg-gray-100 text-[#182033]',
      focusRing: 'focus:border-[#182033] focus:ring-1 focus:ring-[#182033]',
    },
    dark: {
      bg: 'bg-[#0E131F]',
      card: 'bg-[#182033]/90 backdrop-blur-xl border border-[#2B354F] shadow-2xl text-white',
      primaryBtn: 'bg-[#3F51D7] hover:bg-[#5264E8] text-white shadow-lg shadow-[#3F51D7]/30',
      accentBadge: 'bg-[#2A3555] text-[#9AA5FF]',
      focusRing: 'focus:border-[#3F51D7] focus:ring-2 focus:ring-[#3F51D7]/30 text-white',
    },
  };

  const currentTheme = themeStyles[activeTheme];

  return (
    <div className={`min-h-screen ${currentTheme.bg} transition-colors duration-300 flex flex-col items-center justify-center p-4 relative`}>
      {/* Theme Customizer Pill in Top Right */}
      <div className="absolute top-4 right-4 flex items-center gap-1.5 p-1 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur border border-gray-200/80 shadow-xs text-[11px] font-medium z-20">
        <span className="px-2 text-gray-500 text-[10px] uppercase font-bold tracking-wider flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-[#3F51D7]" /> Theme:
        </span>
        {(['modern', 'minimal', 'dark']).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setActiveTheme(t)}
            className={`px-2.5 py-1 rounded-xl capitalize transition-all ${
              activeTheme === t
                ? 'bg-[#3F51D7] text-white font-bold shadow-xs'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className={`w-full max-w-md ${currentTheme.card} rounded-3xl p-8 transition-all duration-300`}>
        {/* Header / Brand */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#3F51D7] to-[#6372EA] text-white font-black text-2xl flex items-center justify-center mx-auto mb-3 shadow-md shadow-[#3F51D7]/25">
            TS
          </div>
          <h1 className={`text-xl font-extrabold tracking-tight ${activeTheme === 'dark' ? 'text-white' : 'text-[#182033]'}`}>
            Telegram Shop Platform
          </h1>
          <p className={`text-xs mt-1 ${activeTheme === 'dark' ? 'text-gray-400' : 'text-[#667085]'}`}>
            Multi-Tenant SaaS &middot; Secure Portal Login
          </p>
        </div>

        {status && (
          <div className="mb-4 text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-xl p-3">
            {status}
          </div>
        )}

        {/* Demo Account Credentials */}
        <div className={`rounded-2xl p-3.5 mb-5 text-[11px] border ${activeTheme === 'dark' ? 'bg-[#121929] border-[#2A3555]' : 'bg-gray-50/80 border-[#E6E8EF]'}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold uppercase tracking-wider text-[10px] text-gray-500">Demo Quick Access</span>
            <span className="text-[10px] text-gray-400">Click to autofill</span>
          </div>
          <div className="space-y-1.5">
            <button
              type="button"
              onClick={() => fillLogin('admin@example.com', 'password123')}
              className="w-full flex items-center justify-between p-1.5 rounded-lg hover:bg-blue-50/50 dark:hover:bg-blue-900/20 text-left transition"
            >
              <div className="flex items-center gap-1.5 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-[#3F51D7]" />
                <span className={activeTheme === 'dark' ? 'text-gray-200' : 'text-[#182033]'}>Platform Admin</span>
              </div>
              <span className="font-mono text-[10px] text-[#3F51D7] font-semibold">admin@example.com</span>
            </button>
            <button
              type="button"
              onClick={() => fillLogin('jenny@sellmate.com', 'password123')}
              className="w-full flex items-center justify-between p-1.5 rounded-lg hover:bg-blue-50/50 dark:hover:bg-blue-900/20 text-left transition"
            >
              <div className="flex items-center gap-1.5 font-medium">
                <Store className="w-3.5 h-3.5 text-emerald-600" />
                <span className={activeTheme === 'dark' ? 'text-gray-200' : 'text-[#182033]'}>Shop Owner (SellMate)</span>
              </div>
              <span className="font-mono text-[10px] text-emerald-600 font-semibold">jenny@sellmate.com</span>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={`block text-xs font-bold mb-1.5 ${activeTheme === 'dark' ? 'text-gray-200' : 'text-[#182033]'}`}>
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              <input
                value={data.email}
                onChange={(e) => setData('email', e.target.value)}
                type="email"
                required
                placeholder="name@domain.com"
                className={`w-full text-xs rounded-xl pl-10 pr-3.5 py-2.5 outline-none transition ${currentTheme.focusRing} ${
                  activeTheme === 'dark'
                    ? 'bg-[#121929] border border-[#2B354F] text-white placeholder-gray-500'
                    : 'bg-gray-50/50 border border-[#E6E8EF] text-[#182033] placeholder-gray-400'
                }`}
              />
            </div>
            {errors.email && <div className="text-[11px] text-red-500 font-medium mt-1">{errors.email}</div>}
          </div>

          <div>
            <label className={`block text-xs font-bold mb-1.5 ${activeTheme === 'dark' ? 'text-gray-200' : 'text-[#182033]'}`}>
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              <input
                value={data.password}
                onChange={(e) => setData('password', e.target.value)}
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                className={`w-full text-xs rounded-xl pl-10 pr-10 py-2.5 outline-none transition ${currentTheme.focusRing} ${
                  activeTheme === 'dark'
                    ? 'bg-[#121929] border border-[#2B354F] text-white placeholder-gray-500'
                    : 'bg-gray-50/50 border border-[#E6E8EF] text-[#182033] placeholder-gray-400'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && <div className="text-[11px] text-red-500 font-medium mt-1">{errors.password}</div>}
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={data.remember}
                onChange={(e) => setData('remember', e.target.checked)}
                className="w-4 h-4 rounded text-[#3F51D7] focus:ring-[#3F51D7] border-gray-300"
              />
              <span className={activeTheme === 'dark' ? 'text-gray-300' : 'text-[#667085]'}>Keep me signed in</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={processing}
            className={`w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition disabled:opacity-50 ${currentTheme.primaryBtn}`}
          >
            <span>{processing ? 'Authenticating...' : 'Sign In'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Notice explaining Admin-Only Registration */}
        <div className={`mt-6 pt-4 border-t text-center ${activeTheme === 'dark' ? 'border-[#2B354F] text-gray-400' : 'border-gray-100 text-[#667085]'}`}>
          <p className="text-[11px]">
            New shop? Contact the platform administrator to provision your store tenant.
          </p>
          <div className="mt-2">
            <Link href="/" className="text-xs font-semibold text-[#3F51D7] hover:underline">
              &larr; Return to Marketplace Storefront
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
