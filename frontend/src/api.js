const API = "http://127.0.0.1:5000";

export const registerUser = async (data) => {
  const res = await fetch(`${API}/register`, {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify(data)
  });
  return res.json();
};

export const loginUser = async (data) => {
  const res = await fetch(`${API}/login`, {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify(data)
  });
  return res.json();
};

export const getProducts = async () => {
  const res = await fetch(`${API}/products`);
  return res.json();
};