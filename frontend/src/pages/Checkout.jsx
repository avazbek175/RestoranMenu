import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { ArrowLeft, Check, Compass, Eye, ShieldAlert, Sparkles } from 'lucide-react';

const Checkout = ({ setActiveTab }) => {
  const {
    cartItems,
    totalPrice,
    tableNumber,
    setTableNumber,
    telegramUser,
    clearCart,
    setActiveOrder,
    showToast,
  } = useCart();

  const [loading, setLoading] = useState(false);
  const [selectedTable, setSelectedTable] = useState(tableNumber || '');
  const [comments, setComments] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderResult, setOrderResult] = useState(null);
  const [tables, setTables] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/tables`)
      .then((res) => res.ok ? res.json() : [])
      .then((data) => setTables(data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (tableNumber) {
      setSelectedTable(tableNumber);
    }
  }, [tableNumber]);

  const handleSubmitOrder = async (e) => {
    e.preventDefault();

    if (!selectedTable) {
      showToast('Iltimos, stol raqamini tanlang', 'warning');
      return;
    }

    setLoading(true);

    const orderPayload = {
      tableNumber: parseInt(selectedTable, 10),
      items: cartItems.map((item) => ({
        food: item._id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      totalPrice,
      user: telegramUser,
      comments,
    };

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/orders`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(orderPayload),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setOrderResult(data);
        setActiveOrder(data);
        clearCart();
        setIsSuccess(true);
        showToast('Buyurtma qabul qilindi!');
      } else {
        const errData = await response.json();
        showToast(errData.message || 'Xatolik yuz berdi', 'warning');
      }
    } catch (err) {
      console.error('Buyurtma xatoligi:', err.message);
      showToast('Server bilan ulanishda xatolik', 'warning');
    } finally {
      setLoading(false);
    }
  };

  // Success Screen Page
  if (isSuccess && orderResult) {
    return (
      <div className="flex flex-col items-center justify-center text-center px-4 py-8 animate-fade-in min-h-[80vh]">
        {/* Animated Gold Ring & Icon */}
        <div className="relative w-20 h-20 rounded-full border border-restaurant-gold flex items-center justify-center gold-border-glow bg-restaurant-gold/15 animate-bounce mb-6">
          <Sparkles className="w-10 h-10 text-restaurant-gold" />
        </div>

        <div className="rounded-3xl border border-restaurant-border bg-[#121214]/65 backdrop-blur-md p-6 max-w-sm flex flex-col gap-4 gold-border-glow">
          <h3 className="font-serif font-bold text-xl text-restaurant-gold">
            Buyurtma Muvaffaqiyatli Yuborildi!
          </h3>
          
          <div className="text-left text-xs space-y-3.5 border-t border-b border-restaurant-border/40 py-4 my-1">
            <p className="font-medium text-restaurant-text-primary text-sm leading-relaxed text-center">
              ✅ Buyurtmangiz qabul qilindi.<br />
              ⏳ Taxminiy tayyorlanish vaqti: 10-15 daqiqa.<br />
              👨‍🍳 Afitsant buyurtmangizni olib boradi.
            </p>
          </div>

          <div className="flex justify-between text-xs text-restaurant-text-secondary">
            <span>Buyurtma ID:</span>
            <span className="font-bold text-restaurant-text-primary">#{orderResult.orderId}</span>
          </div>

          <div className="flex justify-between text-xs text-restaurant-text-secondary">
            <span>Stolingiz:</span>
            <span className="font-bold text-restaurant-text-primary">№{orderResult.tableNumber}</span>
          </div>
        </div>

        <div className="w-full max-w-xs flex flex-col gap-3 mt-8">
          <button
            onClick={() => setActiveTab('track')}
            className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-restaurant-gold hover:bg-restaurant-gold-dark text-[#0B0B0C] font-bold tracking-wide text-sm transition-all gold-button-glow hover:scale-[1.01] active:scale-95"
          >
            <Eye className="w-4.5 h-4.5" />
            <span>Kuzatish Oynasi</span>
          </button>

          <button
            onClick={() => setActiveTab('home')}
            className="w-full py-3 px-6 rounded-2xl border border-restaurant-border bg-restaurant-card hover:bg-[#1A1A1D] text-restaurant-text-secondary font-semibold text-xs transition-all duration-200"
          >
            Bosh sahifaga qaytish
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 animate-fade-in pb-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setActiveTab('cart')}
          className="p-2 rounded-xl border border-restaurant-border bg-restaurant-card text-restaurant-text-secondary hover:text-restaurant-text-primary transition-all active:scale-95"
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div>
          <span className="text-[9px] uppercase tracking-[0.2em] text-restaurant-gold font-bold">Buyurtma berish</span>
          <h2 className="font-serif font-semibold text-xl text-restaurant-text-primary mt-0.5">
            Rasmiylashtirish <span className="gold-gradient-text">Bo'limi</span>
          </h2>
        </div>
      </div>

      <form onSubmit={handleSubmitOrder} className="flex flex-col gap-4">
        {/* Table Selector Card */}
        <div className="rounded-2xl border border-restaurant-border bg-restaurant-card p-5 flex flex-col gap-3.5 gold-border-glow">
          <h3 className="font-serif font-semibold text-sm text-restaurant-gold">
            🪑 Stol Raqamini Tanlash
          </h3>
          
          {tableNumber ? (
            <div className="flex items-center justify-between p-3 rounded-xl border border-restaurant-gold/20 bg-restaurant-gold/5 mt-1">
              <span className="text-xs text-restaurant-text-secondary">QR kod orqali aniqlangan stol:</span>
              <span className="font-sans font-bold text-sm text-restaurant-gold">Stol №{tableNumber}</span>
            </div>
          ) : (
            <div className="mt-1">
              <label className="block text-[10px] text-restaurant-text-secondary uppercase tracking-widest mb-1.5 font-semibold">
                Stolni Tanlang
              </label>
              {tables.length > 0 ? (
                <div className="grid grid-cols-5 gap-2 max-h-[140px] overflow-y-auto pr-1">
                  {tables.map((t) => (
                    <button
                      key={t._id}
                      type="button"
                      onClick={() => {
                        setSelectedTable(t.tableNumber);
                        setTableNumber(t.tableNumber);
                      }}
                      className={`py-2 px-1 rounded-xl text-xs font-semibold border transition-all ${
                        selectedTable === t.tableNumber
                          ? 'border-restaurant-gold bg-restaurant-gold/15 text-restaurant-gold shadow-md'
                          : 'border-restaurant-border bg-[#0B0B0C] text-restaurant-text-secondary hover:border-restaurant-text-secondary/35'
                      }`}
                    >
                      {t.tableNumber}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-restaurant-text-secondary text-center py-4">
                  Hozirda stollar mavjud emas. Admin panel orqali stol qo'shing.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Customer Detail Card */}
        <div className="rounded-2xl border border-restaurant-border bg-restaurant-card p-5 flex flex-col gap-3.5 gold-border-glow">
          <h3 className="font-serif font-semibold text-sm text-restaurant-gold">
            👤 Mijoz Ma'lumotlari
          </h3>
          <div className="text-xs space-y-2">
            <div className="flex justify-between p-1">
              <span className="text-restaurant-text-secondary">Ismingiz:</span>
              <span className="font-semibold text-restaurant-text-primary">
                {telegramUser?.firstName || 'Mehmon'}
              </span>
            </div>
            {telegramUser?.username && (
              <div className="flex justify-between p-1">
                <span className="text-restaurant-text-secondary">Telegram:</span>
                <span className="font-semibold text-restaurant-text-primary">
                  @{telegramUser.username}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Comments/Wishes */}
        <div className="rounded-2xl border border-restaurant-border bg-restaurant-card p-5 flex flex-col gap-3.5 gold-border-glow">
          <h3 className="font-serif font-semibold text-sm text-restaurant-gold">
            ✍️ Qo'shimcha Izohlar (Ixtiyoriy)
          </h3>
          <textarea
            placeholder="Masalan: shakar solinmasin, muz ko'proq bo'lsin..."
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            className="w-full bg-[#0B0B0C] border border-restaurant-border focus:border-restaurant-gold/50 rounded-xl p-3 text-xs text-restaurant-text-primary focus:outline-none min-h-[70px] resize-none leading-relaxed transition-all placeholder-restaurant-text-secondary/50"
          />
        </div>

        {/* Total Cost Display & Submit */}
        <div className="rounded-2xl border border-restaurant-border bg-restaurant-card p-5 flex flex-col gap-4 mt-1 gold-border-glow">
          <div className="flex justify-between items-center text-sm font-semibold">
            <span className="text-restaurant-text-secondary font-serif">To'lov Summasi:</span>
            <span className="text-restaurant-gold text-base font-bold">
              {totalPrice.toLocaleString('uz-UZ')} so'm
            </span>
          </div>

          <button
            type="submit"
            disabled={loading || cartItems.length === 0}
            className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-restaurant-gold hover:bg-restaurant-gold-dark text-[#0B0B0C] font-bold tracking-wide text-sm transition-all duration-300 gold-button-glow hover:scale-[1.01] active:scale-95 disabled:opacity-40 disabled:pointer-events-none"
          >
            {loading ? 'Yuborilmoqda...' : 'Tasdiqlash va Yuborish'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
