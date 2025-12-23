import React, { createContext, useContext, useState } from "react";

const CartContext = createContext(undefined);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);

  const addToCart = (item) => {
    setItems((prev) => {
      // Robust check for ID
      const itemId = item._id || item.id;
      const existing = prev.find((i) => (i._id || i.id) === itemId);

      if (existing) {
        return prev.map((i) =>
          (i._id || i.id) === itemId ? { ...i, quantity: i.quantity + (item.quantity || 1) } : i
        );
      }
      return [...prev, { ...item, quantity: item.quantity || 1 }];
    });
  };

  const removeFromCart = (id) => {
    setItems((prev) => prev.filter((i) => (i._id || i.id) !== id));
  };

  const updateQuantity = (id, delta) => {
    setItems((prev) =>
      prev.map((item) => {
        if ((item._id || item.id) === id) {
          const newQuantity = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  const updateItemNote = (id, note) => {
    setItems((prev) =>
      prev.map((item) =>
        (item._id || item.id) === id ? { ...item, note } : item
      )
    );
  };

  const clearCart = () => setItems([]);

  const cartTotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        updateItemNote,
        clearCart,
        cartTotal,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};
