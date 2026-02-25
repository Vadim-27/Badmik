import { getTranslations } from 'next-intl/server';

import RQHydrate from '@/services/_shared/RQHydrate';
import { prefetch } from '@/services/_shared/prefetch';
import { clubSettingsServerQueries } from '@/services/clubSettings/queries.server';

import ClubSettingsScreen from '@/app/components/shared/ClubSettings/ClubSettingsScreen/ClubSettingsScreen';

type Params = { locale: string; clubId: string };

export default async function ClubSettingsPage({ params }: { params: Params }) {
  const { locale, clubId } = await params;

  // якщо треба — заголовки/бредкрамбс як у вас заведено
  await getTranslations({ locale, namespace: 'clubSettings' });

  const state = await prefetch([clubSettingsServerQueries.byClubId(clubId)]);

  return (
    <RQHydrate state={state}>
      <div className="pt-0 p-4 w-full">
        <ClubSettingsScreen clubId={clubId} />
      </div>
    </RQHydrate>
  );
}

//===============================


// // app/[locale]/admin/[clubId]/club-settings/page.tsx (або де у вас)
// import { getTranslations } from 'next-intl/server';

// import RQHydrate from '@/services/_shared/RQHydrate';
// import { prefetch } from '@/services/_shared/prefetch';
// import { clubSettingsServerQueries } from '@/services/clubSettings/queries.server';

// import ClubSettingsScreen from '@/app/components/shared/ClubSettings/ClubSettingsScreen/ClubSettingsScreen';
// import { buildHrefServer } from '@/lib/club-scope.server';

// type Params = { locale: string; clubId: string };

// export default async function ClubSettingsPage({ params }: { params: Params }) {
//   const { locale, clubId } = params;

//   await getTranslations({ locale, namespace: 'clubSettings' });

//   const state = await prefetch([clubSettingsServerQueries.byClubId(clubId)]);

//   const dashboardHref = buildHrefServer(clubId, 'dashboard');
//   const settingsHref = buildHrefServer(clubId, 'club-settings');

//   return (
//     <RQHydrate state={state}>
//       <div className="pt-0 p-4 w-full">
//         <ClubSettingsScreen
//           clubId={clubId}
//           breadcrumbs={[
//             { labelKey: 'Admin', href: dashboardHref },
//             { labelKey: 'ClubSettings', href: settingsHref },
//           ]}
//         />
//       </div>
//     </RQHydrate>
//   );
// }
