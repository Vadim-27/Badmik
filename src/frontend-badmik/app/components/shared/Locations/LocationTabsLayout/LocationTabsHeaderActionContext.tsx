'use client';

import React, { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

type Ctx = {
  headerAction: ReactNode | null;
  setHeaderAction: (node: ReactNode | null) => void;
};

const LocationTabsHeaderActionContext = createContext<Ctx | null>(null);

export function LocationTabsHeaderActionProvider({ children }: { children: ReactNode }) {
  const [headerAction, setHeaderAction] = useState<ReactNode | null>(null);

  const value = useMemo<Ctx>(() => ({ headerAction, setHeaderAction }), [headerAction]);

  return (
    <LocationTabsHeaderActionContext.Provider value={value}>
      {children}
    </LocationTabsHeaderActionContext.Provider>
  );
}

export function useLocationTabsHeaderAction() {
  const ctx = useContext(LocationTabsHeaderActionContext);
  if (!ctx) throw new Error('useLocationTabsHeaderAction must be used within LocationTabsHeaderActionProvider');
  return ctx;
}
