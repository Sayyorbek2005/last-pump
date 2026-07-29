import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { supabase } from '../../../supabase/client'; 
import './katalog.css'; 

// === 1. BARCHA RASMLARNI IMPORT QILISH (assets2 PAPKASIDAN) ===
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

// === 2. BAZADAGI NOMLAR BILAN STATIK RASMLARNI BOG'LOVCHI OBYEKT ===
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

// === 3. FALLBACK RASM FUNKSIYASI ===
const autoFallbackImage = (title) => {
  if (!title) return imgImageOne;
  const name = title.toUpperCase();

  if (name.includes("QFD")) return imgQFD;
  if (name.includes("QDX")) return imgQDX;
  if (name.includes("TCM")) return imgTCM;
  if (name.includes("JET")) {
    if (name.includes("400")) return imgJET400S;
    return imgJET;
  }
  if (name.includes("THF")) return imgTHF;
  if (name.includes("TNF")) return imgTNF;
  if (name.includes("PW")) return name.includes("-E") ? imgPWE : imgPW;
  if (name.includes("GRS")) {
    if (name.includes("25-4-6")) return imgGRS25_4_6;
    if (name.includes("-F")) return imgGRSF;
    return imgGRSH;
  }
  if (name.includes("4GS")) return img4GS;
  if (name.includes("6SP")) return name.includes("46-D4") ? img6SP46D4 : img6SP1;
  if (name.includes("WQD")) return imgWQD;
  if (name.includes("WSD")) return imgWSD;
  if (name.includes("CPM")) return imgCPm;
  if (name.includes("TW-T")) return imgTWT;
  if (name.includes("2STM")) return img2STM1;
  if (name.includes("5KSE")) return img5KSE1;

  return imgImageOne;
};

const getProductImageSrc = (imgUrl, title) => {
  if (!imgUrl) return autoFallbackImage(title);
  if (imgUrl.startsWith("http://") || imgUrl.startsWith("https://")) {
    return imgUrl;
  }
  return imageMapping[imgUrl.trim()] || autoFallbackImage(title);
};

const getTypeValue = (product) => {
  const arr = product?.characteristics || product?.specs || [];
  const foundObj = arr.find(c => c?.key === "Turi" || c?.key === "Тип");
  return foundObj?.value ? foundObj.value.trim() : null;
};

// === 4. TARJIMALAR ===
const t = {
  uz: {
    panelTitle: "Admin boshqaruv paneli",
    subtitle: "Katalog turlari va modellarini boshqarish tizimi",
    addBtn: "Yangi mahsulot qo'shish",
    mainCat: "Barcha Turlar",
    selectType: "Nasos turini tanlang:",
    models: "modellari:",
    back: "Turlarga qaytish",
    countBadge: "ta turkum",
    pumpCount: "ta nasos",
    noTypes: "Tizimda hech qanday nasos turi topilmadi.",
    noProducts: "Ushbu turkumda mahsulotlar mavjud emas.",
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
    formPrice: "Narxi",
    formCurrency: "Kiritish valyutasi",
    formCat: "Kategoriya (type_id)",
    formImgSelect: "Statik rasm tanlash",
    formImgUpload: "Kompyuterdan yangi rasm yuklash",
    uploading: "Rasm yuklanmoqda...",
    formTypeUz: "Turi (O'zbekcha)",
    formTypeRu: "Тип (Ruscha)",
    formVkhVykh: "Вх/Вых (Kirish/Chiqish)",
    formKw: "кВт (Quvvat)",
    formLm: "л/м (Suv sarfi)",
    formPodyem: "Подъём (Balandlik)",
    usdRateLabel: "1 USD Kursi:"
  },
  ru: {
    panelTitle: "Панель управления админа",
    subtitle: "Система управления типами и модели каталога",
    addBtn: "Добавить новый товар",
    mainCat: "Все типы",
    selectType: "Выберите тип насоса:",
    models: "модели:",
    back: "К типам",
    countBadge: "категорий",
    pumpCount: "насосов",
    noTypes: "Типы насосов не найдены.",
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
    formPrice: "Цена",
    formCurrency: "Валюта ввода",
    formCat: "Категория (type_id)",
    formImgSelect: "Выбрать статическое изображение",
    formImgUpload: "Загрузить новое фото с компьютера",
    uploading: "Загрузка фото...",
    formTypeUz: "Тип (На узбекском)",
    formTypeRu: "Тип (На русском)",
    formVkhVykh: "Вх/Вых",
    formKw: "кВт",
    formLm: "л/м",
    formPodyem: "Подъём",
    usdRateLabel: "Курс 1 USD:"
  }
};

