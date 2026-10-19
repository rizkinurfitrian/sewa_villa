import { useState, useEffect } from "react";
import { Menu, CalendarCheck, TentTree } from "lucide-react";

const LINKS = [
  { href: "#beranda", label: "Beranda" },
  { href: "#booking", label: "Kamar" },
  { href: "#fasilitas", label: "Fasilitas" },
  { href: "#kontak", label: "Kontak" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${
        scrolled ? "border-b border-ink/5 bg-cream/85 shadow-sm backdrop-blur-md" : ""
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className={`flex items-center justify-between gap-4 transition-all duration-300 ${scrolled ? "py-2.5" : "py-4"}`}>
          <a href="#beranda" className="group flex items-center gap-2.5">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary-600 text-cream shadow-soft transition-transform duration-300 group-hover:-rotate-6">
              <TentTree className="h-5 w-5" />
            </span>
            <span className="font-head text-lg font-extrabold tracking-tight text-primary-800">NginapLangsung</span>
          </a>

          <div className="hidden items-center gap-1 md:flex">
            {LINKS.map((l) => (
              <a key={l.href} href={l.href} className="rounded-lg px-3.5 py-2 text-sm font-medium text-ink/70 transition hover:bg-primary-50 hover:text-primary-700">
                {l.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <a href="#booking" className="btn-primary hidden items-center gap-2 rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-semibold text-cream shadow-soft sm:inline-flex">
              <CalendarCheck className="h-4 w-4" /> Pesan Sekarang
            </a>
            <button type="button" aria-label="Buka menu" onClick={() => setOpen(!open)} className="grid h-10 w-10 place-items-center rounded-xl border border-ink/10 bg-white/70 text-ink md:hidden">
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>

        {open && (
          <div className="pb-3 md:hidden">
            <div className="rounded-2xl border border-ink/10 bg-white/95 p-2 shadow-soft backdrop-blur">
              {LINKS.map((l) => (
                <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="block rounded-xl px-3 py-2.5 text-sm font-medium hover:bg-primary-50">
                  {l.label}
                </a>
              ))}
              <a href="#booking" onClick={() => setOpen(false)} className="mt-1 flex items-center justify-center gap-2 rounded-xl bg-primary-600 px-3 py-2.5 text-sm font-semibold text-cream">
                <CalendarCheck className="h-4 w-4" /> Pesan Sekarang
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
