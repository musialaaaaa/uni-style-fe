import { useState } from 'react';
import { api } from './config';

/**
 * Custom hook for uploading images
 * @returns {Object} Upload methods and states
 */
const useImageUpload = () => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [uploadedImages, setUploadedImages] = useState([]);
	const [progress, setProgress] = useState(0);

	/**
	 * Upload multiple image files to the server
	 * @param {File[]} files - Array of file blobs to upload
	 * @returns {Promise<Array>} - Array of uploaded image data
	 */
	const uploadImages = async (files) => {
		setLoading(true);
		setError(null);
		setProgress(0);
		
		try {
      const formData = new FormData();

      // Append each file to form data
      Array.from(files).forEach(file => {
        formData.append("files", file);
      });

      const response = await api.post("/images/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: progressEvent => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percentCompleted);
        },
      });
      setUploadedImages(response.data.data);
      return response.data.data;
    } catch (err) {
      setError(err.response?.data?.message || "Error uploading images");
      throw err;
    } finally {
      setLoading(false);
    }
	};

	/**
	 * Upload a single image file to the server
	 * @param {File} file - File blob to upload
	 * @returns {Promise<Object>} - Uploaded image data
	 */
	const uploadImage = async (file) => {
		return uploadImages([file]).then(results => results[0]);
	};

	/**
	 * Reset the upload state
	 */
	const resetUpload = () => {
		setUploadedImages([]);
		setError(null);
		setProgress(0);
	};

	return {
		uploadImage,
		uploadImages,
		resetUpload,
		loading,
		error,
		uploadedImages,
		progress,
	};
};

export default useImageUpload;