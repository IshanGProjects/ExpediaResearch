import React from "react";
import {
  Grid2 as Grid,
  Card,
  CardContent,
  Typography,
  Box,
} from "@mui/material";

type SearchResult = {
  image: string;
  activity_name: string;
  time: string;
  date: string;
  location: string;
  details: string;
  link: string;
};

interface CardGridProps {
  searchResults: SearchResult[];
}

const CardGrid: React.FC<CardGridProps> = ({ searchResults }) => {
  // If there are no cards, we don't want the background to come up
  if (searchResults.length === 0) {
    return null;
  }

  return (
    <Box
      sx={{
        backgroundColor: "#FFEE58",
        padding: 2,
        maxWidth: "100%",
        margin: "0 auto",
      }}
    >
      <Grid container spacing={3} sx={{ mt: 4, px: 4 }}>
        {searchResults.map((result, index) => (
          <Grid
            size={{ xs: 12, sm: 6, md: 4 }}
            sx={{ display: "flex", justifyContent: "center" }}
            key={index}
          >
            <Card
              sx={{
                minHeight: 200,
                width: 550,
                borderRadius: 3,
                display: "flex",
                flexDirection: "column",
                mb: 2,
              }}
            >
              <CardContent
                sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
              >
                <img
                  src={result.image}
                  alt={result.activity_name}
                  style={{
                    width: "100%",
                    height: "150px",
                    objectFit: "cover",
                    marginBottom: "10px",
                  }}
                />
                <Typography variant="h6">{result.activity_name}</Typography>
                <Typography variant="body2">{result.details}</Typography>
                <Typography variant="caption">
                  {result.time} - {result.date}
                </Typography>
                <Typography variant="caption" display="block">
                  {result.location}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default CardGrid;
