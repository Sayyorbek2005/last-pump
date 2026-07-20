import React, { useState, useEffect, useMemo } from 'react';
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

// === RASMLAR XARITASI ===
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
    selectType: "1. Nasos turini tanlang",
    selectCategory: "2. Mahsulot turkumini tanlang",
    productsCount: "ta model",
    viewModels: "Turkumlarni ko'rish",
    agreedPrice: "Kelishilgan narx",
    viewMore: "Batafsil →",
    productId: "Mahsulot ID",
    category: "Turkum",
    pumpType: "Nasos turi",
    price: "Narxi",
    description: "Tavsif (Description)",
    noDescription: "Tavsif kiritilmagan",
    specs: "Texnik xususiyatlari",
    noSpecs: "Xususiyatlar kiritilmagan",
    noProducts: "Mos keladigan mahsulotlar topilmadi.",
    close: "Yopish",
    goHome: "Asosiy sahifaga qaytish"
  },
  ru: {
    title: "Каталог Насосов",
    mainCatalog: "Главный Каталог",
    loading: "Загрузка...",
    selectType: "1. Выберите тип насоса",
    selectCategory: "2. Выберите категорию товара",
    productsCount: "моделей",
    viewModels: "Посмотреть категории",
    agreedPrice: "Договорная цена",
    viewMore: "Подробнее →",
    productId: "ID Продукта",
    category: "Категория",
    pumpType: "Тип насоса",
    price: "Цена",
    description: "Описание",
    noDescription: "Описание отсутствует",
    specs: "Технические характеристики",
    noSpecs: "Характеристики не указаны",
    noProducts: "Совпадающие товары не найдены.",
    close: "Закрыть",
    goHome: "Вернуться на главную"
  }
};

