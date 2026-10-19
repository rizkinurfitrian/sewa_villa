import { WEEKEND_RATE, HOLIDAY_RATE, DP_RATE } from "../data/constants";
import { nightsBetween, addDays, holidayName } from "./date";

export function calcPrice(room, checkIn, checkOut) {
  if (!room || !checkIn || !checkOut) return null;
  const nights = nightsBetween(checkIn, checkOut);
  if (nights < 1) return null;

  const base = room.price * nights;
  let weekendNights = 0;
  let holidayNights = 0;
  let cur = checkIn;

  for (let i = 0; i < nights; i++) {
    if (holidayName(cur)) holidayNights++;
    else if (cur.getDay() === 5 || cur.getDay() === 6) weekendNights++;
    cur = addDays(cur, 1);
  }

  const weekendAdd = base * WEEKEND_RATE * (weekendNights / nights);
  const holidayAdd = base * HOLIDAY_RATE * (holidayNights / nights);
  const surcharge = weekendAdd + holidayAdd;
  const total = base + surcharge;

  return { nights, base, weekendAdd, holidayAdd, surcharge, total, dp: total * DP_RATE, weekendNights, holidayNights };
}
