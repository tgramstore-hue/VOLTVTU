'use client';
import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { IconChevronLeft, IconCheck, IconPlus } from '../../components/Icons';

const DOC_TYPES = [
  { id: 'nin', label: 'NIN slip' },
  { id: 'license', label: "Driver's license" },
  { id: 'voters', label: "Voter's card" },
  { id: 'passport', label: 'International passport' },
];

export default function KYCUploadIdScreen() {
  const { navigate, goBack } = useApp();
  const [selectedDoc, setSelectedDoc] = useState('nin');
  const [frontUploaded, setFrontUploaded] = useState(false);
  const [backUploaded, setBackUploaded] = useState(false);

  return (
    <div style={{ position: 'relative', width: '390px', minHeight: '844px', background: '#f5f5f5', color: '#000', overflowY: 'auto', overflowX: 'hidden', fontFamily: "'Outfit', sans-serif", paddingBottom: '90px' }}>
      {/* Top Header */}
      <div className="fx" style={{ position: 'sticky', top: 0, zIndex: 50, background: '#f5f5f5', padding: '24px 16px 12px', gap: '14px', display: 'flex', alignItems: 'center' }}>
        <button type="button" className="bk" aria-label="Back" onClick={goBack}>
          <IconChevronLeft size={22} />
        </button>
        <span style={{ fontSize: '21px', fontWeight: 600 }}>Upload ID</span>
      </div>

      <div style={{ padding: '0 16px', marginTop: '10px' }}>
        <div className="lab" style={{ fontSize: '14px', color: '#666', margin: '0 0 8px 6px' }}>
          Document type
        </div>

        {/* Document Type List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {DOC_TYPES.map((doc) => {
            const isSelected = selectedDoc === doc.id;
            return (
              <div
                key={doc.id}
                className="card fx sp"
                style={{
                  padding: '16px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'default',
                  boxShadow: isSelected
                    ? '0 0 0 2px #F0B90B, 0 6px 22px rgba(0,0,0,.07)'
                    : '0 6px 22px rgba(0,0,0,.07)',
                  transition: 'all 0.18s'
                }}
                onClick={() => setSelectedDoc(doc.id)}
              >
                <span style={{ fontWeight: 500 }}>{doc.label}</span>
                {isSelected && (
                  <IconCheck size={20} color="#000" />
                )}
              </div>
            );
          })}
        </div>

        {/* 2 Upload Boxes */}
        <div className="g" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '18px' }}>
          <div
            style={{
              height: '96px',
              borderRadius: '22px',
              background: '#fff',
              boxShadow: frontUploaded ? '0 0 0 2px #16A34A, 0 6px 22px rgba(0,0,0,.07)' : '0 6px 22px rgba(0,0,0,.07)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              color: '#444',
              cursor: 'default',
              transition: 'all 0.18s'
            }}
            onClick={() => setFrontUploaded(!frontUploaded)}
          >
            <div className="ico" style={{ background: frontUploaded ? '#DCFCE7' : '#F0B90B', color: frontUploaded ? '#15803D' : '#000' }}>
              {frontUploaded ? <IconCheck size={22} /> : <IconPlus size={22} />}
            </div>
            <span style={{ fontSize: '14px', fontWeight: frontUploaded ? 600 : 400 }}>
              {frontUploaded ? 'Front Added' : 'Front'}
            </span>
          </div>

          <div
            style={{
              height: '96px',
              borderRadius: '22px',
              background: '#fff',
              boxShadow: backUploaded ? '0 0 0 2px #16A34A, 0 6px 22px rgba(0,0,0,.07)' : '0 6px 22px rgba(0,0,0,.07)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              color: '#444',
              cursor: 'default',
              transition: 'all 0.18s'
            }}
            onClick={() => setBackUploaded(!backUploaded)}
          >
            <div className="ico" style={{ background: backUploaded ? '#DCFCE7' : '#F0B90B', color: backUploaded ? '#15803D' : '#000' }}>
              {backUploaded ? <IconCheck size={22} /> : <IconPlus size={22} />}
            </div>
            <span style={{ fontSize: '14px', fontWeight: backUploaded ? 600 : 400 }}>
              {backUploaded ? 'Back Added' : 'Back'}
            </span>
          </div>
        </div>
      </div>

      {/* Stationary Bottom Button */}
      <div style={{ position: 'fixed', maxWidth: '390px', width: '100%', left: '50%', transform: 'translateX(-50%)', bottom: '24px', padding: '0 16px', boxSizing: 'border-box', zIndex: 40 }}>
        <button
          type="button"
          className="btn"
          onClick={() => navigate('kyc-processing')}
        >
          Submit
        </button>
      </div>
    </div>
  );
}
