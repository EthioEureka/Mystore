<template>
  <AdminLayout title="Manage Users">
    <div class="bg-white rounded-3xl border border-[#E6E8EF] shadow-xs overflow-hidden">
      <table class="w-full text-left border-collapse text-xs">
        <thead>
          <tr class="border-b border-[#E6E8EF] bg-gray-50/75 text-[#667085]">
            <th class="py-3.5 px-5 font-semibold">User</th>
            <th class="py-3.5 px-5 font-semibold">Role</th>
            <th class="py-3.5 px-5 font-semibold">Phone</th>
            <th class="py-3.5 px-5 font-semibold">Telegram</th>
            <th class="py-3.5 px-5 font-semibold">Status</th>
            <th class="py-3.5 px-5 font-semibold text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="user in users.data" :key="user.id" class="hover:bg-gray-50/50">
            <td class="py-3.5 px-5">
              <div class="font-bold text-[#182033]">{{ user.name }}</div>
              <div class="text-[11px] text-[#667085]">{{ user.email }}</div>
            </td>
            <td class="py-3.5 px-5">
              <span class="px-2 py-0.5 rounded-full capitalize text-[10px] font-semibold bg-gray-100 text-gray-800">
                {{ user.role.replace('_', ' ') }}
              </span>
            </td>
            <td class="py-3.5 px-5 text-[#667085]">{{ user.phone || 'N/A' }}</td>
            <td class="py-3.5 px-5 text-[#3F51D7]">
              {{ user.telegram_username ? `@${user.telegram_username}` : '-' }}
            </td>
            <td class="py-3.5 px-5">
              <span
                class="px-2 py-0.5 rounded-full text-[10px] font-semibold"
                :class="user.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'"
              >
                {{ user.is_active ? 'Active' : 'Suspended' }}
              </span>
            </td>
            <td class="py-3.5 px-5 text-right">
              <button
                @click="toggleUser(user.id)"
                class="font-semibold text-xs hover:underline"
                :class="user.is_active ? 'text-red-500' : 'text-emerald-600'"
              >
                {{ user.is_active ? 'Suspend' : 'Reactivate' }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </AdminLayout>
</template>

<script setup>
import AdminLayout from '@/Layouts/AdminLayout.vue';
import { router } from '@inertiajs/vue3';

defineProps({
  users: Object,
});

function toggleUser(userId) {
  router.post(`/admin/users/${userId}/toggle-status`);
}
</script>
