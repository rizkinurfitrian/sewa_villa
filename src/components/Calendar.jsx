import { ChevronLeft, ChevronRight } from "lucide-react";
import { MONTH_NAMES } from "../data/constants";
import { dateKey, addDays, startOfDay, today, holidayName, fmtFull } from "../utils/date";

const DAY_HEADERS = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];

export default function Calendar({ blocked, checkIn, checkOut, onDayClick, view, onShift }) {
  const t = today();
  const todayKey = dateKey(t);
  const first = new Date(view.y, view.m, 1);
  const lead = (first.getDay() + 6) % 7;
  const start = addDays(first, -lead);
  const daysInMonth = new Date(view.y, view.m + 1, 0).getDate();
  const rows = Math.ceil((lead + daysInMonth) / 7);
  const cells = Array.from({ length: rows * 7 }, (_, i) => addDays(start, i));

  return (
    <>
      <div className="flex items-center justify-between">
        <button type="button" aria-label="Bulan sebelumnya" onClick={() => onShift(-1)} className="grid h-9 w-9 place-items-center rounded-xl border border-ink/10 bg-white text-ink/70 transition hover:bg-primary-50 hover:text-primary-700">
          <ChevronLeft className="h-[18px] w-[18px]" />
        </button>
        <p className="font-head text-base font-bold text-primary-900">{MONTH_NAMES[view.m]} {view.y}</p>
        <button type="button" aria-label="Bulan berikutnya" onClick={() => onShift(1)} className="grid h-9 w-9 place-items-center rounded-xl border border-ink/10 bg-white text-ink/70 transition hover:bg-primary-50 hover:text-primary-700">
          <ChevronRight className="h-[18px] w-[18px]" />
        </button>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-1 text-center text-[11px] font-bold uppercase tracking-wide text-ink/40">
        {DAY_HEADERS.map((d) => <span key={d}>{d}</span>)}
      </div>

      <div className="mt-1.5 grid grid-cols-7 gap-1">
        {cells.map((d) => {
          const key = dateKey(d);
          const isOff = d.getMonth() !== view.m;
          const isFull = !!blocked[key];
          const isPast = startOfDay(d) < t;
          const hol = holidayName(d);
          const isStart = !!checkIn && dateKey(checkIn) === key;
          const isEnd = !!checkOut && dateKey(checkOut) === key;
          const inRange = !!checkIn && !!checkOut && startOfDay(d) > startOfDay(checkIn) && startOfDay(d) < startOfDay(checkOut);
          const selectable = !isOff && !isFull && !isPast;

          let cls = "cal-day relative aspect-square rounded-lg text-[13px] font-medium flex items-center justify-center select-none";
          if (isOff) cls += " is-off text-ink/25";
          else if (isFull) cls += " is-full bg-full/90 text-white cursor-not-allowed line-through decoration-white/60";
          else if (isPast) cls += " is-past text-ink/30 cursor-not-allowed";
          else if (isStart || isEnd) cls += " bg-primary-600 text-cream font-bold shadow-soft cursor-pointer";
          else if (inRange) cls += " bg-primary-100 text-primary-900 cursor-pointer";
          else cls += " text-ink/80 cursor-pointer";

          if (isStart) cls += " rounded-l-none";
          if (isEnd) cls += " rounded-r-none";
          const showHoliday = selectable && hol && !isStart && !isEnd;
          if (showHoliday) cls += " border border-warm-dark/60";
          if (!isOff && key === todayKey) cls += " ring-2 ring-warm ring-offset-1 ring-offset-cream";

          return (
            <button
              key={key}
              type="button"
              tabIndex={isOff ? -1 : 0}
              title={hol || fmtFull(d)}
              onClick={() => onDayClick(d, selectable)}
              className={cls}
            >
              {d.getDate()}
              {showHoliday && <span className="absolute bottom-1 h-1.5 w-1.5 rounded-full bg-warm-dark" />}
            </button>
          );
        })}
      </div>
    </>
  );
}
