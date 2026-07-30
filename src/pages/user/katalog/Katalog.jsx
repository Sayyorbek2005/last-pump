import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { supabase } from '../../../supabase/client'; 
import './katalog.css'; 

// === BARCHA STATIK RASMLAR IMPORTI ===
import img2STM1 from "./assets2/2STM-1.png";
import img2STM2 from "./assets2/2STM-2.png";
import img2TCP from "./assets2/2TCP25-160A.png";
import img4GS1 from "./assets2/4GS-1.png";
import img4GS from "./assets2/4GS.png";
import img4SMF from "./assets2/4SM-F.png";
import img4TMS from "./assets2/4TMS.png";
import img5KSE1 from "./assets2/5KSE-1.png";
import img6SP1 from "./assets2/6SP-1.png";
import img6SP46D4 from "./assets2/6SP46-D4.png";
import imgATJSW from "./assets2/ATJSW.png";
import imgCHLFT from "./assets2/CHLF(T)гиpng.png"; 
import imgCHL from "./assets2/CHLгиpng.png";
import imgCHM from "./assets2/CHMгиpng.png";
import imgCPm from "./assets2/CPm.png";
import imgGP from "./assets2/GP.png";
import imgGRSF from "./assets2/GRS-F.png";
import imgGRSH from "./assets2/GRS=н.png";
import imgGRS25_4_6 from "./assets2/GRS25-4-6.png";
import imgImageFoue from "./assets2/imagefoue.png";
import imgImageOne from "./assets2/imageone.png";
import imgImageThree from "./assets2/imagethree.png";
import imgImageTwo from "./assets2/imagetwo.png";
import imgJET from "./assets2/JET.png";
import imgJET400S from "./assets2/JET400S.png";
import imgPWE from "./assets2/PW-E.png";
import imgPW from "./assets2/PW.png";
import imgQB from "./assets2/QB.png";
import imgQDT2 from "./assets2/QD-¦T (2).png";
import imgQDX from "./assets2/QDX.png";
import imgQFD from "./assets2/QFD.png";
import imgQYT1 from "./assets2/QY-¦T (1).png";
import imgSTAR6A from "./assets2/STAR-6A.png";
import imgSTSR40_10F from "./assets2/STSR40-10F.png";
import imgTCM from "./assets2/TCM.png";
import imgTHF from "./assets2/THF.png";
import imgTNF from "./assets2/TNF.png";
import imgTWT from "./assets2/TW-T.png";
import imgWFD from "./assets2/WFD.png";
import imgWQD from "./assets2/WQD.png";
import imgWSD from "./assets2/WSD.png";

const imageMapping = {
  "2STM-1.png": img2STM1,
  "2STM-2.png": img2STM2,
  "2TCP25-160A.png": img2TCP,
  "4GS-1.png": img4GS1,
  "4GS.png": img4GS,
  "4SM-F.png": img4SMF,
  "4TMS.png": img4TMS,
  "5KSE-1.png": img5KSE1,
  "6SP-1.png": img6SP1,
  "6SP46-D4.png": img6SP46D4,
  "ATJSW.png": imgATJSW,
  "CHLF(T)гиpng.png": imgCHLFT,
  "CHLгиpng.png": imgCHL,
  "CHMгиpng.png": imgCHM,
  "CPm.png": imgCPm,
  "GP.png": imgGP,
  "GRS-F.png": imgGRSF,
  "GRS=н.png": imgGRSH,
  "GRS25-4-6.png": imgGRS25_4_6,
  "imagefoue.png": imgImageFoue,
  "imageone.png": imgImageOne,
  "imagethree.png": imgImageThree,
  "imagetwo.png": imgImageTwo,
  "JET.png": imgJET,
  "JET400S.png": imgJET400S,
  "PW-E.png": imgPWE,
  "PW.png": imgPW,
  "QB.png": imgQB,
  "QD-¦T (2).png": imgQDT2,
  "QDX.png": imgQDX,
  "QFD.png": imgQFD,
  "QY-¦T (1).png": imgQYT1,
  "STAR-6A.png": imgSTAR6A,
  "STSR40-10F.png": imgSTSR40_10F,
  "TCM.png": imgTCM,
  "THF.png": imgTHF,
  "TNF.png": imgTNF,
  "TW-T.png": imgTWT,
  "WFD.png": imgWFD,
  "WQD.png": imgWQD,
  "WSD.png": imgWSD
};

