import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  IconButton,
  Button,
  Divider,
} from "@mui/material/";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContent";

const RegisterCard = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = React.useState(false);
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [errorFirstName, setFirstNameError] = React.useState(false);
  const [errorLastName, setLastNameError] = React.useState(false);
  const [errorEmail, setEmailError] = React.useState(false);
  const [errorPassword, setErrorPassword] = React.useState(false);
  const [errorEmailMessage, setErrorEmailMessage] = React.useState("");
  const [errorPasswordMessage, setErrorPasswordMessage] = React.useState("");
  const { setToken, setUserInfo } = useAuth();

  const handleSignUp = async () => {
    let isValid = true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // reset error states
    setFirstNameError(false);
    setLastNameError(false);
    setEmailError(false);
    setErrorPassword(false);
    setErrorEmailMessage("");
    setErrorPasswordMessage("");

    // check if names are valid
    if (firstName === "") {
      setFirstNameError(true);
      isValid = false;
    }
    if (lastName === "") {
      setLastNameError(true);
      isValid = false;
    }

    // check if email is valid
    if (email === "") {
      setEmailError(true);
      setErrorEmailMessage("Please enter an email");
      isValid = false;
    } else if (emailRegex.test(email) === false) {
      setEmailError(true);
      setErrorEmailMessage("Please enter a valid email");
      isValid = false;
    }

    // check if password is valid
    if (password === "") {
      setErrorPassword(true);
      setErrorPasswordMessage("Please enter a password");
      isValid = false;
    } else if (password.length < 8) {
      setErrorPassword(true);
      setErrorPasswordMessage("Password must be at least 8 characters");
      isValid = false;
    }

    if (!isValid) return;
    const username = firstName + " " + lastName;

    // handle endpoint with all verified data
    const response = await axios.post("http://localhost:8000/register", {
      email,
      password,
      username,
    });

    setToken(response.data.token);
    setUserInfo(firstName, lastName);
    navigate("/home");
    console.log("User registered successfully.");
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
          paddingTop: 12,
          position: "relative",
        }}
      >
        {/* Register Title */}
        <Typography variant="h4">Your Journey Begins Here</Typography>
        <Typography variant="subtitle1" fontStyle="italic">
          Create an account to start exploring.
        </Typography>

        {/* Register Card */}
        <Card
          sx={{
            mx: "auto",
            mt: 5,
            mb: 5,
            p: 3,
            backgroundColor: "#FFEE58",
            boxShadow: 3,
          }}
        >
          <CardContent>
            {/* Name Input */}
            <Typography variant="body1" fontWeight={600}>
              First Name:
            </Typography>
            <TextField
              id="firstName"
              placeholder="ex: John"
              variant="outlined"
              fullWidth
              error={errorFirstName}
              helperText={errorFirstName ? "Please enter a first name" : ""}
              margin="normal"
              onChange={(e) => setFirstName(e.target.value)}
              sx={{ backgroundColor: "white" }}
              slotProps={{
                formHelperText: {
                  sx: { backgroundColor: "#FFEE58", margin: 0 },
                },
              }}
            />

            <Typography variant="body1" fontWeight={600} mt={2}>
              Last Name:
            </Typography>
            <TextField
              id="lastName"
              placeholder="ex: Doe"
              variant="outlined"
              fullWidth
              error={errorLastName}
              helperText={errorLastName ? "Please enter a last name" : ""}
              margin="normal"
              onChange={(e) => setLastName(e.target.value)}
              sx={{ backgroundColor: "white" }}
              slotProps={{
                formHelperText: {
                  sx: { backgroundColor: "#FFEE58", margin: 0 },
                },
              }}
            />

            {/* Email Input */}
            <Typography variant="body1" fontWeight={600}>
              Email:
            </Typography>
            <TextField
              id="firstName"
              placeholder="email@example.com"
              variant="outlined"
              fullWidth
              error={errorEmail}
              helperText={errorEmailMessage}
              margin="normal"
              onChange={(e) => setEmail(e.target.value)}
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
              placeholder="Must be at least 8 characters"
              variant="outlined"
              fullWidth
              error={errorPassword}
              helperText={errorPasswordMessage}
              margin="normal"
              onChange={(e) => setPassword(e.target.value)}
              type={showPassword ? "text" : "password"}
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

            {/* Sign Up Button */}
            <Button
              onClick={handleSignUp}
              fullWidth
              variant="contained"
              sx={{ backgroundColor: "black", mt: 2, py: 1.5, borderRadius: 2 }}
            >
              Sign Up
            </Button>

            {/* Divider */}
            <Divider sx={{ mt: 2 }}>or</Divider>

            {/* Login Button */}
            <Button
              fullWidth
              variant="outlined"
              onClick={() => navigate("/login")}
              sx={{
                mt: 2,
                py: 1.5,
                borderColor: "black",
                color: "black",
                backgroundColor: "white",
                borderRadius: 2,
              }}
            >
              Already have an account? Log in
            </Button>
          </CardContent>
        </Card>
      </Box>
    </>
  );
};

export default RegisterCard;
