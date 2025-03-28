import React, { useState, useEffect, useRef } from "react";
import jsQR from "jsqr"; // Import jsQR for barcode scanning

const BarcodeScanner = () => {
  const [data, setData] = useState("No barcode scanned yet");
  const [isScanning, setIsScanning] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null); // Used to draw video frame for scanning

  useEffect(() => {
    // Attempt to get the user's media stream (camera)
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "environment" } })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        startScanning();
      })
      .catch((err) => {
        console.error("Error accessing camera:", err);
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

          // Optional: Resize canvas to improve performance and scanning accuracy
          const scaleFactor = 0.5; // Scale down the video for better recognition
          const width = canvas.width * scaleFactor;
          const height = canvas.height * scaleFactor;

          ctx.drawImage(video, 0, 0, width, height); // Scale the video frame

          const imageData = ctx.getImageData(0, 0, width, height);
          
          // Log the image data to see if it's getting the correct pixels
          console.log("imageData", imageData);

          const code = jsQR(imageData.data, width, height, {
            inversionAttempts: "dontInvert",
          });

          if (code) {
            setData(code.data); // Set the scanned barcode data
            setIsScanning(false); // Stop scanning after success
            console.log("Barcode found:", code.data); // Log found barcode
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

  // Adding touch support for mobile
  const handleTouchStart = (e) => {
    e.preventDefault(); // Prevents the page from zooming or scrolling
    if (!isScanning) {
      handleScanToggle();
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Barcode Scanner</h2>

      <div
        style={{
          marginBottom: "20px",
          backgroundColor: "gray",
          padding: "10px",
        }}
      >
        {isScanning ? (
          <p>Scanning in progress...</p>
        ) : (
          <p>Tap the camera feed to start scanning</p>
        )}
      </div>

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
        onTouchStart={handleTouchStart} // Mobile touch support
      />

      {/* Hidden canvas to process the video feed for barcode scanning */}
      <canvas ref={canvasRef} style={{ display: "none" }} />

      <h3>Scanned Code: {data}</h3>
    </div>
  );
};

export default BarcodeScanner;
