import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FaUser, 
  FaMapMarkerAlt, 
  FaSave, 
  FaSignOutAlt, 
  FaChevronLeft, 
  FaChevronDown, 
  FaChevronUp,
  FaHeadset,
  FaGlobe,
  FaPhoneAlt,
  FaTelegramPlane,
  FaEnvelope,
  FaLink,
  FaArrowRight,
  FaTrash,
  FaEdit,
  FaTimes
} from "react-icons/fa";
import "./setting.css";
// 🚨 Supabase import yo'lingiz to'g'ri ekanligini tekshiring
import { supabase } from "../../../supabase/client"; 

const regionsData = {
  "Toshkent shahri": [
    "Yunusobod tumani", "Chilonzor tumani", "Mirzo Ulug'bek tumani", 
    "Yashnobod tumani", "Mirobod tumani", "Sergeli tumani", "Uchtepa tumani",
    "Shayxontohur tumani", "Olmazor tumani", "Yakkasaroy tumani", "Bektemir tumani", "Yangihayot tumani"
  ],
  "Toshkent viloyati": [
    "Nurafshon shahri", "Angren shahri", "Olmaliq shahri", "Chirchiq shahri", "Bekobod shahri",
    "Oqqurgan tumani", "Olmaliq tumani", "Bekobod tumani", "Bo'stonliq tumani", "Bo'ka tumani",
    "Chinaz tumani", "Qibray tumani", "Parkent tumani", "Pskent tumani", "Zangiota tumani",
    "Yuqorichirchiq tumani", "Yangiyo'l tumani", "O'rtachirchiq tumani", "Toshkent tumani"
  ],
  "Samarqand": [
    "Samarqand shahri", "Kattaqo'rg'on shahri", "Pastdarg'om tumani", "Oqdaryo tumani", 
    "Bulung'ur tumani", "Jomboy tumani", "Urgut tumani", "Ishtixon tumani", "Kattaqo'rg'on tumani",
    "Narpay tumani", "Nurobod tumani", "Payariq tumani", "Pasdarg'om tumani", "Samarqand tumani",
    "Toyloq tumani", "Qo'shrabot tumani"
  ],
  "Andijon": [
    "Andijon shahri", "Xonobod shahri", "Asaka tumani", "Shahrixon tumani", "Izboskan tumani", 
    "Marhamat tumani", "Andijon tumani", "Baliqchi tumani", "Bo'ston tumani", "Buloqboshi tumani",
    "Jalaquduq tumani", "Katta Farg'ona tumani", "Paxtaobod tumani", "Ulug'nor tumani", "Xo'jaobod tumani"
  ],
  "Buxoro": [
    "Buxoro shahri", "Kogon shahri", "Gijduvon tumani", "Kogon tumani", "Vobkent tumani", 
    "Qorako'l tumani", "Olot tumani", "Buxoro tumani", "Jondor tumani", "Qorashina tumani",
    "Romitan tumani", "Shofirkon tumani", "Peshku tumani"
  ],
  "Farg'ona": [
    "Farg'ona shahri", "Marg'ilon shahri", "Qo'qon shahri", "Quvasoy shahri", "Quva tumani", 
    "Oltiariq tumani", "Rishton tumani", "Bog'dod tumani", "Beshariq tumani", "Buvayda tumani",
    "Dang'ara tumani", "Farg'ona tumani", "Furqat tumani", "Qo'shtepa tumani", "Yozyovon tumani",
    "Uchko'prik tumani", "O'zbekiston tumani", "Yazyavan tumani"
  ],
  "Jizzax": [
    "Jizzax shahri", "Arnasoy tumani", "Baxmal tumani", "Do'stlik tumani", "Sharaf Rashidov tumani",
    "G'allaarol tumani", "Forish tumani", "Yangiobod tumani", "Paxtakor tumani", "Mirzacho'l tumani",
    "Zamin tumani", "Zafarobod tumani"
  ],
  "Namangan": [
    "Namangan shahri", "Chust tumani", "Kosonsoy tumani", "Mingbuloq tumani", "Namangan tumani",
    "Norin tumani", "Pop tumani", "To'raqo'rg'on tumani", "Uychi tumani", "Uchqo'rg'on tumani",
    "Chortoq tumani", "Yangiqo'rg'on tumani", "Davlatobod tumani"
  ],
  "Navoiy": [
    "Navoiy shahri", "Zarafshon shahri", "Karmana tumani", "Konimex tumani", "Navbahor tumani",
    "Nurota tumani", "Tomdi tumani", "Uchquduq tumani", "Xatirchi tumani", "Qiziltepa tumani"
  ],
  "Qashqadaryo": [
    "Karshi shahri", "Shahrisabz shahri", "Chiroqchi tumani", "Dehqonobod tumani", "G'uzor tumani",
    "Kasbi tumani", "Kitob tumani", "Koson tumani", "Mirishkor tumani", "Muborak tumani",
    "Nishon tumani", "Qamashi tumani", "Shahrisabz tumani", "Yakkabog' tumani", "Ko'kdala tumani"
  ],
  "Surxondaryo": [
    "Termiz shahri", "Angor tumani", "Boysun tumani", "Denov tumani", "Jarqo'rg'on tumani",
    "Kizirik tumani", "Kumqo'rg'on tumani", "Muzrabot tumani", "Oltinsoy tumani", "Sariosiyo tumani",
    "Sherobod tumani", "Sho'rchi tumani", "Termiz tumani", "Uzun tumani"
  ],
  "Sirdaryo": [
    "Guliston shahri", "Shirin shahri", "Yangiyer shahri", "Boyovut tumani", "Guliston tumani",
    "Mirzaobod tumani", "Oqoltin tumani", "Sayxunobod tumani", "Sardoba tumani", "Sirdaryo tumani",
    "Xavast tumani"
  ],
  "Xorazm": [
    "Urganch shahri", "Xiva shahri", "Bog'ot tumani", "Gurlan tumani", "Qo'shko'pir tumani",
    "Shovot tumani", "To'proqqala tumani", "Xazorasp tumani", "Xanka tumani", "Xiva tumani",
    "Yangiariq tumani", "Yangibozor tumani"
  ],
  "Qoraqalpog'iston Respublikasi": [
    "Nukus shahri", "Amudaryo tumani", "Beruniy tumani", "Chimboy tumani", "Ellikqal'a tumani",
    "Kegeyli tumani", "Mo'ynoq tumani", "Nukus tumani", "Qanliko'l tumani", "Qo'ng'irot tumani",
    "Qorao'zak tumani", "Shumanay tumani", "Taxtako'pir tumani", "To'rtko'l tumani", "Xo'jayli tumani",
    "Taxiatosh shahri", "Bo'zatov tumani"
  ]
};

