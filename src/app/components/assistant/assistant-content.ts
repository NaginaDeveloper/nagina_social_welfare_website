/** Segment of assistant message text — Latin contact facts stay LTR inside RTL Urdu. */
export interface AssistantContentPart {
  readonly kind: 'text' | 'ltr';
  readonly text: string;
}

/**
 * Split message text so phones, emails, and Latin addresses keep left-to-right order
 * when the bubble is RTL (Urdu).
 */
export function splitAssistantContent(content: string): readonly AssistantContentPart[] {
  if (!content) {
    return [];
  }

  const pattern =
    /(\+?\d[\d\s().-]{6,}\d|[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}|\d{1,4}\s+[A-Za-z][A-Za-z0-9\s.',-]{0,50}?\b(?:Road|Street|St\.?|Lane|Avenue|Close|Drive)\b(?:,?\s*Peterborough)?(?:,?\s*[A-Z]{1,2}\d{1,2}\s*\d[A-Z]{2})?|[A-Z]{1,2}\d{1,2}\s*\d[A-Z]{2})/g;

  const parts: AssistantContentPart[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(content)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ kind: 'text', text: content.slice(lastIndex, match.index) });
    }
    parts.push({ kind: 'ltr', text: match[0] });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < content.length) {
    parts.push({ kind: 'text', text: content.slice(lastIndex) });
  }

  return parts.length ? parts : [{ kind: 'text', text: content }];
}

/** True when the assistant reply looks like contact / directions help. */
export function looksLikeContactAnswer(content: string): boolean {
  return /(?:\+?\d[\d\s().-]{6,}\d)|@|whatsapp|wa\.me|رابط|فون|ای\s*میل|پتہ|phone|email|contact|map|peterborough|burmer|naginasocialwelfare/i.test(
    content,
  );
}
