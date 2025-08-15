'use client';

import { Club } from '@/data/clubs';
import {Link} from '@/i18n/navigation';
import { useTranslations } from 'next-intl';


type Props = {
  club: Club;
  onDeleteClick?: () => void;
   title?: string;
  message?: string;
};



export const ClubCard = ({ club, onDeleteClick }: Props) => {
  const t = useTranslations('ClubCard');

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
        <p><strong>{t('city')}:</strong> {club.city}</p>
        <p><strong>{t('address')}:</strong> {club.address}</p>
        <p><strong>{t('manager')}:</strong> {club.manager}</p>
        <p><strong>{t('courts')}:</strong> {club.courts}</p>
      </div>
      <div className="flex gap-2 flex-wrap">
        <Link href={`/admin/${club.id}`} className="px-3 py-1 bg-primary-button hover:bg-primary-button-hover text-white text-sm rounded">
           {t('buttons.view')}</Link>
       
        <Link href={`/admin/${club.id}/edit`} className="px-3 py-1 bg-secondary-button hover:bg-secondary-button-hover text-white text-sm rounded">{t('buttons.edit')}</Link>
        <button className="px-3 py-1 bg-delete-button hover:bg-delete-button-hover text-white text-sm rounded cursor-pointer" onClick={onDeleteClick}>{t('buttons.delete')}</button>
      </div>
    </div>
  );
};