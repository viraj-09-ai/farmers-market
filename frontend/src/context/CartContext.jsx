import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export default function CartProvider({ children }) {

  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState("");

  // 🔥 SAFE ORDERS STATE
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const res = await fetch("http://127.0.0.1:5000/orders");
      if (!res.ok) throw new Error("Failed to fetch orders");
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error("Unable to load orders", err);
    }
  };

  // ✅ PRODUCTS
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      const res = await fetch("http://127.0.0.1:5000/products");
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Unable to load products", err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  // ⭐ NEW: RATINGS STATE
  const [ratings, setRatings] = useState(() => {
    try {
      const data = localStorage.getItem("ratings");
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem("ratings", JSON.stringify(ratings));
  }, [ratings]);

  const [role, setRole] = useState("user");

  // 🔐 AUTH STATE
  const [user, setUser] = useState(() => {
    try {
      const data = localStorage.getItem("currentUser");
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    localStorage.setItem("currentUser", JSON.stringify(user));
  }, [user]);

  // ✅ REGISTER
  const register = (data) => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    users.push(data);
    localStorage.setItem("users", JSON.stringify(users));
  };

  // ✅ LOGIN
 const login = (email, password) => {
  const users = JSON.parse(localStorage.getItem("users")) || [];

  const found = users.find(
    u => u.email === email && u.password === password
  );

  if (found) {
    setUser(found);
    

    // ✅ IMPORTANT: force refresh UI
    localStorage.setItem("currentUser", JSON.stringify(found));

    return true;
  } else {
    return false;
  }
};

  // ✅ LOGOUT
  const logout = () => {
    setUser(null);
    setRole("user");
    localStorage.removeItem("currentUser");
  };

  // ✅ ADD TO CART
  const addToCart = (product) => {
    const existing = cart.find(item => item.id === product.id);

    if (existing) {
      setCart(
        cart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  // 🔥 INCREASE
  const increaseQty = (id) => {
    setCart(cart.map(item =>
      item.id === id
        ? { ...item, quantity: item.quantity + 1 }
        : item
    ));
  };

  // 🔥 DECREASE
  const decreaseQty = (id) => {
    setCart(
      cart.map(item =>
        item.id === id
          ? { ...item, quantity: item.quantity - 1 }
          : item
      ).filter(item => item.quantity > 0)
    );
  };

  // 🔥 REMOVE CART ITEM
  const removeItem = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  // 🔥 DELETE PRODUCT
  const deleteProduct = async (id) => {
    try {
      const res = await fetch(`http://127.0.0.1:5000/delete-product/${id}`, {
        method: "DELETE"
      });
      if (!res.ok) throw new Error("Failed to delete product");
      setProducts((prev) => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error("Unable to delete product", err);
      alert("Could not delete product");
    }
  };

  // 🔥 UPDATE PRODUCT
  const updateProduct = async (updatedProduct) => {
    try {
      const res = await fetch(`http://127.0.0.1:5000/update-product/${updatedProduct.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedProduct)
      });
      if (!res.ok) throw new Error("Failed to update product");
      setProducts((prev) =>
        prev.map((p) =>
          p.id === updatedProduct.id
            ? { ...p, ...updatedProduct }
            : p
        )
      );
    } catch (err) {
      console.error("Unable to update product", err);
      alert("Could not update product");
    }
  };

  // 🔥 PLACE ORDER
  const placeOrder = async () => {
    if (cart.length === 0) return;

    const newOrder = {
      items: cart,
      total: cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      ),
      date: new Date().toLocaleString(),
      status: "Placed",
      user_email: user?.email || "guest"
    };

    try {
      const res = await fetch("http://127.0.0.1:5000/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newOrder)
      });

      if (!res.ok) throw new Error("Failed to create order");
      await fetchOrders();
      setCart([]);
    } catch (err) {
      console.error("Could not place order", err);
      alert("Unable to place order");
    }
  };

 const updateOrderStatus = async (orderId) => {
  try {
    const res = await fetch(`http://127.0.0.1:5000/update-order/${orderId}`, {
      method: "POST"
    });
    if (!res.ok) throw new Error("Failed to update order status");
    await fetchOrders();
  } catch (err) {
    console.error("Unable to update order status", err);
    alert("Could not update order status");
  }
};



  // ✅ ADD PRODUCT
  const addProduct = (product) => {
    setProducts((prev) => [
      ...prev,
      {
        ...product,
        id: Date.now(),
        seller: user?.name || "Farmer"
      }
    ]);
  };

  // ❤️ WISHLIST
  const [wishlist, setWishlist] = useState(() => {
    try {
      const data = localStorage.getItem("wishlist");
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  const toggleWishlist = (product) => {
    const exists = wishlist.find(item => item.id === product.id);
    if (exists) {
      setWishlist(wishlist.filter(item => item.id !== product.id));
    } else {
      setWishlist([...wishlist, product]);
    }
  };

  // ⭐ ADD RATING FUNCTION
  const addRating = (productId, value) => {
    setRatings((prev) => {
      const existing = prev[productId] || [];

      return {
        ...prev,
        [productId]: [...existing, value]
      };
    });
  };

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      products,
      fetchProducts,
      addProduct,
      role,
      setRole,
      user,
      register,
      login,
      logout,
      search,
      setSearch,
      increaseQty,
      decreaseQty,
      removeItem,
      orders,
      placeOrder,
      deleteProduct,
      updateProduct,
      wishlist,
      toggleWishlist,
      updateOrderStatus,
      // ⭐ EXPORT
      ratings,
      addRating
    }}>
      {children}
    </CartContext.Provider>
  );
}