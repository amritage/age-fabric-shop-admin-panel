import React, { useEffect } from "react";
import Loading from "../common/loading";
import useUploadVideo from "@/hooks/useUploadVideo";

interface IVideoUploadProps {
  setVideo: React.Dispatch<React.SetStateAction<string>>;
  isSubmitted: boolean;
  default_video?: string;
  video?: string;
  setIsSubmitted?: React.Dispatch<React.SetStateAction<boolean>>;
}

const GlobalVideoUpload = ({
  setVideo,
  isSubmitted,
  default_video,
  video,
  setIsSubmitted,
}: IVideoUploadProps) => {
  const { handleVideoUpload, uploadData, isError, isLoading } = useUploadVideo();
  const showDefaultVideo = !uploadData && !isLoading && !isError && default_video;

  const upload_video = isLoading ? (
    <Loading loading={isLoading} spinner="scale" />
  ) : uploadData?.data?.url ? (
    <video width={160} height={90} controls src={uploadData.data.url} />
  ) : showDefaultVideo ? (
    <video width={160} height={90} controls src={default_video} />
  ) : video ? (
    <video width={160} height={90} controls src={video} />
  ) : (
    <div className="w-[160px] h-[90px] bg-gray-200 flex items-center justify-center text-gray-500">No Video</div>
  );

  useEffect(() => {
    if (isLoading && setIsSubmitted) {
      setIsSubmitted(false);
    }
  }, [isLoading, setIsSubmitted]);

  useEffect(() => {
    if (uploadData && !isError && !isLoading) {
      setVideo(uploadData.data.url);
    } else if (default_video) {
      setVideo(default_video);
    }
  }, [default_video, uploadData, isError, isLoading, setVideo]);

  return (
    <div className="mb-6">
      <p className="mb-2 text-base text-black">Upload Video</p>
      <div className="text-center mb-2">{isSubmitted ? <div className="w-[160px] h-[90px] bg-gray-200 flex items-center justify-center text-gray-500">No Video</div> : upload_video}</div>
      <span className="text-tiny text-center w-full inline-block mb-3">
        (Any video format will be accepted)
      </span>
      <div>
        <input
          onChange={handleVideoUpload}
          type="file"
          accept="video/*"
          name="video"
          id="groupCodeVideo"
          className="hidden"
        />
        <label
          htmlFor="groupCodeVideo"
          className="text-tiny w-full inline-block py-1 px-4 rounded-md border border-gray6 text-center hover:cursor-pointer hover:bg-theme hover:text-white hover:border-theme transition"
        >
          Upload Video
        </label>
      </div>
    </div>
  );
};

export default GlobalVideoUpload; 