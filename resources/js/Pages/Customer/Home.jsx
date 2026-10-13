import React, { useState } from 'react';
import CustomerLayout from '@/Layouts/CustomerLayout';
import { Link, router } from '@inertiajs/react';
import { Search, Heart, ArrowRight, X } from 'lucide-react';

export default function Home({ categories, featuredShops, products }) {
  const [searchQuery, setSearchQuery] = useState('');

  function handleSearchSubmit(e) {
    if (e.key === 'Enter' && searchQuery.trim()) {
      router.get('/search', { q: searchQuery.trim() });
    }
  }

  function toggleSave(productId, e) {
    e.preventDefault();
    e.stopPropagation();
    router.post(`/products/${productId}/favorite`, {}, { preserveScroll: true });
  }

  return (
    <CustomerLayout title="Discover Products & Shops">
      {/* Search Bar */}
      <div className="relative mb-5">
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleSearchSubmit}
          type="text"
          placeholder="Wireless headphones, beauty, shops..."
          className="w-full bg-white border border-[#E6E8EF] rounded-2xl py-3 pl-11 pr-10 text-sm shadow-xs focus:outline-none focus:border-[#3F51D7] focus:ring-2 focus:ring-[#3F51D7]/20 placeholder-[#667085]"
        />
        <div className="absolute left-3.5 top-3.5 text-[#667085]">
          <Search className="w-4 h-4" />
        </div>
        {searchQuery && (
          <button
            onClick={() => {
              setSearchQuery('');
              router.get('/');
            }}
            className="absolute right-3.5 top-3.5 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Featured Promo Card (Rose Hibiscus Mist hero card) */}
      <div className="relative bg-gradient-to-r from-rose-100 to-amber-50 rounded-2xl p-4.5 mb-6 border border-rose-200/50 shadow-xs flex items-center justify-between overflow-hidden">
        <div className="z-10 max-w-[62%]">
          <span className="text-[11px] font-bold uppercase tracking-wider text-rose-800">Herbivore</span>
          <h3 className="text-base font-bold text-[#182033] leading-snug mt-0.5">
            Rose Hibiscus Face Mist
          </h3>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-sm font-extrabold text-[#182033]">$34.20</span>
            <span className="text-xs text-gray-400 line-through">36.00</span>
          </div>
          <Link
            href="/shops/herbivore-botanicals/products/rose-hibiscus-hydrating-face-mist"
            className="inline-flex items-center gap-1.5 mt-3 px-3 py-1.5 bg-[#3F51D7] text-white text-xs font-semibold rounded-xl shadow-xs hover:bg-[#3142BD] transition"
          >
            <span>Request to Buy</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <img
          src="https://images.unsplash.com/photo-1608248597359-bb4360e7e1f4?w=300&auto=format&fit=crop"
          alt="Rose Mist"
          className="w-24 h-24 object-contain rounded-xl drop-shadow-md shrink-0"
        />
      </div>

      {/* Popular Categories */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-[#182033]">Popular categories</h3>
          <Link href="/categories" className="text-xs font-semibold text-[#3F51D7] hover:underline flex items-center gap-0.5">
            <span>See all</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4">
          {categories?.map((cat) => (
            <Link
              key={cat.id}
              href={`/search?category=${cat.slug}`}
              className="flex flex-col items-center gap-1.5 shrink-0 group"
            >
              <div className="w-14 h-14 rounded-2xl bg-white border border-[#E6E8EF] flex items-center justify-center text-[#182033] shadow-xs group-hover:border-[#3F51D7] group-hover:bg-[#EEF0FD] transition">
                <span className="text-xl">🏷️</span>
              </div>
              <span className="text-xs font-medium text-[#182033] group-hover:text-[#3F51D7]">{cat.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Featured Approved Shops */}
      {featuredShops && featuredShops.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-[#182033]">Featured Shops</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {featuredShops.map((shop) => (
              <Link
                key={shop.id}
                href={`/shops/${shop.slug}`}
                className="bg-white border border-[#E6E8EF] rounded-2xl p-3 shadow-xs hover:border-[#3F51D7] transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="w-7 h-7 rounded-lg bg-[#EEF0FD] text-[#3F51D7] font-bold text-xs flex items-center justify-center">
                      {shop.name.charAt(0)}
                    </div>
                    <h4 className="text-xs font-bold text-[#182033] truncate">{shop.name}</h4>
                  </div>
                  <p className="text-[11px] text-[#667085] line-clamp-2 leading-relaxed">
                    {shop.description}
                  </p>
                </div>
                <div className="mt-2.5 pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-[#667085]">
                  <span>{shop.products_count} items</span>
                  <span className="text-[#3F51D7] font-semibold">Visit &rarr;</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Two-column Product Grid */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-[#182033]">Explore Products</h3>
        </div>

        <div className="grid grid-cols-2 gap-3.5">
          {products?.map((product) => (
            <div
              key={product.id}
              className="bg-white border border-[#E6E8EF] rounded-2xl overflow-hidden shadow-xs hover:border-[#3F51D7] transition flex flex-col group relative"
            >
              {/* Product Image */}
              <Link href={`/shops/${product.shop.slug}/products/${product.slug}`} className="block aspect-square bg-gray-50 overflow-hidden relative">
                <img
                  src={product.primary_image || 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400&auto=format&fit=crop'}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                {product.availability === 'in_stock' && (
                  <span className="absolute top-2 left-2 text-[10px] font-semibold bg-emerald-500/90 text-white px-1.5 py-0.5 rounded-md backdrop-blur-xs">
                    In stock
                  </span>
                )}
                {product.availability === 'low_stock' && (
                  <span className="absolute top-2 left-2 text-[10px] font-semibold bg-amber-500/90 text-white px-1.5 py-0.5 rounded-md backdrop-blur-xs">
                    Low stock
                  </span>
                )}
              </Link>

              {/* Favorite Icon Button */}
              <button
                onClick={(e) => toggleSave(product.id, e)}
                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-gray-400 hover:text-red-500 shadow-xs transition"
              >
                <Heart className="w-3.5 h-3.5" />
              </button>

              {/* Card Content */}
              <div className="p-3 flex-1 flex flex-col justify-between">
                <div>
                  <Link href={`/shops/${product.shop.slug}`} className="text-[11px] text-[#667085] hover:text-[#3F51D7] truncate block mb-0.5">
                    {product.shop.name}
                  </Link>
                  <Link href={`/shops/${product.shop.slug}/products/${product.slug}`} className="text-xs font-semibold text-[#182033] line-clamp-2 leading-snug group-hover:text-[#3F51D7] transition">
                    {product.name}
                  </Link>
                </div>

                <div className="mt-2.5 pt-2 border-t border-gray-50 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-[#182033]">
                      {product.price ? `$${product.price}` : 'Price on request'}
                    </span>
                    {product.sale_price && (
                      <span className="text-[10px] text-gray-400 line-through ml-1">
                        ${product.sale_price}
                      </span>
                    )}
                  </div>
                  <Link
                    href={`/shops/${product.shop.slug}/products/${product.slug}/inquire`}
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

