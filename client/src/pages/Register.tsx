import React from "react";
import { Box } from "@mui/material/";
import NavBar from "../components/NavBar";
import RegisterCard from "../components/RegisterCard";
import Footer from "../components/Footer";

const Register = () => {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh", // Ensures the page takes up full height
        }}
      >
        {/* Main Content */}
        <Box sx={{ flex: 1 }}>
          <NavBar />
          <RegisterCard />
        </Box>
        {/* Footer - Stays at the Bottom */}
        <Footer />
      </Box>
    </>
  );
};

export default Register;
