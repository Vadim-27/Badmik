'use client';

import { useMemo, useState, useEffect } from 'react';
import styles from './ClubList.module.scss';
import {Link} from '@/i18n/navigation';

import { useClubsList, useDeleteClub } from '@/services/clubs/queries.client';
import type { Club } from '@/services/types/clubs.dto';
import SpinnerOverlay from '@/app/components/ui/SpinnerOverlay/SpinnerOverlay';
import EyeIcon from '@/app/assets/icons/Eye.svg';
import EditIcon from '@/app/assets/icons/Edit.svg';
import TrashIcon from '@/app/assets/icons/Trash.svg';
import ConfirmDialog from '@/app/components/ui/DeleteModal/ConfirmDialog';
import Tooltip from '@/app/components/ui/Tooltip/Tooltip';

const NewClubList = () => {
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

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
        <span className={styles.filterLabel}>ФІЛЬТР</span>

        <select
          className={styles.filterSelect}
          value={filter}
          onChange={(e) => setFilter(e.target.value as any)}
        >
          <option value="all">Усі клуби</option>
          <option value="active">Активні</option>
          <option value="inactive">Неактивні</option>
        </select>

        <input
          className={styles.searchInput}
          type="text"
          placeholder="Пошук за назвою або містом..."
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
                <th>Клуб</th>
                <th>Місто</th>
                <th>Alias</th>
                <th>Контакти</th>
                <th>Локації</th>
                <th>Порядок</th>
                <th>Статус</th>
                <th>Дії</th>
              </tr>
            </thead>

            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className={styles.emptyState}>
                    Немає клубів для відображення.
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
                        {club.isActive ? 'Активний' : 'Неактивний'}
                      </span>
                    </td>
                    <td>
                      <div className={styles.actionsWrapper}>
                        <Tooltip content="Переглянути клуб">
                        <Link
                          href={`/admin/${club.id}`}
                          className={styles.iconBtn}
                          title="Переглянути"
                          aria-label="Переглянути"
                        >
                          <EyeIcon className={styles.icon} aria-hidden />
                        </Link>
                        </Tooltip>

                        <Tooltip content="Редагувати клуб">
                        <Link
                          href={`/admin/${club.id}/edit`}
                          className={styles.iconBtn}
                          title="Редагувати"
                          aria-label="Редагувати"
                        >
                          <EditIcon className={styles.icon} aria-hidden />
                        </Link>
                        </Tooltip>

                        <Tooltip content="Видалити клуб">
                        <button
                          type="button"
                          className={styles.iconBtn}
                          title="Видалити"
                          aria-label="Видалити"
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
        title="Видалити клуб"
        message={`Ви дійсно бажаєте видалити клуб "${
          clubToDelete?.name || 'без назви'
        }"? Дію не можна буде скасувати.`}
        confirmLabel="Так, видалити"
        cancelLabel="Ні"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        isLoading={deleteClub.isPending}
      />
    </div>
  );
};

export default NewClubList;

//========================================================

// 'use client';

// import { useMemo, useState, useEffect } from 'react';
// import styles from './ClubList.module.scss';

// import { useClubsList } from '@/services/clubs/queries.client';
// import type { Club } from '@/services/types/clubs.dto';
// import SpinnerOverlay from '@/app/components/ui/SpinnerOverlay/SpinnerOverlay';

// // export type ClubListItem = {
// //   id: string;
// //   name: string;
// //   city: string | null;
// //   alias: string | null;
// //   contactEmail: string | null;
// //   contactPhone: string | null;
// //   locationsCount: number;
// //   order: number;
// //   isActive: boolean;
// //   subtitle?: string | null;
// // };

// type Props = {
// //   clubs?: ClubListItem[];   // МОЖЕ бути undefined
//   busy?: boolean;
// };

// const NewClubList = () => {
//  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');
//   const [search, setSearch] = useState('');
//   const [debouncedSearch, setDebouncedSearch] = useState('');

