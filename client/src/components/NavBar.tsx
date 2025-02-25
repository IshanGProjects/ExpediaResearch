import * as React from "react";
import logo from "../assets/ExpediaLogo.svg";
import {
  AppBar,
  Box,
  Typography,
  IconButton,
  Toolbar,
  Button,
} from "@mui/material";

const pages = ["Home", "Discover", "About", "Help"];

const NavBar = () => {
  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        {/* AppBar */}
        <AppBar position="static" sx={{ backgroundColor: "#FFEE58" }}>
          <Toolbar>
            {/* Logo */}
            <img src={logo} style={{ height: 65 }} />

            {/* Box containing all buttons */}
            <Box sx={{ ml: "auto" }}>
              {/* Page Buttons */}
              {pages.map((page) => (
                <Button color="inherit" key={page} sx={{ color: "black" }}>
                  {page}
                </Button>
              ))}

              {/* Login Button */}
              <Button
                color="inherit"
                variant="outlined"
                sx={{
                  color: "black",
                  backgroundColor: "#D3D3D3",
                  borderRadius: 2,
                }}
              >
                Login
              </Button>

              {/* Register Button */}
              <Button
                color="inherit"
                variant="outlined"
                sx={{
                  color: "white",
                  backgroundColor: "black",
                  ml: 1.25,
                  borderRadius: 2,
                }}
              >
                Register
              </Button>
            </Box>
          </Toolbar>
        </AppBar>
      </Box>
    </>
  );
};

export default NavBar;
