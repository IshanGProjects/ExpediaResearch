import React from "react";
import CardSkeleton from "./CardSkeleton";
import {
  Grid2 as Grid,
  Card,
  CardContent,
  CardMedia,
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
  loading: boolean;
}

const CardGrid: React.FC<CardGridProps> = ({ searchResults, loading }) => {
  // Show background picture if not loading and no search results
  if (!loading && searchResults.length === 0) {
    const TravelPic = require("../assets/TravelPicture.jpg");
    return (
      <Box
        sx={{
          backgroundImage: `url(${TravelPic})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          width: "100%",
          height: "52.5vh", 
        }}
      />
    );
  }

  return (
    <Box
      sx={{
        padding: 2,
        maxWidth: "100%",
        margin: "0 auto",
      }}
    >
      <Grid container spacing={3} sx={{ mt: 4, px: 4 }}>
        {loading
          ? // SKELETON GRID
            Array.from({ length: 6 }).map((_, index) => (
              <Grid
                size={{ xs: 12, sm: 6, md: 4 }}
                key={index}
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <CardSkeleton />
              </Grid>
            ))
          : searchResults.map((result, index) => (
              <Grid
                size={{ xs: 12, sm: 6, md: 4 }}
                sx={{ display: "flex", justifyContent: "center" }}
                key={index}
              >
                <Card
                  sx={{
                    minHeight: 200,
                    width: 450,
                    borderRadius: 3,
                    display: "flex",
                    flexDirection: "column",
                    mb: 2,
                  }}
                >
                  {/* Image with Overlay Text */}
                  <Box sx={{ position: "relative" }}>
                    <CardMedia
                      component="img"
                      height={170}
                      image={result.image}
                      alt={result.activity_name}
                      sx={{ objectFit: "cover", borderRadius: "4px 4px 0 0" }}
                    />

                    {/* Overlay */}
                    <Box
                      sx={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        width: "100%",
                        background:
                          "linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0))",
                        color: "white",
                        padding: "4px",
                      }}
                    >
                      <Typography
                        variant="h6"
                        fontWeight="bold"
                        sx={{
                          fontSize: "0.9rm",
                          lineHeight: 1.2,
                          display: "-webkit-box",
                          WebkitBoxOrient: "vertical",
                          WebkitLineClamp: 2,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {result.activity_name}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Card Content */}
                  <CardContent
                    sx={{
                      flexGrow: 1,
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Typography variant="subtitle1" color="textSecondary">
                      {result.location} | {result.date} | {result.time}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      sx={{ minHeight: 50 }}
                    >
                      {result.details}
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
