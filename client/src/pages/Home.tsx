import React from "react";
import NavBar from "../components/NavBar";
import Search from "../components/Search";
import ItineraryGrid from "../components/ItenararyCoverContainer";
import CardGrid from "../components/CardGrid";
import Footer from "../components/Footer";
import { Box } from "@mui/material";
import { useAuth } from "../context/AuthContent";
import axios from "axios";

// Define the Itinerary type
interface Itinerary {
  image: string;
  title: string;
  location: string;
  description: string;
}

const Home = () => {
  const [userPrompt, setUserPrompt] = React.useState("");
  const [searchResults, setSearchResults] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  // const sampleItineraries = [
  //   {
  //     image: "/default_restaurant_1.jpeg",
  //     title: "Gourmet Bistro",
  //     location: "New York, NY",
  //     description: "A fine dining experience with a touch of elegance.",
  //   },
  //   {
  //     image: "/default_restaurant_2.jpeg",
  //     title: "Coastal Seafood Grill",
  //     location: "Miami, FL",
  //     description: "Fresh seafood with a view of the ocean.",
  //   },
  //   {
  //     image: "/default_restaurant_4.jpeg",
  //     title: "Mountain View Café",
  //     location: "Denver, CO",
  //     description: "Cozy café with stunning mountain views.",
  //   },
  //   {
  //     image: "/default_restaurant_5.jpeg",
  //     title: "Urban Steakhouse",
  //     location: "Chicago, IL",
  //     description: "Premium steaks in a modern urban setting.",
  //   },
  //   {
  //     image: "/default_restaurant_11.jpeg",
  //     title: "Sushi Haven",
  //     location: "San Francisco, CA",
  //     description: "Authentic Japanese sushi with fresh ingredients.",
  //   },
  //   {
  //     image: "/default_restaurant_8.jpg",
  //     title: "Pasta Paradise",
  //     location: "Los Angeles, CA",
  //     description: "Delicious Italian pasta dishes made from scratch.",
  //   },
  // ];
  const { token } = useAuth();
  const [existingItineraries, setExistingItineraries] = React.useState<any[]>(
    []
  );

  // Fetch existing itineraries
  React.useEffect(() => {
    const fetchItineraries = async () => {
      try {
        if (!token || typeof token !== "string") {
          console.error("Token is missing, invalid, or not a string.");
          return;
        }

        const response = await axios.post("http://localhost:8000/itineraries", {
          userID: token.trim(),
        });
        setExistingItineraries(response.data || []);
      } catch (error) {
        console.error("Error fetching itineraries:", error);
      }
    };

    if (token) {
      fetchItineraries();
    }
  }, [token]);

  function formatField(value: any): string {
    if (typeof value === "string") return value;

    if (typeof value === "object" && value !== null) {
      return Object.values(value).filter(Boolean).join(", ");
    }

    return "";
  }

  const handleSubmit = async () => {
    setLoading(true);
    setError(false);

    if (userPrompt === "") {
      setError(true);
      setErrorMessage("Please enter a prompt");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post("http://localhost:8000/promptOpenAI", {
        prompt: userPrompt,
      });

      const data = response.data;

      const flattenedResults = data
        .filter((service: any) => Array.isArray(service.data))
        .flatMap((service: any) =>
          service.data.map((activity: any) => ({
            ...activity,
            service: service.service, // 🔥 inject service name into each item
            location: formatField(activity.location),
            date: formatField(activity.date),
            time: formatField(activity.time),
            details: formatField(activity.details),
          }))
        );

      setSearchResults(flattenedResults);
    } catch (error) {
      setError(true);
      setErrorMessage("Error getting activities");
      console.log("Error in querying data.");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh", // Ensures the page takes up full height
        }}
      >
        {/* Main Content */}
        <Box sx={{ flex: 1 }}>
          <NavBar />
          <Search
            userPrompt={userPrompt}
            setUserPrompt={setUserPrompt}
            handleSearch={handleSubmit}
            loading={loading}
            error={error}
            errorMessage={errorMessage}
          />

          <ItineraryGrid
            itineraries={existingItineraries.map((itinerary) => {
              const { cover } = itinerary;
              return {
                image: cover.image,
                title: cover.title,
                location: cover.location,
                description: cover.description,
              } as Itinerary;
            })}
          />
          <CardGrid searchResults={searchResults} loading={loading} />
        </Box>

        {/* Footer - Stays at the Bottom */}
        <Footer />
      </Box>
    </>
  );
};

export default Home;
