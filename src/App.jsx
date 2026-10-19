import { useState, useMemo, useCallback, useEffect } from "react";
import { STORAGE_KEY } from "./data/constants";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { useToast } from "./hooks/useToast";
import { useHashRoute } from "./hooks/useHashRoute";
import { buildBlocked } from "./utils/blocked";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import RoomList from "./components/RoomList";
import Facilities from "./components/Facilities";
import BookingHistory from "./components/BookingHistory";
import Footer from "./components/Footer";
import BookingModal from "./components/BookingModal";
import AdminPage from "./components/AdminPage";
import ToastContainer from "./components/Toast";

export default function App() {
  const [bookings, setBookings] = useLocalStorage(STORAGE_KEY, []);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const { toasts, toast } = useToast();
  const route = useHashRoute();
  const blocked = useMemo(() => buildBlocked(bookings), [bookings]);

  const isAdmin = route === "admin";

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [isAdmin]);

  const closeModal = useCallback(() => setSelectedRoom(null), []);

  const exitAdmin = useCallback(() => {
    window.location.hash = "";
  }, []);

  const handleConfirmed = (booking) => {
    setBookings((prev) => [booking, ...prev]);
    setSelectedRoom(null);
    toast(`Pembayaran diterima. Booking ${booking.roomName} menunggu konfirmasi admin.`, "success");
    setTimeout(() => document.getElementById("riwayat")?.scrollIntoView({ behavior: "smooth", block: "start" }), 500);
  };

  if (isAdmin) {
    return (
      <>
        <AdminPage bookings={bookings} setBookings={setBookings} toast={toast} onExit={exitAdmin} />
        <ToastContainer toasts={toasts} />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <Hero />
      <RoomList onSelect={setSelectedRoom} />
      <Facilities />
      <BookingHistory bookings={bookings} />
      <Footer />

      {selectedRoom && (
        <BookingModal
          key={selectedRoom.id}
          room={selectedRoom}
          blocked={blocked[selectedRoom.id] || {}}
          onClose={closeModal}
          onConfirmed={handleConfirmed}
          toast={toast}
        />
      )}

      <ToastContainer toasts={toasts} />
    </>
  );
}
