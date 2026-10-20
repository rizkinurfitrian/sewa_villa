import { Info } from "lucide-react";
import RoomCard from "./RoomCard";

export default function RoomList({ rooms, loading, onSelect }) {
  return (
    <section id="booking" className="relative py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-warm-dark">Pilihan kami</span>
            <h2 id="kamar" className="mt-2 font-head text-3xl font-extrabold tracking-tight text-primary-900 sm:text-4xl">Kamar &amp; Vila</h2>
            <p className="mt-3 max-w-xl text-ink/65">Tiga tipe kamar dengan harga dasar transparan. Tambahan weekend dan libur nasional dihitung otomatis di halaman pemesanan.</p>
          </div>
          <div className="inline-flex items-center gap-2 self-start rounded-xl border border-ink/10 bg-white px-4 py-2.5 text-sm text-ink/70 shadow-soft sm:self-auto">
            <Info className="h-4 w-4 text-primary-500" /> Harga akhir terlihat sebelum bayar
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
          {loading && rooms.length === 0 ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="card-lift overflow-hidden rounded-2xl border border-ink/5 bg-white shadow-lg shadow-emerald-900/5">
                <div className="aspect-[16/10] animate-pulse bg-primary-100" />
                <div className="space-y-3 p-5">
                  <div className="h-4 w-2/3 animate-pulse rounded bg-primary-100" />
                  <div className="h-3 w-1/2 animate-pulse rounded bg-primary-50" />
                  <div className="h-8 w-full animate-pulse rounded bg-primary-50" />
                </div>
              </div>
            ))
          ) : (
            rooms.map((room) => (
              <RoomCard key={room.id} room={room} onSelect={onSelect} />
            ))
          )}
        </div>
      </div>
    </section>
  );
}
