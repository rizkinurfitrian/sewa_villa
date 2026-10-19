import { useEffect, useRef } from "react";
import { MousePointerClick, Flame, PartyPopper, Tag, Percent } from "lucide-react";
import { WEEKEND_RATE, HOLIDAY_RATE } from "../data/constants";
import { rupiah } from "../utils/format";

export default function PricePanel({ room, price: p }) {
  const ref = useRef(null);

  // animasi flash setiap harga berubah
  useEffect(() => {
    const el = ref.current;
    if (!el || !p) return;
    el.classList.remove("price-flash");
    void el.offsetWidth;
    el.classList.add("price-flash");
  }, [p?.total]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div ref={ref} className="rounded-2xl border border-ink/10 bg-white p-5 shadow-lg shadow-emerald-900/5">
      <div className="flex items-center justify-between gap-3">
        <p className="font-head text-sm font-bold text-primary-900">Rincian Harga</p>
        <span className="rounded-full bg-primary-50 px-2.5 py-1 text-[11px] font-semibold text-primary-700">{rupiah(room.price)}/malam</span>
      </div>

      {!p ? (
        <div className="mt-4 flex items-start gap-2.5 rounded-xl bg-primary-50 px-4 py-3.5 text-xs leading-relaxed text-primary-800">
          <MousePointerClick className="mt-0.5 h-4 w-4 shrink-0" />
          Pilih tanggal check-in dan check-out pada kalender untuk melihat rincian harga.
        </div>
      ) : (
        <div className="mt-4 space-y-2.5 text-sm">
          <div className="flex items-center justify-between text-ink/65">
            <span>Harga dasar <span className="text-ink/45">× {p.nights} malam</span></span>
            <span className="font-medium text-ink">{rupiah(p.base)}</span>
          </div>
          <div className="flex items-center justify-between text-ink/65">
            <span>Tambahan weekend &amp; libur</span>
            <span className="font-medium text-ink">{p.surcharge > 0 ? "+" : ""}{rupiah(p.surcharge)}</span>
          </div>

          <div className="flex flex-wrap gap-2 pt-0.5">
            {p.weekendNights > 0 && (
              <span className="inline-flex animate-pulse items-center gap-1.5 rounded-full bg-warm/20 px-3 py-1 text-xs font-bold text-warm-dark">
                <Flame className="h-3.5 w-3.5" /> +{Math.round(WEEKEND_RATE * 100)}% Weekend (Jum–Sat) · {p.weekendNights} malam
              </span>
            )}
            {p.holidayNights > 0 && (
              <span className="inline-flex animate-pulse items-center gap-1.5 rounded-full bg-primary-100 px-3 py-1 text-xs font-bold text-primary-700">
                <PartyPopper className="h-3.5 w-3.5" /> +{Math.round(HOLIDAY_RATE * 100)}% Libur Nasional · {p.holidayNights} malam
              </span>
            )}
            {p.surcharge === 0 && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-3 py-1 text-xs font-bold text-primary-600">
                <Tag className="h-3.5 w-3.5" /> Harga dasar, tanpa tambahan
              </span>
            )}
          </div>

          <div className="flex items-center justify-between border-t border-dashed border-ink/10 pt-3">
            <span className="font-semibold text-ink">Total stay</span>
            <span className="font-head text-lg font-extrabold text-primary-800">{rupiah(p.total)}</span>
          </div>
          <div className="flex items-center justify-between rounded-xl bg-warm/15 px-3.5 py-3">
            <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-warm-dark">
              <Percent className="h-3.5 w-3.5" /> DP 30% wajib
            </span>
            <span className="font-head text-lg font-extrabold text-primary-800">{rupiah(p.dp)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
