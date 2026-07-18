// import { useState, useEffect, useRef } from "react";
// import { supabase } from "../../supabase/client";
// import { toast } from "react-toastify";
// import { useNavigate } from "react-router-dom";
// import "./register.css";

// // Tillarga mos ma'lumotlar lug'ati
// const TRANSLATIONS = {
//   uz: {
//     title: "Ro'yxatdan o'tish",
//     namePlaceholder: "Ismingizni kiriting",
//     passwordPlaceholder: "Parol yarating",
//     birthDateLabel: "Tug'ilgan kuningiz",
//     selectRegion: "Viloyatni tanlang",
//     selectDistrict: "Shahar tumanni tanlang",
//     selectJob: "Kasbingizni tanlang",
//     btnNext: "Keyingi",
//     btnBack: "Orqaga",
//     btnSave: "Saqlash",
//     btnSaving: "Saqlanmoqda...",
//     loadingText: "Yuklanmoqda... Iltimos kuting.",
//     welcome: "Xush kelibsiz!",
//     successReg: "Ro‘yxatdan muvaffaqiyatli o‘tdingiz!",
//     errName: "Ism kamida 3 ta harf bo‘lishi kerak!",
//     errPhone: "Telefon raqami to‘liq kiritilmagan!",
//     errPass: "Parol kamida 4 ta belgidan iborat bo‘lishi kerak!",
//     errBirth: "Tug‘ilgan kuningizni kiriting!",
//     errFields: "Viloyat, tuman va kasbingizni tanlang!",
//     errGeneral: "Xatolik yuz berdi"
//   },
//   ru: {
//     title: "Регистрация",
//     namePlaceholder: "Введите ваше имя",
//     passwordPlaceholder: "Создайте пароль",
//     birthDateLabel: "Дата рождения",
//     selectRegion: "Выберите область",
//     selectDistrict: "Выберите город / район",
//     selectJob: "Выберите профессию",
//     btnNext: "Далее",
//     btnBack: "Назад",
//     btnSave: "Сохранить",
//     btnSaving: "Сохранение...",
//     loadingText: "Загрузка... Пожалуйста, подождите.",
//     welcome: "Добро пожаловать!",
//     successReg: "Вы успешно зарегистрировались!",
//     errName: "Имя должно содержать не менее 3 букв!",
//     errPhone: "Номер телефона введен не полностью!",
//     errPass: "Пароль должен состоять минимум из 4 символов!",
//     errBirth: "Укажите дату вашего рождения!",
//     errFields: "Выберите область, район и профессию!",
//     errGeneral: "Произошла ошибка"
//   }
// };

