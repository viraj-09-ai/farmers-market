import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export default function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/orders")
      .then(res => res.json())
      .then(data => setOrders(data));
  }, []);

  return (
    <div className="p-8 bg-gradient-to-br from-gray-100 to-gray-200 min-h-screen">

      <h1 className="text-4xl font-bold mb-10 text-center">
        📦 Your Orders
      </h1>

      {orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        orders.map((o) => (
          <div key={o.id} className="border p-4 mb-3">
            <p><b>Order ID:</b> {o.id}</p>
            <p><b>Total:</b> ₹ {o.total}</p>
            <p><b>Status:</b> {o.status}</p>
            {user?.role === "admin" && (
              <select
                value={o.status}
                onChange={async (e) => {
                  await fetch(`http://127.0.0.1:5000/update-status/${o.id}`, {
                    method: "PUT",
                    headers: {
                      "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                      status: e.target.value
                    })
                  });

                  alert("Status Updated ✅");
                  window.location.reload();
                }}
                className="border p-1 mt-2"
              >
                <option>Placed</option>
                <option>Shipped</option>
                <option>Delivered</option>
              </select>
            )}
          </div>
        ))
      )}

    </div>
  );
}