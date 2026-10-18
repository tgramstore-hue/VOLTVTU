'use client';
import { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import styles from './PromoCarousel.module.css';

export const DEFAULT_PROMOS = [
  {
    id: 'giftcard',
    badge: 'TRADE & EARN',
    badgeColor: '#F0B90B',
    badgeBg: 'rgba(240, 185, 11, 0.15)',
    title: 'Trade & Buy Gift Cards',
    desc: 'Steam, Apple, Google Play, Amazon & Razer at best rates.',
    btnText: 'Trade Now',
    btnBg: '#F0B90B',
    btnColor: '#000',
    screen: 'giftcard',
    bg: 'linear-gradient(135deg, #18191E 0%, #0F1015 100%)',
    border: '1px solid rgba(240, 185, 11, 0.25)',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#F0B90B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 12 20 22 4 22 4 12"/>
        <rect x="2" y="7" width="20" height="5"/>
        <line x1="12" y1="22" x2="12" y2="7"/>
        <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/>
        <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
      </svg>
    ),
  },
  {
    id: 'airtime-to-cash',
    badge: 'INSTANT CASH',
    badgeColor: '#22C55E',
    badgeBg: 'rgba(34, 197, 94, 0.15)',
    title: 'Airtime to Cash',
    desc: 'Convert excess MTN, Airtel & Glo airtime to bank or wallet cash.',
    btnText: 'Convert',
    btnBg: '#22C55E',
    btnColor: '#fff',
    screen: 'services',
    bg: 'linear-gradient(135deg, #0D1C13 0%, #09130D 100%)',
    border: '1px solid rgba(34, 197, 94, 0.25)',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 9V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/>
        <rect x="9" y="9" width="13" height="11" rx="2"/>
        <circle cx="16" cy="14.5" r="1.5"/>
      </svg>
    ),
  },
  {
    id: 'virtual-numbers',
    badge: 'GLOBAL SMS',
    badgeColor: '#38BDF8',
    badgeBg: 'rgba(56, 189, 248, 0.15)',
    title: 'Buy Virtual Phone Numbers',
    desc: 'USA, UK, Canada numbers to receive SMS OTP for WhatsApp, Telegram & more.',
    btnText: 'Get Number',
    btnBg: '#38BDF8',
    btnColor: '#000',
    screen: 'virtual-numbers',
    bg: 'linear-gradient(135deg, #081B2B 0%, #05101A 100%)',
    border: '1px solid rgba(56, 189, 248, 0.25)',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
        <line x1="12" y1="18" x2="12.01" y2="18"/>
        <path d="M9 7l3-3 3 3"/>
        <path d="M15 13l-3 3-3-3"/>
      </svg>
    ),
  },
  {
    id: 'cheap-data',
    badge: 'HOT DISCOUNTS',
    badgeColor: '#F0B90B',
    badgeBg: 'rgba(240, 185, 11, 0.15)',
    title: 'Affordable SME Data Bundles',
    desc: '1GB from ₦280. Instant automated delivery on all Nigerian networks.',
    btnText: 'Buy Data',
    btnBg: '#F0B90B',
    btnColor: '#000',
    screen: 'data',
    bg: 'linear-gradient(135deg, #1C1908 0%, #110E04 100%)',
    border: '1px solid rgba(240, 185, 11, 0.25)',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#F0B90B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12.55a11 11 0 0 1 14.08 0"/>
        <path d="M1.42 9a16 16 0 0 1 21.16 0"/>
        <path d="M8.53 16.11a6 6 0 0 1 6.95 0"/>
        <line x1="12" y1="20" x2="12.01" y2="20"/>
      </svg>
    ),
  },
];

export const AIRTIME_PROMOS = [
  DEFAULT_PROMOS[3], // cheap-data
  DEFAULT_PROMOS[1], // airtime-to-cash
  DEFAULT_PROMOS[2], // virtual-numbers
  DEFAULT_PROMOS[0], // giftcard
];

