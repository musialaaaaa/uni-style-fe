import { useState, useCallback } from "react";
import { api } from "./config";
// Updated import path to the correct location

const useSize = () => {
  const [sizes, setSizes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [size, setSize] = useState();

  const [param, setParam] = useState({
    code: "",
  });

  const [pageable, setPageable] = useState({
    page: 0,
    size: 10,
    sort: ["id,asc"],
  });

  const getSize = useCallback(async (customParam = param, customPageable = pageable) => {
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

      const response = await api.get("/api/v1/sizes", {
        params: {
          ...cleanParam,
          page: customPageable.page,
          size: customPageable.size,
          sort: customPageable.sort.join(","),
        },
      });

      setSizes(response.data.data);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching sizes:", error);
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSizeById = useCallback(async sizeId => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get(`/api/v1/sizes/${sizeId}`);

      setSize(response.data.data);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching sizes:", error);
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateSize = useCallback(async (sizeId, payload) => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.put(`/api/v1/sizes/${sizeId}`, payload);

      return response;
    } catch (error) {
      console.error("Error fetching products:", error);
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

    const deleteSize = useCallback(async (sizeId) => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.delete(`/api/v1/sizes/${sizeId}`);
      
      return response;
    } catch (error) {
      setError(error.response.data);
      return error.response;

      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const createSize = useCallback(async payload => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.post(`/api/v1/sizes`, payload);

      return response.data;
    } catch (error) {
      console.error("Error fetching sizes:", error);
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  

  return {
    sizes,
    size,
    loading,
    error,
    getSize,
    fetchSizeById,
    updateSize,
    createSize,
    deleteSize,
    setParam,
    setPageable,
  };
};

export default useSize;
