import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, UserPlus, Check } from 'lucide-react';
import api from '../api/axios';
import { useToast } from '../components/CustomToast';
import AuthLayout from '../components/AuthLayout';

// Estimasi sederhana kekuatan password: 0-3 (lemah/cukup/kuat).
// Bukan validator keamanan formal, cuma indikator visual ringan
// biar pengalaman registrasi terasa lebih matang & profesional.
function getPasswordStrength(password) {
  if (!password) return 0;
  let score = 0;
  if (password.length >= 6) score += 1;
  if (password.length >= 10) score += 1;
  if (/[0-9]/.test(password) && /[a-zA-Z]/.test(password)) score += 1;
  return Math.min(score, 3);
}

const STRENGTH_META = [
  { label: 'Minimal 6 karakter', color: 'bg-secondary/15 dark:bg-slate-600' },
  { label: 'Lemah', color: 'bg-red-400' },
  { label: 'Cukup', color: 'bg-amber-400' },
  { label: 'Kuat', color: 'bg-primary' },
];

export default function Register() {
  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const strength = useMemo(() => getPasswordStrength(password), [password]);
  const strengthMeta = STRENGTH_META[strength];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nama || !email || !password) {
      toast.warning('Semua field wajib diisi.');
      return;
    }
    if (password.length < 6) {
      toast.warning('Password minimal 6 karakter.');
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth/register', { nama, email, password });
      toast.success('Registrasi berhasil! Silakan login dengan akun Anda.');
      navigate('/login');
    } catch (err) {
      const msg = err.response?.data?.message || 'Gagal melakukan registrasi.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Buat Akun Admin"
      subtitle="Tanpa perlu verifikasi email — langsung bisa digunakan."
      footer={
        <>
          Sudah punya akun?{' '}
          <Link to="/login" className="text-primary-dark dark:text-primary font-medium hover:underline">
            Masuk di sini
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="text-xs font-medium text-secondary dark:text-slate-300 mb-1.5 block">
            Nama Lengkap
          </label>
          <div className="relative group">
            <User
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary/40 dark:text-slate-500 group-focus-within:text-primary transition-colors"
            />
            <input
              type="text"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              placeholder="Nama Anda"
              autoComplete="name"
              className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-secondary/15 dark:border-slate-600 bg-bgmint-light dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-sm text-inktext dark:text-slate-100 transition-all"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-secondary dark:text-slate-300 mb-1.5 block">Email</label>
          <div className="relative group">
            <Mail
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary/40 dark:text-slate-500 group-focus-within:text-primary transition-colors"
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@perusahaan.com"
              autoComplete="email"
              className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-secondary/15 dark:border-slate-600 bg-bgmint-light dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-sm text-inktext dark:text-slate-100 transition-all"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-secondary dark:text-slate-300 mb-1.5 block">Password</label>
          <div className="relative group">
            <Lock
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary/40 dark:text-slate-500 group-focus-within:text-primary transition-colors"
            />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimal 6 karakter"
              autoComplete="new-password"
              className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-secondary/15 dark:border-slate-600 bg-bgmint-light dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-sm text-inktext dark:text-slate-100 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              tabIndex={-1}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary/40 dark:text-slate-500 hover:text-secondary dark:hover:text-slate-300 transition-colors"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {password && (
            <div className="mt-2 flex items-center gap-2">
              <div className="flex-1 h-1.5 rounded-full bg-secondary/10 dark:bg-slate-700 overflow-hidden flex gap-0.5">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className={`flex-1 rounded-full transition-colors duration-300 ${
                      i < strength ? strengthMeta.color : 'bg-transparent'
                    }`}
                  />
                ))}
              </div>
              <span className="text-[11px] text-inktext-muted dark:text-slate-400 shrink-0 flex items-center gap-1">
                {password.length >= 6 && <Check size={11} className="text-primary" />}
                {strengthMeta.label}
              </span>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-2 flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark disabled:opacity-60 text-white font-medium py-2.5 rounded-xl transition-all shadow-card hover:shadow-lg active:scale-[0.98]"
        >
          {loading ? (
            <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
          ) : (
            <UserPlus size={16} />
          )}
          {loading ? 'Memproses...' : 'Daftar Sekarang'}
        </button>
      </form>
    </AuthLayout>
  );
}
