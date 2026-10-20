import { useState, useMemo, useEffect, useCallback } from "react";
import { X, CalendarCheck, CreditCard } from "lucide-react";
import { EMAIL_RE } from "../data/constants";
import { calcPrice } from "../utils/pricing";
import { dataUrlToFile } from "../utils/image";
import { api } from "../api";
import { dateKey, addDays, startOfDay, today, nightsBetween, fmtShort, fmtFull } from "../utils/date";
import Calendar from "./Calendar";
import PricePanel from "./PricePanel";
import PaymentModal from "./PaymentModal";

const inputCls =
  "w-full rounded-xl border bg-white px-4 py-3 text-sm text-ink outline-none transition placeholder:text-ink/30 focus:border-primary-400 focus:ring-4 focus:ring-primary-100";
const labelCls = "mb-1.5 block text-xs font-bold uppercase tracking-wider text-ink/55";
const quickBtn =
  "rounded-lg border border-ink/10 bg-white px-3 py-1.5 text-xs font-semibold text-ink/70 transition hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700";

export default function BookingModal({ room, blocked, onClose, onConfirmed, toast }) {
  const now = new Date();
  const [view, setView] = useState({ y: now.getFullYear(), m: now.getMonth() });
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [guests, setGuests] = useState(1);
  const [note, setNote] = useState("");
  const [errors, setErrors] = useState({});
  const [showPay, setShowPay] = useState(false);

  const price = useMemo(() => calcPrice(room, checkIn, checkOut), [room, checkIn, checkOut]);
  const canPay = !!price && !!name.trim() && EMAIL_RE.test(email.trim());

  const closePay = useCallback(() => setShowPay(false), []);

  // kunci scroll body + tutup dengan Escape
  useEffect(() => {
    document.body.classList.add("no-scroll");
    const onKey = (e) => e.key === "Escape" && !showPay && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.classList.remove("no-scroll");
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose, showPay]);

  const shiftMonth = (n) =>
    setView(({ y, m }) => {
      const d = new Date(y, m + n, 1);
      return { y: d.getFullYear(), m: d.getMonth() };
    });

  const isBlocked = (d) => !!blocked[dateKey(d)];

  const handleDayClick = (date, selectable) => {
    if (!selectable) {
      if (isBlocked(date)) toast(`${fmtFull(date)} sudah dipesan. Silakan pilih tanggal lain.`, "info");
      return;
    }
    if (!checkIn || checkOut || startOfDay(date) <= startOfDay(checkIn)) {
      setCheckIn(date);
      setCheckOut(null);
      return;
    }
    const nights = nightsBetween(checkIn, date);
    for (let i = 0; i < nights; i++) {
      const cur = addDays(checkIn, i);
      if (isBlocked(cur)) {
        toast(`Rentang ${fmtShort(checkIn)} → ${fmtShort(date)} melewati tanggal yang sudah dipesan (${fmtShort(cur)}).`, "error");
        setCheckIn(date);
        setCheckOut(null);
        return;
      }
    }
    setCheckOut(date);
  };

  const findFreeRun = (from, len) => {
    for (let offset = 0; offset < 120; offset++) {
      const s = addDays(startOfDay(from), offset);
      let ok = true;
      for (let i = 0; i < len; i++) {
        const d = addDays(s, i);
        if (startOfDay(d) < today() || isBlocked(d)) { ok = false; break; }
      }
      if (ok) return s;
    }
    return null;
  };

  const quickPick = (kind) => {
    if (kind === "reset") { setCheckIn(null); setCheckOut(null); return; }

    let from = addDays(today(), 1);
    if (kind === "weekend") while (from.getDay() !== 5) from = addDays(from, 1);

    const len = kind === "weekend" ? 2 : 3;
    const start = findFreeRun(from, len);
    if (!start) { toast(`Tidak ada rentang ${len} malam kosong dalam 120 hari ke depan.`, "error"); return; }

    setCheckIn(start);
    setCheckOut(addDays(start, len));
    setView({ y: start.getFullYear(), m: start.getMonth() });
    if (startOfDay(start) > startOfDay(from)) toast("Tanggal awal digeser karena ada tanggal yang sudah dipesan.", "info");
  };

  const openPayment = () => {
    if (!price) { toast("Pilih tanggal check-in dan check-out terlebih dahulu.", "error"); return; }
    const nameOk = !!name.trim();
    const emailOk = EMAIL_RE.test(email.trim());
    setErrors({
      name: nameOk ? "" : "Nama tamu wajib diisi.",
      email: emailOk ? "" : "Masukkan format email yang valid.",
    });
    if (!nameOk || !emailOk) { toast("Lengkapi data tamu sebelum lanjut ke pembayaran.", "error"); return; }
    setShowPay(true);
  };

  const handlePaid = async (metode, proofDataUrl) => {
    const created = await api.createBooking({
      room_id: room.id,
      check_in: dateKey(checkIn),
      check_out: dateKey(checkOut),
      nama: name.trim(),
      email: email.trim(),
      tamu: guests,
      catatan: note.trim() || undefined,
      metode,
    });

    let finalBooking = created;
    if (proofDataUrl) {
      try {
        finalBooking = await api.uploadProof(created.kode, dataUrlToFile(proofDataUrl));
      } catch {
        // Booking sudah tersimpan; bukti transfer bisa diunggah ulang oleh admin bila perlu.
        finalBooking = created;
      }
    }
    onConfirmed(finalBooking);
  };

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-end justify-center bg-ink/50 backdrop-blur-sm sm:items-center sm:p-6"
        role="dialog"
        aria-modal="true"
        aria-labelledby="bookingTitle"
        onMouseDown={(e) => e.target === e.currentTarget && onClose()}
      >
        <div className="modal-panel max-h-[95vh] w-full max-w-4xl overflow-hidden rounded-t-3xl bg-cream shadow-lift sm:rounded-3xl">
          <div className="flex items-start justify-between gap-4 border-b border-ink/5 bg-white px-5 py-4 sm:px-7">
            <div className="flex items-center gap-3.5">
              <span className="img-fallback h-14 w-16 shrink-0 overflow-hidden rounded-xl bg-primary-200">
                <img src={room.img} alt={room.name} className="h-full w-full object-cover" onError={(e) => e.currentTarget.classList.add("hidden")} />
              </span>
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-warm-dark">Pilih Tanggal</p>
                <h3 id="bookingTitle" className="truncate font-head text-lg font-extrabold text-primary-900 sm:text-xl">{room.name}</h3>
              </div>
            </div>
            <button type="button" aria-label="Tutup" onClick={onClose} className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-ink/10 bg-cream text-ink/60 transition hover:bg-ink/5 hover:text-ink">
              <X className="h-[18px] w-[18px]" />
            </button>
          </div>

          <div className="grid max-h-[calc(95vh-78px)] grid-cols-1 overflow-y-auto lg:grid-cols-[1.05fr_1fr]">
            {/* Kolom kiri: kalender */}
            <div className="border-b border-ink/5 p-5 sm:p-7 lg:border-b-0 lg:border-r">
              <Calendar blocked={blocked} checkIn={checkIn} checkOut={checkOut} onDayClick={handleDayClick} view={view} onShift={shiftMonth} />

              <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-ink/55">
                <span className="inline-flex items-center gap-1.5"><span className="h-3 w-3 rounded-md bg-full/90" /> Sudah dipesan</span>
                <span className="inline-flex items-center gap-1.5"><span className="h-3 w-3 rounded-md bg-primary-600" /> Pilihan Anda</span>
                <span className="inline-flex items-center gap-1.5"><span className="h-3 w-3 rounded-md border border-warm-dark bg-warm/25" /> Libur nasional (+50%)</span>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-ink/45">Cepat pilih</span>
                <button type="button" onClick={() => quickPick("weekend")} className={quickBtn}>Akhir pekan</button>
                <button type="button" onClick={() => quickPick("3malam")} className={quickBtn}>3 malam</button>
                <button type="button" onClick={() => quickPick("reset")} className={quickBtn}>Reset</button>
              </div>

              {price && (
                <div className="mt-5 flex items-center gap-3 rounded-2xl border border-primary-200 bg-primary-50 px-4 py-3 text-sm text-primary-800">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary-600 text-cream"><CalendarCheck className="h-[18px] w-[18px]" /></span>
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-primary-600">Check-in → Check-out</p>
                    <p className="truncate font-semibold text-primary-900">{fmtShort(checkIn)} → {fmtShort(checkOut)}</p>
                  </div>
                  <button type="button" aria-label="Hapus tanggal" onClick={() => quickPick("reset")} className="ml-auto grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-primary-200 bg-white text-primary-700 transition hover:bg-primary-100">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Kolom kanan: form + harga */}
            <div className="flex flex-col gap-5 p-5 sm:p-7">
              <div className="space-y-4">
                <div>
                  <label htmlFor="guestName" className={labelCls}>Nama Tamu</label>
                  <input
                    id="guestName" type="text" autoComplete="name" placeholder="Contoh: Rina Andayani"
                    value={name}
                    onChange={(e) => { setName(e.target.value); if (e.target.value.trim()) setErrors((x) => ({ ...x, name: "" })); }}
                    className={`${inputCls} ${errors.name ? "border-full ring-4 ring-full/10" : "border-ink/10"}`}
                  />
                  {errors.name && <p className="mt-1 text-xs font-medium text-full">{errors.name}</p>}
                </div>

                <div>
                  <label htmlFor="guestEmail" className={labelCls}>Email</label>
                  <input
                    id="guestEmail" type="email" autoComplete="email" placeholder="nama@email.com"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); if (EMAIL_RE.test(e.target.value.trim())) setErrors((x) => ({ ...x, email: "" })); }}
                    className={`${inputCls} ${errors.email ? "border-full ring-4 ring-full/10" : "border-ink/10"}`}
                  />
                  {errors.email && <p className="mt-1 text-xs font-medium text-full">{errors.email}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="guestCount" className={labelCls}>Jumlah Tamu</label>
                    <select id="guestCount" value={guests} onChange={(e) => setGuests(Number(e.target.value))} className={`${inputCls} border-ink/10`}>
                      {Array.from({ length: room.maxGuests }, (_, i) => i + 1).map((n) => (
                        <option key={n} value={n}>{n} tamu</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="guestNight" className={labelCls}>Malam</label>
                    <input id="guestNight" type="text" readOnly value={price ? `${price.nights} malam` : "—"} className="w-full rounded-xl border border-ink/10 bg-primary-50 px-4 py-3 text-sm font-semibold text-primary-800" />
                  </div>
                </div>

                <div>
                  <label htmlFor="guestNote" className={labelCls}>Catatan <span className="font-medium normal-case text-ink/35">(opsional)</span></label>
                  <textarea
                    id="guestNote" rows={3} value={note} onChange={(e) => setNote(e.target.value)}
                    placeholder="Jam datang, kebutuhan khusus, atau permintaan tambahan…"
                    className={`${inputCls} resize-none border-ink/10`}
                  />
                </div>
              </div>

              <PricePanel room={room} price={price} />

              <button type="button" onClick={openPayment} disabled={!canPay} className="btn-primary mt-auto inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary-600 px-5 py-3.5 font-semibold text-cream shadow-soft">
                <CreditCard className="h-[18px] w-[18px]" /> Lanjut Bayar DP
              </button>
            </div>
          </div>
        </div>
      </div>

      {showPay && price && (
        <PaymentModal
          room={room}
          checkIn={checkIn}
          checkOut={checkOut}
          price={price}
          guestName={name.trim()}
          guestCount={guests}
          onClose={closePay}
          onSubmit={handlePaid}
        />
      )}
    </>
  );
}
