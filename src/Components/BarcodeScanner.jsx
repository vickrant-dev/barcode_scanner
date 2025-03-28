import React, { useState, useEffect, useRef } from "react";
import jsQR from "jsqr"; // Import jsQR for barcode scanning

const BarcodeScanner = () => {
  const [data, setData] = useState("No barcode scanned yet");
  const [hasPermission, setHasPermission] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null); // Used to draw video frame for scanning
  const [error, setError] = useState(null); // Track error state

  useEffect(() => {
    // Attempt to get the user's media stream (camera)
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "environment" } })
      .then((stream) => {
        console.log("Camera stream:", stream); // Log the media stream
        setHasPermission(true);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        console.log("Camera stream started");
        startScanning();
      })
      .catch((err) => {
        console.error("Error accessing camera:", err);
        setHasPermission(false);
        setError("Error accessing the camera.");
      });
  }, []);

  const startScanning = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      const scanFrame = () => {
        if (video.readyState === video.HAVE_ENOUGH_DATA) {
          canvas.height = video.videoHeight;
          canvas.width = video.videoWidth;
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, canvas.width, canvas.height, {
            inversionAttempts: "dontInvert",
          });

          if (code) {
            setData(code.data); // Set the scanned barcode data
            setIsScanning(false); // Stop scanning after success
          }
        }

        if (isScanning) {
          requestAnimationFrame(scanFrame);
        }
      };

      scanFrame(); // Start scanning loop
    }
  };

  const handleScanToggle = () => {
    setIsScanning((prev) => !prev);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Barcode Scanner</h2>

      {hasPermission === null && <p>Requesting camera access...</p>}
      {hasPermission === false && (
        <p>{error || "Camera access denied. Please enable it in your browser settings."}</p>
      )}

      {hasPermission && (
        <>
          {/* Display the video feed for the camera */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            width="100%" // Make it responsive, full width
            height="auto" // Adjust height proportionally
            style={{
              border: "2px solid black", // Border to make it visible
              marginTop: "20px", // Space above the video
              display: "block", // Ensures it's not hidden
              marginLeft: "auto", // Center the video
              marginRight: "auto", // Center the video
              backgroundColor: "gray", // Temporary background color to debug visibility
            }}
          />
          {/* Hidden canvas to process the video feed for barcode scanning */}
          <canvas ref={canvasRef} style={{ display: "none" }} />

          {isScanning && (
            <>
              <button
                onClick={handleScanToggle}
                style={{ marginTop: "20px", padding: "10px 20px", fontSize: "16px" }}
              >
                Stop Scanning
              </button>
            </>
          )}

          {!isScanning && (
            <button
              onClick={handleScanToggle}
              style={{ marginTop: "20px", padding: "10px 20px", fontSize: "16px" }}
            >
              Start Scanning
            </button>
          )}
        </>
      )}

      <h3>Scanned Code: {data}</h3>
    </div>
  );
};

export default BarcodeScanner;
