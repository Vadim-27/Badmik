'use client';

import React from 'react';
import {Link} from '@/i18n/navigation';
import ActionHeader from '@/app/components/ui/Layout/ActionHeader/ActionHeader';
import BackButton from '@/app/components/ui/Buttons/BackButton/BackButton';
import AddButton from '@/app/components/ui/Buttons/AddButton/AddButton';
import { useTranslations } from 'next-intl';

const ClubListHeader: React.FC = () => {
  const t = useTranslations('ActionHeader.title');
  return (
    <>
   
    <ActionHeader>
      <button className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm rounded">
          🔄 Оновити
        </button>

        <h2 className="text-lg font-semibold">{t('adminHeader')}</h2>

        <AddButton href="/admin/add-club/" label="buttons.addClub" />

    </ActionHeader>
    </>
  );
};

export default ClubListHeader;
