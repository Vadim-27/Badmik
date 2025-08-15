'use client';

import { useState } from 'react';
import { Club } from '@/data/clubs';
import ActionHeader from '@/app/components/ui/Layout/ActionHeader/ActionHeader';
import BackButton from '@/app/components/ui/Buttons/BackButton/BackButton';
import SaveButton from '@/app/components/ui/Buttons/SaveButton/SaveButton';
import { useTranslations } from 'next-intl';

type Props = {
  club: Club;
};

export default function ClubEditForm({ club }: Props) {
  const [form, setForm] = useState(club);
  const [isChanged, setIsChanged] = useState(false);

  const t = useTranslations('ClubCard');
  const tAH = useTranslations('ActionHeader.title');

  const handleChange = (key: keyof Club, value: string | number) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));

   
    setIsChanged(true);
  };

  const handleSave = () => {
    console.log('Збережено:', form);

    
    setIsChanged(false);
  };

  return (
    <div>
      <ActionHeader>
        <BackButton label="buttons.back"/>
        <h2 className="text-lg font-semibold">{tAH('editClubHeader')} {club.name}</h2>
        <div className="flex flex-wrap gap-2">
          <SaveButton
            onClick={handleSave}
            disabled={!isChanged}
            label="buttons.save"
          />
        </div>
      </ActionHeader>

      <div className="max-w-xl mx-auto bg-white shadow p-6 rounded-xl space-y-4">
        <ul className="space-y-4">
          <li className="flex justify-between items-center">
            <span className="font-medium w-1/3">{t('name')}</span>
            <input
              type="text"
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-2/3 p-2 border rounded"
            />
          </li>
          <li className="flex justify-between items-center">
            <span className="font-medium w-1/3">{t('city')}</span>
            <input
              type="text"
              value={form.city}
              onChange={(e) => handleChange('city', e.target.value)}
              className="w-2/3 p-2 border rounded"
            />
          </li>
          <li className="flex justify-between items-center">
            <span className="font-medium w-1/3">{t('address')}</span>
            <input
              type="text"
              value={form.address}
              onChange={(e) => handleChange('address', e.target.value)}
              className="w-2/3 p-2 border rounded"
            />
          </li>
          <li className="flex justify-between items-center">
            <span className="font-medium w-1/3">{t('manager')}</span>
            <input
              type="text"
              value={form.manager}
              onChange={(e) => handleChange('manager', e.target.value)}
              className="w-2/3 p-2 border rounded"
            />
          </li>
          <li className="flex justify-between items-center">
            <span className="font-medium w-1/3">{t('courts')}</span>
            <input
              type="number"
              value={form.courts}
              onChange={(e) => handleChange('courts', Number(e.target.value))}
              className="w-2/3 p-2 border rounded"
            />
          </li>
          <li className="flex justify-between items-center">
            <span className="font-medium w-1/3">{t('status')}</span>
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
      </div>
    </div>
  );
}
