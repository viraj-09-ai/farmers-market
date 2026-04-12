import { useCart } from "../context/CartContext";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Cart() {
  const { cart, removeItem, increaseQty, decreaseQty, user } = useCart();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      alert("Your cart is empty");
      return;
    }

    setIsProcessing(true);

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
      description: "Secure Order Payment",
      prefill: {
        name: user?.name || "Customer",
        email: user?.email || "customer@example.com"
      },
      theme: {
        color: "#16a34a" // Matching our UI's green-600
      },
      handler: async (response) => {
        // ✅ PAYMENT SUCCESS - NOW SAVE ORDER
        try {
          const res = await fetch("https://farmer-backend-r490.onrender.com/place-order", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              items: cart,
              total: totalAmount,
              user: user?.name || user?.email || "Guest User"
            })
          });

          const data = await res.json();

          if (data.success) {
            alert("🎉 Payment Successful! Order Placed.");
            // Instead of a jarring reload, we navigate them to their orders page!
            window.location.href = "/orders"; 
          } else {
            alert("Payment succeeded, but order save failed. Contact support.");
            setIsProcessing(false);
          }
        } catch (err) {
          alert("Server error while saving order");
          setIsProcessing(false);
        }
      },
      modal: {
        ondismiss: () => {
          setIsProcessing(false);
        }
      }
    };

    try {
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      alert("Payment system error. Please check your connection.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-6 md:p-12">
      <div className="max-w-5xl mx-auto">

        {/* 🏷️ Header */}
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-4xl font-black text-gray-800 flex justify-center md:justify-start items-center gap-3">
            🛒 Your Cart 
            {cart.length > 0 && (
              <span className="text-green-600 text-2xl font-bold bg-green-100 px-3 py-1 rounded-full">
                {cart.length}
              </span>
            )}
          </h1>
          <p className="text-gray-500 mt-2 font-medium">Review your items before secure checkout.</p>
        </div>

        {cart.length === 0 ? (
          
          /* --- EMPTY STATE --- */
          <div className="bg-white/50 backdrop-blur-md border-2 border-dashed border-gray-300 rounded-[3rem] p-16 md:p-24 text-center shadow-sm">
            <div className="text-6xl mb-4">🧺</div>
            <h2 className="text-2xl font-bold text-gray-600">Your cart is empty</h2>
            <p className="text-gray-500 mt-2 mb-6 max-w-md mx-auto">
              Looks like you haven't added any fresh produce yet. Discover what our local farmers have to offer!
            </p>
            <Link 
              to="/"
              className="inline-block bg-green-600 text-white font-bold px-8 py-3 rounded-2xl shadow-lg shadow-green-200 hover:bg-green-700 hover:-translate-y-1 transition-all duration-300"
            >
              Start Shopping
            </Link>
          </div>

        ) : (
          
          /* --- CART CONTENT --- */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            
            {/* 📦 Items List (Takes up 2/3 of space on desktop) */}
            <div className="lg:col-span-2 space-y-5">
              {cart.map(item => (
                <div
                  key={item.id}
                  className="bg-white/70 backdrop-blur-xl border border-white/60 p-4 sm:p-5 rounded-3xl shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col sm:flex-row items-center gap-5 sm:gap-6"
                >
                  {/* IMAGE & DETAILS */}
                  <div className="flex items-center gap-5 w-full sm:w-auto flex-1">
                    <img
                      src={item.image ? `https://farmer-backend-r490.onrender.com/uploads/${item.image}` : "https://via.placeholder.com/80?text=Produce"}
                      onError={(e) => e.target.src = "https://via.placeholder.com/80?text=Produce"}
                      alt={item.name}
                      className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-2xl shadow-inner border border-gray-100"
                    />
                    <div>
                      <h2 className="font-black text-xl text-gray-800">{item.name}</h2>
                      <p className="text-gray-400 text-sm italic mb-1">{item.category || "Fresh Produce"}</p>
                      <p className="text-green-600 font-black text-lg">₹ {item.price}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between w-full sm:w-auto gap-6 sm:gap-8 border-t sm:border-t-0 border-gray-100 pt-4 sm:pt-0">
                    
                    {/* QUANTITY CONTROLS */}
                    <div className="flex items-center bg-gray-100/80 p-1.5 rounded-2xl border border-gray-200">
                      <button
                        onClick={() => decreaseQty(item.id)}
                        className="w-8 h-8 flex items-center justify-center bg-white text-gray-600 rounded-xl shadow-sm hover:bg-gray-200 font-bold transition-colors"
                      >
                        -
                      </button>
                      <span className="font-bold text-gray-800 w-8 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => increaseQty(item.id)}
                        className="w-8 h-8 flex items-center justify-center bg-green-500 text-white rounded-xl shadow-sm hover:bg-green-600 font-bold transition-colors"
                      >
                        +
                      </button>
                    </div>

                    {/* ITEM TOTAL & REMOVE */}
                    <div className="flex flex-col items-end gap-1">
                      <p className="font-black text-xl text-green-700">
                        ₹ {item.price * item.quantity}
                      </p>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-red-400 hover:text-red-600 text-xs font-bold uppercase tracking-widest transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 💰 Checkout Summary (Sticky on Desktop) */}
            <div className="lg:col-span-1">
              <div className="bg-gray-900 text-white rounded-[2.5rem] p-8 sticky top-10 shadow-2xl shadow-green-900/20">
                <h2 className="text-2xl font-bold mb-6 border-b border-gray-700 pb-4">Order Summary</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-400 font-medium">
                    <span>Subtotal</span>
                    <span className="text-white font-bold">₹ {total}</span>
                  </div>
                  <div className="flex justify-between text-gray-400 font-medium">
                    <span>Taxes & Fees</span>
                    <span className="text-white font-bold">Included</span>
                  </div>
                  <div className="pt-6 border-t border-gray-700 flex justify-between items-end">
                    <span className="text-lg text-gray-300">Total</span>
                    <span className="text-4xl font-black text-green-400">₹ {total}</span>
                  </div>
                </div>

                {/* ✅ RAZORPAY CHECKOUT BUTTON */}
                <button
                  onClick={handlePlaceOrder}
                  disabled={isProcessing}
                  className="w-full bg-green-500 hover:bg-green-400 text-black font-black py-4 rounded-2xl transition-all duration-300 transform active:scale-95 shadow-xl shadow-green-500/20 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2 text-lg"
                >
                  {isProcessing ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Connecting to Razorpay...
                    </>
                  ) : (
                    <>🔒 Pay Securely</>
                  )}
                </button>

                <div className="mt-6 text-center">
                  <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-2">
                    Secured By
                  </p>
                  <div className="flex justify-center items-center gap-2 text-gray-400 font-bold">
                    <span className="px-2 py-1 bg-gray-800 rounded">Razorpay</span>
                    <span className="px-2 py-1 bg-gray-800 rounded">UPI</span>
                    <span className="px-2 py-1 bg-gray-800 rounded">Cards</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}