import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/userContext";
 

export const UseUserAuth = () => {
  const context = useContext(UserContext);
  const navigate = useNavigate();

  if (!context) {
    throw new Error("useUserAuth must be used within a UserProvider");
  }

  const { user, loading, clearUser } = context;

  useEffect(() => {
    if (loading) return;
    if (user) return;

    if (!user) {
      clearUser();
      navigate("/login");
    }
  }, []);
}
