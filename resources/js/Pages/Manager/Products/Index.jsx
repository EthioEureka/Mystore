import React, { useState } from 'react';
import ManagerLayout from '@/Layouts/ManagerLayout';
import { Link, router } from '@inertiajs/react';
import { Plus } from 'lucide-react';

export default function ProductsIndex({ shop, products, filters }) {
  const [search, setSearch] = useState(filters?.search || '');
  const [status, setStatus] = useState(filters?.status || '');

  function applyFilter(newStatus = status) {
    router.get('/manager/products', { search, status: newStatus }, { preserveState: true });
  }

  function deleteProduct(id) {
    if (confirm('Archive this product? Existing historical inquiries will keep their snapshots.')) {
      router.delete(`/manager/products/${id}`);
    }
  }

  return (
    <ManagerLayout title="Products" shop={shop}>
      {/* Action Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && applyFilter()}
            type="text"
            placeholder="Search products..."
            className="bg-white border border-[#E6E8EF] rounded-xl px-3.5 py-2 text-xs focus:border-[#3F51D7] outline-none w-64 shadow-xs"
          />
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              applyFilter(e.target.value);
            }}
            className="bg-white border border-[#E6E8EF] rounded-xl px-3 py-2 text-xs outline-none shadow-xs"
          >
            <option value="">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="hidden">Hidden</option>
          </select>
        </div>

        <Link
          href="/manager/products/create"
          className="px-4 py-2 bg-[#3F51D7] hover:bg-[#3142BD] text-white text-xs font-semibold rounded-xl shadow-xs transition flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Add Product</span>
        </Link>
      </div>

      {/* Product Table matching SellMate Screenshot */}
      <div className="bg-white rounded-3xl border border-[#E6E8EF] shadow-xs overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-[#E6E8EF] bg-gray-50/75 text-[#667085]">
              <th className="py-3.5 px-5 font-semibold">Product Name</th>
              <th className="py-3.5 px-5 font-semibold">SKU</th>
              <th className="py-3.5 px-5 font-semibold">Price</th>
              <th className="py-3.5 px-5 font-semibold">Stock</th>
              <th className="py-3.5 px-5 font-semibold">Status</th>
              <th className="py-3.5 px-5 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.data?.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50/50">
                <td className="py-3.5 px-5">
                  <div className="flex items-center gap-3">
                    <img
                      src={product.primary_image?.image_path || 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=100&auto=format&fit=crop'}
                      alt={product.name}
                      className="w-10 h-10 object-cover rounded-xl bg-gray-50 border border-gray-100"
                    />
                    <div>
                      <div className="font-bold text-[#182033]">{product.name}</div>
                      <div className="text-[11px] text-[#667085]">{product.category?.name || 'Uncategorized'}</div>
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-5 font-mono text-[#667085]">{product.sku || 'N/A'}</td>
                <td className="py-3.5 px-5 font-bold text-[#182033]">
                  {product.price ? `$${product.price}` : 'On request'}
                </td>
                <td className="py-3.5 px-5">
                  <span
                    className={`font-semibold ${
                      product.stock <= 5 ? 'text-rose-600' : 'text-[#182033]'
                    }`}
                  >
                    {product.stock} Pieces
                  </span>
                </td>
                <td className="py-3.5 px-5">
                  <span
                    className={`px-2 py-0.5 rounded-full capitalize text-[10px] font-semibold ${
                      product.status === 'published'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : product.status === 'draft'
                        ? 'bg-gray-100 text-gray-700'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {product.status}
                  </span>
                </td>
                <td className="py-3.5 px-5 text-right space-x-2">
                  <Link href={`/manager/products/${product.id}/edit`} className="text-[#3F51D7] font-semibold hover:underline">
                    Edit
                  </Link>
                  <button onClick={() => deleteProduct(product.id)} className="text-rose-600 font-semibold hover:underline">
                    Archive
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ManagerLayout>
  );
}

