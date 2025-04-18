import * as React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/ExpediaLogo.svg";
import {
  AppBar,
  Box,
  Toolbar,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useAuth } from "../context/AuthContent";

const pages = ["Home", "Discover", "About", "Help"];

const NavBar = () => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const { isLoggedIn, logout } = useAuth();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handlePages = (page: String) => {
    navigate("/" + page.toLowerCase());
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const handleRegister = () => {
    navigate("/register");
  };

  const handleLogout = () => {
    logout();
    console.log("Logged out successfully.");
    navigate("/");
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* AppBar */}
      <AppBar
        position="static"
        sx={{ backgroundColor: "#FFEE58", maxWidth: "100%" }}
      >
        <Toolbar>
          {/* Logo */}
          {/* <img src={logo} style={{ height: 65 }} /> */}

          {/* Mobile Menu Button (Hidden on Desktop) */}
          <Box sx={{ display: { xs: "flex", md: "none" }, ml: "auto" }}>
            <IconButton onClick={handleDrawerToggle} sx={{ color: "black" }}>
              <MenuIcon />
            </IconButton>
          </Box>

          {/* Desktop Buttons (Hidden on Mobile) */}
          <Box sx={{ display: { xs: "none", md: "flex" }, ml: "auto" }}>
            {pages.map((page) => (
              <Button
                color="inherit"
                key={page}
                onClick={() => handlePages(page)}
                sx={{ color: "black" }}
              >
                {page}
              </Button>
            ))}

            {/* If user is logged in, show Logout button */}
            {isLoggedIn ? (
              <Button
                color="inherit"
                variant="outlined"
                onClick={handleLogout}
                sx={{
                  color: "white",
                  backgroundColor: "black",
                  ml: 1.25,
                  borderRadius: 2,
                }}
              >
                Logout
              </Button>
            ) : (
              <>
                {/* Login Button */}
                <Button
                  color="inherit"
                  variant="outlined"
                  onClick={handleLogin}
                  sx={{
                    color: "black",
                    backgroundColor: "#D3D3D3",
                    borderRadius: 2,
                    ml: 1.25,
                  }}
                >
                  Login
                </Button>

                {/* Register Button */}
                <Button
                  color="inherit"
                  variant="outlined"
                  onClick={handleRegister}
                  sx={{
                    color: "white",
                    backgroundColor: "black",
                    ml: 1.25,
                    borderRadius: 2,
                  }}
                >
                  Register
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        sx={{
          "& .MuiDrawer-paper": { width: 150 },
        }}
      >
        {/* List for pages */}
        <List>
          {pages.map((page) => (
            <ListItem key={page} onClick={handleDrawerToggle}>
              <ListItemText primary={page} onClick={() => handlePages(page)} />
            </ListItem>
          ))}
        </List>

        {/* Divider Between pages and login/register */}
        <Divider />

        {/* List for Login/Register */}
        <List>
          <ListItem key="Login" onClick={handleDrawerToggle}>
            <ListItemText primary="Login" onClick={handleLogin} />
          </ListItem>
          <ListItem key="Register" onClick={handleDrawerToggle}>
            <ListItemText primary="Register" onClick={handleRegister} />
          </ListItem>
        </List>
      </Drawer>
    </Box>
  );
};

export default NavBar;
