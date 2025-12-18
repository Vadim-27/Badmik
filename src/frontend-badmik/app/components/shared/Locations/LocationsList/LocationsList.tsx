
'use client';

import { useEffect, useMemo, useState } from 'react';
import styles from './LocationsList.module.scss';
import Link from 'next/link';

import {
  useLocationsList,
  useDeleteLocation,
} from '@/services/locations/queries.client';
import { useClubsList } from '@/services/clubs/queries.client';

import type { Location } from '@/services/types/locations.dto';
import type { Club } from '@/services/types/clubs.dto';

import SpinnerOverlay from '@/app/components/ui/SpinnerOverlay/SpinnerOverlay';
import EyeIcon from '@/app/assets/icons/Eye.svg';
import EditIcon from '@/app/assets/icons/Edit.svg';
import TrashIcon from '@/app/assets/icons/Trash.svg';
import ConfirmDialog from '@/app/components/ui/DeleteModal/ConfirmDialog';
import SportsBadges from '@/app/components/ui/SportsBadges/SportsBadges';

const LocationsList = () => {
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [clubFilter, setClubFilter] = useState<string>('all'); 

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const [locationToDelete, setLocationToDelete] = useState<{
    id: string;
    name?: string | null;
  } | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  
  useEffect(() => {
    const id = setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 800);
    return () => clearTimeout(id);
  }, [search]);


  const {
    data: locationsData = [],
    isLoading,
    isFetching,
  } = useLocationsList(clubFilter === 'all' ? undefined : clubFilter);

  const deleteLocation = useDeleteLocation();
  const locations: Location[] = locationsData ?? [];

 
  const { data: clubsData = [] } = useClubsList(undefined, {
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
  const clubs: Club[] = clubsData ?? [];

  const clubNameById = useMemo(() => {
    const map: Record<string, string> = {};
    clubs.forEach((c) => {
      if (!c?.id) return;
      map[c.id] = c.name || 'Клуб без назви';
    });
    return map;
  }, [clubs]);

  const filtered = useMemo(() => {
    if (!locations.length) return [];

    return locations.filter((loc) => {
      // статус
      if (statusFilter === 'active' && !loc.isActive) return false;
      if (statusFilter === 'inactive' && loc.isActive) return false;

      // пошук
      if (debouncedSearch) {
        const haystack = `${loc.name ?? ''} ${loc.city ?? ''} ${
          loc.address ?? ''
        }`.toLowerCase();
        if (!haystack.includes(debouncedSearch.toLowerCase())) return false;
      }

      return true;
    });
  }, [locations, statusFilter, debouncedSearch]);

  const askDelete = (id: string, name?: string | null) => {
    setLocationToDelete({ id, name });
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!locationToDelete) return;

    try {
      await deleteLocation.mutateAsync(locationToDelete.id);
    } catch (e) {
      console.error('❌ Delete location failed:', e);
    } finally {
      setIsConfirmOpen(false);
      setLocationToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    if (deleteLocation.isPending) return;
    setIsConfirmOpen(false);
    setLocationToDelete(null);
  };

  const busy = isLoading || isFetching;

  return (
    <div className={styles.wrapper}>
      {/* Фільтри: Клуб + Статус + Пошук */}
      <div className={styles.filterBar}>
        <div className={styles.filterGroup}>
          <span className={styles.filterLabelUpper}>КЛУБ</span>
          <select
            className={styles.filterSelect}
            value={clubFilter}
            onChange={(e) => setClubFilter(e.target.value)}
          >
            <option value="all">Усі клуби</option>
            {clubs.map((club) => (
              <option key={club.id} value={club.id}>
                {club.name || 'Клуб без назви'}
              </option>
            ))}
          </select>
        </div>

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
          placeholder="Пошук за назвою або адресою..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Таблиця */}
      <div className={styles.tableOuter}>
        <div className={styles.tableWrapper}>
            {busy && <SpinnerOverlay fullscreen={false} />}
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.colLocation}>Локація</th>
                <th className={styles.colAddress}>Адреса</th>
                <th className={styles.colClub}>Клуб</th>
                <th className={styles.colSports}>Види спорту</th>
                <th className={styles.colStatus}>Статус</th>
                <th className={styles.colLabel}>Мітка</th>
                <th className={styles.colActions}>Дії</th>
              </tr>
            </thead>

            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className={styles.emptyState}>
                    Немає локацій для відображення.
                  </td>
                </tr>
              ) : (
                filtered.map((loc) => {
                  const sportsText =
                    loc.sports && loc.sports.length
                      ? loc.sports
                          .map(
                            (s) =>
                              `${s.sportType}${
                                s.courtCount ? ` (${s.courtCount})` : ''
                              }`,
                          )
                          .join(', ')
                      : loc.sportTypes && loc.sportTypes.length
                        ? loc.sportTypes.join(', ')
                        : '—';

                  const clubName =
                    (loc.clubId && clubNameById[loc.clubId]) || '—';

                  return (
                    <tr key={loc.id}>
                      {/* Локація */}
                      <td>
                        <div className={styles.locationName}>
                          {loc.name || 'Без назви'}
                        </div>
                        {loc.priceText && (
                          <div className={styles.locationSub}>
                            Ціна: {loc.priceText}
                          </div>
                        )}
                      </td>

                      {/* Адреса */}
                      <td>
                        {loc.city || '—'}
                        {loc.address && (
                          <div className={styles.cellSubtitle}>
                            {loc.address}
                          </div>
                        )}
                      </td>

                      {/* Клуб */}
                      <td>{clubName}</td>

                      {/* Види спорту */}
                      <td>
                        <div className={styles.sportsCell}>
                          <SportsBadges sports={loc.sports} sportTypes={loc.sportTypes} />
                          </div>
                      </td>

                      {/* Статус */}
                      <td>
                        <span
                          className={
                            loc.isActive
                              ? styles.statusActive
                              : styles.statusInactive
                          }
                        >
                          {loc.isActive ? 'Активна' : 'Неактивна'}
                        </span>
                      </td>

                      {/* Мітка */}
                      <td>
                        {loc.label && loc.label !== 'None' ? (
                          <span className={styles.labelPill}>{loc.label}</span>
                        ) : (
                          '—'
                        )}
                      </td>

                      {/* Дії */}
                      <td>
                        <div className={styles.actionsWrapper}>
                          <Link
                            href={`/admin/${loc.clubId}/locations/${loc.id}`}
                            className={styles.iconBtn}
                            title="Переглянути"
                            aria-label="Переглянути"
                          >
                            <EyeIcon className={styles.icon} aria-hidden />
                          </Link>

                          <Link
                            href={`/admin/${loc.clubId}/locations/${loc.id}/edit-location`}
                            className={styles.iconBtn}
                            title="Редагувати"
                            aria-label="Редагувати"
                          >
                            <EditIcon className={styles.icon} aria-hidden />
                          </Link>

                          <button
                            type="button"
                            className={styles.iconBtn}
                            title="Видалити"
                            aria-label="Видалити"
                            onClick={() => askDelete(loc.id, loc.name)}
                            disabled={deleteLocation.isPending}
                          >
                            <TrashIcon className={styles.icon} aria-hidden />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      

      <ConfirmDialog
        open={isConfirmOpen}
        title="Видалити локацію"
        message={`Ви дійсно бажаєте видалити локацію "${
          locationToDelete?.name || 'без назви'
        }"? Дію не можна буде скасувати.`}
        confirmLabel="Так, видалити"
        cancelLabel="Ні"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        isLoading={deleteLocation.isPending}
      />
    </div>
  );
};

export default LocationsList;