// const UZBEKISTAN_DATA = {
//   "Toshkent shahri": ["Bektemir tumani", "Chilonzor tumani", "Mirobod tumani", "Mirzo Ulug‘bek tumani", "Olmazor tumani", "Sergeli tumani", "Shayxontohur tumani", "Uchtepa tumani", "Yakkasaroy tumani", "Yashnobod tumani", "Yunusobod tumani", "Yangihayot tumani"],
//   "Toshkent viloyati": ["Angren shahri", "Olmaliq shahri", "Chirchiq shahri", "Bekobod shahri", "Ohangaron shahri", "Nurafshon shahri", "Bekobod tumani", "Bo‘stonliq tumani", "Bo‘ka tumani", "Chinoz tumani", "Qibray tumani", "Ohangaron tumani", "Oqqo‘rg‘on tumani", "Parkent tumani", "Piskent tumani", "Quyi Chirchiq tumani", "O‘rta Chirchiq tumani", "Yangiyo‘l tumani", "Yuqori Chirchiq tumani", "Zangiota tumani"],
//   "Andijon": ["Andijon shahri", "Xonobod shahri", "Andijon tumani", "Asaka tumani", "Baliqchi tumani", "Bo‘ston tumani", "Buloqboshi tumani", "Izboskan tumani", "Jalaquduq tumani", "Marhamat tumani", "Oltinköl tumani", "Paxtaobod tumani", "Qo‘rg‘ontepa tumani", "Shahrixon tumani", "Ulug‘nor tumani", "Xo‘jaobod tumani"],
//   "Buxoro": ["Buxoro shahri", "Kogon shahri", "Buxoro tumani", "G‘ijduvon tumani", "Jondor tumani", "Kogon tumani", "Qorako‘l tumani", "Qoravulbozor tumani", "Olot tumani", "Peshku tumani", "Romitan tumani", "Shofirkon tumani", "Vobkent tumani"],
//   "Farg'ona": ["Farg‘ona shahri", "Marg‘ilon shahri", "Qo‘qon shahri", "Quva shahri", "Oltiariq tumani", "Bag‘dod tumani", "Beshariq tumani", "Buvayda tumani", "Dang‘ara tumani", "Farg‘ona tumani", "Furqat tumani", "Qo‘shtepa tumani", "Quva tumani", "Rishton tumani", "So‘x tumani", "Toshloq tumani", "Uchko‘prik tumani", "O‘zbekiston tumani", "Yozyovon tumani"],
//   "Jizzax": ["Jizzax shahri", "Arnasoy tumani", "Baxtamal tumani", "Do‘stlik tumani", "Forish tumani", "G‘allaorol tumani", "Sharof Rashidov tumani", "Mirzachöl tumani", "Paxtakor tumani", "Yangiobod tumani", "Zamin tumani", "Zafarobod tumani", "Zarbdor tumani"],
//   "Xorazm": ["Urganch shahri", "Xiva shahri", "Bog‘ot tumani", "Gurlan tumani", "Xonqa tumani", "Hazorasp tumani", "Qushko‘pir tumani", "Shovot tumani", "Tuproqqal‘a tumani", "Urganch tumani", "Xiva tumani", "Yangiariq tumani", "Yangibozor tumani"],
//   "Namangan": ["Namangan shahri", "Chortoq tumani", "Chust tumani", "Kosonsoy tumani", "Mingbuloq tumani", "Namangan tumani", "Norin tumani", "Pop tumani", "To‘raqo‘rg‘on tumani", "Uychi tumani", "Uchko‘prik tumani", "Yangiqo‘rg‘on tumani", "Davlatobod tumani", "Yangi Namangan tumani"],
//   "Navoiy": ["Navoiy shahri", "Zarafshon shahri", "G‘ozg‘on shahri", "Karmana tumani", "Konimex tumani", "Qiziltepa tumani", "Xatirchi tumani", "Navbahor tumani", "Nurota tumani", "Tomdi tumani", "Uchquduq tumani"],
//   "Qashqadaryo": ["Qarshi shahri", "Shahrisabz shahri", "Chiroqchi tumani", "Dehqonobod tumani", "G‘uzor tumani", "Kasbi tumani", "Kitob tumani", "Koson tumani", "Ko‘kdala tumani", "Mirishkor tumani", "Muborak tumani", "Nishan tumani", "Qarshi tumani", "Shahrisabz tumani", "Yakkabog‘ tumani", "Kamashi tumani"],
//   "Samarqand": ["Samarqand shahri", "Kattaqo‘rg‘on shahri", "Bulung‘ur tumani", "Ishtixon tumani", "Jomboy tumani", "Kattaqo‘rg‘on tumani", "Narpay tumani", "Nurodad tumani", "Oqdaryo tumani", "Paxtachi tumani", "Payariq tumani", "Pastdarg‘om tumani", "Samarqand tumani", "Toyloq tumani", "Urgut tumani", "Qo‘shrabot tumani"],
//   "Sirdaryo": ["Guliston shahri", "Shirin shahri", "Yangiyer shahri", "Boyovut tumani", "Guliston tumani", "Xovos tumani", "Mirzaobod tumani", "Oqoltin tumani", "Sardoba tumani", "Sayxunobod tumani", "Sirdaryo tumani"],
//   "Surxondaryo": ["Termiz shahri", "Angor tumani", "Boysun tumani", "Denov tumani", "Jarqo‘rg‘on tumani", "Qiziriq tumani", "Qumqo‘rg‘on tumani", "Muzrabot tumani", "Oltinsoy tumani", "Sariosiyo tumani", "Sherobod tumani", "Sho‘rchi tumani", "Termiz tumani", "Uzun tumani"],
//   "Qoraqalpog'iston Respublikasi": ["Nukus shahri", "Amudaryo tumani", "Beruniy tumani", "Chimboy tumani", "Ellikqal‘a tumani", "Kegeyli tumani", "Mo‘ynoq tumani", "Nukus tumani", "Qonliko‘l tumani", "Qo‘ng‘irot tumani", "Qorao‘zak tumani", "Shumanay tumani", "Taxtako‘pir tumani", "To‘rtko‘l tumani", "Xo‘jayli tumani", "Taxiatosh tumani", "Bo‘zatov tumani"]
// };

// const KASBLAR_DATA = [
//   "Santexnik", "Elektrik", "Malyar / Suvoqchi", "Kafelchi (Plitkar)", 
//   "Gvipsokarton ustasi", "Armaturchi / Svarshik", "Alyumin profil ustasi (Akfa)", 
//   "Mebelchi", "Duradgor (Yog'och ustasi)", "Boshqa"
// ];

// export default function Register({ lang = "uz", changeLanguage }) {
//   const t = TRANSLATIONS[lang] || TRANSLATIONS.uz;

//   const [step, setStep] = useState(1); 
//   const [fullName, setFullName] = useState("");
//   const [phone, setPhone] = useState("+998 ");
//   const [password, setPassword] = useState("");
//   const [birthDate, setBirthDate] = useState("");
//   const [region, setRegion] = useState("");
//   const [district, setDistrict] = useState(""); 
//   const [job, setJob] = useState("");
//   const [loading, setLoading] = useState(true); 

//   const [regionOpen, setRegionOpen] = useState(false);
//   const [districtOpen, setDistrictOpen] = useState(false);
//   const [jobOpen, setJobOpen] = useState(false);

//   const regionRef = useRef(null);
//   const districtRef = useRef(null);
//   const jobRef = useRef(null);
//   const navigate = useNavigate();

//   const tg = window.Telegram?.WebApp;

