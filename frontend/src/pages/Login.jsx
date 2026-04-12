import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });
  
  // Added loading state for a premium UX
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      alert("Please fill in all fields.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("https://farmer-backend-r490.onrender.com/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (data.success) {
        // ✅ save user from backend
        login(data.user);

        // ✅ Using React Router for instant transition without hard reloading
        navigate("/");
      } else {
        alert("Invalid credentials. Please try again.");
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
            <h2 className="text-4xl font-black text-gray-800 tracking-tight">Welcome Back 👋</h2>
            <p className="text-gray-500 mt-2 font-medium">Log in to access the Farmer Market.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Email Input */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1 ml-1">Email Address</label>
              <input 
                required
                type="email"
                className="w-full px-5 py-3 rounded-2xl bg-white/60 border border-white/80 focus:bg-white focus:ring-4 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all placeholder-gray-400 shadow-sm"
                placeholder="john@example.com"
                value={form.email}
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
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
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
                  Authenticating...
                </>
              ) : (
                "Log In"
              )}
            </button>

          </form>

          {/* Link to Register */}
          <p className="mt-8 text-center text-gray-600 font-medium">
            Don't have an account yet?{" "}
            <Link to="/register" className="text-green-600 font-bold hover:underline">
              Register here
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}