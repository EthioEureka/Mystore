import React from 'react';
import { Link, useForm } from '@inertiajs/react';

export default function Register() {
  const { data, setData, post, processing, errors } = useForm({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: 'shop_owner',
    shop_name: '',
    phone: '',
  });

  function handleSubmit(e) {
    e.preventDefault();
    post('/register');
  }

  return (
    <div className="min-h-screen bg-[#F6F7FB] flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-3xl border border-[#E6E8EF] p-8 shadow-sm">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#3F51D7] text-white font-black text-xl flex items-center justify-center mx-auto mb-2 shadow-sm">
            SM
          </div>
          <h2 className="text-lg font-bold text-[#182033]">Create Shop Owner Account</h2>
          <p className="text-xs text-[#667085] mt-1">Start selling on Telegram Marketplace</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#182033] mb-1">Your Full Name</label>
            <input
              value={data.name}
              onChange={(e) => setData('name', e.target.value)}
              type="text"
              required
              className="w-full text-xs border border-[#E6E8EF] rounded-xl px-3 py-2.5 focus:border-[#3F51D7] outline-none"
            />
            {errors.name && <div className="text-[10px] text-red-500 mt-1">{errors.name}</div>}
          </div>

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
            <label className="block text-xs font-bold text-[#182033] mb-1">Shop Name</label>
            <input
              value={data.shop_name}
              onChange={(e) => setData('shop_name', e.target.value)}
              type="text"
              required
              placeholder="e.g. Addis Electronic Hub"
              className="w-full text-xs border border-[#E6E8EF] rounded-xl px-3 py-2.5 focus:border-[#3F51D7] outline-none"
            />
            {errors.shop_name && <div className="text-[10px] text-red-500 mt-1">{errors.shop_name}</div>}
          </div>

          <div>
            <label className="block text-xs font-bold text-[#182033] mb-1">Phone Number</label>
            <input
              value={data.phone}
              onChange={(e) => setData('phone', e.target.value)}
              type="tel"
              placeholder="+251 91 123 4567"
              className="w-full text-xs border border-[#E6E8EF] rounded-xl px-3 py-2.5 focus:border-[#3F51D7] outline-none"
            />
            {errors.phone && <div className="text-[10px] text-red-500 mt-1">{errors.phone}</div>}
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

          <div>
            <label className="block text-xs font-bold text-[#182033] mb-1">Confirm Password</label>
            <input
              value={data.password_confirmation}
              onChange={(e) => setData('password_confirmation', e.target.value)}
              type="password"
              required
              className="w-full text-xs border border-[#E6E8EF] rounded-xl px-3 py-2.5 focus:border-[#3F51D7] outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={processing}
            className="w-full py-3 bg-[#3F51D7] text-white font-bold text-xs rounded-xl shadow-xs hover:bg-[#3142BD] transition disabled:opacity-50"
          >
            Create Store &rarr;
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-gray-100 text-center">
          <Link href="/login" className="text-xs text-[#3F51D7] font-semibold hover:underline">
            Already have an account? Sign in &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}

