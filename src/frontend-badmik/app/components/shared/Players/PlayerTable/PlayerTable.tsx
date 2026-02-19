

'use client';

import { useEffect, useMemo, useState } from 'react';
import styles from './PlayersTable.module.scss';
import { Link } from '@/i18n/navigation';
import { usePlayersList } from '@/services/players/queries.client';
import type { Player } from '@/services/types/players.dto';
import SpinnerOverlay from '@/app/components/ui/SpinnerOverlay/SpinnerOverlay';
import Tooltip from '@/app/components/ui/Tooltip/Tooltip';
import EyeIcon from '@/app/assets/icons/Eye.svg';
import EditIcon from '@/app/assets/icons/Edit.svg';
import TrashIcon from '@/app/assets/icons/Trash.svg';
import { useTranslations } from 'next-intl';

type UnknownRecord = Record<string, unknown>;

const isRecord = (v: unknown): v is UnknownRecord => typeof v === 'object' && v !== null;
const isPlayerArray = (v: unknown): v is Player[] => Array.isArray(v);

function extractPlayersList(data: unknown): { items: Player[]; total: number } {
  // 1) масив
  if (isPlayerArray(data)) return { items: data, total: data.length };

  // 2) обʼєкт з items/list/data + totalCount
  if (isRecord(data)) {
    const dataField = data['data'];
    const itemsField = data['items'];
    const listField = data['list'];

    const items =
      (isPlayerArray(dataField) && dataField) ||
      (isPlayerArray(itemsField) && itemsField) ||
      (isPlayerArray(listField) && listField) ||
      [];

    const totalCount = data['totalCount'];
    const total = typeof totalCount === 'number' ? totalCount : items.length;

    return { items, total };
  }

  // 3) все інше
  return { items: [], total: 0 };
}

const display = (v: unknown) => {
  const s = String(v ?? '').trim();
  return s ? s : '—';
};

function pickUser(p: Player) {
  // ✅ якщо є user — беремо звідти, інакше з кореня
  const u = p.user ?? null;

  

  return {
    email: u?.email ?? p.email ?? null,
    fullName: u?.fullName ?? p.fullName ?? null,
    firstName: u?.firstName ?? p.firstName ?? null,
    lastName: u?.lastName ?? p.lastName ?? null,
    doB: u?.doB ?? p.doB ?? null,
    gender: (u?.gender ?? p.gender)!,
    phoneNumber: u?.phoneNumber ?? p.phoneNumber ?? null,
  };
}

function fullName(p: Player) {
  const u = pickUser(p);

  const fn = String(u.firstName ?? '').trim();
  const ln = String(u.lastName ?? '').trim();
  const fromParts = `${fn}${fn && ln ? ' ' : ''}${ln}`.trim();

  return fromParts || String(u.fullName ?? '').trim() || '—';
}

function formatDate(v: unknown) {
  const s = String(v ?? '').trim();
  if (!s) return '—';
  return s.length >= 10 ? s.slice(0, 10) : s;
}

type Props = { clubId?: string };
const COLS = 6;

