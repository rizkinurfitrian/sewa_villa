import { CalendarX, Search, Calendar, Moon, CreditCard, CircleCheck, Clock3 } from "lucide-react";
import { STATUS_BADGE, STATUS_CONFIRMED, STATUS_PENDING } from "../data/constants";
import { rupiah } from "../utils/format";
import { fmtShort, parseKey } from "../utils/date";

export default function BookingHistory({ bookings }) {
  const has = bookings.length > 0;

  return (
    <section id="riwayat" className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-warm-dark">Tersimpan otomatis</span>
            <h2 className="mt-2 font-head text-3xl font-extrabold tracking-tight text-primary-900 sm:text-4xl">Riwayat Booking</h2>
            <p className="mt-3 max-w-xl text-ink/65">Booking Anda tersimpan otomatis di perangkat ini — tanpa perlu akun. Status pembayaran diperbarui oleh admin.</p>
          </div>
        </div>

        <div className="mt-8">
          {!has ? (
            <div className="rounded-2xl border border-dashed border-ink/15 bg-white/70 px-6 py-14 text-center shadow-lg shadow-emerald-900/5">
              <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-primary-50 text-primary-500"><CalendarX className="h-7 w-7" /></span>
              <h3 className="mt-5 font-head text-lg font-bold text-primary-900">Belum ada booking</h3>
              <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ink/60">
                Kamar yang Anda pesan beserta status pembayarannya akan tampil di sini, tersimpan otomatis di perangkat ini.
              </p>
              <a href="#booking" className="btn-primary mt-6 inline-flex items-center gap-2 rounded-xl bg-primary-600 px-5 py-3 text-sm font-semibold text-cream shadow-soft">
                <Search className="h-4 w-4" /> Mulai pilih kamar
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {bookings.map((b) => (
                <article key={b.kode} className="card-lift overflow-hidden rounded-2xl border border-ink/5 bg-white shadow-lg shadow-emerald-900/5">
                  <div className="flex flex-col gap-4 p-5 sm:flex-row">
                    <div className="img-fallback h-24 w-full shrink-0 overflow-hidden rounded-xl bg-primary-200 sm:w-28">
                      <img src={b.roomImg} alt="" className="h-full w-full object-cover" onError={(e) => e.currentTarget.classList.add("hidden")} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="truncate font-head text-base font-bold text-primary-900">{b.roomName}</h3>
                          <p className="mt-0.5 text-xs text-ink/55">{b.nama} · {b.tamu} tamu</p>
                        </div>
                        {(() => {
                          const status = b.status || STATUS_PENDING;
                          const confirmed = status === STATUS_CONFIRMED;
                          return (
                            <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ring-1 ${STATUS_BADGE[status] || "bg-ink/10 text-ink/60 ring-ink/10"}`}>
                              {confirmed ? <CircleCheck className="h-3.5 w-3.5" /> : <Clock3 className="h-3.5 w-3.5" />} {status}
                            </span>
                          );
                        })()}
                      </div>
                      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-ink/60">
                        <span className="inline-flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5 text-primary-500" />{fmtShort(parseKey(b.checkIn))} → {fmtShort(parseKey(b.checkOut))}</span>
                        <span className="inline-flex items-center gap-1.5"><Moon className="h-3.5 w-3.5 text-primary-500" /> {b.nights} malam</span>
                        <span className="inline-flex items-center gap-1.5"><CreditCard className="h-3.5 w-3.5 text-primary-500" /> {b.metode}</span>
                      </div>
                      <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2 border-t border-dashed border-ink/10 pt-3">
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-ink/45">Kode {b.kode}</span>
                        <span className="text-sm">
                          <span className="text-ink/50">DP </span>
                          <strong className="font-head text-base text-primary-800">{rupiah(b.dp)}</strong>{" "}
                          <span className="text-ink/40">dari {rupiah(b.total)}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
