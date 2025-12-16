// 'use client';

// import { useEffect, useMemo, useState } from 'react';
// import styles from './LocationsList.module.scss';

// import ActionHeader from '@/app/components/ui/Layout/ActionHeader/ActionHeader';
// import BackButton from '@/app/components/ui/Buttons/BackButton/BackButton';
// import AddButton from '@/app/components/ui/Buttons/AddButton/AddButton';
// import SpinnerOverlay from '@/app/components/ui/SpinnerOverlay/SpinnerOverlay';
// import ConfirmDialog from '@/app/components/ui/DeleteModal/ConfirmDialog';
// import AppBreadcrumbs from '@/app/components/ui/Breadcrumbs/AppBreadcrumbs';

// import { useLocationsList, useDeleteLocation } from '@/services/locations/queries.client';
// import type { Location } from '@/services/types/locations.dto';
// import Link from 'next/link';

// const LocationsList = () => {
//   const [status, setStatus] = useState<'all' | 'active' | 'inactive'>('all');
//   const [search, setSearch] = useState('');
//   const [debouncedSearch, setDebouncedSearch] = useState('');

//   const [locationToDelete, setLocationToDelete] = useState<{
//     id: string;
//     name?: string | null;
//   } | null>(null);
//   const [isConfirmOpen, setIsConfirmOpen] = useState(false);

//   // debounce пошуку
//   useEffect(() => {
//     const id = setTimeout(() => {
//       setDebouncedSearch(search.trim());
//     }, 500);
//     return () => clearTimeout(id);
//   }, [search]);

//   // запит списку всіх локацій (GET /api/locations)
//   const {
//     data = [],
//     isLoading,
//     isFetching,
//     refetch,
//   } = useLocationsList(undefined);

//   const deleteLocation = useDeleteLocation();

//   const locations: Location[] = data ?? [];

//   const filtered = useMemo(() => {
//     if (!locations.length) return [];

//     return locations.filter((loc) => {
//       if (status === 'active' && !loc.isActive) return false;
//       if (status === 'inactive' && loc.isActive) return false;

//       if (debouncedSearch) {
//         const haystack = `${loc.name ?? ''} ${loc.city ?? ''} ${
//           loc.address ?? ''
//         }`.toLowerCase();
//         if (!haystack.includes(debouncedSearch.toLowerCase())) return false;
//       }

//       return true;
//     });
//   }, [locations, status, debouncedSearch]);

//   const askDelete = (id: string, name?: string | null) => {
//     setLocationToDelete({ id, name });
//     setIsConfirmOpen(true);
//   };

//   const handleConfirmDelete = async () => {
//     if (!locationToDelete) return;

//     try {
//       await deleteLocation.mutateAsync(locationToDelete.id);
//     } catch (e) {
//       console.error('❌ Delete location failed:', e);
//     } finally {
//       setIsConfirmOpen(false);
//       setLocationToDelete(null);
//     }
//   };

//   const handleCancelDelete = () => {
//     if (deleteLocation.isPending) return;
//     setIsConfirmOpen(false);
//     setLocationToDelete(null);
//   };

//   const busy = isLoading || isFetching;

//   return (
//     <div className={styles.wrapper}>
//       <ActionHeader>
//         <BackButton label="buttons.back" />

//         <h2 className="text-lg font-semibold">Локації</h2>

//         <div className="flex gap-2">
//           {/* <button
//             type="button"
//             onClick={() => refetch()}
//             className={styles.refreshBtn}
//           >
//             🔄 Оновити
//           </button> */}

//           <AddButton
//             href="/admin/locations/add-location"
//             label="buttons.addLocation"
//           />
//         </div>
//       </ActionHeader>

//        <AppBreadcrumbs
//                 className="pb-4"
//                 items={[
//                   { label: 'Admin', href: '/admin/dashboard' },
//                   { label: 'Locations' },
//                 ]}
//               />

//       {/* Фільтри */}
//       <div className={styles.filtersRow}>
//         <div className={styles.leftFilters}>
//           {/* поки тільки статус; фільтр по клубу можна додати пізніше */}
//           <select
//             className={styles.select}
//             value={status}
//             onChange={(e) => setStatus(e.target.value as any)}
//           >
//             <option value="all">Усі статуси</option>
//             <option value="active">Активні</option>
//             <option value="inactive">Неактивні</option>
//           </select>
//         </div>

