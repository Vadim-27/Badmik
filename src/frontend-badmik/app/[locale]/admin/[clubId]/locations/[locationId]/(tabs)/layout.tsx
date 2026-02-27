import type { ReactNode } from 'react';

import LocationTabsLayoutClient from '@/app/components/shared/Locations/LocationTabsLayout/LocationTabsLayoutClient';
import { LocationTabsHeaderActionProvider } from '@/app/components/shared/Locations/LocationTabsLayout/LocationTabsHeaderActionContext';
import AppToaster from '@/app/components/providers/AppToaster';

type Params = { locale: string; clubId: string; locationId: string };

export default async function LocationLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Params;
}) {
  const { clubId, locationId } = await params;

  // як у Player: НЕ робимо prefetch у layout
  return (
    <LocationTabsHeaderActionProvider>
      <LocationTabsLayoutClient clubId={clubId} locationId={locationId}>
        <AppToaster />
        {children}
      </LocationTabsLayoutClient>
    </LocationTabsHeaderActionProvider>
  );
}
