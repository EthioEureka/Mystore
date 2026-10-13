import React from 'react';
import ManagerLayout from '@/Layouts/ManagerLayout';
import { Link } from '@inertiajs/react';
import { Package, MessageSquare, AlertTriangle, Plus, ArrowRight } from 'lucide-react';

export default function Dashboard({ shop, metrics, recentInquiries, recentProducts }) {
  return (
    <ManagerLayout title="Dashboard" shop={shop}>
      {/* Stat Metrics Row matching SellMate Figma screenshot */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        <div className="bg-white rounded-3xl p-6 border border-[#E6E8EF] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-[#667085] uppercase tracking-wider block">Total Products</span>
            <div className="text-3xl font-black text-[#182033] mt-1">{metrics.total_products}</div>
            <span className="text-[11px] font-semibold text-emerald-600 mt-1 inline-block">
              {metrics.published_products} published
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-[#3F51D7] flex items-center justify-center">
            <Package className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-[#E6E8EF] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-[#667085] uppercase tracking-wider block">Purchase Inquiries</span>
            <div className="text-3xl font-black text-[#182033] mt-1">{metrics.total_inquiries}</div>
            <span className="text-[11px] font-semibold text-amber-600 mt-1 inline-block">
              {metrics.new_inquiries} awaiting response
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <MessageSquare className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-[#E6E8EF] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-[#667085] uppercase tracking-wider block">Low Stock Items</span>
            <div className="text-3xl font-black text-[#182033] mt-1">{metrics.low_stock_products}</div>
            <span className="text-[11px] text-[#667085] mt-1 inline-block">
              Inventory monitoring
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Quick action links */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-base font-bold text-[#182033]">Recent Inquiries</h3>
        <div className="flex gap-2">
          <Link
            href="/manager/products/create"
            className="px-4 py-2 bg-[#3F51D7] text-white text-xs font-semibold rounded-xl hover:bg-[#3142BD] transition shadow-xs flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </Link>
          <Link
            href="/manager/inquiries"
            className="px-4 py-2 border border-[#E6E8EF] bg-white text-[#182033] text-xs font-semibold rounded-xl hover:bg-gray-50 transition flex items-center gap-1"
          >
            <span>View All Inquiries</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Recent Inquiries Table */}
      <div className="bg-white rounded-3xl border border-[#E6E8EF] shadow-xs overflow-hidden mb-8">
        {!recentInquiries || recentInquiries.length === 0 ? (
          <div className="p-8 text-center text-xs text-[#667085]">
            No inquiries received yet. Once customers submit purchase requests, they appear here.
          </div>
        ) : (
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#E6E8EF] bg-gray-50/75 text-[#667085]">
                <th className="py-3 px-5 font-semibold">Reference</th>
                <th className="py-3 px-5 font-semibold">Customer</th>
                <th className="py-3 px-5 font-semibold">Product</th>
                <th className="py-3 px-5 font-semibold">Quantity</th>
                <th className="py-3 px-5 font-semibold">Status</th>
                <th className="py-3 px-5 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentInquiries.map((inq) => (
                <tr key={inq.id} className="hover:bg-gray-50/50">
                  <td className="py-3.5 px-5 font-mono font-bold text-[#182033]">#{inq.reference_number}</td>
                  <td className="py-3.5 px-5">
                    <div className="font-bold text-[#182033]">{inq.customer_name}</div>
                    <div className="text-[11px] text-[#667085]">{inq.customer_phone}</div>
                  </td>
                  <td className="py-3.5 px-5 font-medium text-[#182033]">{inq.product_name_snapshot}</td>
                  <td className="py-3.5 px-5">{inq.quantity}</td>
                  <td className="py-3.5 px-5">
                    <span
                      className={`px-2.5 py-0.5 rounded-full font-semibold capitalize text-[10px] ${
                        inq.status === 'sent'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : inq.status === 'viewed'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : inq.status === 'responded'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : inq.status === 'closed'
                          ? 'bg-gray-100 text-gray-700'
                          : 'bg-red-50 text-red-700 border border-red-200'
                      }`}
                    >
                      {inq.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    <Link href={`/manager/inquiries/${inq.id}`} className="text-[#3F51D7] font-semibold hover:underline">
                      View &rarr;
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </ManagerLayout>
  );
}

