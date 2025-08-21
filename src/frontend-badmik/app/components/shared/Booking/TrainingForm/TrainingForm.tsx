// 'use client';

// import React, { useState } from 'react';
// import ActionHeader from '@/app/components/ui/Layout/ActionHeader/ActionHeader';
// import BackButton from '@/app/components/ui/Buttons/BackButton/BackButton';
// import SaveButton from '@/app/components/ui/Buttons/SaveButton/SaveButton';
// import { useTranslations } from 'next-intl';

// const TrainingForm: React.FC = () => {
//   const [selectedHall, setSelectedHall] = useState('');
//   const [selectedCourts, setSelectedCourts] = useState<string[]>([]);
//   const [trainingName, setTrainingName] = useState('');
//   const [trainingDate, setTrainingDate] = useState('');
//   const [trainingTime, setTrainingTime] = useState('');
//   const [maxParticipants, setMaxParticipants] = useState('');

//   const t = useTranslations('ActionHeader.title');

//   const [isChanged, setIsChanged] = useState(false);

//   const markChanged = () => setIsChanged(true);

//   const handleCourtsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const values = Array.from(e.target.selectedOptions, (option) => option.value);
//     setSelectedCourts(values);
//     markChanged();
//   };

//   const handleSubmit = (e?: React.FormEvent) => {
//     if (e) e.preventDefault();

//     // TODO: логіка відправки даних на бекенд
//     console.log({
//       trainingName,
//       trainingDate,
//       trainingTime,
//       selectedHall,
//       maxParticipants,
//       selectedCourts,
//     });

//     setIsChanged(false); // після збереження кнопка знову неактивна
//   };

//   return (
//     <>
//       <ActionHeader>
//         <BackButton label="buttons.back"/>
//         <h1 className="text-3xl font-bold mb-6">{t('addTrainingHeader')}</h1>
//         <div className="flex flex-wrap gap-2">
//           <SaveButton
//             onClick={() => handleSubmit()}
//             disabled={!isChanged}
//             label="buttons.save"
//           />
//         </div>
//       </ActionHeader>

//       <section className="bg-white  p-4 border-b rounded-2xl shadow border-gray-200 font-geist-sans mb-10">

//         <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <input
//             type="text"
//             placeholder="Назва тренування"
//             value={trainingName}
//             onChange={(e) => { setTrainingName(e.target.value); markChanged(); }}
//             className="font-geist-sans border p-3 rounded-md"
//           />
//           <input
//             type="date"
//             value={trainingDate}
//             onChange={(e) => { setTrainingDate(e.target.value); markChanged(); }}
//             className="border p-3 rounded-md"
//           />

//           <select
//             value={selectedHall}
//             onChange={(e) => { setSelectedHall(e.target.value); markChanged(); }}
//             className="font-geist-sans border p-3 rounded-md"
//           >
//             <option value="" disabled>Оберіть зал</option>
//             <option value="hall1">Зал 1 (10 кортів)</option>
//             <option value="hall2">Зал 2 (5 кортів)</option>
//           </select>

//           <input
//             type="time"
//             value={trainingTime}
//             onChange={(e) => { setTrainingTime(e.target.value); markChanged(); }}
//             className="border p-3 rounded-md"
//           />
//           <input
//             type="number"
//             placeholder="Макс. учасників"
//             value={maxParticipants}
//             onChange={(e) => { setMaxParticipants(e.target.value); markChanged(); }}
//             className="border p-3 rounded-md"
//           />

//           <select
//             multiple
//             value={selectedCourts}
//             onChange={handleCourtsChange}
//             className="border p-3 rounded-md md:col-span-2"
//           >
//             <option value="court1">Корт 1</option>
//             <option value="court2">Корт 2</option>
//             <option value="court3">Корт 3</option>
//             <option value="court4">Корт 4</option>
//           </select>
//         </form>
//       </section>
//     </>
//   );
// };

// export default TrainingForm;

//=============================

'use client';

import { useState } from 'react';
import styles from './CreateTraining.module.scss';
import ActionHeader from '@/app/components/ui/Layout/ActionHeader/ActionHeader';
import BackButton from '@/app/components/ui/Buttons/BackButton/BackButton';
import SaveButton from '@/app/components/ui/Buttons/SaveButton/SaveButton';
import DraftButton from '@/app/components/ui/Buttons/DraftButton/DraftButton';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { clubs } from '@/data/clubs';