//         <div className={styles.rightFilters}>
//           <input
//             type="text"
//             className={styles.searchInput}
//             placeholder="Пошук за назвою або адресою..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//           />
//         </div>
//       </div>

//       {/* Список карток локацій */}
//       <div className={styles.cardsWrapper}>
//         {filtered.length === 0 ? (
//           <div className={styles.emptyState}>
//             Немає локацій для відображення.
//           </div>
//         ) : (
//           filtered.map((loc) => (
//             <article key={loc.id} className={styles.card}>
//               {/* ліва частина – "фото" */}
//               <div className={styles.photoStub}>Фото локації</div>

//               {/* центральна частина */}
//               <div className={styles.mainContent}>
//                 <div className={styles.topRow}>
//                   <div>
//                     <div className={styles.clubLabel}>
//                       {/* якщо в DTO буде clubName – можна поставити його */}
//                       Клуб #{loc.clubId?.slice(0, 8) ?? ''}
//                     </div>
//                     <h3 className={styles.locationName}>{loc.name}</h3>
//                     <p className={styles.addressLine}>
//                       {loc.city || '—'}
//                       {loc.address ? `, ${loc.address}` : ''}
//                     </p>
//                   </div>

//                   {loc.label && loc.label !== 'None' && (
//                     <span className={`${styles.badge} ${styles[`badge_${loc.label}`]}`}>
//                       {loc.label}
//                     </span>
//                   )}
//                 </div>

//                 {loc.description && (
//                   <p className={styles.description}>{loc.description}</p>
//                 )}

//                 {/* sports */}
//                 {loc.sports && loc.sports.length > 0 && (
//                   <div className={styles.chipsRow}>
//                     {loc.sports.map((s) => (
//                       <span key={s.sportType} className={styles.chipBlue}>
//                         {s.sportType} ({s.courtCount} кортів)
//                       </span>
//                     ))}
//                   </div>
//                 )}

//                 {/* amenities */}
//                 {loc.amenities && loc.amenities.length > 0 && (
//                   <div className={styles.chipsRow}>
//                     {loc.amenities.map((a) => (
//                       <span key={a} className={styles.chipGray}>
//                         {a}
//                       </span>
//                     ))}
//                   </div>
//                 )}

//                 <div className={styles.bottomRow}>
//                   <div className={styles.bottomLeft}>
//                     <span
//                       className={
//                         loc.isActive ? styles.statusActive : styles.statusInactive
//                       }
//                     >
//                       {loc.isActive ? 'Активна' : 'Неактивна'}
//                     </span>
//                     <span className={styles.orderText}>
//                       Порядок:&nbsp;<b>{loc.order ?? 1}</b>
//                     </span>
//                   </div>

//                   <div className={styles.bottomRight}>
//                     {loc.priceText && (
//                       <span className={styles.priceText}>
//                         від {loc.priceText}
//                       </span>
//                     )}

//                     <Link
//                       href={`/admin/locations/${loc.id}/edit`}
//                       className={styles.linkBtn}
//                     >
//                       Редагувати
//                     </Link>
//                     <button
//                       type="button"
//                       className={styles.linkBtnDanger}
//                       onClick={() => askDelete(loc.id, loc.name)}
//                       disabled={deleteLocation.isPending}
//                     >
//                       Видалити
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </article>
//           ))
//         )}
//       </div>

//       {busy && <SpinnerOverlay fullscreen={false} />}

//       <ConfirmDialog
//         open={isConfirmOpen}
//         title="Видалити локацію"
//         message={`Ви дійсно бажаєте видалити локацію "${
//           locationToDelete?.name || 'без назви'
//         }"? Дію не можна буде скасувати.`}
//         confirmLabel="Так, видалити"
//         cancelLabel="Ні"
//         onConfirm={handleConfirmDelete}
//         onCancel={handleCancelDelete}
//         isLoading={deleteLocation.isPending}
//       />
//     </div>
//   );
// };

// export default LocationsList;


//===========================================


// 'use client';

// import { useEffect, useMemo, useState } from 'react';
// import styles from './LocationsList.module.scss';
// import Link from 'next/link';

