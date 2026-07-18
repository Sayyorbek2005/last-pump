import React, { useState, useEffect } from 'react';
import { supabase } from '../../../supabase/client'; 
import './katalog.css'; 

import imgQB from "./assets2/QB.png";
import imgCPm from "./assets2/CPm.png";
import imgPW from "./assets2/PW.png";
import imgPWE from "./assets2/PW-E.png";
// import imgPWF from "./assets2/PW.png";
import imgQDX from "./assets2/QDX.png";
import imgTCM from "./assets2/TCM.png";
// import imgTCH from "./assets2/TCM.png";
import imgJET from "./assets2/JET.png";
import imgTHF from "./assets2/THF.png";
import img2TCP from "./assets2/2TCP25-160A.png";
import img50WFD from "./assets2/WFD.png"; 
import imgQFD from "./assets2/QFD.png";
import imgATJSW from "./assets2/ATJSW.png";
import imgSTAR_F from "./assets2/STSR40-10F.png"; 
import imgSGJ from "./assets2/2STM-2.png";
// import imgGS from "./assets2/2STM-2.png";
import imgCHLFT from "./assets2/CHLF(T)гиpng.png";
import imgCHM from "./assets2/CHMгиpng.png";
import imgTW from "./assets2/TW-T.png";
import imgGRD from "./assets2/GP.png";
import imgSTAR_C from "./assets2/STAR-6A.png"; 
// import imgPM01 from "./assets2/PW.png";

// Static rasmlarni bazadagi nomlar bilan bog'laydigan lug'at
const imageMapping = {
  "QB.png": imgQB,
  "CPm.png": imgCPm,
  "PW.png": imgPW,
  "PW-E.png": imgPWE,
  "QDX.png": imgQDX,
  "TCM.png": imgTCM,
  "JET.png": imgJET,
  "THF.png": imgTHF,
  "2TCP25-160A.png": img2TCP,
  "WFD.png": img50WFD,
  "QFD.png": imgQFD,
  "ATJSW.png": imgATJSW,
  "STSR40-10F.png": imgSTAR_F,
  "2STM-2.png": imgSGJ, 
  "CHLF(T)гиpng.png": imgCHLFT,
  "CHMгиpng.png": imgCHM,
  "TW-T.png": imgTW,
  "GP.png": imgGRD,
  "STAR-6A.png": imgSTAR_C
};

// 🌐 TIL MATNLARI LUG'ATI
const translations = {
  uz: {
    title: "Nasoslar Katalogi",
    subtitle: "O‘zingizga kerakli uskuna turini tanlang va modellarni ko‘ring",
    searchPlaceholder: "ichidan qidirish...",
    mainCatalog: "Asosiy Katalog",
    loading: "Yuklanmoqda...",
    selectCategory: "Mahsulot turkumini tanlang",
    productsCount: "ta mahsulot",
    sectionsCount: "ta bo‘lim",
    selectType: "Nasos turini tanlang",
    backToCategories: "← Bo‘limlarga qaytish",
    back: "← Orqaga qaytish",
    viewModels: "Modellarni ko‘rish",
    searchResults: "Qidiruv natijalari:",
    agreedPrice: "Kelishilgan narx",
    viewMore: "Batafsil →",
    productId: "Mahsulot ID",
    category: "Turkum",
    price: "Narxi",
    specs: "Texnik xususiyatlari",
    noSpecs: "Xususiyatlar kiritilmagan",
    noProducts: "Mos keladigan mahsulotlar topilmadi.",
    close: "Yopish"
  },
  ru: {
    title: "Каталог Насосов",
    subtitle: "Выберите интересующий вас тип оборудования и просмотрите модели",
    searchPlaceholder: "поиск в...",
    mainCatalog: "Главный Каталог",
    loading: "Загрузка...",
    selectCategory: "Выберите категорию товара",
    productsCount: "товаров",
    sectionsCount: "разделов",
    selectType: "Выберите тип насоса",
    backToCategories: "← Назад к категориям",
    back: "← Назад",
    viewModels: "Посмотреть модели",
    searchResults: "Результаты поиска:",
    agreedPrice: "Договорная цена",
    viewMore: "Подробнее →",
    productId: "ID Продукта",
    category: "Категория",
    price: "Цена",
    specs: "Технические характеристики",
    noSpecs: "Характеристики не указаны",
    noProducts: "Совпадающие товары не найдены.",
    close: "Закрыть"
  }
};