//   useEffect(() => {
//     if (tg) {
//       tg.ready();
//       tg.expand(); 
//     }

//     const checkUserAndLogin = async () => {
//       const telegramId = tg?.initDataUnsafe?.user?.id ? String(tg.initDataUnsafe.user.id) : null;

//       if (telegramId) {
//         try {
//           const { data: existingUser, error } = await supabase
//             .from("profiles")
//             .select("*")
//             .eq("telegram_id", telegramId)
//             .maybeSingle();

//           if (error) throw error;

//           if (existingUser && existingUser.region && existingUser.job) {
//             localStorage.setItem("user", JSON.stringify(existingUser));
//             toast.success(t.welcome);
            
//             if (existingUser.role === "admin" || existingUser.role === "Admin") {
//               navigate("/admin-dashboard", { replace: true });
//             } else {
//               navigate("/user-dashboard", { replace: true });
//             }
//             return; 
//           }

//           if (existingUser) {
//             setFullName(existingUser.full_name || "");
//             setPhone(existingUser.phone ? formatPhoneNumber(existingUser.phone) : "+998 ");
//           }
//         } catch (err) {
//           console.error("Avtomatik kirishda xatolik:", err.message);
//         }
//       }
//       setLoading(false); 
//     };

//     checkUserAndLogin();

//     function handleClickOutside(event) {
//       if (regionRef.current && !regionRef.current.contains(event.target)) setRegionOpen(false);
//       if (districtRef.current && !districtRef.current.contains(event.target)) setDistrictOpen(false);
//       if (jobRef.current && !jobRef.current.contains(event.target)) setJobOpen(false);
//     }

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, [tg, navigate, t.welcome]);

//   const formatPhoneNumber = (value) => {
//     let input = value;
//     if (!input.startsWith("+998")) {
//       input = "+998 " + input.replace(/\D/g, "");
//     }
//     const rawNumbers = input.slice(4).replace(/\D/g, "");
//     const limitedNumbers = rawNumbers.slice(0, 9);

//     let formatted = "+998 ";
//     if (limitedNumbers.length > 0) formatted += limitedNumbers.slice(0, 2);
//     if (limitedNumbers.length > 2) formatted += " " + limitedNumbers.slice(2, 5);
//     if (limitedNumbers.length > 5) formatted += " " + limitedNumbers.slice(5, 7);
//     if (limitedNumbers.length > 7) formatted += " " + limitedNumbers.slice(7, 9);
//     return formatted;
//   };

//   const handlePhoneChange = (e) => {
//     setPhone(formatPhoneNumber(e.target.value));
//   };

//   const handleStepOneNext = () => {
//     const cleanPhone = phone.replace(/\s/g, "");

//     if (fullName.trim().length < 3) {
//       return toast.error(t.errName);
//     }
//     if (cleanPhone.length !== 13) {
//       return toast.error(t.errPhone);
//     }
//     if (password.trim().length < 4) {
//       return toast.error(t.errPass);
//     }
//     setStep(2);
//   };

//   const handleStepTwoNext = () => {
//     if (!birthDate) {
//       return toast.error(t.errBirth);
//     }
//     setStep(3);
//   };

//   const handleFinalSubmit = async () => {
//     if (!region || !district || !job) {
//       return toast.error(t.errFields);
//     }

//     const cleanPhone = phone.replace(/\s/g, "");
//     const telegramId = tg?.initDataUnsafe?.user?.id ? String(tg.initDataUnsafe.user.id) : null;

//     await saveUserToSupabase(cleanPhone, telegramId);
//   };

//   const saveUserToSupabase = async (rawPhone, telegramId) => {
//     setLoading(true);
//     try {
//       const { data: existing, error: checkError } = await supabase
//         .from("profiles")
//         .select("*")
//         .or(`phone.eq.${rawPhone}${telegramId ? `,telegram_id.eq.${telegramId}` : ""}`)
//         .maybeSingle();

//       if (checkError) throw checkError;

//       const userData = {
//         telegram_id: telegramId,
//         full_name: fullName.trim(),
//         phone: rawPhone,
//         birth_date: birthDate,
//         region,
//         district, 
//         job,
//         password: password, 
//         role: existing?.role || "user"
//       };

//       let savedData;

//       if (existing) {
//         const { data: updatedData, error: updateError } = await supabase
//           .from("profiles")
//           .update(userData)
//           .eq("id", existing.id)
//           .select()
//           .single();

//         if (updateError) throw updateError;
//         savedData = updatedData;
//       } else {
//         const { data: insertedData, error: insertError } = await supabase
//           .from("profiles")
//           .insert([userData])
//           .select()
//           .single();

//         if (insertError) throw insertError;
//         savedData = insertedData;
//       }

//       localStorage.setItem("user", JSON.stringify(savedData));
//       toast.success(t.successReg);
      
//       setTimeout(() => {
//         if (savedData.role === "admin" || savedData.role === "Admin") {
//           navigate("/admin-dashboard", { replace: true });
//         } else {
//           navigate("/user-dashboard", { replace: true });
//         }
//       }, 150);

