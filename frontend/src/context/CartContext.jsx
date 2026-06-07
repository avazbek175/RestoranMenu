import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(undefined);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [tableNumber, setTableNumber] = useState(null);
  const [telegramUser, setTelegramUser] = useState(null);
  const [activeOrder, setActiveOrder] = useState(null);
  const [toasts, setToasts] = useState([]);

  // Toast Notification Helper
  const showToast = (message, type = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  // Check URL parameters and Telegram WebApp integration
  useEffect(() => {
    // 1. Detect table number from query params (e.g. ?table=5)
    const params = new URLSearchParams(window.location.search);
    const tableParam = params.get('table');
    if (tableParam) {
      setTableNumber(parseInt(tableParam, 10));
      showToast(`Stol №${tableParam} aniqlandi`, 'info');
    }

    // 2. Fetch Telegram WebApp SDK data
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();
      tg.expand();
      
      // Customize Telegram Theme colors
      tg.setHeaderColor('#0B0B0C');
      tg.setBackgroundColor('#0B0B0C');

      const user = tg.initDataUnsafe?.user;
      if (user) {
        setTelegramUser({
          telegramId: user.id.toString(),
          firstName: user.first_name,
          username: user.username || '',
        });
      } else {
        setTelegramUser({
          telegramId: 'WEB_USER',
          firstName: 'Mehmon',
          username: 'mehmon',
        });
      }
    } else {
      setTelegramUser({
        telegramId: 'OFFLINE_USER',
        firstName: 'Mehmon',
        username: 'mehmon',
      });
    }
  }, []);

  const addToCart = (food) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item._id === food._id);
      if (existingItem) {
        showToast(`"${food.name}" miqdori oshirildi`);
        return prevItems.map((item) =>
          item._id === food._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      showToast(`"${food.name}" savatga qo'shildi`);
      return [...prevItems, { ...food, quantity: 1 }];
    });
  };

  const removeFromCart = (foodId) => {
    setCartItems((prevItems) => {
      const item = prevItems.find((i) => i._id === foodId);
      if (item) {
        showToast(`"${item.name}" savatdan o'chirildi`, 'warning');
      }
      return prevItems.filter((item) => item._id !== foodId);
    });
  };

  const updateQuantity = (foodId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(foodId);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item._id === foodId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalPrice,
        tableNumber,
        setTableNumber,
        telegramUser,
        activeOrder,
        setActiveOrder,
        toasts,
        showToast,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
