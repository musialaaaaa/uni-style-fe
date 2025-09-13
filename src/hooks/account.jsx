import { useState, useCallback } from "react";
import { api } from "./config";
// Updated import path to the correct location

const useAccount = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [account, setAccount] = useState();
  const [myAccount, setMyAccount] = useState();

  const [param, setParam] = useState({
    code: "",
  });

  const [pageable, setPageable] = useState({
    page: 0,
    size: 10,
    sort: ["id,asc"],
  });

  const getAccount = useCallback(async (customParam = param, customPageable = pageable) => {
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

      const response = await api.get("/account", {
        params: {
          ...cleanParam,
          page: customPageable.page,
          size: customPageable.size,
          sort: customPageable.sort.join(","),
        },
      });

      setAccounts(response.data.data.data);
      return response.data.data.data;
    } catch (error) {
      console.error("Error fetching accounts:", error);
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAccountById = useCallback(async accountId => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get(`/account/${accountId}`);

      setAccount(response.data.data);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching accounts:", error);
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMyAccount = useCallback(async accountId => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get(`/account/my-account`);

      setMyAccount(response.data.data);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching accounts:", error);
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateAccount = useCallback(async (accountId, payload) => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.put(`/account/${accountId}`, payload);

      return response;
    } catch (error) {
      console.error("Error fetching accounts:", error);
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

    const updateMyAccount = useCallback(async ( payload) => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.put(`/account/update-my-account`, payload);
      if(response && response.data){
        fetchMyAccount();
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

    const deleteAccount = useCallback(async (accountId) => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.delete(`/account/${accountId}`);
      
      return response;
    } catch (error) {
      setError(error.response.data);
      return error.response;

      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const createAccount = useCallback(async payload => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.post(`/account`, payload);

      return response.data;
    } catch (error) {
      console.error("Error fetching accounts:", error);
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);



  

  return {
    accounts,
    myAccount,
    account,
    loading,
    error,
    getAccount,
    fetchAccountById,
    fetchMyAccount,
    updateAccount,
    updateMyAccount,
    createAccount,
    deleteAccount,
    setParam,
    setPageable,
  };
};

export default useAccount;
