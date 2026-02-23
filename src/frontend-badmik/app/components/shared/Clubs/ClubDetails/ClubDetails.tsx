

// 'use client';

// import React from 'react';
// import styles from './ClubDetails.module.scss';
// import type { Club } from '@/services/types/clubs.dto';
// import ActionHeader from '@/app/components/ui/Layout/ActionHeader/ActionHeader';
// import BackButton from '@/app/components/ui/Buttons/BackButton/BackButton';
// import EditButton from '@/app/components/ui/Buttons/EditButton/EditButton';
// import { useTranslations } from 'next-intl';
// import AppBreadcrumbs from '@/app/components/ui/Breadcrumbs/AppBreadcrumbs';

// type Props = {
//   club: Club;
// };

// const ClubDetails: React.FC<Props> = ({ club }) => {
//   const {
//     id,
//     name,
//     alias,
//     city,
//     address,
//     email,
//     phone,
//     website,
//     description,
//     isActive,
//     order,
//     locationCount,
//   } = club;

//   // легка нормалізація website для посилання
//   const websiteHref =
//     website && !website.startsWith('http')
//       ? `https://${website.replace(/^[\\/]+/, '')}`
//       : website || '';

//   return (
//     <section className={styles.wrapper}>
//        <ActionHeader>
//         <BackButton label="buttons.back" />
//         <div className="text-lg font-semibold">
//           <h1 className={styles.title}>{name || 'Клуб без назви'}</h1>
//           {/* {tHeader('title.addClubHeader')} */}
//         </div>
//         <div className="flex flex-wrap gap-2">
//           {/* <SaveButton
//             onClick={handleSaveClick}
//             disabled={!isChanged || createClub.isPending}
//             label={createClub.isPending ? 'buttons.saving' : 'buttons.save'}
//           /> */}
//           <EditButton href={`/admin/${id}/edit`} label="buttons.update" />
//         </div>
//       </ActionHeader>

//       <div className={styles.wrapperBreadcrumbs}>
//         <AppBreadcrumbs
//           items={[
//             { label: 'Admin', href: '/admin/dashboard' },
//             // { label: 'Clubs', href: '/admin/clubs' },
//             { label: 'Club' },
//           ]}
//         />
//       </div>
//       {/* Заголовок + статус */}
//       <div className={styles.headerRow}>
//         {/* <div className={styles.titleBlock}> */}
          
//           {/* <p className={styles.subtitle}>
//             {city || 'Місто не вказано'}
//             {address ? ` • ${address}` : ''}
//           </p> */}
//         {/* </div> */}

//         <div className={styles.statusActiveWrapper}>
//           <span
//             className={isActive ? styles.statusActive : styles.statusInactive}
//           >
//             {isActive ? 'Active' : 'Inactive'}
//           </span>
//           {/* <span className={styles.smallMeta}>
//             Порядок:&nbsp;<span className={styles.bold}>{order ?? 1}</span>
//           </span>
//           <span className={styles.smallMeta}>
//             Локацій:&nbsp;
//             <span className={styles.bold}>{locationCount ?? 0}</span>
//           </span> */}
//         </div>
//       </div>

//       {/* Карточка з даними */}
//       <div className={styles.card}>
//         <div className={styles.row}>
//           <div className={styles.label}>Name</div>
//           <div className={styles.value}>{name || '—'}</div>
//         </div>

//         <div className={styles.row}>
//           <div className={styles.label}>Alias</div>
//           <div className={styles.value}>{alias || '—'}</div>
//         </div>

//         <div className={styles.row}>
//           <div className={styles.label}>City</div>
//           <div className={styles.value}>{city || '—'}</div>
//         </div>

//         <div className={styles.row}>
//           <div className={styles.label}>Address</div>
//           <div className={styles.value}>{address || '—'}</div>
//         </div>

//         <div className={styles.row}>
//           <div className={styles.label}>Phone</div>
//           <div className={styles.value}>
//             {phone ? (
//               <a href={`tel:${phone}`} className={styles.link}>
//                 {phone}
//               </a>
//             ) : (
//               '—'
//             )}
//           </div>
//         </div>

//         <div className={styles.row}>
//           <div className={styles.label}>Email</div>
//           <div className={styles.value}>
//             {email ? (
//               <a href={`mailto:${email}`} className={styles.link}>
//                 {email}
//               </a>
//             ) : (
//               '—'
//             )}
//           </div>
//         </div>

