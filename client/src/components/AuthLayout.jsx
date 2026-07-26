import React from 'react';
import { ShieldCheck } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import AuthSlideshow from './auth/AuthSlideshow';

export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="min-h-screen w-full flex bg-bgmint dark:bg-slate-900 transition-colors">
      <div className="hidden md:flex md:w-[44%] lg:w-[42%] relative overflow-hidden bg-gradient-to-br from-secondary via-secondary to-[#16262a] text-white flex-col justify-between p-10 lg:p-14">
        <div className="pointer-events-none absolute -top-24 -left-20 w-72 h-72 rounded-full bg-primary/25 blur-3xl" />
        <div className="pointer-events-none absolute bottom-[-4rem] right-[-3rem] w-96 h-96 rounded-full bg-primary/10 blur-3xl" />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />

        <div className="relative z-10 flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center overflow-hidden ring-1 ring-white/15">
            <img src="/logo.webp" alt="Signage Control Panel" className="w-full h-full object-contain p-1.5" />
          </div>
          <div className="leading-tight">
            <p className="font-semibold">Signage Control Panel</p>
            <p className="text-xs text-white/50">MJ Solution Indonesia</p>
          </div>
        </div>

        <AuthSlideshow />

        <div className="relative z-10 flex items-center gap-2 text-xs text-white/40">
          <ShieldCheck size={14} />
          <span>Akses aman dengan token terenkripsi & sesi berbasis JWT.</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="flex justify-end p-4 md:p-6">
          <ThemeToggle />
        </div>

        <div className="flex-1 flex items-center justify-center px-4 pb-10">
          <div className="w-full max-w-md">
            <div className="flex flex-col items-center gap-2 mb-6 md:hidden">
              <div className="w-14 h-14 rounded-2xl overflow-hidden">
                <img src="/logo.webp" alt="Signage Control Panel" className="w-full h-full object-contain" />
              </div>
              <h1 className="text-xl font-bold text-secondary dark:text-white text-center">
                Signage Control Panel
              </h1>
              <p className="text-sm text-inktext-muted dark:text-slate-400 text-center">
                MJ Solution Indonesia
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-card p-7 sm:p-8 border border-secondary/5 dark:border-slate-700/50 transition-colors animate-scale-in">
              <h2 className="text-lg font-semibold text-secondary dark:text-white mb-1">{title}</h2>
              <p className="text-sm text-inktext-muted dark:text-slate-400 mb-6">{subtitle}</p>
              {children}
            </div>

            {footer && (
              <p className="text-center text-sm text-inktext-muted dark:text-slate-400 mt-5">{footer}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