export default function AdminCatalog({ lang, usdRate: propUsdRate, onRateUpdate }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentLang, setCurrentLang] = useState(lang || 'uz'); 

  // === DOLLAR KURSI STATE-I ===
  const [rate, setRate] = useState(propUsdRate || 12800);
  const [inputRate, setInputRate] = useState(propUsdRate || 12800);
  const [updatingRate, setUpdatingRate] = useState(false);

  // 🎯 ADMIN QAYSI VALYUTADA KO'RISHNI TANLAYDI ('usd' YOKI 'uzs')
  const [displayCurrency, setDisplayCurrency] = useState('usd');

  const [selectedType, setSelectedType] = useState(null); 
  const [viewingProductDetails, setViewingProductDetails] = useState(null); 

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const [formData, setFormData] = useState({
    title_uz: '', title_ru: '', price: '', currency: 'usd', image_url: '', type_id: '', 
    turi_uz: '', turi_ru: '', vkh_vykh: '', kw: '', lm: '', podyem: ''
  });

  useEffect(() => {
    if (lang) setCurrentLang(lang);
  }, [lang]);

  useEffect(() => {
    if (propUsdRate) {
      setRate(propUsdRate);
      setInputRate(propUsdRate);
    }
  }, [propUsdRate]);

  // === 1. BAZADAN DOLLAR KURSINI OLISH ===
  const fetchRateSetting = useCallback(async () => {
    try {
      const { data } = await supabase
        .from('shop_settings')
        .select('usd_rate')
        .eq('id', 1)
        .single();

      if (data && data.usd_rate) {
        setRate(data.usd_rate);
        setInputRate(data.usd_rate);
      }
    } catch (err) {
      console.error("Kursni yuklashda xato:", err);
    }
  }, []);

  // === 2. DOLLAR KURSINI O'ZGARTIRISH VA SAQLASH ===
  const handleSaveRate = async (e) => {
    e.preventDefault();
    setUpdatingRate(true);

    try {
      const { error } = await supabase
        .from('shop_settings')
        .update({ usd_rate: Number(inputRate), updated_at: new Date() })
        .eq('id', 1);

      if (!error) {
        setRate(Number(inputRate));
        if (onRateUpdate) onRateUpdate();
        alert(currentLang === 'uz' ? "Dollar kursi yangilandi!" : "Курс доллара обновлен!");
      } else {
        alert("Xatolik: " + error.message);
      }
    } catch (err) {
      alert("Xatolik: " + err.message);
    } finally {
      setUpdatingRate(false);
    }
  };

  // 🎯 BITTA NARX CHIQARISH FUNKSIYASI (TANLANGAN VALYUTAGA QARAB)
  const formatPrice = useCallback((itemPrice, itemCurrency = 'usd') => {
    if (itemPrice === undefined || itemPrice === null || itemPrice === '') return '0';
    const numPrice = Number(itemPrice);

    if (displayCurrency === 'uzs') {
      const somVal = (itemCurrency === 'usd') ? numPrice * rate : numPrice;
      return `${Math.round(somVal).toLocaleString('uz-UZ')} so'm`;
    } else {
      const usdVal = (itemCurrency === 'uzs' || itemCurrency === 'sum') ? (numPrice / rate) : numPrice;
      return `$${usdVal % 1 === 0 ? usdVal : usdVal.toFixed(2)}`;
    }
  }, [displayCurrency, rate]);

  const fetchProducts = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    fetchProducts();
    fetchRateSetting();
  }, [fetchProducts, fetchRateSetting]);

  const allTypes = useMemo(() => {
    const types = products.map(getTypeValue).filter(Boolean);
    const uniqueTypes = [...new Set(types)];

    return uniqueTypes.sort((a, b) => {
      const isTargetA = a.toLowerCase().includes("vixrevoy") || a.toLowerCase().includes("вихревой");
      const isTargetB = b.toLowerCase().includes("vixrevoy") || b.toLowerCase().includes("вихревой");

      if (isTargetA) return -1;
      if (isTargetB) return 1;
      
      return a.localeCompare(b);
    });
  }, [products]);

  const getTypeCount = useCallback((turiName) => {
    return products.filter(p => getTypeValue(p) === turiName).length;
  }, [products]);

  const handleDelete = async (e, id) => {
    e.stopPropagation(); 
    const confirmMsg = currentLang === 'uz' ? "Ushbu mahsulotni o'chirmoqchisiz?" : "Удалить этот товар?";
    if (window.confirm(confirmMsg)) {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) {
        alert("Xato: " + error.message);
      } else {
        alert(currentLang === 'uz' ? "Muvaffaqiyatli o'chirildi!" : "Успешно удалено!");
        fetchProducts();
        if (viewingProductDetails?.id === id) setViewingProductDetails(null);
      }
    }
  };

  const openEditModal = (e, product) => {
    e.stopPropagation();
    setEditingProduct(product);
    setImageFile(null);
    setPreviewImage(null);
    
    const targetArray = product?.characteristics || product?.specs || [];
    
    setFormData({
      title_uz: product?.title_uz || '',
      title_ru: product?.title_ru || '',
      price: product?.price || '',
      currency: product?.currency || 'usd',
      image_url: product?.image_url || '',
      type_id: product?.type_id || '',
      turi_uz: targetArray.find(c => c?.key === "Turi")?.value || '',
      turi_ru: targetArray.find(c => c?.key === "Тип")?.value || '',
      vkh_vykh: targetArray.find(c => c?.key === "Вх/Вых")?.value || '',
      kw: targetArray.find(c => c?.key === "кВт")?.value || '',
      lm: targetArray.find(c => c?.key === "л/м")?.value || '',
      podyem: targetArray.find(c => c?.key === "Подъём")?.value || ''
    });
    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    setEditingProduct(null);
    setImageFile(null);
    setPreviewImage(null);
    setFormData({ 
      title_uz: '', title_ru: '', price: '', currency: 'usd', image_url: '', type_id: '', 
      turi_uz: selectedType || '', turi_ru: selectedType || '',
      vkh_vykh: '', kw: '', lm: '', podyem: ''
    });
    setIsModalOpen(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewImage(URL.createObjectURL(file));
      setFormData(prev => ({ ...prev, image_url: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let finalImageUrl = formData.image_url;

    try {
      setUploadingImage(true);

      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
        const filePath = `products/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, imageFile);

        if (uploadError) {
          throw new Error("Rasm yuklashda xatolik: " + uploadError.message);
        }

        const { data: publicUrlData } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);

        finalImageUrl = publicUrlData.publicUrl;
      }

      const jsonFormat = [
        { key: "Turi", value: formData.turi_uz.trim() },
        { key: "Тип", value: formData.turi_ru.trim() },
        { key: "Вх/Вых", value: formData.vkh_vykh.trim() },
        { key: "кВт", value: formData.kw.trim() },
        { key: "л/м", value: formData.lm.trim() },
        { key: "Подъём", value: formData.podyem.trim() }
      ];

      const productData = {
        title_uz: formData.title_uz,
        title_ru: formData.title_ru,
        price: parseFloat(formData.price) || 0,
        currency: formData.currency,
        image_url: finalImageUrl || null,
        type_id: formData.type_id.toLowerCase().trim(),
        characteristics: jsonFormat,
        specs: jsonFormat
      };

      let error;
      if (editingProduct) {
        const res = await supabase.from('products').update(productData).eq('id', editingProduct.id);
        error = res.error;
      } else {
        const res = await supabase.from('products').insert([productData]);
        error = res.error;
      }

      if (error) {
        alert(error.message);
      } else {
        alert(currentLang === 'uz' ? "Muvaffaqiyatli saqlandi!" : "Успешно сохранено!");
        setIsModalOpen(false);
        fetchProducts();
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setUploadingImage(false);
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter(p => getTypeValue(p) === selectedType);
  }, [products, selectedType]);

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

          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap' }}>
            
            {/* 🎯 VALYUTANI ALMASHTIRISH TOGGLE */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#e2e8f0',
              padding: '3px',
              borderRadius: '8px'
            }}>
              <button
                type="button"
                onClick={() => setDisplayCurrency('usd')}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: displayCurrency === 'usd' ? '#2563eb' : 'transparent',
                  color: displayCurrency === 'usd' ? '#ffffff' : '#475569',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  fontSize: '13px',
                  transition: 'all 0.2s'
                }}
              >
                USD ($)
              </button>
              <button
                type="button"
                onClick={() => setDisplayCurrency('uzs')}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: displayCurrency === 'uzs' ? '#16a34a' : 'transparent',
                  color: displayCurrency === 'uzs' ? '#ffffff' : '#475569',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  fontSize: '13px',
                  transition: 'all 0.2s'
                }}
              >
                SO'M
              </button>
            </div>

            {/* DOLLAR KURSINI O'ZGARTIRISH FORMASI */}
            <form onSubmit={handleSaveRate} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#ffffff',
              padding: '6px 12px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
            }}>
              <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#334155' }}>
                💵 1 USD =
              </span>
              <input 
                type="number"
                value={inputRate}
                onChange={(e) => setInputRate(e.target.value)}
                style={{
                  width: '90px',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  border: '1px solid #94a3b8',
                  fontSize: '13px',
                  fontWeight: 'bold',
                  outline: 'none'
                }}
                required
              />
              <span style={{ fontSize: '12px', color: '#64748b' }}>so'm</span>
              <button
                type="submit"
                disabled={updatingRate}
                style={{
                  padding: '5px 12px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: '#16a34a',
                  color: '#ffffff',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  fontSize: '12px',
                  transition: 'all 0.2s'
                }}
              >
                {updatingRate ? "..." : (currentLang === 'uz' ? "Saqlash" : "Сохранить")}
              </button>
            </form>

            <button onClick={openCreateModal} className="btn-main-add">
              <span>+</span> {currentTranslation.addBtn}
            </button>

          </div>
        </div>

        {/* BREADCRUMBS */}
        <div className="katalog-breadcrumbs">
          <button onClick={() => setSelectedType(null)} className="breadcrumb-btn">
            {currentTranslation.mainCat}
          </button>
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
            {/* 1-BOSQICH: BARCHA TURLAR RO'YXATI */}
            {!selectedType && (
              <div>
                <div className="section-divider">
                  <h2>{currentTranslation.selectType}</h2>
                  <span className="badge-count">{allTypes.length} {currentTranslation.countBadge}</span>
                </div>
                <div className="types-light-grid">
                  {allTypes.map(turi => (
                    <div key={turi} onClick={() => setSelectedType(turi)} className="type-light-card">
                      <div className="type-card-info">
                        <p className="type-name">{turi}</p>
                        <p className="type-subtext">{getTypeCount(turi)} {currentTranslation.pumpCount}</p>
                      </div>
                      <span className="type-arrow">→</span>
                    </div>
                  ))}
                  {allTypes.length === 0 && (
                    <div className="no-data-box"><p>{currentTranslation.noTypes}</p></div>
                  )}
                </div>
              </div>
            )}

            {/* 2-BOSQICH: MODELLAR RO'YXATI */}
            {selectedType && (
              <div>
                <div className="katalog-inner-header">
                  <div className="section-divider" style={{ margin: 0 }}>
                    <h2>{selectedType} {currentTranslation.models}</h2>
                  </div>
                  <button onClick={() => setSelectedType(null)} className="katalog-back-btn">
                    ⬅ {currentTranslation.back}
                  </button>
                </div>
                
                <div className="products-light-grid">
                  {filteredProducts.map(item => {
                    const resolvedImage = getProductImageSrc(item?.image_url, item?.title_uz || item?.title_ru);

                    return (
                      <div key={item.id} onClick={() => setViewingProductDetails(item)} className="product-light-card">
                        <div className="product-img-box">
                          <span className="product-tag">{item?.type_id?.toUpperCase()}</span>
                          <img 
                            src={resolvedImage} 
                            alt={item?.title_uz || "Nasos"} 
                            className="product-catalog-img" 
                            style={{ width: '100%', height: '140px', objectFit: 'contain', padding: '5px' }}
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = imgImageOne;
                            }}
                          />
                        </div>

                        <div className="product-details">
                          <div className="product-title-group">
                            <h3>{currentLang === 'uz' ? item?.title_uz : item?.title_ru}</h3>
                            <p className="product-id-badge">ID: {item?.id}</p>
                          </div>
                          
                          <div className="product-footer-action">
                            <span className="product-price">{formatPrice(item?.price, item?.currency)}</span>
                            <div className="admin-crud-group">
                              <button onClick={(e) => openEditModal(e, item)} className="btn-crud edit">✏️</button>
                              <button onClick={(e) => handleDelete(e, item.id)} className="btn-crud delete">🗑️</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {filteredProducts.length === 0 && (
                  <div className="no-data-box"><p>{currentTranslation.noProducts}</p></div>
                )}
              </div>
            )}
          </>
        )}

        {/* 3-BOSQICH: MODAL — BATAFSIL KO'RISH */}
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
                  <img 
                    src={getProductImageSrc(viewingProductDetails?.image_url, viewingProductDetails?.title_uz || viewingProductDetails?.title_ru)} 
                    alt="Katta ko'rinish" 
                    style={{ maxHeight: '180px', maxWidth: '100%', objectFit: 'contain' }}
                    onError={(e) => { e.currentTarget.src = imgImageOne; }}
                  />
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
                    <p className="detail-value price-color">{formatPrice(viewingProductDetails?.price, viewingProductDetails?.currency)}</p>
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

        {/* 4-BOSQICH: MODAL — QO'SHISH VA TAHRIRLASH */}
        {isModalOpen && (
          <div className="admin-modal-overlay">
            <div className="admin-modal-card" style={{ maxWidth: '520px' }}>
              <div className="modal-header-light">
                <h2>{editingProduct ? `✏️ ${currentTranslation.edit}` : `➕ ${currentTranslation.addBtn}`}</h2>
              </div>
              
              <form onSubmit={handleSubmit}>
                <div className="modal-body-content" style={{ paddingBottom: '8px', maxHeight: '70vh', overflowY: 'auto' }}>
                  <div className="admin-form-group">
                    <label>{currentTranslation.formNameUz}</label>
                    <input type="text" required value={formData.title_uz} onChange={(e) => setFormData({...formData, title_uz: e.target.value})} />
                  </div>

                  <div className="admin-form-group">
                    <label>{currentTranslation.formNameRu}</label>
                    <input type="text" required value={formData.title_ru} onChange={(e) => setFormData({...formData, title_ru: e.target.value})} />
                  </div>

                  {/* VALYUTA TOGGLE TUGMASI VA NARX */}
                  <div className="form-row-split">
                    <div className="admin-form-group">
                      <label>{currentTranslation.formPrice}</label>
                      <input type="number" step="any" required placeholder="Masalan: 63" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} />
                    </div>
                    <div className="admin-form-group">
                      <label>{currentTranslation.formCurrency}</label>
                      <div style={{ display: 'flex', gap: '5px', marginTop: '4px' }}>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, currency: 'usd' })}
                          style={{
                            flex: 1,
                            padding: '8px',
                            border: '1px solid #cbd5e1',
                            borderRadius: '6px',
                            backgroundColor: formData.currency === 'usd' ? '#2563eb' : '#f8fafc',
                            color: formData.currency === 'usd' ? '#ffffff' : '#334155',
                            fontWeight: 'bold',
                            cursor: 'pointer'
                          }}
                        >
                          USD ($)
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, currency: 'uzs' })}
                          style={{
                            flex: 1,
                            padding: '8px',
                            border: '1px solid #cbd5e1',
                            borderRadius: '6px',
                            backgroundColor: formData.currency === 'uzs' ? '#16a34a' : '#f8fafc',
                            color: formData.currency === 'uzs' ? '#ffffff' : '#334155',
                            fontWeight: 'bold',
                            cursor: 'pointer'
                          }}
                        >
                          SO'M
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="admin-form-group">
                    <label>{currentTranslation.formCat}</label>
                    <input type="text" required className="uppercase-input" value={formData.type_id} onChange={(e) => setFormData({...formData, type_id: e.target.value})} />
                  </div>

                  {/* 📷 RASM TANLASH QISMI */}
                  <div className="admin-form-group" style={{ background: '#f1f5f9', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                    <div style={{ marginBottom: '10px' }}>
                      <label style={{ fontWeight: 'bold', color: '#0f172a' }}>📁 {currentTranslation.formImgUpload}:</label>
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={handleFileChange}
                        style={{ width: '100%', marginTop: '5px' }}
                      />
                    </div>

                    <div style={{ textAlign: 'center', fontSize: '12px', color: '#64748b', margin: '5px 0' }}>— YOKI —</div>

                    <div>
                      <label style={{ fontWeight: 'bold', color: '#0f172a' }}>🖼️ {currentTranslation.formImgSelect}:</label>
                      <select 
                        value={formData.image_url} 
                        onChange={(e) => {
                          setFormData({ ...formData, image_url: e.target.value });
                          setImageFile(null);
                          setPreviewImage(null);
                        }}
                        style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '5px' }}
                      >
                        <option value="">-- Statik rasm tanlang --</option>
                        {Object.keys(imageMapping).map((imgKey) => (
                          <option key={imgKey} value={imgKey}>{imgKey}</option>
                        ))}
                      </select>
                    </div>

                    {(previewImage || formData.image_url) && (
                      <div style={{ marginTop: '10px', textAlign: 'center' }}>
                        <p style={{ fontSize: '11px', color: '#64748b', marginBottom: '4px' }}>Oldindan ko'rish:</p>
                        <img 
                          src={previewImage || getProductImageSrc(formData.image_url, formData.title_uz)} 
                          alt="Preview" 
                          style={{ maxHeight: '80px', objectFit: 'contain', borderRadius: '4px', border: '1px solid #e2e8f0' }}
                        />
                      </div>
                    )}
                  </div>

                  {/* TEXNIK XUSUSIYATLAR */}
                  <div className="form-row-split">
                    <div className="admin-form-group">
                      <label>{currentTranslation.formTypeUz}</label>
                      <input type="text" value={formData.turi_uz} onChange={(e) => setFormData({...formData, turi_uz: e.target.value})} />
                    </div>
                    <div className="admin-form-group">
                      <label>{currentTranslation.formTypeRu}</label>
                      <input type="text" value={formData.turi_ru} onChange={(e) => setFormData({...formData, turi_ru: e.target.value})} />
                    </div>
                  </div>

                  <div className="form-row-split">
                    <div className="admin-form-group">
                      <label>{currentTranslation.formVkhVykh}</label>
                      <input type="text" placeholder='Masalan: 1"x1"' value={formData.vkh_vykh} onChange={(e) => setFormData({...formData, vkh_vykh: e.target.value})} />
                    </div>
                    <div className="admin-form-group">
                      <label>{currentTranslation.formKw}</label>
                      <input type="text" placeholder="Masalan: 0.37" value={formData.kw} onChange={(e) => setFormData({...formData, kw: e.target.value})} />
                    </div>
                  </div>

                  <div className="form-row-split">
                    <div className="admin-form-group">
                      <label>{currentTranslation.formLm}</label>
                      <input type="text" placeholder="Masalan: 35" value={formData.lm} onChange={(e) => setFormData({...formData, lm: e.target.value})} />
                    </div>
                    <div className="admin-form-group">
                      <label>{currentTranslation.formPodyem}</label>
                      <input type="text" placeholder="Masalan: 35" value={formData.podyem} onChange={(e) => setFormData({...formData, podyem: e.target.value})} />
                    </div>
                  </div>
                </div>

                <div className="modal-footer-actions">
                  <button type="submit" disabled={uploadingImage} className="btn-modal-action save">
                    {uploadingImage ? currentTranslation.uploading : currentTranslation.save}
                  </button>
                  <button type="button" onClick={() => setIsModalOpen(false)} className="btn-modal-action cancel">
                    {currentTranslation.cancel}
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