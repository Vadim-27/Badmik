// src/services/_shared/prefetch.ts
import { QueryClient, dehydrate, type QueryKey } from '@tanstack/react-query';

type QueryDesc<T = unknown> = {
  queryKey: QueryKey;            // <-- було: unknown[]
  queryFn: () => Promise<T>;
};

export async function prefetch(queries: QueryDesc[]) {
  const qc = new QueryClient();
  await Promise.all(queries.map(q => qc.prefetchQuery(q)));
  return dehydrate(qc);
}