

'use client';

import React, { useRef, useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import ActionHeader from '@/app/components/ui/Layout/ActionHeader/ActionHeader';
import BackButton from '@/app/components/ui/Buttons/BackButton/BackButton';
import SaveButton from '@/app/components/ui/Buttons/SaveButton/SaveButton';
import StaffFormNew, { StaffFormHandle } from '../StaffForm/StaffFormNew';
import { useTranslations } from 'next-intl';

import type { Staff } from '@/services/types/staff.dto';
import { useStaffById } from '@/services/staff/queries.client';
import { useUpdateStaff } from '@/services/staff/queries.client';
import { useAssignRoleForUser } from '@/services/role/queries.client';
import { getApiErrorMessage } from '@/lib/http/utils';

// import type { UpdateStaffDto, WorkingHours } from '@/services/types/staff.dto';
import type { UpdateStaffDto, WorkingHoursDto } from '@/services/types/staff.dto';

function parseWorkingHours(
  input: string | Record<string, any> | null | undefined
): WorkingHoursDto {
  const emptyDay = { from: null, to: null } as const;
  const empty: WorkingHoursDto = {
    monday: { ...emptyDay },
    tuesday: { ...emptyDay },
    wednesday: { ...emptyDay },
    thursday: { ...emptyDay },
    friday: { ...emptyDay },
    saturday: { ...emptyDay },
    sunday: { ...emptyDay },
  };

  if (!input) return empty;

  let raw: Record<string, { from: string; to: string } | null>;
  if (typeof input === 'string') {
    try {
      raw = JSON.parse(input);
    } catch {
      return empty;
    }
  } else {
    raw = input as Record<string, { from: string; to: string } | null>;
  }

  const normalizeDay = (
    v: { from?: string | null; to?: string | null } | null
  ): { from: string | null; to: string | null } => {
    if (v == null) return { from: null, to: null };
    return {
      from: typeof v.from === 'string' ? v.from : null,
      to: typeof v.to === 'string' ? v.to : null,
    };
  };

  return {
    monday: normalizeDay(raw.monday),
    tuesday: normalizeDay(raw.tuesday),
    wednesday: normalizeDay(raw.wednesday),
    thursday: normalizeDay(raw.thursday),
    friday: normalizeDay(raw.friday),
    saturday: normalizeDay(raw.saturday),
    sunday: normalizeDay(raw.sunday),
  };
}

function buildWorkingHoursForApi(wh: WorkingHoursDto): WorkingHoursDto {
  const result = {} as WorkingHoursDto;

  (Object.keys(wh) as (keyof WorkingHoursDto)[]).forEach((day) => {
    const from = wh[day]?.from?.trim() || null;
    const to = wh[day]?.to?.trim() || null;

    if (!from && !to) {
      result[day] = null;
    } else if (!from || !to) {
      throw new Error(`У день "${day}" задано лише один час. Потрібно обидва або жодного.`);
    } else {
      result[day] = { from, to };
    }
  });

  return result;
}

function mapFromDtoToForm(dto: Staff) {
  return {
    email: dto.email ?? '',
    password: '',
    firstName: dto.firstName ?? '',
    lastName: dto.lastName ?? '',
    clubId: dto.clubId ?? '',
    doB: (dto as any).doB ? (dto as any).doB.slice(0, 10) : '',
    title: dto.title ?? '',
    phone: (dto as any).phoneNumber ?? null,
    startDate: dto.startDate ? dto.startDate.slice(0, 10) : '',
    employmentType: dto.employmentType,
    imageUrl: (dto as any).imageUrl ?? '',
    salaryType: dto.salaryType,
    hourlyRate: dto.hourlyRate ?? 0,
    monthlySalary: dto.monthlySalary ?? null,
    perTrainingRate: (dto as any).perTrainingRate ?? null,
    currency: (dto.currency as 'UAH' | 'USD' | null) ?? null,
    payrollNotes: dto.payrollNotes ?? null,
    notes: dto.notes ?? null,
    staffStatus: dto.staffStatus,
    workingHoursObj: parseWorkingHours(dto.workingHours),
    roleId: (dto as any).roleId ?? null, 
    endDate: (dto as any).endDate ?? null,
  };
}

type Props = { staffId: string; initialData: Staff; title?: string };

const toDateTimeISO = (d?: string | null) => (d ? new Date(d + 'T00:00:00Z').toISOString() : null);

export default function EditStaff({ staffId, initialData }: Props) {
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

  const q = useStaffById(staffId, {
    initialData,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });
  const userId = (q.data as Staff)?.userId || null;

  const updateStaff = useUpdateStaff();
  const assignRole = useAssignRoleForUser();

  const defaultValues = { ...mapFromDtoToForm(q.data as Staff), userId };

  const buildUpdateDto = (formValues: any): UpdateStaffDto => {
    const wh = formValues.workingHoursObj as WorkingHoursDto; 
    return {
      id: staffId,
      email: formValues.email || undefined,
      firstName: formValues.firstName || undefined,
      lastName: formValues.lastName || undefined,
      phoneNumber: formValues.phone ?? null,
      imageUrl: formValues.imageUrl || undefined,
      clubId: formValues.clubId || undefined,
      doB: toDateTimeISO(formValues.doB) || undefined, 
      staffStatus: formValues.staffStatus,
      employmentType: formValues.employmentType,
      title: formValues.title || undefined,
      startDate: formValues.startDate || undefined,
      endDate: formValues.endDate ?? null,
      notes: formValues.notes ?? null,
      salaryType: formValues.salaryType,
      hourlyRate: formValues.hourlyRate ?? 0,
      monthlySalary: formValues.monthlySalary ?? 0,
      currency: formValues.currency ?? null,
      // perTrainingRate: formValues.perTrainingRate ?? 0,
      payrollNotes: formValues.payrollNotes ?? null,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone ?? 'UTC',
      workingHours: buildWorkingHoursForApi(wh),
    };
  };

  return (
    <>
      <ActionHeader>
        <BackButton label="buttons.back" />
        <h2 className="text-lg font-semibold">{tAH('title.editStaffHeader')}</h2>
        <SaveButton
          onClick={() => formRef.current?.submit()}
          disabled={!isChanged}
          label="buttons.save"
        />
      </ActionHeader>

      <StaffFormNew
        ref={formRef}
        mode="edit"
        staffId={staffId}
        isChanged={isChanged}
        setIsChanged={setIsChanged}
        defaultValues={defaultValues}
        onSubmitUpdate={async (_id, formValues) => {
          try {
            const newRoleId = formValues.roleId ?? null;
            const clubId = formValues.clubId ?? null;
            const uId = formValues.userId ?? userId;

            
            const dto = buildUpdateDto(formValues);
            await updateStaff.mutateAsync({ id: staffId, dto });

           
            if (newRoleId && clubId && uId) {
              try {
                await assignRole.mutateAsync({
                  userId: uId,
                  roleId: newRoleId,
                  clubId,
                });
                setSnack({ open: true, severity: 'success', message: 'Роль заасайнено' });
              } catch (e) {
                setSnack({ open: true, severity: 'error', message: 'Не вдалось асайнити роль' });
              }
            }

            setSnack({
              open: true,
              severity: 'success',
              message: 'Зміни збережено',
            });
          } catch (err) {
            const msg = getApiErrorMessage(err);
            setSnack({
              open: true,
              severity: 'error',
              message: msg,
            });
            throw err;
          }
        }}
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
