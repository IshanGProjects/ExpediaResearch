import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";
import ItineraryCoverCard from "./ItenararyCoverCard";
import VisionBoardModal from "./VisionBoardModal";
import { useSwipeable } from "react-swipeable";
import { useState } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";

type Itinerary = {
  image: string;
  title: string;
  location: string;
  description?: string;
};

type ItineraryGridProps = {
  itineraries: Itinerary[];
};

export default function ItineraryGrid({ itineraries }: ItineraryGridProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visionOpen, setVisionOpen] = useState(false);

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () =>
      setCurrentIndex((prev) => Math.min(prev + 1, itineraries.length - 1)),
    onSwipedRight: () => setCurrentIndex((prev) => Math.max(prev - 1, 0)),
    trackMouse: true,
  });

  const handleCardClick = () => {
    setVisionOpen(true);
  };

  return (
    <Box sx={{ px: { xs: 2, md: 4 }, py: 4 }}>
      <Typography
        level="h3"
        fontWeight="lg"
        sx={{ mb: 3, textAlign: "center" }}
      >
        Itineraries
      </Typography>

      {isMobile ? (
        <Box
          {...swipeHandlers}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
            width: "100%",
            overflow: "hidden",
            height: 400,
          }}
        >
          <Box
            sx={{
              display: "flex",
              transform: `translateX(-${currentIndex * 100}%)`,
              transition: "transform 0.4s ease-in-out",
              width: `${itineraries.length * 100}%`,
            }}
          >
            {itineraries.map((item, index) => (
              <Box
                key={index}
                sx={{
                  flex: "0 0 100%",
                  display: "flex",
                  justifyContent: "center",
                }}
                onClick={handleCardClick}
              >
                <ItineraryCoverCard {...item} />
              </Box>
            ))}
          </Box>
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            overflowX: "auto",
            gap: 3,
            pb: 2,
            scrollSnapType: "x mandatory",
          }}
        >
          {itineraries.map((item, index) => (
            <Box
              key={index}
              onClick={handleCardClick}
              sx={{
                flex: "0 0 auto",
                scrollSnapAlign: "start",
                cursor: "pointer",
              }}
            >
              <ItineraryCoverCard {...item} />
            </Box>
          ))}
        </Box>
      )}

      <VisionBoardModal
        open={visionOpen}
        onClose={() => setVisionOpen(false)}
      />
    </Box>
  );
}
