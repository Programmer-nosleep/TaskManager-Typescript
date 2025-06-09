import { API_PATHS } from "./ApiPaths";
import axiosInstance from "./axiosInstance";

const uploadImage = async (imageFile: any) => {
 const formData = new FormData();
 
 formData.append('image', imageFile);

 try {
  const response = await axiosInstance.post(API_PATHS.IMAGE.UPLOAD_IMAGE, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
  });

  return response.data;
 } catch(err: any) {
  console.error(`Error uploading the image ${err}`);
  throw err;
 }
}

export default uploadImage;