//     } catch (err) {
//       toast.error(err.message || t.errGeneral);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading && step === 1) {
//     return (
//       <div className="auth-page-wrapper" style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
//         <div className="loader">{t.loadingText}</div>
//       </div>
//     );
//   }

//   return (
//     <div className="auth-page-wrapper">
//       {/* 🌐 TILNI ALMASHTIRISH TUGMALARI (O'NG TEPADA) */}
//       <div className="lang-switcher-container" style={{ position: "absolute", top: "20px", right: "20px", display: "flex", gap: "8px", zIndex: 10 }}>
//         <button 
//           onClick={() => changeLanguage("uz")} 
//           style={{
//             padding: "6px 12px",
//             borderRadius: "6px",
//             border: "1px solid #3b82f6",
//             background: lang === "uz" ? "#3b82f6" : "#fff",
//             color: lang === "uz" ? "#fff" : "#3b82f6",
//             fontWeight: "bold",
//             cursor: "pointer",
//             transition: "all 0.2s"
//           }}
//         >
//           UZ
//         </button>
//         <button 
//           onClick={() => changeLanguage("ru")} 
//           style={{
//             padding: "6px 12px",
//             borderRadius: "6px",
//             border: "1px solid #3b82f6",
//             background: lang === "ru" ? "#3b82f6" : "#fff",
//             color: lang === "ru" ? "#fff" : "#3b82f6",
//             fontWeight: "bold",
//             cursor: "pointer",
//             transition: "all 0.2s"
//           }}
//         >
//           RU
//         </button>
//       </div>

//       <div className="stepper-wrapper">
//         <div className={`step-circle ${step >= 1 ? "active" : ""}`}>1</div>
//         <div className="step-line"></div>
//         <div className={`step-circle ${step >= 2 ? "active" : ""}`}>2</div>
//         <div className="step-line"></div>
//         <div className={`step-circle ${step >= 3 ? "active" : ""}`}>3</div>
//       </div>

//       <div className="auth">
//         <h2>{t.title}</h2>

//         {step === 1 && (
//           <div className="step-container">
//             <div className="input-group">
//               <input
//                 type="text"
//                 placeholder={t.namePlaceholder}
//                 value={fullName}
//                 onChange={(e) => setFullName(e.target.value)}
//               />
//             </div>
//             <div className="input-group">
//               <input
//                 type="text"
//                 placeholder="+998 90 123 45 67"
//                 value={phone}
//                 onChange={handlePhoneChange}
//               />
//             </div>
//             <div className="input-group">
//               <input
//                 type="password"
//                 placeholder={t.passwordPlaceholder}
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//               />
//             </div>
//             <button className="btn-submit" onClick={handleStepOneNext}>
//               {t.btnNext}
//             </button>
//           </div>
//         )}

//         {step === 2 && (
//           <div className="step-container">
//             <div className="input-group">
//               <label style={{ fontSize: "14px", color: "#666", display: "block", marginBottom: "5px" }}>
//                 {t.birthDateLabel}
//               </label>
//               <input
//                 type="date"
//                 value={birthDate}
//                 onChange={(e) => setBirthDate(e.target.value)}
//               />
//             </div>
//             <div className="btn-group" style={{ display: "flex", gap: "10px" }}>
//               <button className="btn-back" onClick={() => setStep(1)} style={{ background: "#ccc", width: "100%" }}>
//                 {t.btnBack}
//               </button>
//               <button className="btn-submit" onClick={handleStepTwoNext} style={{ width: "100%" }}>
//                 {t.btnNext}
//               </button>
//             </div>
//           </div>
//         )}

//         {step === 3 && (
//           <div className="step-container">
//             <div className="input-group" ref={regionRef}>
//               <div 
//                 className={`custom-select-trigger ${!region ? "is-placeholder" : ""}`}
//                 onClick={() => setRegionOpen(!regionOpen)}
//               >
//                 {region || t.selectRegion}
//               </div>
//               {regionOpen && (
//                 <div className="custom-options-box">
//                   {Object.keys(UZBEKISTAN_DATA).map((reg) => (
//                     <div 
//                       key={reg} 
//                       className={`custom-option ${region === reg ? "selected" : ""}`}
//                       onClick={() => {
//                         setRegion(reg);
//                         setDistrict("");
//                         setRegionOpen(false);
//                       }}
//                     >
//                       {reg}
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>

//             {region && (
//               <div className="input-group" ref={districtRef}>
//                 <div 
//                   className={`custom-select-trigger ${!district ? "is-placeholder" : ""}`}
//                   onClick={() => setDistrictOpen(!districtOpen)}
//                 >
//                   {district || t.selectDistrict}
//                 </div>
//                 {districtOpen && (
//                   <div className="custom-options-box">
//                     {UZBEKISTAN_DATA[region].map((dist) => (
//                       <div 
//                         key={dist} 
//                         className={`custom-option ${district === dist ? "selected" : ""}`}
//                         onClick={() => {
//                           setDistrict(dist);
//                           setDistrictOpen(false);
//                         }}
//                       >
//                         {dist}
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             )}

