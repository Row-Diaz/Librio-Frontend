import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const localCart = localStorage.getItem("cart");
      return localCart ? JSON.parse(localCart) : [];
    } catch (error) {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(cart));
    } catch (error) {
      // Error silencioso al guardar en localStorage
    }
  }, [cart]);

  const addToCart = useCallback((product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, count: item.count + 1 } : item
        );
      } else {
        return [...prevCart, { ...product, count: 1 }];
      }
    });
  }, []);

  const increaseQuantity = useCallback((id) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id ? { ...item, count: item.count + 1 } : item
      )
    );
  }, []);

  const decreaseQuantity = useCallback((id) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.id === id ? { ...item, count: item.count - 1 } : item
        )
        .filter((item) => item.count > 0)
    );
  }, []);

  const calculateTotal = useCallback(() => {
    return cart.reduce((acc, item) => acc + (item.precio || 0) * item.count, 0);
  }, [cart]); 

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const obtenerCantidadTotalCarrito = useCallback(() => {
    return cart.reduce((total, item) => total + item.count, 0);
  }, [cart]);

  const contextValue = {
    cart,
    addToCart,
    increaseQuantity,
    decreaseQuantity,
    calculateTotal, 
    clearCart,
    obtenerCantidadTotalCarrito,
  };

  return (
    <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
  );
};

export const useCart = () => {
  return useContext(CartContext);
};
