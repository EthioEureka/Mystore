import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useForm } from '@inertiajs/react';

export default function AdminCategories({ categories }) {
  const { data, setData, post, processing, reset } = useForm({
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
    <AdminLayout title="Manage Categories">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white rounded-3xl border border-[#E6E8EF] shadow-xs overflow-hidden">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#E6E8EF] bg-gray-50/75 text-[#667085]">
                <th className="py-3.5 px-5 font-semibold">Name</th>
                <th className="py-3.5 px-5 font-semibold">Slug</th>
                <th className="py-3.5 px-5 font-semibold">Products</th>
                <th className="py-3.5 px-5 font-semibold">Order</th>
                <th className="py-3.5 px-5 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {categories?.map((cat) => (
                <tr key={cat.id} className="hover:bg-gray-50/50">
                  <td className="py-3.5 px-5 font-bold text-[#182033]">{cat.name}</td>
                  <td className="py-3.5 px-5 font-mono text-[#667085]">{cat.slug}</td>
                  <td className="py-3.5 px-5">{cat.products_count}</td>
                  <td className="py-3.5 px-5">{cat.display_order}</td>
                  <td className="py-3.5 px-5">
                    <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full text-[10px] font-semibold">
                      Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add Category Form */}
        <div className="bg-white rounded-3xl p-6 border border-[#E6E8EF] shadow-xs">
          <h4 className="text-sm font-bold text-[#182033] mb-4">Add New Category</h4>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#182033] mb-1">Category Name</label>
              <input
                value={data.name}
                onChange={(e) => {
                  const val = e.target.value;
                  const slugVal = val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                  setData((prev) => ({ ...prev, name: val, slug: slugVal }));
                }}
                type="text"
                required
                className="w-full text-xs border border-[#E6E8EF] rounded-xl px-3 py-2.5 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#182033] mb-1">Slug</label>
              <input
                value={data.slug}
                onChange={(e) => setData('slug', e.target.value)}
                type="text"
                required
                className="w-full text-xs border border-[#E6E8EF] rounded-xl px-3 py-2.5 outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#182033] mb-1">Display Order</label>
              <input
                value={data.display_order}
                onChange={(e) => setData('display_order', Number(e.target.value))}
                type="number"
                required
                className="w-full text-xs border border-[#E6E8EF] rounded-xl px-3 py-2.5 outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={processing}
              className="w-full py-2.5 bg-[#3F51D7] text-white font-bold text-xs rounded-xl hover:bg-[#3142BD]"
            >
              Create Category
            </button>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}

