import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { supabase } from '../../../supabase/client';
import './katalog.css';

// === BARCHA RASMLAR IMPORTI (assets2 PAPKASIDAN) ===
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
  "CHM.png": imgCHM,
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

const autoFallbackImage = (title) => {
  if (!title) return imgImageOne;
  const name = title.toUpperCase();
  if (name.includes("QFD")) return imgQFD;
  if (name.includes("QDX")) return imgQDX;
  if (name.includes("TCM")) return imgTCM;
  if (name.includes("JET")) return name.includes("400") ? imgJET400S : imgJET;
  if (name.includes("THF")) return imgTHF;
  if (name.includes("TNF")) return imgTNF;
  if (name.includes("PW")) return name.includes("-E") ? imgPWE : imgPW;
  if (name.includes("GRS")) return name.includes("25-4-6") ? imgGRS25_4_6 : name.includes("-F") ? imgGRSF : imgGRSH;
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
  if (imgUrl.startsWith("http://") || imgUrl.startsWith("https://")) return imgUrl;
  return imageMapping[imgUrl.trim()] || autoFallbackImage(title);
};

export default function AdminCatalog({ lang, usdRate: propUsdRate, onRateUpdate }) {
  const [products, setProducts] = useState([]);
  const [customCategories, setCustomCategories] = useState([]);
  const [categoryOrder, setCategoryOrder] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentLang, setCurrentLang] = useState(lang || 'uz');

  // DOLLAR KURSI STATELARI
  const [rate, setRate] = useState(propUsdRate || 12800);
  const [inputRate, setInputRate] = useState(propUsdRate || 12800);
  const [displayCurrency, setDisplayCurrency] = useState('usd');

  // TANLANGAN KATALOG
  const [selectedType, setSelectedType] = useState(null);
  const [viewingProductDetails, setViewingProductDetails] = useState(null);

  // MODALLAR STATELARI
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);

  const [newCatUz, setNewCatUz] = useState('');
  const [newCatRu, setNewCatRu] = useState('');
  const [newCatPosition, setNewCatPosition] = useState('top');

  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const [formData, setFormData] = useState({
    title_uz: '', title_ru: '', price: '', currency: 'usd', image_url: '', type_id: '',
    turi_uz: '', turi_ru: '', vkh_vykh: '', kw: '', lm: '', podyem: ''
  });
  const [newProductPosition, setNewProductPosition] = useState('top');

  const getTypeValue = useCallback((product) => {
    const arr = product?.characteristics || product?.specs || [];
    const searchKey = currentLang === 'ru' ? "Тип" : "Turi";
    const foundObj = arr.find(c => c?.key === searchKey) || arr.find(c => c?.key === "Turi" || c?.key === "Тип");
    return foundObj?.value ? foundObj.value.trim() : null;
  }, [currentLang]);

  useEffect(() => {
    if (lang) setCurrentLang(lang);
  }, [lang]);

  // DOLLAR KURSINI VA KATALOG TARTIBINI 'shop_settings' JADVALidan OLISH
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('products').select('*').order('sort_order', { ascending: true, nullsFirst: false });
      if (error) {
        const { data: fallbackData } = await supabase.from('products').select('*').order('id', { ascending: false });
        setProducts(fallbackData || []);
      } else {
        setProducts(data || []);
      }

      // shop_settings jadvalidan kurs va kategoriya tartibini olish
      const { data: settingsData } = await supabase.from('shop_settings').select('*').eq('id', 1).single();
      if (settingsData) {
        if (settingsData.usd_rate) {
          const savedRate = Number(settingsData.usd_rate);
          setRate(savedRate);
          setInputRate(savedRate);
          if (onRateUpdate) onRateUpdate(savedRate);
        }
        if (settingsData.category_order && Array.isArray(settingsData.category_order)) {
          setCategoryOrder(settingsData.category_order);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [onRateUpdate]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Agar shop_settings'da hali tartib saqlanmagan bo'lsa, mahsulotlardan yig'ib turadi
  useEffect(() => {
    const typesFromProducts = products.map(getTypeValue).filter(Boolean);
    const combined = new Set([...typesFromProducts, ...customCategories]);
    
    setCategoryOrder(prev => {
      if (prev.length === 0) {
        return [...combined];
      }
      const stillExisting = prev.filter(t => combined.has(t));
      const missing = [...combined].filter(t => !stillExisting.includes(t));
      return [...stillExisting, ...missing];
    });
  }, [products, customCategories, getTypeValue]);

  const allTypes = categoryOrder;

  // --- KATALOG TARTIBINI O'ZGARTIRISH VA BAZAGA SAQLASH ---
  const moveCategory = async (index, direction) => {
    const newOrder = [...categoryOrder];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= newOrder.length) return;

    const temp = newOrder[index];
    newOrder[index] = newOrder[targetIndex];
    newOrder[targetIndex] = temp;

    setCategoryOrder(newOrder);

    // Supabase'ga saqlash
    try {
      const { error } = await supabase.from('shop_settings').upsert({
        id: 1,
        category_order: newOrder
      });

      if (error) console.error("Katalog tartibini saqlashda xatolik:", error.message);
    } catch (err) {
      console.error("Bazaga yozishda xatolik:", err);
    }
  };

  const moveProduct = async (index, direction) => {
    const currentList = [...filteredProducts];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= currentList.length) return;

    const temp = currentList[index];
    currentList[index] = currentList[targetIndex];
    currentList[targetIndex] = temp;

    try {
      const updates = currentList.map((prod, idx) => 
        supabase.from('products').update({ sort_order: idx }).eq('id', prod.id)
      );
      await Promise.all(updates);
      fetchProducts();
    } catch (err) {
      console.error("Mahsulot tartibini saqlashda xatolik:", err);
    }
  };

  const handleSaveRate = async () => {
    const parsedRate = parseFloat(inputRate);
    if (!parsedRate || parsedRate <= 0) {
      alert("Iltimos, to'g'ri valyuta kursini kiriting!");
      return;
    }
    setRate(parsedRate);
    if (onRateUpdate) onRateUpdate(parsedRate);

    try {
      const { error } = await supabase.from('shop_settings').upsert({
        id: 1,
        usd_rate: parsedRate
      });

      if (error) throw error;
      alert(currentLang === 'uz' ? "Valyuta kursi bazaga saqlandi!" : "Курс валюты сохранен в базе!");
    } catch (err) {
      console.error("Kursni saqlashda xatolik:", err);
      alert("Xatolik: " + err.message);
    }
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    if (!newCatUz.trim()) return;

    const newName = newCatUz.trim();
    const newNameRu = newCatRu.trim() || newName;

    if (editingCategory) {
      const oldName = editingCategory;
      const productsToUpdate = products.filter(p => getTypeValue(p) === oldName);

      for (let prod of productsToUpdate) {
        const charArr = prod.characteristics || prod.specs || [];
        const updatedChar = charArr.map(item => {
          if (item.key === "Turi" || item.key === "Тип") {
            return { ...item, value: item.key === "Turi" ? newName : newNameRu };
          }
          return item;
        });

        await supabase.from('products').update({ characteristics: updatedChar, specs: updatedChar }).eq('id', prod.id);
      }

      setCustomCategories(prev => prev.map(c => c === oldName ? newName : c));
      const updatedOrder = categoryOrder.map(c => c === oldName ? newName : c);
      setCategoryOrder(updatedOrder);
      
      // Bazaga yangilangan tartibni yozish
      await supabase.from('shop_settings').upsert({ id: 1, category_order: updatedOrder });

      alert(currentLang === 'uz' ? "Katalog nomi o'zgartirildi!" : "Название категории изменено!");
    } else {
      const dummySpecs = [
        { key: "Turi", value: newName },
        { key: "Тип", value: newNameRu },
        { key: "Вх/Вых", value: "-" },
        { key: "кВт", value: "0" },
        { key: "л/м", value: "0" },
        { key: "Подъём", value: "0" }
      ];

      const newCategoryProduct = {
        title_uz: `${newName} (Namuna)`,
        title_ru: `${newNameRu} (Образец)`,
        price: 0,
        currency: 'usd',
        image_url: null,
        type_id: newName.toLowerCase().replace(/\s+/g, '_'),
        characteristics: dummySpecs,
        specs: dummySpecs,
        sort_order: 0
      };

      const { error } = await supabase.from('products').insert([newCategoryProduct]);

      if (error) {
        alert("Katalog yaratishda xatolik: " + error.message);
        return;
      }

      if (!customCategories.includes(newName)) {
        setCustomCategories(prev => [...prev, newName]);
      }

      const filtered = categoryOrder.filter(t => t !== newName);
      const newOrder = newCatPosition === 'top' ? [newName, ...filtered] : [...filtered, newName];
      setCategoryOrder(newOrder);

      // Bazaga yangi tartibni yozish
      await supabase.from('shop_settings').upsert({ id: 1, category_order: newOrder });

      alert(currentLang === 'uz' ? "Yangi katalog yaratildi!" : "Категория создана!");
    }

    setNewCatUz('');
    setNewCatRu('');
    setNewCatPosition('top');
    setEditingCategory(null);
    setIsCategoryModalOpen(false);
    fetchProducts();
  };

  const handleDeleteCategory = async (e, catName) => {
    e.stopPropagation();
    if (!window.confirm(currentLang === 'uz' ? `"${catName}" katalogini va unga tegishli BARCHA mahsulotlarni o'chirmoqchimisiz?` : `Удалить категорию "${catName}" и ВСЕ ее товары?`)) {
      return;
    }

    const productsToDelete = products.filter(p => getTypeValue(p) === catName);

    for (let prod of productsToDelete) {
      await supabase.from('products').delete().eq('id', prod.id);
    }

    setCustomCategories(prev => prev.filter(c => c !== catName));
    const newOrder = categoryOrder.filter(c => c !== catName);
    setCategoryOrder(newOrder);

    // Bazadan o'chirilgach, tartibni ham yangilaymiz
    await supabase.from('shop_settings').upsert({ id: 1, category_order: newOrder });

    alert(currentLang === 'uz' ? "Katalog va uning mahsulotlari o'chirildi!" : "Категория и ее товары удалены!");
    fetchProducts();
  };

  const openEditCategoryModal = (e, catName) => {
    e.stopPropagation();
    setEditingCategory(catName);
    setNewCatUz(catName);
    setNewCatRu(catName);
    setIsCategoryModalOpen(true);
  };

  const openCreateProductModal = () => {
    if (!selectedType) return;
    setEditingProduct(null);
    setImageFile(null);
    setPreviewImage(null);
    setNewProductPosition('top');
    setFormData({
      title_uz: '', title_ru: '', price: '', currency: 'usd', image_url: '',
      type_id: selectedType.toLowerCase().replace(/\s+/g, '_'),
      turi_uz: selectedType, turi_ru: selectedType,
      vkh_vykh: '', kw: '', lm: '', podyem: ''
    });
    setIsProductModalOpen(true);
  };

  const openEditProductModal = (e, product) => {
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
      turi_uz: targetArray.find(c => c?.key === "Turi")?.value || selectedType || '',
      turi_ru: targetArray.find(c => c?.key === "Тип")?.value || selectedType || '',
      vkh_vykh: targetArray.find(c => c?.key === "Вх/Вых")?.value || '',
      kw: targetArray.find(c => c?.key === "кВт")?.value || '',
      lm: targetArray.find(c => c?.key === "л/м")?.value || '',
      podyem: targetArray.find(c => c?.key === "Подъём")?.value || ''
    });
    setIsProductModalOpen(true);
  };

  const handleDeleteProduct = async (e, productId) => {
    e.stopPropagation();
    if (!window.confirm(currentLang === 'uz' ? "Ushbu mahsulotni o'chirmoqchimisiz?" : "Удалить этот товар?")) return;

    try {
      const { error } = await supabase.from('products').delete().eq('id', productId);
      if (error) throw error;
      setProducts(prev => prev.filter(p => p.id !== productId));
      if (viewingProductDetails?.id === productId) setViewingProductDetails(null);
    } catch (err) {
      alert("Xatolik: " + err.message);
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    let finalImageUrl = formData.image_url;

    try {
      setUploadingImage(true);

      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
        const filePath = `products/${fileName}`;

        const { error: uploadError } = await supabase.storage.from('product-images').upload(filePath, imageFile);
        if (uploadError) throw new Error("Rasm yuklashda xatolik: " + uploadError.message);

        const { data: publicUrlData } = supabase.storage.from('product-images').getPublicUrl(filePath);
        finalImageUrl = publicUrlData.publicUrl;
      }

      const jsonFormat = [
        { key: "Turi", value: formData.turi_uz.trim() },
        { key: "Тип", value: formData.turi_ru.trim() || formData.turi_uz.trim() },
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
        specs: jsonFormat,
        sort_order: newProductPosition === 'top' ? 0 : 9999
      };

      let error;

      if (editingProduct) {
        const res = await supabase.from('products').update(productData).eq('id', editingProduct.id).select();
        error = res.error;
      } else {
        const res = await supabase.from('products').insert([productData]).select();
        error = res.error;
      }

      if (error) throw error;

      alert(currentLang === 'uz' ? "Muvaffaqiyatli saqlandi!" : "Успешно сохранено!");
      setIsProductModalOpen(false);
      fetchProducts();
    } catch (err) {
      alert(err.message);
    } finally {
      setUploadingImage(false);
    }
  };

  const formatPrice = (itemPrice, itemCurrency = 'usd') => {
    if (!itemPrice) return '0';
    const numPrice = Number(itemPrice);
    if (displayCurrency === 'uzs') {
      const somVal = (itemCurrency === 'usd') ? numPrice * rate : numPrice;
      return `${Math.round(somVal).toLocaleString('uz-UZ')} so'm`;
    } else {
      const usdVal = (itemCurrency === 'uzs' || itemCurrency === 'sum') ? (numPrice / rate) : numPrice;
      return `$${usdVal % 1 === 0 ? usdVal : usdVal.toFixed(2)}`;
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter(p => getTypeValue(p) === selectedType);
  }, [products, selectedType, getTypeValue]);

  return (
    <div className="katalog-light-wrapper">
      <div className="katalog-container-max">

        {/* BANNER DASHBOARD */}
        <div className="katalog-light-banner">
          <div className="banner-top-row">
            <div className="banner-left-info">
              <div className="banner-icon-title">
                <span>⚙️</span>
                <h1>
                  {currentLang === 'uz' ? "Admin boshqaruv paneli" : "Панель управления"}
                </h1>
              </div>
              <p>
                {currentLang === 'uz' ? "Katalog turlari va modellarini boshqarish tizimi" : "Система управления категориями и моделями"}
              </p>
            </div>

            {!selectedType ? (
              <button
                onClick={() => { setEditingCategory(null); setNewCatUz(''); setNewCatRu(''); setNewCatPosition('top'); setIsCategoryModalOpen(true); }}
                className="btn-main-add btn-blue"
              >
                📁 {currentLang === 'uz' ? "Yangi Katalog Yaratish" : "Создать Категорию"}
              </button>
            ) : (
              <button
                onClick={openCreateProductModal}
                className="btn-main-add btn-green"
              >
                ➕ {currentLang === 'uz' ? "Ushbu Katalogga Mahsulot Qo'shish" : "Добавить товар"}
              </button>
            )}
          </div>

          <div className="banner-rate-row">
            <div className="currency-toggle-group">
              <button
                type="button"
                onClick={() => setDisplayCurrency('usd')}
                className={`currency-toggle-btn ${displayCurrency === 'usd' ? 'active-usd' : ''}`}
              >
                USD ($)
              </button>
              <button
                type="button"
                onClick={() => setDisplayCurrency('uzs')}
                className={`currency-toggle-btn ${displayCurrency === 'uzs' ? 'active-uzs' : ''}`}
              >
                SO'M
              </button>
            </div>

            <div className="rate-input-box">
              <span>💵</span>
              <span className="rate-title">1 USD =</span>
              <input
                type="number"
                value={inputRate}
                onChange={(e) => setInputRate(e.target.value)}
              />
              <span className="rate-unit">so'm</span>
              <button onClick={handleSaveRate} className="rate-save-btn">
                Saqlash
              </button>
            </div>
          </div>
        </div>

        {/* BREADCRUMB */}
        <div className="katalog-breadcrumbs">
          <button onClick={() => setSelectedType(null)} className="breadcrumb-btn">
            🏠 {currentLang === 'uz' ? "Barcha Kataloglar" : "Все Категории"}
          </button>
          {selectedType && (
            <>
              <span className="breadcrumb-separator">/</span>
              <span className="breadcrumb-current">📁 {selectedType}</span>
            </>
          )}
        </div>

        {loading ? (
          <div className="katalog-spinner-box"><div className="spinner"></div></div>
        ) : (
          <>
            {!selectedType && (
              <div>
                <div className="section-divider">
                  <h2>{currentLang === 'uz' ? "Mavjud Kataloglar (Turlar)" : "Существующие категории"}</h2>
                  <span className="badge-count">{allTypes.length} ta katalog</span>
                </div>

                <div className="types-light-grid">
                  {allTypes.map((turi, index) => {
                    const count = products.filter(p => getTypeValue(p) === turi).length;
                    return (
                      <div
                        key={turi}
                        onClick={() => setSelectedType(turi)}
                        className="type-light-card"
                      >
                        <div className="type-card-info">
                          <p>📁 {turi}</p>
                          <p>{count} {currentLang === 'uz' ? "ta mahsulot" : "товаров"}</p>
                        </div>

                        <div className="type-card-actions">
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); moveCategory(index, 'up'); }}
                            disabled={index === 0}
                            title="Yuqoriga surish"
                            className={`edit-btn ${index === 0 ? 'disabled' : ''}`}
                          >
                            ⬆️
                          </button>

                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); moveCategory(index, 'down'); }}
                            disabled={index === allTypes.length - 1}
                            title="Pastga surish"
                            className={`edit-btn ${index === allTypes.length - 1 ? 'disabled' : ''}`}
                          >
                            ⬇️
                          </button>

                          <button
                            type="button"
                            onClick={(e) => openEditCategoryModal(e, turi)}
                            title="Katalogni tahrirlash"
                            className="edit-btn"
                          >
                            ✏️
                          </button>

                          <button
                            type="button"
                            onClick={(e) => handleDeleteCategory(e, turi)}
                            title="Katalogni o'chirish"
                            className="delete-btn"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {selectedType && (
              <div>
                <div className="katalog-inner-header">
                  <h2 className="inner-title-text">📁 {selectedType} {currentLang === 'uz' ? "modelleri" : "модели"}:</h2>
                  <button onClick={() => setSelectedType(null)} className="katalog-back-btn">
                    ⬅ {currentLang === 'uz' ? "Kataloglarga qaytish" : "Назад к категориям"}
                  </button>
                </div>

                <div className="products-light-grid">
                  {filteredProducts.map((item, index) => (
                    <div key={item.id} onClick={() => setViewingProductDetails(item)} className="product-light-card">
                      <div className="product-img-box">
                        <span className="product-tag">{item?.type_id?.toUpperCase()}</span>
                        <img
                          src={getProductImageSrc(item?.image_url, item?.title_uz || item?.title_ru)}
                          alt={item?.title_uz || "Nasos"}
                          className="product-catalog-img"
                          onError={(e) => { e.currentTarget.src = imgImageOne; }}
                        />
                      </div>

                      <div className="product-details">
                        <h3>{currentLang === 'uz' ? item?.title_uz : item?.title_ru}</h3>
                        <div className="product-footer-action">
                          <span className="product-price">{formatPrice(item?.price, item?.currency)}</span>
                          <div className="admin-crud-group">
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); moveProduct(index, 'up'); }}
                              disabled={index === 0}
                              title="Yuqoriga surish"
                              className={`product-move-btn ${index === 0 ? 'disabled' : ''}`}
                            >
                              ⬆️
                            </button>
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); moveProduct(index, 'down'); }}
                              disabled={index === filteredProducts.length - 1}
                              title="Pastga surish"
                              className={`product-move-btn ${index === filteredProducts.length - 1 ? 'disabled' : ''}`}
                            >
                              ⬇️
                            </button>
                            <button onClick={(e) => openEditProductModal(e, item)} className="btn-crud edit">✏️</button>
                            <button onClick={(e) => handleDeleteProduct(e, item.id)} className="btn-crud delete">🗑️</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {filteredProducts.length === 0 && (
                  <div className="no-data-box">
                    <p>{currentLang === 'uz' ? "Ushbu katalogda hali mahsulotlar yo'q." : "В этой категории пока нет товаров."}</p>
                    <button onClick={openCreateProductModal} className="btn-main-add btn-green" style={{ marginTop: '10px' }}>
                      ➕ Birinchi mahsulotni qo'shish
                    </button>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* MODAL 1: KATALOG QO'SHISH VA TAHRIRLASH */}
        {isCategoryModalOpen && (
          <div className="admin-modal-overlay">
            <div className="admin-modal-card modal-small">
              <h2>📁 {editingCategory ? (currentLang === 'uz' ? "Katalogni Tahrirlash" : "Редактировать Категорию") : (currentLang === 'uz' ? "Yangi Katalog Qo'shish" : "Добавить Категорию")}</h2>
              <form onSubmit={handleSaveCategory} className="admin-form-container">
                <div className="modal-body-content">
                  <div className="admin-form-group">
                    <label>Katalog Nomi (UZ):</label>
                    <input type="text" required value={newCatUz} onChange={(e) => setNewCatUz(e.target.value)} placeholder="Masalan: Vixrevoy nasoslar" />
                  </div>
                  <div className="admin-form-group">
                    <label>Katalog Nomi (RU):</label>
                    <input type="text" value={newCatRu} onChange={(e) => setNewCatRu(e.target.value)} placeholder="Masalan: Вихревые насосы" />
                  </div>

                  {!editingCategory && (
                    <div className="admin-form-group">
                      <label>{currentLang === 'uz' ? "Qo'shish joyi:" : "Место добавления:"}</label>
                      <div className="position-buttons-group">
                        <button
                          type="button"
                          onClick={() => setNewCatPosition('top')}
                          className={`position-btn ${newCatPosition === 'top' ? 'active' : ''}`}
                        >
                          ⬆️ {currentLang === 'uz' ? "Yuqoridan" : "Сверху"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setNewCatPosition('bottom')}
                          className={`position-btn ${newCatPosition === 'bottom' ? 'active' : ''}`}
                        >
                          ⬇️ {currentLang === 'uz' ? "Pastdan" : "Снизу"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                <div className="modal-footer-actions">
                  <button type="button" onClick={() => setIsCategoryModalOpen(false)} className="btn-modal-action cancel">Yopish</button>
                  <button type="submit" className="btn-modal-action save">Saqlash</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL 2: MAHSULOT QO'SHISH VA TAHRIRLASH */}
        {isProductModalOpen && (
          <div className="admin-modal-overlay">
            <div className="admin-modal-card large">
              <h2>{editingProduct ? '✏️ Tahrirlash' : `➕ "${selectedType}" Katalogiga Mahsulot Qo'shish`}</h2>

              <form onSubmit={handleProductSubmit} className="admin-form-container">
                <div className="modal-body-content">

                  {!editingProduct && (
                    <div className="admin-form-group position-highlight-box">
                      <label className="position-highlight-label">{currentLang === 'uz' ? "Ro'yxatga qo'shish joyi:" : "Место добавления в список:"}</label>
                      <div className="position-buttons-group">
                        <button
                          type="button"
                          onClick={() => setNewProductPosition('top')}
                          className={`position-btn green ${newProductPosition === 'top' ? 'active' : ''}`}
                        >
                          ⬆️ {currentLang === 'uz' ? "Yuqoridan qo'shish" : "Добавить сверху"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setNewProductPosition('bottom')}
                          className={`position-btn green ${newProductPosition === 'bottom' ? 'active' : ''}`}
                        >
                          ⬇️ {currentLang === 'uz' ? "Pastdan qo'shish" : "Добавить снизу"}
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="admin-form-group">
                    <label>Mahsulot nomi (UZ):</label>
                    <input type="text" required value={formData.title_uz} onChange={(e) => setFormData({ ...formData, title_uz: e.target.value })} />
                  </div>

                  <div className="admin-form-group">
                    <label>Mahsulot nomi (RU):</label>
                    <input type="text" required value={formData.title_ru} onChange={(e) => setFormData({ ...formData, title_ru: e.target.value })} />
                  </div>

                  <div className="form-row-split">
                    <div className="admin-form-group">
                      <label>Narxi:</label>
                      <input type="number" step="any" required value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
                    </div>
                    <div className="admin-form-group">
                      <label>Valyuta:</label>
                      <select value={formData.currency} onChange={(e) => setFormData({ ...formData, currency: e.target.value })}>
                        <option value="usd">USD ($)</option>
                        <option value="uzs">SO'M</option>
                      </select>
                    </div>
                  </div>

                  <div className="admin-form-group">
                    <label>Kategoriya Kodu (type_id):</label>
                    <input type="text" required value={formData.type_id} onChange={(e) => setFormData({ ...formData, type_id: e.target.value })} />
                  </div>

                  <div className="admin-form-group image-upload-container">
                    <label className="image-upload-label">📁 Rasm yuklash (Kompyuterdan):</label>
                    <input type="file" accept="image/*" onChange={(e) => {
                      if (e.target.files[0]) {
                        setImageFile(e.target.files[0]);
                        setPreviewImage(URL.createObjectURL(e.target.files[0]));
                      }
                    }} className="file-input-field" />

                    {(previewImage || formData.image_url) && (
                      <div className="image-preview-wrapper">
                        <img
                          src={previewImage || getProductImageSrc(formData.image_url, formData.title_uz)}
                          alt="Preview"
                          className="image-preview-tag"
                        />
                      </div>
                    )}
                  </div>

                  <div className="form-row-split">
                    <div className="admin-form-group">
                      <label>Вх/Вых (Masalan: 1"x1"):</label>
                      <input type="text" value={formData.vkh_vykh} onChange={(e) => setFormData({ ...formData, vkh_vykh: e.target.value })} />
                    </div>
                    <div className="admin-form-group">
                      <label>кВт (Masalan: 0.37):</label>
                      <input type="text" value={formData.kw} onChange={(e) => setFormData({ ...formData, kw: e.target.value })} />
                    </div>
                  </div>

                  <div className="form-row-split">
                    <div className="admin-form-group">
                      <label>л/м (Masalan: 35):</label>
                      <input type="text" value={formData.lm} onChange={(e) => setFormData({ ...formData, lm: e.target.value })} />
                    </div>
                    <div className="admin-form-group">
                      <label>Подъём (Masalan: 35):</label>
                      <input type="text" value={formData.podyem} onChange={(e) => setFormData({ ...formData, podyem: e.target.value })} />
                    </div>
                  </div>

                </div>

                <div className="modal-footer-actions">
                  <button type="button" onClick={() => setIsProductModalOpen(false)} className="btn-modal-action cancel">Bekor qilish</button>
                  <button type="submit" disabled={uploadingImage} className="btn-modal-action save">
                    {uploadingImage ? "Yuklanmoqda..." : "Saqlash"}
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