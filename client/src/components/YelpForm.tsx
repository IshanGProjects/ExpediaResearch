import React from "react";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";

const yelpCategories = ["Category 1", "Category 2", "Category 3", "Category 4"];

const YelpForm = () => {
  const [category, setCategory] = React.useState<string[]>([]);
  const [radius, setRadius] = React.useState<number>(5);
  const [location, setLocation] = React.useState<string>("");
  const [searchTerm, setSearchTerm] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(false);
  const [locationError, setLocationError] = React.useState<boolean>(false);
  const [searchTermError, setSearchTermError] = React.useState<boolean>(false);

  // handle change when user clicks on categories
  const handleChangeCategories = (
    event: SelectChangeEvent<typeof category>
  ) => {
    const {
      target: { value },
    } = event;
    setCategory(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  // TODO: Add onClick event to submit form
  const handleSubmit = () => {
    setLoading(true);

    try {
      if (!location && !searchTerm) {
        setLocationError(true);
        setSearchTermError(true);
        setLoading(false);
        return;
      }

      if (!location) {
        setLocationError(true);
        setLoading(false);
        return;
      } else {
        setLocationError(false);
        setLoading(false);
      }

      if (!searchTerm) {
        setSearchTermError(true);
        setLoading(false);
        return;
      } else {
        setSearchTermError(false);
        setLoading(false);
      }

      console.log("Form submitted");
      console.log("Location: ", location);
      console.log("Search Term: ", searchTerm);
      console.log("Categories: ", category);
      console.log("Radius: ", radius);
      setLoading(false);
    } catch (error) {
      console.log("Error submitting form");
      setLoading(false);
    }
  };

  return (
    <>
      {/* Left Grid */}
      <Grid container spacing={2} paddingTop={7}>
        <Grid
          display="flex"
          justifyContent="center"
          alignItems="center"
          size={4}
        >
          <Stack
            component="form"
            sx={{ width: "25ch" }}
            spacing={2}
            noValidate
            autoComplete="off"
          >
            {/* Handle Empty Location */}
            {locationError ? (
              <TextField
                error
                required
                id="location-input"
                label="Location"
                type="text"
                helperText="(e.g., city or zip code)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            ) : (
              <TextField
                required
                id="location-input"
                label="Location"
                type="text"
                helperText="(e.g., city or zip code)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            )}

            {/* Handle Empty Search Term */}
            {searchTermError ? (
              <TextField
                error
                required
                id="search-term-input"
                label="Search Term"
                helperText="(e.g., restraunts, bar, etc...)"
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            ) : (
              <TextField
                required
                id="search-term-input"
                label="Search Term"
                helperText="(e.g., restraunts, bar, etc...)"
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            )}

            {/* TODO: Fix Category label */}
            <FormControl style={{ paddingBottom: 10 }}>
              <InputLabel id="category-multitple-chip-label">
                Category
              </InputLabel>
              <Select
                labelId="category-multitple-chip-label"
                id="category-multitple-chip"
                multiple
                value={category}
                onChange={handleChangeCategories}
                input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </Box>
                )}
              >
                {yelpCategories.map((name) => (
                  <MenuItem key={name} value={name}>
                    {name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              id="radius-input"
              label="Radius"
              type="number"
              value={radius}
              onChange={(e) => setRadius(parseInt(e.target.value))}
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
            />

            {/* TODO: add OnClick Event */}
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Loading..." : "Submit"}
            </Button>
          </Stack>
        </Grid>

        {/* Right Grid */}
        <Grid
          display="flex"
          justifyContent="center"
          alignItems="center"
          size={8}
        >
          Right Grid Area
        </Grid>
      </Grid>
    </>
  );
};

export default YelpForm;
