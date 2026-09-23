import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("fieldnote_token");
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .get("/auth/me")
      .then((res) => setUser({ ...res.data, profileImage: res.data.profileImage || "" }))
      .catch(() => localStorage.removeItem("fieldnote_token"))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    localStorage.setItem("fieldnote_token", data.token);
    setUser({ ...data, profileImage: data.profileImage || "" });
    return data;
  };

  const register = async (payload) => {
    if (payload.profileImageFile) {
      const fd = new FormData();
      fd.append("name", payload.name);
      fd.append("email", payload.email);
      fd.append("password", payload.password);
      fd.append("role", payload.role);
      if (payload.company) fd.append("company", JSON.stringify(payload.company));
      fd.append("profileImage", payload.profileImageFile);

      const { data } = await api.post("/auth/register", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      localStorage.setItem("fieldnote_token", data.token);
      setUser({ ...data, profileImage: data.profileImage || "" });
      return data;
    }

    const { data } = await api.post("/auth/register", payload);
    localStorage.setItem("fieldnote_token", data.token);
    setUser({ ...data, profileImage: data.profileImage || "" });
    return data;
  };

  const logout = () => {
    localStorage.removeItem("fieldnote_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
