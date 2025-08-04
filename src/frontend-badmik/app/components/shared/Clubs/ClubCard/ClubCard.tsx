'use client';

import { Club } from '@/data/clubs';
import Link from 'next/link';

type Props = {
  club: Club;
  onDeleteClick?: () => void;
   title?: string;
  message?: string;
};

const statusStyles = {
  active: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-700',
  blocked: 'bg-red-100 text-red-700',
};

export const ClubCard = ({ club, onDeleteClick }: Props) => {
  return (
    <div className="bg-white rounded-2xl shadow p-4 border border-gray-200">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold">{club.name}</h3>
       <span
  className={`text-sm px-2 py-1 rounded-full bg-${club.statusColor}-100 text-${club.statusColor}-700`}
>
  {club.status}
</span>
      </div>
      <div className="text-sm text-gray-600 space-y-1 mb-3">
        <p><strong>Місто:</strong> {club.city}</p>
        <p><strong>Адреса:</strong> {club.address}</p>
        <p><strong>Менеджер:</strong> {club.manager}</p>
        <p><strong>Кортів:</strong> {club.courts}</p>
      </div>
      <div className="flex gap-2">
        <Link href={`/admin/${club.id}`} className="px-3 py-1 bg-primary-button hover:bg-primary-button-hover text-white text-sm rounded">
          Переглянути</Link>
        {/* <button className="px-3 py-1 bg-primary-button hover:bg-primary-button-hover text-white text-sm rounded">Переглянути</button> */}
        <button className="px-3 py-1 bg-secondary-button hover:bg-secondary-button-hover text-white text-sm rounded">Редагувати</button>
        <button className="px-3 py-1 bg-delete-button hover:bg-delete-button-hover text-white text-sm rounded" onClick={onDeleteClick}>Видалити</button>
      </div>
    </div>
  );
};