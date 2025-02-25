import * as React from "react";
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

const pages = ["Home", "Discover", "About", "Help"];

const NavBar = () => {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* AppBar */}
      <AppBar position="static" sx={{ backgroundColor: "#FFEE58" }}>
        <Toolbar>
          {/* Logo */}
          <img src={logo} style={{ height: 65 }} />

          {/* Mobile Menu Button (Hidden on Desktop) */}
          <Box sx={{ display: { xs: "flex", md: "none" }, ml: "auto" }}>
            <IconButton onClick={handleDrawerToggle} sx={{ color: "black" }}>
              <MenuIcon />
            </IconButton>
          </Box>

          {/* Desktop Buttons (Hidden on Mobile) */}
          <Box sx={{ display: { xs: "none", md: "flex" }, ml: "auto" }}>
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
              <ListItemText primary={page} />
            </ListItem>
          ))}
        </List>

        {/* Divider Between pages and login/register */}
        <Divider />

        {/* List for Login/Register */}
        <List>
          <ListItem key="Login" onClick={handleDrawerToggle}>
            <ListItemText primary="Login" />
          </ListItem>
          <ListItem key="Register" onClick={handleDrawerToggle}>
            <ListItemText primary="Register" />
          </ListItem>
        </List>
      </Drawer>
    </Box>
  );
};

export default NavBar;
