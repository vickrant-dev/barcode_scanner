import React, { useState, useEffect, useRef } from "react";
import {BarcodeScanner as BarcodeScannerComponent} from "react-barcode-scanner";

const BarcodeScanner = () => {
  const [data, setData] = useState("No barcode scanned yet");
  const [hasPermission, setHasPermission] = useState(null);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "environment" } })
      .then(() => setHasPermission(true))
      .catch(() => setHasPermission(false));
  }, []);

  const handleScanToggle = () => {
    setIsScanning((prev) => !prev);
  };

  // Adding a timeout to ensure the scanner stays active
  const handleScan = (err, result) => {
    if (result) {
      setData(result.text);
      setIsScanning(false); // Stop scanning after successful scan
    }
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
              onUpdate={handleScan}
              videoConstraints={{ facingMode: "environment" }} // Use back camera
              // Adjust the scan interval or delay (Optional if needed)
              interval={500} // Add a small delay to check every 500ms
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
