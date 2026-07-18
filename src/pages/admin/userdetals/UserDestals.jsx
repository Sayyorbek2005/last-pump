import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../../../supabase/client"; 
import { 
  FaArrowLeft, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaBarcode, 
  FaCalendarAlt,
  FaCheckCircle,
  FaGift
} from "react-icons/fa";
import { toast } from "react-toastify";
import "./userdetals.css"; 

export default function UserDetails() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  
  const [master, setMaster] = useState(null);
  const [scannedCodes, setScannedCodes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMasterAndCodesData = useCallback(async () => {
    try {
      setLoading(true);

      // 1. Ustaning profiles jadvalidan ma'lumotlarini olish
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id)
        .single();

      if (profileError) throw profileError;
      setMaster(profileData);

      // 2. Usta skaner qilgan kodlarni used_codes jadvalidan olish
      const { data: codesData, error: codesError } = await supabase
        .from("used_codes")
        .select(`
          id,
          created_at,
          promo_codes (
            code
          )
        `)
        .eq("user_id", id)
        .order("created_at", { ascending: false });

      if (codesError) throw codesError;
      setScannedCodes(codesData || []);

    } catch (err) {
      toast.error("Ma'lumotlarni yuklashda xatolik: " + err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchMasterAndCodesData();
    }
  }, [id, fetchMasterAndCodesData]);

  if (loading) return <div className="loading-container">Usta ma'lumotlari yuklanmoqda...</div>;
  if (!master) return <div className="loading-container">Usta topilmadi! ❌</div>;

  // Avatar uchun ism-familiyaning bosh harflarini olish (Masalan: Samandar -> S)
  const avatarText = master.full_name 
    ? master.full_name.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2)
    : "U";

  return (
    <div className="detail-page-container fade-in">
      {/* ⬅️ Orqaga qaytish */}
      <div className="details-header-action">
        <button className="back-to-dash-btn" onClick={() => navigate(-1)}>
          <FaArrowLeft /> Ro'yxatga qaytish
        </button>
      </div>

      {/* 👤 Ustaning profili */}
      <div className="master-profile-main-card">
        <div className="profile-header-flex">
          <div className="profile-avatar-large">
            {avatarText}
          </div>
          <div className="profile-main-info">
            <h2>{master.full_name || "Kiritilmagan"}</h2>
            <p className="profile-subtitle">{master.role || "Professional Usta / Hamkor"}</p>
            
            <div className="profile-contact-row">
              <span className="contact-item">
                <FaPhone className="contact-icon" /> {master.phone || "Ko'rsatilmagan"}
              </span>
              <span className={master.is_active !== false ? "status-badge-active" : "status-badge-inactive"}>
                {master.is_active !== false ? "FAOL" : "FAOL EMAS"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 📊 Statistika Vidjetlari (Sizda ustma-ust tushib ketgan joy shu yerda tuzatildi) */}
      <div className="detail-stats-grid">
        
        {/* 1-Karta: Skanerlanganlar */}
        <div className="detail-stat-item-card">
          <div className="card-icon-wrap blue-bg">
            <FaBarcode />
            salom 
          </div>
          <div className="card-stat-value-wrap">
            <span className="card-stat-label">Jami skanerlangan</span>
            <h3 className="card-stat-number">{scannedCodes.length} ta mahsulottttt</h3>
          </div>
        </div>

        {/* 2-Karta: Bonus */}
        <div className="detail-stat-item-card">
          <div className="card-icon-wrap gold-bg">
            <FaGift />
          </div>
          <div className="card-stat-value-wrap">
            <span className="card-stat-label">To'plangan jami bonus</span>
            <h3 className="card-stat-number">0 ball</h3>
          </div>
        </div>

        {/* 3-Karta: Manzil */}
        <div className="detail-stat-item-card">
          <div className="card-icon-wrap green-bg">
            <FaMapMarkerAlt />
          </div>
          <div className="card-stat-value-wrap">
            <span className="card-stat-label">Xizmat ko'rsatish hududi</span>
            <h3 className="card-stat-number">
              {master.region 
                ? `${master.region}${master.district ? `, ${master.district}` : ""}` 
                : "Kiritilmagan"}
            </h3>
          </div>
        </div>

      </div>

      {/* 📋 Skaner qilingan kodlar jadvali */}
      <div className="history-table-section-card">
        <div className="section-title-wrap">
          <FaCalendarAlt className="title-icon blue-text" />
          <h3>Skanerlangan Shtrix-kodlar Tarixi</h3>
        </div>

        <div className="detail-table-wrapper">
          <table className="detail-custom-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Skaner qilingan kod matni</th>
                <th>Skanerlangan vaqti</th>
                <th>Holati</th>
              </tr>
            </thead>
            <tbody>
              {scannedCodes.length === 0 ? (
                <tr>
                  <td colSpan="4" className="empty-table-text">
                    Bu usta hali biror marta kod skaner qilmadi. 📥
                  </td>
                </tr>
              ) : (
                scannedCodes.map((item, index) => (
                  <tr key={item.id} className="table-row-hover">
                    <td>{index + 1}</td>
                    <td>
                      <span className="barcode-font">
                        <FaBarcode style={{ marginRight: "6px", opacity: 0.8 }} />
                        {item.promo_codes?.code || "NOMA'LUM KOD"}
                      </span>
                    </td>
                    <td className="time-cell">
                      {new Date(item.created_at).toLocaleString("uz-UZ", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </td>
                    <td>
                      <span className="status-success-label">
                        <FaCheckCircle /> Tasdiqlangan
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}