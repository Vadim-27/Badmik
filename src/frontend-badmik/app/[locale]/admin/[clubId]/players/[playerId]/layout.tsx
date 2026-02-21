import type { ReactNode } from 'react';

import PlayerTabsLayoutClient from '@/app/components/shared/Players/PlayerTabsLayout/PlayerTabsLayoutClient';
import { PlayerTabsHeaderActionProvider } from '@/app/components/shared/Players/PlayerTabsLayout/PlayerTabsHeaderActionContext';
import AppToaster from '@/app/components/providers/AppToaster';


type Params = { locale: string; clubId: string; playerId: string };

export default async function PlayerLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Params;
}) {
  const { clubId, playerId } = await params;

  // Тут НЕ робимо prefetch, щоб не морочитись з “merge state” між layout і page.
  // Кожен таб/page хай сам префетчить те, що йому треба (як у вас заведено).

  return (
    <PlayerTabsHeaderActionProvider>
      <PlayerTabsLayoutClient clubId={clubId} playerId={playerId}>
        <AppToaster />
        {children}
      </PlayerTabsLayoutClient>
    </PlayerTabsHeaderActionProvider>
  );
}


