'use client';

import React from 'react';
import Link from 'next/link';

const ClubListHeader: React.FC = () => {
  return (
    <div className="bg-white mb-12 p-4 border-b flex flex-wrap items-center justify-between gap-2 sticky top-0 z-10">
      <h2 className="text-lg font-semibold">Клуби</h2>

      <div className="flex flex-wrap gap-2">
        <Link href="/admin/add-club/" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded">
          ➕ Додати клуб
        </Link>
        <button className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm rounded">
          ✏️ Редагувати
        </button>
        <button className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm rounded">
          🗑️ Видалити
        </button>
        <button className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm rounded">
          ⬇️ Експорт
        </button>
        <button className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm rounded">
          🔄 Оновити
        </button>
      </div>
    </div>
  );
};

export default ClubListHeader;
