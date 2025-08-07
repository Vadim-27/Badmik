'use client';

import { useState } from 'react';
import { Club } from '@/data/clubs';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type Props = {
  club: Club;
};

export default function ClubEditForm({ club }: Props) {
  const [form, setForm] = useState(club);
  const router = useRouter();

  const handleChange = (key: keyof Club, value: string | number) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = () => {
    console.log('Збережено:', form);
  };

  return (
    <div>
      <div className="bg-white mb-12 p-4 border-b flex flex-wrap items-center justify-between gap-2 rounded-2xl shadow border-gray-200">
        <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm rounded"
          >
            ← Назад
          </button>
        <h2 className="text-lg font-semibold">Редагування клубу {club.name}</h2>
        <div className="flex flex-wrap gap-2">
          <button
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
            onClick={() => setForm(club)}
          >
            Відмінити
          </button>
          <button
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
            onClick={handleSave}
          >
            Зберегти
          </button>
          
        </div>
      </div>

      <div className="max-w-xl mx-auto bg-white shadow p-6 rounded-xl space-y-4">
        <ul className="space-y-4">
          <li className="flex justify-between items-center">
            <span className="font-medium w-1/3">Назва</span>
            <input
              type="text"
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-2/3 p-2 border rounded"
            />
          </li>
          <li className="flex justify-between items-center">
            <span className="font-medium w-1/3">Місто</span>
            <input
              type="text"
              value={form.city}
              onChange={(e) => handleChange('city', e.target.value)}
              className="w-2/3 p-2 border rounded"
            />
          </li>
          <li className="flex justify-between items-center">
            <span className="font-medium w-1/3">Адреса</span>
            <input
              type="text"
              value={form.address}
              onChange={(e) => handleChange('address', e.target.value)}
              className="w-2/3 p-2 border rounded"
            />
          </li>
          <li className="flex justify-between items-center">
            <span className="font-medium w-1/3">Менеджер</span>
            <input
              type="text"
              value={form.manager}
              onChange={(e) => handleChange('manager', e.target.value)}
              className="w-2/3 p-2 border rounded"
            />
          </li>
          <li className="flex justify-between items-center">
            <span className="font-medium w-1/3">Кількість кортів</span>
            <input
              type="number"
              value={form.courts}
              onChange={(e) => handleChange('courts', Number(e.target.value))}
              className="w-2/3 p-2 border rounded"
            />
          </li>
          <li className="flex justify-between items-center">
            <span className="font-medium w-1/3">Статус</span>
            <select
              value={form.status}
              onChange={(e) => handleChange('status', e.target.value)}
              className="w-2/3 p-2 border rounded"
            >
              <option value="Активний">Активний</option>
              <option value="Очікує">Очікує</option>
              <option value="Заблокований">Заблокований</option>
              <option value="Відновлюється">Відновлюється</option>
            </select>
          </li>
        </ul>

        <div className="flex justify-end gap-4 mt-6">
          {/* <button
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
          onClick={() => setForm(club)}
        >
          Відмінити
        </button>
        <button
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
          onClick={handleSave}
        >
          Зберегти
        </button> */}
        </div>
      </div>
    </div>
  );
}
