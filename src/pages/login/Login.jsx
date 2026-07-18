import { useEffect, useState } from "react";
import { supabase } from "../../supabase/client";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import bcrypt from "bcryptjs"; // Parolni xavfsiz solishtirish uchun
import "./login.css";

export default function Login() {
  const [phone, setPhone] = useState("+998 ");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(true); // Sahifa yuklanganda tekshiruv tugaguncha true bo'ladi
  const navigate = useNavigate();

  useEffect(() => {
    const autoLoginWithTelegram = async () => {
      // 1. Telegram Web App obyekti va foydalanuvchi ma'lumotlarini olamiz
      const tg = window.Telegram?.WebApp;
      const tgUser = tg?.initDataUnsafe?.user;

      // Agar foydalanuvchi haqiqatdan ham Telegram orqali kirgan bo'lsa
      if (tgUser && tgUser.id) {
        try {
          // 2. Supabase-dan Telegram ID bo'yicha foydalanuvchini qidiramiz
          const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("telegram_id", String(tgUser.id)) // Bot orqali saqlangan telegram_id bilan solishtiradi
            .maybeSingle();

          if (error) {
            console.error("Supabase xatoligi:", error);
            setIsLoading(false);
            return;
          }

          // 3. Agar foydalanuvchi bazada bor bo'lsa va to'liq ro'yxatdan o'tgan bo'lsa, uni avtomatik kiritamiz
          if (data && data.region && data.job) {
            localStorage.setItem("user", JSON.stringify(data));
            toast.success("Xush kelibsiz!");
            
            if (data.role === "admin") {
              navigate("/admin-dashboard", { replace: true });
            } else {
              navigate("/user-dashboard", { replace: true });
            }
            return; 
          }
        } catch (err) {
          console.error("Avto-login xatoligi yuz berdi:", err);
        }
      }
      
      // Agar Telegram ID topilmasa yoki xatolik bo'lsa, yuklanishni o'chiramiz va login formasini ko'rsatamiz
      setIsLoading(false);
    };

    autoLoginWithTelegram();
  }, [navigate]);

  const handlePhoneChange = (e) => {
    let input = e.target.value;

    if (!input.startsWith("+998")) {
      input = "+998 " + input.replace(/\D/g, "");
    }

    const rawNumbers = input.slice(4).replace(/\D/g, "");
    const limitedNumbers = rawNumbers.slice(0, 9);

    let formatted = "+998 ";
    if (limitedNumbers.length > 0) formatted += limitedNumbers.slice(0, 2);
    if (limitedNumbers.length > 2) formatted += " " + limitedNumbers.slice(2, 5);
    if (limitedNumbers.length > 5) formatted += " " + limitedNumbers.slice(5, 7);
    if (limitedNumbers.length > 7) formatted += " " + limitedNumbers.slice(7, 9);

    setPhone(formatted);
  };

  const login = async () => {
    const cleanPhone = phone.replace(/\s/g, "");

    if (!cleanPhone || !password) {
      toast.error("Telefon va parolni kiriting!");
      return;
    }

    if (cleanPhone.length !== 13) {
      toast.error("Telefon raqami to‘liq kiritilmagan!");
      return;
    }

    if (password.length < 4) {
      toast.error("Parol kamida 4 ta belgi bo‘lishi kerak.");
      return;
    }

    setIsLoading(true);

    try {
      // Faqat telefon raqami bo'yicha profilni qidiramiz (parolni SQL ichida solishtirmaymiz)
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("phone", cleanPhone)
        .maybeSingle();

      if (error) {
        toast.error("Serverda xatolik yuz berdi!");
        return;
      }

      if (!data) {
        toast.error("Telefon yoki parol noto‘g‘ri!");
        return;
      }

      // 🔐 BCRYPT ORQALI PAROLNI SOLISHTIRISH
      // Kiritilgan oddiy parol bilan bazadagi xeshni (shifrlangan parolni) tekshiradi
      const isPasswordCorrect = await bcrypt.compare(password, data.password);

      if (!isPasswordCorrect) {
        toast.error("Telefon yoki parol noto‘g‘ri!");
        return;
      }

      // Agar birinchi marta login qilayotgan bo'lsa va Telegram ID hali bog'lanmagan bo'lsa:
      const tg = window.Telegram?.WebApp;
      const tgUser = tg?.initDataUnsafe?.user;
      if (tgUser && tgUser.id && !data.telegram_id) {
        await supabase
          .from("profiles")
          .update({ telegram_id: String(tgUser.id) })
          .eq("id", data.id);
        data.telegram_id = String(tgUser.id);
      }

      localStorage.setItem("user", JSON.stringify(data));
      toast.success("Xush kelibsiz!");

      if (data.role === "admin") {
        navigate("/admin-dashboard", { replace: true });
      } else {
        navigate("/user-dashboard", { replace: true });
      }
    } catch (err) {
      toast.error("Kutilmagan xatolik yuz berdi.");
    } finally {
      setIsLoading(false);
    }
  };

  // Tekshiruv ketayotganda foydalanuvchiga login formasi ko'rinib turmaydi
  if (isLoading) {
    return (
      <div className="auth-page-wrapper">
        <div className="auth" style={{ textAlign: "center" }}>
          <h2>Iltimos kuting...</h2>
          <p>Tizimga kirish tekshirilmoqda...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page-wrapper">
      <div className="auth">
        <h2>Tizimga kirish</h2>

        <div className="input-group">
          <input
            type="tel"
            placeholder="+998 90 123 45 67"
            value={phone}
            onChange={handlePhoneChange}
          />
        </div>

        <div className="input-group">
          <input
            type="password"
            placeholder="Parol"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button onClick={login}>Kirish</button>

        <p className="register-link" onClick={() => navigate("/register")}>
          Ro‘yxatdan o‘tish
        </p>
      </div>
    </div>
  );
}