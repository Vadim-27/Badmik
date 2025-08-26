'use client';

import { Club } from '@/data/clubs';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import css from "./ClubCard.module.scss";

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
        <div className={css.iconbar}>
             <Link
    href={`/admin/${club.id}`}
    className={css.iconBtn}
    title="Переглянути"
    aria-label="Переглянути"
  >
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  </Link>

  {/* Edit */}
  <Link
    href={`/admin/${club.id}/edit`}
    className={css.iconBtn}
    title="Редагувати"
    aria-label="Редагувати"
  >
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z" />
    </svg>
  </Link>

  {/* Delete */}
  <button
    className={css.iconBtn}
    title="Видалити"
    aria-label="Видалити"
    onClick={onDeleteClick}
  >
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M3 6h18M8 6v12m8-12v12M5 6l1 14a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-14" />
      <path d="M10 6V4h4v2" />
    </svg>
  </button>
          </div>
        {/* <span
          className={`text-sm px-2 py-1 rounded-full bg-${club.statusColor}-100 text-${club.statusColor}-700`}
        >
          {club.status}
        </span> */}
      </div>
      <div className="text-sm text-gray-600 space-y-1 mb-3">
        <p>
          <strong>{t('city')}:</strong> {club.city}
        </p>
        <p>
          <strong>{t('address')}:</strong> {club.address}
        </p>
        <p>
          <strong>{t('manager')}:</strong> {club.manager}
        </p>
        <p>
          <strong>{t('courts')}:</strong> {club.courts}
        </p>
      </div>
      <div className={css.stats}>
          <div className={css.stat}><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg><span>Тренувань: 12</span></div>
          <div className={css.stat}><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 11c1.66 0 3-1.57 3-3.5S17.66 4 16 4s-3 1.57-3 3.5S14.34 11 16 11zM8 11c1.66 0 3-1.57 3-3.5S9.66 4 8 4 5 5.57 5 7.5 6.34 11 8 11z"/><path d="M8 13c-2.33 0-7 1.17-7 3.5V20h14v-3.5C15 14.17 10.33 13 8 13zM16 13c-2.33 0-7 1.17-7 3.5V20h14v-3.5c0-2.33-4.67-3.5-7-3.5z"/></svg><span>Гравців: 56</span></div>
        </div>
      {/* <div className="flex gap-2 flex-wrap">
        <Link
          href={`/admin/${club.id}`}
          className="px-3 py-1 bg-primary-button hover:bg-primary-button-hover text-white text-sm rounded"
        >
          {t('buttons.view')}
        </Link>

        <Link
          href={`/admin/${club.id}/edit`}
          className="px-3 py-1 bg-secondary-button hover:bg-secondary-button-hover text-white text-sm rounded"
        >
          {t('buttons.edit')}
        </Link>
        <button
          className="px-3 py-1 bg-delete-button hover:bg-delete-button-hover text-white text-sm rounded cursor-pointer"
          onClick={onDeleteClick}
        >
          {t('buttons.delete')}
        </button>
      </div> */}
    </div>
  );
};
