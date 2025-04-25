import React from "react";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [errorEmail, setEmailError] = React.useState(false);
  const [errorPassword, setErrorPassword] = React.useState(false);
  const [errorEmailMessage, setErrorEmailMessage] = React.useState("");
  const [errorPasswordMessage, setErrorPasswordMessage] = React.useState("");

  const handleLogin = () => {
    let isValid = true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    setEmailError(false);
    setErrorEmailMessage("");
    setErrorPassword(false);
    setErrorPasswordMessage("");

    // email validation
    if (email === "") {
      setEmailError(true);
      setErrorEmailMessage("Please enter an email");
      isValid = false;
    } else if (emailRegex.test(email) === false) {
      setEmailError(true);
      setErrorEmailMessage("Please enter a valid email");
      isValid = false;
    }

    // password validation
    if (password === "") {
      setErrorPassword(true);
      setErrorPasswordMessage("Please enter a password");
      isValid = false;
    }

    if (!isValid) return;

    console.log("Email: ", email);
    console.log("Password: ", password);
    console.log("Logging in...");
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "auto",
          paddingTop: 15,
          position: "relative",
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
              id="email"
              placeholder="email@example.com"
              variant="outlined"
              fullWidth
              margin="normal"
              onChange={(e) => setEmail(e.target.value)}
              error={errorEmail}
              helperText={errorEmailMessage}
              autoComplete="email"
              sx={{ backgroundColor: "white" }}
              slotProps={{
                formHelperText: {
                  sx: { backgroundColor: "#FFEE58", margin: 0 },
                },
              }}
            />

            {/* Password Input */}
            <Typography variant="body1" fontWeight={600} mt={2}>
              Password:
            </Typography>
            <TextField
              id="password"
              placeholder="Enter your password"
              variant="outlined"
              fullWidth
              margin="normal"
              type={showPassword ? "text" : "password"}
              onChange={(e) => setPassword(e.target.value)}
              error={errorPassword}
              helperText={errorPasswordMessage}
              sx={{ backgroundColor: "white" }}
              slotProps={{
                formHelperText: {
                  sx: { backgroundColor: "#FFEE58", margin: 0 },
                },
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
              onClick={handleLogin}
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
              onClick={() => navigate('/register')}
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
