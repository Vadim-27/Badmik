'use client';

import { useEffect, useMemo, useState } from 'react';
import styles from './StaffTable.module.scss';
import Link from 'next/link';

import { useStaffList } from '@/services/staff/queries.client';
import type { Staff } from '@/services/types/staff.dto';

import SpinnerOverlay from '@/app/components/ui/SpinnerOverlay/SpinnerOverlay';
import ConfirmDialog from '@/app/components/ui/DeleteModal/ConfirmDialog';

import EyeIcon from '@/app/assets/icons/Eye.svg';
import EditIcon from '@/app/assets/icons/Edit.svg';
import TrashIcon from '@/app/assets/icons/Trash.svg';
import Tooltip from '@/app/components/ui/Tooltip/Tooltip';

const EMPTY_LABEL = 'дані ще не заповнені';

const displayOrDefault = (v: unknown) => {
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

type StaffFromApi = Staff & Partial<Record<string, unknown>>;

function calcSum(u: StaffFromApi): number | null {
  const salaryType = String((u as any).salaryType ?? '');
  const monthlySalary = (u as any).monthlySalary;
  const hourlyRate = (u as any).hourlyRate;
  const perTrainingRate = (u as any).perTrainingRate;

  if (salaryType === 'Salary') return typeof monthlySalary === 'number' ? monthlySalary : null;
  if (salaryType === 'Hourly') return typeof hourlyRate === 'number' ? hourlyRate : null;
  if (salaryType === 'PerTraining') return typeof perTrainingRate === 'number' ? perTrainingRate : null;
  return null;
}

function statusTone(st: unknown) {
  const v = String(st ?? '').toLowerCase();
  if (v.includes('active') || v.includes('working') || v.includes('employed')) return 'active';
  if (v.includes('inactive') || v.includes('blocked') || v.includes('fired')) return 'inactive';
  return 'neutral';
}

type Props = {
  clubId?: string;
};

export default function StaffTable({ clubId }: Props) {
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // pagination (1-based як на бекові)
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    const id = setTimeout(() => setDebouncedSearch(search.trim()), 800);
    return () => clearTimeout(id);
  }, [search]);

  // delete modal
  const [staffToDelete, setStaffToDelete] = useState<{ id: string; name?: string | null } | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const askDelete = (id: string, name?: string | null) => {
    setStaffToDelete({ id, name });
    setIsConfirmOpen(true);
  };

  // ✅ запит: завжди однаково передаємо {clubId,page,pageSize}
  const staffQuery = useStaffList({ clubId, page, pageSize });
  const { data, isLoading, isFetching, isError } = staffQuery;
  const busy = isLoading || isFetching;

  // items (підтримуємо items/list/масив на випадок різних форматів)
  const items: StaffFromApi[] = useMemo(() => {
    const d: any = data;
    if (!d) return [];
    if (Array.isArray(d)) return d;
    if (Array.isArray(d.items)) return d.items;
    if (Array.isArray(d.list)) return d.list;
    return [];
  }, [data]);

  // meta (totalCount/page/pageSize)
  const meta = useMemo(() => {
    const d: any = data;
    const totalCount = Number(d?.totalCount ?? d?.total ?? items.length ?? 0);
    const serverPage = Number(d?.page ?? page);
    const serverPageSize = Number(d?.pageSize ?? pageSize);

    return { totalCount, page: serverPage, pageSize: serverPageSize };
  }, [data, items.length, page, pageSize]);

  const totalPages = Math.max(1, Math.ceil((meta.totalCount || 0) / pageSize));
  const from = meta.totalCount ? (page - 1) * pageSize + 1 : 0;
  const to = Math.min(page * pageSize, meta.totalCount || 0);

  // фільтри (фільтруємо тільки поточну сторінку, бо пагінація бекова)
  const filtered = useMemo(() => {
    if (!items.length) return [];

    return items.filter((u: any) => {
      const tone = statusTone(u.staffStatus);

      if (statusFilter === 'active' && tone !== 'active') return false;
      if (statusFilter === 'inactive' && tone !== 'inactive') return false;

      if (debouncedSearch) {
        const haystack = `${u.firstName ?? ''} ${u.lastName ?? ''} ${u.email ?? ''} ${u.phoneNumber ?? ''} ${u.title ?? ''}`.toLowerCase();
        if (!haystack.includes(debouncedSearch.toLowerCase())) return false;
      }

      return true;
    });
  }, [items, statusFilter, debouncedSearch]);

  // якщо змінив pageSize або clubId — логічно скинути на 1
  useEffect(() => {
    setPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clubId, pageSize]);

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
          <span className={styles.filterLabelUpper}>СТАТУС</span>
          <select
            className={styles.filterSelect}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
          >
            <option value="all">Усі</option>
            <option value="active">Активні</option>
            <option value="inactive">Неактивні</option>
          </select>
        </div>

        <input
          className={styles.searchInput}
          type="text"
          placeholder="Пошук за ПІБ / email / телефоном..."
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
                <th className={styles.colFio}>ФІО</th>
                <th className={styles.colEmail}>Email</th>
                <th className={styles.colPhone}>Телефон</th>
                <th className={styles.colTitle}>Посада</th>
                <th className={styles.colStatus}>Статус</th>
                <th className={styles.colEmployment}>Оформлення</th>
                <th className={styles.colSalaryType}>Вид оплати</th>
                <th className={styles.colSum}>Сума</th>
                <th className={styles.colCurrency}>Валюта</th>
                <th className={styles.colActions}>Дії</th>
              </tr>
            </thead>

            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={10} className={styles.emptyState}>
                    Немає співробітників для відображення.
                  </td>
                </tr>
              ) : (
                filtered.map((u: any) => {
                  const first = toNameCase(u.firstName);
                  const last = toNameCase(u.lastName);
                  const fio = fullName(first, last);

                  const sum = calcSum(u);
                  const tone = statusTone(u.staffStatus);

                  const viewHref = `/admin/${u.clubId}/staff/${u.id}`;
                  const editHref = `/admin/${u.clubId}/staff/${u.id}/EditStaff`;

                  return (
                    <tr key={String(u.id)}>
                      <td>
                        <Link href={viewHref} className={styles.fioLink}>
                          <div className={styles.fioMain}>{fio}</div>
                          <div className={styles.fioSub}>{displayOrDefault(u.title)}</div>
                        </Link>
                      </td>

                      <td className={styles.muted}>{displayOrDefault(u.email)}</td>
                      <td className={styles.muted}>{displayOrDefault(u.phoneNumber)}</td>
                      <td className={styles.muted}>{displayOrDefault(u.title)}</td>

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
                          {displayOrDefault(u.staffStatus)}
                        </span>
                      </td>

                      <td className={styles.muted}>{displayOrDefault((u as any).employmentType)}</td>
                      <td className={styles.muted}>{displayOrDefault((u as any).salaryType)}</td>
                      <td className={styles.muted}>{sum == null ? '—' : String(sum)}</td>
                      <td className={styles.muted}>{displayOrDefault((u as any).currency)}</td>

                      <td>
                        <div className={styles.actionsWrapper}>
                          <Tooltip content="Переглянути">
                          <Link href={viewHref} className={styles.iconBtn} title="Переглянути" aria-label="Переглянути">
                            <EyeIcon className={styles.icon} aria-hidden />
                          </Link>
                          </Tooltip>

                          <Tooltip content="Редагувати">
                          <Link href={editHref} className={styles.iconBtn} title="Редагувати" aria-label="Редагувати">
                            <EditIcon className={styles.icon} aria-hidden />
                          </Link>
                          </Tooltip>

                         <Tooltip content="Видалити">
                          <button
                            type="button"
                            className={styles.iconBtn}
                            title="Видалити"
                            aria-label="Видалити"
                            onClick={() => askDelete(String(u.id), fio)}
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
              {from}-{to} з {meta.totalCount}
            </div>

            <div className={styles.pageControls}>
              <Tooltip content="Перша сторінка">
              <button
                type="button"
                className={styles.pageBtn}
                onClick={() => setPage(1)}
                disabled={page <= 1}
                aria-label="Перша сторінка"
              >
                «
              </button>
              </Tooltip>
 
              <Tooltip content="Попередня сторінка">
              <button
                type="button"
                className={styles.pageBtn}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                aria-label="Попередня сторінка"
              >
                ←
              </button>
              </Tooltip>

              <span className={styles.pageInfo}>
                {page} / {totalPages}
              </span>

              <Tooltip content="Наступна сторінка">
              <button
                type="button"
                className={styles.pageBtn}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                aria-label="Наступна сторінка"
              >
                →
              </button>
              </Tooltip>

              <Tooltip content="Остання сторінка">
              <button
                type="button"
                className={styles.pageBtn}
                onClick={() => setPage(totalPages)}
                disabled={page >= totalPages}
                aria-label="Остання сторінка"
              >
                »
              </button>
              </Tooltip>

              <Tooltip content="Кількість рядків">
              <select
                className={styles.pageSizeSelect}
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value) || 10)}
                aria-label="Кількість рядків"
              >
                {[10, 20, 50].map((n) => (
                  <option key={n} value={n}>
                    {n} / стор.
                  </option>
                ))}
              </select>
              </Tooltip>
            </div>
          </div>

          {isError && <div className={styles.errorNote}>Помилка завантаження співробітників</div>}
        </div>
      </div>

      <ConfirmDialog
        open={isConfirmOpen}
        title="Видалити співробітника"
        message={`Ви дійсно бажаєте видалити "${staffToDelete?.name || 'без імені'}"? Дію не можна буде скасувати.`}
        confirmLabel="Так, видалити"
        cancelLabel="Ні"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        isLoading={false}
      />
    </div>
  );
}


//==========================================
