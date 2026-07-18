import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Sahifalarni import qilish
import Register from "./pages/registrer/Register";
import Login from "./pages/login/Login";
import UserDash from "./pages/user/userDash/UserDash"; 
import AdminDashboard from "./pages/admin/admindash/AdminDash"; 
import MasterDetail from "./pages/admin/userdetals/UserDestals";

// Himoyalangan marshrut komponenti
import ProtectedRoute from "./components/protectedRoute/ProtectedRoute";

// AppInitializer komponenti
import AppInitializer from "./components/appI";

function App() {
  // 1. Global til holati (Dastlab `localStorage`dan tekshiradi, bo'lmasa default 'uz')
  const [lang, setLang] = useState(() => {
    return localStorage.getItem("app_lang") || "uz";
  });

  // 2. Tilni o'zgartirish funksiyasi
  const changeLanguage = (newLang) => {
    setLang(newLang);
    localStorage.setItem("app_lang", newLang); // Tanlangan tilni saqlab qo'yamiz
  };

  return (
    <>
      {/* ToastContainer bildirishnomalari uchun */}
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable
      />

      <Routes>
        {/* ENG ASOSIY LINK: Kirganda foydalanuvchini tekshiruvchi nuqta */}
        <Route path="/" element={<AppInitializer lang={lang} changeLanguage={changeLanguage} />} />

        {/* Ochiq sahifalar (Tillar props sifatida uzatildi) */}
        <Route path="/login" element={<Login lang={lang} changeLanguage={changeLanguage} />} />
        <Route path="/register" element={<Register lang={lang} changeLanguage={changeLanguage} />} />

        {/* USER DASHBOARD */}
        <Route
          path="/user-dashboard"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <UserDash lang={lang} changeLanguage={changeLanguage} />
            </ProtectedRoute>
          }
        />

        {/* ADMIN DASHBOARD */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard lang={lang} changeLanguage={changeLanguage} />
            </ProtectedRoute>
          }
        />

        {/* YANGI MARSHRUT (Admin profili yoki ma'lumotlar boshqaruvi uchun) */}
        <Route
          path="/admin/master/:id"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <MasterDetail lang={lang} changeLanguage={changeLanguage} />
            </ProtectedRoute>
          }
        />

        {/* Qolgan barcha kutilmagan linklarda xavfsiz yo'naltirish */}
        <Route path="*" element={<RoleBasedRedirect />} />
      </Routes>
    </>
  );
}

// Rollarga qarab xavfsiz yo'naltiruvchi yordamchi komponent
function RoleBasedRedirect() {
  try {
    const userString = localStorage.getItem("user");
    if (userString) {
      const user = JSON.parse(userString);
      if (user?.role === "admin" || user?.role === "Admin") {
        return <Navigate to="/admin-dashboard" replace />;
      }
      return <Navigate to="/user-dashboard" replace />;
    }
  } catch (e) {
    console.error("Redirectda xatolik:", e);
  }
  
  // Agar foydalanuvchi umuman tizimga kirmagan bo'lsa, oq ekransiz to'g'ri bosh sahifaga o'tkazadi
  return <Navigate to="/" replace />;
}

export default App;