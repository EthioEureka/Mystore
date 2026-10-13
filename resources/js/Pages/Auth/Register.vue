<template>
  <div class="min-h-screen bg-[#F6F7FB] flex items-center justify-center p-4">
    <div class="w-full max-w-sm bg-white rounded-3xl border border-[#E6E8EF] p-8 shadow-sm">
      <div class="text-center mb-6">
        <div class="w-12 h-12 rounded-2xl bg-[#3F51D7] text-white font-black text-xl flex items-center justify-center mx-auto mb-2 shadow-sm">
          SM
        </div>
        <h2 class="text-lg font-bold text-[#182033]">Create Shop Owner Account</h2>
        <p class="text-xs text-[#667085] mt-1">Start selling on Telegram Marketplace</p>
      </div>

      <form @submit.prevent="form.post('/register')" class="space-y-4">
        <div>
          <label class="block text-xs font-bold text-[#182033] mb-1">Your Full Name</label>
          <input
            v-model="form.name"
            type="text"
            required
            class="w-full text-xs border border-[#E6E8EF] rounded-xl px-3 py-2.5 focus:border-[#3F51D7] outline-none"
          />
        </div>

        <div>
          <label class="block text-xs font-bold text-[#182033] mb-1">Email Address</label>
          <input
            v-model="form.email"
            type="email"
            required
            class="w-full text-xs border border-[#E6E8EF] rounded-xl px-3 py-2.5 focus:border-[#3F51D7] outline-none"
          />
        </div>

        <div>
          <label class="block text-xs font-bold text-[#182033] mb-1">Shop Name</label>
          <input
            v-model="form.shop_name"
            type="text"
            required
            placeholder="e.g. Addis Electronic Hub"
            class="w-full text-xs border border-[#E6E8EF] rounded-xl px-3 py-2.5 focus:border-[#3F51D7] outline-none"
          />
        </div>

        <div>
          <label class="block text-xs font-bold text-[#182033] mb-1">Phone Number</label>
          <input
            v-model="form.phone"
            type="tel"
            placeholder="+251 91 123 4567"
            class="w-full text-xs border border-[#E6E8EF] rounded-xl px-3 py-2.5 focus:border-[#3F51D7] outline-none"
          />
        </div>

        <div>
          <label class="block text-xs font-bold text-[#182033] mb-1">Password</label>
          <input
            v-model="form.password"
            type="password"
            required
            class="w-full text-xs border border-[#E6E8EF] rounded-xl px-3 py-2.5 focus:border-[#3F51D7] outline-none"
          />
        </div>

        <div>
          <label class="block text-xs font-bold text-[#182033] mb-1">Confirm Password</label>
          <input
            v-model="form.password_confirmation"
            type="password"
            required
            class="w-full text-xs border border-[#E6E8EF] rounded-xl px-3 py-2.5 focus:border-[#3F51D7] outline-none"
          />
        </div>

        <button
          type="submit"
          :disabled="form.processing"
          class="w-full py-3 bg-[#3F51D7] text-white font-bold text-xs rounded-xl shadow-xs hover:bg-[#3142BD] transition disabled:opacity-50"
        >
          Create Store &rarr;
        </button>
      </form>

      <div class="mt-6 pt-4 border-t border-gray-100 text-center">
        <Link href="/login" class="text-xs text-[#3F51D7] font-semibold hover:underline">
          Already have an account? Sign in &rarr;
        </Link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Link, useForm } from '@inertiajs/vue3';

const form = useForm({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
  role: 'shop_owner',
  shop_name: '',
  phone: '',
});
</script>
