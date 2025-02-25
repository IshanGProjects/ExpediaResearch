import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

interface SearchProps {
  userPrompt: string;
  setUserPrompt: (value: string) => void;
  handleSearch: () => void;
};

const Search: React.FC<SearchProps> = ({userPrompt, setUserPrompt, handleSearch}) => {
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
        }}
      >
        <Typography variant="h3">Expedia Travel</Typography>
        <Typography variant="h6">Find your next adventure</Typography>

        {/* Search Input Field with Search Icon */}
        <TextField
          variant="outlined"
          label="Where to next?"
          onChange={(e) => setUserPrompt(e.target.value)}
          sx={{
            mt: 2,
            width: "300px",
            "& .MuiOutlinedInput-root": {
              borderRadius: "25px", // Rounded corners
            },
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleSearch}>
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>
    </>
  );
};

export default Search;
