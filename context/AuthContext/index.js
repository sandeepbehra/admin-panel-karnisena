"use client";

import {
  createContext,
  useContext,
  useState,
} from "react";

const AuthContext = createContext(null);

const TOKEN_KEY = "karni_admin_token";
const SESSION_KEY = "karni_admin_session";
const USER_KEY = "karni_admin_user";

function getStoredAuth() {
  if (typeof window === "undefined") {
    return {
      token: null,
      sessionId: null,
      user: null,
    };
  }

  try {
    const token =
      localStorage.getItem(TOKEN_KEY);

    const sessionId =
      localStorage.getItem(SESSION_KEY);

    const savedUser =
      localStorage.getItem(USER_KEY);

    const user = savedUser
      ? JSON.parse(savedUser)
      : null;

    if (
      token &&
      sessionId &&
      user?.role?.key === "ADMIN"
    ) {
      return {
        token,
        sessionId,
        user,
      };
    }
  } catch (error) {
    console.error(
      "Auth restore error:",
      error
    );
  }

  return {
    token: null,
    sessionId: null,
    user: null,
  };
}

function clearStorage() {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(USER_KEY);
}

export function AuthProvider({
  children,
}) {
  const [auth, setAuth] = useState(
    getStoredAuth
  );

  const login = ({
    token,
    sessionId,
    userData,
  }) => {
    if (
      !token ||
      !sessionId ||
      !userData
    ) {
      throw new Error(
        "Invalid authentication data."
      );
    }

    if (
      userData?.role?.key !== "ADMIN"
    ) {
      throw new Error(
        "Admin access required."
      );
    }

    localStorage.setItem(
      TOKEN_KEY,
      token
    );

    localStorage.setItem(
      SESSION_KEY,
      sessionId
    );

    localStorage.setItem(
      USER_KEY,
      JSON.stringify(userData)
    );

    setAuth({
      token,
      sessionId,
      user: userData,
    });
  };

  const logout = () => {
    clearStorage();

    setAuth({
      token: null,
      sessionId: null,
      user: null,
    });
  };

  const isLoggedIn =
    Boolean(auth.token) &&
    Boolean(auth.sessionId) &&
    auth.user?.role?.key === "ADMIN";

  return (
    <AuthContext.Provider
      value={{
        token: auth.token,
        sessionId: auth.sessionId,
        user: auth.user,

        isLoggedIn,

        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}