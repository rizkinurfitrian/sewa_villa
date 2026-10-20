import { useState, useEffect, useRef } from "react";
import { X, CircleCheck, FlaskConical, Upload, Trash2, Image as ImageIcon } from "lucide-react";
import { PAY_METHODS } from "../data/constants";
import { rupiah } from "../utils/format";
import { fmtShort } from "../utils/date";
import { compressProof, isImageFile, MAX_PROOF_BYTES } from "../utils/image";

export default function PaymentModal({ room, checkIn, checkOut, price, guestName, guestCount, onClose, onSubmit }) {
  const [method, setMethod] = useState("bca");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [proof, setProof] = useState(null);
  const [proofName, setProofName] = useState("");
  const [proofError, setProofError] = useState("");
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef(null);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && !processing && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, processing]);

  const handleFile = async (file) => {
    if (!file) return;
    if (!isImageFile(file)) {
      setProofError("Berkas harus berupa gambar (JPG, PNG, atau screenshot).");
      return;
    }
    if (file.size > MAX_PROOF_BYTES) {
      setProofError("Ukuran gambar maksimal 5 MB.");
      return;
    }
    try {
      setProofError("");
      const data = await compressProof(file);
      setProof(data);
      setProofName(file.name || "bukti-transfer.jpg");
    } catch (err) {
      setProofError(err.message || "Gagal memuat gambar.");
    }
  };

  const clearProof = () => {
    setProof(null);
    setProofName("");
    setProofError("");
    if (fileRef.current) fileRef.current.value = "";
  };

  const confirm = async () => {
    if (processing || !proof) return;
    setProcessing(true);
    setError("");
    try {
      await onSubmit(method, proof);
      // Sukses: induk (BookingModal) akan menutup modal & menampilkan toast.
    } catch (e) {
      setError(e.message || "Pembayaran gagal. Silakan coba lagi.");
      setProcessing(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-ink/55 backdrop-blur-sm sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="payTitle"
      onMouseDown={(e) => e.target === e.currentTarget && !processing && onClose()}
    >
      <div className="modal-panel max-h-[95vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-cream shadow-lift sm:rounded-3xl">
        <div className="flex items-start justify-between gap-4 border-b border-ink/5 bg-white px-5 py-4 sm:px-6">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-warm-dark">Langkah 2 dari 2</p>
            <h3 id="payTitle" className="font-head text-lg font-extrabold text-primary-900">Pembayaran DP</h3>
          </div>
          <button type="button" aria-label="Tutup" onClick={onClose} disabled={processing} className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-ink/10 bg-cream text-ink/60 transition hover:bg-ink/5 hover:text-ink">
            <X className="h-[18px] w-[18px]" />
          </button>
        </div>

        <div className="p-5 sm:p-6">
          <div className="overflow-hidden rounded-2xl border border-ink/10 bg-white">
            <div className="img-fallback relative h-32 bg-primary-200">
              <img src={room.img} alt={room.name} className="h-full w-full object-cover" onError={(e) => e.currentTarget.classList.add("hidden")} />
              <div className="absolute inset-0 bg-gradient-to-t from-primary-900/75 to-transparent" />
              <div className="absolute inset-x-4 bottom-3">
                <p className="font-head text-base font-bold text-cream">{room.name}</p>
                <p className="text-xs text-cream/80">{fmtShort(checkIn)} → {fmtShort(checkOut)} · {price.nights} malam</p>
              </div>
            </div>
            <dl className="divide-y divide-ink/5 text-sm">
              <div className="flex items-center justify-between gap-3 px-4 py-3"><dt className="text-ink/60">Atas nama</dt><dd className="truncate font-medium text-ink">{guestName}</dd></div>
              <div className="flex items-center justify-between gap-3 px-4 py-3"><dt className="text-ink/60">Jumlah tamu</dt><dd className="font-medium text-ink">{guestCount} tamu</dd></div>
              <div className="flex items-center justify-between gap-3 px-4 py-3"><dt className="text-ink/60">Total stay</dt><dd className="font-medium text-ink">{rupiah(price.total)}</dd></div>
              <div className="flex items-center justify-between gap-3 bg-primary-50 px-4 py-3.5">
                <dt className="font-semibold text-primary-800">DP 30% (dibayar sekarang)</dt>
                <dd className="font-head text-lg font-extrabold text-primary-800">{rupiah(price.dp)}</dd>
              </div>
            </dl>
          </div>

          <p className="mb-2.5 mt-5 text-xs font-bold uppercase tracking-wider text-ink/55">Metode Pembayaran</p>
          <div className="space-y-2.5">
            {PAY_METHODS.map(({ id, label, desc, icon: Icon }) => {
              const on = method === id;
              return (
                <label key={id} className={`flex cursor-pointer items-center gap-3.5 rounded-2xl border px-4 py-3.5 transition ${on ? "border-primary-500 bg-primary-50 ring-4 ring-primary-100" : "border-ink/10 bg-white hover:border-primary-300"}`}>
                  <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${on ? "bg-primary-600 text-cream" : "bg-primary-50 text-primary-600"}`}>
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-ink">{label}</span>
                    <span className="block truncate text-xs text-ink/55">{desc}</span>
                  </span>
                  <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 ${on ? "border-primary-600" : "border-ink/20"}`}>
                    <span className={`h-2 w-2 rounded-full ${on ? "bg-primary-600" : "bg-transparent"}`} />
                  </span>
                  <input type="radio" name="method" value={id} checked={on} onChange={() => setMethod(id)} className="sr-only" />
                </label>
              );
            })}
          </div>

          <p className="mb-2.5 mt-5 text-xs font-bold uppercase tracking-wider text-ink/55">Bukti Transfer</p>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />

          {proof ? (
            <div className="overflow-hidden rounded-2xl border border-primary-200 bg-white">
              <div className="img-fallback relative max-h-52 bg-primary-100">
                <img src={proof} alt="Bukti transfer" className="max-h-52 w-full object-contain" />
                <button
                  type="button"
                  aria-label="Hapus bukti transfer"
                  onClick={clearProof}
                  disabled={processing}
                  className="absolute right-2 top-2 grid h-9 w-9 place-items-center rounded-xl border border-ink/10 bg-white/95 text-full shadow-soft transition hover:bg-full/10"
                >
                  <Trash2 className="h-[18px] w-[18px]" />
                </button>
              </div>
              <div className="flex items-center gap-2.5 border-t border-ink/5 px-4 py-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary-50 text-primary-600">
                  <ImageIcon className="h-[18px] w-[18px]" />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-ink">{proofName}</p>
                  <p className="text-xs text-primary-600">Screenshot siap dikirim ke admin.</p>
                </div>
              </div>
            </div>
          ) : (
            <>
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={(e) => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files?.[0]); }}
                className={`flex w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-4 py-6 text-center transition ${
                  dragging ? "border-primary-500 bg-primary-50" : "border-ink/20 bg-white hover:border-primary-300 hover:bg-primary-50/60"
                }`}
              >
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary-50 text-primary-600">
                  <Upload className="h-5 w-5" />
                </span>
                <span className="text-sm font-semibold text-ink">Unggah screenshot bukti transfer</span>
                <span className="text-xs text-ink/55">Klik atau seret gambar ke sini (JPG/PNG, maks 5 MB)</span>
              </button>
              <p className="mt-2 text-[11px] leading-relaxed text-ink/50">
                Konfirmasi pembayaran hanya aktif setelah bukti transfer diunggah.
              </p>
            </>
          )}
          {proofError && <p className="mt-2 text-xs font-medium text-full">{proofError}</p>}

          <div className="mt-4 flex items-start gap-2 rounded-xl bg-warm/15 px-3.5 py-3 text-[11px] leading-relaxed text-warm-dark">
            <FlaskConical className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            Booking dan bukti transfer dikirim ke server. Admin akan memverifikasi pembayaran Anda.
          </div>

          {error && (
            <p className="mt-3 rounded-xl bg-full/10 px-3.5 py-2.5 text-xs font-medium text-full">{error}</p>
          )}

          <button type="button" onClick={confirm} disabled={processing || !proof} className="btn-primary mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-warm px-5 py-3.5 font-semibold text-primary-900 shadow-soft">
            {processing ? (
              <span className="inline-flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-900/30 border-t-primary-900" /> Memproses pembayaran…
              </span>
            ) : (
              <>
                <CircleCheck className="h-[18px] w-[18px]" /> Konfirmasi Pembayaran
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
