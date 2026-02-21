//==========================================

'use client';

import { useEffect, useMemo, useState } from 'react';
import styles from './StaffTable.module.scss';
import { Link } from '@/i18n/navigation';

import { useStaffList } from '@/services/staff/queries.client';
import type {
  Staff,
  StaffStatus,
  StaffEmploymentType,
  SalaryType,
  StaffPositionType,
} from '@/services/types/staff.dto';

import SpinnerOverlay from '@/app/components/ui/SpinnerOverlay/SpinnerOverlay';
import ConfirmDialog from '@/app/components/ui/DeleteModal/ConfirmDialog';

import EyeIcon from '@/app/assets/icons/Eye.svg';
import EditIcon from '@/app/assets/icons/Edit.svg';
import TrashIcon from '@/app/assets/icons/Trash.svg';
import Tooltip from '@/app/components/ui/Tooltip/Tooltip';
import { useTranslations } from 'next-intl';
import type { _Translator } from 'next-intl';

import AppModal from '@/app/components/ui/Modal/AppModal';
import StaffRolesManager from '@/app/components/shared/Staff/StaffRolesManager/StaffRolesManager';
import RolesIcon from '@/app/assets/icons/Roles.svg';

type TranslateFn = _Translator<Record<string, never>>;

// type TranslateFn = (key: string, values?: Record<string, unknown>) => string;

const DASH = '—';
const EMPTY_LABEL = 'дані ще не заповнені';

const displayOrDefault = (v: unknown): string => {
  if (v === null || v === undefined) return EMPTY_LABEL;
  const s = String(v);
  return s.trim() === '' ? EMPTY_LABEL : s;
};

const toNameCase = (v: unknown) =>
  String(v ?? '')
    .trim()
    .toLocaleLowerCase('uk-UA')
    .replace(/(^|\s|-)\p{L}/gu, (m) => m.toLocaleUpperCase('uk-UA'));

function fullName(first?: unknown, last?: unknown) {
  const f = String(first ?? '').trim();
  const l = String(last ?? '').trim();
  if (!f && !l) return EMPTY_LABEL;
  return `${f}${f && l ? ' ' : ''}${l}`;
}

/** ---------- type guards без any ---------- */
type UnknownRecord = Record<string, unknown>;

function isRecord(v: unknown): v is UnknownRecord {
  return typeof v === 'object' && v !== null;
}

function getProp(v: UnknownRecord, k: string): unknown {
  return v[k];
}

function isStaffArray(v: unknown): v is Staff[] {
  return Array.isArray(v);
}

type StaffListShape = Staff[] | UnknownRecord;

type Extracted = {
  items: Staff[];
  total: number;
  page?: number;
  pageSize?: number;
};

function extractStaffList(data: unknown): Extracted {
  // 1) якщо бек віддає масив Staff[]
  if (isStaffArray(data)) {
    return { items: data, total: data.length };
  }

  // 2) якщо бек віддає обʼєкт
  if (isRecord(data)) {
    // можливі варіанти масиву
    const dataField = getProp(data, 'data');
    const itemsField = getProp(data, 'items');
    const listField = getProp(data, 'list');

    const items =
      (isStaffArray(dataField) && dataField) ||
      (isStaffArray(itemsField) && itemsField) ||
      (isStaffArray(listField) && listField) ||
      [];

    // можливі варіанти total
    const totalField = getProp(data, 'total');
    const totalCountField = getProp(data, 'totalCount');

    const total =
      typeof totalCountField === 'number'
        ? totalCountField
        : typeof totalField === 'number'
          ? totalField
          : items.length;

    // можливі варіанти page/pageSize (не обовʼязково)
    const pageField = getProp(data, 'page');
    const pageSizeField = getProp(data, 'pageSize');

    const page = typeof pageField === 'number' ? pageField : undefined;
    const pageSize = typeof pageSizeField === 'number' ? pageSizeField : undefined;

    return { items, total, page, pageSize };
  }

  // 3) все інше
  return { items: [], total: 0 };
}

