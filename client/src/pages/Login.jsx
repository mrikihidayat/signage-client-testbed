import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';
import api from '../api/axios';
import { useToast } from '../components/CustomToast';
import AuthLayout from '../components/AuthLayout';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.warning('Email dan password wajib diisi.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('signage_token', res.data.token);
      localStorage.setItem('signage_admin', JSON.stringify(res.data.admin));
      toast.success(`Selamat datang kembali, ${res.data.admin.nama}!`);
      navigate('/');
    } catch (err) {
      const msg = err.response?.data?.message || 'Gagal login. Periksa kembali email dan password Anda.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Masuk ke Dashboard"
      subtitle="Kelola layar digital signage Anda secara real-time."
      footer={
        <>
          Belum punya akun?{' '}
          <Link to="/register" className="text-primary-dark dark:text-primary font-medium hover:underline">
            Daftar di sini
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
              placeholder="admin@mjsolution.com"
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
              placeholder="••••••••"
              autoComplete="current-password"
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
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-2 flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark disabled:opacity-60 text-white font-medium py-2.5 rounded-xl transition-all shadow-card hover:shadow-lg active:scale-[0.98]"
        >
          {loading ? (
            <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
          ) : (
            <LogIn size={16} />
          )}
          {loading ? 'Memproses...' : 'Masuk'}
        </button>
      </form>
    </AuthLayout>
  );
}
