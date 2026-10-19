import { Leaf, Search, Sparkles, Tag, ShieldCheck, Star } from "lucide-react";

export default function Hero() {
  return (
    <header id="beranda" className="relative overflow-hidden pb-16 pt-28 sm:pb-24 sm:pt-36">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -right-32 -top-40 h-[28rem] w-[28rem] rounded-full bg-primary-100/70 blur-3xl" />
        <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-warm/20 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_1fr]">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-white/80 px-3.5 py-1.5 text-xs font-semibold text-primary-700 shadow-soft backdrop-blur">
              <Leaf className="h-3.5 w-3.5" /> Booking langsung, tanpa OTA
            </span>

            <h1 className="mt-5 font-head text-4xl font-extrabold leading-[1.1] tracking-tight text-primary-900 sm:text-5xl lg:text-6xl">
              Menginap Nyaman,<br className="hidden sm:block" /> Tanpa Perantara
            </h1>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-ink/70 sm:text-lg">
              Vila, suite, dan homestay pilihan di alam hijau Bali. Kami bicara langsung dengan pemilik,
              Anda cukup pilih tanggal dan bayar DP — tanpa biaya perantara.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a href="#booking" className="btn-primary inline-flex items-center justify-center gap-2 rounded-xl bg-warm px-6 py-3.5 font-semibold text-primary-900 shadow-soft">
                <Search className="h-[18px] w-[18px]" /> Cek Ketersediaan
              </a>
              <a href="#fasilitas" className="inline-flex items-center justify-center gap-2 rounded-xl border border-primary-200 bg-white px-6 py-3.5 font-semibold text-primary-700 shadow-soft transition hover:-translate-y-0.5 hover:border-primary-300">
                <Sparkles className="h-[18px] w-[18px]" /> Lihat Fasilitas
              </a>
            </div>

            <div className="mt-8 inline-flex flex-wrap items-center gap-x-3 gap-y-2 rounded-2xl border border-ink/10 bg-white/75 px-4 py-3 shadow-soft backdrop-blur">
              <span className="text-sm text-ink/60">Mulai dari</span>
              <span className="font-head text-2xl font-extrabold tracking-tight text-primary-700">Rp 450.000</span>
              <span className="text-sm text-ink/60">/malam</span>
              <span className="ml-1 inline-flex items-center gap-1 rounded-full bg-warm/20 px-2.5 py-1 text-xs font-semibold text-warm-dark">
                <Tag className="h-3.5 w-3.5" /> Tanpa markup
              </span>
            </div>
          </div>

          <div className="relative">
            <div className="img-fallback relative aspect-[4/5] overflow-hidden rounded-3xl shadow-lift sm:aspect-[4/4.2]">
              <img
                src="https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=1100&q=80"
                alt="Vila dengan kolam renang dan pemandangan alam"
                className="h-full w-full object-cover"
                onError={(e) => e.currentTarget.classList.add("hidden")}
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-primary-900/60 via-transparent to-transparent" />
              <div className="grain absolute inset-x-4 bottom-4 rounded-2xl border border-white/25 bg-white/15 p-4 text-cream backdrop-blur-md">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-head text-sm font-bold">Villa Padi View</p>
                    <p className="text-xs text-cream/80">Sawah terhampar · Ubud</p>
                  </div>
                  <span className="font-head text-sm font-bold">Rp 750.000</span>
                </div>
              </div>
            </div>

            <div className="absolute -left-4 top-8 hidden rounded-2xl border border-ink/10 bg-white/90 px-4 py-3 shadow-lift backdrop-blur sm:block">
              <div className="flex items-center gap-2.5">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary-50 text-primary-600"><ShieldCheck className="h-[18px] w-[18px]" /></span>
                <div>
                  <p className="text-xs font-semibold text-ink">Bayar ke pemilik</p>
                  <p className="text-[11px] text-ink/55">Tanpa perantara</p>
                </div>
              </div>
            </div>

            <div className="absolute -right-3 bottom-20 hidden rounded-2xl border border-ink/10 bg-white/90 px-4 py-3 shadow-lift backdrop-blur sm:block">
              <div className="flex items-center gap-2.5">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-warm/20 text-warm-dark"><Star className="h-[18px] w-[18px]" /></span>
                <div>
                  <p className="text-xs font-semibold text-ink">4,9 dari 5</p>
                  <p className="text-[11px] text-ink/55">1.284 ulasan tamu</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