const translations = {
  uz: {
    title: "Nasoslar Katalogi",
    mainCatalog: "Asosiy Katalog",
    loading: "Yuklanmoqda...",
    selectType: "1. Katalog turini tanlang",
    productsCount: "ta model",
    agreedPrice: "Kelishilgan narx",
    viewMore: "Batafsil →",
    productId: "Mahsulot ID",
    pumpType: "Katalog turi",
    price: "Narxi",
    description: "Tavsif",
    noDescription: "Tavsif kiritilmagan",
    specs: "Texnik xususiyatlari",
    noSpecs: "Xususiyatlar kiritilmagan",
    noProducts: "Mos keladigan mahsulotlar topilmadi.",
    close: "Yopish",
    goHome: "Asosiy sahifaga qaytish",
    back: "← Orqaga"
  },
  ru: {
    title: "Каталог Насосов",
    mainCatalog: "Главный Каталог",
    loading: "Загрузка...",
    selectType: "1. Выберите категорию",
    productsCount: "моделей",
    agreedPrice: "Договорная цена",
    viewMore: "Подробнее →",
    productId: "ID Продукта",
    pumpType: "Тип категории",
    price: "Цена",
    description: "Описание",
    noDescription: "Описание отсутствует",
    specs: "Технические характеристики",
    noSpecs: "Характеристики не указаны",
    noProducts: "Совпадающие товары не найдены.",
    close: "Закрыть",
    goHome: "Вернуться на главную",
    back: "← Назад"
  }
};

