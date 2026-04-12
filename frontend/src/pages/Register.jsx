import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user"
  });
  
  // Added loading state for better UX during backend calls
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("https://farmer-backend-r490.onrender.com/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (data.success) {
        alert("🎉 Registered Successfully!");
        navigate("/login");
      } else {
        alert(data.message || "Registration failed. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Server error. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-emerald-100 to-teal-50 p-6">
      
      {/* Glassmorphism Container */}
      <div className="w-full max-w-lg bg-white/40 backdrop-blur-2xl border border-white/60 shadow-2xl rounded-[2.5rem] p-8 sm:p-12 relative overflow-hidden">
        
        {/* Decorative background blur inside the card */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-green-400/30 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-emerald-400/30 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-black text-gray-800 tracking-tight">Join the Market 🌾</h2>
            <p className="text-gray-500 mt-2 font-medium">Create your account to get started.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Name Input */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1 ml-1">Full Name</label>
              <input 
                required
                className="w-full px-5 py-3 rounded-2xl bg-white/60 border border-white/80 focus:bg-white focus:ring-4 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all placeholder-gray-400 shadow-sm"
                placeholder="John Doe"
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1 ml-1">Email Address</label>
              <input 
                required
                type="email"
                className="w-full px-5 py-3 rounded-2xl bg-white/60 border border-white/80 focus:bg-white focus:ring-4 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all placeholder-gray-400 shadow-sm"
                placeholder="john@example.com"
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1 ml-1">Password</label>
              <input 
                required
                type="password"
                className="w-full px-5 py-3 rounded-2xl bg-white/60 border border-white/80 focus:bg-white focus:ring-4 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all placeholder-gray-400 shadow-sm"
                placeholder="••••••••"
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>

            {/* Role Selector */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1 ml-1">I am a...</label>
              <select 
                className="w-full px-5 py-3 rounded-2xl bg-white/60 border border-white/80 focus:bg-white focus:ring-4 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all shadow-sm font-medium text-gray-700 appearance-none cursor-pointer"
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                value={form.role}
              >
                <option value="user">🛒 Shopper (Buying Produce)</option>
                <option value="farmer">🚜 Farmer (Selling Produce)</option>
                <option value="admin">⚙️ Admin</option>
              </select>
            </div>

            {/* Submit Button */}
            <button 
              type="submit"
              disabled={isLoading}
              className="w-full mt-8 bg-green-600 hover:bg-green-700 text-white font-black py-4 rounded-2xl transition-all duration-300 transform active:scale-[0.98] shadow-lg shadow-green-600/30 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                "Create Account"
              )}
            </button>

          </form>

          {/* Link to Login */}
          <p className="mt-8 text-center text-gray-600 font-medium">
            Already have an account?{" "}
            <Link to="/login" className="text-green-600 font-bold hover:underline">
              Log in here
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}