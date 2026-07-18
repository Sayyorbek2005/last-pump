import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase/client"; // To'g'ri papkadan import qilinayotganiga ishonch hosil qiling

export default function AppInitializer() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initApp = async () => {
      try {
        // 1. Telegram WebApp obyektini xavfsiz olish
        const tg = window?.Telegram?.WebApp;
        const telegramId = tg?.initDataUnsafe?.user?.id 
          ? String(tg.initDataUnsafe.user.id) 
          : null;

        // 2. Mahalliy xotiradan (localStorage) tekshirish
        let localUser = null;
        try {
          const stored = localStorage.getItem("user");
          if (stored) {
            localUser = JSON.parse(stored);
          }
        } catch (e) {
          console.error("LocalStorage o'qishda xatolik:", e);
        }

        // Agar telefonda/brauzerda allaqachon to'liq ro'yxatdan o'tgan user bo'lsa, srazi dashboardga yuboramiz
        if (localUser && localUser.region && localUser.job) {
          if (localUser.role === "admin") {
            navigate("/admin-dashboard", { replace: true });
          } else {
            navigate("/user-dashboard", { replace: true });
          }
          return;
        }

        // 3. Agar xotirada bo'lmasa va Telegram orqali kirgan bo'lsa, bazadan tekshiramiz
        if (telegramId) {
          const { data: user, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("telegram_id", telegramId)
            .maybeSingle();

          if (error) {
            console.error("Supabase ma'lumot olishda xato:", error.message);
          }

          // Foydalanuvchi bazada bor bo'lsa va ma'lumotlari to'liq bo'lsa
          if (user && user.region && user.job) {
            localStorage.setItem("user", JSON.stringify(user)); // Keyingi safar tezroq kirishi uchun saqlaymiz

            if (user.role === "admin") {
              navigate("/admin-dashboard", { replace: true });
            } else {
              navigate("/user-dashboard", { replace: true });
            }
            return;
          }
        }

        // 4. Agar umuman foydalanuvchi topilmasa yoki ma'lumotlari chala bo'lsa, registratsiyaga yuboramiz
        navigate("/register", { replace: true });

      } catch (err) {
        console.error("Kutilmagan xatolik yuz berdi:", err);
        navigate("/register", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    initApp();
  }, [navigate]);

  if (loading) {
    return (
      <div 
        style={{ 
          display: "flex", 
          justifyContent: "center", 
          alignItems: "center", 
          height: "100vh",
          fontFamily: "sans-serif",
          color: "#333",
          background: "#f4f6f9"
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div className="spinner" style={{
            margin: "0 auto 15px",
            width: "40px",
            height: "40px",
            border: "4px solid #ccc",
            borderTop: "4px solid #3498db",
            borderRadius: "50%",
            animation: "spin 1s linear infinite"
          }}></div>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
          <div style={{ fontSize: "16px", fontWeight: "bold", color: "#2c3e50" }}>
            Yuklanmoqda...
          </div>
          <p style={{ color: "#7f8c8d", fontSize: "13px", margin: "5px 0 0" }}>
            Tizim ma'lumotlari tekshirilmoqda
          </p>
        </div>
      </div>
    );
  }

  return null;
}