import { TentTree, AtSign, MessageCircle, Mail, MapPin, Phone, ShieldCheck } from "lucide-react";

export default function Footer() {
  return (
    <footer id="kontak" className="border-t border-ink/5 bg-primary-900 py-14 text-cream/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-cream/10 text-cream"><TentTree className="h-5 w-5" /></span>
              <span className="font-head text-lg font-extrabold tracking-tight text-cream">NginapLangsung</span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-cream/65">
              Platform pemesanan penginapan langsung milik warga lokal Bali. Harga dan ketersediaan diambil langsung dari pemilik.
            </p>
            <div className="mt-5 flex gap-2">
              {[{ Icon: AtSign, label: "Instagram" }, { Icon: MessageCircle, label: "WhatsApp" }, { Icon: Mail, label: "Email" }].map(({ Icon, label }) => (
                <a key={label} href="#" aria-label={label} className="grid h-10 w-10 place-items-center rounded-xl border border-cream/15 text-cream/70 transition hover:bg-cream/10 hover:text-cream">
                  <Icon className="h-[18px] w-[18px]" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-head text-sm font-bold uppercase tracking-wider text-cream">Navigasi</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li><a href="#beranda" className="transition hover:text-cream">Beranda</a></li>
              <li><a href="#booking" className="transition hover:text-cream">Kamar</a></li>
              <li><a href="#fasilitas" className="transition hover:text-cream">Fasilitas</a></li>
              <li><a href="#riwayat" className="transition hover:text-cream">Riwayat Booking</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-head text-sm font-bold uppercase tracking-wider text-cream">Hubungi Kami</h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex gap-2.5"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary-300" /><span>Jl. Raya Ubud No. 88, Bali</span></li>
              <li className="flex gap-2.5"><Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary-300" /><span>+62 812 3456 7890</span></li>
              <li className="flex gap-2.5"><Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary-300" /><span>halo@nginaplangsung.id</span></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-cream/10 pt-6 text-xs text-cream/50 sm:flex-row">
          <p>&copy; {new Date().getFullYear()} NginapLangsung. Prototipe demo — seluruh data pembayaran bersifat simulasi.</p>
          <p className="flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5" /> Tidak ada transaksi uang sungguhan</p>
        </div>
      </div>
    </footer>
  );
}
