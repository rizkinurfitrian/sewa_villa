import { Snowflake, Wifi, Coffee, Waves, Laptop, TreePine, Landmark, QrCode, FileText } from "lucide-react";

export const STORAGE_KEY = "nginaplangsung.bookings.v1";
export const WEEKEND_RATE = 0.3;
export const HOLIDAY_RATE = 0.5;
export const DP_RATE = 0.3;

export const ADMIN_PASSWORD = "admin123";
export const ADMIN_SESSION_KEY = "nginaplangsung.admin.session.v1";

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

export const ROOMS = [
  {
    id: "villa-padi",
    name: "Villa Padi View",
    tagline: "Balkon menghadap sawah, kolam privat",
    price: 750000,
    maxGuests: 2,
    size: "48 m²",
    bed: "1 King Bed",
    img: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=900&q=80",
    amenities: [
      { icon: Snowflake, label: "AC" },
      { icon: Wifi, label: "WiFi" },
      { icon: Coffee, label: "Sarapan" },
      { icon: Waves, label: "Kolam Privat" },
    ],
  },
  {
    id: "suite-kopi",
    name: "Suite Kopi Arabika",
    tagline: "Meja kerja, taman baca, dan suasana tenang",
    price: 550000,
    maxGuests: 3,
    size: "36 m²",
    bed: "1 Queen + 1 Single",
    img: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=900&q=80",
    amenities: [
      { icon: Snowflake, label: "AC" },
      { icon: Wifi, label: "WiFi" },
      { icon: Coffee, label: "Sarapan" },
      { icon: Laptop, label: "Meja Kerja" },
    ],
  },
  {
    id: "kamar-hutan",
    name: "Kamar Hutan Pinus",
    tagline: "Teras kayu di tepi hutan, udara segar",
    price: 450000,
    maxGuests: 2,
    size: "28 m²",
    bed: "1 Queen Bed",
    img: "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?auto=format&fit=crop&w=900&q=80",
    amenities: [
      { icon: Snowflake, label: "AC" },
      { icon: Wifi, label: "WiFi" },
      { icon: Coffee, label: "Sarapan" },
      { icon: TreePine, label: "Teras Hutan" },
    ],
  },
];

export const PAY_METHODS = [
  { id: "bca", label: "Transfer BCA", desc: "a.n. PT NginapLangsung · 872-0145-2098", icon: Landmark },
  { id: "qris", label: "QRIS", desc: "Pindai QR, bayar dari aplikasi apa pun", icon: QrCode },
  { id: "va", label: "Virtual Account", desc: "BCA VA 8808123456789 · terverifikasi otomatis", icon: FileText },
];

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
