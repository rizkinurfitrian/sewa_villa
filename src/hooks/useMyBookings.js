import { useState, useEffect, useCallback } from "react";
import { api } from "../api";

const KEY = "nginaplangsung.mybookings.v1";

function readCodes() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

async function fetchByCodes(codes) {
  if (codes.length === 0) return [];
  const results = await Promise.all(codes.map((k) => api.getBooking(k).catch(() => null)));
  return results.filter(Boolean);
}

// Menyimpan hanya daftar kode booking di perangkat; detail & status diambil dari API.
export function useMyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetchByCodes(readCodes())
      .then((list) => {
        if (active) setBookings(list);
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const addBooking = useCallback((booking) => {
    const codes = readCodes();
    const next = [booking.kode, ...codes.filter((k) => k !== booking.kode)].slice(0, 50);
    localStorage.setItem(KEY, JSON.stringify(next));
    setBookings((prev) => [booking, ...prev.filter((b) => b.kode !== booking.kode)]);
  }, []);

  return { bookings, loading, addBooking };
}
