import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { supabase } from "../../../supabase/client";
import { FaBars, FaTimes } from "react-icons/fa";

import Sidebar from "../sidebar/Sidebar";
import DashboardTab from "../dashboard/Dashbard";
import MastersTab from "../ustalar/Ustalar";
import GeneratorTab from "../kodgenarator/Kodgenerator";
import MagazinTab from "../magazine/Magazine"; 
import HistoryTab from "../kodtarixi/Kodtarixi";
import AksiyaTab from "../aksiya/Aksiya";
import MaslahatlarTab from "../news/News";
import ProfilTab from "../profil/Profil"; 
import KatalogTab from "../katalog/Katalog"; 
import MapAdmin from "../map/Map"; 

import "./adminDash.css";

export default function AdminDash() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState(localStorage.getItem("app_lang") || "uz");

  const [stats, setStats] = useState({ totalUsers: 0, activeMasters: 0, totalCodes: 0, newClients: 0 });
  const [topMasters, setTopMasters] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [mastersList, setMastersList] = useState([]);
  const [allPromoCodes, setAllPromoCodes] = useState([]); 
  const [codeQuantity, setCodeQuantity] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");

  const [selectedCategory, setSelectedCategory] = useState(null);

  const navigate = useNavigate();

  // 🌐 TILNI ALMASHTIRISH VA NOTIFICATION
  const changeLanguage = async (newLang) => {
    setLang(newLang);
    localStorage.setItem("app_lang", newLang);
    
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const localUser = JSON.parse(storedUser);
      try {
        await supabase
          .from("profiles")
          .update({ language: newLang })
          .eq("id", localUser.id);
          
        localUser.language = newLang;
        localStorage.setItem("user", JSON.stringify(localUser));
        toast.success(newLang === "uz" ? "Til o'zgartirildi!" : "Язык изменен!");
      } catch (error) {
        console.error("Tilni saqlashda xatolik:", error);
      }
    }
  };

  // USTA STATUSINI FAOL/NOFAOL QILISH
  const handleToggleMasterStatus = async (masterId, currentStatus) => {
    const newStatus = currentStatus === false ? true : false;
    
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ is_active: newStatus })
        .eq("id", masterId);

      if (error) throw error;

      setMastersList((prevList) =>
        prevList.map((master) =>
          master.id === masterId ? { ...master, is_active: newStatus } : master
        )
      );

      toast.success(
        lang === "uz" 
          ? "Usta holati muvaffaqiyatli o'zgartirildi!" 
          : "Статус мастера успешно изменен!"
      );
    } catch (error) {
      console.error("Statusni o'zgartirishda xatolik:", error);
      toast.error(
        lang === "uz" 
          ? "Xatolik yuz berdi!" 
          : "Произошла ошибка!"
      );
    }
  };

  // DASHBOARD MA'LUMOTLARINI OLIB KELISH
  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const [historyRes, profilesRes, promoRes] = await Promise.all([
        supabase.from("used_codes").select(`id, created_at, user_id, profiles (full_name, phone, region, bonus), promo_codes (code)`).order("created_at", { ascending: false }),
        supabase.from("profiles").select("*").order("bonus", { ascending: false }),
        supabase.from("promo_codes").select("*").order("created_at", { ascending: false })
      ]);

      setPendingRequests(historyRes.data || []);
      setMastersList(profilesRes.data || []);
      setAllPromoCodes(promoRes.data || []);

      setStats({
        totalUsers: profilesRes.data?.length || 0,
        activeMasters: profilesRes.data?.filter(m => m.is_active !== false).length || 0,
        totalCodes: promoRes.data?.length || 0,
        newClients: Math.floor(profilesRes.data?.length * 0.1) || 0
      });

      const chartData = (profilesRes.data || []).map(u => ({
        name: u.full_name || u.phone || "Noma'lum",
        dollar: Number(u.bonus) || 0, 
        kiritishlarSonini: (historyRes.data || []).filter(req => req.user_id === u.id).length
      }));
      setTopMasters(chartData);

    } catch (error) {
      toast.error("Ma'lumotlarni yuklashda xatolik");
    } finally {
      setLoading(false);
    }
  }, []);

  // ADMIN STATUSINI TEKSHIRISH
  useEffect(() => {
    const checkAdminStatus = async () => {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) return navigate("/login");
      const localUser = JSON.parse(storedUser);
      
      const { data: profile } = await supabase.from("profiles").select("role, is_active, language").eq("id", localUser.id).single();
      if (!profile || profile.role !== "admin" || !profile.is_active) {
        toast.error("Sizda admin huquqlari yo'q!");
        return navigate("/user-dashboard");
      }
      if (profile.language) setLang(profile.language);
      fetchDashboardData();
    };
    checkAdminStatus();
  }, [navigate, fetchDashboardData]);

  // TIZIMDAN CHIQISH
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const sortedChartData = [...topMasters].sort((a, b) => sortOrder === "asc" ? a.dollar - b.dollar : b.dollar - a.dollar).slice(0, 10);

  return (
    <div className="dash-container">
      {/* Mobil Menu tugmasi */}
      <button className="mobile-menu-toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
        {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Yon Panel (Sidebar) */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        mastersCount={mastersList.length} 
        codesCount={allPromoCodes.length}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        lang={lang} 
      />

      {isMobileMenuOpen && <div className="sidebar-overlay" onClick={() => setIsMobileMenuOpen(false)}></div>}

      {/* Asosiy Kontent Qismi */}
      <main className="dash-main">
        <section className="dash-content">
          {activeTab === "dashboard" && (
            <DashboardTab stats={stats} sortOrder={sortOrder} setSortOrder={setSortOrder} sortedChartData={sortedChartData} pendingRequests={pendingRequests} lang={lang} />
          )}

          {activeTab === "ustalar" && (
            <MastersTab 
              mastersList={mastersList} 
              navigate={navigate} 
              toggleMasterStatus={handleToggleMasterStatus} 
              lang={lang} 
            />
          )}

          {activeTab === "random" && (
            <GeneratorTab codeQuantity={codeQuantity} setCodeQuantity={setCodeQuantity} loading={loading} allPromoCodes={allPromoCodes} lang={lang} />
          )}

          {/* 📂 KATALOG TAB: Til sinxronizatsiyasi uchun lang propini uzatdik */}
          {activeTab === "katalog" && (
            <KatalogTab 
              lang={lang} 
              selectedCategory={selectedCategory} 
              setSelectedCategory={setSelectedCategory} 
            />
          )}

          {activeTab === "magazin" && (
            <MagazinTab lang={lang} />
          )}

          {activeTab === "xarita" && (
            <MapAdmin lang={lang} />
          )}

          {activeTab === "history" && (
            <HistoryTab lang={lang} />
          )}
          
          {activeTab === "aksiya" && (
            <AksiyaTab lang={lang} />
          )}

          {activeTab === "maslahatlar" && (
            <MaslahatlarTab lang={lang} />
          )}

          {activeTab === "profil" && (
            <ProfilTab 
              handleLogout={handleLogout} 
              lang={lang} 
              changeLanguage={changeLanguage} 
            />
          )}
        </section>
      </main>
    </div>
  );
}