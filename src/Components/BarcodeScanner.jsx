import React, { useState, useEffect, useRef } from "react";
import jsQR from "jsqr";

const BarcodeScanner = () => {
  const [data, setData] = useState("No barcode scanned yet");
  const [isScanning, setIsScanning] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
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

          ctx.drawImage(video, 0, 0, canvas.width, canvas.height); // Draw without scaling

          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

          const code = jsQR(imageData.data, canvas.width, canvas.height, {
            inversionAttempts: "dontInvert",
          });

          if (code) {
            setData(code.data);
            setIsScanning(false);
            console.log("Barcode found:", code.data);
          }
        }

        if (isScanning) {
          requestAnimationFrame(scanFrame);
        }
      };

      scanFrame();
    }
  };

  const handleScanToggle = () => {
    setIsScanning((prev) => !prev);
  };

  const handleTouchStart = (e) => {
    e.preventDefault();
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

      <video
        ref={videoRef}
        autoPlay
        playsInline
        width="100%"
        height="auto"
        style={{
          border: "2px solid black",
          marginTop: "20px",
          display: "block",
          marginLeft: "auto",
          marginRight: "auto",
          backgroundColor: "gray",
        }}
        onTouchStart={handleTouchStart}
      />

      <canvas ref={canvasRef} style={{ display: "none" }} />

      <h3>Scanned Code: {data}</h3>
    </div>
  );
};

export default BarcodeScanner;