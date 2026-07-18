import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, allowedRoles }) {
  const userString = localStorage.getItem("user");

  // 1. Agar foydalanuvchi tizimga kirmagan bo'lsa, uni '/register' ga yuboramiz
  // Bu cheksiz aylanib qolish (infinite loop) va oq ekranning oldini oladi
  if (!userString) {
    return <Navigate to="/register" replace />;
  }

  try {
    const user = JSON.parse(userString);

    // Agar xotiradagi user ma'lumotlari buzilgan yoki chala bo'lsa, tozalab registratsiyaga yuboramiz
    if (!user || !user.role) {
      localStorage.removeItem("user"); 
      return <Navigate to="/register" replace />;
    }

    // 2. Foydalanuvchining roli ruxsat etilgan rollar ro'yxatida borligini tekshiramiz
    if (allowedRoles && !allowedRoles.includes(user.role)) {
      // Agar ruxsat berilmagan sahifaga kirmoqchi bo'lsa, o'zining dashboardiga qaytaramiz
      if (user.role === "admin") {
        return <Navigate to="/admin-dashboard" replace />;
      }
      return <Navigate to="/user-dashboard" replace />;
    }

    return children;

  } catch (error) {
    console.error("ProtectedRoute JSON parse xatosi:", error);
    localStorage.removeItem("user");
    return <Navigate to="/register" replace />;
  }
}