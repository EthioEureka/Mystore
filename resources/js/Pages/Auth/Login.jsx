import React from 'react';
import { Link, useForm } from '@inertiajs/react';

export default function Login() {
  const { data, setData, post, processing, errors } = useForm({
    email: '',
    password: '',
    remember: true,
  });

  function fillLogin(email, pwd) {
    setData((prev) => ({
      ...prev,
      email,
      password: pwd,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    post('/login');
  }

  return (
    <div className="min-h-screen bg-[#F6F7FB] flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-3xl border border-[#E6E8EF] p-8 shadow-sm">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#3F51D7] text-white font-black text-xl flex items-center justify-center mx-auto mb-2 shadow-sm">
            TS
          </div>
          <h2 className="text-lg font-bold text-[#182033]">Welcome to SellMate</h2>
          <p className="text-xs text-[#667085] mt-1">Sign in to your merchant or admin dashboard</p>
        </div>

        {/* Demo shortcuts */}
        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-3 mb-5 text-[11px] space-y-1">
          <div className="font-bold text-[#182033] mb-1">Demo Logins:</div>
          <div className="flex justify-between items-center text-[#667085]">
            <span>Shop Owner:</span>
            <button
              type="button"
              onClick={() => fillLogin('jenny@sellmate.com', 'password123')}
              className="font-mono text-[#3F51D7] font-semibold hover:underline"
            >
              jenny@sellmate.com
            </button>
          </div>
          <div className="flex justify-between items-center text-[#667085]">
            <span>Admin:</span>
            <button
              type="button"
              onClick={() => fillLogin('admin@example.com', 'password123')}
              className="font-mono text-[#3F51D7] font-semibold hover:underline"
            >
              admin@example.com
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#182033] mb-1">Email Address</label>
            <input
              value={data.email}
              onChange={(e) => setData('email', e.target.value)}
              type="email"
              required
              className="w-full text-xs border border-[#E6E8EF] rounded-xl px-3 py-2.5 focus:border-[#3F51D7] outline-none"
            />
            {errors.email && <div className="text-[10px] text-red-500 mt-1">{errors.email}</div>}
          </div>

          <div>
            <label className="block text-xs font-bold text-[#182033] mb-1">Password</label>
            <input
              value={data.password}
              onChange={(e) => setData('password', e.target.value)}
              type="password"
              required
              className="w-full text-xs border border-[#E6E8EF] rounded-xl px-3 py-2.5 focus:border-[#3F51D7] outline-none"
            />
            {errors.password && <div className="text-[10px] text-red-500 mt-1">{errors.password}</div>}
          </div>

          <button
            type="submit"
            disabled={processing}
            className="w-full py-3 bg-[#3F51D7] text-white font-bold text-xs rounded-xl shadow-xs hover:bg-[#3142BD] transition disabled:opacity-50"
          >
            Sign In &rarr;
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-gray-100 text-center">
          <Link href="/register" className="text-xs text-[#3F51D7] font-semibold hover:underline">
            Register new Shop Account &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}