export default function SettingsTab({
  editName,
  setEditName,
  editRegion,
  setEditRegion,
  editDistrict,      
  setEditDistrict,   
  currentUser,
  saveLoading,
  handleSaveProfile,
  setShowLogoutModal,
  lang,          
  changeLanguage, 
  onBack
}) {
  const [districtsList, setDistrictsList] = useState([]);
  const [supportContacts, setSupportContacts] = useState([]);
  const [loadingContacts, setLoadingContacts] = useState(true);
  const navigate = useNavigate();

  const [isLangOpen, setIsLangOpen] = useState(false); 
  const [isRegionOpen, setIsRegionOpen] = useState(false);
  const [isDistrictOpen, setIsDistrictOpen] = useState(false);

  const langRef = useRef(null); 
  const regionRef = useRef(null);
  const districtRef = useRef(null);

  // --- YANGI/TAHRIRLASH KONTAKTLAR UCHUN STATE-LAR ---
  const [newValue, setNewValue] = useState("");
  const [newLabel, setNewLabel] = useState("");
  const [newType, setNewType] = useState("phone");
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
  const typeDropdownRef = useRef(null);

  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [editLabel, setEditLabel] = useState("");
  const [editType, setEditType] = useState("phone");
  const [isInlineTypeOpen, setIsInlineTypeOpen] = useState(false);

  // Foydalanuvchi Admin yoki yo'qligini aniqlash
  const isAdmin = currentUser?.role?.toLowerCase() === "admin";

  // Supabase'dan kontakt ma'lumotlarini yuklash funksiyasi
  const fetchContacts = async () => {
    try {
      setLoadingContacts(true);
      const { data, error } = await supabase
        .from("support_contacts")
        .select("*")
        .order("id", { ascending: true });
      
      if (error) throw error;
      setSupportContacts(data || []);
    } catch (err) {
      console.error("Kontaktlarni yuklashda xatolik:", err.message);
    } finally {
      setLoadingContacts(false);
    }
  };

  useEffect(() => {
    fetchContacts();

    // Realtime o'zgarishlarni kuzatish
    const channel = supabase
      .channel("support-contacts-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "support_contacts" },
        () => {
          fetchContacts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (langRef.current && !langRef.current.contains(event.target)) setIsLangOpen(false);
      if (regionRef.current && !regionRef.current.contains(event.target)) setIsRegionOpen(false);
      if (districtRef.current && !districtRef.current.contains(event.target)) setIsDistrictOpen(false);
      if (typeDropdownRef.current && !typeDropdownRef.current.contains(event.target)) setIsTypeDropdownOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (editRegion && regionsData[editRegion]) {
      setDistrictsList(regionsData[editRegion]);
    } else {
      setDistrictsList([]);
    }
  }, [editRegion]);

  // --- KONTAKT AMALLARI (CRUD) ---
  const handleAddContact = async (e) => {
    e.preventDefault();
    if (!newValue) return;

    // Default sarlavhalar o'rnatish (agar kiritilmagan bo'lsa)
    const finalLabel = newLabel.trim() || (newType === "phone" ? "Aloqa telefoni" : "Telegram support");

    const { error } = await supabase
      .from("support_contacts")
      .insert([{ label: finalLabel, value: newValue, type: newType }]);

    if (!error) {
      setNewValue("");
      setNewLabel("");
      fetchContacts();
    } else {
      alert("Xatolik yuz berdi!");
    }
  };

  const startEdit = (contact) => {
    setEditingId(contact.id);
    setEditValue(contact.value);
    setEditLabel(contact.label);
    setEditType(contact.type || "phone");
  };

  const handleUpdateContact = async (id) => {
    if (!editValue) return;
    const finalLabel = editLabel.trim() || (editType === "phone" ? "Aloqa telefoni" : "Telegram support");

    const { error } = await supabase
      .from("support_contacts")
      .update({ label: finalLabel, value: editValue, type: editType })
      .eq("id", id);

    if (!error) {
      setEditingId(null);
      fetchContacts();
    } else {
      alert("Yangilashda xatolik yuz berdi");
    }
  };

  const handleDeleteContact = async (id, e) => {
    // Havola bosilib ketmasligi uchun event tarqalishini to'xtatamiz
    e.preventDefault();
    e.stopPropagation();

    const confirmDelete = window.confirm(
      lang === "uz" ? "Rostdan ham ushbu kontaktni o'chirmoqchimisiz?" : "Вы действительно хотите удалить этот контакт?"
    );
    if (!confirmDelete) return;

    const { error } = await supabase
      .from("support_contacts")
      .delete()
      .eq("id", id);

    if (!error) {
      fetchContacts();
    } else {
      alert("O'chirishda xatolik yuz berdi");
    }
  };

  const translations = {
    uz: {
      headerTitle: "Profil sozlamalari",
      fullNameLabel: "To'liq ism-sharifingiz",
      fullNamePlaceholder: "Ism va familiyangizni kiriting",
      regionLabel: "Viloyat",
      regionPlaceholder: "Viloyatni tanlang",
      districtLabel: "Tuman",
      districtPlaceholder: "Tumanni tanlang",
      saveBtn: "O'zgarishlarni saqlash",
      savingBtn: "Saqlanmoqda...",
      logoutBtn: "Tizimdan chiqish",
      supportTitle: "Mijozlarni qo'llab-quvvatlash xizmati",
      langLabel: "Tizim tili",
      chooseType: "Turi",
      phoneOption: "Telefon raqami",
      tgOption: "Telegram",
      addBtn: "Qo'shish",
      writeValuePhone: "+998...",
      writeValueTg: "@username yoki havola",
      labelPlaceholder: "Sarlavha (masalan: Sotuv bo'limi)"
    },
    ru: {
      headerTitle: "Настройки профиля",
      fullNameLabel: "Ваше полное имя",
      fullNamePlaceholder: "Введите имя и фамилию",
      regionLabel: "Область",
      regionPlaceholder: "Выберите область",
      districtLabel: "Район",
      districtPlaceholder: "Выберите район",
      saveBtn: "Сохранить изменения",
      savingBtn: "Сохранение...",
      logoutBtn: "Выйти из системы",
      supportTitle: "Служба поддержки клиентов",
      langLabel: "Язык системы",
      chooseType: "Тип",
      phoneOption: "Номер телефона",
      tgOption: "Telegram",
      addBtn: "Добавить",
      writeValuePhone: "+998...",
      writeValueTg: "@username или ссылка",
      labelPlaceholder: "Заголовок (например: Отдел продаж)"
    }
  };

  const t = translations[lang] || translations["uz"];

  const handleBackClick = () => {
    if (typeof onBack === "function") {
      onBack();
    } else {
      navigate("/");
    }
  };

  // Ikonkalarni turlariga qarab tanlash
  const getContactIcon = (type, label) => {
    const lowerType = type ? type.toLowerCase() : "";
    const lowerLabel = label ? label.toLowerCase() : "";

    if (lowerType === "phone" || lowerLabel.includes("telefon") || lowerLabel.includes("tel")) {
      return <FaPhoneAlt className="support-list-icon phone-color" />;
    }
    if (lowerType === "telegram" || lowerLabel.includes("telegram") || lowerLabel.includes("tg")) {
      return <FaTelegramPlane className="support-list-icon telegram-color" />;
    }
    if (lowerType === "email" || lowerLabel.includes("email") || lowerLabel.includes("pochta")) {
      return <FaEnvelope className="support-list-icon email-color" />;
    }
    return <FaLink className="support-list-icon link-color" />;
  };

  const getContactLink = (type, value) => {
    const cleanValue = value.trim();
    if (type === "phone") {
      return `tel:${cleanValue}`;
    }
    if (type === "telegram") {
      const username = cleanValue.replace("@", "");
      return `https://t.me/${username}`;
    }
    return cleanValue.startsWith("http") ? cleanValue : `https://${cleanValue}`;
  };

  return (
    <div className="settings-tab-wrapper">
      
      {/* 1. HEADER */}
      <div className="settings-tab-header">
        <button className="settings-back-arrow" onClick={handleBackClick}>
          <FaChevronLeft size={18} />
        </button>
        <h2>{t.headerTitle}</h2>
        <div style={{ width: 40 }}></div>
      </div>

      {/* 2. ASOSIY PROFIL KARTASI */}
      <div className="settings-main-card">
        <div className="settings-user-profile-summary">
          <div className="settings-large-avatar">
            <FaUser size={40} />
          </div>
          <h3>{currentUser?.full_name || (lang === "uz" ? "Foydalanuvchi" : "Пользователь")}</h3>
          <p className="settings-user-phone">{currentUser?.phone || "+998 -- --- -- --"}</p>
        </div>

        {/* SYSTEM LANGUAGE */}
        <div className="settings-input-block" ref={langRef}>
          <label><FaGlobe className="form-icon-accent" /> {t.langLabel}</label>
          <div 
            className={`custom-select-trigger ${isLangOpen ? "open" : ""}`}
            onClick={() => setIsLangOpen(!isLangOpen)}
          >
            <span>{lang === "uz" ? "O'zbekcha (UZ)" : "Русский (RU)"}</span>
            {isLangOpen ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}
          </div>
          
          {isLangOpen && (
            <div className="custom-select-options">
              <div 
                className={`custom-option ${lang === "uz" ? "selected" : ""}`}
                onClick={() => {
                  changeLanguage("uz");
                  setIsLangOpen(false);
                }}
              >
                O'zbekcha (UZ)
              </div>
              <div 
                className={`custom-option ${lang === "ru" ? "selected" : ""}`}
                onClick={() => {
                  changeLanguage("ru");
                  setIsLangOpen(false);
                }}
              >
                Русский (RU)
              </div>
            </div>
          )}
        </div>

        {/* FULL NAME */}
        <div className="settings-input-block">
          <label><FaUser className="form-icon-accent" /> {t.fullNameLabel}</label>
          <input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            placeholder={t.fullNamePlaceholder}
          />
        </div>

        {/* REGION */}
        <div className="settings-input-block" ref={regionRef}>
          <label><FaMapMarkerAlt className="form-icon-accent" /> {t.regionLabel}</label>
          <div 
            className={`custom-select-trigger ${isRegionOpen ? "open" : ""}`}
            onClick={() => setIsRegionOpen(!isRegionOpen)}
          >
            <span>{editRegion || t.regionPlaceholder}</span>
            {isRegionOpen ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}
          </div>
          
          {isRegionOpen && (
            <div className="custom-select-options">
              {Object.keys(regionsData).map((regionName) => (
                <div 
                  key={regionName} 
                  className={`custom-option ${editRegion === regionName ? "selected" : ""}`}
                  onClick={() => {
                    setEditRegion(regionName);
                    if (typeof setEditDistrict === "function") {
                      setEditDistrict(""); 
                    }
                    setIsRegionOpen(false);
                  }}
                >
                  {regionName}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* DISTRICT */}
        <div className={`settings-input-block ${!editRegion ? "disabled-block" : ""}`} ref={districtRef}>
          <label><FaMapMarkerAlt className="form-icon-accent" /> {t.districtLabel}</label>
          <div 
            className={`custom-select-trigger ${isDistrictOpen ? "open" : ""} ${!editRegion ? "disabled" : ""}`}
            onClick={() => editRegion && setIsDistrictOpen(!isDistrictOpen)}
          >
            <span>{editDistrict || t.districtPlaceholder}</span>
            {isDistrictOpen ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}
          </div>
          
          {isDistrictOpen && editRegion && (
            <div className="custom-select-options">
              {districtsList.map((districtName) => (
                <div 
                  key={districtName} 
                  className={`custom-option ${editDistrict === districtName ? "selected" : ""}`}
                  onClick={() => {
                    if (typeof setEditDistrict === "function") {
                      setEditDistrict(districtName);
                    }
                    setIsDistrictOpen(false);
                  }}
                >
                  {districtName}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SUBMIT / LOGOUT */}
        <div className="settings-action-buttons">
          <button 
            className="settings-submit-btn" 
            onClick={handleSaveProfile}
            disabled={saveLoading}
          >
            <FaSave /> {saveLoading ? t.savingBtn : t.saveBtn}
          </button>

          <button className="settings-exit-btn" onClick={() => setShowLogoutModal(true)}>
            <FaSignOutAlt /> {t.logoutBtn}
          </button>
        </div>
      </div>

      {/* 3. YANGILANGAN DINAMIK MIJOZLARNI QO'LLAB-QUVVATLASH KARTASI */}
      <div className="settings-support-container-card">
        <div className="settings-support-heading">
          <FaHeadset className="support-blue-icon" />
          <h4>{t.supportTitle}</h4>
        </div>
        
        <div className="settings-support-vertical-list">
          {!loadingContacts ? (
            supportContacts.map((contact) => (
              <div key={contact.id} className="support-item-wrapper-box" style={{ width: "100%" }}>
                {editingId === contact.id ? (
                  /* INLINE EDIT FORMASI */
                  <div className="edit-support-inline-form-row" style={{ display: "flex", flexDirection: "column", gap: "10px", padding: "12px", background: "#f8fafc", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <input 
                        type="text" 
                        value={editLabel} 
                        onChange={(e) => setEditLabel(e.target.value)} 
                        placeholder={t.labelPlaceholder}
                        className="inline-input"
                        style={{ flex: 1, height: "36px", padding: "0 10px", fontSize: "13px", border: "1px solid #cbd5e1", borderRadius: "8px" }}
                      />
                      <div className="custom-dropdown-container inline-type-select" style={{ width: "110px", position: "relative" }}>
                        <div 
                          className="custom-dropdown-header" 
                          style={{ height: "36px", padding: "0 8px", fontSize: "12px", display: "flex", alignItems: "center", justifyContent: "space-between", border: "1px solid #cbd5e1", borderRadius: "8px", background: "#fff", cursor: "pointer" }}
                          onClick={() => setIsInlineTypeOpen(!isInlineTypeOpen)}
                        >
                          <span>{editType === "phone" ? "Tel" : "Telegram"}</span>
                          <FaChevronDown size={10} />
                        </div>
                        {isInlineTypeOpen && (
                          <div className="custom-dropdown-menu" style={{ position: "absolute", top: "100%", left: 0, width: "100%", zIndex: 99, background: "#fff", border: "1px solid #e2e8f0", borderRadius: "8px", boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }}>
                            <div className="custom-dropdown-item" style={{ padding: "8px", fontSize: "12px", cursor: "pointer" }} onClick={() => { setEditType("phone"); setIsInlineTypeOpen(false); }}>
                              Tel
                            </div>
                            <div className="custom-dropdown-item" style={{ padding: "8px", fontSize: "12px", cursor: "pointer" }} onClick={() => { setEditType("telegram"); setIsInlineTypeOpen(false); }}>
                              Telegram
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: "8px" }}>
                      <input 
                        type="text" 
                        value={editValue} 
                        onChange={(e) => setEditValue(e.target.value)} 
                        placeholder={editType === "phone" ? t.writeValuePhone : t.writeValueTg}
                        className="inline-input"
                        style={{ flex: 1, height: "36px", padding: "0 10px", fontSize: "13px", border: "1px solid #cbd5e1", borderRadius: "8px" }}
                      />
                      <div style={{ display: "flex", gap: "6px" }}>
                        <button onClick={() => handleUpdateContact(contact.id)} className="action-btn-save" style={{ background: "#10b981", color: "white", border: "none", width: "36px", height: "36px", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><FaSave size={14} /></button>
                        <button onClick={() => setEditingId(null)} className="action-btn-cancel" style={{ background: "#ef4444", color: "white", border: "none", width: "36px", height: "36px", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><FaTimes size={14} /></button>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* ODDIY KO'RINIY (LINK VA ADMIN TUGMALARI BILAN) */
                  <a 
                    href={getContactLink(contact.type, contact.value)} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="support-list-row"
                    style={{ display: "flex", justifyContent: "space-between", alignItems: "center", textDecoration: "none" }}
                  >
                    <div className="support-row-left" style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <div className={`support-icon-wrapper ${contact.type || 'default'}-bg`}>
                        {getContactIcon(contact.type, contact.label)}
                      </div>
                      <div className="support-row-details" style={{ display: "flex", flexDirection: "column" }}>
                        <span className="support-row-label" style={{ fontSize: "12px", color: "#888" }}>{contact.label}</span>
                        <span className="support-row-value" style={{ fontSize: "14px", fontWeight: "500", color: "#222" }}>{contact.value}</span>
                      </div>
                    </div>
                    
                    <div className="support-row-right-actions" style={{ display: "flex", alignItems: "center", gap: "8px" }} onClick={(e) => e.stopPropagation()}>
                      {isAdmin ? (
                        <>
                          <button 
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); startEdit(contact); }} 
                            className="btn-edit" 
                            style={{ background: "#eff6ff", color: "#2563eb", border: "none", width: "30px", height: "30px", borderRadius: "6px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                          >
                            <FaEdit size={12} />
                          </button>
                          <button 
                            onClick={(e) => handleDeleteContact(contact.id, e)} 
                            className="btn-delete" 
                            style={{ background: "#fef2f2", color: "#dc2626", border: "none", width: "30px", height: "30px", borderRadius: "6px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                          >
                            <FaTrash size={12} />
                          </button>
                        </>
                      ) : (
                        <div className="support-row-arrow">
                          <FaArrowRight size={12} />
                        </div>
                      )}
                    </div>
                  </a>
                )}
              </div>
            ))
          ) : (
            <p className="loading-contacts-text">
              {lang === "uz" ? "Kontaktlar yuklanmoqda..." : "Загрузка контактов..."}
            </p>
          )}
        </div>

        {/* 4. YANGI KONTAKT QO'SHISH FORMASI (FAQAT ADMINGA KO'RINADI) */}
        {isAdmin && (
          <form onSubmit={handleAddContact} className="add-contact-form" style={{ marginTop: "20px", paddingTop: "16px", borderTop: "1px solid #eef2f6", display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ display: "flex", gap: "10px" }}>
              <div className="field-group" style={{ flex: 1, display: "flex", flexDirection: "column", gap: "4px" }}>
                <input 
                  type="text" 
                  placeholder={t.labelPlaceholder} 
                  value={newLabel} 
                  onChange={(e) => setNewLabel(e.target.value)} 
                  className="modern-input"
                  style={{ height: "38px", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "0 12px", fontSize: "13px", outline: "none" }}
                />
              </div>

              <div className="field-group" ref={typeDropdownRef} style={{ width: "120px", display: "flex", flexDirection: "column", gap: "4px", position: "relative" }}>
                <div className="custom-dropdown-container">
                  <div 
                    className={`custom-dropdown-header ${isTypeDropdownOpen ? "active" : ""}`}
                    onClick={() => setIsTypeDropdownOpen(!isTypeDropdownOpen)}
                    style={{ height: "38px", padding: "0 10px", fontSize: "13px", display: "flex", alignItems: "center", justifyContent: "space-between", border: "1px solid #e2e8f0", borderRadius: "10px", background: "#fff", cursor: "pointer" }}
                  >
                    <span>{newType === "phone" ? "Tel" : "TG"}</span>
                    <FaChevronDown size={10} />
                  </div>
                  
                  {isTypeDropdownOpen && (
                    <div className="custom-dropdown-menu" style={{ position: "absolute", top: "100%", left: 0, width: "100%", zIndex: 99, background: "#fff", border: "1px solid #e2e8f0", borderRadius: "10px", boxShadow: "0 4px 10px rgba(0,0,0,0.1)", marginTop: "4px" }}>
                      <div 
                        className={`custom-dropdown-item ${newType === "phone" ? "selected" : ""}`}
                        style={{ padding: "8px 12px", fontSize: "13px", cursor: "pointer" }}
                        onClick={() => {
                          setNewType("phone");
                          setIsTypeDropdownOpen(false);
                        }}
                      >
                        {t.phoneOption}
                      </div>
                      <div 
                        className={`custom-dropdown-item ${newType === "telegram" ? "selected" : ""}`}
                        style={{ padding: "8px 12px", fontSize: "13px", cursor: "pointer" }}
                        onClick={() => {
                          setNewType("telegram");
                          setIsTypeDropdownOpen(false);
                        }}
                      >
                        {t.tgOption}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <input 
                type="text" 
                placeholder={newType === "phone" ? t.writeValuePhone : t.writeValueTg} 
                value={newValue} 
                onChange={(e) => setNewValue(e.target.value)} 
                className="modern-input"
                style={{ flex: 1, height: "38px", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "0 12px", fontSize: "13px", outline: "none" }}
                required 
              />
              <button type="submit" className="modern-add-btn" style={{ height: "38px", background: "#007bff", color: "white", border: "none", borderRadius: "10px", padding: "0 16px", fontWeight: "600", fontSize: "14px", cursor: "pointer" }}>
                {t.addBtn}
              </button>
            </div>
          </form>
        )}
      </div>

    </div>
  );
}