import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function getHighlightedParts(text: string, query: string) {
  const q = query.trim();
  if (!q || q.length < 2) return [{ text, highlight: false }];
  const rx = new RegExp(escapeRegExp(q), "gi");
  const parts: Array<{ text: string; highlight: boolean }> = [];
  let lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = rx.exec(text)) !== null) {
    const start = m.index;
    const end = start + m[0].length;
    if (start > lastIndex) parts.push({ text: text.slice(lastIndex, start), highlight: false });
    parts.push({ text: text.slice(start, end), highlight: true });
    lastIndex = end;
  }
  if (lastIndex < text.length) parts.push({ text: text.slice(lastIndex), highlight: false });
  return parts;
}