export default function PlayersTable({ clubId }: Props) {
  const t = useTranslations('PlayerTable');
  const tGender = useTranslations('PlayerCard.genderType');

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    const id = window.setTimeout(() => setDebouncedSearch(search.trim()), 600);
    return () => window.clearTimeout(id);
  }, [search]);

  useEffect(() => setPage(1), [clubId, pageSize]);

  const q = usePlayersList({ clubId, page, pageSize });
  const busy = q.isLoading || q.isFetching;

  const extracted = useMemo(() => extractPlayersList(q.data), [q.data]);
  const items = extracted.items;
  const totalCount = extracted.total;

  const filtered = useMemo(() => {
    if (!items.length) return [];
    if (!debouncedSearch) return items;

    const needle = debouncedSearch.toLowerCase();
    return items.filter((p) => {
      const u = pickUser(p);
      const hay = `${fullName(p)} ${u.email ?? ''} ${u.phoneNumber ?? ''}`.toLowerCase();
      return hay.includes(needle);
    });
  }, [items, debouncedSearch]);

  const totalPages = Math.max(1, Math.ceil((totalCount || 0) / pageSize));
  const from = totalCount ? (page - 1) * pageSize + 1 : 0;
  const to = Math.min(page * pageSize, totalCount || 0);



  return (
    <div className={styles.wrapper}>
      <div className={styles.filterBar}>
        <input
          className={styles.searchInput}
          placeholder={t('filters.search.placeholder')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className={styles.tableOuter}>
        <div className={styles.tableWrapper}>
          {busy && <SpinnerOverlay fullscreen={false} />}

          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.colName}>{t('columns.name')}</th>
                <th className={styles.colEmail}>{t('columns.email')}</th>
                <th className={styles.colPhone}>{t('columns.phone')}</th>
                <th className={styles.colDob}>{t('columns.dob')}</th>
                <th className={styles.colGender}>{t('columns.gender')}</th>
                <th className={styles.colActions}>{t('columns.actions')}</th>
              </tr>
            </thead>

            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={COLS} className={styles.emptyState}>
                    {t('empty')}
                  </td>
                </tr>
              ) : (
                filtered.map((p) => {
                  const u = pickUser(p);
                  
                  const resolvedClubId = clubId ?? String(p.clubId ?? '');
                  const viewHref = `/admin/${resolvedClubId}/players/${p.id}`;
                  const editHref = `/admin/${resolvedClubId}/players/${p.id}/edit-player`;

                  return (
                    <tr key={p.id}>
                      <td>
                        <Link href={viewHref} className={styles.nameLink}>
                          <div className={styles.nameMain}>{fullName(p)}</div>
                        </Link>
                      </td>

                      <td className={styles.muted}>{display(u.email)}</td>
                      <td className={styles.muted}>{display(u.phoneNumber)}</td>
                      <td className={styles.muted}>{formatDate(u.doB)}</td>
                      <td className={styles.muted}>{tGender(u.gender)}</td>

                      <td>
                        <div className={styles.actionsWrapper}>
                          <Tooltip content={t('actions.view')}>
                            <Link className={styles.iconBtn} href={viewHref} aria-label={t('actions.view')}>
                              <EyeIcon className={styles.icon} />
                            </Link>
                          </Tooltip>

                          <Tooltip content={t('actions.edit')}>
                            <Link className={styles.iconBtn} href={editHref} aria-label={t('actions.edit')}>
                              <EditIcon className={styles.icon} />
                            </Link>
                          </Tooltip>

                          <Tooltip content={t('actions.delete')}>
                            <button
                              className={styles.iconBtn}
                              type="button"
                              aria-label={t('actions.delete')}
                              onClick={() => console.warn('TODO delete player')}
                            >
                              <TrashIcon className={styles.icon} />
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

          <div className={styles.pagination}>
            <div className={styles.pageSummary}>
              {t('pagination.summary', { from, to, total: totalCount })}
            </div>

            <div className={styles.pageControls}>
              <Tooltip content={t('pagination.first')}>
                <button className={styles.pageBtn} onClick={() => setPage(1)} disabled={page <= 1}>
                  «
                </button>
              </Tooltip>

              <Tooltip content={t('pagination.prev')}>
                <button
                  className={styles.pageBtn}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                >
                  ←
                </button>
              </Tooltip>

              <span className={styles.pageInfo}>
                {page} / {totalPages}
              </span>

              <Tooltip content={t('pagination.next')}>
                <button
                  className={styles.pageBtn}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                >
                  →
                </button>
              </Tooltip>

              <Tooltip content={t('pagination.last')}>
                <button className={styles.pageBtn} onClick={() => setPage(totalPages)} disabled={page >= totalPages}>
                  »
                </button>
              </Tooltip>

              <Tooltip content={t('pagination.rows')}>
                <select
                  className={styles.pageSizeSelect}
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value) || 10)}
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

          {q.isError && <div className={styles.errorNote}>{t('error')}</div>}
        </div>
      </div>
    </div>
  );
}

