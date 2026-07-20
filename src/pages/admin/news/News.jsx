import React, { useState, useEffect } from "react";
import { FaNewspaper, FaTrashAlt, FaPlusCircle, FaRegCommentDots, FaUpload, FaImage } from "react-icons/fa";
import { supabase } from "../../../supabase/client";
import { toast } from "react-toastify";
import "./news.css"; 

export default function YangiliklarTab({ lang = "uz" }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState(""); 
  const [imageUrl, setImageUrl] = useState("");
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // 🌍 Ko'p tillilik lug'ati (Yangiliklar uchun moslashtirildi)
  const translations = {
    uz: {
      formTitle: "Yangiliklar va E'lonlar",
      formDesc: "Bu yerga yozilgan yangiliklar va e'lonlar bevosita foydalanuvchilar panelida ko'rinadi.",
      labelTitle: "Yangilik Sarlavhasi *",
      placeholderTitle: "Masalan: Tizimda yangi imkoniyatlar paydo bo'ldi",
      labelContent: "Yangilik Matni *",
      placeholderContent: "Foydalanuvchilar ko'rishi kerak bo'lgan yangilik yoki e'lonni yozing...",
      btnPublish: "E'lon Qilish",
      btnSaving: "Saqlanmoqda...",
      listTitle: "📋 Mavjud Yangiliklar",
      thTitle: "Sarlavha",
      thContent: "Matn",
      thDate: "Sana",
      thAction: "Amal",
      emptyRow: "Hozircha hech qanday yangilik kiritilmagan.",
      toastFieldsErr: "Iltimos, barcha maydonlarni to'ldiring!",
      toastSuccess: "Yangi yangilik muvaffaqiyatli qo'shildi! 📰",
      toastDeleted: "Yangilik muvaffaqiyatli o'chirildi 🗑️",
      confirmDelete: "Ushbu yangilikni o'chirib tashlamoqchimisiz?",
      errorLoad: "Mavjud yangiliklarni yuklab bo'lmadi",
      errorLoadConsole: "Ma'lumotlarni yuklashda xatolik:",
      errorAction: "Xatolik yuz berdi: ",
      uploadBtn: "Rasm tanlash",
      uploadingText: "Rasm yuklanmoqda...",
      uploadSuccess: "Rasm muvaffaqiyatli yuklandi! 📸",
      uploadTypeErr: "Iltimos, faqat rasm faylini tanlang!",
      imgText: "Rasm"
    },
    ru: {
      formTitle: "Новости и Объявления",
      formDesc: "Написанные здесь новости и объявления будут отображаться непосредственно в панели пользователей.",
      labelTitle: "Заголовок Новости *",
      placeholderTitle: "Например: Появились новые возможности в системе",
      labelContent: "Текст Новости *",
      placeholderContent: "Напишите новость или объявление, которое должны увидеть пользователи...",
      btnPublish: "Опубликовать",
      btnSaving: "Сохранение...",
      listTitle: "📋 Доступные Новости",
      thTitle: "Заголовок",
      thContent: "Текст",
      thDate: "Дата",
      thAction: "Действие",
      emptyRow: "На данный момент новости отсутствуют.",
      toastFieldsErr: "Пожалуйста, заполните все поля!",
      toastSuccess: "Новая новость успешно добавлена! 📰",
      toastDeleted: "Новость успешно удалена 🗑️",
      confirmDelete: "Вы действительно хотите удалить эту новость?",
      errorLoad: "Не удалось загрузить новости",
      errorLoadConsole: "Ошибка при загрузке данных:",
      errorAction: "Произошла ошибка: ",
      uploadBtn: "Выбрать изображение",
      uploadingText: "Изображение загружается...",
      uploadSuccess: "Изображение успешно загрузилось! 📸",
      uploadTypeErr: "Пожалуйста, выберите только файлы изображений!",
      imgText: "Фото"
    }
  };

  const t = translations[lang] || translations.uz;

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const { data, error } = await supabase
          .from("news")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        setNewsList(data || []);
      } catch (err) {
        console.error(t.errorLoadConsole, err);
        toast.error(t.errorLoad);
      }
    };

    fetchNews();
  }, [t.errorLoad, t.errorLoadConsole]);

  const refreshNews = async () => {
    try {
      const { data, error } = await supabase
        .from("news")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error) setNewsList(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      return toast.error(t.uploadTypeErr);
    }

    setUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `news-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("prizes")
        .upload(filePath, file, { cacheControl: "3600", upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("prizes").getPublicUrl(filePath);
      
      setImageUrl(data.publicUrl);
      toast.success(t.uploadSuccess);
    } catch (error) {
      toast.error(t.errorAction + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleCreateNews = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      toast.error(t.toastFieldsErr);
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from("news").insert([
        {
          title: title.trim(),
          content: content.trim(), 
          image_url: imageUrl.trim() || null,
        },
      ]);

      if (error) throw error;

      toast.success(t.toastSuccess);
      setTitle("");
      setContent("");
      setImageUrl(""); 
      refreshNews();
    } catch (err) {
      toast.error(t.errorAction + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNews = async (id) => {
    const isConfirmed = window.confirm(t.confirmDelete);
    if (!isConfirmed) return;

    setLoading(true);
    try {
      const { error } = await supabase.from("news").delete().eq("id", id);
      if (error) throw error;

      toast.info(t.toastDeleted);
      refreshNews();
    } catch (err) {
      toast.error(t.errorAction + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tab-section fade-in news-container">
      
      {/* YANGI YANGILIK QO'SHISH FORMASI */}
      <div className="aksiya-card">
        <h4 className="aksiya-card-title">
          <FaNewspaper style={{ color: "#2563eb" }} /> {t.formTitle}
        </h4>
        <p className="aksiya-card-desc">
          {t.formDesc}
        </p>

        <form onSubmit={handleCreateNews} className="aksiya-form">
          <div className="input-group">
            <label>{t.labelTitle}</label>
            <input
              type="text"
              placeholder={t.placeholderTitle}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>{t.labelContent}</label>
            <textarea
              placeholder={t.placeholderContent}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="textarea-input-style"
              rows="4"
            />
          </div>

          {/* RASM YUKLASH TUGMASI */}
          <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "15px", flexWrap: "wrap" }}>
            <div style={{ position: "relative", flex: 1 }}>
              <label htmlFor="news-file-upload" style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                padding: "10px 15px",
                background: "#f1f5f9",
                border: "1px dashed #cbd5e1",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "500",
                color: "#475569",
                textAlign: "center"
              }}>
                <FaUpload /> {uploading ? t.uploadingText : t.uploadBtn}
              </label>
              <input 
                id="news-file-upload"
                type="file" 
                accept="image/*"
                onChange={handleImageUpload} 
                disabled={uploading}
                style={{ display: "none" }}
              />
            </div>

            {/* Rasm prevyusi */}
            {imageUrl && (
              <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "#f0fdf4", padding: "6px 12px", borderRadius: "6px", border: "1px solid #bbf7d0" }}>
                <img src={imageUrl} alt="Uploaded preview" style={{ width: "35px", height: "35px", objectFit: "cover", borderRadius: "4px" }} />
                <span style={{ fontSize: "12px", color: "#16a34a" }}>✓ Tayyor</span>
              </div>
            )}
          </div>

          <button type="submit" disabled={loading || uploading} className="btn-submit" style={{ background: "#2563eb" }}>
            <FaPlusCircle /> {loading ? t.btnSaving : t.btnPublish}
          </button>
        </form>
      </div>

      {/* RO'YXAT JADBAlI */}
      <div className="aksiya-card">
        <h4 className="aksiya-card-title">{t.listTitle}</h4>
        
        <div className="custom-table-wrapper">
          <table className="custom-table">
            <thead>
              <tr>
                <th style={{ width: "10%" }}>{t.imgText}</th>
                <th style={{ width: "20%" }}>{t.thTitle}</th>
                <th style={{ width: "45%" }}>{t.thContent}</th>
                <th style={{ width: "15%" }}>{t.thDate}</th>
                <th style={{ textAlign: "center", width: "10%" }}>{t.thAction}</th>
              </tr>
            </thead>
            <tbody>
              {newsList.map((item) => (
                <tr key={item.id}>
                  <td>
                    {item.image_url ? (
                      <img src={item.image_url} alt="" style={{ width: "45px", height: "45px", objectFit: "cover", borderRadius: "6px", border: "1px solid #e2e8f0" }} />
                    ) : (
                      <div style={{ width: "45px", height: "45px", background: "#f1f5f9", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <FaImage style={{ color: "#cbd5e1" }} />
                      </div>
                    )}
                  </td>
                  <td><strong>{item.title}</strong></td>
                  <td>
                    <div className="tip-desc-cell">
                      <FaRegCommentDots style={{ color: "#94a3b8", flexShrink: 0 }} />
                      <span>{item.content}</span>
                    </div>
                  </td>
                  <td>
                    <span style={{ fontSize: "13px", color: "#64748b" }}>
                      {new Date(item.created_at).toLocaleDateString(lang === "ru" ? "ru-RU" : "uz-UZ")}
                    </span>
                  </td>
                  <td style={{ textAlign: "center" }}>
                    <button
                      onClick={() => handleDeleteNews(item.id)}
                      className="btn-delete"
                      title={lang === "ru" ? "Удалить" : "O'chirish"}
                      disabled={loading}
                    >
                      <FaTrashAlt />
                    </button>
                  </td>
                </tr>
              ))}
              
              {newsList.length === 0 && (
                <tr>
                  <td colSpan="5" className="empty-row" style={{ textAlign: "center", padding: "20px", color: "#64748b" }}>
                    {t.emptyRow}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}