import React, { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import { CheckCircle2, Clock, ChefHat, Truck, RefreshCw } from 'lucide-react';
import io from 'socket.io-client';

const OrderStatusModal = ({ onClose }) => {
  const { activeOrder, setActiveOrder, showToast } = useCart();
  const [loading, setLoading] = useState(false);
  const [orderData, setOrderData] = useState(activeOrder);

  // Poll or socket listen to updates
  useEffect(() => {
    if (!activeOrder) return;

    // Connect to backend WebSocket for real-time status updates
    const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000');

    socket.on('connect', () => {
      console.log('🔌 Order tracker socket connected');
    });

    socket.on('orderStatusUpdated', (data) => {
      if (data.orderId === activeOrder.orderId) {
        setOrderData((prev) => ({ ...prev, status: data.status }));
        setActiveOrder((prev) => ({ ...prev, status: data.status }));
        
        let msg = '';
        if (data.status === 'Preparing') msg = '👨‍🍳 Buyurtmangiz tayyorlanishni boshladi!';
        if (data.status === 'Delivered') msg = '✅ Buyurtma yetkazib berildi! Yoqimli ishtaha!';
        showToast(msg, 'info');
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [activeOrder, setActiveOrder]);

  const refreshStatus = async () => {
    if (!activeOrder) return;
    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/orders/track/${activeOrder.orderId}`
      );
      if (response.ok) {
        const data = await response.json();
        setOrderData(data);
        setActiveOrder(data);
      }
    } catch (err) {
      console.error('Xatolik:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!orderData) return null;

  const getStatusStep = () => {
    switch (orderData.status) {
      case 'Delivered':
        return 3;
      case 'Preparing':
        return 2;
      case 'Pending':
      default:
        return 1;
    }
  };

  const currentStep = getStatusStep();

  return (
    <div className="p-4 rounded-2xl border border-restaurant-border bg-[#121214]/65 backdrop-blur-md animate-fade-in gold-border-glow">
      <div className="flex items-center justify-between border-b border-restaurant-border/40 pb-3">
        <div>
          <span className="text-[10px] text-restaurant-text-secondary uppercase tracking-widest">Buyurtma ID</span>
          <h3 className="font-serif font-semibold text-lg text-restaurant-gold">
            #{orderData.orderId}
          </h3>
        </div>
        <button
          onClick={refreshStatus}
          disabled={loading}
          className={`p-2 rounded-xl border border-restaurant-border bg-[#0B0B0C] text-restaurant-gold hover:text-restaurant-gold-light transition-all ${
            loading ? 'animate-spin' : ''
          }`}
          aria-label="Refresh status"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Progress Steps */}
      <div className="mt-6 flex items-center justify-between relative px-2">
        {/* Progress Line */}
        <div className="absolute top-1/2 left-4 right-4 h-[2px] bg-restaurant-border -translate-y-1/2 -z-10">
          <div
            className="h-full bg-restaurant-gold transition-all duration-500"
            style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
          />
        </div>

        {/* Step 1: Pending */}
        <div className="flex flex-col items-center gap-1.5 z-10 bg-[#121214] px-1.5">
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all ${
              currentStep >= 1
                ? 'border-restaurant-gold bg-restaurant-gold/15 text-restaurant-gold shadow-lg shadow-restaurant-gold/10'
                : 'border-restaurant-border bg-[#0B0B0C] text-restaurant-text-secondary'
            }`}
          >
            <Clock className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-semibold tracking-wide uppercase text-restaurant-text-primary">
            Kutilmoqda
          </span>
        </div>

        {/* Step 2: Preparing */}
        <div className="flex flex-col items-center gap-1.5 z-10 bg-[#121214] px-1.5">
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all ${
              currentStep >= 2
                ? 'border-restaurant-gold bg-restaurant-gold/15 text-restaurant-gold shadow-lg shadow-restaurant-gold/10'
                : 'border-restaurant-border bg-[#0B0B0C] text-restaurant-text-secondary'
            }`}
          >
            <ChefHat className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-semibold tracking-wide uppercase text-restaurant-text-primary">
            Tayyorlanmoqda
          </span>
        </div>

        {/* Step 3: Delivered */}
        <div className="flex flex-col items-center gap-1.5 z-10 bg-[#121214] px-1.5">
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all ${
              currentStep >= 3
                ? 'border-restaurant-gold bg-restaurant-gold/15 text-[#0B0B0C] gold-gradient-bg shadow-lg shadow-restaurant-gold/25'
                : 'border-restaurant-border bg-[#0B0B0C] text-restaurant-text-secondary'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-semibold tracking-wide uppercase text-restaurant-text-primary">
            Yetkazildi
          </span>
        </div>
      </div>

      {/* Info Card */}
      <div className="mt-6 rounded-xl border border-restaurant-border/60 bg-[#0B0B0C]/40 p-4">
        {orderData.status === 'Pending' && (
          <div className="text-center animate-pulse-subtle">
            <h4 className="text-sm font-semibold text-restaurant-text-primary flex items-center justify-center gap-2">
              ⏳ Buyurtmangiz qabul qilindi
            </h4>
            <p className="text-xs text-restaurant-text-secondary mt-1.5 max-w-[280px] mx-auto leading-relaxed">
              Taxminiy tayyorlanish vaqti: 10-15 daqiqa. Hozirda administrator uni ko'rib chiqmoqda.
            </p>
          </div>
        )}

        {orderData.status === 'Preparing' && (
          <div className="text-center">
            <h4 className="text-sm font-semibold text-restaurant-gold flex items-center justify-center gap-2">
              👨‍🍳 Taomlar tayyorlanmoqda
            </h4>
            <p className="text-xs text-restaurant-text-secondary mt-1.5 max-w-[280px] mx-auto leading-relaxed">
              Bizning shef-pazandalarimiz buyurtmangizni tayyorlashga kirishishdi. Afitsant yaqin daqiqalarda olib boradi.
            </p>
          </div>
        )}

        {orderData.status === 'Delivered' && (
          <div className="text-center">
            <h4 className="text-sm font-semibold text-emerald-400 flex items-center justify-center gap-2">
              ✅ Buyurtma yetkazildi
            </h4>
            <p className="text-xs text-restaurant-text-secondary mt-1.5 max-w-[280px] mx-auto leading-relaxed">
              Afitsant buyurtmangizni topshirdi. Bizni tanlaganingiz uchun tashakkur va yoqimli ishtaha!
            </p>
          </div>
        )}
      </div>

      <div className="mt-5 border-t border-restaurant-border/30 pt-4 flex flex-col gap-2.5">
        <div className="flex justify-between text-xs">
          <span className="text-restaurant-text-secondary">Stol raqami:</span>
          <span className="font-bold text-restaurant-text-primary">№{orderData.tableNumber}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-restaurant-text-secondary">Taomlar soni:</span>
          <span className="font-bold text-restaurant-text-primary">
            {orderData.items.reduce((sum, item) => sum + item.quantity, 0)} ta
          </span>
        </div>
        <div className="flex justify-between text-sm font-semibold pt-2 border-t border-restaurant-border/20">
          <span className="text-restaurant-gold">Jami summa:</span>
          <span className="text-restaurant-gold font-bold">
            {orderData.totalPrice.toLocaleString('uz-UZ')} so'm
          </span>
        </div>
      </div>
    </div>
  );
};

export default OrderStatusModal;
