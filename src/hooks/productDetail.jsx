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
    name: "",
    description: "",
    quantity: "",
    price: "",
    image: "",
    productId: "",
    categoryId: "",
    materialId: "",
    brandId: "",
    colorId: "",
    sizeId: "",
  });

  const [pageable, setPageable] = useState({
    page: 0,
    size: 10,
    sort: ["id,asc"],
  });

  const getProductDetail = useCallback(async (customParam = {}) => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get("/api/v1/product-details", {
        params: {
          ...param,
          ...customParam,
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

      setProductDetail(response.data);
      return response.data;
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

      getProductDetail();

      return response;
    } catch (error) {
      console.error("Error fetching products:", error);
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteProductDetail = useCallback(async productDetailId => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.delete(`/api/v1/product-details/${productDetailId}`);

      getProductDetail();

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
