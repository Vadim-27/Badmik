
'use client';

import React, { useMemo, useState } from 'react';
import styles from './StaffDetails.module.scss';

import ActionHeader from '@/app/components/ui/Layout/ActionHeader/ActionHeader';
import BackButton from '@/app/components/ui/Buttons/BackButton/BackButton';
import EditButton from '@/app/components/ui/Buttons/EditButton/EditButton';
import AppBreadcrumbs from '@/app/components/ui/Breadcrumbs/AppBreadcrumbs';
import SafeDate from '@/app/components/ui/SafeDate/SafeDate';
import WorkingHoursSchedule from '@/app/components/ui/WorkingHoursSchedule/WorkingHoursSchedule';

import type {
  Staff,
  StaffStatus,
  StaffEmploymentType,
  SalaryType,
  StaffPositionType,
  WorkingHoursDto,
} from '@/services/types/staff.dto';
import type { Club } from '@/services/types/clubs.dto';

import { useTranslations } from 'next-intl';
import type { _Translator } from 'next-intl';

import { buildHrefServer } from '@/lib/club-scope.server';

type Props = {
  staff: Staff;
  club?: Club | null;
};

type TranslateFn = _Translator<Record<string, never>>;

const DASH = '—';

const displayOrDash = (v: unknown): string => {
  if (v === null || v === undefined) return DASH;
  const s = String(v).trim();
  return s ? s : DASH;
};

/** ---------- переклад enum значень з бекенду (як у StaffTable) ---------- */
const safeEnumT = (tFn: TranslateFn, key?: string | null): string => {
  if (!key) return DASH;
  const raw = String(key);
  try {
    const out = tFn(raw);
    // якщо перекладу нема — next-intl може повернути ключ або щось з крапкою
    if (!out || out === raw || out.includes('.')) return raw;
    return out;
  } catch {
    return raw;
  }
};

const safeSalaryType = (tSalary: TranslateFn, key?: SalaryType | string | null): string => {
  if (!key) return DASH;
  const raw = String(key);
  try {
    const out = tSalary(`types.${raw}`);
    if (!out || out === `types.${raw}` || out.includes('.')) return raw;
    return out;
  } catch {
    return raw;
  }
};

const safeCurrency = (tSalary: TranslateFn, key?: string | null): string => {
  if (!key) return DASH;
  const raw = String(key);
  try {
    const out = tSalary(`currency.${raw}`);
    if (!out || out === `currency.${raw}` || out.includes('.')) return raw;
    return out;
  } catch {
    return raw;
  }
};

function statusTone(st: unknown) {
  const v = String(st ?? '').toLowerCase();
  if (v.includes('active') || v.includes('working') || v.includes('employed')) return 'active';
  if (v.includes('inactive') || v.includes('blocked') || v.includes('fired') || v.includes('disabled'))
    return 'inactive';
  return 'neutral';
}

function calcSum(u: Staff): number | null {
  if (u.salaryType === 'Salary') return typeof u.monthlySalary === 'number' ? u.monthlySalary : null;
  if (u.salaryType === 'Hourly') return typeof u.hourlyRate === 'number' ? u.hourlyRate : null;

  // perTrainingRate може бути не в Staff dto — читаємо як optional без any
  if (u.salaryType === 'PerTraining') {
    const maybe = (u as unknown as { perTrainingRate?: number | null }).perTrainingRate;
    return typeof maybe === 'number' ? maybe : null;
  }
  return null;
}

