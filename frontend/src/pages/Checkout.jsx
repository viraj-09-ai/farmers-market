import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";

export default function Checkout() {
  const { cart, setCart } = useContext(CartContext);
  const [done, setDone] = useState(false);

  const total = cart.reduce((s, i) => s + i.price, 0);

  const placeOrder = () => {
    const orders = JSON.parse(localStorage.getItem("orders")) || [];

    orders.push({
      id: Date.now(),
      items: cart,
      total,
    });

    localStorage.setItem("orders", JSON.stringify(orders));

    setCart([]);
    setDone(true);
  };

  return (
    <div className="p-4">

      {done ? (
        <h2>Order Placed ✅</h2>
      ) : (
        <>
          <h1>Checkout</h1>
          <h2>Total: ₹{total}</h2>

          <button onClick={placeOrder}>
            Place Order
          </button>
        </>
      )}

    </div>
  );
}