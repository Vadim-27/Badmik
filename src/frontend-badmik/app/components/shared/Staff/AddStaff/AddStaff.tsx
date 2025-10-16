

// AddStaff.tsx (з react-query)
// src/app/components/shared/Staff/AddStaff/AddStaff.tsx
'use client';

import React, { useRef, useState } from 'react';

import ActionHeader from '@/app/components/ui/Layout/ActionHeader/ActionHeader';
import BackButton from '@/app/components/ui/Buttons/BackButton/BackButton';
import SaveButton from '@/app/components/ui/Buttons/SaveButton/SaveButton';
import { useTranslations } from 'next-intl';

import { getApiErrorMessage } from '@/lib/http/utils';
import { dateToIsoStartOfDay } from '@/services/players.service'; 


import { useStaff } from '@/features/staff/hooks/useStaff';
import { useCreateStaff } from '@/features/staff/hooks/useStaff';


import StaffFormNew, {
  StaffFormHandle,
  FormValues,
} from '../StaffForm/StaffFormNew';

import type { StaffRegisterDto } from '@/services/types/staff.dto';

function toDateOnly(dateStr?: string) {
 
  if (!dateStr) return new Date().toISOString().slice(0, 10);
  const [y, m, d] = dateStr.split('-').map(Number);
  const dt = new Date(Date.UTC(y || 1970, (m || 1) - 1, d || 1));
  return dt.toISOString().slice(0, 10);
}

export default function NewStaff() {
  const tAH = useTranslations('ActionHeader');

 
  const formRef = useRef<StaffFormHandle | null>(null);
  const [isChanged, setIsChanged] = useState(false);

  // const { data: staff, isLoading, isError, error } = useStaff();
  const createStaff = useCreateStaff();

  
  // if (isLoading) return <p>Loading staff…</p>;
  // if (isError) {
  //   return (
  //     <pre className="text-red-500 whitespace-pre-wrap">
  //       {getApiErrorMessage(error)}
  //     </pre>
  //   );
  // }

  
  const handleCreate = async (v: FormValues): Promise<void> => {
   
    if (!v.clubId) {
      alert('clubId є обов’язковим для створення staff');
      return;
    }


const buildWorkingHours = (wh: FormValues['workingHoursObj']) => ({
  monday:    { from: wh.monday.from || null,    to: wh.monday.to || null },
  tuesday:   { from: wh.tuesday.from || null,   to: wh.tuesday.to || null },
  wednesday: { from: wh.wednesday.from || null, to: wh.wednesday.to || null },
  thursday:  { from: wh.thursday.from || null,  to: wh.thursday.to || null },
  friday:    { from: wh.friday.from || null,    to: wh.friday.to || null },
  saturday:  { from: wh.saturday.from || null,  to: wh.saturday.to || null },
  sunday:    { from: wh.sunday.from || null,    to: wh.sunday.to || null },
});


// const buildWorkingHours = (wh: FormValues['workingHoursObj']) =>
//   Object.fromEntries(
//     Object.entries(wh).map(([day, { from, to }]) => [day, { from: from || null, to: to || null }])
//   );


const safeImageUrl =
  v.imageUrl && !v.imageUrl.startsWith('blob:') ? v.imageUrl : null;

   const payload: StaffRegisterDto = {
  email: v.email || null,
  password: v.password || null,
  firstName: v.firstName || null,
  lastName: v.lastName || null,

  clubId: v.clubId,
  doB: dateToIsoStartOfDay(v.doB),

  staffStatus: (v.staffStatus as StaffRegisterDto['staffStatus']) ?? 'New',
  employmentType: (v.employmentType as StaffRegisterDto['employmentType']) ?? 'Employee',

  title: v.title || null,
  startDate: toDateOnly(v.startDate),

  phoneNumber: v.phone || null,
  imageUrl: safeImageUrl,                       // ⬅️ НЕ шлемо blob:...

  notes: v.notes || null,

  salaryType: (v.salaryType as StaffRegisterDto['salaryType']) ?? 'Hourly',
  hourlyRate: v.hourlyRate ?? 0,
  monthlySalary: v.monthlySalary ?? 0,
  currency: v.currency || null,
  payrollNotes: v.payrollNotes || null,

  timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,

  // ⬇️ БЕК ЧЕКАЄ ОБ’ЄКТ, НЕ STRING
  workingHours: buildWorkingHours(v.workingHoursObj),

  workingHoursExceptions: null, // якщо поки не підтримуєш
};

// console.error('➡️ Payload to /staff/Register:', payload);
    try {
      const created = await createStaff.mutateAsync(payload);
      console.log('✅ Staff created:', created);
      
    } catch (err) {
      const msg = getApiErrorMessage(err);
      alert(msg);
      console.error('❌ Create staff failed:', msg, err);
    }
  };

  return (
    <>
      <ActionHeader>
        <BackButton label="buttons.back" />
        <h2 className="text-lg font-semibold">{tAH('title.addStaffHeader')}</h2>
        <SaveButton
          onClick={() => formRef.current?.submit()}
          disabled={!isChanged || createStaff.isPending}
          label={createStaff.isPending ? 'buttons.saving' : 'buttons.save'}
        />
      </ActionHeader>

      {/* приклад виводу існуючих співробітників */}
      {/* {!staff?.length ? (
        <p>Порожньо</p>
      ) : (
        <ul className="space-y-2 mb-6">
          {staff.map((s) => (
            <li key={s.id} className="rounded border p-3">
              <div className="font-medium">
                {s.firstName} {s.lastName}
              </div>
              <div className="text-sm opacity-80">
                {s.email} • {s.staffStatus} • {s.employmentType}
              </div>
            </li>
          ))}
        </ul>
      )} */}

      <StaffFormNew ref={formRef}
        mode="create"
        isChanged={isChanged}
        setIsChanged={setIsChanged}
        onSubmitCreate={handleCreate} />

      {/* <StaffForm
        ref={formRef}
        mode="create"
        isChanged={isChanged}
        setIsChanged={setIsChanged}
        onSubmitCreate={handleCreate}
      /> */}

      
    </>
  );
}




