import React, { useState } from 'react';
import { Lock, User, Award, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';

const AdminLogin = ({ setAdminToken, setActiveTab }) => {
  const { showToast } = useCart();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      showToast('Login va parolni kiriting', 'warning');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('adminUsername', data.username || username);
        setAdminToken(data.token);
        showToast('Tizimga muvaffaqiyatli kirdingiz!');
        setActiveTab('admin-dashboard');
      } else {
        const errData = await response.json();
        showToast(errData.message || 'Login yoki parol xato', 'warning');
      }
    } catch (err) {
      console.error('Login xatoligi:', err.message);
      showToast('Server bilan ulanishda xatolik', 'warning');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] px-4 py-8 animate-fade-in">
      <div className="w-full max-w-sm rounded-3xl border border-restaurant-border bg-restaurant-card/80 backdrop-blur-md p-7 flex flex-col gap-5 gold-border-glow relative overflow-hidden">
        {/* Soft Golden Ambient Light Background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-restaurant-gold/5 blur-[40px] rounded-full pointer-events-none" />

        {/* Branding header */}
        <div className="text-center flex flex-col items-center justify-center gap-1.5 mt-2">
          <div className="w-12 h-12 rounded-full border border-restaurant-gold flex items-center justify-center gold-border-glow bg-restaurant-gold/10">
            <Award className="w-6 h-6 text-restaurant-gold" />
          </div>
          <h2 className="font-serif font-bold text-xl text-restaurant-text-primary mt-2">
            POLVON FOOD <span className="gold-gradient-text">Admin Panel</span>
          </h2>
          <p className="text-[10px] text-restaurant-text-secondary uppercase tracking-widest font-medium">
            Tizimga kirish
          </p>
        </div>

        <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4 mt-2">
          {/* Username */}
          <div className="relative">
            <input
              type="text"
              placeholder="Login..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-[#0B0B0C] border border-restaurant-border focus:border-restaurant-gold/50 rounded-xl py-3 pl-10 pr-4 text-xs text-restaurant-text-primary focus:outline-none transition-all placeholder-restaurant-text-secondary/50"
            />
            <User className="w-4 h-4 text-restaurant-text-secondary/60 absolute left-3.5 top-3.5" />
          </div>

          {/* Password */}
          <div className="relative">
            <input
              type="password"
              placeholder="Parol..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#0B0B0C] border border-restaurant-border focus:border-restaurant-gold/50 rounded-xl py-3 pl-10 pr-4 text-xs text-restaurant-text-primary focus:outline-none transition-all placeholder-restaurant-text-secondary/50"
            />
            <Lock className="w-4 h-4 text-restaurant-text-secondary/60 absolute left-3.5 top-3.5" />
          </div>

          {/* CTA Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-restaurant-gold hover:bg-restaurant-gold-dark text-[#0B0B0C] font-bold text-xs tracking-wider transition-all duration-300 gold-button-glow hover:scale-[1.01] active:scale-95 disabled:opacity-40"
          >
            {loading ? 'Kirilmoqda...' : 'Kirish'}
          </button>
        </form>

        <div className="flex items-center justify-center gap-1.5 text-[9px] text-restaurant-text-secondary/80 mt-2 border-t border-restaurant-border/30 pt-4">
          <ShieldCheck className="w-3.5 h-3.5 text-restaurant-gold/60" />
          <span>Xavfsiz ulanish va JWT avtorizatsiyasi</span>
        </div>
      </div>

      <button
        onClick={() => setActiveTab('home')}
        className="mt-6 text-xs text-restaurant-text-secondary hover:text-restaurant-text-primary transition-colors"
      >
        Menu sahifasiga qaytish
      </button>
    </div>
  );
};

export default AdminLogin;
