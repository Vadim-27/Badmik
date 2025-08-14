'use client'

import {Link} from '@/i18n/navigation';
import type { Club } from '@/data/clubs';
import {ConfirmDialog} from '@/app/components/ui/DeleteModal/ConfirmDialog';
import { useState } from 'react';

type Props = {
  club: {
    id: string;
  name: string;
  status: 'Активний' | 'Очікує' | 'Заблокований' | 'Відновлюється';
  statusColor: 'green' | 'yellow' | 'red' | 'blue';
  city: string;
  address: string;
  manager: string;
  courts: number; 
  };
};

export const ClubPageHeader = ({ club }: Props) => {

    //  const [clubs, setClubs] = useState(club);
      const [openConfirm, setOpenConfirm] = useState(false);
      const [selectedClubId, setSelectedClubId] = useState<string | null>(null);
    
      const handleDelete = () => {
        if (selectedClubId) {
        //   setClubs((prev) => prev.filter((club) => club.id !== selectedClubId));
        //   setSelectedClubId(null);
          setOpenConfirm(false);
        }
      };

  return (
    <div className="bg-white mb-12 p-4 border-b flex flex-wrap items-center justify-between gap-2 rounded-2xl shadow border-gray-200">
      <h2 className="text-lg font-semibold">{club.name}</h2>
      <div className="flex flex-wrap gap-2">
        <Link
          href={`/admin/${club.id}/edit`}
          className="px-4 py-2 bg-secondary-button hover:bg-secondary-button-hover text-white text-sm rounded"
        >
          ✏️ Редагувати
        </Link>
        <button className="px-4 py-2 bg-delete-button hover:bg-delete-button-hover text-white text-sm rounded cursor-pointer" onClick={() => {
        setSelectedClubId(club.id);
        setOpenConfirm(true);
      }}>
          🗑️ Видалити
        </button>
        <Link
          href="/admin"
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm rounded"
        >
          ← Назад
        </Link>
      </div>
      <ConfirmDialog
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        onConfirm={handleDelete}
        title="Видалити клуб"
        description="Ви дійсно хочете видалити цей клуб? Цю дію неможливо скасувати."
      />
    </div>
  );
};
