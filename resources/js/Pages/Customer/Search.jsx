import React, { useState } from 'react';
import CustomerLayout from '@/Layouts/CustomerLayout';
import { Link, router } from '@inertiajs/react';
import { Search } from 'lucide-react';

export default function SearchPage({ products, categories, filters }) {
  const [query, setQuery] = useState(filters?.q || '');
  const [category, setCategory] = useState(filters?.category || '');
  const [sort, setSort] = useState(filters?.sort || 'newest');

  function applyFilters(newCategory = category, newSort = sort) {
    router.get(
      '/search',
      {
        q: query,
        category: newCategory,
        sort: newSort,
      },
      { preserveState: true }
    );
  }

  return (
    <CustomerLayout title="Search & Filter">
      {/* Search Bar */}
      <div className="relative mb-4">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
          type="text"
          placeholder="Wireless headphones, cosmetics, brands..."
          className="w-full bg-white border border-[#E6E8EF] rounded-2xl py-3 pl-11 pr-10 text-sm shadow-xs focus:outline-none focus:border-[#3F51D7] focus:ring-1 focus:ring-[#3F51D7]"
        />
        <div className="absolute left-3.5 top-3.5 text-[#667085]">
          <Search className="w-4 h-4" />
        </div>
      </div>

      {/* Filter chips */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-4 -mx-4 px-4 scrollbar-none">
        <button
          onClick={() => {
            setCategory('');
            applyFilters('');
          }}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition ${
            !category ? 'bg-[#3F51D7] text-white' : 'bg-white border border-[#E6E8EF] text-[#667085]'
          }`}
        >
          All Categories
        </button>
        {categories?.map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              setCategory(cat.slug);
              applyFilters(cat.slug);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition ${
              category === cat.slug ? 'bg-[#3F51D7] text-white' : 'bg-white border border-[#E6E8EF] text-[#667085]'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Results count & sort selector */}
      <div className="flex items-center justify-between mb-4 text-xs text-[#667085]">
        <span>{products.total || 0} products found</span>
        <select
          value={sort}
          onChange={(e) => {
            setSort(e.target.value);
            applyFilters(category, e.target.value);
          }}
          className="bg-white border border-[#E6E8EF] rounded-lg px-2 py-1 text-xs"
        >
          <option value="newest">Newest first</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
      </div>

      {/* Products Grid */}
      {products.data?.length > 0 ? (
        <div className="grid grid-cols-2 gap-3.5 mb-6">
          {products.data.map((product) => (
            <div
              key={product.id}
              className="bg-white border border-[#E6E8EF] rounded-2xl overflow-hidden shadow-xs hover:border-[#3F51D7] transition flex flex-col group"
            >
              <Link href={`/shops/${product.shop.slug}/products/${product.slug}`} className="block aspect-square bg-gray-50 overflow-hidden relative">
                <img
                  src={product.primary_image?.image_path || 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400&auto=format&fit=crop'}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
              </Link>
              <div className="p-3 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[11px] text-[#667085] truncate block">{product.shop?.name}</span>
                  <Link href={`/shops/${product.shop.slug}/products/${product.slug}`} className="text-xs font-semibold text-[#182033] line-clamp-2 leading-snug">
                    {product.name}
                  </Link>
                </div>
                <div className="mt-2.5 pt-2 border-t border-gray-50 flex items-center justify-between">
                  <span className="text-xs font-bold text-[#182033]">
                    {product.price ? `$${product.price}` : 'On request'}
                  </span>
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
      ) : (
        <div className="bg-white rounded-3xl p-8 border border-[#E6E8EF] text-center shadow-xs">
          <div className="text-3xl mb-2">🔍</div>
          <h4 className="text-sm font-bold text-[#182033]">No products match your search</h4>
          <p className="text-xs text-[#667085] mt-1 max-w-xs mx-auto">
            Try adjusting your keywords or clearing category filters.
          </p>
          <button
            onClick={() => {
              setQuery('');
              setCategory('');
              router.get('/search');
            }}
            className="mt-4 px-4 py-2 bg-[#3F51D7] text-white text-xs font-semibold rounded-xl hover:bg-[#3142BD]"
          >
            Clear Filters
          </button>
        </div>
      )}
    </CustomerLayout>
  );
}

