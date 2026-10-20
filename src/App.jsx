import { useState, useCallback, useEffect } from "react";
import { useToast } from "./hooks/useToast";
import { useHashRoute } from "./hooks/useHashRoute";
import { useMyBookings } from "./hooks/useMyBookings";
import { api } from "./api";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import RoomList from "./components/RoomList";
import Facilities from "./components/Facilities";
import BookingHistory from "./components/BookingHistory";
import Footer from "./components/Footer";
import BookingModal from "./components/BookingModal";
import AdminPage from "./components/AdminPage";
import ToastContainer from "./components/Toast";

const fetchRoomsAndBlocked = () => Promise.all([api.listRooms(), api.availability()]);

export default function App() {
  const [rooms, setRooms] = useState([]);
  const [blocked, setBlocked] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const { toasts, toast } = useToast();
  const route = useHashRoute();
  const { bookings: myBookings, addBooking } = useMyBookings();

  const isAdmin = route === "admin";

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [isAdmin]);

  useEffect(() => {
    let active = true;
    fetchRoomsAndBlocked()
      .then(([roomList, avail]) => {
        if (!active) return;
        setRooms(roomList || []);
        setBlocked((avail && avail.blocked) || {});
      })
      .catch(() => {
        if (active) toast("Gagal memuat data dari server. Pastikan API berjalan.", "error");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [toast]);

  const loadData = useCallback(() => {
    return fetchRoomsAndBlocked()
      .then(([roomList, avail]) => {
        setRooms(roomList || []);
        setBlocked((avail && avail.blocked) || {});
      })
      .catch(() => {
        toast("Gagal memuat data dari server. Pastikan API berjalan.", "error");
      });
  }, [toast]);

  const closeModal = useCallback(() => setSelectedRoom(null), []);

  const exitAdmin = useCallback(() => {
    window.location.hash = "";
  }, []);

  const handleConfirmed = (booking) => {
    addBooking(booking);
    setSelectedRoom(null);
    loadData();
    toast(`Pembayaran diterima. Booking ${booking.roomName} menunggu konfirmasi admin.`, "success");
    setTimeout(() => document.getElementById("riwayat")?.scrollIntoView({ behavior: "smooth", block: "start" }), 500);
  };

  if (isAdmin) {
    return (
      <>
        <AdminPage toast={toast} onExit={exitAdmin} onChanged={loadData} />
        <ToastContainer toasts={toasts} />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <Hero />
      <RoomList rooms={rooms} loading={loading} onSelect={setSelectedRoom} />
      <Facilities />
      <BookingHistory bookings={myBookings} loading={loading} />
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
