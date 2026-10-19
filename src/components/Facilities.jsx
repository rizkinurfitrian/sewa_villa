import { BadgePercent, CalendarRange, Wallet, Headset } from "lucide-react";

const ITEMS = [
  { icon: BadgePercent, title: "Harga tanpa markup", text: "Tidak ada biaya layanan tersembunyi. Angka yang tampil adalah angka yang benar-benar Anda bayar." },
  { icon: CalendarRange, title: "Kalender real-time", text: "Tanggal yang sudah dipesan langsung ditandai merah, jadi tidak ada bentrok saat tiba." },
  { icon: Wallet, title: "DP fleksibel 30%", text: "Kunci kamar dengan DP 30%. Sisanya dilunasi H-3 lewat transfer, QRIS, atau Virtual Account." },
  { icon: Headset, title: "Dibantu warga lokal", text: "Tim kami di Ubud siap membantu lewat WhatsApp sebelum dan selama Anda menginap." },
];

export default function Facilities() {
  return (
    <section id="fasilitas" className="relative border-y border-ink/5 bg-white/60 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-warm-dark">Kenapa langsung</span>
          <h2 className="mt-2 font-head text-3xl font-extrabold tracking-tight text-primary-900 sm:text-4xl">Fasilitas &amp; Keunggulan</h2>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {ITEMS.map(({ icon: Icon, title, text }) => (
            <div key={title} className="card-lift rounded-2xl border border-ink/5 bg-cream p-6 shadow-lg shadow-emerald-900/5">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary-100 text-primary-700"><Icon className="h-5 w-5" /></span>
              <h3 className="mt-4 font-head text-base font-bold text-primary-900">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/65">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
