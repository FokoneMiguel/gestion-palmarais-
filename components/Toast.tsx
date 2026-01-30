import React, { useEffect } from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgStyles = {
    success: 'bg-green-600 border-green-500',
    error: 'bg-red-600 border-red-500',
    info: 'bg-blue-600 border-blue-500'
  };

  const icons = {
    success: '✅',
    error: '❌',
    info: 'ℹ️'
  };

  return (
    <div className={`${bgStyles[type]} text-white px-6 py-4 rounded-2xl shadow-2xl border flex items-center space-x-3 animate-in slide-in-from-left duration-300 pointer-events-auto`}>
      <span className="text-xl">{icons[type]}</span>
      <p className="font-black text-xs uppercase tracking-widest">{message}</p>
      <button onClick={onClose} className="opacity-50 hover:opacity-100 transition-opacity">✕</button>
    </div>
  );
};

export default Toast;