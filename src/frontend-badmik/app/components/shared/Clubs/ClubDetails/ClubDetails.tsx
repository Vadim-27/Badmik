

// 'use client';

// import { useState } from 'react';
// import { Club } from '@/data/clubs';
// import ActionHeader from '@/app/components/ui/Layout/ActionHeader/ActionHeader';
// import BackButton from '@/app/components/ui/Buttons/BackButton/BackButton';
// import EditButton from '@/app/components/ui/Buttons/EditButton/EditButton';
// import DeleteButton from '@/app/components/ui/Buttons/DeleteButton/DeleteButton';
// import { ConfirmDialog } from '@/app/components/ui/DeleteModal/ConfirmDialog';
// import { useTranslations } from 'next-intl';
// import AppBreadcrumbs from '@/app/components/ui/Breadcrumbs/AppBreadcrumbs';
// import css from "./ClubDetails.module.scss";

// type Props = {
//   club: Club;
// };

// export const ClubDetails = ({ club }: Props) => {
//   const [openConfirm, setOpenConfirm] = useState(false);
//   const [selectedClubId, setSelectedClubId] = useState<string | null>(null);

//   const t = useTranslations('ClubCard');

//   const handleDeleteClick = () => {
//     setSelectedClubId(club.id);
//     setOpenConfirm(true);
//   };

//   const handleConfirmDelete = () => {
//     if (selectedClubId) {
//       // API delete logic
//       console.log('Клуб видалено:', selectedClubId);
//       setOpenConfirm(false);
//     }
//   };

//   return (
//     <>
//       <ActionHeader>
//         <BackButton  label="buttons.back"/>
//         <h2 className="text-lg font-semibold">{club.name}</h2>
//         <div className="flex flex-wrap gap-2">
//           <EditButton href={`/admin/${club.id}/edit`} label="buttons.update" />
//           <DeleteButton onClick={handleDeleteClick} label="buttons.delete" />
//         </div>
//       </ActionHeader>

//       <div className={css.wrapperBreadcrumbs}>
//              <AppBreadcrumbs
//             items={[
//               { label: 'Admin', href: '/admin/dashboard' },
//               {label: 'Clubs', href: '/admin/clubs' },
//               { label: `Club ${club.name}` },
//             ]}
//           />
//           </div>

//       <div className="bg-white rounded-2xl shadow p-6 border border-gray-200">
//         <div className="flex items-center justify-between mb-4">
//           <h3 className="text-xl font-bold">{club.name}</h3>
//           <span
//             className={`text-sm px-3 py-1 rounded-full bg-${club.statusColor}-100 text-${club.statusColor}-700`}
//           >
//             {club.status}
//           </span>
//         </div>

//         <div className="text-gray-700 text-sm space-y-2">
//           <p><strong>{t('city')}:</strong> {club.city}</p>
//         <p><strong>{t('address')}:</strong> {club.address}</p>
//         <p><strong>{t('manager')}:</strong> {club.manager}</p>
//         <p><strong>{t('courts')}:</strong> {club.courts}</p>
//         </div>
//       </div>

//       <ConfirmDialog
//         open={openConfirm}
//         onClose={() => setOpenConfirm(false)}
//         onConfirm={handleConfirmDelete}
//         title={t('ConfirmDialog.title')}
//         description={t('ConfirmDialog.description')}
//       />
//     </>
//   );
// };

'use client';

import React from 'react';
import styles from './ClubDetails.module.scss';
import type { Club } from '@/services/types/clubs.dto';
import ActionHeader from '@/app/components/ui/Layout/ActionHeader/ActionHeader';
import BackButton from '@/app/components/ui/Buttons/BackButton/BackButton';
import EditButton from '@/app/components/ui/Buttons/EditButton/EditButton';
import { useTranslations } from 'next-intl';
import AppBreadcrumbs from '@/app/components/ui/Breadcrumbs/AppBreadcrumbs';

type Props = {
  club: Club;
};

