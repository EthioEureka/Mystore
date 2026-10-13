import React from 'react';
import CustomerLayout from '@/Layouts/CustomerLayout';
import { Link } from '@inertiajs/react';
import { MessageCircle, Phone } from 'lucide-react';

export default function ShopDetail({ shop, products }) {
  return (
    <CustomerLayout title={shop.name}>
      {/* Shop Banner & Header */}
      <div className="bg-white rounded-3xl p-5 border border-[#E6E8EF] shadow-xs mb-5">
        <div className="flex items-center gap-3.5 mb-3">
          <div className="w-14 h-14 rounded-2xl bg-[#EEF0FD] text-[#3F51D7] font-black text-xl flex items-center justify-center border border-[#3F51D7]/20 shadow-xs">
            {shop.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-base font-bold text-[#182033]">{shop.name}</h2>
            <span className="inline-block text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full mt-0.5">
              Verified Merchant
            </span>
          </div>
        </div>

        <p className="text-xs text-[#667085] leading-relaxed mb-4">
          {shop.description || 'Welcome to our shop on Telegram Marketplace!'}
        </p>

        {/* Shop details & direct contact */}
        <div className="pt-3 border-t border-gray-100 grid grid-cols-2 gap-2 text-xs">
          {shop.public_address && (
            <div className="text-[#667085]">
              📍 {shop.public_address}
            </div>
          )}
          {shop.business_hours && (
            <div className="text-[#667085]">
              🕒 {shop.business_hours}
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="mt-4 pt-3 border-t border-gray-100 flex gap-2">
          {shop.public_telegram_username && (
            <a
              href={`https://t.me/${shop.public_telegram_username}`}
              target="_blank"
              rel="noreferrer"
              className="flex-1 py-2 px-3 bg-[#3F51D7] text-white text-xs font-semibold rounded-xl text-center shadow-xs flex items-center justify-center gap-1.5"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Message on Telegram</span>
            </a>
          )}
          {shop.public_phone && (
            <a
              href={`tel:${shop.public_phone}`}
              className="flex-1 py-2 px-3 border border-[#E6E8EF] text-[#182033] text-xs font-semibold rounded-xl text-center hover:bg-gray-50 flex items-center justify-center gap-1.5"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              <span>Call Shop</span>
            </a>
          )}
        </div>
      </div>

      {/* Products grid */}
      <div className="mb-6">
        <h3 className="text-sm font-bold text-[#182033] mb-3">Products from {shop.name}</h3>

        <div className="grid grid-cols-2 gap-3.5">
          {products.data?.map((product) => (
            <div
              key={product.id}
              className="bg-white border border-[#E6E8EF] rounded-2xl overflow-hidden shadow-xs hover:border-[#3F51D7] transition flex flex-col group"
            >
              <Link href={`/shops/${shop.slug}/products/${product.slug}`} className="block aspect-square bg-gray-50 overflow-hidden">
                <img
                  src={product.primary_image?.image_path || 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400&auto=format&fit=crop'}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </Link>
              <div className="p-3 flex-1 flex flex-col justify-between">
                <Link href={`/shops/${shop.slug}/products/${product.slug}`} className="text-xs font-semibold text-[#182033] line-clamp-2">
                  {{product}.name}
                </Link>
                <div className="mt-2.5 pt-2 border-t border-gray-50 flex items-center justify-between">
                  <span className="text-xs font-bold text-[#182033]">
                    ${product.price}
                  </span>
                  <Link
                    href={`/shops/${shop.slug}/products/${product.slug}/inquire`}
                    className="text-[11px] font-semibold text-[#3F51D7] hover:underline"
                  >
                    Inquire &rarr;
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </CustomerLayout>
  );
}

