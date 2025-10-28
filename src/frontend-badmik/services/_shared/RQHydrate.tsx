// src/services/_shared/RQHydrate.tsx (Client)
'use client';
import { HydrationBoundary } from '@tanstack/react-query';

export default function RQHydrate({ state, children }: { state: any; children: React.ReactNode }) {
  return <HydrationBoundary state={state}>{children}</HydrationBoundary>;
}