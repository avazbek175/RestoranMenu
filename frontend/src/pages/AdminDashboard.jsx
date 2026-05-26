import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { LogOut, RefreshCw, ChefHat, CheckCircle2, AlertCircle, ShoppingCart, DollarSign, Users } from 'lucide-react';
import io from 'socket.io-client';

const AdminDashboard = ({ adminToken, setAdminToken, setActiveTab }) => {
  const { showToast } = useCart();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSubTab, setActiveSubTab] = useState('active'); // 'active' or 'delivered'

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
      } else {
        // Fallback simulated orders for frontend-only demo
        generateSimulatedOrders();
      }
    } catch (err) {
      console.error('API ulanish xatosi, simulyatsiya yuklanmoqda:', err.message);
      generateSimulatedOrders();
    } finally {
      setLoading(false);
    }
  };

  const generateSimulatedOrders = () => {
    const mockOrders = [
      {
        _id: 'mock_1',
        orderId: 'ORD-7241',
        tableNumber: 5,
        items: [
          { name: 'Shohona Choyxona Palovi', quantity: 2, price: 45000 },
          { name: 'Mojito Classic (0.4L)', quantity: 2, price: 18000 }
        ],
        totalPrice: 126000,
        status: 'Pending',
        user: { firstName: 'Sardor', username: 'sardor_dev' },
        createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      },
      {
        _id: 'mock_2',
        orderId: 'ORD-8930',
        tableNumber: 3,
        items: [
          { name: 'Empire Gold Burger', quantity: 1, price: 38000 },
          { name: 'Qarsildoq Tovuqli Lavash', quantity: 1, price: 28000 },
          { name: 'Gilos Sharbati Fresh (0.3L)', quantity: 2, price: 22000 }
        ],
        totalPrice: 110000,
        status: 'Preparing',
        user: { firstName: 'Kamola', username: 'kamola_shirin' },
        createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      },
      {
        _id: 'mock_3',
        orderId: 'ORD-4127',
        tableNumber: 12,
        items: [
          { name: 'Tiramisu Klasiko', quantity: 3, price: 25000 },
          { name: 'Tandir Somsa (3 ta)', quantity: 1, price: 30000 }
        ],
        totalPrice: 105000,
        status: 'Delivered',
        user: { firstName: 'Akmal', username: 'akmal_uz' },
        createdAt: new Date(Date.now() - 50 * 60 * 1000).toISOString(),
      }
    ];
    setOrders(mockOrders);
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
        // Mock fallback for demo
        setOrders((prevOrders) =>
          prevOrders.map((ord) => (ord._id === id ? { ...ord, status } : ord))
        );
        showToast(`Status tahrirlandi: ${status}`);
      }
    } catch (err) {
      console.error(err);
      // Fallback
      setOrders((prevOrders) =>
        prevOrders.map((ord) => (ord._id === id ? { ...ord, status } : ord))
      );
      showToast(`Status tahrirlandi: ${status}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
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
            L'Empire <span className="gold-gradient-text">Dashboard</span>
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
    </div>
  );
};

export default AdminDashboard;
