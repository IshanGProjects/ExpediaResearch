import React from "react";
import NavBar from "../components/NavBar";
import Search from "../components/Search";
import ItineraryGrid from "../components/ItenararyCoverContainer";
import CardGrid from "../components/CardGrid";
import Footer from "../components/Footer";
import { Box } from "@mui/material";
import axios from "axios";

const Home = () => {
  const [userPrompt, setUserPrompt] = React.useState("");
  const [searchResults, setSearchResults] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  const sampleItineraries = [
    {
      image: "/default_restaurant_1.jpeg",
      title: "Rocky Mountain Hike",
      location: "Colorado, USA",
      description: "A scenic route through the Rockies with panoramic views.",
    },
    {
      image: "/default_restaurant_1.jpeg",
      title: "Golden Gate Adventure",
      location: "San Francisco, CA",
      description: "Explore the city by the bay and its famous landmarks.",
    },
    {
      image: "/default_restaurant_1.jpeg",
      title: "Golden Gate Adventure",
      location: "San Francisco, CA",
      description: "Explore the city by the bay and its famous landmarks.",
    },
    {
      image: "/default_restaurant_1.jpeg",
      title: "Golden Gate Adventure",
      location: "San Francisco, CA",
      description: "Explore the city by the bay and its famous landmarks.",
    },
    {
      image: "/default_restaurant_1.jpeg",
      title: "Golden Gate Adventure",
      location: "San Francisco, CA",
      description: "Explore the city by the bay and its famous landmarks.",
    },
    {
      image: "/default_restaurant_1.jpeg",
      title: "Golden Gate Adventure",
      location: "San Francisco, CA",
      description: "Explore the city by the bay and its famous landmarks.",
    },
    {
      image: "/default_restaurant_1.jpeg",
      title: "Golden Gate Adventure",
      location: "San Francisco, CA",
      description: "Explore the city by the bay and its famous landmarks.",
    },
  ];

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
          <ItineraryGrid itineraries={sampleItineraries} />;
          <CardGrid searchResults={searchResults} loading={loading} />
        </Box>

        {/* Footer - Stays at the Bottom */}
        <Footer />
      </Box>
    </>
  );
};

export default Home;
