'use client'
import { clubs } from '@/data/clubs';
import { useState } from 'react';
import { clubs as initialClubs } from '@/data/clubs';
import { ClubCard } from '../ClubCard/ClubCard';
import {ConfirmDialog} from '@/app/components/ui/DeleteModal/ConfirmDialog';
import { useTranslations } from 'next-intl';

export const ClubList = () => {
    const [clubs, setClubs] = useState(initialClubs);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [selectedClubId, setSelectedClubId] = useState<string | null>(null);

  const t = useTranslations('ClubCard');

  const handleDelete = () => {
    if (selectedClubId) {
    //   setClubs((prev) => prev.filter((club) => club.id !== selectedClubId));
    //   setSelectedClubId(null);
      setOpenConfirm(false);
    }
  };
  return (
    <>
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {clubs.map((club) => (
        <ClubCard key={club.id} club={club} onDeleteClick={() => {
        setSelectedClubId(club.id);
        setOpenConfirm(true);
      }}  />
      ))}
    </div>
     <ConfirmDialog
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        onConfirm={handleDelete}
        title={t('ConfirmDialog.title')}
        description={t('ConfirmDialog.description')}
      />
    </>
  );
};
