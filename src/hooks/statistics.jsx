import { useState, useCallback } from "react";
import { api } from "./config";
// Updated import path to the correct location

const useStatistics = () => {
  const [statistics, setStatistics] = useState();
	const [loading, setLoading] = useState(false);	
	const [error, setError] = useState(null);


  const getStatistics = useCallback(async (filter = {}) => {
    try {
      setLoading(true);
      setError(null);

      // Clean empty values from the param object
      const response = await api.get("/statistics/dashboard", {
        params: {
          ...filter,
        },
      });

      setStatistics(response.data.data);
			
      return response.data.data;
    } catch (error) {
      console.error("Error fetching statistics:", error);
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);


  return {
		statistics,	
		getStatistics,
		loading,
		error,
  };
};

export default useStatistics;
