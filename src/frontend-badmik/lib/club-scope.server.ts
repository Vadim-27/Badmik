// lib/club-scope.server.ts
export const buildHrefServer = (clubId: string | undefined, path: string, opts: {scoped?: boolean} = {scoped:true}) => {
  const clean = path.replace(/^\/+/, '');
  return opts.scoped !== false && clubId ? `/admin/${clubId}/${clean}` : `/admin/${clean}`;
};