// import {
//   useLocationsList,
//   useDeleteLocation,
// } from '@/services/locations/queries.client';
// import { useClubsList } from '@/services/clubs/queries.client';

// import type { Location } from '@/services/types/locations.dto';
// import type { Club } from '@/services/types/clubs.dto';

// import SpinnerOverlay from '@/app/components/ui/SpinnerOverlay/SpinnerOverlay';
// import EyeIcon from '@/app/assets/icons/Eye.svg';
// import EditIcon from '@/app/assets/icons/Edit.svg';
// import TrashIcon from '@/app/assets/icons/Trash.svg';
// import ConfirmDialog from '@/app/components/ui/DeleteModal/ConfirmDialog';

// const LocationsList = () => {
//   const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');
//   const [search, setSearch] = useState('');
//   const [debouncedSearch, setDebouncedSearch] = useState('');

//   const [locationToDelete, setLocationToDelete] = useState<{
//     id: string;
//     name?: string | null;
//   } | null>(null);
//   const [isConfirmOpen, setIsConfirmOpen] = useState(false);

//   // debounce для пошуку
//   useEffect(() => {
//     const id = setTimeout(() => {
//       setDebouncedSearch(search.trim());
//     }, 800);
//     return () => clearTimeout(id);
//   }, [search]);

//   // список локацій
//   const {
//     data: locationsData = [],
//     isLoading,
//     isFetching,
//   } = useLocationsList(undefined);

//   const deleteLocation = useDeleteLocation();

//   const locations: Location[] = locationsData ?? [];

//   // підтягнемо список клубів, щоб роз resolve-ити clubId → name
//   const { data: clubsData = [] } = useClubsList(undefined, {
//     staleTime: 5 * 60 * 1000,
//     refetchOnWindowFocus: false,
//   });

//   const clubs: Club[] = clubsData ?? [];

//   const clubNameById = useMemo(() => {
//     const map: Record<string, string> = {};
//     clubs.forEach((c) => {
//       if (!c?.id) return;
//       map[c.id] = c.name || 'Клуб без назви';
//     });
//     return map;
//   }, [clubs]);

//   const filtered = useMemo(() => {
//     if (!locations.length) return [];

//     return locations.filter((loc) => {
//       if (filter === 'active' && !loc.isActive) return false;
//       if (filter === 'inactive' && loc.isActive) return false;

//       if (debouncedSearch) {
//         const haystack = `${loc.name ?? ''} ${loc.city ?? ''} ${
//           loc.address ?? ''
//         }`.toLowerCase();
//         if (!haystack.includes(debouncedSearch.toLowerCase())) return false;
//       }

//       return true;
//     });
//   }, [locations, filter, debouncedSearch]);

//   const askDelete = (id: string, name?: string | null) => {
//     setLocationToDelete({ id, name });
//     setIsConfirmOpen(true);
//   };

//   const handleConfirmDelete = async () => {
//     if (!locationToDelete) return;

//     try {
//       await deleteLocation.mutateAsync(locationToDelete.id);
//     } catch (e) {
//       console.error('❌ Delete location failed:', e);
//     } finally {
//       setIsConfirmOpen(false);
//       setLocationToDelete(null);
//     }
//   };

//   const handleCancelDelete = () => {
//     if (deleteLocation.isPending) return;
//     setIsConfirmOpen(false);
//     setLocationToDelete(null);
//   };

//   const busy = isLoading || isFetching;

//   return (


//     <div className={styles.wrapper}>
//       {/* Фільтр + пошук */}
//       <div className={styles.filterBar}>
//         <span className={styles.filterLabel}>ФІЛЬТР</span>

//         <select
//           className={styles.filterSelect}
//           value={filter}
//           onChange={(e) => setFilter(e.target.value as any)}
//         >
//           <option value="all">Усі локації</option>
//           <option value="active">Активні</option>
//           <option value="inactive">Неактивні</option>
//         </select>

//         <input
//           className={styles.searchInput}
//           type="text"
//           placeholder="Пошук за назвою або адресою..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//         />
//       </div>

