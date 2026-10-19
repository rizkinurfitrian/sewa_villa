import { Users, Maximize2, BedDouble, ArrowRight } from "lucide-react";
import { rupiah } from "../utils/format";

export default function RoomCard({ room, onSelect }) {
  return (
    <article className="card-lift group flex flex-col overflow-hidden rounded-2xl border border-ink/5 bg-white shadow-lg shadow-emerald-900/5">
      <div className="img-fallback relative aspect-[16/10] overflow-hidden bg-primary-200">
        <img
          src={room.img}
          alt={room.name}
          loading="lazy"
          onError={(e) => e.currentTarget.classList.add("hidden")}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-900/65 via-primary-900/10 to-transparent" />
        <span className="absolute left-3.5 top-3.5 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-bold text-primary-800 backdrop-blur">
          <Users className="h-3 w-3" /> {room.maxGuests} tamu
        </span>
        <p className="absolute inset-x-3.5 bottom-3.5 text-xs font-medium text-cream/85">{room.tagline}</p>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-head text-lg font-extrabold tracking-tight text-primary-900">{room.name}</h3>
        <div className="mt-1.5 flex flex-wrap items-center gap-x-3.5 gap-y-1 text-xs text-ink/50">
          <span className="inline-flex items-center gap-1"><Maximize2 className="h-3.5 w-3.5" />{room.size}</span>
          <span className="inline-flex items-center gap-1"><BedDouble className="h-3.5 w-3.5" />{room.bed}</span>
        </div>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {room.amenities.map(({ icon: Icon, label }) => (
            <span key={label} className="inline-flex items-center gap-1.5 rounded-lg bg-primary-50 px-2.5 py-1.5 text-xs font-semibold text-primary-700">
              <Icon className="h-3.5 w-3.5" /> {label}
            </span>
          ))}
        </div>

        <div className="mt-5 flex items-end justify-between gap-3 border-t border-dashed border-ink/10 pt-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-ink/45">Harga dasar</p>
            <p className="font-head text-xl font-extrabold text-primary-800">{rupiah(room.price)}</p>
            <p className="text-[11px] text-ink/45">per malam</p>
          </div>
          <button type="button" onClick={() => onSelect(room)} className="btn-primary inline-flex shrink-0 items-center gap-2 rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-semibold text-cream shadow-soft">
            Pilih Kamar <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </article>
  );
}