export default function UserCatalog({ displayCurrency: parentCurrency, usdRate: parentRate, onBack, lang: parentLang }) {
  const [products, setProducts] = useState([]);
  const [categoryOrder, setCategoryOrder] = useState([]); // Admin panel tartibi uchun
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState(parentLang || localStorage.getItem('lang') || 'uz');
  
  const [rate, setRate] = useState(parentRate || 12800);
  const [displayCurrency, setDisplayCurrency] = useState(parentCurrency || localStorage.getItem('app_currency') || 'usd'); 

  useEffect(() => {
    if (parentCurrency) setDisplayCurrency(parentCurrency);
  }, [parentCurrency]);

  useEffect(() => {
    if (parentRate) setRate(parentRate);
  }, [parentRate]);

  useEffect(() => {
    if (parentLang) setLang(parentLang);
  }, [parentLang]);

  const [selectedType, setSelectedType] = useState(null); 
  const [viewingProductDetails, setViewingProductDetails] = useState(null); 

  const getProductImageUrl = (url) => {
    if (!url) return null;
    const trimmed = url.trim();
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      return trimmed;
    }
    return imageMapping[trimmed] || null;
  };

  const formatPrice = useCallback((itemPrice, itemCurrency = 'usd') => {
    if (itemPrice === undefined || itemPrice === null || itemPrice === '' || itemPrice === 0) {
      return translations[lang]?.agreedPrice || 'Kelishilgan narx';
    }
    const numPrice = Number(itemPrice);

    if (displayCurrency === 'uzs') {
      const somVal = (itemCurrency === 'usd') ? numPrice * rate : numPrice;
      return `${Math.round(somVal).toLocaleString('uz-UZ')} so'm`;
    } else {
      const usdVal = (itemCurrency === 'uzs' || itemCurrency === 'sum') ? (numPrice / rate) : numPrice;
      return `$${usdVal % 1 === 0 ? usdVal : usdVal.toFixed(2)}`;
    }
  }, [displayCurrency, rate, lang]);

  // Ma'lumotlarni va sozlamalarni tortib kelish
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      // 1. Mahsulotlarni olish
      const { data: prodData } = await supabase
        .from('products')
        .select('*')
        .order('sort_order', { ascending: true, nullsFirst: false });
      setProducts(prodData || []);

      // 2. Admin panelning kategoriya tartibi va kursini shop_settings'dan olish
      const { data: settingsData } = await supabase
        .from('shop_settings')
        .select('usd_rate, category_order')
        .eq('id', 1)
        .single();

      if (settingsData) {
        if (settingsData.usd_rate) setRate(settingsData.usd_rate);
        if (settingsData.category_order && Array.isArray(settingsData.category_order)) {
          setCategoryOrder(settingsData.category_order);
        }
      }
    } catch (err) {
      console.error('Kutilmagan xatolik:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();

    // Realtime orqali admin o'zgarishlarini bir zumda yangilash
    const channel = supabase
      .channel('public:shop_and_products')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => fetchData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'shop_settings' }, () => fetchData())
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchData]);

  const getProductTypeValue = useCallback((p) => {
    const arr = p.characteristics || p.specs || [];
    if (Array.isArray(arr) && arr.length > 0) {
      const searchKey = lang === 'ru' ? "Тип" : "Turi";
      const found = arr.find(c => c?.key === searchKey || c?.key === "Turi" || c?.key === "Тип");
      if (found?.value) return found.value.trim();
    }
    return p.type || p.category || "Boshqa";
  }, [lang]);

  // Admin paneldagi tartibni to'liq takrorlaydigan ro'yxat
  const allPumpTypes = useMemo(() => {
    const typesFromProducts = [...new Set(products.map(p => getProductTypeValue(p)).filter(Boolean))];
    
    if (categoryOrder.length > 0) {
      // Admin panelda saqlangan tartib bo'yicha saralash
      const sorted = [];
      categoryOrder.forEach(cat => {
        if (typesFromProducts.includes(cat)) {
          sorted.push(cat);
        }
      });
      // Ro'yxatda bor-u, lekin categoryOrder'ga kirmaganlari qolsa oxiriga qo'shamiz
      typesFromProducts.forEach(cat => {
        if (!sorted.includes(cat)) {
          sorted.push(cat);
        }
      });
      return sorted;
    }
    return typesFromProducts;
  }, [products, categoryOrder, getProductTypeValue]);

  const filteredProducts = useMemo(() => {
    if (!selectedType) return [];
    return products.filter(p => getProductTypeValue(p) === selectedType);
  }, [products, selectedType, getProductTypeValue]);

  const t = translations[lang] || translations['uz'];

  return (
    <div className="user-katalog-wrapper">
      <div className="user-katalog-max">
        
        <div className="user-katalog-navigation-bar">
          <button onClick={onBack || (() => window.location.href = "/")} className="user-go-home-btn">
            <span className="btn-icon">←</span>
            <span>{t.goHome}</span>
          </button>
        </div>

        {loading ? (
          <div className="user-spinner-box">
            <div className="user-spinner"></div>
            <p style={{ marginTop: '10px', color: '#666' }}>{t.loading}</p>
          </div>
        ) : (
          <>
            {!selectedType && (
              <div>
                <div className="user-section-title">
                  <h2>{t.selectType}</h2>
                </div>
                
                <div className="user-types-grid">
                  {allPumpTypes.map(turi => {
                    const count = products.filter(p => getProductTypeValue(p) === turi).length;
                    return (
                      <div 
                        key={turi}
                        onClick={() => setSelectedType(turi)}
                        className="user-type-card"
                      >
                        <div className="type-info">
                          <span className="user-type-name">📁 {turi}</span>
                          <p className="user-type-sub">{count} {t.productsCount}</p>
                        </div>
                        <span className="user-type-arrow">→</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {selectedType && (
              <div>
                <div className="user-inner-header">
                  <button onClick={() => setSelectedType(null)} className="user-back-btn">
                    {t.back}
                  </button>
                  <div className="user-section-title" style={{ margin: 0 }}>
                    <h2>📁 {selectedType}</h2>
                  </div>
                </div>

                <div className="user-products-grid">
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map(item => {
                      const imgSource = getProductImageUrl(item.image_url);
                      return (
                        <div 
                          key={item.id} 
                          className="admin-product-card" 
                          onClick={() => setViewingProductDetails(item)}
                          style={{ cursor: 'pointer' }}
                        >
                          <div className="prod-img-box">
                            <span className="prod-tag">{selectedType}</span>
                            {imgSource ? (
                              <img 
                                src={imgSource} 
                                alt={item.title_uz || "Mahsulot rasmi"} 
                                className="product-main-img" 
                              />
                            ) : (
                              <span className="placeholder-icon">📦</span>
                            )}
                          </div>
                          
                          <div className="prod-details-box">
                            <div className="title-row">
                              <h3>{lang === 'uz' ? (item.title_uz || item.title_ru) : (item.title_ru || item.title_uz)}</h3>
                              <span className="prod-id-tag">ID: {item.id}</span>
                            </div>
                            
                            <p className="prod-desc-text">
                              {item.description_uz || item.description_ru || item.description || t.noDescription}
                            </p>
                            
                            <div className="prod-footer-row">
                              <p className="prod-price-text">
                                {formatPrice(item.price, item.currency)}
                              </p>
                              <span className="user-action-view-btn">{t.viewMore}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="user-no-data">
                      <p>{t.noProducts}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}

        {viewingProductDetails && (
          <div className="user-modal-overlay" onClick={() => setViewingProductDetails(null)}>
            <div className="user-modal-card" onClick={(e) => e.stopPropagation()}>
              <div className="user-modal-header">
                <h3>{lang === 'uz' ? (viewingProductDetails.title_uz || viewingProductDetails.title_ru) : (viewingProductDetails.title_ru || viewingProductDetails.title_uz)}</h3>
                <button className="user-modal-close" onClick={() => setViewingProductDetails(null)}>×</button>
              </div>
              
              <div className="user-modal-body">
                <div className="user-modal-image-wrapper">
                  {getProductImageUrl(viewingProductDetails.image_url) ? (
                    <img 
                      src={getProductImageUrl(viewingProductDetails.image_url)} 
                      alt="Katta rasm" 
                      className="user-modal-large-img"
                    />
                  ) : (
                    <span style={{ fontSize: '40px' }}>📦</span>
                  )}
                </div>

                <div className="user-detail-grid">
                  <div className="detail-box">
                    <span className="detail-label">{t.productId}</span>
                    <p className="detail-val text-mono">{viewingProductDetails.id}</p>
                  </div>
                  <div className="detail-box">
                    <span className="detail-label">{t.pumpType}</span>
                    <p className="detail-val font-green">{getProductTypeValue(viewingProductDetails)}</p>
                  </div>
                  <div className="detail-box">
                    <span className="detail-label">{t.price}</span>
                    <p className="detail-val price-highlight">
                      {formatPrice(viewingProductDetails.price, viewingProductDetails.currency)}
                    </p>
                  </div>
                </div>

                <div className="user-modal-specs">
                  <span className="detail-label">{t.specs}</span>
                  <div className="specs-scroll">
                    {(() => {
                      const specs = viewingProductDetails.characteristics || viewingProductDetails.specs || [];
                      if (specs.length === 0) return <p className="no-specs">{t.noSpecs}</p>;
                      return specs.map((s, idx) => (
                        <div key={idx} className="spec-line">
                          <span className="s-key">{s.key}:</span>
                          <span className="s-val">{s.value}</span>
                        </div>
                      ));
                    })()}
                  </div>
                </div>
              </div>
              
              <div className="user-modal-footer">
                <button className="btn-close-modal" onClick={() => setViewingProductDetails(null)}>{t.close}</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}