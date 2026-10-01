import React from 'react';

interface ToastProps {
  visible: boolean;
  title: string;
  message: string;
}

export const Toast: React.FC<ToastProps> = ({ visible, title, message }) => {
  return (
    <aside
      aria-label="Notificaciones del sistema"
      className={`fixed bottom-6 right-6 z-50 transition-all duration-300 transform bg-black text-white px-4 py-3 flex items-center gap-3 shadow-2xl border border-black ${
        visible
          ? 'translate-y-0 opacity-100 pointer-events-auto'
          : 'translate-y-20 opacity-0 pointer-events-none'
      }`}
    >
      <span className="material-symbols-outlined text-[#0050cc] text-[22px]">
        check_circle
      </span>
      <div className="flex flex-col">
        <span className="font-mono text-[10px] uppercase text-[#f1eee7] font-bold tracking-wider">
          {title}
        </span>
        <span className="font-sans text-[13px] text-white font-medium">{message}</span>
      </div>
    </aside>
  );
};
