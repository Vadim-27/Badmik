// app/[locale]/admin/[clubId]/players/page.tsx
import { getTranslations } from 'next-intl/server';
import RQHydrate from '@/services/_shared/RQHydrate';
import { prefetch } from '@/services/_shared/prefetch';
import { playersServerQueries } from '@/services/players/queries.server';

import ActionHeader from '@/app/components/ui/Layout/ActionHeader/ActionHeader';
import BackButton from '@/app/components/ui/Buttons/BackButton/BackButton';
import AddButton from '@/app/components/ui/Buttons/AddButton/AddButton';
import AppBreadcrumbs from '@/app/components/ui/Breadcrumbs/AppBreadcrumbs';
import PlayersTable from '@/app/components/shared/Players/PlayerTable/PlayerTable';
import { buildHrefServer } from '@/lib/club-scope.server';

export default async function PlayersPage({ params }: { params: { locale: string; clubId: string } }) {
  const { locale, clubId } = await params;

  const tAH = await getTranslations({ locale, namespace: 'ActionHeader.title' });
  const tBC = await getTranslations({ locale, namespace: 'playersBreadcrumbs' });

  const state = await prefetch([
    playersServerQueries.list({ clubId, page: 1, pageSize: 10 }),
  ]);

  const addHref = buildHrefServer(clubId, 'players/add-player');
  const dashboardHref = buildHrefServer(clubId, 'dashboard');

  return (
    <RQHydrate state={state}>
      <div className="pt-0 p-4 w-full">
        <ActionHeader>
          <BackButton label="buttons.back" />
          <h2 className="text-lg font-semibold">{tAH('playersHeader')}</h2>
          <AddButton href={addHref} label="buttons.addPlayer" />
        </ActionHeader>

        <AppBreadcrumbs
          items={[
            { label: tBC('Admin'), href: dashboardHref },
            { label: tBC('Players') },
          ]}
        />

        <PlayersTable clubId={clubId} />
      </div>
    </RQHydrate>
  );
}
