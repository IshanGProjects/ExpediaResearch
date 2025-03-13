import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Divider,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const LoginCard = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  // TODO - Implement working buttons to send data (for now just console log)

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          position: "relative",
          top: "-10vh",
        }}
      >
        {/* Login Title */}
        <Typography variant="h4">Welcome Back!</Typography>
        <Typography variant="subtitle1" fontStyle="italic">
          Log in to access your account and continue your journey.
        </Typography>

        {/* Login Card */}
        <Card
          sx={{
            mx: "auto",
            mt: 5,
            p: 3,
            backgroundColor: "#FFEE58",
            boxShadow: 3,
          }}
        >
          <CardContent>
            {/* Email Input */}
            <Typography variant="body1" fontWeight={600}>
              Email:
            </Typography>
            <TextField
              placeholder="email@example.com"
              variant="outlined"
              fullWidth
              margin="normal"
              sx={{ backgroundColor: "white" }}
              autoComplete="email"
            />

            {/* Password Input */}
            <Typography variant="body1" fontWeight={600} mt={2}>
              Password:
            </Typography>
            <TextField
              placeholder="Must be at least 6 characters"
              variant="outlined"
              fullWidth
              margin="normal"
              type={showPassword ? "text" : "password"}
              sx={{ backgroundColor: "white" }}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />

            {/* Login Button */}
            <Button
              fullWidth
              variant="contained"
              sx={{ backgroundColor: "black", mt: 2, py: 1.5, borderRadius: 2 }}
            >
              Login
            </Button>

            {/* Divider */}
            <Divider sx={{ mt: 2 }}>or</Divider>

            {/* Register Button */}
            <Button
              fullWidth
              variant="outlined"
              sx={{
                mt: 2,
                py: 1.5,
                borderColor: "black",
                color: "black",
                backgroundColor: "white",
                borderRadius: 2,
              }}
            >
              Create an Account
            </Button>
          </CardContent>
        </Card>
      </Box>
    </>
  );
};

export default LoginCard;