//         <div className={styles.row}>
//           <div className={styles.label}>Website</div>
//           <div className={styles.value}>
//             {websiteHref ? (
//               <a
//                 href={websiteHref}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className={styles.link}
//               >
//                 {website}
//               </a>
//             ) : (
//               '—'
//             )}
//           </div>
//         </div>

//         <div className={`${styles.row} ${styles.rowDescription}`}>
//           <div className={styles.label}>Description</div>
//           <div className={`${styles.value} ${styles.valueMultiline}`}>
//             {description?.trim() ? description : 'Опис відсутній'}
//           </div>
//         </div>

//         <div className={styles.row}>
//           <div className={styles.label}>Locations</div>
//           <div className={styles.value}>{locationCount ?? 0}</div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default ClubDetails;


'use client';

import React from 'react';
import styles from './ClubDetails.module.scss';
import type { Club } from '@/services/types/clubs.dto';
import ActionHeader from '@/app/components/ui/Layout/ActionHeader/ActionHeader';
import BackButton from '@/app/components/ui/Buttons/BackButton/BackButton';
import EditButton from '@/app/components/ui/Buttons/EditButton/EditButton';
import { useTranslations } from 'next-intl';
import AppBreadcrumbs from '@/app/components/ui/Breadcrumbs/AppBreadcrumbs';

type Props = { club: Club };

const ClubDetails: React.FC<Props> = ({ club }) => {
  const t = useTranslations('clubDetails');
  const tB = useTranslations('clubsBreadcrumbs');

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
    locationCount,
  } = club;

  const dash = t('fallback.dash');

  const websiteHref =
    website && !website.startsWith('http')
      ? `https://${website.replace(/^[\\/]+/, '')}`
      : website || '';

  return (
    <section className={styles.wrapper}>
      <ActionHeader>
        <BackButton label="buttons.back" />
        <div className="text-lg font-semibold">
          <h1 className={styles.title}>{name || t('titleFallback')}</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <EditButton href={`/admin/${id}/edit`} label="buttons.update" />
        </div>
      </ActionHeader>

      <div className={styles.wrapperBreadcrumbs}>
        <AppBreadcrumbs
          items={[
            { label: tB('Admin'), href: '/admin/dashboard' },
            { label: tB('Clubs'), href: '/admin/clubs' },
            { label: name || t('titleFallback') },
          ]}
        />
      </div>

      <div className={styles.headerRow}>
        <div className={styles.statusActiveWrapper}>
          <span className={isActive ? styles.statusActive : styles.statusInactive}>
            {isActive ? t('status.active') : t('status.inactive')}
          </span>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.row}>
          <div className={styles.label}>{t('labels.name')}</div>
          <div className={styles.value}>{name || dash}</div>
        </div>

        <div className={styles.row}>
          <div className={styles.label}>{t('labels.alias')}</div>
          <div className={styles.value}>{alias || dash}</div>
        </div>

        <div className={styles.row}>
          <div className={styles.label}>{t('labels.city')}</div>
          <div className={styles.value}>{city || dash}</div>
        </div>

        <div className={styles.row}>
          <div className={styles.label}>{t('labels.address')}</div>
          <div className={styles.value}>{address || dash}</div>
        </div>

        <div className={styles.row}>
          <div className={styles.label}>{t('labels.phone')}</div>
          <div className={styles.value}>
            {phone ? (
              <a href={`tel:${phone}`} className={styles.link}>
                {phone}
              </a>
            ) : (
              dash
            )}
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.label}>{t('labels.email')}</div>
          <div className={styles.value}>
            {email ? (
              <a href={`mailto:${email}`} className={styles.link}>
                {email}
              </a>
            ) : (
              dash
            )}
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.label}>{t('labels.website')}</div>
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
              dash
            )}
          </div>
        </div>

        <div className={`${styles.row} ${styles.rowDescription}`}>
          <div className={styles.label}>{t('labels.description')}</div>
          <div className={`${styles.value} ${styles.valueMultiline}`}>
            {description?.trim() ? description : t('fallback.noDescription')}
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.label}>{t('labels.locations')}</div>
          <div className={styles.value}>{locationCount ?? 0}</div>
        </div>
      </div>
    </section>
  );
};

export default ClubDetails;

