"use client";

import axios from "axios";
import Cookies from "js-cookie";
import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const UserContext = createContext();

export function UserProvider({ children }) {
  const router = useRouter();
  const [userState, setUserState] = useState({
    user: null,
    loading: true,
    error: null,
  });

  const fetchUser = async () => {
    try {
      setUserState((prev) => ({ ...prev, loading: true }));
      const token = Cookies.get("token");

      if (!token) {
        throw new Error("No token found");
      }

      const res = await axios.get("http://localhost:5000/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUserState({
        user: res.data,
        loading: false,
        error: null,
      });
    } catch (error) {
      setUserState({
        user: null,
        loading: false,
        error: error.response?.data?.message || "Not authenticated",
      });
    }
  };

  const loginUser = async (credentials) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        credentials
      );
      Cookies.set("token", res.data.token);
      await fetchUser(); // Refresh user data after login
      router.push("/");
    } catch (error) {
      console.log(error);
      
      throw error.response?.data?.message || "Login failed";
    }
  };

  const logoutUser = () => {
    Cookies.remove("token");
    setUserState({
      user: null,
      loading: false,
      error: null,
    });
    router.push("/register");
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider
      value={{ ...userState, loginUser, logoutUser, fetchUser }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
