import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useForm, router, Link } from '@inertiajs/react';
import {
  Store,
  Plus,
  LogIn,
  Search,
  CheckCircle,
  AlertTriangle,
  XCircle,
  ExternalLink,
  Shield,
  X,
  Mail,
  Phone,
  User,
  Tag,
  Building,
  Key,
} from 'lucide-react';

export default function AdminShopsIndex({ shops, categories, filters }) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState(filters?.search || '');

  // Form for admin registering a new shop tenant
  const createForm = useForm({
    name: '',
    category_id: categories?.[0]?.id || '',
    description: '',
    public_phone: '',
    public_telegram_username: '',
    public_address: '',
    business_hours: '',
    delivery_note: '',

    // Owner details
    owner_name: '',
    owner_email: '',
    owner_password: '',
    owner_phone: '',
  });

  function handleCreateShop(e) {
    e.preventDefault();
    createForm.post('/admin/shops', {
      onSuccess: () => {
        createForm.reset();
        setShowCreateModal(false);
      },
    });
  }

  function handleSearch(e) {
    e.preventDefault();
    router.get('/admin/shops', { search: searchTerm, status: filters?.status || '' }, { preserveState: true });
  }

  function handleStatusFilter(status) {
    router.get('/admin/shops', { search: searchTerm, status }, { preserveState: true });
  }

  function updateStatus(shopId, status) {
    const reason = prompt(`Enter reason for marking status as ${status} (optional):`);
    router.put(`/admin/shops/${shopId}/status`, { status, reason });
  }

  function handleImpersonate(shopId) {
    router.post(`/admin/shops/${shopId}/impersonate`);
  }

  return (
    <AdminLayout
      title="Shops & Tenant Management"
      subtitle="Register new shop tenants, moderate storefronts, and directly access merchant dashboards"
    >
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <form onSubmit={handleSearch} className="flex-1 max-w-md relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search stores by name or slug..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E6E8EF] rounded-2xl text-xs outline-none focus:border-[#3F51D7] shadow-xs"
          />
        </form>

        <div className="flex items-center gap-3">
          {/* Status filters */}
          <div className="flex p-1 bg-white border border-[#E6E8EF] rounded-2xl text-xs">
            {['', 'approved', 'pending', 'suspended'].map((s) => (
              <button
                key={s}
                onClick={() => handleStatusFilter(s)}
                className={`px-3 py-1.5 rounded-xl capitalize font-semibold transition ${
                  (filters?.status || '') === s
                    ? 'bg-[#3F51D7] text-white shadow-xs'
                    : 'text-[#6B7280] hover:text-[#111827]'
                }`}
              >
                {s || 'All'}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#3F51D7] hover:bg-[#3142BD] text-white font-bold text-xs rounded-2xl shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            <span>Register New Shop</span>
          </button>
        </div>
      </div>

      {/* Shops Table */}
      <div className="bg-white rounded-3xl border border-[#E6E8EF] shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-[#E6E8EF] bg-gray-50/75 text-[#6B7280]">
              <th className="py-4 px-6 font-bold">Shop & Tenant</th>
              <th className="py-4 px-6 font-bold">Primary Owner</th>
              <th className="py-4 px-6 font-bold">Category</th>
              <th className="py-4 px-6 font-bold">Catalog</th>
              <th className="py-4 px-6 font-bold">Status</th>
              <th className="py-4 px-6 font-bold text-right">Direct Tenant Access</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {shops.data?.map((shop) => (
              <tr key={shop.id} className="hover:bg-gray-50/60 transition">
                {/* Shop Info */}
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#EEF0FD] text-[#3F51D7] font-black text-sm flex items-center justify-center shrink-0 border border-[#3F51D7]/15">
                      {shop.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-extrabold text-[#111827] text-sm">{shop.name}</div>
                      <div className="text-[11px] text-[#6B7280] font-mono mt-0.5">/shops/{shop.slug}</div>
                    </div>
                  </div>
                </td>

                {/* Owner */}
                <td className="py-4 px-6">
                  <div className="font-bold text-[#111827]">{shop.owner?.name}</div>
                  <div className="text-[11px] text-[#6B7280]">{shop.owner?.email}</div>
                </td>

                {/* Category */}
                <td className="py-4 px-6">
                  <span className="px-2.5 py-1 rounded-xl bg-gray-100 text-gray-800 font-medium text-[11px]">
                    {shop.category?.name || 'General'}
                  </span>
                </td>

                {/* Stats */}
                <td className="py-4 px-6">
                  <div className="font-bold text-[#111827]">{shop.products_count} Products</div>
                  <div className="text-[11px] text-[#6B7280]">{shop.inquiries_count} Inquiries</div>
                </td>

                {/* Status */}
                <td className="py-4 px-6">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold capitalize ${
                      shop.status === 'approved'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : shop.status === 'pending'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      shop.status === 'approved' ? 'bg-emerald-500' : shop.status === 'pending' ? 'bg-amber-500' : 'bg-rose-500'
                    }`}></span>
                    {shop.status}
                  </span>
                </td>

                {/* Direct Actions: Access Dashboard & Moderation */}
                <td className="py-4 px-6 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {/* Access Shop Dashboard directly */}
                    <button
                      onClick={() => handleImpersonate(shop.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#EEF0FD] hover:bg-[#3F51D7] text-[#3F51D7] hover:text-white font-bold rounded-xl text-xs transition shadow-2xs group"
                      title="Open and manage this shop dashboard as administrator"
                    >
                      <LogIn className="w-3.5 h-3.5 text-[#3F51D7] group-hover:text-white" />
                      <span>Access Dashboard</span>
                    </button>

                    {/* Status toggles */}
                    {shop.status !== 'approved' && (
                      <button
                        onClick={() => updateStatus(shop.id, 'approved')}
                        className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg"
                        title="Approve Shop"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    )}
                    {shop.status !== 'suspended' && (
                      <button
                        onClick={() => updateStatus(shop.id, 'suspended')}
                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg"
                        title="Suspend Shop"
                      >
                        <AlertTriangle className="w-4 h-4" />
                      </button>
                    )}

                    <a
                      href={`/shops/${shop.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg"
                      title="Preview Storefront"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {(!shops.data || shops.data.length === 0) && (
          <div className="py-12 text-center text-[#6B7280]">
            No shop tenants found matching your query.
          </div>
        )}
      </div>

      {/* Admin Shop Registration Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 lg:p-8 border border-[#E6E8EF] shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#EEF0FD] text-[#3F51D7] flex items-center justify-center font-bold">
                  <Building className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[#111827]">Provision New Shop Tenant</h3>
                  <p className="text-xs text-[#6B7280]">Register store and assign initial owner credentials (Admin Only)</p>
                </div>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1.5 rounded-xl hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateShop} className="space-y-6">
              {/* Shop Section */}
              <div>
                <h4 className="text-xs font-black text-[#111827] uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Store className="w-4 h-4 text-[#3F51D7]" /> Storefront Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#111827] mb-1">Shop Name *</label>
                    <input
                      type="text"
                      required
                      value={createForm.data.name}
                      onChange={(e) => createForm.setData('name', e.target.value)}
                      placeholder="e.g. Addis Luxury Wear"
                      className="w-full text-xs rounded-xl border border-[#E6E8EF] px-3.5 py-2.5 outline-none focus:border-[#3F51D7]"
                    />
                    {createForm.errors.name && <div className="text-[10px] text-red-500 mt-1">{createForm.errors.name}</div>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#111827] mb-1">Primary Category *</label>
                    <select
                      value={createForm.data.category_id}
                      onChange={(e) => createForm.setData('category_id', e.target.value)}
                      className="w-full text-xs rounded-xl border border-[#E6E8EF] px-3.5 py-2.5 outline-none focus:border-[#3F51D7] bg-white"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#111827] mb-1">Public Phone</label>
                    <input
                      type="text"
                      value={createForm.data.public_phone}
                      onChange={(e) => createForm.setData('public_phone', e.target.value)}
                      placeholder="+251 91 100 2233"
                      className="w-full text-xs rounded-xl border border-[#E6E8EF] px-3.5 py-2.5 outline-none focus:border-[#3F51D7]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#111827] mb-1">Public Telegram Username</label>
                    <input
                      type="text"
                      value={createForm.data.public_telegram_username}
                      onChange={(e) => createForm.setData('public_telegram_username', e.target.value)}
                      placeholder="addis_luxury"
                      className="w-full text-xs rounded-xl border border-[#E6E8EF] px-3.5 py-2.5 outline-none focus:border-[#3F51D7]"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-[#111827] mb-1">Address / Pickup Location</label>
                    <input
                      type="text"
                      value={createForm.data.public_address}
                      onChange={(e) => createForm.setData('public_address', e.target.value)}
                      placeholder="e.g. Bole Road, Mega Building 3rd Floor"
                      className="w-full text-xs rounded-xl border border-[#E6E8EF] px-3.5 py-2.5 outline-none focus:border-[#3F51D7]"
                    />
                  </div>
                </div>
              </div>

              {/* Owner Account Section */}
              <div className="pt-4 border-t border-gray-100">
                <h4 className="text-xs font-black text-[#111827] uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <User className="w-4 h-4 text-[#3F51D7]" /> Primary Owner Account (Credentials)
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#111827] mb-1">Owner Full Name *</label>
                    <input
                      type="text"
                      required
                      value={createForm.data.owner_name}
                      onChange={(e) => createForm.setData('owner_name', e.target.value)}
                      placeholder="e.g. Dawit Kebede"
                      className="w-full text-xs rounded-xl border border-[#E6E8EF] px-3.5 py-2.5 outline-none focus:border-[#3F51D7]"
                    />
                    {createForm.errors.owner_name && <div className="text-[10px] text-red-500 mt-1">{createForm.errors.owner_name}</div>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#111827] mb-1">Owner Login Email *</label>
                    <input
                      type="email"
                      required
                      value={createForm.data.owner_email}
                      onChange={(e) => createForm.setData('owner_email', e.target.value)}
                      placeholder="owner@store.com"
                      className="w-full text-xs rounded-xl border border-[#E6E8EF] px-3.5 py-2.5 outline-none focus:border-[#3F51D7]"
                    />
                    {createForm.errors.owner_email && <div className="text-[10px] text-red-500 mt-1">{createForm.errors.owner_email}</div>}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-[#111827] mb-1">Owner Initial Password *</label>
                    <input
                      type="password"
                      required
                      value={createForm.data.owner_password}
                      onChange={(e) => createForm.setData('owner_password', e.target.value)}
                      placeholder="Minimum 6 characters"
                      className="w-full text-xs rounded-xl border border-[#E6E8EF] px-3.5 py-2.5 outline-none focus:border-[#3F51D7]"
                    />
                    {createForm.errors.owner_password && <div className="text-[10px] text-red-500 mt-1">{createForm.errors.owner_password}</div>}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2.5 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createForm.processing}
                  className="px-6 py-2.5 text-xs font-bold bg-[#3F51D7] text-white rounded-xl shadow-md hover:bg-[#3142BD] transition disabled:opacity-50"
                >
                  {createForm.processing ? 'Provisioning Store...' : 'Create & Provision Tenant'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
