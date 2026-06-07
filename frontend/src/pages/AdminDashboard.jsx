import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { LogOut, RefreshCw, ChefHat, CheckCircle2, AlertCircle, ShoppingCart, DollarSign, Users, Plus, Trash2, Image, Upload, X, LayoutGrid } from 'lucide-react';
import io from 'socket.io-client';

const AdminDashboard = ({ adminToken, setAdminToken, setActiveTab }) => {
  const { showToast } = useCart();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSubTab, setActiveSubTab] = useState('active'); // 'active' or 'delivered'
  
  // Menu Management States
  const [activeMainTab, setActiveMainTab] = useState('orders'); // 'orders', 'menu', 'tables', 'settings'
  
  // Table Management States
  const [tables, setTables] = useState([]);
  const [tablesLoading, setTablesLoading] = useState(false);
  const [newTableNumber, setNewTableNumber] = useState('');
  const [foods, setFoods] = useState([]);
  const [foodsLoading, setFoodsLoading] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addForm, setAddForm] = useState({
    name: '',
    price: '',
    category: 'Burgerlar',
    description: '',
    image: '',
  });

  const fetchFoods = async () => {
    setFoodsLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/foods`
      );
      if (response.ok) {
        const data = await response.json();
        setFoods(data);
      }
    } catch (err) {
      console.error('Taomlarni yuklashda xatolik:', err);
    } finally {
      setFoodsLoading(false);
    }
  };

  const fetchTables = async () => {
    setTablesLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/tables`
      );
      if (response.ok) {
        const data = await response.json();
        setTables(data);
      }
    } catch (err) {
      console.error('Stollarni yuklashda xatolik:', err);
    } finally {
      setTablesLoading(false);
    }
  };

  const handleAddTable = async () => {
    const num = parseInt(newTableNumber, 10);
    if (!num || num < 1) {
      showToast('Stol raqamini kiriting', 'warning');
      return;
    }
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/tables`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${adminToken}`,
          },
          body: JSON.stringify({ tableNumber: num }),
        }
      );
      if (response.ok) {
        showToast(`Stol №${num} qo'shildi`);
        setNewTableNumber('');
        fetchTables();
      } else {
        const errData = await response.json();
        showToast(errData.message || 'Xatolik yuz berdi', 'warning');
      }
    } catch (err) {
      showToast('Server bilan ulanishda xatolik', 'warning');
    }
  };

  const handleDeleteTable = async (id, tableNumber) => {
    if (!window.confirm(`Stol №${tableNumber} ni o'chirmoqchimisiz?`)) return;
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/tables/${id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );
      if (response.ok) {
        showToast(`Stol №${tableNumber} o'chirildi`);
        fetchTables();
      } else {
        const errData = await response.json();
        showToast(errData.message || 'Xatolik yuz berdi', 'warning');
      }
    } catch (err) {
      showToast('Server bilan ulanishda xatolik', 'warning');
    }
  };

  useEffect(() => {
    if (activeMainTab === 'menu') {
      fetchFoods();
    } else if (activeMainTab === 'tables') {
      fetchTables();
    }
  }, [activeMainTab]);

  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        showToast('Rasm hajmi juda katta (max 8MB)', 'warning');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAddForm((prev) => ({ ...prev, image: reader.result }));
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddFoodSubmit = async (e) => {
    e.preventDefault();
    if (!addForm.name || !addForm.price || !addForm.category || !addForm.description || !addForm.image) {
      showToast('Iltimos, barcha maydonlarni to\'ldiring', 'warning');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/foods`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${adminToken}`,
          },
          body: JSON.stringify({
            ...addForm,
            price: Number(addForm.price),
          }),
        }
      );

      if (response.ok) {
        showToast('Yangi taom muvaffaqiyatli qo\'shildi');
        setAddForm({
          name: '',
          price: '',
          category: 'Burgerlar',
          description: '',
          image: '',
        });
        setImagePreview('');
        setIsAddModalOpen(false);
        fetchFoods();
      } else {
        const errData = await response.json();
        showToast(errData.message || 'Xatolik yuz berdi', 'warning');
      }
    } catch (err) {
      console.error(err);
      showToast('Server bilan ulanishda xatolik', 'warning');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteFood = async (id, name) => {
    if (!window.confirm(`Haqiqatan ham "${name}" taomini o'chirmoqchimisiz?`)) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/foods/${id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );

      if (response.ok) {
        showToast('Taom muvaffaqiyatli o\'chirildi');
        setFoods((prev) => prev.filter((f) => f._id !== id));
      } else {
        const errData = await response.json();
        showToast(errData.message || 'Xatolik yuz berdi', 'warning');
      }
    } catch (err) {
      console.error(err);
      showToast('Server bilan ulanishda xatolik', 'warning');
    }
  };

  // Premium synthesized notification sound using Web Audio API
  const playNotificationSound = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      
      const ctx = new AudioContext();
      
      // First high pitch bell sound
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(880, ctx.currentTime); // A5 note
      gain1.gain.setValueAtTime(0.15, ctx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start();
      osc1.stop(ctx.currentTime + 0.8);

      // Second deeper chime harmonic sound delayed by 0.12s
      setTimeout(() => {
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(1318.51, ctx.currentTime); // E6 note
        gain2.gain.setValueAtTime(0.1, ctx.currentTime);
        gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.start();
        osc2.stop(ctx.currentTime + 1.2);
      }, 120);

    } catch (e) {
      console.error('Audio synthesis failed:', e);
    }
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/orders`,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (err) {
      console.error('API ulanish xatosi:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!adminToken) return;

    fetchOrders();

    // Setup Socket.io client to listen for real-time events
    const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000');

    socket.on('connect', () => {
      console.log('🔌 Admin panel socket.io connected');
    });

    socket.on('newOrder', (newOrder) => {
      setOrders((prevOrders) => [newOrder, ...prevOrders]);
      showToast(`Yangy buyurtma keldi: ${newOrder.orderId}!`, 'info');
      playNotificationSound();
    });

    socket.on('orderStatusUpdated', (data) => {
      setOrders((prevOrders) =>
        prevOrders.map((ord) =>
          ord._id === data._id ? { ...ord, status: data.status } : ord
        )
      );
    });

    return () => {
      socket.disconnect();
    };
  }, [adminToken]);

  const handleUpdateStatus = async (id, status) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/orders/${id}/status`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${adminToken}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      if (response.ok) {
        showToast(`Buyurtma "${status}" holatiga o'tkazildi`);
        setOrders((prevOrders) =>
          prevOrders.map((ord) => (ord._id === id ? { ...ord, status } : ord))
        );
      } else {
        const errData = await response.json();
        showToast(errData.message || 'Xatolik yuz berdi', 'warning');
      }
    } catch (err) {
      console.error(err);
      showToast('Server bilan ulanishda xatolik', 'warning');
    }
  };

  // Settings States
  const [settingsForm, setSettingsForm] = useState({
    newUsername: localStorage.getItem('adminUsername') || 'admin',
    newPassword: '',
    confirmPassword: '',
  });
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  const handleUpdateSettingsSubmit = async (e) => {
    e.preventDefault();
    if (!settingsForm.newUsername) {
      showToast('Login bo\'sh bo\'lishi mumkin emas', 'warning');
      return;
    }
    if (settingsForm.newPassword && settingsForm.newPassword !== settingsForm.confirmPassword) {
      showToast('Parollar bir-biriga mos kelmadi', 'warning');
      return;
    }
    if (settingsForm.newPassword && settingsForm.newPassword.length < 6) {
      showToast('Yangi parol kamida 6 ta belgidan iborat bo\'lishi kerak', 'warning');
      return;
    }

    setIsSavingSettings(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/update-credentials`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${adminToken}`,
          },
          body: JSON.stringify({
            newUsername: settingsForm.newUsername,
            newPassword: settingsForm.newPassword || undefined,
          }),
        }
      );

      if (response.ok) {
        showToast('Sozlamalar muvaffaqiyatli saqlandi! Yangi ma\'lumotlar bilan qayta kiring.');
        setSettingsForm({ newUsername: settingsForm.newUsername, newPassword: '', confirmPassword: '' });
        // Force logout to apply changes securely
        setTimeout(() => {
          handleLogout();
        }, 1500);
      } else {
        const errData = await response.json();
        showToast(errData.message || 'Xatolik yuz berdi', 'warning');
      }
    } catch (err) {
      console.error(err);
      showToast('Server bilan ulanishda xatolik', 'warning');
    } finally {
      setIsSavingSettings(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUsername');
    setAdminToken(null);
    showToast('Tizimdan chiqdingiz');
    setActiveTab('home');
  };

  // Filters
  const activeOrders = orders.filter((ord) => ['Pending', 'Preparing'].includes(ord.status));
  const deliveredOrders = orders.filter((ord) => ord.status === 'Delivered');

  const displayOrders = activeSubTab === 'active' ? activeOrders : deliveredOrders;

  // Stats Calculations
  const totalRevenue = orders
    .filter((ord) => ord.status === 'Delivered')
    .reduce((sum, ord) => sum + ord.totalPrice, 0);

  return (
    <div className="flex flex-col gap-5 animate-fade-in pb-8">
      {/* Dashboard Header */}
      <div className="flex items-center justify-between border-b border-restaurant-border/40 pb-3.5">
        <div>
          <span className="text-[9px] uppercase tracking-[0.2em] text-restaurant-gold font-bold">Boshqaruv Paneli</span>
          <h2 className="font-serif font-bold text-xl text-restaurant-text-primary mt-0.5">
            POLVON FOOD <span className="gold-gradient-text">Dashboard</span>
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchOrders}
            className="p-2 rounded-xl border border-restaurant-border bg-restaurant-card text-restaurant-gold hover:bg-[#1A1A1D] transition-all active:scale-95"
            aria-label="Refresh orders"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-red-500/20 text-red-400 hover:text-red-500 bg-red-500/5 text-xs font-semibold transition-all active:scale-95"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Chiqish</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="grid grid-cols-4 gap-1.5 bg-[#121214]/60 p-1.5 rounded-2xl border border-restaurant-border/60">
        <button
          onClick={() => setActiveMainTab('orders')}
          className={`py-2 px-1 rounded-xl text-[10px] font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeMainTab === 'orders'
              ? 'bg-restaurant-gold text-[#0B0B0C] shadow-lg'
              : 'text-restaurant-text-secondary hover:text-restaurant-text-primary'
          }`}
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          <span>Buyurtmalar</span>
        </button>
        <button
          onClick={() => setActiveMainTab('menu')}
          className={`py-2 px-1 rounded-xl text-[10px] font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeMainTab === 'menu'
              ? 'bg-restaurant-gold text-[#0B0B0C] shadow-lg'
              : 'text-restaurant-text-secondary hover:text-restaurant-text-primary'
          }`}
        >
          <ChefHat className="w-3.5 h-3.5" />
          <span>Taomlar</span>
        </button>
        <button
          onClick={() => setActiveMainTab('tables')}
          className={`py-2 px-1 rounded-xl text-[10px] font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeMainTab === 'tables'
              ? 'bg-restaurant-gold text-[#0B0B0C] shadow-lg'
              : 'text-restaurant-text-secondary hover:text-restaurant-text-primary'
          }`}
        >
          <LayoutGrid className="w-3.5 h-3.5" />
          <span>Stollar</span>
        </button>
        <button
          onClick={() => setActiveMainTab('settings')}
          className={`py-2 px-1 rounded-xl text-[10px] font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeMainTab === 'settings'
              ? 'bg-restaurant-gold text-[#0B0B0C] shadow-lg'
              : 'text-restaurant-text-secondary hover:text-restaurant-text-primary'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Sozlamalar</span>
        </button>
      </div>

      {activeMainTab === 'orders' ? (
        <>
          {/* Analytics widgets */}
          <div className="grid grid-cols-3 gap-3">
            {/* Widget 1 */}
            <div className="p-3 rounded-2xl border border-restaurant-border bg-[#121214]/50 backdrop-blur-sm flex flex-col gap-1">
              <div className="flex items-center justify-between text-restaurant-gold">
                <ShoppingCart className="w-4 h-4" />
                <span className="text-[9px] uppercase font-bold tracking-wider text-restaurant-text-secondary">Faol</span>
              </div>
              <span className="font-sans font-bold text-lg text-restaurant-text-primary mt-1">
                {activeOrders.length} ta
              </span>
            </div>

            {/* Widget 2 */}
            <div className="p-3 rounded-2xl border border-restaurant-border bg-[#121214]/50 backdrop-blur-sm flex flex-col gap-1">
              <div className="flex items-center justify-between text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-[9px] uppercase font-bold tracking-wider text-restaurant-text-secondary">Yopildi</span>
              </div>
              <span className="font-sans font-bold text-lg text-restaurant-text-primary mt-1">
                {deliveredOrders.length} ta
              </span>
            </div>

            {/* Widget 3 */}
            <div className="p-3 rounded-2xl border border-restaurant-border bg-[#121214]/50 backdrop-blur-sm flex flex-col gap-1">
              <div className="flex items-center justify-between text-restaurant-gold-light">
                <DollarSign className="w-4 h-4" />
                <span className="text-[9px] uppercase font-bold tracking-wider text-restaurant-text-secondary">Kassa</span>
              </div>
              <span className="font-sans font-bold text-[11px] text-restaurant-gold leading-tight mt-1 min-h-[22px] flex items-center">
                {totalRevenue.toLocaleString('uz-UZ')} so'm
              </span>
            </div>
          </div>

          {/* Tabs selectors */}
          <div className="flex border-b border-restaurant-border/30">
            <button
              onClick={() => setActiveSubTab('active')}
              className={`flex-grow py-2.5 text-xs font-semibold border-b-2 text-center transition-all ${
                activeSubTab === 'active'
                  ? 'border-restaurant-gold text-restaurant-gold'
                  : 'border-transparent text-restaurant-text-secondary hover:text-restaurant-text-primary'
              }`}
            >
              Faol Buyurtmalar ({activeOrders.length})
            </button>
            <button
              onClick={() => setActiveSubTab('delivered')}
              className={`flex-grow py-2.5 text-xs font-semibold border-b-2 text-center transition-all ${
                activeSubTab === 'delivered'
                  ? 'border-restaurant-gold text-restaurant-gold'
                  : 'border-transparent text-restaurant-text-secondary hover:text-restaurant-text-primary'
              }`}
            >
              Yetkazilganlar ({deliveredOrders.length})
            </button>
          </div>

          {/* Orders List Container */}
          {loading ? (
            <div className="text-center py-12">
              <p className="text-xs text-restaurant-text-secondary animate-pulse">Buyurtmalar yuklanmoqda...</p>
            </div>
          ) : displayOrders.length > 0 ? (
            <div className="flex flex-col gap-4">
              {displayOrders.map((ord) => {
                const timeStr = new Date(ord.createdAt).toLocaleTimeString('uz-UZ', {
                  hour: '2-digit',
                  minute: '2-digit',
                });

                return (
                  <div
                    key={ord._id}
                    className="rounded-2xl border border-restaurant-border bg-restaurant-card p-5 flex flex-col gap-4 gold-border-glow animate-slide-up"
                  >
                    {/* ID and Status */}
                    <div className="flex justify-between items-center border-b border-restaurant-border/40 pb-2.5">
                      <div>
                        <span className="text-[10px] text-restaurant-text-secondary">Raqam & Stol</span>
                        <h4 className="font-serif font-bold text-sm text-restaurant-text-primary flex items-center gap-1.5">
                          <span className="text-restaurant-gold">#{ord.orderId}</span>
                          <span className="w-1.5 h-1.5 rounded-full bg-restaurant-border" />
                          <span>Stol №{ord.tableNumber}</span>
                        </h4>
                      </div>
                      <div>
                        <span
                          className={`text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-md font-bold ${
                            ord.status === 'Pending'
                              ? 'border border-amber-500/20 text-amber-400 bg-amber-500/5'
                              : ord.status === 'Preparing'
                              ? 'border border-blue-500/20 text-blue-400 bg-blue-500/5'
                              : 'border border-emerald-500/20 text-emerald-400 bg-emerald-500/5'
                          }`}
                        >
                          {ord.status}
                        </span>
                      </div>
                    </div>

                    {/* Items */}
                    <div className="text-xs space-y-1.5">
                      <span className="text-[10px] text-restaurant-text-secondary uppercase tracking-widest block font-semibold mb-1">
                        📦 Taomlar Ro'yxati
                      </span>
                      {ord.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-restaurant-text-primary">
                          <span>{item.name} <span className="text-restaurant-text-secondary">x{item.quantity}</span></span>
                          <span className="font-semibold text-restaurant-text-secondary">
                            {(item.price * item.quantity).toLocaleString('uz-UZ')} so'm
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Totals */}
                    <div className="flex justify-between items-center border-t border-restaurant-border/40 pt-3 text-xs">
                      <div>
                        <span className="text-restaurant-text-secondary">Jami: </span>
                        <span className="font-sans font-bold text-restaurant-gold text-sm ml-0.5">
                          {ord.totalPrice.toLocaleString('uz-UZ')} so'm
                        </span>
                      </div>
                      <span className="text-[10px] text-restaurant-text-secondary font-semibold">
                        ⏰ {timeStr} | {ord.user?.firstName || 'Mehmon'}
                      </span>
                    </div>

                    {/* Status Toggle Buttons */}
                    {ord.status !== 'Delivered' && (
                      <div className="flex gap-2 border-t border-restaurant-border/30 pt-3">
                        {ord.status === 'Pending' && (
                          <button
                            onClick={() => handleUpdateStatus(ord._id, 'Preparing')}
                            className="flex-grow flex items-center justify-center gap-1.5 py-2 px-4 rounded-xl border border-restaurant-gold/30 bg-restaurant-gold/10 text-restaurant-gold hover:bg-restaurant-gold/20 text-xs font-bold transition-all active:scale-[0.98]"
                          >
                            <ChefHat className="w-3.5 h-3.5" />
                            <span>Preparing</span>
                          </button>
                        )}
                        
                        {(ord.status === 'Pending' || ord.status === 'Preparing') && (
                          <button
                            onClick={() => handleUpdateStatus(ord._id, 'Delivered')}
                            className="flex-grow flex items-center justify-center gap-1.5 py-2 px-4 rounded-xl bg-restaurant-gold hover:bg-restaurant-gold-dark text-[#0B0B0C] text-xs font-bold transition-all active:scale-[0.98]"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Delivered</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 rounded-2xl border border-dashed border-restaurant-border bg-restaurant-card/30 flex flex-col items-center justify-center gap-2">
              <AlertCircle className="w-6 h-6 text-restaurant-text-secondary" />
              <p className="text-xs text-restaurant-text-secondary">Ushbu bo'limda hech qanday buyurtma mavjud emas.</p>
            </div>
          )}
        </>
      ) : activeMainTab === 'menu' ? (
        /* Menu Management Tab */
        <div className="flex flex-col gap-4 animate-fade-in">
          <div className="flex justify-between items-center pb-2 border-b border-restaurant-border/30">
            <h3 className="font-serif font-bold text-sm text-restaurant-text-primary">
              Mavjud Taomlar ({foods.length})
            </h3>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-restaurant-gold hover:bg-restaurant-gold-dark text-[#0B0B0C] text-xs font-bold transition-all active:scale-95 shadow-md"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Taom Qo'shish</span>
            </button>
          </div>

          {foodsLoading ? (
            <div className="text-center py-12">
              <p className="text-xs text-restaurant-text-secondary animate-pulse">Menyu yuklanmoqda...</p>
            </div>
          ) : foods.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {foods.map((food) => (
                <div
                  key={food._id}
                  className="group rounded-2xl bg-restaurant-card border border-restaurant-border overflow-hidden transition-all duration-300 hover:border-restaurant-gold/30 gold-border-glow flex flex-col h-full"
                >
                  {/* Food Image Container */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#16161a]">
                    <img
                      src={food.image}
                      alt={food.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none" stroke="%23D4AF37" stroke-width="1.5"><circle cx="50" cy="50" r="40"/><circle cx="50" cy="50" r="32" stroke-dasharray="2 4"/><path d="M35 50h30M50 35v30"/></svg>`;
                      }}
                    />
                    <div className="absolute top-3 right-3 rounded-full bg-[#0B0B0C]/80 backdrop-blur-md border border-restaurant-gold/20 px-2 py-0.5 text-[9px] font-semibold text-restaurant-gold uppercase tracking-wider">
                      {food.category}
                    </div>
                  </div>

                  {/* Info Body */}
                  <div className="p-3 flex flex-col justify-between flex-grow">
                    <div>
                      <h3 className="font-serif font-bold text-sm text-restaurant-text-primary line-clamp-1">
                        {food.name}
                      </h3>
                      <p className="mt-1 text-[11px] text-restaurant-text-secondary line-clamp-2 min-h-[30px] leading-relaxed">
                        {food.description}
                      </p>
                    </div>

                    <div className="mt-3 flex items-center justify-between pt-2 border-t border-restaurant-border/40">
                      <div>
                        <span className="text-[9px] text-restaurant-text-secondary uppercase tracking-widest block">Narxi</span>
                        <span className="font-sans font-bold text-xs text-restaurant-gold">
                          {food.price.toLocaleString('uz-UZ')} so'm
                        </span>
                      </div>

                      <button
                        onClick={() => handleDeleteFood(food._id, food.name)}
                        className="flex items-center justify-center p-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all border border-red-500/20 active:scale-95"
                        aria-label="Delete food"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 rounded-2xl border border-dashed border-restaurant-border bg-restaurant-card/30">
              <p className="text-xs text-restaurant-text-secondary">Hozirda menyuda hech qanday taom mavjud emas.</p>
            </div>
          )}

          {/* Premium overlay modal for adding new foods */}
          {isAddModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
              <div className="w-full max-w-sm rounded-3xl border border-restaurant-border bg-restaurant-card p-5 flex flex-col gap-4 gold-border-glow shadow-2xl relative animate-slide-up">
                {/* Modal Header */}
                <div className="flex justify-between items-center border-b border-restaurant-border/40 pb-3">
                  <h3 className="font-serif font-bold text-base text-restaurant-gold flex items-center gap-1.5">
                    <ChefHat className="w-4 h-4" />
                    <span>Yangi Taom Qo'shish</span>
                  </h3>
                  <button
                    onClick={() => {
                      setIsAddModalOpen(false);
                      setImagePreview('');
                    }}
                    className="p-1 rounded-lg hover:bg-restaurant-border text-restaurant-text-secondary transition-all"
                  >
                    <X className="w-4.5 h-4.5" />
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleAddFoodSubmit} className="flex flex-col gap-3.5 max-h-[70vh] overflow-y-auto pr-1">
                  <div>
                    <label className="block text-[10px] text-restaurant-text-secondary uppercase tracking-widest mb-1.5 font-semibold">Taom Nomi</label>
                    <input
                      type="text"
                      required
                      placeholder="Masalan: Texas BBQ Burger"
                      value={addForm.name}
                      onChange={(e) => setAddForm(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full bg-[#0B0B0C] border border-restaurant-border focus:border-restaurant-gold/50 rounded-xl py-2.5 px-3 text-xs text-restaurant-text-primary focus:outline-none transition-all placeholder-restaurant-text-secondary/40"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] text-restaurant-text-secondary uppercase tracking-widest mb-1.5 font-semibold">Narxi (so'm)</label>
                      <input
                        type="number"
                        required
                        placeholder="48000"
                        value={addForm.price}
                        onChange={(e) => setAddForm(prev => ({ ...prev, price: e.target.value }))}
                        className="w-full bg-[#0B0B0C] border border-restaurant-border focus:border-restaurant-gold/50 rounded-xl py-2.5 px-3 text-xs text-restaurant-text-primary focus:outline-none transition-all placeholder-restaurant-text-secondary/40"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-restaurant-text-secondary uppercase tracking-widest mb-1.5 font-semibold">Kategoriya</label>
                      <select
                        value={addForm.category}
                        onChange={(e) => setAddForm(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full bg-[#0B0B0C] border border-restaurant-border focus:border-restaurant-gold/50 rounded-xl py-2.5 px-2 text-xs text-restaurant-text-primary focus:outline-none transition-all"
                      >
                        <option value="Burgerlar">Burgerlar</option>
                        <option value="Fast food">Fast food</option>
                        <option value="Ichimliklar">Ichimliklar</option>
                        <option value="Desertlar">Desertlar</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] text-restaurant-text-secondary uppercase tracking-widest mb-1.5 font-semibold">Tavsifi</label>
                    <textarea
                      required
                      placeholder="Taom tarkibi, tayyorlanishi haqida..."
                      value={addForm.description}
                      onChange={(e) => setAddForm(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full bg-[#0B0B0C] border border-restaurant-border focus:border-restaurant-gold/50 rounded-xl p-2.5 text-xs text-restaurant-text-primary focus:outline-none min-h-[60px] resize-none transition-all placeholder-restaurant-text-secondary/40 leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-restaurant-text-secondary uppercase tracking-widest mb-1 font-semibold">Taom Rasmi</label>
                    <div className="flex flex-col gap-2">
                      {/* File Upload Option */}
                      <div className="flex items-center justify-center w-full">
                        <label className="flex flex-col items-center justify-center w-full h-20 border border-dashed border-restaurant-border rounded-xl cursor-pointer bg-[#0B0B0C]/40 hover:bg-[#121214] transition-all hover:border-restaurant-gold/30">
                          <div className="flex flex-col items-center justify-center pt-2 pb-2">
                            <Upload className="w-5 h-5 text-restaurant-gold/70 mb-1" />
                            <p className="text-[9px] text-restaurant-text-secondary">Rasm yuklash (Kompyuterdan)</p>
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageFileChange}
                            className="hidden"
                          />
                        </label>
                      </div>

                      <span className="text-[9px] text-center text-restaurant-text-secondary/60">- yoki -</span>

                      {/* Image URL Option */}
                      <input
                        type="text"
                        placeholder="Rasm havolasini kiriting (Image URL)"
                        value={addForm.image.startsWith('data:') ? '' : addForm.image}
                        onChange={(e) => {
                          setAddForm(prev => ({ ...prev, image: e.target.value }));
                          setImagePreview(e.target.value);
                        }}
                        className="w-full bg-[#0B0B0C] border border-restaurant-border focus:border-restaurant-gold/50 rounded-xl py-2.5 px-3 text-xs text-restaurant-text-primary focus:outline-none transition-all placeholder-restaurant-text-secondary/40"
                      />

                      {/* Preview */}
                      {imagePreview && (
                        <div className="mt-1 relative w-full aspect-[16/9] rounded-xl overflow-hidden border border-restaurant-border">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none" stroke="%23D4AF37" stroke-width="1.5"><circle cx="50" cy="50" r="40"/><circle cx="50" cy="50" r="32" stroke-dasharray="2 4"/><path d="M35 50h30M50 35v30"/></svg>`;
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Submit Buttons */}
                  <div className="flex gap-2.5 border-t border-restaurant-border/30 pt-3.5 mt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddModalOpen(false);
                        setImagePreview('');
                      }}
                      className="flex-grow py-3 rounded-xl border border-restaurant-border bg-restaurant-card text-restaurant-text-secondary font-semibold text-xs transition-all active:scale-95"
                    >
                      Bekor qilish
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-grow py-3 rounded-xl bg-restaurant-gold hover:bg-restaurant-gold-dark text-[#0B0B0C] font-bold text-xs transition-all active:scale-95 disabled:opacity-50"
                    >
                      {isSubmitting ? 'Qo\'shilmoqda...' : 'Taomni Qo\'shish'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      ) : activeMainTab === 'tables' ? (
        /* Tables Management Tab */
        <div className="flex flex-col gap-4 animate-fade-in">
          <div className="flex items-center justify-between pb-2 border-b border-restaurant-border/30">
            <h3 className="font-serif font-bold text-sm text-restaurant-text-primary">
              Stollar ({tables.length})
            </h3>
          </div>

          {/* Add new table */}
          <div className="rounded-2xl border border-restaurant-border bg-restaurant-card p-4 flex flex-col gap-3 gold-border-glow">
            <h4 className="font-serif font-semibold text-xs text-restaurant-gold">Yangi Stol Qo'shish</h4>
            <div className="flex gap-2">
              <input
                type="number"
                min="1"
                placeholder="Stol raqami..."
                value={newTableNumber}
                onChange={(e) => setNewTableNumber(e.target.value)}
                className="flex-1 bg-[#0B0B0C] border border-restaurant-border focus:border-restaurant-gold/50 rounded-xl py-2.5 px-3 text-xs text-restaurant-text-primary focus:outline-none transition-all placeholder-restaurant-text-secondary/40"
                onKeyDown={(e) => e.key === 'Enter' && handleAddTable()}
              />
              <button
                onClick={handleAddTable}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-restaurant-gold hover:bg-restaurant-gold-dark text-[#0B0B0C] text-xs font-bold transition-all active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Qo'shish</span>
              </button>
            </div>
            {tables.length === 0 && (
              <button
                onClick={async () => {
                  for (let i = 1; i <= 10; i++) {
                    try {
                      await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/tables`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
                        body: JSON.stringify({ tableNumber: i }),
                      });
                    } catch (e) {}
                  }
                  showToast('10 ta stol yaratildi');
                  fetchTables();
                }}
                className="w-full py-2 rounded-xl border border-dashed border-restaurant-gold/30 text-restaurant-gold text-xs font-semibold hover:bg-restaurant-gold/5 transition-all"
              >
                10 ta stolni bir vaqtda yaratish
              </button>
            )}
          </div>

          {/* Tables list */}
          {tablesLoading ? (
            <div className="text-center py-12">
              <p className="text-xs text-restaurant-text-secondary animate-pulse">Stollar yuklanmoqda...</p>
            </div>
          ) : tables.length > 0 ? (
            <div className="grid grid-cols-4 gap-3">
              {tables.map((table) => (
                <div
                  key={table._id}
                  className="relative rounded-2xl border border-restaurant-border bg-restaurant-card p-4 text-center gold-border-glow group hover:border-restaurant-gold/30 transition-all"
                >
                  <span className="font-serif font-bold text-lg text-restaurant-gold">#{table.tableNumber}</span>
                  <button
                    onClick={() => handleDeleteTable(table._id, table.tableNumber)}
                    className="absolute top-1.5 right-1.5 p-1 rounded-lg bg-red-500/10 text-red-400 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500/20"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 rounded-2xl border border-dashed border-restaurant-border bg-restaurant-card/30">
              <p className="text-xs text-restaurant-text-secondary">Hozirda hech qanday stol mavjud emas.</p>
            </div>
          )}
        </div>
      ) : (
        /* Settings Tab */
        <div className="rounded-2xl border border-restaurant-border bg-restaurant-card p-5 flex flex-col gap-4 gold-border-glow animate-slide-up">
          <div>
            <span className="text-[9px] uppercase tracking-[0.2em] text-restaurant-gold font-bold">Xavfsizlik</span>
            <h3 className="font-serif font-bold text-base text-restaurant-text-primary mt-0.5">
              Admin Ma'lumotlarini <span className="gold-gradient-text">O'zgartirish</span>
            </h3>
            <p className="text-[10px] text-restaurant-text-secondary mt-1 leading-relaxed">
              Tizimga kirish uchun yangi login nomi yoki parolini kiriting. Xavfsizlik maqsadida ma'lumotlarni o'zgartirgandan so'ng tizimdan avtomatik chiqasiz va qayta kirishingiz talab etiladi.
            </p>
          </div>

          <form onSubmit={handleUpdateSettingsSubmit} className="flex flex-col gap-4 border-t border-restaurant-border/30 pt-4">
            <div>
              <label className="block text-[10px] text-restaurant-text-secondary uppercase tracking-widest mb-1.5 font-semibold">Login Nomi</label>
              <input
                type="text"
                required
                placeholder="Yangi login kiriting..."
                value={settingsForm.newUsername}
                onChange={(e) => setSettingsForm(prev => ({ ...prev, newUsername: e.target.value }))}
                className="w-full bg-[#0B0B0C] border border-restaurant-border focus:border-restaurant-gold/50 rounded-xl py-3 px-4 text-xs text-restaurant-text-primary focus:outline-none transition-all placeholder-restaurant-text-secondary/40"
              />
            </div>

            <div>
              <label className="block text-[10px] text-restaurant-text-secondary uppercase tracking-widest mb-1.5 font-semibold">Yangi Parol (Ixtiyoriy)</label>
              <input
                type="password"
                placeholder="Yangi parolni kiriting (kamida 6 ta belgi)..."
                value={settingsForm.newPassword}
                onChange={(e) => setSettingsForm(prev => ({ ...prev, newPassword: e.target.value }))}
                className="w-full bg-[#0B0B0C] border border-restaurant-border focus:border-restaurant-gold/50 rounded-xl py-3 px-4 text-xs text-restaurant-text-primary focus:outline-none transition-all placeholder-restaurant-text-secondary/40"
              />
            </div>

            <div>
              <label className="block text-[10px] text-restaurant-text-secondary uppercase tracking-widest mb-1.5 font-semibold">Yangi Parolni Tasdiqlash</label>
              <input
                type="password"
                placeholder="Yangi parolni qayta kiriting..."
                value={settingsForm.confirmPassword}
                onChange={(e) => setSettingsForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                className="w-full bg-[#0B0B0C] border border-restaurant-border focus:border-restaurant-gold/50 rounded-xl py-3 px-4 text-xs text-restaurant-text-primary focus:outline-none transition-all placeholder-restaurant-text-secondary/40"
              />
            </div>

            <button
              type="submit"
              disabled={isSavingSettings}
              className="w-full py-3.5 rounded-xl bg-restaurant-gold hover:bg-restaurant-gold-dark text-[#0B0B0C] font-bold text-xs tracking-wider transition-all duration-300 gold-button-glow hover:scale-[1.01] active:scale-95 disabled:opacity-40 mt-2"
            >
              {isSavingSettings ? 'Saqlanmoqda...' : 'O\'zgarishlarni Saqlash'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
