import React, { useState, useEffect } from "react";
import BarcodeScannerComponent from "react-qr-barcode-scanner";

const BarcodeScanner = () => {
  const [data, setData] = useState("No barcode scanned yet");
  const [hasPermission, setHasPermission] = useState(null);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    // Request camera permission with back camera
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "environment" } })
      .then(() => setHasPermission(true))
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
            <BarcodeScannerComponent
              width={500}
              height={500}
              onUpdate={(err, result) => {
                if (result) {
                  setData(result.text);
                  setIsScanning(false); // Stop scanning after success
                }
              }}
              videoConstraints={{ facingMode: "environment" }} // Force back camera
            />
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
