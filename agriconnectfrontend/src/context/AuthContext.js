// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Load user from localStorage safely
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("currentUser")) || null;
    } catch (error) {
      console.error("Error parsing user from localStorage:", error);
      return null;
    }
  });

  const [isAuthenticated, setIsAuthenticated] = useState(!!user);

  // Keep localStorage in sync when user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("currentUser", JSON.stringify(user));
      setIsAuthenticated(true);
    } else {
      localStorage.removeItem("currentUser");
      setIsAuthenticated(false);
    }
  }, [user]);

  // Login and logout helpers
  const login = (userData) => {
    console.log("AuthContext login called with:", userData);
    setUser(userData);
  };

  const logout = () => {
    console.log("AuthContext logout called");
    setUser(null);
  };

  // This function properly updates the user state
  const updateUser = (updatedUserData) => {
    console.log("AuthContext updateUser called with:", updatedUserData);
    setUser(prevUser => {
      const newUser = {
        ...prevUser,
        ...updatedUserData
      };
      console.log("New user state:", newUser);
      return newUser;
    });
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated,
      login, 
      logout, 
      setUser: updateUser  // This is the key fix!
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to consume the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};