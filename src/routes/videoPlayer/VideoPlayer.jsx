import { useEffect, useRef } from 'react';

const CLOUD_NAME= 'dciywcxvp'

export default function VideoPlayer (props) {
const {width, height} = props
  const cloudinaryRef = useRef();
  const videoRef = useRef();

  useEffect(() => {
    if ( cloudinaryRef.current ) return;

    cloudinaryRef.current = window.cloudinary;
    cloudinaryRef.current.videoPlayer(videoRef.current, {
      cloud_name:  CLOUD_NAME
    })
  }, []);

  return (
      <video
        ref={videoRef}
        data-cld-public-id= "yvc9r2qcrbcb4o6begij"
        controls
        width={width}
        height={height}
      />
  );
}