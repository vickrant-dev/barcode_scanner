import React, { useEffect, useRef } from "react";

const CameraTest = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((err) => console.error("Camera access error:", err));
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Camera Test</h2>
      <video ref={videoRef} autoPlay width="500" height="400" />
    </div>
  );
};

export default CameraTest;