//             <div className="input-group" ref={jobRef}>
//               <div 
//                 className={`custom-select-trigger ${!job ? "is-placeholder" : ""}`}
//                 onClick={() => setJobOpen(!jobOpen)}
//               >
//                 {job || t.selectJob}
//               </div>
//               {jobOpen && (
//                 <div className="custom-options-box">
//                   {KASBLAR_DATA.map((j) => (
//                     <div 
//                       key={j} 
//                       className={`custom-option ${job === j ? "selected" : ""}`}
//                       onClick={() => {
//                         setJob(j);
//                         setJobOpen(false);
//                       }}
//                     >
//                       {j}
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>

//             <div className="btn-group" style={{ display: "flex", gap: "10px" }}>
//               <button className="btn-back" onClick={() => setStep(2)} style={{ background: "#ccc", width: "100%" }} disabled={loading}>
//                 {t.btnBack}
//               </button>
//               <button className="btn-submit" onClick={handleFinalSubmit} style={{ width: "100%" }} disabled={loading}>
//                 {loading ? t.btnSaving : t.btnSave}
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

import { useState, useEffect, useRef } from "react";
import { supabase } from "../../supabase/client";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "./register.css";

// Tillarga mos ma'lumotlar lug'ati
const TRANSLATIONS = {
  uz: {
    title: "Ro'yxatdan o'tish",
    namePlaceholder: "Ismingizni kiriting",
    passwordPlaceholder: "Parol yarating",
    birthDateLabel: "Tug'ilgan kuningiz",
    selectRegion: "Viloyatni tanlang",
    selectDistrict: "Shahar tumanni tanlang",
    selectJob: "Kasbingizni tanlang",
    btnNext: "Keyingi",
    btnBack: "Orqaga",
    btnSave: "Saqlash",
    btnSaving: "Saqlanmoqda...",
    loadingText: "Yuklanmoqda... Iltimos kuting.",
    welcome: "Xush kelibsiz!",
    successReg: "Ro‘yxatdan muvaffaqiyatli o‘tdingiz!",
    errName: "Ism kamida 3 ta harf bo‘lishi kerak!",
    errPhone: "Telefon raqami to‘liq kiritilmagan!",
    errPass: "Parol kamida 4 ta belgidan iborat bo‘lishi kerak!",
    errBirth: "Tug‘ilgan kuningizni kiriting!",
    errFields: "Viloyat, tuman va kasbingizni tanlang!",
    errGeneral: "Xatolik yuz berdi"
  },
  ru: {
    title: "Регистрация",
    namePlaceholder: "Введите ваше имя",
    passwordPlaceholder: "Создайте пароль",
    birthDateLabel: "Дата рождения",
    selectRegion: "Выберите область",
    selectDistrict: "Выберите город / район",
    selectJob: "Выберите профессию",
    btnNext: "Далее",
    btnBack: "Назад",
    btnSave: "Сохранить",
    btnSaving: "Сохранение...",
    loadingText: "Загрузка... Пожалуйста, подождите.",
    welcome: "Добро пожаловать!",
    successReg: "Вы успешно зарегистрировались!",
    errName: "Имя должно содержать не менее 3 букв!",
    errPhone: "Номер телефона введен не полностью!",
    errPass: "Пароль должен состоять минимум из 4 символов!",
    errBirth: "Укажите дату вашего рождения!",
    errFields: "Выберите область, район и профессию!",
    errGeneral: "Произошла ошибка"
  }
};

