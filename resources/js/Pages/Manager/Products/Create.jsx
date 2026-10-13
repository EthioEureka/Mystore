import React from 'react';
import ManagerLayout from '@/Layouts/ManagerLayout';
import { Link, useForm } from '@inertiajs/react';

export default function CreateProduct({ shop, categories }) {
  const { data, setData, post, processing, errors } = useForm({
    name: '',
    category_id: null,
    description: '',
    sku: '',
    price: '',
    sale_price: '',
    currency: 'USD',
    stock: 10,
    status: 'published',
    image_url: '',
  });

  function handleSubmit(e) {
    e.preventDefault();
    post('/manager/products');
  }

  return (
    <ManagerLayout title="Add Product" shop={shop}>
      <div className="max-w-2xl bg-white rounded-3xl p-6 border border-[#E6E8EF] shadow-xs">
        <h3 className="text-sm font-bold text-[#182033] mb-4">Product Information</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#182033] mb-1">Product Name <span className="text-red-500">*</span></label>
            <input
              value={data.name}
              onChange={(e) => setData('name', e.target.value)}
              type="text"
              required
              placeholder="e.g. Sony Wireless WH-1000XM4"
              className="w-full text-xs border border-[#E6E8EF] rounded-xl px-3 py-2.5 focus:border-[#3F51D7] outline-none"
            />
            {errors.name && <div className="text-[10px] text-red-500 mt-1">{errors.name}</div>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#182033] mb-1">Category</label>
              <select
                value={data.category_id || ''}
                onChange={(e) => setData('category_id', e.target.value ? Number(e.target.value) : null)}
                className="w-full text-xs border border-[#E6E8EF] rounded-xl px-3 py-2.5 focus:border-[#3F51D7] outline-none"
              >
                <option value="">No category</option>
                {categories?.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#182033] mb-1">SKU</label>
              <input
                value={data.sku}
                onChange={(e) => setData('sku', e.target.value)}
                type="text"
                placeholder="e.g. SNY-WH-4"
                className="w-full text-xs border border-[#E6E8EF] rounded-xl px-3 py-2.5 focus:border-[#3F51D7] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#182033] mb-1">Description</label>
            <textarea
              value={data.description}
              onChange={(e) => setData('description', e.target.value)}
              rows="3"
              placeholder="Key specs, colors, sound quality, warranty details..."
              className="w-full text-xs border border-[#E6E8EF] rounded-xl px-3 py-2.5 focus:border-[#3F51D7] outline-none resize-none"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#182033] mb-1">Price (USD)</label>
              <input
                value={data.price}
                onChange={(e) => setData('price', e.target.value)}
                type="number"
                step="0.01"
                placeholder="150.00"
                className="w-full text-xs border border-[#E6E8EF] rounded-xl px-3 py-2.5 focus:border-[#3F51D7] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#182033] mb-1">Sale Price</label>
              <input
                value={data.sale_price}
                onChange={(e) => setData('sale_price', e.target.value)}
                type="number"
                step="0.01"
                placeholder="Optional"
                className="w-full text-xs border border-[#E6E8EF] rounded-xl px-3 py-2.5 focus:border-[#3F51D7] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#182033] mb-1">Initial Stock <span className="text-red-500">*</span></label>
              <input
                value={data.stock}
                onChange={(e) => setData('stock', Number(e.target.value))}
                type="number"
                required
                className="w-full text-xs border border-[#E6E8EF] rounded-xl px-3 py-2.5 focus:border-[#3F51D7] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#182033] mb-1">Product Image URL</label>
            <input
              value={data.image_url}
              onChange={(e) => setData('image_url', e.target.value)}
              type="url"
              placeholder="https://images.unsplash.com/..."
              className="w-full text-xs border border-[#E6E8EF] rounded-xl px-3 py-2.5 focus:border-[#3F51D7] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#182033] mb-1">Listing Status</label>
            <select
              value={data.status}
              onChange={(e) => setData('status', e.target.value)}
              className="w-full text-xs border border-[#E6E8EF] rounded-xl px-3 py-2.5 focus:border-[#3F51D7] outline-none"
            >
              <option value="published">Published (Visible to customers)</option>
              <option value="draft">Draft (Private)</option>
              <option value="hidden">Hidden</option>
            </select>
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-end gap-2">
            <Link href="/manager/products" className="px-4 py-2 border border-[#E6E8EF] rounded-xl text-xs font-semibold hover:bg-gray-50">
              Cancel
            </Link>
            <button
              type="submit"
              disabled={processing}
              className="px-5 py-2 bg-[#3F51D7] text-white text-xs font-semibold rounded-xl hover:bg-[#3142BD] disabled:opacity-50"
            >
              Save Product
            </button>
          </div>
        </form>
      </div>
    </ManagerLayout>
  );
}

