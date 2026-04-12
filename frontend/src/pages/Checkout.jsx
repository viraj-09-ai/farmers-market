import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Checkout() {
  // Using your custom hooks for clean context access
  const { cart, setCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [isProcessing, setIsProcessing] = useState(false);
  const [done, setDone] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cod");

  // Smarter calculation that accounts for quantity (defaults to 1 if missing)
  const subtotal = cart.reduce((acc, item) => acc + item.price * (item.quantity || 1), 0);
  const deliveryFee = subtotal > 0 ? 50 : 0;
  const total = subtotal + deliveryFee;

  const placeOrder = async () => {
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    setIsProcessing(true);

    // Prepare data exactly how your Flask backend expects it
    const orderData = {
      items: JSON.stringify(cart),
      total: total,
      user: user?.name || user?.email || "Guest User",
      status: "Placed"
    };

    try {
      // Send directly to the backend so it shows up in Orders.jsx!
      const res = await fetch("https://farmer-backend-r490.onrender.com/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(orderData)
      });

      if (res.ok) {
        // Simulate a slight delay for a premium "processing" feel
        setTimeout(() => {
          setCart([]); // Clear the cart
          setDone(true);
          setIsProcessing(false);
        }, 1200);
      } else {
        alert("Failed to place order. Please try again.");
        setIsProcessing(false);
      }
    } catch (err) {
      console.error(err);
      alert("Server error. Please check your connection.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-6 md:p-12 flex items-center justify-center">
      <div className="max-w-2xl w-full">
        
        {done ? (
          
          /* 🎉 SUCCESS STATE */
          <div className="bg-white/70 backdrop-blur-xl border border-white/60 p-10 md:p-16 rounded-[3rem] shadow-2xl text-center transition-all duration-500 animate-fade-in-up">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner border border-green-200">
              <span className="text-5xl">✅</span>
            </div>
            <h1 className="text-4xl font-black text-gray-800 mb-2">Order Confirmed!</h1>
            <p className="text-gray-500 mb-8 text-lg">
              Thank you, {user?.name || "Customer"}! Your fresh produce is being prepared.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button 
                onClick={() => navigate("/orders")}
                className="bg-green-600 text-white font-bold px-8 py-4 rounded-2xl shadow-lg hover:bg-green-700 transition-colors"
              >
                Track Order
              </button>
              <button 
                onClick={() => navigate("/")}
                className="bg-gray-100 text-gray-700 font-bold px-8 py-4 rounded-2xl border border-gray-200 hover:bg-gray-200 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </div>

        ) : (

          /* 🛒 CHECKOUT STATE */
          <div className="bg-white/60 backdrop-blur-2xl border border-white/60 shadow-2xl rounded-[2.5rem] overflow-hidden">
            
            <div className="p-8 md:p-12">
              <h1 className="text-3xl font-black text-gray-800 mb-2">Secure Checkout 🔒</h1>
              <p className="text-gray-500 mb-8 font-medium">Review your items and complete your purchase.</p>

              {/* Order Summary Box */}
              <div className="bg-white/80 rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
                <h3 className="font-bold text-gray-700 mb-4 border-b border-gray-100 pb-2">Order Summary</h3>
                <div className="max-h-40 overflow-y-auto pr-2 space-y-3 mb-4 custom-scrollbar">
                  {cart.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center">
                      <span className="text-gray-600 font-medium truncate pr-4">
                        {item.quantity || 1}x {item.name}
                      </span>
                      <span className="text-gray-800 font-bold">₹{item.price * (item.quantity || 1)}</span>
                    </div>
                  ))}
                </div>
                
                <div className="space-y-2 pt-4 border-t border-gray-100">
                  <div className="flex justify-between text-gray-500 text-sm">
                    <span>Subtotal</span>
                    <span>₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between text-gray-500 text-sm">
                    <span>Delivery</span>
                    <span>₹{deliveryFee}</span>
                  </div>
                  <div className="flex justify-between items-end pt-2">
                    <span className="font-bold text-gray-700">Total</span>
                    <span className="text-3xl font-black text-green-600">₹{total}</span>
                  </div>
                </div>
              </div>

              {/* Payment Methods (UI Only - gives a premium feel) */}
              <div className="mb-10">
                <h3 className="font-bold text-gray-700 mb-3">Payment Method</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div 
                    onClick={() => setPaymentMethod("cod")}
                    className={`cursor-pointer p-4 rounded-xl border-2 transition-all text-center font-bold ${paymentMethod === "cod" ? "border-green-500 bg-green-50 text-green-700" : "border-gray-200 bg-white/50 text-gray-500 hover:border-green-200"}`}
                  >
                    💵 Cash on Delivery
                  </div>
                  <div 
                    onClick={() => setPaymentMethod("upi")}
                    className={`cursor-pointer p-4 rounded-xl border-2 transition-all text-center font-bold ${paymentMethod === "upi" ? "border-green-500 bg-green-50 text-green-700" : "border-gray-200 bg-white/50 text-gray-500 hover:border-green-200"}`}
                  >
                    📱 UPI / Wallet
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button 
                onClick={placeOrder}
                disabled={isProcessing || cart.length === 0}
                className="w-full bg-gray-900 hover:bg-black text-white font-black py-5 rounded-2xl transition-all duration-300 transform active:scale-[0.98] shadow-xl shadow-gray-900/20 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-3 text-lg"
              >
                {isProcessing ? (
                  <>
                    <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing Payment...
                  </>
                ) : (
                  `Pay ₹${total}`
                )}
              </button>

              <p className="text-center text-xs text-gray-400 mt-6 font-medium">
                🔒 256-bit encrypted secure checkout. Your data is safe.
              </p>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}