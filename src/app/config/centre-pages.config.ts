/** Centres with their own top-level URL (and SEO shell). Others open at /centre/:id. */
export const CENTRE_PAGE_PATHS: Readonly<Record<string, string>> = {
  peterborough: '/peterborough',
  manchester: '/manchester',
};

export function centrePath(campusId: string): string {
  return CENTRE_PAGE_PATHS[campusId] ?? `/centre/${encodeURIComponent(campusId)}`;
}
