import React, { useState } from 'react';
import ManagerLayout from '@/Layouts/ManagerLayout';
import { useForm } from '@inertiajs/react';

export default function Inventory({ shop, products, movements }) {
  const [adjustProduct, setAdjustProduct] = useState(null);
  const { data, setData, post, processing, reset } = useForm({
    adjustment_type: 'add',
    quantity: 5,
    reason: '',
  });

  function openAdjust(prod) {
    setAdjustProduct(prod);
    setData({
      adjustment_type: 'add',
      quantity: 5,
      reason: '',
    });
  }

  function submitAdjust(e) {
    e.preventDefault();
    post(`/manager/products/${adjustProduct.id}/stock`, {
      onSuccess: () => {
        setAdjustProduct(null);
        reset();
      },
    });
  }

  return (
    <ManagerLayout title="Inventory & Stock Movements" shop={shop}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left 2 Cols: Products Stock Table */}
        <div className="md:col-span-2 bg-white rounded-3xl border border-[#E6E8EF] shadow-xs overflow-hidden">
          <div className="p-5 border-b border-[#E6E8EF] flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#182033]">Current Product Stock</h3>
          </div>

          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#E6E8EF] bg-gray-50/75 text-[#667085]">
                <th className="py-3.5 px-5 font-semibold">Product</th>
                <th className="py-3.5 px-5 font-semibold">SKU</th>
                <th className="py-3.5 px-5 font-semibold">Current Stock</th>
                <th className="py-3.5 px-5 font-semibold text-right">Quick Adjust</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.data?.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50/50">
                  <td className="py-3.5 px-5 font-medium text-[#182033]">{product.name}</td>
                  <td className="py-3.5 px-5 font-mono text-[#667085]">{product.sku || '-'}</td>
                  <td className="py-3.5 px-5">
                    <span
                      className={`font-bold px-2 py-0.5 rounded-full ${
                        product.stock <= 5 ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'
                      }`}
                    >
                      {product.stock} pcs
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    <button
                      onClick={() => openAdjust(product)}
                      className="text-xs font-semibold text-[#3F51D7] hover:underline"
                    >
                      Adjust &rarr;
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Right Col: Recent Movement Audit Log */}
        <div className="bg-white rounded-3xl p-6 border border-[#E6E8EF] shadow-xs">
          <h3 className="text-sm font-bold text-[#182033] mb-4">Stock Movement Audit</h3>
          <div className="space-y-3.5">
            {movements?.map((m) => (
              <div key={m.id} className="text-xs border-b border-gray-100 pb-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#182033] truncate">{m.product?.name}</span>
                  <span className={`font-mono font-bold ${m.quantity_change >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    {m.quantity_change > 0 ? `+${m.quantity_change}` : m.quantity_change}
                  </span>
                </div>
                <div className="text-[11px] text-[#667085] flex items-center justify-between mt-0.5">
                  <span>{m.reason || m.type}</span>
                  <span>After: {m.quantity_after}</span>
                </div>
                <div className="text-[10px] text-gray-400 mt-0.5">
                  {new Date(m.created_at).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Adjust Modal */}
      {adjustProduct && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 border border-[#E6E8EF] shadow-lg">
            <h4 className="text-sm font-bold text-[#182033] mb-1">Adjust Stock: {adjustProduct.name}</h4>
            <p className="text-xs text-[#667085] mb-4">Current quantity: <strong>{adjustProduct.stock}</strong></p>

            <form onSubmit={submitAdjust} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#182033] mb-1">Action Type</label>
                <select
                  value={data.adjustment_type}
                  onChange={(e) => setData('adjustment_type', e.target.value)}
                  className="w-full text-xs border border-[#E6E8EF] rounded-xl px-3 py-2.5 outline-none"
                >
                  <option value="set">Set exact stock</option>
                  <option value="add">Add received units</option>
                  <option value="remove">Deduct units (sale/damage)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#182033] mb-1">Quantity</label>
                <input
                  value={data.quantity}
                  onChange={(e) => setData('quantity', Number(e.target.value))}
                  type="number"
                  min="0"
                  required
                  className="w-full text-xs border border-[#E6E8EF] rounded-xl px-3 py-2.5 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#182033] mb-1">Reason</label>
                <input
                  value={data.reason}
                  onChange={(e) => setData('reason', e.target.value)}
                  type="text"
                  placeholder="e.g. Restocked 20 units from supplier"
                  className="w-full text-xs border border-[#E6E8EF] rounded-xl px-3 py-2.5 outline-none"
                />
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setAdjustProduct(null)}
                  className="px-4 py-2 text-xs font-semibold border border-[#E6E8EF] rounded-xl hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={processing}
                  className="px-4 py-2 text-xs font-semibold bg-[#3F51D7] text-white rounded-xl hover:bg-[#3142BD]"
                >
                  Confirm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </ManagerLayout>
  );
}

