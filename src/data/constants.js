import { Snowflake, Wifi, Coffee, Waves, Laptop, TreePine, Landmark, QrCode, FileText } from "lucide-react";

export const WEEKEND_RATE = 0.3;
export const HOLIDAY_RATE = 0.5;
export const DP_RATE = 0.3;

export const STATUS_PENDING = "Menunggu Konfirmasi";
export const STATUS_CONFIRMED = "DP Lunas";

export const STATUS_BADGE = {
  "Menunggu Konfirmasi": "bg-warm/25 text-warm-dark ring-warm/40",
  "DP Lunas": "bg-primary-100 text-primary-700 ring-primary-200",
};

export const MONTH_NAMES = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
export const DAY_NAMES = ["Minggu","Senin","Selasa","Rabu","Kamis","Jumat","Sabtu"];

export const HOLIDAYS = {
  "01-01": "Tahun Baru Masehi",
  "01-25": "Tahun Baru Imlek",
  "03-11": "Hari Raya Nyepi",
  "04-03": "Wafat Isa Almasih",
  "05-01": "Hari Buruh Internasional",
  "05-14": "Kenaikan Isa Almasih",
  "05-27": "Hari Raya Idul Fitri",
  "06-01": "Hari Lahir Pancasila",
  "06-25": "Tahun Baru Islam",
  "08-17": "Hari Kemerdekaan RI",
  "12-25": "Hari Raya Natal",
};

// Map amenity key (dikirim API) ke ikon lucide.
export const AMENITY_ICONS = {
  snowflake: Snowflake,
  wifi: Wifi,
  coffee: Coffee,
  waves: Waves,
  laptop: Laptop,
  "tree-pine": TreePine,
};

export const PAY_METHODS = [
  { id: "bca", label: "Transfer BCA", desc: "a.n. PT NginapLangsung · 872-0145-2098", icon: Landmark },
  { id: "qris", label: "QRIS", desc: "Pindai QR, bayar dari aplikasi apa pun", icon: QrCode },
  { id: "va", label: "Virtual Account", desc: "BCA VA 8808123456789 · terverifikasi otomatis", icon: FileText },
];

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