export const DATA_PROMOS = [
  DEFAULT_PROMOS[1], // airtime-to-cash
  DEFAULT_PROMOS[2], // virtual-numbers
  DEFAULT_PROMOS[0], // giftcard
  {
    id: 'cable-discount',
    badge: 'NO DOWNTIME',
    badgeColor: '#A855F7',
    badgeBg: 'rgba(168, 85, 247, 0.15)',
    title: 'Instant Cable TV Recharge',
    desc: 'Renew DStv, GOtv & Startimes with instant decoder activation.',
    btnText: 'Pay Cable',
    btnBg: '#A855F7',
    btnColor: '#fff',
    screen: 'cable',
    bg: 'linear-gradient(135deg, #160B24 0%, #0C0614 100%)',
    border: '1px solid rgba(168, 85, 247, 0.25)',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#A855F7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="15" rx="2" ry="2"/>
        <polyline points="17 2 12 7 7 2"/>
      </svg>
    ),
  },
];

export const CABLE_PROMOS = [
  {
    id: 'electricity-fast',
    badge: 'INSTANT TOKEN',
    badgeColor: '#EAB308',
    badgeBg: 'rgba(234, 179, 8, 0.15)',
    title: 'Prepaid Electricity Tokens',
    desc: 'Generate disco prepaid meter tokens instantly 24/7 without delays.',
    btnText: 'Pay Power',
    btnBg: '#EAB308',
    btnColor: '#000',
    screen: 'electricity',
    bg: 'linear-gradient(135deg, #1A1505 0%, #0D0A02 100%)',
    border: '1px solid rgba(234, 179, 8, 0.25)',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#EAB308" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
      </svg>
    ),
  },
  DEFAULT_PROMOS[3], // cheap-data
  DEFAULT_PROMOS[2], // virtual-numbers
];

export const ELECTRICITY_PROMOS = [
  CABLE_PROMOS[0],
  DEFAULT_PROMOS[3],
  DEFAULT_PROMOS[0],
];

export const BETTING_PROMOS = [
  DEFAULT_PROMOS[1], // airtime-to-cash
  DEFAULT_PROMOS[3], // cheap-data
  DEFAULT_PROMOS[2], // virtual-numbers
];

export const EXAM_PROMOS = [
  DEFAULT_PROMOS[3], // cheap-data
  DEFAULT_PROMOS[2], // virtual-numbers
  DEFAULT_PROMOS[0], // giftcard
];

export default function PromoCarousel({ items = DEFAULT_PROMOS, title = null }) {
  const { navigate } = useApp();
  const [activeIndex, setActiveIndex] = useState(0);
  const trackRef = useRef(null);

  // Auto scroll every 4 seconds
  useEffect(() => {
    if (items.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % items.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [items.length]);

  // Sync scroll on activeIndex change
  useEffect(() => {
    if (trackRef.current) {
      const cardWidth = trackRef.current.offsetWidth;
      trackRef.current.scrollTo({
        left: activeIndex * cardWidth,
        behavior: 'smooth',
      });
    }
  }, [activeIndex]);

  const handleScroll = (e) => {
    const scrollLeft = e.target.scrollLeft;
    const cardWidth = e.target.offsetWidth;
    if (cardWidth > 0) {
      const newIndex = Math.round(scrollLeft / cardWidth);
      if (newIndex !== activeIndex && newIndex >= 0 && newIndex < items.length) {
        setActiveIndex(newIndex);
      }
    }
  };

  return (
    <div className={styles.wrapper}>
      {title && <div className={styles.carouselTitle}>{title}</div>}
      <div
        className={styles.track}
        ref={trackRef}
        onScroll={handleScroll}
      >
        {items.map((item) => (
          <div
            key={item.id}
            className={styles.card}
            style={{
              background: item.bg,
              border: item.border,
            }}
            onClick={() => navigate(item.screen)}
          >
            <div className={styles.cardContent}>
              <div className={styles.cardHeader}>
                <span
                  className={styles.badge}
                  style={{
                    color: item.badgeColor,
                    background: item.badgeBg,
                  }}
                >
                  {item.badge}
                </span>
                <div className={styles.cardIconWrap}>{item.icon}</div>
              </div>
              <div className={styles.title}>{item.title}</div>
              <div className={styles.desc}>{item.desc}</div>
              <div className={styles.actionRow}>
                <button
                  type="button"
                  className={styles.btn}
                  style={{
                    background: item.btnBg,
                    color: item.btnColor,
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(item.screen);
                  }}
                >
                  {item.btnText}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"/>
                    <polyline points="12 5 19 12 12 19"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Dots Indicator */}
      <div className={styles.dots}>
        {items.map((_, i) => (
          <div
            key={i}
            className={`${styles.dot} ${activeIndex === i ? styles.dotActive : ''}`}
            onClick={() => setActiveIndex(i)}
          />
        ))}
      </div>
    </div>
  );
}
