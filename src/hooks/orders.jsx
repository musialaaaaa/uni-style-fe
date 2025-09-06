import { useState, useCallback } from "react";
import { api } from "./config";
// Updated import path to the correct location

const useOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [order, setCoupon] = useState();

  const [param, setParam] = useState({
		discountType:null,
    code: "",
  });

  const [pageable, setPageable] = useState({
    page: 0,
    size: 10,
    sort: ["id,asc"],
  });

  const getOrders = useCallback(async (customParam = param, customPageable = pageable) => {
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

      const response = await api.get("/api/orders", {
        params: {
          ...cleanParam,
          page: customPageable.page,
          size: customPageable.size,
          sort: customPageable.sort.join(","),
        },
      });

      setOrders(response.data.data);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchOrdersById = useCallback(async ordersId => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get(`/orders/${ordersId}`);

      setOrders(response.data.data);
      return response.data.data;
    } catch (error) {	
      console.error("Error fetching orders:", error);
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateOrders = useCallback(async (ordersId, payload) => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.put(`/orders/${ordersId}`, payload);
			if (response.data) {
					getOrders();
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

    const deleteOrders = useCallback(async (ordersId) => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.delete(`/orders/${ordersId}`);
					getOrders();
			
      return response;
    } catch (error) {
      setError(error.response.data);
      return error.response;

    } finally {
      setLoading(false);
    }
  }, []);

  const createOrders = useCallback(async payload => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.post(`/orders`, payload);
			if (response.data) {
					getOrders();
			}

      return response.data;
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  

  return {
    order,
    orders,
    loading,
    error,
    getOrders,
    fetchOrdersById,
    updateOrders,
    createOrders,
    deleteOrders,
    setParam,
    setPageable,
  };
};

export default useOrders;
