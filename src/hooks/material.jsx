import { useState, useCallback } from "react";
import { api } from "./config";
// Updated import path to the correct location

const useMaterial = () => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [material, setMaterial] = useState();

  const [param, setParam] = useState({
    code: "",
  });

  const [pageable, setPageable] = useState({
    page: 0,
    size: 10,
    sort: ["id,asc"],
  });

  const getMaterial = useCallback(async (customParam = param, customPageable = pageable) => {
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

      const response = await api.get("/api/v1/materials", {
        params: {
          ...cleanParam,
          page: customPageable.page,
          size: 100000,
          sort: customPageable.sort.join(","),
        },
      });

      setMaterials(response.data.data);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching materials:", error);
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMaterialById = useCallback(async materialId => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get(`/api/v1/materials/${materialId}`);

      setMaterial(response.data.data);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching materials:", error);
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateMaterial = useCallback(async (materialId, payload) => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.put(`/api/v1/materials/${materialId}`, payload);

      return response;
    } catch (error) {
      console.error("Error fetching products:", error);
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

    const deleteMaterial = useCallback(async (materialId) => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.delete(`/api/v1/materials/${materialId}`);
      
      return response;
    } catch (error) {
      setError(error.response.data);
      return error.response;

      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const createMaterial = useCallback(async payload => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.post(`/api/v1/materials`, payload);

      return response.data;
    } catch (error) {
      console.error("Error fetching materials:", error);
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  

  return {
    materials,
    material,
    loading,
    error,
    getMaterial,
    fetchMaterialById,
    updateMaterial,
    createMaterial,
    deleteMaterial,
    setParam,
    setPageable,
  };
};

export default useMaterial;
