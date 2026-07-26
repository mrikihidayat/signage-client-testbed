import React from 'react';
import { X, AlertTriangle } from 'lucide-react';

export function CustomModal({ open, onClose, title, children, footer, widthClass = 'max-w-md' }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-secondary-dark/50 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      <div
        className={`relative bg-white rounded-2xl shadow-toast w-full ${widthClass} animate-scale-in overflow-hidden`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-secondary/10 bg-bgmint-light">
          <h3 className="font-semibold text-secondary text-lg">{title}</h3>
          <button
            onClick={onClose}
            className="text-secondary/50 hover:text-secondary hover:bg-secondary/10 rounded-full p-1.5 transition-colors"
            aria-label="Tutup"
          >
            <X size={18} />
          </button>
        </div>
        <div className="px-6 py-5 max-h-[70vh] overflow-y-auto scrollbar-thin">{children}</div>
        {footer && <div className="px-6 py-4 border-t border-secondary/10 bg-bgmint-light flex justify-end gap-2">{footer}</div>}
      </div>
    </div>
  );
}

export function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title = 'Konfirmasi',
  message = 'Apakah Anda yakin?',
  confirmLabel = 'Ya, Lanjutkan',
  cancelLabel = 'Batal',
  danger = false,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-secondary-dark/50 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl shadow-toast w-full max-w-sm animate-scale-in overflow-hidden">
        <div className="px-6 pt-6 pb-4 flex flex-col items-center text-center gap-3">
          <div
            className={`w-14 h-14 rounded-full flex items-center justify-center ${
              danger ? 'bg-red-50 text-red-500' : 'bg-primary/10 text-primary'
            }`}
          >
            <AlertTriangle size={26} />
          </div>
          <h3 className="font-semibold text-secondary text-lg">{title}</h3>
          <p className="text-sm text-inktext-muted leading-relaxed">{message}</p>
        </div>
        <div className="px-6 pb-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-secondary/20 text-secondary font-medium hover:bg-secondary/5 transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`flex-1 py-2.5 rounded-xl font-medium text-white transition-colors ${
              danger ? 'bg-red-500 hover:bg-red-600' : 'bg-primary hover:bg-primary-dark'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
