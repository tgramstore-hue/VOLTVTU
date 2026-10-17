'use client';
import styles from './NetworkSelector.module.css';

const networks = [
  { id: 'mtn', label: 'MTN', abbr: 'MTN', bg: '#FFCB05', color: '#000', size: '13px' },
  { id: 'airtel', label: 'Airtel', abbr: 'airtel', bg: '#E40000', color: '#fff', size: '10px' },
  { id: 'glo', label: 'Glo', abbr: 'glo', bg: '#00A94F', color: '#fff', size: '15px' },
  { id: '9mobile', label: '9mobile', abbr: '9', bg: '#7AB800', color: '#fff', size: '20px' },
];

const cableProviders = [
  { id: 'dstv', label: 'DStv', abbr: 'DStv', bg: '#0B5FB0', color: '#fff', size: '11px' },
  { id: 'gotv', label: 'GOtv', abbr: 'GOtv', bg: '#6CB33F', color: '#fff', size: '11px' },
  { id: 'startimes', label: 'Startimes', abbr: 'ST', bg: '#F7931E', color: '#fff', size: '13px' },
];

const electricityProviders = [
  { id: 'ikeja', label: 'Ikeja', abbr: 'IE', bg: '#0B0B0B', color: '#F0B90B', size: '14px' },
  { id: 'eko', label: 'Eko', abbr: 'EK', bg: '#0B0B0B', color: '#F0B90B', size: '14px' },
  { id: 'abuja', label: 'Abuja', abbr: 'AB', bg: '#0B0B0B', color: '#F0B90B', size: '14px' },
  { id: 'ph', label: 'PH', abbr: 'PH', bg: '#0B0B0B', color: '#F0B90B', size: '14px' },
];

const examBodies = [
  { id: 'waec', label: 'WAEC', abbr: 'W', bg: '#0B0B0B', color: '#F0B90B', size: '14px' },
  { id: 'neco', label: 'NECO', abbr: 'N', bg: '#0B0B0B', color: '#F0B90B', size: '14px' },
  { id: 'nabteb', label: 'NABTEB', abbr: 'NB', bg: '#0B0B0B', color: '#F0B90B', size: '14px' },
];

const bettingPlatforms = [
  { id: 'bet9ja', label: 'Bet9ja', abbr: 'B9', bg: '#0B0B0B', color: '#F0B90B', size: '14px' },
  { id: 'sportybet', label: 'SportyBet', abbr: 'SB', bg: '#0B0B0B', color: '#F0B90B', size: '14px' },
  { id: '1xbet', label: '1xBet', abbr: '1x', bg: '#0B0B0B', color: '#F0B90B', size: '14px' },
  { id: 'betking', label: 'BetKing', abbr: 'BK', bg: '#0B0B0B', color: '#F0B90B', size: '14px' },
  { id: 'nairabet', label: 'NairaBet', abbr: 'NB', bg: '#0B0B0B', color: '#F0B90B', size: '14px' },
  { id: 'msport', label: 'MSport', abbr: 'MS', bg: '#0B0B0B', color: '#F0B90B', size: '14px' },
  { id: 'betway', label: 'Betway', abbr: 'BW', bg: '#0B0B0B', color: '#F0B90B', size: '14px' },
  { id: 'bangbet', label: 'BangBet', abbr: 'BG', bg: '#0B0B0B', color: '#F0B90B', size: '14px' },
];

export const PROVIDERS = { networks, cableProviders, electricityProviders, examBodies, bettingPlatforms };

export default function NetworkSelector({ items, selected, onSelect, columns = 4 }) {
  return (
    <div className={styles.grid} style={{ gridTemplateColumns: `repeat(${Math.min(columns, items.length)}, 76px)` }}>
      {items.map((item) => (
        <button
          key={item.id}
          className={`net ${selected === item.id ? 'on' : ''}`}
          onClick={() => onSelect(item.id)}
        >
          <span
            className={styles.logo}
            style={{
              width: item.size === '13px' ? '46px' : '40px',
              height: item.size === '13px' ? '32px' : '40px',
              background: item.bg,
              color: item.color,
              fontSize: item.size,
            }}
          >
            {item.abbr}
          </span>
          <span className={styles.label}>{item.label}</span>
        </button>
      ))}
    </div>
  );
}
