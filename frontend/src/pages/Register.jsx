import { useState } from "react";
import { useNavigate } from "react-router-dom";
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

 const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await fetch("http://127.0.0.1:5000/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(form)
    });

    const data = await res.json();

    if (data.success) {
      alert("Registered Successfully");
      navigate("/login");
    }

  } catch (err) {
    alert("Server error");
  }
};

  return (
    <div className="p-10 max-w-md mx-auto bg-white shadow rounded">

      <h2 className="text-2xl font-bold mb-4">Register</h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        <input className="w-full p-2 border"
          placeholder="Name"
          onChange={(e)=>setForm({...form, name:e.target.value})}
        />

        <input className="w-full p-2 border"
          placeholder="Email"
          onChange={(e)=>setForm({...form, email:e.target.value})}
        />

        <input className="w-full p-2 border"
          type="password"
          placeholder="Password"
          onChange={(e)=>setForm({...form, password:e.target.value})}
        />

        <select className="w-full p-2 border"
          onChange={(e)=>setForm({...form, role:e.target.value})}
        >
          <option value="user">User</option>
          <option value="farmer">Farmer</option>
          <option value="admin">Admin</option>
        </select>

        <button className="bg-green-500 text-white w-full py-2">
          Register
        </button>

      </form>

    </div>
  );
}