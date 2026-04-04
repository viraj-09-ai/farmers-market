import { useCart } from "../context/CartContext";

export default function Cart() {
  const { cart, removeItem, increaseQty, decreaseQty, user } = useCart();

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      alert("Cart is empty");
      return;
    }

    const totalAmount = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // 🔥 RAZORPAY PAYMENT
    const options = {
      key: "rzp_test_SYjsjqKYXvZ8Y4",
      amount: totalAmount * 100,
      currency: "INR",
      name: "Farmer Market",
      description: "Order Payment",
      prefill: {
        name: user?.name || "Customer",
        email: user?.email || "customer@example.com"
      },
      theme: {
        color: "#22c55e"
      },
      handler: async (response) => {
        // ✅ PAYMENT SUCCESS - NOW SAVE ORDER
        try {
          const res = await fetch("http://127.0.0.1:5000/place-order", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              items: cart,
              total: totalAmount,
              user: user?.name
            })
          });

          const data = await res.json();

          if (data.success) {
            alert("Payment Successful! Order Placed ✅");
            window.location.reload();
          } else {
            alert("Order save failed");
          }
        } catch (err) {
          alert("Server error while saving order");
        }
      },
      modal: {
        ondismiss: () => {
          alert("Payment cancelled");
        }
      }
    };

    try {
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      alert("Payment system error");
    }
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">

      <h1 className="text-3xl font-bold mb-8 text-center">
        🛒 Your Cart
      </h1>

      {cart.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">
          Your cart is empty 😢
        </p>
      ) : (
        <>
          <div className="space-y-6">

            {cart.map(item => (
              <div
                key={item.id}
                className="bg-white p-5 rounded-xl shadow-md hover:shadow-xl transition flex items-center justify-between"
              >

                {/* LEFT */}
                <div className="flex items-center gap-4">
                  <img
                    src={item.image ? `http://127.0.0.1:5000/uploads/${item.image}` : "https://via.placeholder.com/80"}
                    onError={(e) => e.target.src = "https://via.placeholder.com/80"}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />

                  <div>
                    <h2 className="font-bold text-lg">{item.name}</h2>
                    <p className="text-green-600 font-semibold">
                      ₹ {item.price}
                    </p>
                  </div>
                </div>

                {/* CENTER */}
                <div className="flex items-center gap-3 bg-gray-100 px-3 py-1 rounded-lg">
                  <button
                    onClick={() => decreaseQty(item.id)}
                    className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
                  >
                    ➖
                  </button>

                  <span className="font-bold text-lg">
                    {item.quantity}
                  </span>

                  <button
                    onClick={() => increaseQty(item.id)}
                    className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    ➕
                  </button>
                </div>

                {/* RIGHT */}
                <div className="flex items-center gap-6">
                  <p className="font-bold text-lg text-green-600">
                    ₹ {item.price * item.quantity}
                  </p>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-500 text-xl hover:scale-110 transition"
                  >
                    ❌
                  </button>
                </div>

              </div>
            ))}

          </div>

          {/* TOTAL */}
          <div className="mt-10 bg-white p-6 rounded-xl shadow-lg flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold">Total Amount</h2>
              <p className="text-gray-500 text-sm">
                Inclusive of all taxes
              </p>
            </div>

            <h2 className="text-2xl font-bold text-green-600">
              ₹ {total}
            </h2>
          </div>

          {/* ✅ CHECKOUT BUTTON (CONNECTED) */}
          <div className="mt-6 text-center">
            <button
              onClick={handlePlaceOrder}
              className="bg-green-500 text-white px-8 py-3 rounded-lg text-lg hover:bg-green-600 transition"
            >
              💳 Pay Now
            </button>
          </div>

        </>
      )}

    </div>
  );
}