const StaffDetails: React.FC<Props> = ({ staff, club }) => {
  const [showSchedule, setShowSchedule] = useState(false);

  // ✅ translations як у твоїй структурі
  const tForm = useTranslations('StaffForm');
  const tWH = useTranslations('WorkingHoursField');

  const tPos = useTranslations('StaffPosition');
  const tStatus = useTranslations('StaffStatus');
  const tEmp = useTranslations('EmploymentType');
  const tSalary = useTranslations('SalaryField');

  const tSB = useTranslations('staffBreadcrumbs');
  const tSD = useTranslations('StaffDetails');

  const fullName = useMemo(() => {
    const fn = (staff.firstName ?? '').trim();
    const ln = (staff.lastName ?? '').trim();
    const n = `${fn} ${ln}`.trim();
    return n || 'Staff';
  }, [staff.firstName, staff.lastName]);

  const tone = statusTone(staff.staffStatus);

  const statusLabel = useMemo(
    () => safeEnumT(tStatus as TranslateFn, staff.staffStatus as StaffStatus),
    [tStatus, staff.staffStatus]
  );

  const employmentLabel = useMemo(
    () => safeEnumT(tEmp as TranslateFn, staff.employmentType as StaffEmploymentType),
    [tEmp, staff.employmentType]
  );

  const positionLabel = useMemo(() => {
    const pos = (staff.positionType ?? null) as StaffPositionType | null;
    return safeEnumT(tPos as TranslateFn, pos);
  }, [tPos, staff.positionType]);

  const sum = useMemo(() => calcSum(staff), [staff]);

  const salaryTypeLabel = useMemo(
    () => safeSalaryType(tSalary as TranslateFn, staff.salaryType as SalaryType),
    [tSalary, staff.salaryType]
  );

  const currencyLabel = useMemo(
    () => safeCurrency(tSalary as TranslateFn, staff.currency ?? null),
    [tSalary, staff.currency]
  );

  const statusClass =
    tone === 'active'
      ? styles.statusActive
      : tone === 'inactive'
        ? styles.statusInactive
        : styles.statusNeutral;

  const editHref = buildHrefServer(staff.clubId, `staff/${staff.id}/EditStaff`);

  // phoneNumber може бути не в dto Staff (у тебе в таблиці так само)
  const phoneNumber = (staff as unknown as { phoneNumber?: string | null }).phoneNumber ?? null;

  // doB може бути не в dto Staff (у тебе в деталях раніше було)
  const doB = (staff as unknown as { doB?: string | null }).doB ?? null;

  // workingHours приходить як string у dto -> віддаємо як є (WorkingHoursSchedule вже вміє)
  const workingHours = staff.workingHours;

  // statusReason є в dto
  const statusReason = staff.statusReason;

  return (
    <section className={styles.wrapper}>
      <ActionHeader>
        <BackButton label="buttons.back" />
        <div className="text-lg font-semibold">
          <h1 className={styles.title}>{fullName}</h1>
        </div>
        <EditButton href={editHref} label="buttons.update" />
      </ActionHeader>

      <div className={styles.wrapperBreadcrumbs}>
        <AppBreadcrumbs
          items={[
            { label: tSB('Admin'), href: '/admin/dashboard' },
            { label: tSB('Staff'), href: '/admin/staff' },
            { label: tSB('StaffOne') },
          ]}
        />
      </div>

      <div className={styles.statusActiveWrapper}>
        <span className={statusClass}>{statusLabel}</span>
        {statusReason ? <span className={styles.statusReason}>{statusReason}</span> : null}
      </div>

      <div className={styles.card}>
        {/* Name */}
        <div className={styles.row}>
          <div className={styles.label}>{tForm('fields.firstName')}</div>
          <div className={styles.value}>{fullName}</div>
        </div>

        {/* Email */}
        <div className={styles.row}>
          <div className={styles.label}>{tForm('fields.email')}</div>
          <div className={styles.value}>{displayOrDash(staff.email)}</div>
        </div>

        {/* Phone */}
        <div className={styles.row}>
          <div className={styles.label}>{tForm('fields.phone')}</div>
          <div className={styles.value}>{displayOrDash(phoneNumber)}</div>
        </div>

        {/* Club */}
        <div className={styles.row}>
          <div className={styles.label}>{tForm('fields.club')}</div>
          <div className={styles.value}>{club?.name ? club.name : displayOrDash(staff.clubId)}</div>
        </div>

        {/* Status */}
        <div className={styles.row}>
          <div className={styles.label}>{tForm('fields.activity')}</div>
          <div className={styles.value}>{statusLabel}</div>
        </div>

        {/* Employment */}
        <div className={styles.row}>
          <div className={styles.label}>{tForm('fields.employmentType')}</div>
          <div className={styles.value}>{employmentLabel}</div>
        </div>

        {/* PositionType (enum) */}
        <div className={styles.row}>
          <div className={styles.label}>{tForm('fields.positionType')}</div>
          <div className={styles.value}>{positionLabel}</div>
        </div>

        {/* Title (text) */}
        <div className={styles.row}>
          <div className={styles.label}>{tForm('fields.title')}</div>
          <div className={styles.value}>{displayOrDash(staff.title)}</div>
        </div>

        {/* Start date */}
        <div className={styles.row}>
          <div className={styles.label}>{tForm('fields.startDate')}</div>
          <div className={styles.value}>
            <SafeDate value={staff.startDate} />
          </div>
        </div>

        {/* End date */}
        <div className={styles.row}>
          <div className={styles.label}>{tForm('fields.endDate')}</div>
          <div className={styles.value}>
            <SafeDate value={staff.endDate} />
          </div>
        </div>

        {/* Date of birth */}
        <div className={styles.row}>
          <div className={styles.label}>{tForm('fields.dob')}</div>
          <div className={styles.value}>
            <SafeDate value={doB} />
          </div>
        </div>

        {/* Notes */}
        <div className={`${styles.row} ${styles.rowDescription}`}>
          <div className={styles.label}>{tForm('fields.notes')}</div>
          <div className={`${styles.value} ${styles.valueMultiline}`}>
            {staff.notes?.trim() ? staff.notes : DASH}
          </div>
        </div>

        {/* Salary: type + sum + currency */}
        <div className={styles.row}>
          <div className={styles.label}>{tSalary('payTypeLabel')}</div>
          <div className={styles.value}>
            {salaryTypeLabel}
            {sum == null ? '' : `: ${String(sum)}${currencyLabel ? ` ${currencyLabel}` : ''}`}
          </div>
        </div>

        {/* Payroll notes */}
        <div className={`${styles.row} ${styles.rowDescription}`}>
          <div className={styles.label}>{tForm('fields.payrollNotes')}</div>
          <div className={`${styles.value} ${styles.valueMultiline}`}>
            {staff.payrollNotes?.trim() ? staff.payrollNotes : DASH}
          </div>
        </div>

        {/* Time zone (у ключах немає — тому залишив як було, але без англ можна потім додати) */}
        <div className={styles.row}>
          <div className={styles.label}>Time zone</div>
          <div className={styles.value}>{displayOrDash(staff.timeZone)}</div>
        </div>

        {/* Working hours */}
        <div className={`${styles.row} ${styles.rowDescription}`}>
          <div className={styles.label}>{tWH('label')}</div>
          <div className={styles.value}>
            <button
              type="button"
              className={`${styles.toggleBtn} ${showSchedule ? styles.toggleBtnActive : ''}`}
              onClick={() => setShowSchedule((v) => !v)}
            >
              {showSchedule ? tWH('toggle.hide') : tWH('toggle.show')}
            </button>

            {showSchedule && (
              <div className={styles.scheduleBox}>
                <WorkingHoursSchedule value={staff.workingHours as unknown as WorkingHoursDto} />
              </div>
            )}
          </div>
        </div>

        {/* Created */}
        <div className={styles.row}>
          <div className={styles.label}>{tSD('fields.created')}</div>
          <div className={styles.value}>
            <SafeDate value={staff.createdAt} />
          </div>
        </div>

        {/* Updated */}
        <div className={styles.row}>
          <div className={styles.label}>{tSD('fields.updated')}</div>
          <div className={styles.value}>
            <SafeDate value={staff.updatedAt} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default StaffDetails;
