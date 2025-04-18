import React from "react";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useAuth } from "../context/AuthContent";

interface SearchProps {
  userPrompt: string;
  setUserPrompt: (value: string) => void;
  handleSearch: () => void;
  loading: boolean;
  error: boolean;
  errorMessage: string;
}

const Search: React.FC<SearchProps> = ({
  userPrompt,
  setUserPrompt,
  handleSearch,
  loading,
  error,
  errorMessage,
}) => {
  const { firstName } = useAuth();

  return (
    <>
      <Box
        sx={{
          backgroundColor: "rgb(248, 248, 248)",
          height: 400,
          flexDirection: "column",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          maxWidth: "100%",
          margin: "0 auto",
        }}
      >
        <Typography variant="h3">Welcome back {firstName}!</Typography>
        <Typography variant="h6">Find your next adventure</Typography>

        {/* Search Input Field with Search Icon */}
        <TextField
          name="searchField"
          variant="outlined"
          label="Where to next?"
          onChange={(e) => setUserPrompt(e.target.value)}
          multiline
          minRows={1}
          maxRows={4}
          error={error}
          helperText={error ? errorMessage : ""}
          sx={{
            mt: 2,
            width: "300px",
            "& .MuiOutlinedInput-root": {
              borderRadius: "25px", // Rounded corners
            },
          }}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton loading={loading} onClick={handleSearch}>
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />
      </Box>
    </>
  );
};

export default Search;
