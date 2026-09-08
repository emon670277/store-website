import React, { useState } from 'react';
import { Lock, KeyRound, Eye, EyeOff, AlertCircle, X, Shield } from 'lucide-react';

interface AdminLoginModalProps {
  onSuccess: () => void;
  onClose: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ onSuccess, onClose }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.trim() === '36231') {
      setError('');
      onSuccess();
    } else {
      setError('Invalid password! Please enter the correct password.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-sm font-['Outfit',sans-serif]">
      <div className="relative w-full max-w-sm bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 sm:p-7 animate-in fade-in zoom-in-95 duration-200">
        
        <button
          id="close-admin-login-modal"
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1 rounded-full transition-all"
        >
          <X className="w-5 h-5" />
        </button>
Auto-Run by Default
        <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto mb-4 shadow-sm">
          <Lock className="w-6 h-6" />
        </div>

        <div className="text-center mb-6">
          <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase">Admin Login</h3>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            isaiyaa.bd Management Dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[10px] font-black text-slate-500 block mb-1.5 uppercase tracking-widest">
              Security Password:
            </label>
            <div className="relative">
              <input
                id="admin-password-input"
                type={showPassword ? 'text' : 'password'}
                required
                autoFocus
                placeholder="Enter password..."
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError('');
                }}
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-900 font-bold placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 shadow-sm transition-all"
              />
              <KeyRound className="w-4 h-4 text-amber-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-red-50 border border-red-100 text-red-700 text-xs font-bold">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            id="admin-login-submit-btn"
            className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-sm shadow-lg shadow-amber-500/20 transition-all active:scale-[0.98] cursor-pointer"
          >
            Access Dashboard
          </button>

          <p className="text-[10px] text-center text-slate-400 font-bold flex items-center justify-center gap-1 mt-2 uppercase tracking-tight">
            <Shield className="w-3 h-3 text-amber-600" />
            Protected Admin Access Only
          </p>
        </form>

      </div>
    </div>
  );
};