export default function UserCatalog() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [lang, setLang] = useState(localStorage.getItem('lang') || 'uz');
  
  // Navigatsiya holatlari
  const [selectedType, setSelectedType] = useState(null); 
  const [selectedCategory, setSelectedCategory] = useState(null); 
  const [viewingProductDetails, setViewingProductDetails] = useState(null); 

  useEffect(() => {
    const handleStorageChange = () => {
      setLang(localStorage.getItem('lang') || 'uz');
    };
    window.addEventListener('storage', handleStorageChange);
    const interval = setInterval(handleStorageChange, 1000);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const t = translations[lang] || translations['uz'];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('id', { ascending: false });

        if (error) console.error('Xatolik:', error.message);
        else setProducts(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Yordamchi funksiya: Mahsulotning "Turi / Тип" qiymatini olish
  const getProductTypeValue = (p) => {
    const arr = p.characteristics || p.specs || [];
    return arr.find(c => c.key === "Turi" || c.key === "Тип")?.value;
  };

  // 1-BOSQICH UCHUN: "Вихревой" / "Vixrevoy" birinchi o'ringa saralanadi
  const allPumpTypes = useMemo(() => {
    const types = products.map(p => getProductTypeValue(p)).filter(Boolean);
    const uniqueTypes = [...new Set(types)];

    return uniqueTypes.sort((a, b) => {
      const isTargetA = a.toLowerCase().includes("vixrevoy") || a.toLowerCase().includes("вихревой");
      const isTargetB = b.toLowerCase().includes("vixrevoy") || b.toLowerCase().includes("вихревой");

      if (isTargetA) return -1;
      if (isTargetB) return 1;
      
      return a.localeCompare(b);
    });
  }, [products]);

  // 2-BOSQICH UCHUN: Tanlangan Tur ichidagi Kategoriyalarni ajratish
  const getCategoriesOfType = () => {
    const filtered = products.filter(p => getProductTypeValue(p) === selectedType);
    return [...new Set(filtered.map(p => p.type_id).filter(Boolean))];
  };

  // 3-BOSQICH UCHUN: Yakuniy modellarni filtrlash
  const filteredProducts = products.filter(p => {
    const turiValue = getProductTypeValue(p);
    const matchesType = turiValue === selectedType;
    const matchesCategory = p.type_id === selectedCategory;
    
    return matchesType && matchesCategory;
  });

  // Asosiy sahifaga yo'naltirish funksiyasi
  const handleGoHome = () => {
    window.location.href = "/";
  };

  return (
    <div className="user-katalog-wrapper">
      <div className="user-katalog-max">
        
        {/* NAVIGATSIYA TUGMASI */}
        <div className="user-katalog-navigation-bar">
          <button onClick={handleGoHome} className="user-go-home-btn">
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
            {/* 1-BOSQICH: NASOS TURLARI */}
            {!selectedType && (
              <div>
                <div className="user-section-title">
                  <h2>{t.selectType}</h2>
                </div>
                
                <div className="user-types-grid">
                  {allPumpTypes.map(turi => (
                    <div 
                      key={turi}
                      onClick={() => setSelectedType(turi)}
                      className="user-type-card"
                    >
                      <div className="type-info">
                        <span className="user-type-name">{turi}</span>
                        <p className="user-type-sub">{t.viewModels}</p>
                      </div>
                      <span className="user-type-arrow">→</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 2-BOSQICH: TANLANGAN TUR ICHIDAGI KATEGORIYALAR */}
            {selectedType && !selectedCategory && (
              <div>
                <div className="user-inner-header">
                  <button onClick={() => setSelectedType(null)} className="user-back-btn">
                    ← Orqaga
                  </button>
                  <div className="user-section-title" style={{ margin: 0 }}>
                    <h2>{t.selectCategory}</h2>
                  </div>
                </div>

                <div className="user-categories-grid">
                  {getCategoriesOfType().map(cat => (
                    <div 
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className="user-category-card"
                    >
                      <div className="user-avatar-box">{cat.substring(0, 2).toUpperCase()}</div>
                      <span className="user-cat-title">{cat.toUpperCase()}</span>
                      <p className="user-cat-desc">
                        {products.filter(p => getProductTypeValue(p) === selectedType && p.type_id === cat).length} {t.productsCount}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3-BOSQICH: MODELLAR RO'YXATI */}
            {selectedType && selectedCategory && (
              <div>
                <div className="user-inner-header">
                  <button 
                    onClick={() => { setSelectedCategory(null); }} 
                    className="user-back-btn"
                  >
                    ← Orqaga
                  </button>
                  <div className="user-section-title" style={{ margin: 0 }}>
                    <h2>{`${selectedType} (${selectedCategory?.toUpperCase()})`}</h2>
                  </div>
                </div>

                <div className="user-products-grid">
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map(item => (
                      <div 
                        key={item.id} 
                        className="admin-product-card" 
                        onClick={() => setViewingProductDetails(item)}
                        style={{ cursor: 'pointer' }}
                      >
                        <div className="prod-img-box">
                          <span className="prod-tag">{item.type_id?.toUpperCase()}</span>
                          {item.image_url && imageMapping[item.image_url.trim()] ? (
                            <img 
                              src={imageMapping[item.image_url.trim()]} 
                              alt={item.title_uz} 
                              className="product-main-img" 
                            />
                          ) : (
                            <span className="placeholder-icon">📦</span>
                          )}
                        </div>
                        
                        <div className="prod-details-box">
                          <div className="title-row">
                            <h3>{lang === 'uz' ? item.title_uz : (item.title_ru || item.title_uz)}</h3>
                            <span className="prod-id-tag">ID: {item.id}</span>
                          </div>
                          
                          <p className="prod-desc-text">
                            {lang === 'uz' ? (item.description_uz || item.description || t.noDescription) : (item.description_ru || item.description_uz || item.description || t.noDescription)}
                          </p>
                          
                          <div className="prod-footer-row">
                            <p className="prod-price-text">
                              {item.price ? `$${item.price.toLocaleString()}` : t.agreedPrice}
                            </p>
                            <span className="user-action-view-btn">{t.viewMore}</span>
                          </div>
                        </div>
                      </div>
                    ))
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

        {/* 🔍 DETAL MODAL */}
        {viewingProductDetails && (
          <div className="user-modal-overlay" onClick={() => setViewingProductDetails(null)}>
            <div className="user-modal-card" onClick={(e) => e.stopPropagation()}>
              <div className="user-modal-header">
                <h3>{lang === 'uz' ? viewingProductDetails.title_uz : (viewingProductDetails.title_ru || viewingProductDetails.title_uz)}</h3>
                <button className="user-modal-close" onClick={() => setViewingProductDetails(null)}>×</button>
              </div>
              
              <div className="user-modal-body">
                <div className="user-modal-image-wrapper">
                  {viewingProductDetails.image_url && imageMapping[viewingProductDetails.image_url.trim()] ? (
                    <img 
                      src={imageMapping[viewingProductDetails.image_url.trim()]} 
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
                    <span className="detail-label">{t.category}</span>
                    <p className="detail-val font-blue">{viewingProductDetails.type_id?.toUpperCase()}</p>
                  </div>
                  <div className="detail-box">
                    <span className="detail-label">{t.pumpType}</span>
                    <p className="detail-val font-green">{getProductTypeValue(viewingProductDetails)}</p>
                  </div>
                  <div className="detail-box">
                    <span className="detail-label">{t.price}</span>
                    <p className="detail-val price-highlight">
                      {viewingProductDetails.price ? `$${viewingProductDetails.price.toLocaleString()}` : t.agreedPrice}
                    </p>
                  </div>
                  
                  <div className="detail-box" style={{ gridColumn: '1 / -1' }}>
                    <span className="detail-label">{t.description}</span>
                    <p className="detail-val" style={{ whiteSpace: 'pre-line', fontWeight: 'normal', color: '#444' }}>
                      {lang === 'uz' ? (viewingProductDetails.description_uz || viewingProductDetails.description || t.noDescription) : (viewingProductDetails.description_ru || viewingProductDetails.description_uz || viewingProductDetails.description || t.noDescription)}
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