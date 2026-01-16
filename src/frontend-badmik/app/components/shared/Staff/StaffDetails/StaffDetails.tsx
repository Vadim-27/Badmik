'use client';

import React, { useMemo, useState } from 'react';
import styles from './StaffDetails.module.scss';

import ActionHeader from '@/app/components/ui/Layout/ActionHeader/ActionHeader';
import BackButton from '@/app/components/ui/Buttons/BackButton/BackButton';
import EditButton from '@/app/components/ui/Buttons/EditButton/EditButton';
import AppBreadcrumbs from '@/app/components/ui/Breadcrumbs/AppBreadcrumbs';
import SafeDate from '@/app/components/ui/SafeDate/SafeDate';
import WorkingHoursSchedule from '@/app/components/ui/WorkingHoursSchedule/WorkingHoursSchedule';

import type { Staff } from '@/services/types/staff.dto';
import type { Club } from '@/services/types/clubs.dto';
import { useTranslations } from 'next-intl';

type Props = {
  staff: Staff;
  club?: Club | null;
};

const StaffDetails: React.FC<Props> = ({ staff, club }) => {
  const {
    id,
    clubId,
    email,
    firstName,
    lastName,
    phoneNumber,
    imageUrl,
    staffStatus,
    employmentType,
    title,
    startDate,
    endDate,
    doB,
    notes,
    salaryType,
    hourlyRate,
    monthlySalary,
    currency,
    perTrainingRate,
    payrollNotes,
    timeZone,
    workingHours,
    statusReason,
    createdAt,
    updatedAt,
  } = staff as any;

  const [showSchedule, setShowSchedule] = useState(false);
  const tSB = useTranslations('staffBreadcrumbs');

  const fullName = useMemo(() => {
    const fn = (firstName ?? '').trim();
    const ln = (lastName ?? '').trim();
    const n = `${fn} ${ln}`.trim();
    return n || 'Staff';
  }, [firstName, lastName]);

  const statusText = staffStatus ?? '—';
  const employmentText = employmentType ?? '—';
  const salaryText = useMemo(() => {
    const cur = currency?.trim() ? currency : '';
    if (salaryType === 'Hourly') return `${hourlyRate ?? 0} ${cur}`.trim();
    if (salaryType === 'Monthly') return `${monthlySalary ?? 0} ${cur}`.trim();
    if (salaryType === 'PerTraining') return `${perTrainingRate ?? 0} ${cur}`.trim();
    return salaryType ?? '—';
  }, [salaryType, hourlyRate, monthlySalary, perTrainingRate, currency]);

  const statusClass =
    statusText === 'Active'
      ? styles.statusActive
      : statusText === 'Inactive'
        ? styles.statusInactive
        : styles.statusNeutral;

  return (
    <section className={styles.wrapper}>
      <ActionHeader>
        <BackButton label="buttons.back" />
        <div className="text-lg font-semibold">
          <h1 className={styles.title}>{fullName}</h1>
        </div>

        {/* підстав шлях під твою структуру */}
        <EditButton href={`/admin/staff/${id}/edit`} label="buttons.update" />
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
        <span className={statusClass}>{statusText}</span>
        {statusReason ? <span className={styles.statusReason}>{statusReason}</span> : null}
      </div>

      <div className={styles.card}>
        <div className={styles.row}>
          <div className={styles.label}>Name</div>
          <div className={styles.value}>{fullName}</div>
        </div>

        <div className={styles.row}>
          <div className={styles.label}>Email</div>
          <div className={styles.value}>{email || '—'}</div>
        </div>

        <div className={styles.row}>
          <div className={styles.label}>Phone</div>
          <div className={styles.value}>{phoneNumber || '—'}</div>
        </div>

        <div className={styles.row}>
          <div className={styles.label}>Club</div>
          <div className={styles.value}>{club?.name ? club.name : clubId ? clubId : '—'}</div>
        </div>

        <div className={styles.row}>
          <div className={styles.label}>Employment</div>
          <div className={styles.value}>{employmentText}</div>
        </div>

        <div className={styles.row}>
          <div className={styles.label}>Title</div>
          <div className={styles.value}>{title || '—'}</div>
        </div>

        <div className={styles.row}>
          <div className={styles.label}>Start date</div>
          <div className={styles.value}>{startDate || '—'}</div>
        </div>

        <div className={styles.row}>
          <div className={styles.label}>End date</div>
          <div className={styles.value}>{endDate || '—'}</div>
        </div>

        <div className={styles.row}>
          <div className={styles.label}>Date of birth</div>
          <div className={styles.value}><SafeDate value={doB} /></div>
        </div>

        <div className={`${styles.row} ${styles.rowDescription}`}>
          <div className={styles.label}>Notes</div>
          <div className={`${styles.value} ${styles.valueMultiline}`}>
            {notes?.trim() ? notes : '—'}
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.label}>Salary</div>
          <div className={styles.value}>{salaryText}</div>
        </div>

        <div className={`${styles.row} ${styles.rowDescription}`}>
          <div className={styles.label}>Payroll notes</div>
          <div className={`${styles.value} ${styles.valueMultiline}`}>
            {payrollNotes?.trim() ? payrollNotes : '—'}
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.label}>Time zone</div>
          <div className={styles.value}>{timeZone || '—'}</div>
        </div>

        <div className={`${styles.row} ${styles.rowDescription}`}>
          <div className={styles.label}>Working hours</div>
          <div className={styles.value}>
            <button
              type="button"
              className={`${styles.toggleBtn} ${showSchedule ? styles.toggleBtnActive : ''}`}
              onClick={() => setShowSchedule((v) => !v)}
            >
              {showSchedule ? 'Сховати графік' : 'Показати графік'}
            </button>

            {showSchedule && (
              <div className={styles.scheduleBox}>
                <WorkingHoursSchedule value={workingHours} />
              </div>
            )}
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.label}>Created</div>
          <div className={styles.value}><SafeDate value={createdAt} /></div>
        </div>

        <div className={styles.row}>
          <div className={styles.label}>Updated</div>
          <div className={styles.value}><SafeDate value={updatedAt} /></div>
        </div>
      </div>
    </section>
  );
};

export default StaffDetails;
