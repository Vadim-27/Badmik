'use client';

import { useMemo, useState, useEffect } from 'react';
import styles from './ClubList.module.scss';
import { Link } from '@/i18n/navigation';

import { useClubsList, useDeleteClub } from '@/services/clubs/queries.client';
import type { Club } from '@/services/types/clubs.dto';
import SpinnerOverlay from '@/app/components/ui/SpinnerOverlay/SpinnerOverlay';
import EyeIcon from '@/app/assets/icons/Eye.svg';
import EditIcon from '@/app/assets/icons/Edit.svg';
import TrashIcon from '@/app/assets/icons/Trash.svg';
import ConfirmDialog from '@/app/components/ui/DeleteModal/ConfirmDialog';
import Tooltip from '@/app/components/ui/Tooltip/Tooltip';
import { useTranslations } from 'next-intl';

const NewClubList = () => {
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const t = useTranslations('clubsList');

  // 🔁 дебаунс 1 секунда для пошуку
  useEffect(() => {
    const id = setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 1000);
    return () => clearTimeout(id);
  }, [search]);

  const [clubToDelete, setClubToDelete] = useState<{
    id: string;
    name?: string | null;
  } | null>(null);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  // список з бекенду
  const { data = [], isLoading, isFetching } = useClubsList(debouncedSearch || undefined);
  const deleteClub = useDeleteClub();

  const clubs: Club[] = data ?? [];

  const filtered = useMemo(() => {
    if (!clubs.length) return [];

    return clubs.filter((c) => {
      if (filter === 'active' && !c.isActive) return false;
      if (filter === 'inactive' && c.isActive) return false;

      // клієнтський фільтр по назві/місту/alias
      if (debouncedSearch) {
        const haystack = `${c.name ?? ''} ${c.city ?? ''} ${c.alias ?? ''}`.toLowerCase();
        if (!haystack.includes(debouncedSearch.toLowerCase())) return false;
      }

      return true;
    });
  }, [clubs, filter, debouncedSearch]);

  const askDelete = (id: string, name?: string | null) => {
    setClubToDelete({ id, name });
    setIsConfirmOpen(true);
  };

  //   const handleDelete = async (id: string, name?: string | null) => {
  //     const ok = window.confirm(
  //       `Видалити клуб "${name || 'без назви'}"? Дію не можна буде скасувати.`
  //     );
  //     if (!ok) return;

  //     try {
  //       await deleteClub.mutateAsync(id);
  //     } catch (e) {
  //       console.error('❌ Delete club failed:', e);
  //       // якщо хочеш, можна ще показати тост тут
  //     }
  //   };
  const handleConfirmDelete = async () => {
    if (!clubToDelete) return;

    try {
      await deleteClub.mutateAsync(clubToDelete.id);
    } catch (e) {
      console.error('❌ Delete club failed:', e);
    } finally {
      setIsConfirmOpen(false);
      setClubToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    if (deleteClub.isPending) return;
    setIsConfirmOpen(false);
    setClubToDelete(null);
  };

  const busy = isLoading || isFetching;

  return (
    <div className={styles.wrapper}>
      {/* Фільтр + пошук */}
      <div className={styles.filterBar}>
        <span className={styles.filterLabel}>{t('filterLabel')}</span>

        <select
          className={styles.filterSelect}
          value={filter}
          onChange={(e) => setFilter(e.target.value as any)}
        >
          <option value="all">{t('filters.all')}</option>
          <option value="active">{t('filters.active')}</option>
          <option value="inactive">{t('filters.inactive')}</option>
        </select>

        <input
          className={styles.searchInput}
          type="text"
          placeholder={t('searchPlaceholder')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Таблиця */}
      <div className={styles.tableOuter}>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>{t('table.club')}</th>
                <th>{t('table.city')}</th>
                <th>{t('table.alias')}</th>
                <th>{t('table.contacts')}</th>
                <th>{t('table.locations')}</th>
                <th>{t('table.order')}</th>
                <th>{t('table.status')}</th>
                <th>{t('table.actions')}</th>
              </tr>
            </thead>

            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className={styles.emptyState}>
                    {t('empty')}
                  </td>
                </tr>
              ) : (
                filtered.map((club) => (
                  <tr key={club.id}>
                    <td>
                      <div className={styles.clubName}>{club.name}</div>
                    </td>
                    <td>
                      {club.city || '—'}
                      {club.address && <div className={styles.clubSubtitle}>{club.address}</div>}
                    </td>
                    <td>{club.alias || '—'}</td>
                    <td>
                      {club.email && <div>{club.email}</div>}
                      {club.phone && <div>{club.phone}</div>}
                      {!club.email && !club.phone && '—'}
                    </td>
                    <td>{club.locationCount ?? 0}</td>
                    <td>{club.order}</td>
                    <td>
                      <span className={club.isActive ? styles.statusActive : styles.statusInactive}>
                        {club.isActive ? t('status.active') : t('status.inactive')}
                      </span>
                    </td>
                    <td>
                      <div className={styles.actionsWrapper}>
                        <Tooltip content={t('tooltips.viewClub')}>
                          <Link
                            href={`/admin/${club.id}`}
                            className={styles.iconBtn}
                            title={t('actionsAria.view')}
                            aria-label={t('actionsAria.view')}
                          >
                            <EyeIcon className={styles.icon} aria-hidden />
                          </Link>
                        </Tooltip>

                        <Tooltip content={t('tooltips.editClub')}>
                          <Link
                            href={`/admin/${club.id}/edit`}
                            className={styles.iconBtn}
                            title={t('actionsAria.edit')}
                            aria-label={t('actionsAria.edit')}
                          >
                            <EditIcon className={styles.icon} aria-hidden />
                          </Link>
                        </Tooltip>

                        <Tooltip content={t('tooltips.deleteClub')}>
                          <button
                            type="button"
                            className={styles.iconBtn}
                            title={t('actionsAria.delete')}
                            aria-label={t('actionsAria.delete')}
                            onClick={() => askDelete(club.id, club.name)}
                            disabled={deleteClub.isPending}
                          >
                            <TrashIcon className={styles.icon} aria-hidden />
                          </button>
                        </Tooltip>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {busy && <SpinnerOverlay fullscreen={false} />}
      <ConfirmDialog
        open={isConfirmOpen}
        title={t('confirm.title')}
        message={t('confirm.message', { name: clubToDelete?.name || t('confirm.fallbackName') })}
        confirmLabel={t('confirm.confirmLabel')}
        cancelLabel={t('confirm.cancelLabel')}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        isLoading={deleteClub.isPending}
      />
    </div>
  );
};

export default NewClubList;
