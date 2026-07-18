import React, { useState } from "react";
import { supabase } from "../../../supabase/client"; // Supabase yo'lini tekshiring
import { FaStore, FaMapMarkerAlt, FaLink, FaSave, FaCheckCircle, FaExclamationCircle, FaEye } from "react-icons/fa";
import "./map.css"; // Responsive css fayli

export default function AdminMapSettings() {
  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [mapLink, setMapLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  // 📝 Yandex oddiy havolasini iframe vidjet formatiga o'tkazish funksiyasi
  const getEmbedUrl = (url) => {
    if (!url) return null;
    try {
      if (url.includes("map-widget")) return url;
      
      const urlObj = new URL(url);
      const pathname = urlObj.pathname;
      const search = urlObj.search;
      
      if (pathname.includes("/org/") || pathname.includes("/maps/")) {
        return `https://yandex.com/map-widget/v1/${pathname}${search}`;
      }
      return null;
    } catch (e) {
      return null;
    }
  };

  const embedUrl = getEmbedUrl(mapLink);

  // 💾 Yangi do'konni bazaga qo'shish funksiyasi
  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: "", message: "" });

    try {
      // 🆕 KO'P DO'KON QO'SHISH UCHUN .insert() ISHLATAMIZ (id berilmaydi, baza o'zi yaratadi)
      const { error } = await supabase
        .from("shop_settings")
        .insert([
          {
            title: title,
            address: address,
            map_link: mapLink,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }
        ]);

      if (error) throw error;
      
      setStatus({ type: "success", message: "✅ Yangi do'kon muvaffaqiyatli qo'shildi!" });
      
      // Yangi do'kon qo'shilgandan keyin inputlarni tozalaymiz (keyingi do'konni kiritish uchun)
      setTitle("");
      setAddress("");
      setMapLink("");

    } catch (error) {
      console.error("Saqlashda xatolik:", error);
      setStatus({ type: "error", message: "❌ Xatolik yuz berdi, qaytadan urinib ko'ring." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-map-container">
      <div className="admin-map-card">
        <h3 className="admin-map-title">
          <FaMapMarkerAlt className="title-icon" /> Yangi Do'kon Qo'shish (Admin)
        </h3>

        {status.message && (
          <div className={`admin-map-alert ${status.type}`}>
            {status.type === "success" ? <FaCheckCircle /> : <FaExclamationCircle />}
            <span>{status.message}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="admin-map-form">
          
          {/* 1-INPUT: DO'KON NOMI */}
          <div className="form-group">
            <label className="form-label">
              <FaStore style={{ marginRight: "6px" }} /> Do'kon nomi:
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Masalan: Climate House"
              required
              className="form-input"
            />
          </div>

          {/* 2-INPUT: DO'KON MANZILI */}
          <div className="form-group">
            <label className="form-label">
              <FaMapMarkerAlt style={{ marginRight: "6px" }} /> Do'kon manzili:
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Masalan: Samarqand shahri, Cho'lpon ko'chasi"
              required
              className="form-input"
            />
          </div>

          {/* 3-INPUT: YANDEX XARITA LINKI */}
          <div className="form-group">
            <label className="form-label">
              <FaLink style={{ marginRight: "6px" }} /> Yandex Xarita Linki (Havola):
            </label>
            <input
              type="url"
              value={mapLink}
              onChange={(e) => setMapLink(e.target.value)}
              placeholder="https://yandex.com/maps/..."
              required
              className="form-input"
            />
          </div>

          {/* JONLI KARTA KO'RINISHI (PREVIEW) */}
          {embedUrl && (
            <div className="map-preview-box">
              <div className="preview-header">
                <FaEye /> Jonli Xarita Ko'rinishi:
              </div>
              <iframe 
                src={embedUrl} 
                width="100%" 
                height="220" 
                frameBorder="0" 
                allowFullScreen={true}
                className="map-iframe"
                title="Yandex Map Preview"
              ></iframe>
            </div>
          )}

          {/* SAQLASH TUGMASI */}
          <button type="submit" disabled={loading} className="form-submit-btn">
            <FaSave />
            {loading ? "Qo'shilmoqda..." : "Do'konni ro'yxatga qo'shish"}
          </button>

        </form>
      </div>
    </div>
  );
}