import { useState, useCallback } from "react";
import { api } from "./config";
// Updated import path to the correct location

const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  const fetchSignOut = useCallback(async (input) => {
    try {
      setLoading(true);

      const response = await api.post("/auth/logout", input);
      setLoading(false);
      return response.data;
    } catch (error) {
      console.error("Error signing out:", error);
      setError(error);
      setLoading(false);
    }
  }, []);


  const fetchSignIn = useCallback(async (input) => {
    try {
      setLoading(true);

      const response = await api.post("/auth/authenticate", input);
      setLoading(false);

      return response.data;
    } catch (error) {
      console.error("Error signing in:", error);
      setError(error);
      setLoading(false);
      return error;
    }
  }, []);

	  const fetchRegister = useCallback(async (input) => {
    try {
      setLoading(true);

      const response = await api.post("/auth/register", input);
      setLoading(false);
      
      return response.data;
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  }, []);

  	  const changePassword = useCallback(async input => {
        try {
          setLoading(true);

          const response = await api.post("/auth/change-password", input);
          setLoading(false);

          return response.data;
        } catch (error) {
          setError(error);
          setLoading(false);
        }
      }, []);
  return {
    loading,
    error,
    fetchSignIn,
    fetchSignOut,
    fetchRegister,
    changePassword,
  };
};

export default useAuth;
