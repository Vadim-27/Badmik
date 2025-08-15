'use client';

import { useRouter } from 'next/navigation';
import css from './BackButton.module.scss';
import { useTranslations } from 'next-intl';

export default function BackButton({ label = '← Назад' }) {
  const router = useRouter();
const tUI = useTranslations('UI');
  return (
    <button
      onClick={() => router.back()}
      className={css.backButton}
    //   className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm rounded"
    >
      {tUI(label)}
    </button>
  );
}