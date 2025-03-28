import React from "react";
import BarcodeScanner from './Components/BarcodeScanner'
import CameraTest from "./Components/CameraTest";

function App() {
  return (
    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', transform: 'TranslateX(400px)'}} >
      <h1>React Barcode Scanner</h1>
      {/* <BarcodeScanner /> */}
      <CameraTest/>
    </div>
  );
}

export default App;
