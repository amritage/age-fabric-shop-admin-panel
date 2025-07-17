import { useUploadVideoMutation } from "@/redux/cloudinary/cloudinaryApi";

const useUploadVideo = () => {
  const [uploadVideo, { data: uploadData, isError, isLoading, error }] = useUploadVideoMutation();

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target && e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append("video", file);
      uploadVideo(formData);
    }
  };

  return {
    handleVideoUpload,
    uploadData,
    isError,
    isLoading,
    error,
  };
};

export default useUploadVideo; 