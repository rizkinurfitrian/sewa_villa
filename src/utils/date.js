import { MONTH_NAMES, DAY_NAMES, HOLIDAYS } from "../data/constants";

export const pad = (n) => String(n).padStart(2, "0");
export const dateKey = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const monthDay = (d) => `${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
export const today = () => startOfDay(new Date());
export const addDays = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
export const nightsBetween = (a, b) => Math.round((startOfDay(b) - startOfDay(a)) / 86400000);
export const fmtShort = (d) => `${d.getDate()} ${MONTH_NAMES[d.getMonth()].slice(0, 3)} ${d.getFullYear()}`;
export const fmtFull = (d) => `${DAY_NAMES[d.getDay()]}, ${d.getDate()} ${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`;
export const holidayName = (d) => HOLIDAYS[monthDay(d)] || null;
export const parseKey = (key) => {
  const p = key.split("-");
  return new Date(Number(p[0]), Number(p[1]) - 1, Number(p[2]));
};

export function markRange(map, from, toInclusive) {
  let cur = startOfDay(from);
  const end = startOfDay(toInclusive);
  let guard = 0;
  while (cur <= end && guard++ < 400) {
    map[dateKey(cur)] = true;
    cur = addDays(cur, 1);
  }
}
