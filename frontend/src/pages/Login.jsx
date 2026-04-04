import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {

  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

 const handleSubmit = async (e) => {
  e.preventDefault();

  if (!form.email || !form.password) {
    alert("Fill all fields");
    return;
  }

  try {
    const res = await fetch("http://127.0.0.1:5000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(form)
    });

    const data = await res.json();

    if (data.success) {
      alert("Login Successful");

      // ✅ save user from backend
      login(data.user);

      window.location.href = "/";
    } else {
      alert("Invalid credentials");
    }

  } catch (err) {
    alert("Server error");
    console.log(err);
  }
};

  return (
    <div className="p-10 max-w-md mx-auto bg-white shadow rounded">

      <h2 className="text-2xl font-bold mb-4">Login</h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          className="w-full p-2 border"
          placeholder="Email"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <input
          className="w-full p-2 border"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        <button className="bg-green-500 text-white w-full py-2">
          Login
        </button>

      </form>

    </div>
  );
}