/** ---------- переклад enum значень з бекенду ---------- */
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
  if (
    v.includes('inactive') ||
    v.includes('blocked') ||
    v.includes('fired') ||
    v.includes('disabled')
  )
    return 'inactive';
  return 'neutral';
}

function calcSum(u: Staff): number | null {
  if (u.salaryType === 'Salary')
    return typeof u.monthlySalary === 'number' ? u.monthlySalary : null;
  if (u.salaryType === 'Hourly') return typeof u.hourlyRate === 'number' ? u.hourlyRate : null;

  // перTrainingRate може бути не в Staff dto — читаємо як optional без any
  if (u.salaryType === 'PerTraining') {
    const maybe = (u as unknown as { perTrainingRate?: number | null }).perTrainingRate;
    return typeof maybe === 'number' ? maybe : null;
  }
  return null;
}

type Props = { clubId?: string };

export default function StaffTable({ clubId }: Props) {
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // pagination state (те що ти вже мав)
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [rolesOpen, setRolesOpen] = useState(false);
  const [rolesStaffId, setRolesStaffId] = useState<string | null>(null);
  const [rolesClubId, setRolesClubId] = useState<string | null>(null);

  const openRoles = (id: string, clubId: string) => {
    setRolesStaffId(id);
    setRolesClubId(clubId);
    setRolesOpen(true);
  };
  const closeRoles = () => {
    setRolesOpen(false);
    setRolesStaffId(null);
  };

  useEffect(() => {
    const id = setTimeout(() => setDebouncedSearch(search.trim()), 800);
    return () => clearTimeout(id);
  }, [search]);

  const [staffToDelete, setStaffToDelete] = useState<{ id: string; name?: string | null } | null>(
    null
  );
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  // ✅ translations (твоя вкладеність)
  const t = useTranslations('StaffTable');
  const tPos = useTranslations('StaffPosition');
  const tStatus = useTranslations('StaffStatus');
  const tEmp = useTranslations('EmploymentType');
  const tSalary = useTranslations('SalaryField');

  const askDelete = (id: string, name?: string | null) => {
    setStaffToDelete({ id, name });
    setIsConfirmOpen(true);
  };

  const staffQuery = useStaffList({ clubId, page, pageSize });
  const { data, isLoading, isFetching, isError } = staffQuery;
  const busy = isLoading || isFetching;

  // ✅ ВАЖЛИВО: extract без any і без припущень
  const extracted = useMemo(() => extractStaffList(data), [data]);
  const items = extracted.items;
  const totalCount = extracted.total;

  const totalPages = Math.max(1, Math.ceil((totalCount || 0) / pageSize));
  const from = totalCount ? (page - 1) * pageSize + 1 : 0;
  const to = Math.min(page * pageSize, totalCount || 0);

  useEffect(() => {
    setPage(1);
  }, [clubId, pageSize]);

  const filtered = useMemo(() => {
    if (!items.length) return [];

    return items.filter((u) => {
      const tone = statusTone(u.staffStatus);

      if (statusFilter === 'active' && tone !== 'active') return false;
      if (statusFilter === 'inactive' && tone !== 'inactive') return false;

      if (debouncedSearch) {
        const phoneNumber = (u as unknown as { phoneNumber?: string | null }).phoneNumber ?? '';
        const haystack =
          `${u.firstName ?? ''} ${u.lastName ?? ''} ${u.email ?? ''} ${phoneNumber ?? ''} ${u.title ?? ''}`.toLowerCase();
        if (!haystack.includes(debouncedSearch.toLowerCase())) return false;
      }

      return true;
    });
  }, [items, statusFilter, debouncedSearch]);

  const handleConfirmDelete = async () => {
    if (!staffToDelete) return;
    try {
      console.warn('useDeleteStaff ще не підключено');
    } finally {
      setIsConfirmOpen(false);
      setStaffToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setIsConfirmOpen(false);
    setStaffToDelete(null);
  };

  return (
    <div className={styles.wrapper}>
      {/* filters */}
      <div className={styles.filterBar}>
        <div className={styles.filterGroup}>
          <span className={styles.filterLabelUpper}>{t('filters.status.label')}</span>
          <select
            className={styles.filterSelect}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
          >
            <option value="all">{t('filters.status.all')}</option>
            <option value="active">{t('filters.status.active')}</option>
            <option value="inactive">{t('filters.status.inactive')}</option>
          </select>
        </div>

        <input
          className={styles.searchInput}
          type="text"
          placeholder={t('filters.search.placeholder')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* table */}
      <div className={styles.tableOuter}>
        <div className={styles.tableWrapper}>
          {busy && <SpinnerOverlay fullscreen={false} />}

          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.colFio}>{t('columns.fio')}</th>
                <th className={styles.colEmail}>{t('columns.email')}</th>
                <th className={styles.colPhone}>{t('columns.phone')}</th>
                <th className={styles.colTitle}>{t('columns.position')}</th>
                <th className={styles.colStatus}>{t('columns.status')}</th>
                {/* <th className={styles.colEmployment}>{t('columns.employment')}</th> */}
                {/* <th className={styles.colSalaryType}>{t('columns.salaryType')}</th> */}
                {/* <th className={styles.colSum}>{t('columns.sum')}</th> */}
                {/* <th className={styles.colCurrency}>{t('columns.currency')}</th> */}
                <th className={styles.colActions}>{t('columns.actions')}</th>
              </tr>
            </thead>

            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={10} className={styles.emptyState}>
                    {t('empty')}
                  </td>
                </tr>
              ) : (
                filtered.map((u) => {
                  const first = toNameCase(u.firstName);
                  const last = toNameCase(u.lastName);
                  const fio = fullName(first, last);

                  const sum = calcSum(u);
                  const tone = statusTone(u.staffStatus);

                  const phoneNumber =
                    (u as unknown as { phoneNumber?: string | null }).phoneNumber ?? null;

                  const viewHref = `/admin/${u.clubId}/staff/${u.id}`;
                  const editHref = `/admin/${u.clubId}/staff/${u.id}/EditStaff`;

                  return (
                    <tr key={u.id}>
                      <td>
                        <Link href={viewHref} className={styles.fioLink}>
                          <div className={styles.fioMain}>{fio}</div>
                          <div className={styles.fioSub}>{displayOrDefault(u.title)}</div>
                        </Link>
                      </td>

                      <td className={styles.muted}>{displayOrDefault(u.email)}</td>
                      <td className={styles.muted}>{displayOrDefault(phoneNumber)}</td>

                      {/* ✅ StaffPosition.* */}
                      <td className={styles.muted}>
                        {safeEnumT(tPos, (u.positionType ?? null) as StaffPositionType | null)}
                      </td>

                      {/* ✅ StaffStatus.* */}
                      <td>
                        <span
                          className={
                            tone === 'active'
                              ? styles.statusActive
                              : tone === 'inactive'
                                ? styles.statusInactive
                                : styles.statusNeutral
                          }
                        >
                          {safeEnumT(tStatus, u.staffStatus as StaffStatus)}
                        </span>
                      </td>

                      {/* ✅ EmploymentType.* */}
                      {/* <td className={styles.muted}>
                        {safeEnumT(tEmp, u.employmentType as StaffEmploymentType)}
                      </td> */}

                      {/* ✅ SalaryField.types.* */}
                      {/* <td className={styles.muted}>
                        {safeSalaryType(tSalary, u.salaryType as SalaryType)}
                      </td> */}

                      {/* <td className={styles.muted}>{sum == null ? DASH : String(sum)}</td> */}

                      {/* ✅ SalaryField.currency.* */}
                      {/* <td className={styles.muted}>{safeCurrency(tSalary, u.currency ?? null)}</td> */}

                      <td>
                        <div className={styles.actionsWrapper}>
                          <Tooltip content={t('actions.view')}>
                            <Link
                              href={viewHref}
                              className={styles.iconBtn}
                              title={t('actions.view')}
                              aria-label={t('actions.view')}
                            >
                              <EyeIcon className={styles.icon} aria-hidden />
                            </Link>
                          </Tooltip>

                          <Tooltip content={t('actions.edit')}>
                            <Link
                              href={editHref}
                              className={styles.iconBtn}
                              title={t('actions.edit')}
                              aria-label={t('actions.edit')}
                            >
                              <EditIcon className={styles.icon} aria-hidden />
                            </Link>
                          </Tooltip>
                          <Tooltip content="Roles">
                            <button
                              type="button"
                              className={styles.iconBtn}
                              title="Roles"
                              aria-label="Roles"
                              onClick={() => openRoles(String(u.id), String(u.clubId))}
                            >
                              <RolesIcon className={styles.icon} aria-hidden />
                            </button>
                          </Tooltip>

                          <Tooltip content={t('actions.delete')}>
                            <button
                              type="button"
                              className={styles.iconBtn}
                              title={t('actions.delete')}
                              aria-label={t('actions.delete')}
                              onClick={() => askDelete(u.id, fio)}
                            >
                              <TrashIcon className={styles.icon} aria-hidden />
                            </button>
                          </Tooltip>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>

          {/* pagination */}
          <div className={styles.pagination}>
            <div className={styles.pageSummary}>
              {t('pagination.summary', { from, to, total: totalCount })}
            </div>

            <div className={styles.pageControls}>
              <Tooltip content={t('pagination.first')}>
                <button
                  type="button"
                  className={styles.pageBtn}
                  onClick={() => setPage(1)}
                  disabled={page <= 1}
                  aria-label={t('pagination.first')}
                >
                  «
                </button>
              </Tooltip>

              <Tooltip content={t('pagination.prev')}>
                <button
                  type="button"
                  className={styles.pageBtn}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  aria-label={t('pagination.prev')}
                >
                  ←
                </button>
              </Tooltip>

              <span className={styles.pageInfo}>
                {page} / {totalPages}
              </span>

              <Tooltip content={t('pagination.next')}>
                <button
                  type="button"
                  className={styles.pageBtn}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  aria-label={t('pagination.next')}
                >
                  →
                </button>
              </Tooltip>

              <Tooltip content={t('pagination.last')}>
                <button
                  type="button"
                  className={styles.pageBtn}
                  onClick={() => setPage(totalPages)}
                  disabled={page >= totalPages}
                  aria-label={t('pagination.last')}
                >
                  »
                </button>
              </Tooltip>

              <Tooltip content={t('pagination.rows')}>
                <select
                  className={styles.pageSizeSelect}
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value) || 10)}
                  aria-label={t('pagination.rows')}
                >
                  {[10, 20, 50].map((n) => (
                    <option key={n} value={n}>
                      {t('pagination.perPage', { n })}
                    </option>
                  ))}
                </select>
              </Tooltip>
            </div>
          </div>

          {isError && <div className={styles.errorNote}>{t('error')}</div>}
        </div>
      </div>

      <ConfirmDialog
        open={isConfirmOpen}
        title={t('confirmDelete.title')}
        message={t('confirmDelete.message', {
          name: staffToDelete?.name || t('confirmDelete.noName'),
        })}
        confirmLabel={t('confirmDelete.confirm')}
        cancelLabel={t('confirmDelete.cancel')}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        isLoading={false}
      />
      <AppModal open={rolesOpen} onClose={closeRoles} title="Assign role">
        {rolesStaffId ? (
          <StaffRolesManager
            staffId={rolesStaffId}
            clubId={rolesClubId ?? null}
            onSaved={() => {
              // можна не закривати, але якщо хочеш — закрий:
              // closeRoles();
              // якщо треба оновити таблицю/дані — кажи, я підкажу invalidate query
            }}
          />
        ) : null}
      </AppModal>
    </div>
  );
}
