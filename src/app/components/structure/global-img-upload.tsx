import React, { useEffect } from "react";
import Image from "next/image";
import useUploadImage from "@/hooks/useUploadImg";
import upload_default from "@assets/img/icons/upload.png";
import Loading from "../common/loading";

// prop type
type IPropType = {
  setImage: React.Dispatch<React.SetStateAction<string>>;
  isSubmitted: boolean;
  default_img?: string;
  image?: string;
  setIsSubmitted?: React.Dispatch<React.SetStateAction<boolean>>;
};

const GlobalImgUpload = ({
  setImage,
  isSubmitted,
  default_img,
  image,
  setIsSubmitted,
}: IPropType) => {
  const { handleImageUpload, uploadData, isError, isLoading } = useUploadImage();
  const showDefaultImage = !uploadData && !isLoading && !isError && default_img;

  const upload_img = isLoading ? (
    <Loading loading={isLoading} spinner="scale" />
  ) : uploadData?.data?.url ? (
    <Image
      src={uploadData.data.url}
      alt="upload-img"
      width={100}
      height={91}
      className="object-cover rounded"
    />
  ) : showDefaultImage ? (
    <Image src={default_img} alt="upload-img" width={100} height={91} />
  ) : image ? (
    <Image src={image} alt="upload-img" width={100} height={91} />
  ) : (
    <Image src={upload_default} alt="upload-img" width={100} height={91} />
  );

  useEffect(() => {
    if (isLoading && setIsSubmitted) {
      setIsSubmitted(false);
    }
  }, [isLoading, setIsSubmitted]);

  useEffect(() => {
    if (uploadData && !isError && !isLoading) {
      setImage(uploadData.data.url);
    } else if (default_img) {
      setImage(default_img);
    }
  }, [default_img, uploadData, isError, isLoading, setImage]);

  return (
    <div className="mb-6">
      <p className="mb-2 text-base text-black">Upload Image</p>
      <div className="text-center">{isSubmitted ? <Image src={upload_default} alt="upload-img" width={100} height={91} /> : upload_img}</div>
      <span className="text-tiny text-center w-full inline-block mb-3">
        (Only png, jpg, jpeg, webp formats will be accepted)
      </span>
      <div>
        <input
          onChange={handleImageUpload}
          type="file"
          accept="image/png,image/jpeg,image/jpg,image/webp"
          name="image"
          id="groupCodeImage"
          className="hidden"
        />
        <label
          htmlFor="groupCodeImage"
          className="text-tiny w-full inline-block py-1 px-4 rounded-md border border-gray6 text-center hover:cursor-pointer hover:bg-theme hover:text-white hover:border-theme transition"
        >
          Upload Image
        </label>
      </div>
    </div>
  );
};

export default GlobalImgUpload;