export default function UserCatalog() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // 🌐 Global tilni saqlash holati
  const [lang, setLang] = useState(localStorage.getItem('lang') || 'uz');

  const [selectedCategory, setSelectedCategory] = useState(null); 
  const [selectedType, setSelectedType] = useState(null); 
  const [viewingProductDetails, setViewingProductDetails] = useState(null); 

  useEffect(() => {
    const handleStorageChange = () => {
      const currentLang = localStorage.getItem('lang') || 'uz';
      setLang(currentLang);
    };

    window.addEventListener('storage', handleStorageChange);
    const interval = setInterval(handleStorageChange, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const t = translations[lang] || translations['uz'];

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

  useEffect(() => {
    fetchProducts();
  }, []);

  const categories = [...new Set(products.map(p => p.type_id).filter(Boolean))];

  const getTypesOfCategory = () => {
    const filtered = products.filter(p => p.type_id === selectedCategory);
    const allTypes = filtered.map(p => {
      const arr = p.characteristics || p.specs || [];
      return arr.find(c => c.key === "Turi" || c.key === "Тип")?.value;
    }).filter(Boolean);
    return [...new Set(allTypes)];
  };

  const filteredProducts = products.filter(p => {
    const arr = p.characteristics || p.specs || [];
    const turiValue = arr.find(c => c.key === "Turi" || c.key === "Тип")?.value;
    
    const matchesCategory = p.type_id === selectedCategory;
    const matchesType = turiValue === selectedType;
    
    const currentTitle = lang === 'uz' ? p.title_uz : (p.title_ru || p.title_uz);
    const matchesSearch = currentTitle?.toLowerCase().includes(searchQuery.toLowerCase());

    if (searchQuery) {
      return matchesCategory && matchesSearch;
    }
    return matchesCategory && matchesType;
  });

  return (
    <div className="user-katalog-wrapper">
      <div className="user-katalog-max">
        
        {/* BANNER VA QIDIRUV */}
        <div className="user-katalog-banner">
          <div className="banner-left">
            <div className="banner-title-box">
              <span className="banner-icon">💧</span>
              <h1>{t.title}</h1>
            </div>
            <p>{t.subtitle}</p>
          </div>
          
          {selectedCategory && (
            <div className="banner-search-box">
              <input 
                type="text" 
                placeholder={`${selectedCategory.toUpperCase()} ${t.searchPlaceholder}`} 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          )}
        </div>

        {/* BREADCRUMBS */}
        <div className="user-breadcrumbs">
          <button 
            onClick={() => { setSelectedCategory(null); setSelectedType(null); setSearchQuery(''); }} 
            className={`crumb-btn ${!selectedCategory ? 'active' : ''}`}
          >
            {t.mainCatalog}
          </button>
          
          {selectedCategory && (
            <>
              <span className="crumb-sep">/</span>
              <button 
                onClick={() => { setSelectedType(null); setSearchQuery(''); }} 
                className={`crumb-btn ${selectedCategory && !selectedType ? 'active' : ''}`}
              >
                {selectedCategory.toUpperCase()}
              </button>
            </>
          )}

          {selectedType && !searchQuery && (
            <>
              <span className="crumb-sep">/</span>
              <span className="crumb-current">{selectedType}</span>
            </>
          )}
        </div>

        {loading ? (
          <div className="user-spinner-box">
            <div className="user-spinner"></div>
            <p style={{ marginTop: '10px', color: '#666' }}>{t.loading}</p>
          </div>
        ) : (
          <>
            {/* 1-BOSQICH: KATEGORIYALAR */}
            {!selectedCategory && (
              <div>
                <div className="user-section-title">
                  <h2>{t.selectCategory}</h2>
                  <span className="user-badge">{categories.length} {t.sectionsCount}</span>
                </div>
                
                <div className="user-categories-grid">
                  {categories.map(cat => (
                    <div 
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className="user-category-card"
                    >
                      <div className="user-avatar-box">{cat.substring(0, 2).toUpperCase()}</div>
                      <span className="user-cat-title">{cat.toUpperCase()}</span>
                      <p className="user-cat-desc">
                        {products.filter(p => p.type_id === cat).length} {t.productsCount}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 2-BOSQICH: NASOS TURLARI */}
            {selectedCategory && !selectedType && !searchQuery && (
              <div>
                <div className="user-inner-header">
                  <button onClick={() => setSelectedCategory(null)} className="user-back-btn">
                    {t.backToCategories}
                  </button>
                  <div className="user-section-title" style={{ margin: 0 }}>
                    <h2>{t.selectType}</h2>
                  </div>
                </div>

                <div className="user-types-grid">
                  {getTypesOfCategory().map(turi => (
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

            {/* 3-BOSQICH: MAHSULOTLAR RO'YXATI (Dinamik rasmlar qo'shildi) */}
            {selectedCategory && (selectedType || searchQuery) && (
              <div>
                <div className="user-inner-header">
                  <button 
                    onClick={() => { setSelectedType(null); setSearchQuery(''); }} 
                    className="user-back-btn"
                  >
                    {t.back}
                  </button>
                  <div className="user-section-title" style={{ margin: 0 }}>
                    <h2>{searchQuery ? t.searchResults : selectedType}</h2>
                  </div>
                </div>

                <div className="user-products-grid">
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map(item => (
                      <div 
                        key={item.id} 
                        className="user-product-card"
                        onClick={() => setViewingProductDetails(item)}
                      >
                        <div className="user-img-placeholder-box" style={{ background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '140px' }}>
                          <span className="user-prod-tag">{item.type_id?.toUpperCase()}</span>
                          
                          {/* 🔄 Dinamik rasm tekshiruvi */}
                          {item.image_url && imageMapping[item.image_url.trim()] ? (
                            <img 
                              src={imageMapping[item.image_url.trim()]} 
                              alt={item.title_uz} 
                              style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '5px' }}
                            />
                          ) : (
                            <span className="placeholder-icon" style={{ fontSize: '32px' }}>📦</span>
                          )}
                        </div>
                        
                        <div className="user-prod-details">
                          <div className="title-group">
                            <h3>{lang === 'uz' ? item.title_uz : (item.title_ru || item.title_uz)}</h3>
                            <span className="user-prod-id">ID: {item.id}</span>
                          </div>
                          
                          <div className="user-prod-footer">
                            <p className="user-prod-price">
                              {item.price ? `${item.price.toLocaleString()} so'm` : t.agreedPrice}
                            </p>
                            <span className="user-view-more">{t.viewMore}</span>
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

        {/* 🔍 FOYDALANUVCHILAR UCHUN DETAL MODAL */}
        {viewingProductDetails && (
          <div className="user-modal-overlay" onClick={() => setViewingProductDetails(null)}>
            <div className="user-modal-card" onClick={(e) => e.stopPropagation()}>
              <div className="user-modal-header">
                <h3>{lang === 'uz' ? viewingProductDetails.title_uz : (viewingProductDetails.title_ru || viewingProductDetails.title_uz)}</h3>
                <button className="user-modal-close" onClick={() => setViewingProductDetails(null)}>×</button>
              </div>
              
              <div className="user-modal-body">
                {/* 🔄 Modal ichidagi katta rasm preview */}
                <div style={{ textAlign: 'center', marginBottom: '20px', background: '#f8fafc', padding: '15px', borderRadius: '8px' }}>
                  {viewingProductDetails.image_url && imageMapping[viewingProductDetails.image_url.trim()] ? (
                    <img 
                      src={imageMapping[viewingProductDetails.image_url.trim()]} 
                      alt="Katta ko'rinish" 
                      style={{ maxHeight: '180px', maxWidth: '100%', objectFit: 'contain' }}
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
                  <div className="detail-box" style={{ gridColumn: '1 / -1' }}>
                    <span className="detail-label">{t.price}</span>
                    <p className="detail-val price-highlight">
                      {viewingProductDetails.price ? `${viewingProductDetails.price.toLocaleString()} so'm` : t.agreedPrice}
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