import React from "react";
import CardSkeleton from "./CardSkeleton";
import CardModal from "./CardModal";
import TravelPic from "../assets/TravelPicture.jpg";
import DefaultRestaurantPic from "../assets/default_restaurant_1.jpeg";
import DefaultRestaurantPic2 from "../assets/default_restaurant_2.jpeg";
import DefaultRestaurantPic3 from "../assets/default_restaurant_3.jpg";
import DefaultRestaurantPic4 from "../assets/default_restaurant_4.jpeg";
import DefaultRestaurantPic5 from "../assets/default_restaurant_5.jpeg";
import DefaultRestaurantPic6 from "../assets/default_restaurant_6.jpg";
import DefaultRestaurantPic7 from "../assets/default_restaurant_7.jpg";
import DefaultRestaurantPic8 from "../assets/default_restaurant_8.jpg";
import DefaultRestaurantPic9 from "../assets/default_restaurant_9.jpg";
import DefaultRestaurantPic10 from "../assets/default_restaurant_10.jpg";
import DefaultRestaurantPic11 from "../assets/default_restaurant_11.jpeg";
import DefaultRestaurantPic12 from "../assets/default_restaurant_12.jpeg";
import DefaultHotelPic1 from "../assets/hotel_1.jpeg";
import DefaultHotelPic2 from "../assets/hotel_2.jpeg";
import DefaultHotelPic3 from "../assets/hotel_3.jpeg";
import DefaultHotelPic4 from "../assets/hotel_4.jpg";
import DefaultHotelPic5 from "../assets/hotel_5.jpeg";
import DefaultHotelPic6 from "../assets/hotel_6.jpeg";
import DefaultHotelPic7 from "../assets/hotel_7.jpeg";
import DefaultHotelPic8 from "../assets/hotel_8.jpeg";
import DefaultHotelPic9 from "../assets/hotel_9.jpeg";
import DefaultHotelPic10 from "../assets/hotel_10.jpg";
import DefaultHotelPic11 from "../assets/hotel_11.jpg";
import DefaultHotelPic12 from "../assets/hotel_12.jpeg";
import {
  Grid2 as Grid,
  Card,
  CardMedia,
  Typography,
  Box,
  CardActionArea,
} from "@mui/material";

type SearchResult = {
  service: string;
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

const DefaultRestaurantImages = [
  DefaultRestaurantPic,
  DefaultRestaurantPic2,
  DefaultRestaurantPic3,
  DefaultRestaurantPic4,
  DefaultRestaurantPic5,
  DefaultRestaurantPic6,
  DefaultRestaurantPic7,
  DefaultRestaurantPic8,
  DefaultRestaurantPic9,
  DefaultRestaurantPic10,
  DefaultRestaurantPic11,
  DefaultRestaurantPic12,
];

const DefaultHotelImages = [
  DefaultHotelPic1,
  DefaultHotelPic2,
  DefaultHotelPic3,
  DefaultHotelPic4,
  DefaultHotelPic5,
  DefaultHotelPic6,
  DefaultHotelPic7,
  DefaultHotelPic8,
  DefaultHotelPic9,
  DefaultHotelPic10,
  DefaultHotelPic11,
  DefaultHotelPic12,
];


const CardGrid: React.FC<CardGridProps> = ({ searchResults, loading }) => {
  const [selectedCard, setSelectedCard] = React.useState(0);
  const [openModal, setOpenModal] = React.useState(false);
  const [selectedCardData, setSelectedCardData] =
    React.useState<SearchResult | null>(null);

  const handleOpenModal = (index: number, card: SearchResult) => {
    setSelectedCard(index);
    setSelectedCardData(card);
    setOpenModal(true);
  };

  // Show background picture if not loading and no search results
  if (!loading && searchResults.length === 0) {
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
          : searchResults.slice(0, 12).map((result, index) => (
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
                  <CardActionArea
                    onClick={() => handleOpenModal(index, result)}
                    data-active={selectedCard === index ? "" : undefined}
                    sx={{
                      height: "100%",
                      "&[data-active]": {
                        backgroundColor: "action.selected",
                        "&:hover": {
                          backgroundColor: "action.selectedHover",
                        },
                      },
                    }}
                  >
                    {result.service === "Restaurants" ? (
                      
                      <CardMedia
                        component="img"
                        height={250}
                        image={result.image || DefaultRestaurantImages[Math.floor(Math.random() * DefaultRestaurantImages.length)]}
                        alt={result.activity_name || "Default Restaurant Picture"}
                        sx={{ objectFit: "cover", borderRadius: "4px 4px 0 0" }}
                      />
                    ) : result.service === "Ticketing" ? (
                      <CardMedia
                        component="img"
                        height={250}
                        image={result.image}
                        alt={result.activity_name}
                        sx={{ objectFit: "cover", borderRadius: "4px 4px 0 0" }}
                      />
                    ) : result.service === "Accommodations" ? (
                      <CardMedia
                        component="img"
                        height={250}
                        image={result.image || DefaultHotelImages[Math.floor(Math.random() * DefaultHotelImages.length)]}
                        alt={result.activity_name}
                        sx={{ objectFit: "cover", borderRadius: "4px 4px 0 0" }}
                      />
                    ): null}
                    
                    

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
                    
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
      </Grid>
      {/* Modal */}
      <CardModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        searchResult={selectedCardData}
      />
    </Box>
  );
};

export default CardGrid;
