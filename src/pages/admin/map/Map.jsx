import React, { useState } from "react";
import { supabase } from "../../../supabase/client";
import { FaStore, FaMapMarkerAlt, FaLink, FaSave, FaCheckCircle, FaExclamationCircle, FaEye } from "react-icons/fa";
import "./map.css";

export default function AdminMapSettings() {
  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [mapLink, setMapLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  // 📝 Ixtiyoriy Yandex havolasini ishlaydigan vidjet formatiga o'tkazish
  const getEmbedUrl = (url) => {
    if (!url) return null;
    
    if (url.includes("map-widget") || url.includes("constructor.yandex.ru")) {
      return url;
    }

    try {
      const urlObj = new URL(url);
      const searchParams = urlObj.searchParams;
      const ll = searchParams.get("ll");
      const z = searchParams.get("z") || "16";

      if (ll) {
        return `https://yandex.com/map-widget/v1/?ll=${ll}&z=${z}&l=map`;
      }

      const pathname = urlObj.pathname;
      const search = urlObj.search;
      
      if (pathname) {
        return `https://yandex.com/map-widget/v1/${pathname}${search}`;
      }
    } catch (e) {
      // Xatolikni yutib yuboramiz
    }

    return `https://yandex.com/map-widget/v1/?text=${encodeURIComponent(url)}&z=16`;
  };

  const embedUrl = getEmbedUrl(mapLink);

  // 💾 Bazaga saqlash funksiyasi ("stores" jadvaliga moslandi)
  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: "", message: "" });

    try {
      const { error } = await supabase
        .from("stores") // <-- Jadval nomi "stores" ga o'zgartirildi
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

          <div className="form-group">
            <label className="form-label">
              <FaLink style={{ marginRight: "6px" }} /> Yandex Xarita Linki (Havola):
            </label>
            <input
              type="text"
              value={mapLink}
              onChange={(e) => setMapLink(e.target.value)}
              placeholder="https://yandex.com/maps/..."
              required
              className="form-input"
            />
          </div>

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

          <button type="submit" disabled={loading} className="form-submit-btn">
            <FaSave />
            {loading ? "Qo'shilmoqda..." : "Do'konni ro'yxatga qo'shish"}
          </button>

        </form>
      </div>
    </div>
  );
}