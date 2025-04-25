import React from "react";
import NavBar from "../components/NavBar";
import LoginCard from "../components/LoginCard";
import Footer from "../components/Footer";
import { Box } from "@mui/material/";

const Login = () => {
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
          <LoginCard />
        </Box>
        {/* Footer - Stays at the Bottom */}
        <Footer />
      </Box>
    </>
  );
};

export default Login;