//   // 🔁 дебаунс 1 секунда для запиту на бек
//   useEffect(() => {
//     const id = setTimeout(() => {
//       setDebouncedSearch(search.trim());
//     }, 1000);
//     return () => clearTimeout(id);
//   }, [search]);

//   // список клубів з бекенду, filter -> query ?filter=
//   const { data = [], isLoading, isFetching } = useClubsList(
//     debouncedSearch || undefined,
//   );

//   const clubs: Club[] = data ?? [];
//   console.log("clubs", clubs)

//   const filtered = useMemo(() => {
//     if (!clubs.length) return [];

//     return clubs.filter((c) => {
//       if (filter === 'active' && !c.isActive) return false;
//       if (filter === 'inactive' && c.isActive) return false;
//       return true;
//     });
//   }, [clubs, filter]);
//   console.log("filtered", filtered)

//   const busy = isLoading || isFetching;

//   return (
//   <div className={styles.wrapper}>
//     {/* ... фільтри / пошук ... */}

//       <div className={styles.filterBar}>
//   <span className={styles.filterLabel}>ФІЛЬТР</span>

//   <select
//     className={styles.filterSelect}
//     value={filter}
//     onChange={(e) => setFilter(e.target.value as any)}
//   >
//     <option value="all">Усі клуби</option>
//     <option value="active">Активні</option>
//     <option value="inactive">Неактивні</option>
//   </select>

//   <input
//     className={styles.searchInput}
//     type="text"
//     placeholder="Пошук за назвою або містом..."
//     value={search}
//     onChange={(e) => setSearch(e.target.value)}
//   />
// </div>
//     {/* ТАБЛИЦЯ*/}

//     <div className={styles.tableOuter}>
//       <div className={styles.tableWrapper}>
//         <table className={styles.table}>
//           <thead>
//             <tr>
//               <th>Клуб</th>
//               <th>Місто</th>
//               <th>Alias</th>
//               <th>Контакти</th>
//               <th>Локації</th>
//               <th>Порядок</th>
//               <th>Статус</th>
//               <th>Дії</th>
//             </tr>
//           </thead>

//           <tbody>
//             {filtered.length === 0 ? (
//               <tr>
//                 {/* постав тут стільки колонок, скільки у тебе реально в <thead> */}
//                 <td colSpan={8} className={styles.emptyState}>
//                   Немає клубів для відображення.
//                 </td>
//               </tr>
//             ) : (
//               filtered.map((club) => (
//   <tr key={club.id}>
//     <td>
//       <div className={styles.clubName}>{club.name}</div>
//       {club.subtitle && (
//         <div className={styles.clubSubtitle}>{club.subtitle}</div>
//       )}
//     </td>
//     <td>{club.city || '—'}</td>
//     <td>{club.alias || '—'}</td>
//     <td>
//       {club.contactEmail && <div>{club.contactEmail}</div>}
//       {club.contactPhone && <div>{club.contactPhone}</div>}
//       {!club.contactEmail && !club.contactPhone && '—'}
//     </td>
//                   <td>{club.locationsCount}</td>
//                   <td>{club.order}</td>
//                   <td>
//                     <span
//                       className={
//                         club.isActive
//                           ? styles.statusActive
//                           : styles.statusInactive
//                       }
//                     >
//                       {club.isActive ? 'Активний' : 'Неактивний'}
//                     </span>
//                   </td>
//                   <td>
//                     <button
//                       type="button"
//                       className={styles.linkButton}
//                       // onClick={...}
//                     >
//                       Редагувати
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>

//     {/* {busy && (
//       <div className={styles.busyOverlay}>
//         <div className={styles.busySpinner} />
//       </div>
//     )} */}
//     {busy && <SpinnerOverlay fullscreen />}
//   </div>
// );
// };

// export default NewClubList;
