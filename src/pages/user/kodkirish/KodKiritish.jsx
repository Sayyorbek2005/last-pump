import React, { useState, useEffect, useCallback } from "react";
import { 
  FaCheckCircle, 
  FaHourglassHalf, 
  FaTimesCircle, 
  FaHashtag,
  FaArrowLeft,
  FaHistory
} from "react-icons/fa";
import { supabase } from "../../../supabase/client"; 
import "./kodkiritish.css";

// 🖼️ Rasmni loyihangiz papkasidan import qilish
import promoBanner from "./assets/image.png"; 

export default function CodeTab({ lang = "uz", userId = "", onBack }) {
  const [bonusCode, setBonusCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [historyData, setHistoryData] = useState([]);
  const [showHistory, setShowHistory] = useState(false); // Tarixni ko'rsatish/yashirish holati

  const translations = {
    uz: {
      backBtn: "Asosiy sahifaga qaytish",
      title: "Kodni faollashtirish",
      hint: "Mahsulot ichidagi maxfiy kodni kiriting",
      placeholder: "KODNI KIRITING",
      btnConfirm: "Kodni jo'natish",
      checking: "Yuborilmoqda...",
      historyTitle: "Kiritilgan kodlaringiz",
      thCode: "Kod",
      thTime: "Sana va Vaqt",
      thStatus: "Holati",
      statusApproved: "Tasdiqlandi",
      statusPending: "Kutilmoqda",
      statusRejected: "Rad etildi",
      noData: "Siz hali kod kiritmadingiz",
      alertSuccess: "Kod muvaffaqiyatli tekshirishga yuborildi!",
      alertWarning: "Iltimos, faollashtirish uchun kodni kiriting!",
      alertError: "Xatolik yuz berdi: ",
      viewHistoryBtn: "Barcha kiritilgan kodlarni ko'rish"
    },
    ru: {
      backBtn: "Назад",
      title: "Активация кода",
      hint: "Введите секретный код товара",
      placeholder: "ВВЕДИТЕ КОД ",
      btnConfirm: "Отправить код",
      checking: "Отправка...",
      historyTitle: "История ваших кодов",
      thCode: "Код",
      thTime: "Дата и Время",
      thStatus: "Статус",
      statusApproved: "Одобрен",
      statusPending: "В ожидании",
      statusRejected: "Отклонен",
      noData: "Вы еще не вводили коды",
      alertSuccess: "Код успешно отправлен на проверку!",
      alertWarning: "Пожалуйста, введите код для активации!",
      alertError: "Произошла ошибка: ",
      viewHistoryBtn: "Посмотреть все введенные коды"
    }
  };

  const t = translations[lang] || translations.uz;

  const getActiveUserId = useCallback(async () => {
    if (userId) return userId;
    
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user?.id) return session.user.id;

    const { data: { user } } = await supabase.auth.getUser();
    if (user?.id) return user.id;

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        if (parsed?.id) return parsed.id;
      } catch (e) {
        console.error("Localstorage parslashda xato");
      }
    }
    return null;
  }, [userId]);

  const fetchHistory = useCallback(async () => {
    // Agar showHistory true bo'lsa, ma'lumotlarni yuklaymiz
    if (!showHistory) return; 

    try {
      const activeId = await getActiveUserId();
      if (!activeId) return;

      const { data, error } = await supabase
        .from("used_codes")
        .select("*, promo_codes(code)") 
        .eq("user_id", activeId)
        .order("created_at", { ascending: false }); // Limit yo'q, hammasini olib keladi

      if (!error && data) setHistoryData(data);
    } catch (err) {
      console.error(err);
    }
  }, [getActiveUserId, showHistory]);

  // Faqat showHistory o'zgarganda yoki funksiya yangilanganda ishlaydi
  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const handleSendCodeSubmit = useCallback(async () => {
    if (!bonusCode.trim()) {
      alert(t.alertWarning);
      return;
    }

    setLoading(true);
    try {
      const activeId = await getActiveUserId();
      if (!activeId) {
        throw new Error("Tizimga kirgan foydalanuvchi aniqlanmadi. Profilga qayta kiring!");
      }

      const cleanCode = bonusCode.trim().toUpperCase();

      const { data: promoData, error: promoError } = await supabase
        .from("promo_codes")
        .select("id")
        .eq("code", cleanCode)
        .single();

      if (promoError || !promoData) {
        throw new Error("Kiritilgan kod xato yoki bazada mavjud emas!");
      }

      const { data: alreadyUsed, error: checkError } = await supabase
        .from("used_codes")
        .select("id")
        .eq("user_id", activeId)
        .eq("code_id", promoData.id)
        .maybeSingle();

      if (checkError) throw checkError;

      if (alreadyUsed) {
        throw new Error("Siz bu kodni allaqachon tekshirishga yuborgansiz! ❌");
      }

      const { error: dbError } = await supabase
        .from("used_codes")
        .insert([
          {
            user_id: activeId,
            code_id: promoData.id, 
            image_url: null,
            status: "pending",
            created_at: new Date().toISOString()
          }
        ]);

      if (dbError) throw dbError;

      setBonusCode("");
      
      // Agar tarix paneli ochiq bo'lsa, yangilaydi
      if (showHistory) {
        fetchHistory();
      }
      
      alert(t.alertSuccess);

    } catch (error) {
      console.error(error);
      alert(error.message); 
    } finally {
      setLoading(false);
    }
  }, [bonusCode, getActiveUserId, fetchHistory, showHistory, t.alertSuccess, t.alertWarning]);

  const renderStatusBadge = (status) => {
    if (status === "approved" || status === "confirmed") {
      return <span className="badge badge-success"><FaCheckCircle /> {t.statusApproved}</span>;
    } else if (status === "rejected" || status === "failed") {
      return <span className="badge badge-danger"><FaTimesCircle /> {t.statusRejected}</span>;
    }
    return <span className="badge badge-warning"><FaHourglassHalf /> {t.statusPending}</span>;
  };

  return (
    <div className="code-tab-container fade-in">
      
      <div className="code-top-nav">
        <button className="code-back-btn" onClick={onBack}>
          <FaArrowLeft /> {t.backBtn} 
        </button>
      </div>
      <br />

      <div className="code-card-header">
        <div className="header-icon-box"><FaHashtag /></div>
        <div>
          <h3 className="code-main-title">{t.title}</h3>
          <p className="code-sub-title">{t.hint}</p>
        </div>
      </div>

      <div className="code-grid-layout">
        <div className="code-form-panel">
          <div className="input-block">
            <input 
              type="text" 
              placeholder={t.placeholder} 
              value={bonusCode}
              onChange={(e) => setBonusCode(e.target.value)}
              className="code-modern-input"
              disabled={loading}
            />
          </div>

          <button 
            className="modern-submit-btn" 
            onClick={handleSendCodeSubmit} 
            disabled={loading || !bonusCode.trim()}
          >
            {loading ? t.checking : t.btnConfirm}
          </button>

          {/* 🖼️ Rasm */}
          <div className="promo-image-container" style={{ marginTop: "20px", textAlign: "center" }}>
            <img 
              src={promoBanner} 
              alt="Aksiya kodi" 
              style={{ width: "100%", borderRadius: "12px", maxWidth: "450px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }} 
            />
          </div>
        </div>

        <div className="code-history-panel">
          {!showHistory ? (
            /* Boshida faqat shu tugma turadi */
            <div style={{ textAlign: "center", padding: "40px 20px" }}>
              <button 
                className="view-history-trigger-btn"
                style={{
                  padding: "12px 24px",
                  backgroundColor: "#007bff",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: "600",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "10px",
                  boxShadow: "0 4px 6px rgba(0,123,255,0.15)"
                }}
                onClick={() => setShowHistory(true)}
              >
                <FaHistory /> {t.viewHistoryBtn}
              </button>
            </div>
          ) : (
            /* Tugma bosilgandan keyin jadval ochiladi */
            <>
              <h4 className="history-block-title">{t.historyTitle}</h4>
              <div className="table-wrapper">
                <table className="modern-table">
                  <thead>
                    <tr>
                      <th>{t.thCode}</th>
                      <th>{t.thTime}</th>
                      <th>{t.thStatus}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historyData.length > 0 ? (
                      historyData.map((item, idx) => (
                        <tr key={item.id || idx}>
                          <td className="font-bold text-dark">
                            {item.promo_codes?.code || `ID: ${item.code_id}`}
                          </td>
                          <td className="text-muted">
                            {new Date(item.created_at).toLocaleDateString("uz-UZ")} <br />
                            <span className="time-lbl">
                              {new Date(item.created_at).toLocaleTimeString("uz-UZ", { hour: "2-digit", minute: "2-digit" })}
                            </span>
                          </td>
                          <td>{renderStatusBadge(item.status)}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3" className="empty-table-text">{t.noData}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}