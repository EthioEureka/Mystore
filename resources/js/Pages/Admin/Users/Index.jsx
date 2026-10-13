import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { router } from '@inertiajs/react';

export default function AdminUsers({ users }) {
  function toggleUser(userId) {
    router.post(`/admin/users/${userId}/toggle-status`);
  }

  return (
    <AdminLayout title="Manage Users">
      <div className="bg-white rounded-3xl border border-[#E6E8EF] shadow-xs overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-[#E6E8EF] bg-gray-50/75 text-[#667085]">
              <th className="py-3.5 px-5 font-semibold">User</th>
              <th className="py-3.5 px-5 font-semibold">Role</th>
              <th className="py-3.5 px-5 font-semibold">Phone</th>
              <th className="py-3.5 px-5 font-semibold">Telegram</th>
              <th className="py-3.5 px-5 font-semibold">Status</th>
              <th className="py-3.5 px-5 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.data?.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50/50">
                <td className="py-3.5 px-5">
                  <div className="font-bold text-[#182033]">{user.name}</div>
                  <div className="text-[11px] text-[#667085]">{user.email}</div>
                </td>
                <td className="py-3.5 px-5">
                  <span className="px-2 py-0.5 rounded-full capitalize text-[10px] font-semibold bg-gray-100 text-gray-800">
                    {user.role.replace(/_/g, ' ')}
                  </span>
                </td>
                <td className="py-3.5 px-5 text-[#667085]">{user.phone || 'N/A'}</td>
                <td className="py-3.5 px-5 text-[#3F51D7]">
                  {user.telegram_username ? `@${user.telegram_username}` : '-'}
                </td>
                <td className="py-3.5 px-5">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      user.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                    }`}
                  >
                    {user.is_active ? 'Active' : 'Suspended'}
                  </span>
                </td>
                <td className="py-3.5 px-5 text-right">
                  <button
                    onClick={() => toggleUser(user.id)}
                    className={`font-semibold text-xs hover:underline ${
                      user.is_active ? 'text-red-500' : 'text-emerald-600'
                    }`}
                  >
                    {user.is_active ? 'Suspend' : 'Reactivate'}
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