const UZBEKISTAN_DATA = {
  "Toshkent shahri": ["Bektemir tumani", "Chilonzor tumani", "Mirobod tumani", "Mirzo Ulug‘bek tumani", "Olmazor tumani", "Sergeli tumani", "Shayxontohur tumani", "Uchtepa tumani", "Yakkasaroy tumani", "Yashnobod tumani", "Yunusobod tumani", "Yangihayot tumani"],
  "Toshkent viloyati": ["Angren shahri", "Olmaliq shahri", "Chirchiq shahri", "Bekobod shahri", "Ohangaron shahri", "Nurafshon shahri", "Bekobod tumani", "Bo‘stonliq tumani", "Bo‘ka tumani", "Chinoz tumani", "Qibray tumani", "Ohangaron tumani", "Oqqo‘rg‘on tumani", "Parkent tumani", "Piskent tumani", "Quyi Chirchiq tumani", "O‘rta Chirchiq tumani", "Yangiyo‘l tumani", "Yuqori Chirchiq tumani", "Zangiota tumani"],
  "Andijon": ["Andijon shahri", "Xonobod shahri", "Andijon tumani", "Asaka tumani", "Baliqchi tumani", "Bo‘ston tumani", "Buloqboshi tumani", "Izboskan tumani", "Jalaquduq tumani", "Marhamat tumani", "Oltinköl tumani", "Paxtaobod tumani", "Qo‘rg‘ontepa tumani", "Shahrixon tumani", "Ulug‘nor tumani", "Xo‘jaobod tumani"],
  "Buxoro": ["Buxoro shahri", "Kogon shahri", "Buxoro tumani", "G‘ijduvon tumani", "Jondor tumani", "Kogon tumani", "Qorako‘l tumani", "Qoravulbozor tumani", "Olot tumani", "Peshku tumani", "Romitan tumani", "Shofirkon tumani", "Vobkent tumani"],
  "Farg'ona": ["Farg‘ona shahri", "Marg‘ilon shahri", "Qo‘qon shahri", "Quva shahri", "Oltiariq tumani", "Bag‘dod tumani", "Beshariq tumani", "Buvayda tumani", "Dang‘ara tumani", "Farg‘ona tumani", "Furqat tumani", "Qo‘shtepa tumani", "Quva tumani", "Rishton tumani", "So‘x tumani", "Toshloq tumani", "Uchko‘prik tumani", "O‘zbekiston tumani", "Yozyovon tumani"],
  "Jizzax": ["Jizzax shahri", "Arnasoy tumani", "Baxtamal tumani", "Do‘stlik tumani", "Forish tumani", "G‘allaorol tumani", "Sharof Rashidov tumani", "Mirzachöl tumani", "Paxtakor tumani", "Yangiobod tumani", "Zamin tumani", "Zafarobod tumani", "Zarbdor tumani"],
  "Xorazm": ["Urganch shahri", "Xiva shahri", "Bog‘ot tumani", "Gurlan tumani", "Xonqa tumani", "Hazorasp tumani", "Qushko‘pir tumani", "Shovot tumani", "Tuproqqal‘a tumani", "Urganch tumani", "Xiva tumani", "Yangiariq tumani", "Yangibozor tumani"],
  "Namangan": ["Namangan shahri", "Chortoq tumani", "Chust tumani", "Kosonsoy tumani", "Mingbuloq tumani", "Namangan tumani", "Norin tumani", "Pop tumani", "To‘raqo‘rg‘on tumani", "Uychi tumani", "Uchko‘prik tumani", "Yangiqo‘rg‘on tumani", "Davlatobod tumani", "Yangi Namangan tumani"],
  "Navoiy": ["Navoiy shahri", "Zarafshon shahri", "G‘ozg‘on shahri", "Karmana tumani", "Konimex tumani", "Qiziltepa tumani", "Xatirchi tumani", "Navbahor tumani", "Nurota tumani", "Tomdi tumani", "Uchquduq tumani"],
  "Qashqadaryo": ["Qarshi shahri", "Shahrisabz shahri", "Chiroqchi tumani", "Dehqonobod tumani", "G‘uzor tumani", "Kasbi tumani", "Kitob tumani", "Koson tumani", "Ko‘kdala tumani", "Mirishkor tumani", "Muborak tumani", "Nishan tumani", "Qarshi tumani", "Shahrisabz tumani", "Yakkabog‘ tumani", "Kamashi tumani"],
  "Samarqand": ["Samarqand shahri", "Kattaqo‘rg‘on shahri", "Bulung‘ur tumani", "Ishtixon tumani", "Jomboy tumani", "Kattaqo‘rg‘on tumani", "Narpay tumani", "Nurobod tumani", "Oqdaryo tumani", "Paxtachi tumani", "Payariq tumani", "Pastdarg‘om tumani", "Samarqand tumani", "Toyloq tumani", "Urgut tumani", "Qo‘shrabot tumani"],
  "Sirdaryo": ["Guliston shahri", "Shirin shahri", "Yangiyer shahri", "Boyovut tumani", "Guliston tumani", "Xovos tumani", "Mirzaobod tumani", "Oqoltin tumani", "Sardoba tumani", "Sayxunobod tumani", "Sirdaryo tumani"],
  "Surxondaryo": ["Termiz shahri", "Angor tumani", "Boysun tumani", "Denov tumani", "Jarqo‘rg‘on tumani", "Qiziriq tumani", "Qumqo‘rg‘on tumani", "Muzrabot tumani", "Oltinsoy tumani", "Sariosiyo tumani", "Sherobod tumani", "Sho‘rchi tumani", "Termiz tumani", "Uzun tumani"],
  "Qoraqalpog'iston Respublikasi": ["Nukus shahri", "Amudaryo tumani", "Beruniy tumani", "Chimboy tumani", "Ellikqal‘a tumani", "Kegeyli tumani", "Mo‘ynoq tumani", "Nukus tumani", "Qonliko‘l tumani", "Qo‘ng‘irot tumani", "Qorao‘zak tumani", "Shumanay tumani", "Taxtako‘pir tumani", "To‘rtko‘l tumani", "Xo‘jayli tumani", "Taxiatosh tumani", "Bo‘zatov tumani"]
};

const KASBLAR_DATA = [
  "Santexnik", "Elektrik", "Malyar / Suvoqchi", "Kafelchi (Plitkar)", 
  "Gvipsokarton ustasi", "Armaturchi / Svarshik", "Alyumin profil ustasi (Akfa)", 
  "Mebelchi", "Duradgor (Yog'och ustasi)", "Boshqa"
];

