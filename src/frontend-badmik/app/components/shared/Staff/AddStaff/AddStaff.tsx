// AddStaff.tsx (з react-query)
// src/app/components/shared/Staff/AddStaff/AddStaff.tsx
'use client';

import React, { useRef, useState } from 'react';

import ActionHeader from '@/app/components/ui/Layout/ActionHeader/ActionHeader';
import BackButton from '@/app/components/ui/Buttons/BackButton/BackButton';
import SaveButton from '@/app/components/ui/Buttons/SaveButton/SaveButton';
import { useTranslations } from 'next-intl';

import { getApiErrorMessage } from '@/lib/http/utils';
// import { dateToIsoStartOfDay } from '@/services/players.service';

// import { useStaff } from '@/features/staff/hooks/useStaff';
// import { useCreateStaff } from '@/features/staff/hooks/useStaff';
import { useCreateStaff } from '@/services/staff/queries.client';

import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import AppBreadcrumbs from '@/app/components/ui/Breadcrumbs/AppBreadcrumbs';

import StaffFormNew, { StaffFormHandle, FormValues } from '../StaffForm/StaffFormNew';

import type { StaffRegisterDto } from '@/services/types/staff.dto';
import css from './AddStaff.module.scss';

export function dateToIsoStartOfDay(dateStr: string) {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-').map(Number);
  // UTC, щоб уникнути зсувів таймзони
  return new Date(Date.UTC(y, (m ?? 1) - 1, d ?? 1, 0, 0, 0)).toISOString();
}

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
  const [snack, setSnack] = useState<{
    open: boolean;
    severity: 'success' | 'error';
    message: string;
  }>({
    open: false,
    severity: 'success',
    message: '',
  });
  // const qc = useQueryClient();

  // const { data: staff, isLoading, isError, error } = useStaff();
  const createStaff = useCreateStaff();

  const handleCreate = async (v: FormValues): Promise<void> => {
    if (!v.clubId) {
      alert('clubId є обов’язковим для створення staff');
      return;
    }

    // const buildWorkingHours = (wh: FormValues['workingHoursObj']) => ({
    //   monday:    { from: wh.monday.from || null,    to: wh.monday.to || null },
    //   tuesday:   { from: wh.tuesday.from || null,   to: wh.tuesday.to || null },
    //   wednesday: { from: wh.wednesday.from || null, to: wh.wednesday.to || null },
    //   thursday:  { from: wh.thursday.from || null,  to: wh.thursday.to || null },
    //   friday:    { from: wh.friday.from || null,    to: wh.friday.to || null },
    //   saturday:  { from: wh.saturday.from || null,  to: wh.saturday.to || null },
    //   sunday:    { from: wh.sunday.from || null,    to: wh.sunday.to || null },
    // });

    const buildWorkingHours = (wh: FormValues['workingHours']) => {
      const days = [
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday',
        'sunday',
      ] as const;

      const result: Record<(typeof days)[number], { from: string; to: string } | null> = {} as any;

      for (const day of days) {
        const from = wh[day]?.from?.trim() || null;
        const to = wh[day]?.to?.trim() || null;

        // якщо обидва пусті — вихідний
        if (!from && !to) {
          result[day] = null;
          continue;
        }

        // якщо один є, іншого нема — це логічна помилка у формі
        if (!from || !to) {
          throw new Error(`У день "${day}" задано лише один час. Потрібно обидва або жодного.`);
        }

        // робочий день
        result[day] = { from, to };
      }

      return result;
    };

    // const buildWorkingHours = (wh: FormValues['workingHoursObj']) =>
    //   Object.fromEntries(
    //     Object.entries(wh).map(([day, { from, to }]) => [day, { from: from || null, to: to || null }])
    //   );

    const safeImageUrl = v.imageUrl && !v.imageUrl.startsWith('blob:') ? v.imageUrl : null;

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
      imageUrl: safeImageUrl,

      notes: v.notes || null,

      salaryType: (v.salaryType as StaffRegisterDto['salaryType']) ?? 'Hourly',
      hourlyRate: v.hourlyRate ?? 0,
      monthlySalary: v.monthlySalary ?? 0,
      currency: v.currency || null,
      payrollNotes: v.payrollNotes || null,

      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,

      workingHours: buildWorkingHours(v.workingHours),

      workingHoursExceptions: null,
    };

    console.groupCollapsed('➡️ /staff/Register payload');
    console.log('raw form:', v);
    // console.log('doB raw (from input):', rawDoB);
    console.log('doB as sent (ISO):', payload.doB);
    // console.log('debug date calc:', {
    //   'new Date(rawDoB).toString()': new Date(rawDoB).toString(),
    //   'new Date(rawDoB).toISOString()': (() => {
    //     try { return new Date(rawDoB).toISOString(); } catch { return 'invalid' }
    //   })(),
    // });
    console.log('FULL payload:', payload);
    console.groupEnd();

    // console.error('➡️ Payload to /staff/Register:', payload);
    try {
      const created = await createStaff.mutateAsync(payload);
      setSnack({ open: true, severity: 'success', message: 'Співробітника створено' });
      console.log('✅ Staff created:', created);
    } catch (err) {
      const msg = getApiErrorMessage(err);
      setSnack({ open: true, severity: 'error', message: msg });
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
      <div className={css.wrapperBreadcrumbs}>
        <AppBreadcrumbs
          items={[
            { label: 'Admin', href: '/admin/dashboard' },
            { label: 'Access Control', href: '/admin/access-control' },
            { label: 'Add Staff' },
          ]}
        />
      </div>

      <StaffFormNew
        ref={formRef}
        mode="create"
        isChanged={isChanged}
        setIsChanged={setIsChanged}
        onSubmitCreate={handleCreate}
        busy={createStaff.isPending}
      />

      <Snackbar
        open={snack.open}
        autoHideDuration={4000}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={snack.severity}
          variant="filled"
          onClose={() => setSnack((s) => ({ ...s, open: false }))}
          sx={{ width: '100%' }}
        >
          {snack.message}
        </Alert>
      </Snackbar>
    </>
  );
}
