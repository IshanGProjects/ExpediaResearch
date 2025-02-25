import React from "react";
import { Grid2 as Grid, Card, CardContent, Typography } from "@mui/material";

interface SearchResult {
    title: string;
    description: string;
};

interface CardGridProps {
    searchResults: SearchResult[];
};

const CardGrid: React.FC<CardGridProps> = ({ searchResults }) => {
  return (
    <Grid container spacing={3} sx={{ mt: 4, px: 4 }}>
      {searchResults.map((result, index) => (
        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
          <Card sx={{ minHeight: 200, borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6">{result.title}</Typography>
              <Typography variant="body2">{result.description}</Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default CardGrid;
