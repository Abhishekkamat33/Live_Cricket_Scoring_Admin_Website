/**
 * Uploads an image file to Cloudinary and returns the secure URL.
 * @param file Image file to upload
 * @returns The secure URL of the uploaded image
 */
export const uploadImageToCloudinary = async (file: File): Promise<string> => {
  const formData = new FormData();

 

  formData.append('file', file);
      formData.append('upload_preset', 'my store'); // Cloudinary upload preset
      formData.append('cloud_name', 'drrcvdeb3'); // Cloudinary cloud name

      try{
    const response = await  fetch(`https://api.cloudinary.com/v1_1/drrcvdeb3/image/upload`, {
        method: 'POST',
        body: formData,
      })

    if (!response.ok) {
      // For better debugging, log the response text (Cloudinary often returns error details)
      const errorText = await response.text();

      throw new Error(`Cloudinary upload failed with status ${response.status}`);
    }

    const data = await response.json();
   

    return data.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
};
