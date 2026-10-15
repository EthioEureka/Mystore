import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { router } from '@inertiajs/react';
import { Users, Shield, UserCheck, UserX, Mail, Phone } from 'lucide-react';

export default function AdminUsers({ users }) {
  function toggleUser(userId) {
    router.post(`/admin/users/${userId}/toggle-status`);
  }

  return (
    <AdminLayout
      title="Platform Users & Security Moderation"
      subtitle="View all tenant owners, managers, staff, and super administrators"
    >
      <div className="bg-white rounded-3xl border border-[#E6E8EF] shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-[#E6E8EF] bg-gray-50/75 text-[#6B7280]">
              <th className="py-4 px-6 font-bold">User</th>
              <th className="py-4 px-6 font-bold">Role Hierarchy</th>
              <th className="py-4 px-6 font-bold">Phone Number</th>
              <th className="py-4 px-6 font-bold">Telegram Account</th>
              <th className="py-4 px-6 font-bold">Account Status</th>
              <th className="py-4 px-6 font-bold text-right">Moderation</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.data?.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50/60 transition">
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#EEF0FD] text-[#3F51D7] font-bold text-xs flex items-center justify-center shrink-0">
                      {user.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-extrabold text-[#111827] text-xs">{user.name}</div>
                      <div className="text-[11px] text-[#6B7280]">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl capitalize text-[10px] font-bold ${
                      user.role === 'admin'
                        ? 'bg-purple-50 text-purple-700 border border-purple-200'
                        : user.role === 'shop_owner'
                        ? 'bg-blue-50 text-[#3F51D7] border border-blue-200'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    <Shield className="w-3 h-3" />
                    <span>{user.role.replace(/_/g, ' ')}</span>
                  </span>
                </td>
                <td className="py-4 px-6 text-[#6B7280] font-medium">{user.phone || 'N/A'}</td>
                <td className="py-4 px-6 font-medium text-[#3F51D7]">
                  {user.telegram_username ? `@${user.telegram_username}` : '-'}
                </td>
                <td className="py-4 px-6">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      user.is_active
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${user.is_active ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                    {user.is_active ? 'Active' : 'Suspended'}
                  </span>
                </td>
                <td className="py-4 px-6 text-right">
                  <button
                    onClick={() => toggleUser(user.id)}
                    className={`px-3 py-1 rounded-xl font-bold text-xs transition ${
                      user.is_active
                        ? 'bg-rose-50 hover:bg-rose-100 text-rose-600'
                        : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-600'
                    }`}
                  >
                    {user.is_active ? 'Suspend User' : 'Reactivate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
