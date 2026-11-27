// Spaced repetition with FSRS (the scheduler modern Anki uses). Two grades only:
// Forgot (Again) and Remembered (Good). Card state is kept in localStorage.
import { createEmptyCard, fsrs, Rating, type Card as FCard } from 'ts-fsrs';
import { load, save } from './store';

const f = fsrs({ request_retention: 0.9, enable_fuzz: true });
type Stored = Record<string, FCard>;

function all(): Stored {
  const raw = load<Record<string, any>>('srs', {});
  for (const k in raw) { raw[k].due = new Date(raw[k].due); if (raw[k].last_review) raw[k].last_review = new Date(raw[k].last_review); }
  return raw as Stored;
}

export function stateOf(id: string): FCard | undefined { return all()[id]; }

/** Cards never seen are "new"; seen cards are due when their due date has passed. */
export function dueIds(ids: string[], now = new Date()): { due: string[]; fresh: string[] } {
  const s = all();
  const due: string[] = [], fresh: string[] = [];
  for (const id of ids) {
    if (!s[id]) fresh.push(id);
    else if (s[id].due <= now) due.push(id);
  }
  return { due, fresh };
}

export function review(id: string, grade: 1 | 3, now = new Date()): string {
  const s = all();
  const card = s[id] ?? createEmptyCard(now);
  const rec = f.next(card, now, grade === 1 ? Rating.Again : Rating.Good);
  s[id] = rec.card;
  save('srs', s);
  return humanDelay(rec.card.due, now);
}

/** What each button would schedule, e.g. "10 min" / "3 days". */
export function preview(id: string, now = new Date()): { forgot: string; remembered: string } {
  const card = all()[id] ?? createEmptyCard(now);
  const p = f.repeat(card, now);
  return { forgot: humanDelay(p[Rating.Again].card.due, now), remembered: humanDelay(p[Rating.Good].card.due, now) };
}

export function humanDelay(due: Date, now = new Date()): string {
  const m = Math.max(1, Math.round((due.getTime() - now.getTime()) / 60000));
  if (m < 60) return `in ${m} min`;
  const h = Math.round(m / 60);
  if (h < 24) return `in ${h} h`;
  const d = Math.round(h / 24);
  return d < 31 ? `in ${d} day${d === 1 ? '' : 's'}` : `in ${Math.round(d / 30)} month${d < 60 ? '' : 's'}`;
}