const ClubDetails: React.FC<Props> = ({ club }) => {
  const {
    id,
    name,
    alias,
    city,
    address,
    email,
    phone,
    website,
    description,
    isActive,
    order,
    locationCount,
  } = club;

  // легка нормалізація website для посилання
  const websiteHref =
    website && !website.startsWith('http')
      ? `https://${website.replace(/^[\\/]+/, '')}`
      : website || '';

  return (
    <section className={styles.wrapper}>
       <ActionHeader>
        <BackButton label="buttons.back" />
        <div className="text-lg font-semibold">
          <h1 className={styles.title}>{name || 'Клуб без назви'}</h1>
          {/* {tHeader('title.addClubHeader')} */}
        </div>
        <div className="flex flex-wrap gap-2">
          {/* <SaveButton
            onClick={handleSaveClick}
            disabled={!isChanged || createClub.isPending}
            label={createClub.isPending ? 'buttons.saving' : 'buttons.save'}
          /> */}
          <EditButton href={`/admin/${id}/edit`} label="buttons.update" />
        </div>
      </ActionHeader>

      <div className={styles.wrapperBreadcrumbs}>
        <AppBreadcrumbs
          items={[
            { label: 'Admin', href: '/admin/dashboard' },
            // { label: 'Clubs', href: '/admin/clubs' },
            { label: 'Club' },
          ]}
        />
      </div>
      {/* Заголовок + статус */}
      <div className={styles.headerRow}>
        {/* <div className={styles.titleBlock}> */}
          
          {/* <p className={styles.subtitle}>
            {city || 'Місто не вказано'}
            {address ? ` • ${address}` : ''}
          </p> */}
        {/* </div> */}

        <div className={styles.statusActiveWrapper}>
          <span
            className={isActive ? styles.statusActive : styles.statusInactive}
          >
            {isActive ? 'Active' : 'Inactive'}
          </span>
          {/* <span className={styles.smallMeta}>
            Порядок:&nbsp;<span className={styles.bold}>{order ?? 1}</span>
          </span>
          <span className={styles.smallMeta}>
            Локацій:&nbsp;
            <span className={styles.bold}>{locationCount ?? 0}</span>
          </span> */}
        </div>
      </div>

      {/* Карточка з даними */}
      <div className={styles.card}>
        <div className={styles.row}>
          <div className={styles.label}>Name</div>
          <div className={styles.value}>{name || '—'}</div>
        </div>

        <div className={styles.row}>
          <div className={styles.label}>Alias</div>
          <div className={styles.value}>{alias || '—'}</div>
        </div>

        <div className={styles.row}>
          <div className={styles.label}>City</div>
          <div className={styles.value}>{city || '—'}</div>
        </div>

        <div className={styles.row}>
          <div className={styles.label}>Address</div>
          <div className={styles.value}>{address || '—'}</div>
        </div>

        <div className={styles.row}>
          <div className={styles.label}>Phone</div>
          <div className={styles.value}>
            {phone ? (
              <a href={`tel:${phone}`} className={styles.link}>
                {phone}
              </a>
            ) : (
              '—'
            )}
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.label}>Email</div>
          <div className={styles.value}>
            {email ? (
              <a href={`mailto:${email}`} className={styles.link}>
                {email}
              </a>
            ) : (
              '—'
            )}
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.label}>Website</div>
          <div className={styles.value}>
            {websiteHref ? (
              <a
                href={websiteHref}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}
              >
                {website}
              </a>
            ) : (
              '—'
            )}
          </div>
        </div>

        <div className={`${styles.row} ${styles.rowDescription}`}>
          <div className={styles.label}>Description</div>
          <div className={`${styles.value} ${styles.valueMultiline}`}>
            {description?.trim() ? description : 'Опис відсутній'}
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.label}>Locations</div>
          <div className={styles.value}>{locationCount ?? 0}</div>
        </div>
      </div>
    </section>
  );
};

export default ClubDetails;
