'use client';

import React, { useState } from 'react';
import ActionHeader from '@/app/components/ui/Layout/ActionHeader/ActionHeader';
import BackButton from '@/app/components/ui/Buttons/BackButton/BackButton';
import SaveButton from '@/app/components/ui/Buttons/SaveButton/SaveButton';
import { useTranslations } from 'next-intl';

const TrainingForm: React.FC = () => {
  const [selectedHall, setSelectedHall] = useState('');
  const [selectedCourts, setSelectedCourts] = useState<string[]>([]);
  const [trainingName, setTrainingName] = useState('');
  const [trainingDate, setTrainingDate] = useState('');
  const [trainingTime, setTrainingTime] = useState('');
  const [maxParticipants, setMaxParticipants] = useState('');

  const t = useTranslations('ActionHeader.title');

  const [isChanged, setIsChanged] = useState(false);

  const markChanged = () => setIsChanged(true);

  const handleCourtsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const values = Array.from(e.target.selectedOptions, (option) => option.value);
    setSelectedCourts(values);
    markChanged();
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    // TODO: логіка відправки даних на бекенд
    console.log({
      trainingName,
      trainingDate,
      trainingTime,
      selectedHall,
      maxParticipants,
      selectedCourts,
    });

    setIsChanged(false); // після збереження кнопка знову неактивна
  };

  return (
    <>
      <ActionHeader>
        <BackButton label="buttons.back"/>
        <h1 className="text-3xl font-bold mb-6">{t('addTrainingHeader')}</h1>
        <div className="flex flex-wrap gap-2">
          <SaveButton
            onClick={() => handleSubmit()}
            disabled={!isChanged}
            label="buttons.save"
          />
        </div>
      </ActionHeader>

      <section className="bg-white  p-4 border-b rounded-2xl shadow border-gray-200 font-geist-sans mb-10">
      
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Назва тренування"
            value={trainingName}
            onChange={(e) => { setTrainingName(e.target.value); markChanged(); }}
            className="font-geist-sans border p-3 rounded-md"
          />
          <input
            type="date"
            value={trainingDate}
            onChange={(e) => { setTrainingDate(e.target.value); markChanged(); }}
            className="border p-3 rounded-md"
          />

          <select
            value={selectedHall}
            onChange={(e) => { setSelectedHall(e.target.value); markChanged(); }}
            className="font-geist-sans border p-3 rounded-md"
          >
            <option value="" disabled>Оберіть зал</option>
            <option value="hall1">Зал 1 (10 кортів)</option>
            <option value="hall2">Зал 2 (5 кортів)</option>
          </select>

          <input
            type="time"
            value={trainingTime}
            onChange={(e) => { setTrainingTime(e.target.value); markChanged(); }}
            className="border p-3 rounded-md"
          />
          <input
            type="number"
            placeholder="Макс. учасників"
            value={maxParticipants}
            onChange={(e) => { setMaxParticipants(e.target.value); markChanged(); }}
            className="border p-3 rounded-md"
          />

          <select
            multiple
            value={selectedCourts}
            onChange={handleCourtsChange}
            className="border p-3 rounded-md md:col-span-2"
          >
            <option value="court1">Корт 1</option>
            <option value="court2">Корт 2</option>
            <option value="court3">Корт 3</option>
            <option value="court4">Корт 4</option>
          </select>
        </form>
      </section>
    </>
  );
};

export default TrainingForm;
