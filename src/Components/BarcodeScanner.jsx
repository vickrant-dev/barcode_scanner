import React, { useState, useEffect, useRef } from "react";
import jsQR from "jsqr"; // Import the jsQR library for barcode/QR scanning

const BarcodeScanner = () => {
  const [data, setData] = useState("No barcode scanned yet");
  const [hasPermission, setHasPermission] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null); // Used to draw video frame for scanning

  useEffect(() => {
    // Get camera permissions and setup video stream
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "environment" } })
      .then((stream) => {
        setHasPermission(true);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        startScanning();
      })
      .catch(() => setHasPermission(false));
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
      {hasPermission === false && <p>Camera access denied. Please enable it in your browser settings.</p>}

      {hasPermission && (
        <>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            width="500"
            height="500"
            style={{ display: "none" }} // We hide the video element since we're drawing it on canvas
          />

          <canvas ref={canvasRef} style={{ display: "none" }} /> {/* Invisible canvas to process the video frame */}

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
