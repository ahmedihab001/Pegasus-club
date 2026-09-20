// src/components/Toast.jsx
import { useEffect } from 'react';

export default function Toast({ message, type = 'info', onClose, duration = 3000 }) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const bgColor = type === 'error' ? '#ef4444' : type === 'success' ? '#22c55e' : '#3b82f6';

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      background: bgColor,
      color: 'white',
      padding: '12px 24px',
      borderRadius: '8px',
      zIndex: 2000,
      boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
      animation: 'fadeInUp 0.3s ease-out',
      maxWidth: '90%',
      textAlign: 'center',
      fontSize: '14px',
    }}>
      {message}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translate(-50%, 20px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
      `}</style>
    </div>
  );
}