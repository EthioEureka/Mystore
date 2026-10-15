import React, { useState } from 'react';
import ManagerLayout from '@/Layouts/ManagerLayout';
import { useForm, router } from '@inertiajs/react';
import { UserPlus, Shield, ShieldCheck, Mail, Phone, Lock, Edit2, Trash2, X, CheckCircle2 } from 'lucide-react';

export default function ShopUsersIndex({ shop, users, availableRoles }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // Form for adding a new user
  const addForm = useForm({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'shop_staff',
  });

  // Form for editing an existing user
  const editForm = useForm({
    name: '',
    phone: '',
    is_active: true,
    password: '',
    role: 'shop_staff',
  });

  function handleCreateSubmit(e) {
    e.preventDefault();
    addForm.post('/manager/users', {
      onSuccess: () => {
        addForm.reset();
        setShowAddModal(false);
      },
    });
  }

  function handleEditOpen(user) {
    setEditingUser(user);
    editForm.setData({
      name: user.name,
      phone: user.phone || '',
      is_active: user.is_active,
      password: '',
      role: user.roles[0] || 'shop_staff',
    });
  }

  function handleEditSubmit(e) {
    e.preventDefault();
    editForm.put(`/manager/users/${editingUser.id}`, {
      onSuccess: () => {
        setEditingUser(null);
      },
    });
  }

  function handleDelete(user) {
    if (confirm(`Are you sure you want to remove ${user.name} from this shop?`)) {
      router.delete(`/manager/users/${user.id}`);
    }
  }

  return (
    <ManagerLayout title="Shop Staff & Role-Based Access Control" shop={shop}>
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h3 className="text-base font-extrabold text-[#182033]">Staff & Permissions</h3>
          <p className="text-xs text-[#667085] mt-0.5">
            Manage your store's team members, assign RBAC roles, and control access permissions.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#3F51D7] text-white font-bold text-xs rounded-xl shadow-xs hover:bg-[#3142BD] transition self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add Staff Member</span>
        </button>
      </div>

      {/* Role explanation cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-2xl p-4 border border-[#E6E8EF] shadow-xs">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <h4 className="text-xs font-bold text-[#182033]">Shop Owner</h4>
          </div>
          <p className="text-[11px] text-[#667085] leading-relaxed">
            Full control over store settings, products, inventory, customer inquiries, and staff role assignments.
          </p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-[#E6E8EF] shadow-xs">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#3F51D7]"></span>
            <h4 className="text-xs font-bold text-[#182033]">Shop Manager</h4>
          </div>
          <p className="text-[11px] text-[#667085] leading-relaxed">
            Can manage the product catalog, adjust inventory levels, reply to inquiries, and view team staff.
          </p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-[#E6E8EF] shadow-xs">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-400"></span>
            <h4 className="text-xs font-bold text-[#182033]">Shop Staff / Clerk</h4>
          </div>
          <p className="text-[11px] text-[#667085] leading-relaxed">
            Can create & update products, view inventory stock, and respond to customer purchase requests.
          </p>
        </div>
      </div>

      {/* Users table */}
      <div className="bg-white rounded-3xl border border-[#E6E8EF] shadow-xs overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-[#E6E8EF] bg-gray-50/75 text-[#667085]">
              <th className="py-3.5 px-5 font-semibold">Staff Member</th>
              <th className="py-3.5 px-5 font-semibold">Contact Info</th>
              <th className="py-3.5 px-5 font-semibold">Assigned Role (Spatie RBAC)</th>
              <th className="py-3.5 px-5 font-semibold">Status</th>
              <th className="py-3.5 px-5 font-semibold">Joined</th>
              <th className="py-3.5 px-5 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50/50 transition">
                <td className="py-3.5 px-5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#EEF0FD] text-[#3F51D7] font-bold text-xs flex items-center justify-center">
                      {u.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-bold text-[#182033] flex items-center gap-1.5">
                        <span>{u.name}</span>
                        {u.is_owner && (
                          <span className="px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-extrabold border border-emerald-200">
                            Owner
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-[#667085]">{u.email}</div>
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-5 text-[#667085]">
                  <div>{u.phone || 'No phone'}</div>
                </td>
                <td className="py-3.5 px-5">
                  <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-bold capitalize bg-blue-50 text-[#3F51D7] border border-blue-200/60">
                    <Shield className="w-3 h-3" />
                    <span>{u.primary_role.replace('_', ' ')}</span>
                  </div>
                </td>
                <td className="py-3.5 px-5">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                      u.is_active
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}
                  >
                    {u.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="py-3.5 px-5 text-[#667085]">{u.created_at}</td>
                <td className="py-3.5 px-5 text-right">
                  {!u.is_owner ? (
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEditOpen(u)}
                        className="p-1.5 text-gray-500 hover:text-[#3F51D7] hover:bg-gray-100 rounded-lg transition"
                        title="Edit Staff"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(u)}
                        className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Remove Staff"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <span className="text-[11px] text-gray-400 font-medium">Primary Account</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Staff Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-[#E6E8EF] shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#EEF0FD] text-[#3F51D7] flex items-center justify-center font-bold">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#182033]">Add Shop Staff Member</h3>
                  <p className="text-[11px] text-[#667085]">Grant access to manage this store</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-[#182033] mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={addForm.data.name}
                  onChange={(e) => addForm.setData('name', e.target.value)}
                  placeholder="e.g. Almaz Bekele"
                  className="w-full text-xs rounded-xl border border-[#E6E8EF] px-3 py-2.5 outline-none focus:border-[#3F51D7]"
                />
                {addForm.errors.name && <div className="text-[10px] text-red-500 mt-1">{addForm.errors.name}</div>}
              </div>

              <div>
                <label className="block text-xs font-bold text-[#182033] mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={addForm.data.email}
                  onChange={(e) => addForm.setData('email', e.target.value)}
                  placeholder="staff@example.com"
                  className="w-full text-xs rounded-xl border border-[#E6E8EF] px-3 py-2.5 outline-none focus:border-[#3F51D7]"
                />
                {addForm.errors.email && <div className="text-[10px] text-red-500 mt-1">{addForm.errors.email}</div>}
              </div>

              <div>
                <label className="block text-xs font-bold text-[#182033] mb-1">Phone Number</label>
                <input
                  type="text"
                  value={addForm.data.phone}
                  onChange={(e) => addForm.setData('phone', e.target.value)}
                  placeholder="+251 91 234 5678"
                  className="w-full text-xs rounded-xl border border-[#E6E8EF] px-3 py-2.5 outline-none focus:border-[#3F51D7]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#182033] mb-1">Password *</label>
                <input
                  type="password"
                  required
                  value={addForm.data.password}
                  onChange={(e) => addForm.setData('password', e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full text-xs rounded-xl border border-[#E6E8EF] px-3 py-2.5 outline-none focus:border-[#3F51D7]"
                />
                {addForm.errors.password && <div className="text-[10px] text-red-500 mt-1">{addForm.errors.password}</div>}
              </div>

              <div>
                <label className="block text-xs font-bold text-[#182033] mb-1">Assigned Role (RBAC) *</label>
                <select
                  value={addForm.data.role}
                  onChange={(e) => addForm.setData('role', e.target.value)}
                  className="w-full text-xs rounded-xl border border-[#E6E8EF] px-3 py-2.5 outline-none focus:border-[#3F51D7] bg-white"
                >
                  {availableRoles.map((r) => (
                    <option key={r.name} value={r.name}>
                      {r.label} - {r.description}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addForm.processing}
                  className="px-5 py-2 text-xs font-bold bg-[#3F51D7] text-white rounded-xl shadow-xs hover:bg-[#3142BD] disabled:opacity-50"
                >
                  {addForm.processing ? 'Saving...' : 'Add Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Staff Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-[#E6E8EF] shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#EEF0FD] text-[#3F51D7] flex items-center justify-center font-bold">
                  <Edit2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#182033]">Edit Staff Member</h3>
                  <p className="text-[11px] text-[#667085]">{editingUser.email}</p>
                </div>
              </div>
              <button
                onClick={() => setEditingUser(null)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-[#182033] mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={editForm.data.name}
                  onChange={(e) => editForm.setData('name', e.target.value)}
                  className="w-full text-xs rounded-xl border border-[#E6E8EF] px-3 py-2.5 outline-none focus:border-[#3F51D7]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#182033] mb-1">Phone Number</label>
                <input
                  type="text"
                  value={editForm.data.phone}
                  onChange={(e) => editForm.setData('phone', e.target.value)}
                  className="w-full text-xs rounded-xl border border-[#E6E8EF] px-3 py-2.5 outline-none focus:border-[#3F51D7]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#182033] mb-1">Assigned Role (RBAC) *</label>
                <select
                  value={editForm.data.role}
                  onChange={(e) => editForm.setData('role', e.target.value)}
                  className="w-full text-xs rounded-xl border border-[#E6E8EF] px-3 py-2.5 outline-none focus:border-[#3F51D7] bg-white"
                >
                  {availableRoles.map((r) => (
                    <option key={r.name} value={r.name}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#182033] mb-1">New Password (leave blank to keep)</label>
                <input
                  type="password"
                  value={editForm.data.password}
                  onChange={(e) => editForm.setData('password', e.target.value)}
                  placeholder="Optional new password"
                  className="w-full text-xs rounded-xl border border-[#E6E8EF] px-3 py-2.5 outline-none focus:border-[#3F51D7]"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={editForm.data.is_active}
                    onChange={(e) => editForm.setData('is_active', e.target.checked)}
                    className="w-4 h-4 rounded text-[#3F51D7] focus:ring-[#3F51D7] border-gray-300"
                  />
                  <span className="text-xs font-bold text-[#182033]">Active account status</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editForm.processing}
                  className="px-5 py-2 text-xs font-bold bg-[#3F51D7] text-white rounded-xl shadow-xs hover:bg-[#3142BD] disabled:opacity-50"
                >
                  {editForm.processing ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </ManagerLayout>
  );
}

