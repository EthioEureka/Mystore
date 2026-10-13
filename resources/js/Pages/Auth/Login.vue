<template>
  <div class="min-h-screen bg-[#F6F7FB] flex items-center justify-center p-4">
    <div class="w-full max-w-sm bg-white rounded-3xl border border-[#E6E8EF] p-8 shadow-sm">
      <div class="text-center mb-6">
        <div class="w-12 h-12 rounded-2xl bg-[#3F51D7] text-white font-black text-xl flex items-center justify-center mx-auto mb-2 shadow-sm">
          TS
        </div>
        <h2 class="text-lg font-bold text-[#182033]">Welcome to SellMate</h2>
        <p class="text-xs text-[#667085] mt-1">Sign in to your merchant or admin dashboard</p>
      </div>

      <!-- Demo shortcuts -->
      <div class="bg-gray-50 border border-gray-100 rounded-2xl p-3 mb-5 text-[11px] space-y-1">
        <div class="font-bold text-[#182033] mb-1">Demo Logins:</div>
        <div class="flex justify-between items-center text-[#667085]">
          <span>Shop Owner:</span>
          <button @click="fillLogin('jenny@sellmate.com', 'password123')" class="font-mono text-[#3F51D7] font-semibold hover:underline">
            jenny@sellmate.com
          </button>
        </div>
        <div class="flex justify-between items-center text-[#667085]">
          <span>Admin:</span>
          <button @click="fillLogin('admin@example.com', 'password123')" class="font-mono text-[#3F51D7] font-semibold hover:underline">
            admin@example.com
          </button>
        </div>
      </div>

      <form @submit.prevent="form.post('/login')" class="space-y-4">
        <div>
          <label class="block text-xs font-bold text-[#182033] mb-1">Email Address</label>
          <input
            v-model="form.email"
            type="email"
            required
            class="w-full text-xs border border-[#E6E8EF] rounded-xl px-3 py-2.5 focus:border-[#3F51D7] outline-none"
          />
          <div v-if="form.errors.email" class="text-[10px] text-red-500 mt-1">{{ form.errors.email }}</div>
        </div>

        <div>
          <label class="block text-xs font-bold text-[#182033] mb-1">Password</label>
          <input
            v-model="form.password"
            type="password"
            required
            class="w-full text-xs border border-[#E6E8EF] rounded-xl px-3 py-2.5 focus:border-[#3F51D7] outline-none"
          />
          <div v-if="form.errors.password" class="text-[10px] text-red-500 mt-1">{{ form.errors.password }}</div>
        </div>

        <button
          type="submit"
          :disabled="form.processing"
          class="w-full py-3 bg-[#3F51D7] text-white font-bold text-xs rounded-xl shadow-xs hover:bg-[#3142BD] transition disabled:opacity-50"
        >
          Sign In &rarr;
        </button>
      </form>

      <div class="mt-6 pt-4 border-t border-gray-100 text-center">
        <Link href="/register" class="text-xs text-[#3F51D7] font-semibold hover:underline">
          Register new Shop Account &rarr;
        </Link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Link, useForm } from '@inertiajs/vue3';

const form = useForm({
  email: '',
  password: '',
  remember: true,
});

function fillLogin(email, pwd) {
  form.email = email;
  form.password = pwd;
}
</script>
