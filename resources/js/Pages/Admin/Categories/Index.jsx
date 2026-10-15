import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useForm } from '@inertiajs/react';
import { Tag, Plus, Layers, Hash } from 'lucide-react';

export default function AdminCategories({ categories }) {
  const { data, setData, post, processing, reset, errors } = useForm({
    name: '',
    slug: '',
    display_order: 10,
    is_active: true,
  });

  function handleSubmit(e) {
    e.preventDefault();
    post('/admin/categories', { onSuccess: () => reset() });
  }

  return (
    <AdminLayout
      title="Category Hierarchy"
      subtitle="Organize multi-tenant product catalog classification & taxonomy"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Categories Table (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-[#E6E8EF] shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#E6E8EF] bg-gray-50/75 text-[#6B7280]">
                <th className="py-4 px-6 font-bold">Category</th>
                <th className="py-4 px-6 font-bold">Slug Key</th>
                <th className="py-4 px-6 font-bold">Stores</th>
                <th className="py-4 px-6 font-bold">Products</th>
                <th className="py-4 px-6 font-bold">Display Priority</th>
                <th className="py-4 px-6 font-bold text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {categories?.map((cat) => (
                <tr key={cat.id} className="hover:bg-gray-50/60 transition">
                  <td className="py-4 px-6">
                    <div className="font-extrabold text-[#111827] text-sm flex items-center gap-2">
                      <Tag className="w-4 h-4 text-[#3F51D7]" />
                      <span>{cat.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 font-mono text-[11px] text-[#6B7280]">{cat.slug}</td>
                  <td className="py-4 px-6 font-semibold text-[#111827]">{cat.shops_count || 0}</td>
                  <td className="py-4 px-6 font-semibold text-[#111827]">{cat.products_count || 0}</td>
                  <td className="py-4 px-6 font-mono font-medium text-gray-500">#{cat.display_order}</td>
                  <td className="py-4 px-6 text-right">
                    <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full text-[10px] font-bold border border-emerald-200">
                      Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add Category Form (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-[#E6E8EF] shadow-sm h-fit">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
            <div className="w-8 h-8 rounded-xl bg-[#EEF0FD] text-[#3F51D7] flex items-center justify-center font-bold">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-[#111827]">New Category</h4>
              <p className="text-[11px] text-[#6B7280]">Add new marketplace classification</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#111827] mb-1">Category Name *</label>
              <input
                value={data.name}
                onChange={(e) => {
                  const val = e.target.value;
                  const slugVal = val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                  setData((prev) => ({ ...prev, name: val, slug: slugVal }));
                }}
                type="text"
                required
                placeholder="e.g. Footwear & Shoes"
                className="w-full text-xs border border-[#E6E8EF] rounded-xl px-3.5 py-2.5 outline-none focus:border-[#3F51D7]"
              />
              {errors.name && <div className="text-[10px] text-red-500 mt-1">{errors.name}</div>}
            </div>

            <div>
              <label className="block text-xs font-bold text-[#111827] mb-1">URL Slug *</label>
              <input
                value={data.slug}
                onChange={(e) => setData('slug', e.target.value)}
                type="text"
                required
                placeholder="footwear-shoes"
                className="w-full text-xs border border-[#E6E8EF] rounded-xl px-3.5 py-2.5 outline-none font-mono focus:border-[#3F51D7]"
              />
              {errors.slug && <div className="text-[10px] text-red-500 mt-1">{errors.slug}</div>}
            </div>

            <div>
              <label className="block text-xs font-bold text-[#111827] mb-1">Display Priority Order</label>
              <input
                value={data.display_order}
                onChange={(e) => setData('display_order', Number(e.target.value))}
                type="number"
                required
                className="w-full text-xs border border-[#E6E8EF] rounded-xl px-3.5 py-2.5 outline-none focus:border-[#3F51D7]"
              />
            </div>

            <button
              type="submit"
              disabled={processing}
              className="w-full py-2.5 bg-[#3F51D7] hover:bg-[#3142BD] text-white font-bold text-xs rounded-xl shadow-xs transition disabled:opacity-50"
            >
              {processing ? 'Creating...' : 'Create Category'}
            </button>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}
