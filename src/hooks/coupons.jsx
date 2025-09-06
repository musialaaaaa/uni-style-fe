import { useState, useCallback } from "react";
import { api } from "./config";
// Updated import path to the correct location

const useCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [coupon, setCoupon] = useState();

  const [param, setParam] = useState({
		discountType:null,
    code: "",
  });

  const [pageable, setPageable] = useState({
    page: 0,
    size: 10,
    sort: ["id,asc"],
  });

  const getCoupons = useCallback(async (customParam = param, customPageable = pageable) => {
    try {
      setLoading(true);
      setError(null);

      // Ensure all expected parameters exist, defaulting to empty strings
      const normalizedParam = {
        name: "",
        discountType: null,
        ...customParam,
      };

      // Clean empty values from the param object
      const cleanParam = Object.entries(normalizedParam)
        .filter(([_, value]) => value !== "")
        .reduce((acc, [key, value]) => {
          acc[key] = value;
          return acc;
        }, {});

      const response = await api.get("/api/coupons", {
        params: {
          ...cleanParam,
          page: customPageable.page,
          size: customPageable.size,
          sort: customPageable.sort.join(","),
        },
      });

      setCoupons(response.data.data);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching coupons:", error);
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCouponsById = useCallback(async couponsId => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get(`/api/coupons/${couponsId}`);

      setCoupons(response.data.data);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching coupons:", error);
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateCoupons = useCallback(async (couponsId, payload) => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.put(`/api/coupons/${couponsId}`, payload);
			if (response.data) {
					getCoupons();
			}

      return response;
    } catch (error) {
      console.error("Error fetching products:", error);
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

    const deleteCoupons = useCallback(async (couponsId) => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.delete(`/api/coupons/${couponsId}`);
					getCoupons();
			
      return response;
    } catch (error) {
      setError(error.response.data);
      return error.response;

    } finally {
      setLoading(false);
    }
  }, []);

  const createCoupons = useCallback(async payload => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.post(`/api/coupons`, payload);
			if (response.data) {
					getCoupons();
			}

      return response.data;
    } catch (error) {
      console.error("Error fetching coupons:", error);
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  

  return {
    coupon,
    coupons,
    loading,
    error,
    getCoupons,
    fetchCouponsById,
    updateCoupons,
    createCoupons,
    deleteCoupons,
    setParam,
    setPageable,
  };
};

export default useCoupons;
