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

// Static rasmlarni bazadagi nomlar bilan bog'laydigan ob'ekt
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

export default function AdminCatalog({ lang }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentLang, setCurrentLang] = useState(lang || 'uz'); 

  // Navigatsiya va Filtrlash holatlari
  const [selectedCategory, setSelectedCategory] = useState(null); 
  const [selectedType, setSelectedType] = useState(null); 
  const [viewingProductDetails, setViewingProductDetails] = useState(null); 

  // Modal va Forma holatlari (CRUD)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    title_uz: '',
    title_ru: '', 
    price: '',
    image_url: '',
    type_id: '', 
    turi_uz: '',  
    turi_ru: ''   
  });

  // Tillar uchun tarjimalar lug'ati
  const t = {
    uz: {
      panelTitle: "Admin boshqaruv paneli",
      subtitle: "Kataloglarni ichma-ich filtrlash va boshqarish tizimi",
      addBtn: "Yangi mahsulot qo'shish",
      mainCat: "Asosiy Katalog",
      selectCat: "Kategoriyani tanlang:",
      selectType: "Nasos turini tanlang:",
      models: "modellari:",
      back: "Orqaga qaytish",
      backTypes: "Turlarga qaytish",
      countBadge: "ta turkum",
      pumpCount: "ta nasos",
      noTypes: "Bu kategoriyaga tegishli turlar topilmadi.",
      noProducts: "Ushbu turkumda mahsulotlar marvel emas.",
      details: "Batafsil ma'lumot",
      prodId: "Mahsulot ID:",
      catCode: "Kategoriya kodi:",
      price: "Ulgurji Narxi:",
      imgName: "Rasm fayli nomi:",
      specs: "Texnik Xususiyatlari:",
      noSpecs: "Xususiyatlar kiritilmagan",
      edit: "Tahrirlash",
      close: "Yopish",
      cancel: "Bekor qilish",
      save: "Saqlash",
      formNameUz: "Mahsulot nomi (O'zbekcha)",
      formNameRu: "Mahsulot nomi (Ruscha)",
      formPrice: "Narxi (so'm)",
      formCat: "Kategoriya (type_id)",
      formImg: "Rasm faylini tanlang",
      formTypeUz: "Turi (O'zbekcha xususiyat)",
      formTypeRu: "Turi (Ruscha xususiyat)"
    },
    ru: {
      panelTitle: "Панель управления админа",
      subtitle: "Система вложенной фильтрации и управления каталогом",
      addBtn: "Добавить новый товар",
      mainCat: "Главный Каталог",
      selectCat: "Выберите категорию:",
      selectType: "Выберите тип насоса:",
      models: "модели:",
      back: "Назад",
      backTypes: "К типам",
      countBadge: "категорий",
      pumpCount: "насосов",
      noTypes: "Типы для этой категории не найдены.",
      noProducts: "В этой категории нет товаров.",
      details: "Подробная информация",
      prodId: "ID товара:",
      catCode: "Код категории:",
      price: "Оптовая цена:",
      imgName: "Имя файла изображения:",
      specs: "Технические характеристики:",
      noSpecs: "Характеристики не введены",
      edit: "Редактировать",
      close: "Закрыть",
      cancel: "Отмена",
      save: "Сохранить",
      formNameUz: "Название товара (Узбекский)",
      formNameRu: "Название товара (Русский)",
      formPrice: "Цена (сум)",
      formCat: "Категория (type_id)",
      formImg: "Выберите файл изображения",
      formTypeUz: "Тип (Характеристика на узб.)",
      formTypeRu: "Тип (Характеристика на рус.)"
    }
  };

  useEffect(() => {
    if (lang) {
      setCurrentLang(lang);
    }
  }, [lang]);

  // Supabase'dan ma'lumotlarni yuklash
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

  // Mahsulotni o'chirish
  const handleDelete = async (e, id) => {
    e.stopPropagation(); 
    if (window.confirm(currentLang === 'uz' ? "Ushbu mahsulotni o'chirmoqchisiz?" : "Удалить этот товар?")) {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) alert("Xato: " + error.message);
      else {
        alert(currentLang === 'uz' ? "Muvaffaqiyatli o'chirildi!" : "Успешно удалено!");
        fetchProducts();
        if (viewingProductDetails?.id === id) setViewingProductDetails(null);
      }
    }
  };

  // Tahrirlash modalini ochish
  const openEditModal = (e, product) => {
    e.stopPropagation();
    setEditingProduct(product);
    
    const targetArray = product?.characteristics || product?.specs || [];
    const turiUzValue = targetArray.find(c => c?.key === "Turi")?.value || '';
    const turiRuValue = targetArray.find(c => c?.key === "Тип")?.value || '';

    setFormData({
      title_uz: product?.title_uz || '',
      title_ru: product?.title_ru || '',
      price: product?.price || '',
      image_url: product?.image_url || '',
      type_id: product?.type_id || '',
      turi_uz: turiUzValue,
      turi_ru: turiRuValue
    });
    setIsModalOpen(true);
  };

  // Yangi mahsulot yaratish modalini ochish
  const openCreateModal = () => {
    setEditingProduct(null);
    setFormData({ 
      title_uz: '', 
      title_ru: '', 
      price: '', 
      image_url: '', 
      type_id: selectedCategory || '', 
      turi_uz: selectedType || '', 
      turi_ru: selectedType || '' 
    });
    setIsModalOpen(true);
  };

  // Formani saqlash (Insert / Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const jsonFormat = [
      { key: "Turi", value: formData.turi_uz },
      { key: "Тип", value: formData.turi_ru }
    ];

    const productData = {
      title_uz: formData.title_uz,
      title_ru: formData.title_ru,
      price: parseFloat(formData.price) || 0,
      image_url: formData.image_url || null,
      type_id: formData.type_id.toLowerCase().trim(),
      characteristics: jsonFormat,
      specs: jsonFormat
    };

    if (editingProduct) {
      const { error } = await supabase.from('products').update(productData).eq('id', editingProduct.id);
      if (error) alert(error.message);
      else {
        alert(currentLang === 'uz' ? "Yangilandi!" : "Обновлено!");
        setIsModalOpen(false);
        fetchProducts();
      }
    } else {
      const { error } = await supabase.from('products').insert([productData]);
      if (error) alert(error.message);
      else {
        alert(currentLang === 'uz' ? "Katalogga qo'shildi!" : "Добавлено в каталог!");
        setIsModalOpen(false);
        fetchProducts();
      }
    }
  };

  const categories = [...new Set(products.map(p => p?.type_id).filter(Boolean))];

  const getTypesOfCategory = () => {
    const filtered = products.filter(p => p?.type_id === selectedCategory);
    const allTypes = filtered.map(p => {
      const arr = p?.characteristics || p?.specs || [];
      const foundObj = arr.find(c => c?.key === "Turi" || c?.key === "Тип");
      return foundObj?.value ? foundObj.value.trim() : null;
    }).filter(Boolean);
    
    return [...new Set(allTypes)];
  };

  const filteredProducts = products.filter(p => {
    const arr = p?.characteristics || p?.specs || [];
    const foundObj = arr.find(c => c?.key === "Turi" || c?.key === "Тип");
    const turiValue = foundObj?.value ? foundObj.value.trim() : null;
    
    return p?.type_id === selectedCategory && turiValue === selectedType;
  });

  const currentTranslation = t[currentLang] || t['uz'];

  return (
    <div className="katalog-light-wrapper">
      <div className="katalog-container-max">
        
        {/* Banner */}
        <div className="katalog-light-banner">
          <div className="banner-left-info">
            <div className="banner-icon-title">
              <span className="main-grid-icon">⚙️</span>
              <h1>{currentTranslation.panelTitle}</h1>
            </div>
            <p className="banner-subtitle">{currentTranslation.subtitle}</p>
          </div>
          <button onClick={openCreateModal} className="btn-main-add">
            <span>+</span> {currentTranslation.addBtn}
          </button>
        </div>

        {/* BREADCRUMBS */}
        <div className="katalog-breadcrumbs">
          <button onClick={() => { setSelectedCategory(null); setSelectedType(null); }} className="breadcrumb-btn">
            {currentTranslation.mainCat}
          </button>
          {selectedCategory && (
            <>
              <span className="breadcrumb-separator">/</span>
              <button onClick={() => setSelectedType(null)} className="breadcrumb-btn active">
                {selectedCategory.toUpperCase()}
              </button>
            </>
          )}
          {selectedType && (
            <>
              <span className="breadcrumb-separator">/</span>
              <span className="breadcrumb-current">{selectedType}</span>
            </>
          )}
        </div>

        {loading ? (
          <div className="katalog-spinner-box">
            <div className="spinner"></div>
          </div>
        ) : (
          <>
            {/* 1-BOSQICH: KATEGORIYALAR */}
            {!selectedCategory && (
              <div>
                <div className="section-divider">
                  <h2>{currentTranslation.selectCat}</h2>
                  <span className="badge-count">{categories.length} {currentTranslation.countBadge}</span>
                </div>
                <div className="categories-light-grid">
                  {categories.map(cat => (
                    <div key={cat} onClick={() => setSelectedCategory(cat)} className="category-light-card">
                      <div className="category-avatar">{cat.substring(0, 2).toUpperCase()}</div>
                      <span className="category-title">{cat.toUpperCase()}</span>
                      <p className="category-desc">
                        {products.filter(p => p?.type_id === cat).length} {currentTranslation.pumpCount}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 2-BOSQICH: TURINI TANLASH */}
            {selectedCategory && !selectedType && (
              <div>
                <div className="katalog-inner-header">
                  <div className="section-divider" style={{ margin: 0 }}>
                    <h2>{currentTranslation.selectType}</h2>
                  </div>
                  <button onClick={() => setSelectedCategory(null)} className="katalog-back-btn">
                    ⬅ {currentTranslation.back}
                  </button>
                </div>
                <div className="types-light-grid">
                  {getTypesOfCategory().map(turi => (
                    <div key={turi} onClick={() => setSelectedType(turi)} className="type-light-card">
                      <div className="type-card-info">
                        <p className="type-name">{turi}</p>
                        <p className="type-subtext">Modellarni ko'rish</p>
                      </div>
                      <span className="type-arrow">→</span>
                    </div>
                  ))}
                  {getTypesOfCategory().length === 0 && (
                    <div className="no-data-box"><p>{currentTranslation.noTypes}</p></div>
                  )}
                </div>
              </div>
            )}

            {/* 3-BOSQICH: MAHSULOTLAR RO'YXATI */}
            {selectedCategory && selectedType && (
              <div>
                <div className="katalog-inner-header">
                  <div className="section-divider" style={{ margin: 0 }}>
                    <h2>{selectedType} {currentTranslation.models}</h2>
                  </div>
                  <button onClick={() => setSelectedType(null)} className="katalog-back-btn">
                    ⬅ {currentTranslation.backTypes}
                  </button>
                </div>
                
                <div className="products-light-grid">
                  {filteredProducts.map(item => (
                    <div key={item.id} onClick={() => setViewingProductDetails(item)} className="product-light-card">
                      <div className="product-img-box">
                        <span className="product-tag">{item?.type_id?.toUpperCase()}</span>
                        
                        {item?.image_url && imageMapping[item.image_url.trim()] ? (
                          <img 
                            src={imageMapping[item.image_url.trim()]} 
                            alt={item?.title_uz} 
                            className="product-catalog-img" 
                            style={{ width: '100%', height: '140px', objectFit: 'contain', padding: '5px' }}
                          />
                        ) : (
                          <div className="product-img-placeholder">
                            <p className="placeholder-url">{item?.image_url || 'no-image.png'}</p>
                            <span className="placeholder-icon">📦</span>
                          </div>
                        )}
                      </div>

                      <div className="product-details">
                        <div className="product-title-group">
                          <h3>{currentLang === 'uz' ? item?.title_uz : item?.title_ru}</h3>
                          <p className="product-id-badge">ID: {item?.id}</p>
                        </div>
                        
                        <div className="product-footer-action">
                          <span className="product-price">{item?.price?.toLocaleString()} so'm</span>
                          
                          <div className="admin-crud-group">
                            <button onClick={(e) => openEditModal(e, item)} className="btn-crud edit">✏️</button>
                            <button onClick={(e) => handleDelete(e, item.id)} className="btn-crud delete">🗑️</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {filteredProducts.length === 0 && (
                  <div className="no-data-box"><p>{currentTranslation.noProducts}</p></div>
                )}
              </div>
            )}
          </>
        )}

        {/* 4-BOSQICH: MODAL — BATAFSIL KO'RISH */}
        {viewingProductDetails && (
          <div className="admin-modal-overlay">
            <div className="admin-modal-card large">
              <div className="modal-header-dark">
                <div>
                  <span className="modal-tag">{currentTranslation.details}</span>
                  <h3>{currentLang === 'uz' ? viewingProductDetails?.title_uz : viewingProductDetails?.title_ru}</h3>
                </div>
                <button onClick={() => setViewingProductDetails(null)} className="modal-close-x">✕</button>
              </div>

              <div className="modal-body-content">
                <div style={{ textAlign: 'center', marginBottom: '20px', background: '#f8fafc', padding: '15px', borderRadius: '8px' }}>
                  {viewingProductDetails?.image_url && imageMapping[viewingProductDetails.image_url.trim()] ? (
                    <img 
                      src={imageMapping[viewingProductDetails.image_url.trim()]} 
                      alt="Katta ko'rinish" 
                      style={{ maxHeight: '180px', maxWidth: '100%', objectFit: 'contain' }}
                    />
                  ) : (
                    <span style={{ fontSize: '40px' }}>📦</span>
                  )}
                </div>

                <div className="detail-row-grid">
                  <div className="detail-item-box">
                    <p className="detail-label">{currentTranslation.prodId}</p>
                    <p className="detail-value mono">{viewingProductDetails?.id}</p>
                  </div>
                  <div className="detail-item-box">
                    <p className="detail-label">{currentTranslation.catCode}</p>
                    <p className="detail-value category-color">{viewingProductDetails?.type_id?.toUpperCase()}</p>
                  </div>
                </div>

                <div className="detail-row-grid">
                  <div className="detail-item-box">
                    <p className="detail-label">{currentTranslation.price}</p>
                    <p className="detail-value price-color">{viewingProductDetails?.price?.toLocaleString()} so'm</p>
                  </div>
                  <div className="detail-item-box">
                    <p className="detail-label">{currentTranslation.imgName}</p>
                    <p className="detail-value mono" style={{ fontSize: '11px', wordBreak: 'break-all' }}>
                      {viewingProductDetails?.image_url || '—'}
                    </p>
                  </div>
                </div>

                <div className="modal-specs-box">
                  <p className="detail-label">{currentTranslation.specs}</p>
                  <div className="specs-scroll-container">
                    {(() => {
                      const specs = viewingProductDetails?.characteristics || viewingProductDetails?.specs || [];
                      if (specs.length === 0) return <p style={{ color: '#94a3b8', fontStyle: 'italic', margin: 0 }}>{currentTranslation.noSpecs}</p>;
                      return specs.map((s, idx) => (
                        <div key={idx} className="spec-item-line">
                          <span className="spec-line-key">{s?.key}:</span>
                          <span className="spec-line-val">{s?.value}</span>
                        </div>
                      ));
                    })()}
                  </div>
                </div>
              </div>

              <div className="modal-footer-actions">
                <button onClick={(e) => { openEditModal(e, viewingProductDetails); setViewingProductDetails(null); }} className="btn-modal-action warn">
                  ✏️ {currentTranslation.edit}
                </button>
                <button onClick={() => setViewingProductDetails(null)} className="btn-modal-action cancel">
                  {currentTranslation.close}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 5-BOSQICH: MODAL — QO'SHISH VA TAHRIRLASH */}
        {isModalOpen && (
          <div className="admin-modal-overlay">
            <div className="admin-modal-card">
              <div className="modal-header-light">
                <h2>{editingProduct ? `✏️ ${currentTranslation.edit}` : `➕ ${currentTranslation.addBtn}`}</h2>
              </div>
              
              <form onSubmit={handleSubmit}>
                <div className="modal-body-content" style={{ paddingBottom: '8px' }}>
                  <div className="admin-form-group">
                    <label>{currentTranslation.formNameUz}</label>
                    <input type="text" required value={formData.title_uz} onChange={(e) => setFormData({...formData, title_uz: e.target.value})} />
                  </div>

                  <div className="admin-form-group">
                    <label>{currentTranslation.formNameRu}</label>
                    <input type="text" required value={formData.title_ru} onChange={(e) => setFormData({...formData, title_ru: e.target.value})} />
                  </div>

                  <div className="form-row-split">
                    <div className="admin-form-group">
                      <label>{currentTranslation.formPrice}</label>
                      <input type="number" required value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} />
                    </div>
                    <div className="admin-form-group">
                      <label>{currentTranslation.formCat}</label>
                      <input type="text" required className="uppercase-input" value={formData.type_id} onChange={(e) => setFormData({...formData, type_id: e.target.value})} />
                    </div>
                  </div>

                  <div className="admin-form-group">
                    <label>{currentTranslation.formImg}</label>
                    <select 
                      value={formData.image_url} 
                      onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                      style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', background: '#fff' }}
                    >
                      <option value="">-- Rasm tanlang (Ixtiyoriy) --</option>
                      {Object.keys(imageMapping).map((imgKey) => (
                        <option key={imgKey} value={imgKey}>{imgKey}</option>
                      ))}
                    </select>
                  </div>

                  <div className="admin-form-group">
                    <label>{currentTranslation.formTypeUz}</label>
                    <input type="text" placeholder="Masalan: Vortex, Centrifugal" value={formData.turi_uz} onChange={(e) => setFormData({...formData, turi_uz: e.target.value})} />
                  </div>

                  <div className="admin-form-group">
                    <label>{currentTranslation.formTypeRu}</label>
                    <input type="text" placeholder="Например: Вихревой, Центробежный" value={formData.turi_ru} onChange={(e) => setFormData({...formData, turi_ru: e.target.value})} />
                  </div>
                </div>

                <div className="modal-footer-actions">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="btn-modal-action cancel">
                    {currentTranslation.cancel}
                  </button>
                  <button type="submit" className="btn-modal-action submit">
                    {currentTranslation.save}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}