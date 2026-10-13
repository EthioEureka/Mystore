import React from 'react';
import CustomerLayout from '@/Layouts/CustomerLayout';
import { Link } from '@inertiajs/react';

export default function Categories({ categories }) {
  return (
    <CustomerLayout title="Browse Categories">
      <div className="mb-4">
        <h3 className="text-sm font-bold text-[#182033]">All Marketplace Categories</h3>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        {categories?.map((cat) => (
          <Link
            key={cat.id}
            href={`/search?category=${cat.slug}`}
            className="bg-white border border-[#E6E8EF] rounded-2xl p-4 shadow-xs hover:border-[#3F51D7] transition flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-[#EEF0FD] text-[#3F51D7] flex items-center justify-center text-lg">
              🏷️
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#182033]">{cat.name}</h4>
              <span className="text-[11px] text-[#667085]">{cat.products_count} items</span>
            </div>
          </Link>
        ))}
      </div>
    </CustomerLayout>
  );
}

