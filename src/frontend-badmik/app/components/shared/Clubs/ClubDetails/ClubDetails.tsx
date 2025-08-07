

'use client';

import { useState } from 'react';
import { Club } from '@/data/clubs';
import ActionHeader from '@/app/components/ui/Layout/ActionHeader/ActionHeader';
import BackButton from '@/app/components/ui/Buttons/BackButton/BackButton';
import EditButton from '@/app/components/ui/Buttons/EditButton/EditButton';
import DeleteButton from '@/app/components/ui/Buttons/DeleteButton/DeleteButton';
import { ConfirmDialog } from '@/app/components/ui/DeleteModal/ConfirmDialog';

type Props = {
  club: Club;
};

export const ClubDetails = ({ club }: Props) => {
  const [openConfirm, setOpenConfirm] = useState(false);
  const [selectedClubId, setSelectedClubId] = useState<string | null>(null);

  const handleDeleteClick = () => {
    setSelectedClubId(club.id);
    setOpenConfirm(true);
  };

  const handleConfirmDelete = () => {
    if (selectedClubId) {
      // API delete logic
      console.log('Клуб видалено:', selectedClubId);
      setOpenConfirm(false);
    }
  };

  return (
    <>
      <ActionHeader>
        <BackButton />
        <h2 className="text-lg font-semibold">{club.name}</h2>
        <div className="flex flex-wrap gap-2">
          <EditButton href={`/admin/${club.id}/edit`} label="Редагувати" />
          <DeleteButton onClick={handleDeleteClick} label="Видалити" />
        </div>
      </ActionHeader>

      <div className="bg-white rounded-2xl shadow p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold">{club.name}</h3>
          <span
            className={`text-sm px-3 py-1 rounded-full bg-${club.statusColor}-100 text-${club.statusColor}-700`}
          >
            {club.status}
          </span>
        </div>

        <div className="text-gray-700 text-sm space-y-2">
          <p><strong>Місто:</strong> {club.city}</p>
          <p><strong>Адреса:</strong> {club.address}</p>
          <p><strong>Менеджер:</strong> {club.manager}</p>
          <p><strong>Кількість кортів:</strong> {club.courts}</p>
        </div>
      </div>

      <ConfirmDialog
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        onConfirm={handleConfirmDelete}
        title="Видалити клуб"
        description="Ви дійсно хочете видалити цей клуб? Цю дію неможливо скасувати."
      />
    </>
  );
};
