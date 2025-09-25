import { useState, useCallback } from "react";
import { api } from "./config";
// Updated import path to the correct location

const useColor = () => {
  const [colors, setColors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [color, setColor] = useState();

  const [param, setParam] = useState({
    code: "",
  });

  const [pageable, setPageable] = useState({
    page: 0,
    size: 10,
    sort: ["id,asc"],
  });

  const getColor = useCallback(async (customParam = param, customPageable = pageable) => {
    try {
      setLoading(true);
      setError(null);

      // Ensure all expected parameters exist, defaulting to empty strings
      const normalizedParam = {
        name: "",
        ...customParam,
      };

      // Clean empty values from the param object
      const cleanParam = Object.entries(normalizedParam)
        .filter(([_, value]) => value !== "")
        .reduce((acc, [key, value]) => {
          acc[key] = value;
          return acc;
        }, {});

      const response = await api.get("/api/v1/colors", {
        params: {
          ...cleanParam,
          page: customPageable.page,
          size: 100000,
          sort: customPageable.sort.join(","),
        },
      });

      setColors(response.data.data);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching colors:", error);
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchColorById = useCallback(async colorId => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get(`/api/v1/colors/${colorId}`);

      setColor(response.data.data);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching colors:", error);
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateColor = useCallback(async (colorId, payload) => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.put(`/api/v1/colors/${colorId}`, payload);

      return response;
    } catch (error) {
      console.error("Error fetching products:", error);
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

    const deleteColor = useCallback(async (colorId) => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.delete(`/api/v1/colors/${colorId}`);
      
      return response;
    } catch (error) {
      setError(error.response.data);
      return error.response;

      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const createColor = useCallback(async payload => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.post(`/api/v1/colors`, payload);

      return response.data;
    } catch (error) {
      console.error("Error fetching colors:", error);
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  

  return {
    colors,
    color,
    loading,
    error,
    getColor,
    fetchColorById,
    updateColor,
    createColor,
    deleteColor,
    setParam,
    setPageable,
  };
};

export default useColor;
