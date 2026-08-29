/** True when the string looks like HTML markup (not plain text). */
export function looksLikeHtml(value: string): boolean {
  return /<[a-z][\s\S]*>/i.test(value.trim());
}

/** Escape plain text and keep line breaks for safe HTML display. */
export function plainTextToSafeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/\n/g, '<br>');
}

/**
 * Prepare event description for [innerHTML].
 * Angular still sanitizes the bound HTML; this only chooses plain vs rich path.
 */
export function eventDescriptionHtml(raw: string | null | undefined): string {
  const value = (raw ?? '').trim();
  if (!value) return '';
  return looksLikeHtml(value) ? value : plainTextToSafeHtml(value);
}

export function eventHtmlToPlain(raw: string | null | undefined): string {
  const value = (raw ?? '').trim();
  if (!value) return '';
  return value
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}
