


'use client';

import React, { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

type Ctx = {
  headerAction: ReactNode | null;
  setHeaderAction: (node: ReactNode | null) => void;
};

const PlayerTabsHeaderActionContext = createContext<Ctx | null>(null);

export function PlayerTabsHeaderActionProvider({ children }: { children: ReactNode }) {
  const [headerAction, setHeaderAction] = useState<ReactNode | null>(null);

  const value = useMemo<Ctx>(() => ({ headerAction, setHeaderAction }), [headerAction]);

  return (
    <PlayerTabsHeaderActionContext.Provider value={value}>
      {children}
    </PlayerTabsHeaderActionContext.Provider>
  );
}

export function usePlayerTabsHeaderAction() {
  const ctx = useContext(PlayerTabsHeaderActionContext);
  if (!ctx) {
    // важливо: щоб помилка була явною, а не "мовчки не працює"
    throw new Error('usePlayerTabsHeaderAction must be used within PlayerTabsHeaderActionProvider');
  }
  return ctx;
}
