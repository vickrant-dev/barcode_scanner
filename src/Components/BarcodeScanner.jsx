import React, { useState, useEffect, useRef } from "react";
import { BarcodeScanner as BarcodeScannerComponent } from "react-barcode-scanner";

const BarcodeScanner = () => {
  const [data, setData] = useState("No barcode scanned yet");
  const [hasPermission, setHasPermission] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "environment" } })
      .then((stream) => {
        setHasPermission(true);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        // Try to manually set focus after the camera starts
        const track = stream.getVideoTracks()[0];
        if (track?.applyConstraints) {
          track.applyConstraints({
            advanced: [{ focusMode: "continuous" }, { zoom: 2 }],
          }).catch(err => console.warn("Focus constraints not supported:", err));
        }
      })
      .catch(() => setHasPermission(false));
  }, []);

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
          {isScanning && (
            <>
              <video ref={videoRef} autoPlay playsInline width="500" height="500" style={{ display: "none" }} />
              <BarcodeScannerComponent
                width={500}
                height={500}
                onUpdate={(err, result) => {
                  if (result) {
                    setData(result.text);
                    setIsScanning(false);
                  }
                }}
                videoConstraints={{ facingMode: "environment" }}
              />
            </>
          )}

          <button
            onClick={handleScanToggle}
            style={{ marginTop: "20px", padding: "10px 20px", fontSize: "16px" }}
          >
            {isScanning ? "Stop Scanning" : "Start Scanning"}
          </button>
        </>
      )}

      <h3>Scanned Code: {data}</h3>
    </div>
  );
};

export default BarcodeScanner;