import { ROOMS } from "../data/constants";
import { today, addDays, markRange, parseKey } from "./date";

export function buildBlocked(bookings) {
  const map = {};
  const t = today();

  ROOMS.forEach((room, idx) => {
    const set = {};
    for (let i = 0; i < 3; i++) {
      const from = addDays(t, 4 + i * 6 + (idx % 2) * 2);
      markRange(set, from, addDays(from, 2));
    }
    map[room.id] = set;
  });

  bookings.forEach((b) => {
    if (!b.roomId || !b.checkIn || !b.checkOut) return;
    if (!map[b.roomId]) map[b.roomId] = {};
    markRange(map[b.roomId], parseKey(b.checkIn), addDays(parseKey(b.checkOut), -1));
  });

  return map;
}
