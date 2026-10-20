import { useMemo, useState, useEffect, useCallback } from "react";
import {
  ArrowLeft,
  CalendarDays,
  CircleCheck,
  Clock3,
  CreditCard,
  Eye,
  EyeOff,
  LogOut,
  Lock,
  Mail,
  Search,
  ShieldCheck,
  TentTree,
  Trash2,
  User,
  X,
} from "lucide-react";
import {
  STATUS_BADGE,
  STATUS_CONFIRMED,
  STATUS_PENDING,
} from "../data/constants";
import { rupiah } from "../utils/format";
import { fmtShort, parseKey } from "../utils/date";
import { api, getToken, setToken } from "../api";

const FILTERS = [
  { id: "all", label: "Semua" },
  { id: STATUS_PENDING, label: "Menunggu Konfirmasi" },
  { id: STATUS_CONFIRMED, label: "DP Lunas" },
];

const inputCls =
  "w-full rounded-xl border border-ink/10 bg-white px-4 py-3 text-sm text-ink outline-none transition placeholder:text-ink/30 focus:border-primary-400 focus:ring-4 focus:ring-primary-100";

function StatusBadge({ status }) {
  const cls = STATUS_BADGE[status] || "bg-ink/10 text-ink/60 ring-ink/10";
  return (
    <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ring-1 ${cls}`}>
      {status === STATUS_CONFIRMED ? <CircleCheck className="h-3.5 w-3.5" /> : <Clock3 className="h-3.5 w-3.5" />}
      {status}
    </span>
  );
}

function Login({ onLogin, onExit }) {
  const [email, setEmail] = useState("admin@nginaplangsung.test");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      const { token } = await api.login(email.trim(), password);
      setToken(token);
      setPassword("");
      onLogin();
    } catch (err) {
      const first = err.errors && Object.values(err.errors)[0];
      setError(first || err.message || "Login gagal. Coba lagi.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-4 py-14">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -right-32 -top-40 h-[28rem] w-[28rem] rounded-full bg-primary-100/70 blur-3xl"></div>
        <div className="absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-warm/20 blur-3xl"></div>
      </div>

      <div className="w-full max-w-md">
        <div className="flex items-center gap-2.5">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary-600 text-cream shadow-soft">
            <TentTree className="h-5 w-5" />
          </span>
          <span className="font-head text-lg font-extrabold tracking-tight text-primary-800">NginapLangsung</span>
        </div>

        <form onSubmit={submit} className="card-lift mt-6 rounded-3xl border border-ink/5 bg-white p-7 shadow-lift">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary-50 text-primary-600">
            <ShieldCheck className="h-6 w-6" />
          </span>
          <h1 className="mt-4 font-head text-2xl font-extrabold tracking-tight text-primary-900">Login Admin</h1>
          <p className="mt-1.5 text-sm leading-relaxed text-ink/60">
            Halaman khusus admin untuk konfirmasi pembayaran pelanggan dan penghapusan riwayat booking.
          </p>

          <label htmlFor="adminEmail" className="mb-1.5 mt-6 block text-xs font-bold uppercase tracking-wider text-ink/55">
            Email Admin
          </label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/35" />
            <input
              id="adminEmail"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(""); }}
              placeholder="admin@domain.com"
              className={`${inputCls} pl-10`}
            />
          </div>

          <label htmlFor="adminPass" className="mb-1.5 mt-4 block text-xs font-bold uppercase tracking-wider text-ink/55">
            Password Admin
          </label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/35" />
            <input
              id="adminPass"
              type={show ? "text" : "password"}
              autoComplete="current-password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(""); }}
              placeholder="Masukkan password admin"
              className={`${inputCls} pl-10 pr-12 ${error ? "border-full ring-4 ring-full/10" : ""}`}
            />
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              aria-label={show ? "Sembunyikan password" : "Tampilkan password"}
              className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-lg text-ink/40 transition hover:bg-ink/5 hover:text-ink"
            >
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {error && <p className="mt-1.5 text-xs font-medium text-full">{error}</p>}

          <button type="submit" disabled={busy} className="btn-primary mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary-600 px-5 py-3.5 font-semibold text-cream shadow-soft disabled:opacity-60">
            {busy ? (
              <span className="inline-flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-cream/30 border-t-cream" /> Memeriksa…
              </span>
            ) : (
              <>
                <Lock className="h-[18px] w-[18px]" /> Masuk sebagai Admin
              </>
            )}
          </button>

          <button type="button" onClick={onExit} className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-ink/55 transition hover:text-primary-700">
            <ArrowLeft className="h-4 w-4" /> Kembali ke halaman utama
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-ink/45">Akses hanya untuk tim pengelola vila.</p>
      </div>
    </div>
  );
}

function Stat({ icon: Icon, label, value, tone }) {
  return (
    <div className="card-lift rounded-2xl border border-ink/5 bg-white p-5 shadow-lg shadow-emerald-900/5">
      <span className={`grid h-10 w-10 place-items-center rounded-xl ${tone}`}>
        <Icon className="h-5 w-5" />
      </span>
      <p className="mt-3.5 font-head text-2xl font-extrabold tracking-tight text-primary-900">{value}</p>
      <p className="mt-0.5 text-xs font-medium text-ink/55">{label}</p>
    </div>
  );
}

export default function AdminPage({ toast, onExit, onChanged }) {
  const [authed, setAuthed] = useState(() => !!getToken());
  const [bookings, setBookings] = useState({ list: [], stats: { total: 0, pending: 0, confirmed: 0, income: 0 } });
  const [loading, setLoading] = useState(() => !!getToken());
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [proofView, setProofView] = useState(null);

  const applyData = useCallback((list, stats) => {
    setBookings({ list: list || [], stats: stats || { total: 0, pending: 0, confirmed: 0, income: 0 } });
  }, []);

  const handleError = useCallback((err) => {
    if (err.status === 401) {
      setToken(null);
      setAuthed(false);
      toast("Sesi admin berakhir. Silakan login kembali.", "error");
    } else {
      toast(err.message || "Gagal memuat data booking.", "error");
    }
  }, [toast]);

  useEffect(() => {
    if (!authed) return;
    let active = true;
    Promise.all([api.adminList(), api.adminStats()])
      .then(([list, stats]) => {
        if (active) applyData(list, stats);
      })
      .catch((err) => {
        if (active) handleError(err);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [authed, applyData, handleError]);

  const loadData = useCallback(() => {
    return Promise.all([api.adminList(), api.adminStats()])
      .then(([list, stats]) => {
        applyData(list, stats);
      })
      .catch((err) => {
        handleError(err);
      });
  }, [applyData, handleError]);

  const stats = bookings.stats;
  const list = useMemo(() => bookings.list || [], [bookings.list]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return list.filter((b) => {
      const matchFilter = filter === "all" || (b.status || STATUS_PENDING) === filter;
      const matchQuery =
        !q ||
        String(b.kode || "").toLowerCase().includes(q) ||
        String(b.nama || "").toLowerCase().includes(q) ||
        String(b.email || "").toLowerCase().includes(q) ||
        String(b.roomName || "").toLowerCase().includes(q);
      return matchFilter && matchQuery;
    });
  }, [list, filter, query]);

  const logout = async () => {
    try {
      await api.logout();
    } catch {
      // token mungkin sudah kedaluwarsa; abaikan
    }
    setToken(null);
    setAuthed(false);
    setBookings({ list: [], stats: { total: 0, pending: 0, confirmed: 0, income: 0 } });
    setQuery("");
    setFilter("all");
    toast("Anda telah keluar dari panel admin.", "info");
  };

  const confirmPayment = async (b) => {
    try {
      await api.adminConfirm(b.id);
      toast(`Pembayaran booking ${b.kode} berhasil dikonfirmasi.`, "success");
      loadData();
      onChanged?.();
    } catch (err) {
      toast(err.message || "Gagal mengonfirmasi pembayaran.", "error");
    }
  };

  const removeBooking = async (b) => {
    if (!window.confirm(`Hapus booking ${b.kode} dari riwayat? Tindakan ini tidak bisa dibatalkan.`)) return;
    try {
      await api.adminDelete(b.id);
      toast(`Booking ${b.kode} dihapus dari riwayat.`, "info");
      loadData();
      onChanged?.();
    } catch (err) {
      toast(err.message || "Gagal menghapus booking.", "error");
    }
  };

  const clearAll = async () => {
    if (list.length === 0) return;
    if (!window.confirm(`Hapus SEMUA ${list.length} riwayat booking? Tindakan ini tidak bisa dibatalkan.`)) return;
    try {
      await api.adminClear();
      toast("Seluruh riwayat booking berhasil dihapus.", "info");
      loadData();
      onChanged?.();
    } catch (err) {
      toast(err.message || "Gagal menghapus riwayat.", "error");
    }
  };

  useEffect(() => {
    if (!proofView) return;
    const onKey = (e) => e.key === "Escape" && setProofView(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [proofView]);

  if (!authed) return <Login onLogin={() => setAuthed(true)} onExit={onExit} />;

  return (
    <div className="min-h-screen bg-cream pb-20">
      <header className="sticky top-0 z-30 border-b border-ink/5 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-3.5 sm:px-6">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary-600 text-cream shadow-soft">
            <TentTree className="h-5 w-5" />
          </span>
          <div className="mr-auto min-w-0">
            <p className="font-head text-base font-extrabold leading-tight tracking-tight text-primary-900">Panel Admin</p>
            <p className="truncate text-xs text-ink/55">Konfirmasi pembayaran &amp; kelola riwayat booking</p>
          </div>
          <button type="button" onClick={onExit} className="inline-flex items-center gap-2 rounded-xl border border-ink/10 bg-white px-3.5 py-2.5 text-sm font-semibold text-ink/70 transition hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700">
            <ArrowLeft className="h-4 w-4" /> Halaman Utama
          </button>
          <button type="button" onClick={logout} className="inline-flex items-center gap-2 rounded-xl border border-full/30 bg-full/5 px-3.5 py-2.5 text-sm font-semibold text-full transition hover:bg-full/10">
            <LogOut className="h-4 w-4" /> Keluar
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pt-8 sm:px-6">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Stat icon={CalendarDays} label="Total booking" value={stats.total} tone="bg-primary-50 text-primary-600" />
          <Stat icon={Clock3} label="Menunggu konfirmasi" value={stats.pending} tone="bg-warm/20 text-warm-dark" />
          <Stat icon={CircleCheck} label="Pembayaran dikonfirmasi" value={stats.confirmed} tone="bg-primary-100 text-primary-700" />
          <Stat icon={CreditCard} label="Total DP masuk" value={rupiah(stats.income)} tone="bg-primary-600 text-cream" />
        </div>

        <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((f) => {
              const on = filter === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFilter(f.id)}
                  className={`rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${
                    on
                      ? "border-primary-600 bg-primary-600 text-cream shadow-soft"
                      : "border-ink/10 bg-white text-ink/65 hover:border-primary-300 hover:text-primary-700"
                  }`}
                >
                  {f.label}
                </button>
              );
            })}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative sm:w-72">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/35" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari kode, nama, atau email"
                className={`${inputCls} py-2.5 pl-10`}
              />
            </div>
            <button
              type="button"
              onClick={clearAll}
              disabled={list.length === 0}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-full/30 bg-full/5 px-4 py-2.5 text-sm font-semibold text-full transition hover:bg-full/10 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Trash2 className="h-4 w-4" /> Hapus Semua Riwayat
            </button>
          </div>
        </div>

        <div className="mt-6">
          {loading && list.length === 0 ? (
            <div className="space-y-4">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="overflow-hidden rounded-2xl border border-ink/5 bg-white p-5 shadow-lg shadow-emerald-900/5">
                  <div className="flex animate-pulse gap-4">
                    <div className="h-28 w-40 shrink-0 rounded-xl bg-primary-100" />
                    <div className="flex-1 space-y-2 py-1">
                      <div className="h-4 w-1/3 rounded bg-primary-100" />
                      <div className="h-3 w-1/2 rounded bg-primary-50" />
                      <div className="h-3 w-2/3 rounded bg-primary-50" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : visible.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-ink/15 bg-white/70 px-6 py-16 text-center shadow-lg shadow-emerald-900/5">
              <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-primary-50 text-primary-500">
                <Search className="h-7 w-7" />
              </span>
              <h3 className="mt-5 font-head text-lg font-bold text-primary-900">
                {list.length === 0 ? "Belum ada booking masuk" : "Tidak ada booking yang cocok"}
              </h3>
              <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ink/60">
                {list.length === 0
                  ? "Booking dari pelanggan akan otomatis muncul di sini setelah pembayaran DP."
                  : "Coba ubah kata kunci pencarian atau filter status."}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {visible.map((b) => {
                const status = b.status || STATUS_PENDING;
                return (
                  <article key={b.kode} className="card-lift overflow-hidden rounded-2xl border border-ink/5 bg-white shadow-lg shadow-emerald-900/5">
                    <div className="flex flex-col gap-4 p-5 lg:flex-row">
                      <div className="img-fallback h-32 w-full shrink-0 overflow-hidden rounded-xl bg-primary-200 lg:h-28 lg:w-40">
                        <img src={b.roomImg} alt="" className="h-full w-full object-cover" onError={(e) => e.currentTarget.classList.add("hidden")} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-[11px] font-bold uppercase tracking-wider text-ink/45">Kode {b.kode}</span>
                              <StatusBadge status={status} />
                            </div>
                            <h3 className="mt-1 truncate font-head text-base font-bold text-primary-900">{b.roomName}</h3>
                            <p className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink/55">
                              <span className="inline-flex items-center gap-1.5"><User className="h-3.5 w-3.5" />{b.nama}</span>
                              <span className="inline-flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" />{b.email}</span>
                              <span className="inline-flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5" />{fmtShort(parseKey(b.checkIn))} - {fmtShort(parseKey(b.checkOut))} ({b.nights} malam)</span>
                            </p>
                          </div>

                          <div className="text-right">
                            <p className="text-[11px] font-semibold uppercase tracking-wider text-ink/45">DP 30%</p>
                            <p className="font-head text-lg font-extrabold text-primary-800">{rupiah(b.dp)}</p>
                            <p className="text-xs text-ink/50">dari {rupiah(b.total)}</p>
                          </div>
                        </div>

                        <div className="mt-3.5 flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-dashed border-ink/10 pt-3 text-xs text-ink/60">
                          <span className="inline-flex items-center gap-1.5"><CreditCard className="h-3.5 w-3.5 text-primary-500" />{b.metode}</span>
                          <span className="inline-flex items-center gap-1.5"><User className="h-3.5 w-3.5 text-primary-500" />{b.tamu} tamu</span>
                          {b.catatan && <span className="inline-flex min-w-0 items-center gap-1.5"><span className="text-primary-500">Catatan:</span> <span className="truncate">{b.catatan}</span></span>}
                          <span className="ml-auto inline-flex items-center gap-1.5 text-ink/40">
                            Dibuat {b.dibuat ? new Date(b.dibuat).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : "-"}
                          </span>
                        </div>

                        <div className="mt-4 flex flex-wrap items-center gap-2.5">
                          {b.buktiTransfer ? (
                            <button
                              type="button"
                              onClick={() => setProofView({ src: b.buktiTransfer, kode: b.kode, nama: b.nama })}
                              className="group inline-flex items-center gap-2.5 rounded-xl border border-primary-200 bg-primary-50 py-1.5 pl-1.5 pr-3.5 transition hover:border-primary-400"
                            >
                              <span className="img-fallback grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-lg bg-primary-200">
                                <img src={b.buktiTransfer} alt="Bukti transfer" className="h-full w-full object-cover" onError={(e) => e.currentTarget.classList.add("hidden")} />
                              </span>
                              <span className="text-left">
                                <span className="block text-[11px] font-semibold uppercase tracking-wider text-primary-600">Bukti Transfer</span>
                                <span className="block text-xs font-medium text-primary-800 group-hover:underline">Lihat screenshot</span>
                              </span>
                            </button>
                          ) : (
                            <span className="inline-flex items-center gap-2 rounded-xl border border-dashed border-ink/15 bg-ink/5 px-3.5 py-2.5 text-xs font-medium text-ink/45">
                              Bukti transfer belum diunggah
                            </span>
                          )}
                          {status !== STATUS_CONFIRMED ? (
                            <button
                              type="button"
                              onClick={() => confirmPayment(b)}
                              className="btn-primary inline-flex items-center gap-2 rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-semibold text-cream shadow-soft"
                            >
                              <CircleCheck className="h-4 w-4" /> Konfirmasi Pembayaran
                            </button>
                          ) : (
                            <span className="inline-flex items-center gap-2 rounded-xl bg-primary-50 px-4 py-2.5 text-xs font-semibold text-primary-700">
                              <ShieldCheck className="h-4 w-4" />
                              Dikonfirmasi {b.dikonfirmasi ? new Date(b.dikonfirmasi).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : ""}
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() => removeBooking(b)}
                            className="inline-flex items-center gap-2 rounded-xl border border-full/30 bg-full/5 px-4 py-2.5 text-sm font-semibold text-full transition hover:bg-full/10"
                          >
                            <Trash2 className="h-4 w-4" /> Hapus Booking
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>

        <p className="mt-8 text-center text-xs text-ink/45">
          Data booking tersimpan di server. Halaman admin tidak ditampilkan pada tampilan pelanggan.
        </p>
      </main>

      {proofView && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/70 p-4 backdrop-blur-sm sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label="Bukti transfer"
          onClick={() => setProofView(null)}
        >
          <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-lift" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between gap-4 border-b border-ink/5 px-5 py-3.5">
              <div className="min-w-0">
                <p className="text-[11px] font-bold uppercase tracking-wider text-primary-600">Bukti Transfer</p>
                <p className="truncate text-sm font-semibold text-primary-900">Kode {proofView.kode} · {proofView.nama}</p>
              </div>
              <button
                type="button"
                aria-label="Tutup"
                onClick={() => setProofView(null)}
                className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-ink/10 bg-white text-ink/60 transition hover:bg-ink/5 hover:text-ink"
              >
                <X className="h-[18px] w-[18px]" />
              </button>
            </div>
            <div className="grid max-h-[75vh] place-items-center overflow-auto bg-cream p-4">
              <img src={proofView.src} alt={`Bukti transfer booking ${proofView.kode}`} className="max-h-[70vh] w-auto max-w-full rounded-xl object-contain shadow-soft" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
