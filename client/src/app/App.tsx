import React from "react";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "../routes";


function App() {
  // return <SampleComponent />;
  return (
    <>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </>
  );
}

export default App;
