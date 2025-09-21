import React, { useCallback, useEffect, useState } from 'react'
import { api, BASE_URL } from '../hooks/config';
import { Avatar } from 'antd';

const AvatarFile = ({ fileName ,size=40 }) => {
	const [urlImage, setUrlImage] = useState("");

  const getUrlImage = useCallback(async fileName => {
    try {
      // Request image as blob data
      const response = await api.get(`${BASE_URL}/images/view/${fileName}`, {
        responseType: "blob", // Important: set responseType to 'blob'
      });

      // Create a blob URL from the response data
      const blobUrl = URL.createObjectURL(response.data);

      // Set the blob URL to state
      setUrlImage(blobUrl);
    } catch (error) {
      console.error("Error loading image:", error);
      // Set a fallback image
      setUrlImage("");
    }
  }, []);

		useEffect(() => {
			if (fileName && fileName.length > 0) {
				getUrlImage(fileName);
			}
		}, [fileName]);

  return (
		 <Avatar key={fileName} src={urlImage} size={size} shape="square" />
  )
}

export default AvatarFile