import { useState, useCallback } from "react";
import { api } from "./config";
// Updated import path to the correct location

const useProductDetail = () => {
  const [productDetails, setProductDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [productDetail, setProductDetail] = useState();

  const [param, setParam] = useState({
    code: "",
  });

  const [pageable, setPageable] = useState({
    page: 0,
    size: 10,
    sort: ["id,asc"],
  });

  const getProductDetail = useCallback(async (customParam = param, customPageable = pageable) => {
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

      const response = await api.get("/api/v1/product-details", {
        params: {
          ...cleanParam,
          page: customPageable.page,
          size: customPageable.size,
          sort: customPageable.sort.join(","),
        },
      });

      setProductDetails(response.data.data);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching productDetails:", error);
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchProductDetailById = useCallback(async productDetailId => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get(`/api/v1/product-details/${productDetailId}`);

      setProductDetail(response.data.data);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching productDetails:", error);
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProductDetail = useCallback(async (productDetailId, payload) => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.put(`/api/v1/product-details/${productDetailId}`, payload);

      return response;
    } catch (error) {
      console.error("Error fetching products:", error);
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

    const deleteProductDetail = useCallback(async (productDetailId) => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.delete(`/api/v1/product-details/${productDetailId}`);
      
      return response;
    } catch (error) {
      setError(error.response.data);
      return error.response;

      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const createProductDetail = useCallback(async payload => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.post(`/api/v1/product-details`, payload);

      return response.data;
    } catch (error) {
      console.error("Error fetching productDetails:", error);
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  

  return {
    productDetails,
    productDetail,
    loading,
    error,
    getProductDetail,
    fetchProductDetailById,
    updateProductDetail,
    createProductDetail,
    deleteProductDetail,
    setParam,
    setPageable,
  };
};

export default useProductDetail;
