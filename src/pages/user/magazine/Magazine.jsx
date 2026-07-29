import React, { useState, useEffect, useCallback } from "react"; 
import { supabase } from "../../../supabase/client";
import { toast } from "react-toastify";
import { FaCoins, FaGift, FaShoppingBag, FaClock, FaCheckCircle, FaTimesCircle, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { FiArrowLeft } from "react-icons/fi"; 
import "../magazine/magazine.css";

export default function UserMagazin({ 
  currentUser, 
  lang = "uz", 
  onBack,
  displayCurrency: parentCurrency, 
  usdRate: parentRate 
}) { 
  const [prizes, setPrizes] = useState([]);
  const [myOrders, setMyOrders] = useState([]);
  const [userBonus, setUserBonus] = useState(0);
  const [loadingOrderId, setLoadingOrderId] = useState(null);
  const [showOrders, setShowOrders] = useState(false); 

  // === DYNAMIC CURRENCY & RATE STATES ===
  const [rate, setRate] = useState(parentRate || 12800);
  const [displayCurrency, setDisplayCurrency] = useState(parentCurrency || localStorage.getItem('app_currency') || 'usd');

  // React to prop updates from Header/Parent
  useEffect(() => {
    if (parentCurrency) setDisplayCurrency(parentCurrency);
  }, [parentCurrency]);

  useEffect(() => {
    if (parentRate) setRate(parentRate);
  }, [parentRate]);

  // Sync with localStorage changes
  useEffect(() => {
    const handleStorageChange = () => {
      const localCurr = localStorage.getItem('app_currency');
      if (localCurr && !parentCurrency) {
        setDisplayCurrency(localCurr);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [parentCurrency]);

  // Fetch rate from DB if not passed via props
  const fetchRateSetting = useCallback(async () => {
    if (parentRate) return;
    try {
      const { data } = await supabase
        .from('shop_settings')
        .select('usd_rate')
        .eq('id', 1)
        .single();

      if (data && data.usd_rate) {
        setRate(data.usd_rate);
      }
    } catch (err) {
      console.error("Error fetching rate:", err);
    }
  }, [parentRate]);

  // Helper function to format price based on selected currency
  const formatPrice = useCallback((amountInUsd) => {
    const num = Number(amountInUsd) || 0;
    if (displayCurrency === 'uzs') {
      const somVal = num * rate;
      return `${Math.round(somVal).toLocaleString('uz-UZ')} so'm`;
    } else {
      return `$${num % 1 === 0 ? num : num.toFixed(2)}`;
    }
  }, [displayCurrency, rate]);

  const translations = {
    uz: {
      backBtn: "Asosiy sahifaga qaytish", 
      storeTitle: "🎁 Sovg'alar do'koni",
      storeSub: "Yig'gan mablag'laringizni ajoyib sovg'alarga almashtiring!",
      yourBalance: "Sizning balansingiz:",
      availablePrizes: "Mavjud sovg'alar",
      noPrizes: "Hozircha do'konda sovg'alar yo'q.",
      orderHistory: "Buyurtmalaringiz tarixi",
      noOrders: "Sizda hali buyurtmalar mavjud emas.",
      thName: "Sovg'a nomi",
      thPoints: "Sarflangan mablag'",
      thDate: "Sana",
      thStatus: "Status",
      deletedPrize: "O'chirilgan mahsulot",
      statusPending: "Kutilmoqda",
      statusApproved: "Topshirildi",
      statusRejected: "Rad etildi",
      btnLoading: "Yuborilmoqda...",
      btnNotAvailable: "Do'kon yopiq",
      btnBuy: "Sotib olish",
      btnNoPoints: "Mablag' yetarli emas",
      toastFetchError: "Ma'lumotlarni yuklashda xatolik: ",
      toastStockOut: "Kechirasiz, bu mahsulot sotuvda tugagan yoki admin tomonidan muzlatilgan! 🔒",
      toastNoPoints: "Kechirasiz, balansingizda yetarli mablag' mavjud emas! 😔",
      toastSuccess: "Buyurtma qabul qilindi! Admin tasdiqlashini kuting. 🎁",
      toastError: "Xatolik yuz berdi: ",
      confirmPrefix: '"',
      confirmSuffix: '" sovg\'asini ',
      viewOrdersBtn: "Buyurtmalar tarixini ko'rish", 
      closeOrdersBtn: "Tarixni yopish" 
    },
    ru: {
      backBtn: "Вернуться на главную", 
      storeTitle: "🎁 Магазин подарков",
      storeSub: "Обменивайте накопленные средства на отличные подарки!",
      yourBalance: "Ваш баланс:",
      availablePrizes: "Доступные подарки",
      noPrizes: "В магазине пока нет подарков.",
      orderHistory: "История ваших заказов",
      noOrders: "У вас еще нет заказов.",
      thName: "Название подарка",
      thPoints: "Потраченные средства",
      thDate: "Дата",
      thStatus: "Статус",
      deletedPrize: "Удаленный товар",
      statusPending: "В ожидании",
      statusApproved: "Вручено",
      statusRejected: "Отклонено",
      btnLoading: "Отправка...",
      btnNotAvailable: "Магазин закрыт",
      btnBuy: "Купить",
      btnNoPoints: "Недостаточно средств",
      toastFetchError: "Ошибка при загрузке данных: ",
      toastStockOut: "Извините, этот товар закончился или заблокирован админом! 🔒",
      toastNoPoints: "Извините, на вашем балансе недостаточно средств! 😔",
      toastSuccess: "Заказ принят! Ожидайте подтверждения админа. 🎁",
      toastError: "Произошла ошибка: ",
      confirmPrefix: 'Вы хотите купить подарок "',
      confirmSuffix: '" за ',
      viewOrdersBtn: "Посмотреть историю заказов", 
      closeOrdersBtn: "Свернуть историю" 
    }
  };

  const t = translations[lang] || translations["uz"];

  const fetchData = useCallback(async () => {
    if (!currentUser?.id) return;
    try {
      // 🌟 ADMIN PANEL BILAN BIR HIL TARTIBDA O'QISH
      const { data: pData, error: pErr } = await supabase
        .from("prizes")
        .select("*")
        .order("position", { ascending: true, nullsFirst: true })
        .order("created_at", { ascending: false });
        
      if (pErr) throw pErr;
      setPrizes(pData || []);

      const { data: profData, error: profErr } = await supabase
        .from("profiles")
        .select("bonus")
        .eq("id", currentUser.id)
        .single();
      if (profErr) throw profErr;
      setUserBonus(profData?.bonus || 0);

      if (showOrders) {
        const { data: oData, error: oErr } = await supabase
          .from("orders")
          .select("id, status, created_at, prizes(name, price)")
          .eq("user_id", currentUser.id)
          .order("created_at", { ascending: false });
        if (oErr) throw oErr;
        setMyOrders(oData || []);
      }

    } catch (err) {
      toast.error(t.toastFetchError + err.message);
    }
  }, [currentUser?.id, showOrders, t.toastFetchError]);

  useEffect(() => {
    fetchData();
    fetchRateSetting();
  }, [fetchData, fetchRateSetting]);

  const handleBuyPrize = async (prize) => {
    if (prize.stock <= 0) {
      return toast.error(t.toastStockOut);
    }

    if (userBonus < prize.price) {
      return toast.error(t.toastNoPoints);
    }

    const priceFormatted = formatPrice(prize.price);
    const confirmMessage = lang === "ru"
      ? `${t.confirmPrefix}${prize.name}${t.confirmSuffix}${priceFormatted}?`
      : `${t.confirmPrefix}${prize.name}${t.confirmSuffix}${priceFormatted} ga sotib olmoqchimisiz?`;

    const confirmBuy = window.confirm(confirmMessage);
    if (!confirmBuy) return;

    setLoadingOrderId(prize.id);
    try {
      const newBonus = userBonus - prize.price;
      const newStock = prize.stock - 1;

      const { error: profileErr } = await supabase
        .from("profiles")
        .update({ bonus: newBonus })
        .eq("id", currentUser.id);
      if (profileErr) throw profileErr;

      const { error: prizeErr } = await supabase
        .from("prizes")
        .update({ stock: newStock })
        .eq("id", prize.id);
      if (prizeErr) throw prizeErr;

      const { error: orderErr } = await supabase
        .from("orders")
        .insert([
          {
            user_id: currentUser.id,
            prize_id: prize.id,
            status: "pending"
          }
        ]);
      if (orderErr) throw orderErr;

      toast.success(t.toastSuccess);
      fetchData(); 
    } catch (err) {
      toast.error(t.toastError + err.message);
    } finally {
      setLoadingOrderId(null);
    }
  };

  return (
    <div className="user-magazin-container">
      
      {onBack && (
        <div style={{ marginBottom: "15px", display: "flex", justifyContent: "flex-start" }}>
          <button 
            className="katalog-back-btn main-home-back-btn" 
            onClick={onBack}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 16px",
              background: "#ffffff",
              border: "1px solid #cbd5e1",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "600",
              color: "#334155",
              transition: "all 0.2s ease"
            }}
          >
            <FiArrowLeft size={18} /> {t.backBtn}
          </button>
        </div>
      )}

      <div className="magazin-header-card">
        <div className="header-info">
          <h2>{t.storeTitle}</h2>
          <p>{t.storeSub}</p>
        </div>
        <div className="user-balance-badge">
          <FaCoins className="coin-icon" />
          <div className="balance-text">
            <span>{t.yourBalance}</span>
            <strong>{formatPrice(userBonus)}</strong>
          </div>
        </div>
      </div>

      <h3 className="section-title"><FaShoppingBag /> {t.availablePrizes}</h3>
      <div className="prizes-grid">
        {prizes.length === 0 ? (
          <p className="empty-text">{t.noPrizes}</p>
        ) : (
          prizes.map((prize) => {
            const isAffordable = userBonus >= prize.price;
            const isAvailable = prize.stock > 0;

            return (
              <div className={`prize-card ${!isAffordable || !isAvailable ? "locked" : ""}`} key={prize.id}>
                <div className="prize-icon-wrapper" style={{ overflow: "hidden", height: "150px", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc" }}>
                  {prize.image_url ? (
                    <img 
                      src={prize.image_url} 
                      alt={prize.name} 
                      style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                    />
                  ) : (
                    <FaGift style={{ fontSize: "40px", color: "#cbd5e1" }} />
                  )}
                </div>

                <div className="prize-details">
                  <h4>{prize.name}</h4>
                  <div className="prize-price-tag">
                    <FaCoins /> {formatPrice(prize.price)}
                  </div>
                  
                  <button
                    className={`buy-btn ${isAffordable && isAvailable ? "active" : "disabled"}`}
                    onClick={() => handleBuyPrize(prize)}
                    disabled={!isAffordable || !isAvailable || loadingOrderId === prize.id}
                  >
                    {loadingOrderId === prize.id 
                      ? t.btnLoading 
                      : !isAvailable 
                        ? t.btnNotAvailable 
                        : isAffordable 
                          ? t.btnBuy 
                          : t.btnNoPoints}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      <h3 className="section-title"><FaClock /> {t.orderHistory}</h3>
      
      {!showOrders ? (
        <div style={{ textAlign: "center", padding: "30px 20px" }}>
          <button 
            className="view-orders-trigger-btn"
            style={{
              padding: "12px 24px",
              backgroundColor: "#2563eb",
              color: "#ffffff",
              border: "none",
              borderRadius: "8px",
              fontWeight: "600",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              boxShadow: "0 4px 6px rgba(37,99,235,0.15)",
              transition: "background 0.2s"
            }}
            onClick={() => setShowOrders(true)}
          >
            <FaClock /> {t.viewOrdersBtn} <FaChevronDown />
          </button>
        </div>
      ) : (
        <div className="orders-history-card">
          {myOrders.length === 0 ? (
            <p className="empty-text">{t.noOrders}</p>
          ) : (
            <>
              <div className="user-orders-table-wrapper">
                <table className="user-orders-table">
                  <thead>
                    <tr>
                      <th>{t.thName}</th>
                      <th>{t.thPoints}</th>
                      <th>{t.thDate}</th>
                      <th>{t.thStatus}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myOrders.map((order) => (
                      <tr key={order.id}>
                        <td><strong>{order.prizes?.name || t.deletedPrize}</strong></td>
                        <td className="table-price">{formatPrice(order.prizes?.price || 0)}</td>
                        <td>{new Date(order.created_at).toLocaleDateString(lang === "ru" ? "ru-RU" : "uz-UZ")}</td>
                        <td>
                          <span className={`user-status-badge ${order.status}`}>
                            {order.status === "pending" && <><FaClock /> {t.statusPending}</>}
                            {order.status === "approved" && <><FaCheckCircle /> {t.statusApproved}</>}
                            {order.status === "rejected" && <><FaTimesCircle /> {t.statusRejected}</>}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div style={{ textAlign: "center", marginTop: "15px" }}>
                <button 
                  style={{
                    background: "none",
                    border: "none",
                    color: "#64748b",
                    cursor: "pointer",
                    fontWeight: "600",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "5px",
                    fontSize: "14px"
                  }}
                  onClick={() => setShowOrders(false)}
                >
                  {t.closeOrdersBtn} <FaChevronUp />
                </button>
              </div>
            </>
          )}
        </div>
      )}

    </div>
  );
}