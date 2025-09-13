import { useState, useCallback } from "react";
import { api } from "./config";
// Updated import path to the correct location

const useRoles = () => {
  const [roles, setRoles] = useState();
	const [loading, setLoading] = useState(false);	
	const [error, setError] = useState(null);


  const getRoles = useCallback(async (filter = {}) => {
    try {
      setLoading(true);
      setError(null);

      // Clean empty values from the param object
      const response = await api.get("/roles", {
        params: {
          ...filter,
        },
      });

      setRoles(response.data.data);
			
      return response.data.data;
    } catch (error) {
      console.error("Error fetching roles:", error);
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);


  return {
		roles,	
		getRoles,
		loading,
		error,
  };
};

export default useRoles;
