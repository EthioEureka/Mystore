import React from 'react';
import CustomerLayout from '@/Layouts/CustomerLayout';
import { Link, router } from '@inertiajs/react';

export default function Saved({ favorites }) {
  function removeSaved(productId) {
    router.post(`/products/${productId}/favorite`, {}, { preserveScroll: true });
  }

  return (
    <CustomerLayout title="Saved Products">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-bold text-[#182033]">Your Saved Items</h3>
        <span className="text-xs text-[#667085]">{favorites?.length || 0} items</span>
      </div>

      {!favorites || favorites.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 border border-[#E6E8EF] text-center shadow-xs">
          <div className="text-3xl mb-2">❤️</div>
          <h4 className="text-sm font-bold text-[#182033]">No saved products yet</h4>
          <p className="text-xs text-[#667085] mt-1 max-w-xs mx-auto">
            Tap the heart icon on any product to save it here for later.
          </p>
          <Link
            href="/"
            className="inline-block mt-4 px-4 py-2 bg-[#3F51D7] text-white text-xs font-semibold rounded-xl hover:bg-[#3142BD]"
          >
            Browse Marketplace
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3.5">
          {favorites.map((fav) => (
            <div
              key={fav.id}
              className="bg-white border border-[#E6E8EF] rounded-2xl overflow-hidden shadow-xs hover:border-[#3F51D7] transition flex flex-col group relative"
            >
              <Link href={`/shops/${fav.product.shop.slug}/products/${fav.product.slug}`} className="block aspect-square bg-gray-50 overflow-hidden">
                <img
                  src={fav.product.primary_image?.image_path || 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400&auto=format&fit=crop'}
                  alt={fav.product.name}
                  className="w-full h-full object-cover"
                />
              </Link>
              <div className="p-3 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[11px] text-[#667085] truncate block">{fav.product.shop?.name}</span>
                  <Link href={`/shops/${fav.product.shop.slug}/products/${fav.product.slug}`} className="text-xs font-semibold text-[#182033] line-clamp-2">
                    {fav.product.name}
                  </Link>
                </div>
                <div className="mt-2.5 pt-2 border-t border-gray-50 flex items-center justify-between">
                  <span className="text-xs font-bold text-[#182033]">
                    ${fav.product.price}
                  </span>
                  <button
                    onClick={() => removeSaved(fav.product.id)}
                    className="text-[11px] text-red-500 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </CustomerLayout>
  );
}