type TrainingForm = {
  trainingType: string;
  date: string;
  startTime: string;
  endTime: string;
  courts: number;
  maxParticipants: number;
  coach?: string;
  notes?: string;
  courtsCount: number;
  participantsCount: number;
  recurring: boolean;
  repeatCount?: number;
  weekday?: string;
  levels: string[];
  cancelValue: number;
  cancelUnit: 'minutes' | 'hours' | 'days';
};
type Club = {
  id: string;
  name: string;
  courts: number;
};

export default function CreateTraining({ clubId }: { clubId: string }) {
  const [isActive, setIsActive] = useState(false);
  const [isChanged, setIsChanged] = useState(false);

  const tAH = useTranslations('ActionHeader.title');
  const t = useTranslations('AddTraining');

  const {
    register,
    watch,
    setValue,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<TrainingForm>({
    mode: 'all',
    defaultValues: {
      levels: [], 
    },
  });

  const isRecurring = watch('recurring');

  const onSubmit = (data: TrainingForm) => {
    console.log('Form submitted:', data);
    reset({
    trainingType: '',
    date: '',
    startTime: '',
    endTime: '',
    courts: 0,
    maxParticipants: 0,
    coach: '',
    notes: '',
    courtsCount: 0,
    participantsCount: 0,
    recurring: false,
    repeatCount: undefined,
    weekday: '',
    levels: [],
  });
    setIsChanged(false);
  };

  const [levels, setLevels] = useState({
    A: false,
    B: true,
    C: true,
    D: false,
    Meister: false,
  });

  // const toggleLevel = (level: string) => {
  //   setLevels((prev) => ({ ...prev, [level]: !prev[level] }));
  // };

  const club: Club | undefined = clubs?.find((c) => c.id === clubId);

  console.log('club', club);

  return (
    <>
      <ActionHeader>
        <BackButton label="buttons.back" />
        <h1 className="text-3xl font-bold mb-6">{tAH('addTrainingHeader')}</h1>
        <div className="flex flex-wrap gap-2">
          <DraftButton
            onClick={handleSubmit(onSubmit)}
            disabled={!isChanged}
            label="buttons.draft"
          />
          <SaveButton onClick={handleSubmit(onSubmit)} disabled={!isChanged} label="buttons.save" />
        </div>
      </ActionHeader>
      <div className={styles.container}>
        {/* <h1 className={styles.title}>Створення тренування</h1> */}
        {/* <p className={styles.subtitle}>
          Синя — публікація. Сірі — чернетка та назад. Світла, спокійна палітра.
        </p> */}

        <div className={styles.context}>
          <span className={`${styles.chip} ${styles.chipBlue}`}>{t('Club')}: Badmik Arena</span>
          <span className={styles.chip}>{t('Role')}: Адмін клубу</span>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.layout}>
            {/* LEFT */}
            <section className={`${styles.card} ${styles.grid}`}>
              <h2 className={styles.sectionTitle}>{t('trainingType')}</h2>

              <select
                className={`${styles.select} ${errors.trainingType ? styles.errorInput : ''}`}
                {...register('trainingType', {
                  required: `${t('trainingTypeRequired')}`,
                  onChange: () => setIsChanged(true),
                })}
                //  onChange={() => setIsChanged(true)}
              >
                <option value="">-- {t('selectType')} --</option>
                <option value="Звичайне">{t('ordinary')}</option>
                <option value="Індивідуальне">{t('individual')}</option>
                <option value="Групове">{t('group')}</option>
                <option value="Навчальне">{t('educational')}</option>
                <option value="Оренда кортів">{t('courtRental')}</option>
              </select>
              {errors.trainingType && (
                <p className={styles.errorText}>{errors.trainingType.message}</p>
              )}

              <p className={styles.note}>
                {t('trainingTypeTip')}
              </p>

              <div className={styles.divider}></div>

              <h2 className={styles.sectionTitle}>{t('dateRequired')}</h2>
              <div className={`${styles.grid} ${styles.gridCols3}`}>
                <div>
                  <label className={styles.label}>{t('date')}</label>
                  <input
                    type="date"
                    className={`${styles.input} ${errors.date ? styles.errorInput : ''}`}
                    {...register('date', {
                      required: `${t('dateError')}`,
                      onChange: () => setIsChanged(true),
                      validate: (value) => {
                        const today = new Date();
                        const selectedDate = new Date(value);
                       
                        today.setHours(0, 0, 0, 0);
                        selectedDate.setHours(0, 0, 0, 0);
                        return selectedDate >= today || `${t('datePastError')}`;
                      },
                    })}
                  />
                  {errors.date && <p className={styles.errorText}>{errors.date.message}</p>}
                </div>

                <div>
                  <label className={styles.label}>{t('startTime')}</label>
                  <input
                    type="time"
                    step={60}
                    className={`${styles.input} ${errors.startTime ? styles.errorInput : ''}`}
                    {...register('startTime', {
                      required: `${t('startTimeRequired')}`,
                      validate: (value, formValues) => {
                        if (!formValues.date) return true; 
                        const today = new Date();
                        const selectedDate = new Date(formValues.date);
                        const [hours, minutes] = value.split(':').map(Number);

                        selectedDate.setHours(hours, minutes, 0, 0);

                        if (
                          selectedDate.toDateString() === today.toDateString() &&
                          selectedDate < today
                        ) {
                          return `${t('startTimePastError')}`;
                        }
                        return true;
                      },
                      onChange: () => setIsChanged(true),
                    })}
                  />
                  {errors.startTime && (
                    <p className={styles.errorText}>{errors.startTime.message}</p>
                  )}
                </div>

                <div>
                  <label className={styles.label}>{t('endTime')}</label>
                  <input
                    type="time"
                    step={60}
                    className={`${styles.input} ${errors.endTime ? styles.errorInput : ''}`}
                    {...register('endTime', {
                      required: `${t('endTimeRequired')}`,
                      onChange: () => setIsChanged(true),
                      validate: (value, formValues) =>
                        value > formValues.startTime || `${t('endTimeError')}`,
                    })}
                  />
                  {errors.endTime && <p className={styles.errorText}>{errors.endTime.message}</p>}
                </div>
              </div>

              <div className={`${styles.grid} ${styles.gridCols3}`}>
                <div>
                  <label className={styles.label}>{t('courtsCount')}</label>
                  <input
                    type="number"
                     min="1"
                     max={club?.courts || 1}
                    className={`${styles.input} ${errors.courtsCount ? styles.errorInput : ''}`}
                    {...register('courtsCount', {
                      required: `${t('courtsCountRequired')}`,
                      min: { value: 1, message: `${t('courtsCountMin')}` },
                      max: {
                        value: club?.courts || 1,
                        message: `${t('courtsCountMax', { count: club?.courts ?? 1 })}`,
                        // message: `Максимум ${club?.courts} кортів`,
                      },
                      validate: (value) => Number.isInteger(Number(value)) || `${t('validationInteger')}`,
                      onChange: (e) => {
                        setIsChanged(true);
                        
                        setValue('participantsCount', undefined as unknown as number);
                      },
                    })}
                    onWheel={(e) => e.currentTarget.blur()}
                  />
                  {errors.courtsCount && (
                    <p className={styles.errorText}>{errors.courtsCount.message}</p>
                  )}
                </div>

                <div>
                  <label className={styles.label}>{t('participantsCount')}</label>
                  <input
                    type="number"
                     min="1"
                     max={watch('courtsCount') * 6 || 1}
                    className={`${styles.input} ${errors.participantsCount ? styles.errorInput : ''}`}
                    {...register('participantsCount', {
                      required: `${t('participantsCountRequired')}`,
                      min: { value: 1, message: `${t('participantsCountMin')}` },
                      validate: (value, formValues) => {
                        if (!formValues.courtsCount) return `${t('selectCourtsCount')}`;
                        if (!Number.isInteger(Number(value))) return `${t('validationInteger')}`;
                        if (Number(value) > Number(formValues.courtsCount) * 6)
                          return `${t('participantsCountMax', { count: formValues.courtsCount * 6 })}`;
                      
                        return true;
                      },
                      onChange: () => setIsChanged(true),
                    })}
                    onWheel={(e) => e.currentTarget.blur()} 
                    disabled={!watch('courtsCount')} 
                  />
                  {errors.participantsCount && (
                    <p className={styles.errorText}>{errors.participantsCount.message}</p>
                  )}
                </div>

                <div>
                  <label className={styles.label}>{t('coach')}</label>
                  <input type="text" className={styles.input} {...register('coach',{onChange: () => setIsChanged(true),})}
 />
                </div>
              </div>

              <div className={styles.divider}></div>
              <h2 className={styles.sectionTitle}>{t('additional')}</h2>
              <textarea rows={4} placeholder={t('addDetails')} className={styles.textarea} {...register('notes',{onChange: () => setIsChanged(true),})}
 />
            </section>

            {/* RIGHT */}
            <aside className={styles.grid}>
              <section className={`${styles.grid} ${styles.card}`}>
                <h3 className={styles.sectionTitle}>{t('playerLevels')}</h3>
                
                <div className={styles.levelGroup}>
                  {(['A', 'B', 'C', 'D', 'Meister'] as const).map((lvl) => (
                    <label
                      key={lvl}
                      
                      className={`${styles.levelBtn} ${
                        watch('levels')?.includes(lvl) ? styles.levelBtnActive : ''
                      } ${errors.levels ? styles.errorInput : ''}`}
                    >
                      <input
                        type="checkbox"
                        value={lvl}
                        className={styles.hiddenCheckbox} 
                        {...register('levels', {
                          validate: (val) =>
                            val && val.length > 0 ? true : `${t('selectLevel')}`,
                          onChange: () => setIsChanged(true),
                        })}
                       
                      />
                      {lvl}
                    </label>
                  ))}
                </div>
                {errors.levels && <p className={styles.errorText}>{errors.levels.message}</p>}
                <p className={styles.note}>
                  {t('levelTip')}
                </p>
              </section>

              <section className={`${styles.grid} ${styles.card}`}>
                <h3 className={styles.sectionTitle}>{t('recurring')}</h3>

                <div className={styles.row}>
                  <label className={styles.switch}>
                    <input type="checkbox" id="recurring" {...register('recurring',{onChange: () => setIsChanged(true),})} />
                  </label>
                  <label htmlFor="recurring">{t('repeatWeekly')}</label>
                </div>

                <div className={`${styles.grid} ${styles.gridCols2}`}>
                  <div>
                    <label htmlFor="repeatCount" className={styles.label}>
                      {t('repeatCount')}
                    </label>
                    <input
                      id="repeatCount"
                      type="number"
                      min="1"
                      max="8"
                      className={`${styles.input} ${errors.repeatCount ? styles.errorInput : ''}`}
                      disabled={!isRecurring} 
                      {...register('repeatCount', {
                        validate: (value) => {
                          if (!isRecurring) return true; 
                          if (!value) return `${t('repeatCountRequired')}`;
                          if (value < 1) return `${t('repeatCountMin')}`;
                          if (value > 8) return `${t('repeatCountMax')}`;
                          return true;
                        }, 
                        onChange: () => setIsChanged(true),
                      })}
                    />
                    {errors.repeatCount && (
                      <p className={styles.errorText}>{errors.repeatCount.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="weekday" className={styles.label}>
                      {t('weekday')}
                    </label>
                    <select
                      id="weekday"
                      className={`${styles.input} ${errors.weekday ? styles.errorInput : ''}`}
                      disabled={!isRecurring} 
                      {...register('weekday', {
                        validate: (value) => {
                          if (!isRecurring) return true;
                          if (!value) return `${t('weekdayRequired')}`;
                          return true;
                        },
                        onChange: () => setIsChanged(true),
                      })}
                    >
                      <option value="">{t('selectDays.select')}</option>
                      <option>{t('selectDays.monday')}</option>
                      <option>{t('selectDays.tuesday')}</option>
                      <option>{t('selectDays.wednesday')}</option>
                      <option>{t('selectDays.thursday')}</option>
                      <option>{t('selectDays.friday')}</option>
                      <option>{t('selectDays.saturday')}</option>
                      <option>{t('selectDays.sunday')}</option>
                    </select>
                    {errors.weekday && <p className={styles.errorText}>{errors.weekday.message}</p>}
                  </div>
                </div>

                <p className={styles.note}>
                  {t('repeatTip')}
                </p>
              </section>

              <section className={styles.card}>
                <h3 className={styles.sectionTitle}>{t('bookingRules')}</h3>
                <div className={`${styles.grid} ${styles.gridCols2}`}>
                  <div>
                    <label className={styles.label}>{t('cancelValue')}</label>
                    <input type="number" defaultValue={2} className={styles.input} {...register('cancelValue', {onChange: () => setIsChanged(true),})} />
                  </div>
                  <div>
                    <label className={styles.label}>{t('cancelUnit')}</label>
                    <select defaultValue="hours" className={styles.select} {...register('cancelUnit', {onChange: () => setIsChanged(true),})}>
                      <option value="minutes">{t('minutes')}</option>
                      <option value="hours">{t('hours')}</option>
                      <option value="days">{t('days')}</option>
                    </select>
                  </div>
                </div>
              </section>
            </aside>
          </div>

          {/* <section className={styles.actionbar}>
          <div className={styles.actions}>
            <button
            className={`${styles.btn} ${styles.btnOutline}`}
            onClick={handleBack}
          >
            Назад
          </button>
            <span className={styles.spacer}></span>
            <button className={`${styles.btn} ${styles.btnSecondary}`}>Зберегти як чернетку</button>
            <button className={`${styles.btn} ${styles.btnPrimary}`}>
              Опублікувати тренування
            </button>
          </div>
        </section> */}
        </form>
      </div>
    </>
  );
}