export default function Register({ lang = "uz", changeLanguage }) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.uz;

  const [step, setStep] = useState(1); 
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("+998 ");
  const [password, setPassword] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [region, setRegion] = useState("");
  const [district, setDistrict] = useState(""); 
  const [job, setJob] = useState("");
  const [loading, setLoading] = useState(true); 

  const [regionOpen, setRegionOpen] = useState(false);
  const [districtOpen, setDistrictOpen] = useState(false);
  const [jobOpen, setJobOpen] = useState(false);

  const regionRef = useRef(null);
  const districtRef = useRef(null);
  const jobRef = useRef(null);
  const navigate = useNavigate();

  const tg = window.Telegram?.WebApp;

  const formatPhoneNumber = (value) => {
    let input = value;
    if (!input.startsWith("+998")) {
      input = "+998 " + input.replace(/\D/g, "");
    }
    const rawNumbers = input.slice(4).replace(/\D/g, "");
    const limitedNumbers = rawNumbers.slice(0, 9);

    let formatted = "+998 ";
    if (limitedNumbers.length > 0) formatted += limitedNumbers.slice(0, 2);
    if (limitedNumbers.length > 2) formatted += " " + limitedNumbers.slice(2, 5);
    if (limitedNumbers.length > 5) formatted += " " + limitedNumbers.slice(5, 7);
    if (limitedNumbers.length > 7) formatted += " " + limitedNumbers.slice(7, 9);
    return formatted;
  };

  useEffect(() => {
    if (tg) {
      tg.ready();
      tg.expand(); 
    }

    const checkUserAndLogin = async () => {
      const telegramId = tg?.initDataUnsafe?.user?.id ? String(tg.initDataUnsafe.user.id) : null;

      if (telegramId) {
        try {
          const { data: existingUser, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("telegram_id", telegramId)
            .maybeSingle();

          if (error) throw error;

          if (existingUser && existingUser.region && existingUser.job) {
            localStorage.setItem("user", JSON.stringify(existingUser));
            toast.success(t.welcome);
            
            if (existingUser.role === "admin" || existingUser.role === "Admin") {
              navigate("/admin-dashboard", { replace: true });
            } else {
              navigate("/user-dashboard", { replace: true });
            }
            return; 
          }

          if (existingUser) {
            setFullName(existingUser.full_name || "");
            setPhone(existingUser.phone ? formatPhoneNumber(existingUser.phone) : "+998 ");
          }
        } catch (err) {
          console.error("Avtomatik kirishda xatolik:", err.message);
        }
      }
      setLoading(false); 
    };

    checkUserAndLogin();

    function handleClickOutside(event) {
      if (regionRef.current && !regionRef.current.contains(event.target)) setRegionOpen(false);
      if (districtRef.current && !districtRef.current.contains(event.target)) setDistrictOpen(false);
      if (jobRef.current && !jobRef.current.contains(event.target)) setJobOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [tg, navigate, t.welcome]);

  const handlePhoneChange = (e) => {
    setPhone(formatPhoneNumber(e.target.value));
  };

  const handleStepOneNext = () => {
    const cleanPhone = phone.replace(/\s/g, "");

    if (fullName.trim().length < 3) {
      return toast.error(t.errName);
    }
    if (cleanPhone.length !== 13) {
      return toast.error(t.errPhone);
    }
    if (password.trim().length < 4) {
      return toast.error(t.errPass);
    }
    setStep(2);
  };

  const handleStepTwoNext = () => {
    if (!birthDate) {
      return toast.error(t.errBirth);
    }
    setStep(3);
  };

  const handleFinalSubmit = async () => {
    if (!region || !district || !job) {
      return toast.error(t.errFields);
    }

    const cleanPhone = phone.replace(/\s/g, "");
    const telegramId = tg?.initDataUnsafe?.user?.id ? String(tg.initDataUnsafe.user.id) : null;

    await saveUserToSupabase(cleanPhone, telegramId);
  };

  const saveUserToSupabase = async (rawPhone, telegramId) => {
    setLoading(true);
    try {
      const { data: existing, error: checkError } = await supabase
        .from("profiles")
        .select("*")
        .or(`phone.eq.${rawPhone}${telegramId ? `,telegram_id.eq.${telegramId}` : ""}`)
        .maybeSingle();

      if (checkError) throw checkError;

      const userData = {
        telegram_id: telegramId,
        full_name: fullName.trim(),
        phone: rawPhone,
        birth_date: birthDate,
        region,
        district, 
        job,
        password: password, 
        role: existing?.role || "user"
      };

      let savedData;

      if (existing) {
        const { data: updatedData, error: updateError } = await supabase
          .from("profiles")
          .update(userData)
          .eq("id", existing.id)
          .select()
          .single();

        if (updateError) throw updateError;
        savedData = updatedData;
      } else {
        const { data: insertedData, error: insertError } = await supabase
          .from("profiles")
          .insert([userData])
          .select()
          .single();

        if (insertError) throw insertError;
        savedData = insertedData;
      }

      localStorage.setItem("user", JSON.stringify(savedData));
      toast.success(t.successReg);
      
      setTimeout(() => {
        if (savedData.role === "admin" || savedData.role === "Admin") {
          navigate("/admin-dashboard", { replace: true });
        } else {
          navigate("/user-dashboard", { replace: true });
        }
      }, 150);

    } catch (err) {
      toast.error(err.message || t.errGeneral);
    } finally {
      setLoading(false);
    }
  };

  if (loading && step === 1) {
    return (
      <div className="auth-page-wrapper" style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <div className="loader">{t.loadingText}</div>
      </div>
    );
  }

  return (
    <div className="auth-page-wrapper">
      <div className="lang-switcher-container" style={{ position: "absolute", top: "20px", right: "20px", display: "flex", gap: "8px", zIndex: 10 }}>
        <button 
          onClick={() => changeLanguage("uz")} 
          style={{
            padding: "6px 12px",
            borderRadius: "6px",
            border: "1px solid #3b82f6",
            background: lang === "uz" ? "#3b82f6" : "#fff",
            color: lang === "uz" ? "#fff" : "#3b82f6",
            fontWeight: "bold",
            cursor: "pointer",
            transition: "all 0.2s"
          }}
        >
          UZ
        </button>
        <button 
          onClick={() => changeLanguage("ru")} 
          style={{
            padding: "6px 12px",
            borderRadius: "6px",
            border: "1px solid #3b82f6",
            background: lang === "ru" ? "#3b82f6" : "#fff",
            color: lang === "ru" ? "#fff" : "#3b82f6",
            fontWeight: "bold",
            cursor: "pointer",
            transition: "all 0.2s"
          }}
        >
          RU
        </button>
      </div>

      <div className="stepper-wrapper">
        <div className={`step-circle ${step >= 1 ? "active" : ""}`}>1</div>
        <div className="step-line"></div>
        <div className={`step-circle ${step >= 2 ? "active" : ""}`}>2</div>
        <div className="step-line"></div>
        <div className={`step-circle ${step >= 3 ? "active" : ""}`}>3</div>
      </div>

      <div className="auth">
        <h2>{t.title}</h2>

        {step === 1 && (
          <div className="step-container">
            <div className="input-group">
              <input
                type="text"
                placeholder={t.namePlaceholder}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            <div className="input-group">
              <input
                type="text"
                placeholder="+998 90 123 45 67"
                value={phone}
                onChange={handlePhoneChange}
              />
            </div>
            <div className="input-group">
              <input
                type="password"
                placeholder={t.passwordPlaceholder}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button className="btn-submit" onClick={handleStepOneNext}>
              {t.btnNext}
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="step-container">
            <div className="input-group">
              <label style={{ fontSize: "14px", color: "#666", display: "block", marginBottom: "5px" }}>
                {t.birthDateLabel}
              </label>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
              />
            </div>
            <div className="btn-group" style={{ display: "flex", gap: "10px" }}>
              <button className="btn-back" onClick={() => setStep(1)} style={{ background: "#ccc", width: "100%" }}>
                {t.btnBack}
              </button>
              <button className="btn-submit" onClick={handleStepTwoNext} style={{ width: "100%" }}>
                {t.btnNext}
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="step-container">
            <div className="input-group" ref={regionRef}>
              <div 
                className={`custom-select-trigger ${!region ? "is-placeholder" : ""}`}
                onClick={() => setRegionOpen(!regionOpen)}
              >
                {region || t.selectRegion}
              </div>
              {regionOpen && (
                <div className="custom-options-box">
                  {Object.keys(UZBEKISTAN_DATA).map((reg) => (
                    <div 
                      key={reg} 
                      className={`custom-option ${region === reg ? "selected" : ""}`}
                      onClick={() => {
                        setRegion(reg);
                        setDistrict("");
                        setRegionOpen(false);
                      }}
                    >
                      {reg}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {region && (
              <div className="input-group" ref={districtRef}>
                <div 
                  className={`custom-select-trigger ${!district ? "is-placeholder" : ""}`}
                  onClick={() => setDistrictOpen(!districtOpen)}
                >
                  {district || t.selectDistrict}
                </div>
                {districtOpen && (
                  <div className="custom-options-box">
                    {UZBEKISTAN_DATA[region].map((dist) => (
                      <div 
                        key={dist} 
                        className={`custom-option ${district === dist ? "selected" : ""}`}
                        onClick={() => {
                          setDistrict(dist);
                          setDistrictOpen(false);
                        }}
                      >
                        {dist}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="input-group" ref={jobRef}>
              <div 
                className={`custom-select-trigger ${!job ? "is-placeholder" : ""}`}
                onClick={() => setJobOpen(!jobOpen)}
              >
                {job || t.selectJob}
              </div>
              {jobOpen && (
                <div className="custom-options-box">
                  {KASBLAR_DATA.map((j) => (
                    <div 
                      key={j} 
                      className={`custom-option ${job === j ? "selected" : ""}`}
                      onClick={() => {
                        setJob(j);
                        setJobOpen(false);
                      }}
                    >
                      {j}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="btn-group" style={{ display: "flex", gap: "10px" }}>
              <button className="btn-back" onClick={() => setStep(2)} style={{ background: "#ccc", width: "100%" }} disabled={loading}>
                {t.btnBack}
              </button>
              <button className="btn-submit" onClick={handleFinalSubmit} style={{ width: "100%" }} disabled={loading}>
                {loading ? t.btnSaving : t.btnSave}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


