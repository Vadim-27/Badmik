// app/[locale]/(club)/[clubId]/membership-plans/page.tsx
import { getTranslations } from 'next-intl/server';

import RQHydrate from '@/services/_shared/RQHydrate';
import { prefetch } from '@/services/_shared/prefetch';
import { buildHrefServer } from '@/lib/club-scope.server';

import { clubMembershipPlansServerQueries } from '@/services/clubMembershipPlans/queries.server';
import ClubMembershipPlansPageClient from '@/app/components/shared/ClubMembershipPlans/ClubMembershipPlansPageClient';

type Params = { locale: string; clubId: string };

export default async function ClubMembershipPlansPage({ params }: { params: Params }) {
  const { locale, clubId } = await params;

  const tAH = await getTranslations({ locale, namespace: 'ActionHeader.title' });
  const tBC = await getTranslations({ locale, namespace: 'clubsBreadcrumbs' }); // або свій неймспейс

  const state = await prefetch([
    clubMembershipPlansServerQueries.list(clubId),
  ]);

  const dashboardHref = buildHrefServer(clubId, 'dashboard');

  const breadcrumbs = [
    { label: tBC('Admin'), href: dashboardHref },
    { label: tBC('ClubMembershipPlans') },
  ];

  return (
    <RQHydrate state={state}>
      <ClubMembershipPlansPageClient
        title={tAH('clubMembershipPlansHeader')}
        clubId={clubId}
        breadcrumbs={breadcrumbs}
      />
    </RQHydrate>
  );
}
