import React, { useState } from 'react';
import CustomerLayout from '@/Layouts/CustomerLayout';
import { Link, router } from '@inertiajs/react';
import { ArrowLeft, Heart, MessageCircle, Phone, ArrowRight } from 'lucide-react';

export default function ProductDetail({ shop, product, relatedProducts }) {
  const [quantity, setQuantity] = useState(1);
  const [selectedVariantId, setSelectedVariantId] = useState(product.variants?.[0]?.id || null);
  const activeImage = product.images?.[0]?.image_path || product.primary_image || null;

  const selectedVariant = product.variants?.find((v) => v.id === selectedVariantId);

  let inquiryCheckoutUrl = `/shops/${shop.slug}/products/${product.slug}/inquire?quantity=${quantity}`;
  if (selectedVariantId) {
    inquiryCheckoutUrl += `&variant_id=${selectedVariantId}`;
  }

  function toggleSave() {
    router.post(`/products/${product.id}/favorite`, {}, { preserveScroll: true });
  }

  return (
    <CustomerLayout title="Product Details">
      {/* Back link */}
      <div className="flex items-center justify-between mb-3 text-xs">
        <Link href="/" className="text-[#667085] hover:text-[#182033] flex items-center gap-1 font-medium">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to marketplace</span>
        </Link>
        <button
          onClick={toggleSave}
          className="w-8 h-8 rounded-full bg-white border border-[#E6E8EF] flex items-center justify-center text-gray-500 hover:text-red-500 shadow-xs transition"
        >
          <Heart className="w-4 h-4" />
        </button>
      </div>

      {/* Image Gallery */}
      <div className="bg-white rounded-3xl p-4 border border-[#E6E8EF] shadow-xs mb-4">
        <div className="aspect-square w-full rounded-2xl bg-gray-50 flex items-center justify-center overflow-hidden relative">
          <img
            src={activeImage || 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&auto=format&fit=crop'}
            alt={product.name}
            className="w-full h-full object-contain p-4"
          />
          <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-xs text-[11px] font-semibold text-[#182033] px-2.5 py-1 rounded-full border border-gray-200">
            {product.availability_status === 'in_stock' ? '🟢 In stock' : (product.availability_status === 'low_stock' ? '🟡 Low stock' : '🔴 Out of stock')}
          </div>
        </div>
      </div>

      {/* Product Details Card */}
      <div className="bg-white rounded-3xl p-5 border border-[#E6E8EF] shadow-xs mb-4">
        <Link href={`/shops/${shop.slug}`} className="inline-flex items-center gap-1.5 text-xs text-[#3F51D7] font-semibold hover:underline mb-1.5">
          <span>🏪 {shop.name}</span>
          <ArrowRight className="w-3 h-3" />
        </Link>

        <h2 className="text-xl font-bold text-[#182033] leading-snug">
          {{product}.name}
        </h2>

        <div className="flex items-baseline gap-2 mt-2 pb-4 border-b border-gray-100">
          <span className="text-2xl font-black text-[#182033]">
            {product.price ? `$${product.price}` : 'Price on request'}
          </span>
          {product.sale_price && (
            <span className="text-sm text-gray-400 line-through">
              ${product.sale_price}
            </span>
          )}
          <span className="text-xs text-[#667085] ml-auto">
            Est. delivery 2-4 days
          </span>
        </div>

        <div className="py-4 border-b border-gray-100">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#667085] mb-1.5">Overview</h4>
          <p className="text-xs text-[#182033] leading-relaxed">
            {product.description || 'Quality product available directly from merchant.'}
          </p>
        </div>

        {/* Variants Selection */}
        {product.variants && product.variants.length > 0 && (
          <div className="py-4 border-b border-gray-100">
            <label className="text-xs font-bold uppercase tracking-wider text-[#667085] block mb-2">
              Select Variant / Color
            </label>
            <div className="grid grid-cols-2 gap-2">
              {product.variants.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVariantId(v.id)}
                  type="button"
                  className={`p-2.5 rounded-xl border text-left text-xs transition ${
                    selectedVariantId === v.id
                      ? 'border-[#3F51D7] bg-[#EEF0FD] text-[#3F51D7] font-semibold shadow-xs'
                      : 'border-[#E6E8EF] text-[#182033] hover:bg-gray-50'
                  }`}
                >
                  <div className="truncate">{v.name}</div>
                  <div className="text-[11px] text-[#667085] mt-0.5">
                    {v.stock > 0 ? `${v.stock} in stock` : 'Out of stock'}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quantity Stepper */}
        <div className="py-4 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-[#182033] block">Quantity</span>
            <span className="text-[11px] text-[#667085]">Max 10 per inquiry</span>
          </div>
          <div className="flex items-center gap-2 border border-[#E6E8EF] rounded-xl p-1 bg-gray-50">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-7 h-7 rounded-lg bg-white flex items-center justify-center font-bold text-sm text-[#182033] shadow-xs disabled:opacity-50"
              disabled={quantity <= 1}
            >
              -
            </button>
            <span className="w-6 text-center text-xs font-bold text-[#182033]">{quantity}</span>
            <button
              onClick={() => setQuantity(Math.min(10, quantity + 1))}
              className="w-7 h-7 rounded-lg bg-white flex items-center justify-center font-bold text-sm text-[#182033] shadow-xs"
            >
              +
            </button>
          </div>
        </div>

        {/* Offline Disclaimer Notice */}
        <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-3 text-[11px] text-amber-900 leading-relaxed mb-4">
          <strong>⚠️ Direct purchase:</strong> Submitting an inquiry contacts the shop owner directly. Payment and final delivery arrangements happen outside the platform.
        </div>

        {/* Request to Buy CTA */}
        <Link
          href={inquiryCheckoutUrl}
          className="w-full py-3.5 bg-[#3F51D7] hover:bg-[#3142BD] text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-sm transition"
        >
          <span>Request to Buy / Inquire</span>
          <ArrowRight className="w-4 h-4" />
        </Link>

        {/* Direct Contact Actions */}
        <div className="grid grid-cols-2 gap-2 mt-2.5">
          {shop.public_telegram_username && (
            <a
              href={`https://t.me/${shop.public_telegram_username}`}
              target="_blank"
              rel="noreferrer"
              className="py-2.5 px-3 rounded-xl border border-[#E6E8EF] text-center text-xs font-semibold text-[#182033] hover:bg-gray-50 transition flex items-center justify-center gap-1.5"
            >
              <MessageCircle className="w-3.5 h-3.5 text-[#3F51D7]" />
              <span>Telegram Shop</span>
            </a>
          )}
          {shop.public_phone && (
            <a
              href={`tel:${shop.public_phone}`}
              className="py-2.5 px-3 rounded-xl border border-[#E6E8EF] text-center text-xs font-semibold text-[#182033] hover:bg-gray-50 transition flex items-center justify-center gap-1.5"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              <span>Call Shop</span>
            </a>
          )}
        </div>
      </div>
    </CustomerLayout>
  );
}