//       {/* Таблиця */}
//       <div className={styles.tableOuter}>
//         <div className={styles.tableWrapper}>
//           <table className={styles.table}>
//             <thead>
//               <tr>
//                 <th className={styles.colLocation}>Локація</th>
//                 <th className={styles.colAddress}>Адреса</th>
//                 <th className={styles.colClub}>Клуб</th>
//                 <th className={styles.colSports}>Види спорту</th>
//                 <th className={styles.colStatus}>Статус</th>
//                 <th className={styles.colLabel}>Мітка</th>
//                 <th className={styles.colActions}>Дії</th>
//               </tr>
//             </thead>

//             <tbody>
//               {filtered.length === 0 ? (
//                 <tr>
//                   <td colSpan={7} className={styles.emptyState}>
//                     Немає локацій для відображення.
//                   </td>
//                 </tr>
//               ) : (
//                 filtered.map((loc) => {
//                   const sportsText =
//                     loc.sports && loc.sports.length
//                       ? loc.sports
//                           .map(
//                             (s) =>
//                               `${s.sportType}${
//                                 s.courtCount ? ` (${s.courtCount})` : ''
//                               }`,
//                           )
//                           .join(', ')
//                       : loc.sportTypes && loc.sportTypes.length
//                         ? loc.sportTypes.join(', ')
//                         : '—';

//                   const clubName =
//                     (loc.clubId && clubNameById[loc.clubId]) || '—';

//                   return (
//                     <tr key={loc.id}>
//                       {/* Локація */}
//                       <td>
//                         <div className={styles.locationName}>
//                           {loc.name || 'Без назви'}
//                         </div>
//                         {loc.priceText && (
//                           <div className={styles.locationSub}>
//                             Ціна: {loc.priceText}
//                           </div>
//                         )}
//                       </td>

//                       {/* Адреса */}
//                       <td>
//                         {loc.city || '—'}
//                         {loc.address && (
//                           <div className={styles.cellSubtitle}>
//                             {loc.address}
//                           </div>
//                         )}
//                       </td>

//                       {/* Клуб */}
//                       <td>{clubName}</td>

//                       {/* Види спорту */}
//                       <td>
//                         <div className={styles.sportsCell}>{sportsText}</div>
//                       </td>

//                       {/* Статус */}
//                       <td>
//                         <span
//                           className={
//                             loc.isActive
//                               ? styles.statusActive
//                               : styles.statusInactive
//                           }
//                         >
//                           {loc.isActive ? 'Активна' : 'Неактивна'}
//                         </span>
//                       </td>

//                       {/* Мітка */}
//                       <td>
//                         {loc.label && loc.label !== 'None' ? (
//                           <span className={styles.labelPill}>{loc.label}</span>
//                         ) : (
//                           '—'
//                         )}
//                       </td>

//                       {/* Дії */}
//                       <td>
//                         <div className={styles.actionsWrapper}>
//                           <Link
//                             href={`/admin/locations/${loc.id}`}
//                             className={styles.iconBtn}
//                             title="Переглянути"
//                             aria-label="Переглянути"
//                           >
//                             <EyeIcon className={styles.icon} aria-hidden />
//                           </Link>

//                           <Link
//                             href={`/admin/locations/${loc.id}/edit`}
//                             className={styles.iconBtn}
//                             title="Редагувати"
//                             aria-label="Редагувати"
//                           >
//                             <EditIcon className={styles.icon} aria-hidden />
//                           </Link>

//                           <button
//                             type="button"
//                             className={styles.iconBtn}
//                             title="Видалити"
//                             aria-label="Видалити"
//                             onClick={() => askDelete(loc.id, loc.name)}
//                             disabled={deleteLocation.isPending}
//                           >
//                             <TrashIcon className={styles.icon} aria-hidden />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   );
//                 })
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {busy && <SpinnerOverlay fullscreen={false} />}

//       <ConfirmDialog
//         open={isConfirmOpen}
//         title="Видалити локацію"
//         message={`Ви дійсно бажаєте видалити локацію "${
//           locationToDelete?.name || 'без назви'
//         }"? Дію не можна буде скасувати.`}
//         confirmLabel="Так, видалити"
//         cancelLabel="Ні"
//         onConfirm={handleConfirmDelete}
//         onCancel={handleCancelDelete}
//         isLoading={deleteLocation.isPending}
//       />
//     </div>
//   );
// };

// export default LocationsList;



//===========================================



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
                        <div className={styles.sportsCell}>{sportsText}</div>
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

