import { useState, useCallback } from "react";
import { api } from "./config";
// Updated import path to the correct location

const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [product, setProduct] = useState();

  const [param, setParam] = useState({
    code: "",
    name: "",
    description: "",
  });

  const [pageable, setPageable] = useState({
    page: 0,
    size: 10,
    sort: ["id,asc"],
  });

  const fetchProducts = useCallback(async (customParam = param, customPageable = pageable) => {
    try {
      setLoading(true);
      setError(null);

      // Ensure all expected parameters exist, defaulting to empty strings
      const normalizedParam = {
        code: "",
        name: "",
        description: "",
        ...customParam,
      };

      // Clean empty values from the param object
      const cleanParam = Object.entries(normalizedParam)
        .filter(([_, value]) => value !== "")
        .reduce((acc, [key, value]) => {
          acc[key] = value;
          return acc;
        }, {});

        const response = await api.get("/api/v1/products", {
          params: {
            ...cleanParam,
            sort: customPageable.sort.join(","),
          },
        });

      setProducts(response.data.data.data);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching products:", error);
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchProductId = useCallback(async productId => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get(`/api/v1/products/${productId}`);

      setProduct(response.data.data);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching products:", error);
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

    const updateProduct = useCallback(async (productId, payload) => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.put(`/api/v1/products/${productId}`, payload);

      setProduct(response.data.data);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching products:", error);
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);


    const createProduct = useCallback(async (payload) => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.post(`/api/v1/products`, payload);

      setProduct(response.data.data);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching products:", error);
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

      const deleteProduct = useCallback(async (productId) => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.delete(`/api/v1/products/${productId}`);

      setProduct(response.data.data);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching products:", error);
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);



  return {
    products,
    product,
    loading,
    error,
    fetchProducts,
    fetchProductId,
    updateProduct,
    createProduct,
    setParam,
    deleteProduct,
    setPageable,
  };
};

export default useProducts;
