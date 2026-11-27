// Small wrapper around localStorage. Everything you do on the site (card reviews, quiz
// mistakes, lecture progress) is saved in this browser only. Reads and writes never throw:
// private browsing or a full disk just means progress isn't kept.
const PREFIX = 'qn:';

export function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    return raw === null ? fallback : (JSON.parse(raw) as T);
  } catch {
    return fallback;
  }
}

export function save<T>(key: string, value: T): void {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    /* storage unavailable: keep going without saving */
  }
}

export type Mastery = 'none' | 'shaky' | 'solid';
export function getMastery(): Record<string, Mastery> { return load('mastery', {}); }
export function setMastery(slug: string, m: Mastery) {
  const all = getMastery(); all[slug] = m; save('mastery', all);
}

/** Error log: counts of each kind of slip, fed by the quiz and the code lab. */
export function getErrors(): Record<string, number> { return load('errors', {}); }
export function logError(tag: string) {
  const e = getErrors(); e[tag] = (e[tag] ?? 0) + 1; save('errors', e);
}
