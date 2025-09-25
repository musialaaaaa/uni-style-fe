import { useState, useCallback } from "react";
import { api } from "./config";
// Updated import path to the correct location

const useCategory = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState();

  const [param, setParam] = useState({
    code: "",
  });

  const [pageable, setPageable] = useState({
    page: 0,
    size: 10,
    sort: ["id,asc"],
  });

  const getCategory = useCallback(async (customParam = param, customPageable = pageable) => {
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

      const response = await api.get("/api/v1/category", {
        params: {
          ...cleanParam,
          page: customPageable.page,
          size: 1000000,
          sort: customPageable.sort.join(","),
        },
      });

      setCategories(response.data.data);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching categories:", error);
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCategoryById = useCallback(async categoryId => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get(`/api/v1/category/${categoryId}`);

      setCategory(response.data.data);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching categories:", error);
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateCategory = useCallback(async (categoryId, payload) => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.put(`/api/v1/category/${categoryId}`, payload);

      return response;
    } catch (error) {
      console.error("Error fetching products:", error);
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

    const deleteCategory = useCallback(async (categoryId) => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.delete(`/api/v1/category/${categoryId}`);
      
      return response;
    } catch (error) {
      setError(error.response.data);
      return error.response;

      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const createCategory = useCallback(async payload => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.post(`/api/v1/category`, payload);

      return response.data;
    } catch (error) {
      console.error("Error fetching categories:", error);
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  

  return {
    categories,
    category,
    loading,
    error,
    getCategory,
    fetchCategoryById,
    updateCategory,
    createCategory,
    deleteCategory,
    setParam,
    setPageable,
  };
};

export default useCategory;
