import React from "react";
import { FaUserCircle, FaAward } from "react-icons/fa";
import "./header.css";

export default function Header({ 
  lang, 
  currentBonus = 0, 
  onProfileClick,
  displayCurrency = 'usd', 
  onCurrencyChange,
  usdRate = 12800 // Default kurs agar prop uzatilmasa
}) {
  const logoText = lang === "uz" ? "USTA PROFI" : "Профиль";

  // === BALANS / BONUSNI FORMATLASH FUNKSIYASI ===
  const formatBonus = () => {
    const num = Number(currentBonus) || 0;
    
    if (displayCurrency === 'uzs') {
      const somVal = Math.round(num * usdRate);
      return `${somVal.toLocaleString('uz-UZ')} so'm`;
    } else {
      const usdVal = num % 1 === 0 ? num : num.toFixed(2);
      return `${usdVal} $`;
    }
  };

  return (
    <header className="mobile-app-header">
      <div className="header-container">
        
        {/* 1. Logotip */}
        <div className="header-left">
          <h1 className="header-logo-title">{logoText}</h1>
        </div>

        {/* 2. O'ng tarafdagi elementlar */}
        <div className="header-right">

          {/* 💱 Valyuta almashtirish toggle */}
          {onCurrencyChange && (
            <div className="currency-toggle-wrapper">
              <button
                type="button"
                className={`currency-btn ${displayCurrency === 'usd' ? 'active-usd' : ''}`}
                onClick={() => onCurrencyChange('usd')}
              >
                USD
              </button>
              <button
                type="button"
                className={`currency-btn ${displayCurrency === 'uzs' ? 'active-uzs' : ''}`}
                onClick={() => onCurrencyChange('uzs')}
              >
                SO'M
              </button>
            </div>
          )}

          {/* Bonus chipi */}
          <div className="header-bonus-chip" onClick={onProfileClick}>
            <div className="bonus-icon-wrapper">
              <FaAward className="bonus-star-icon" />
            </div>
            <span className="bonus-amount-text">
              {formatBonus()}
            </span>
          </div>

          {/* Profil avatari */}
          <button 
            className="header-profile-trigger-btn" 
            onClick={onProfileClick}
            aria-label="Profile"
          >
            <FaUserCircle className="header-user-avatar-icon" />
          </button>

        </div>

      </div>
    </header>
  );
}