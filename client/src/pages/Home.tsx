import React from "react";
import NavBar from "../components/NavBar";
import Search from "../components/Search";
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
      setSearchResults(data.parsedActivities);
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
          <CardGrid searchResults={searchResults} loading={loading} />
        </Box>

        {/* Footer - Stays at the Bottom */}
        <Footer />
      </Box>
    </>
  );
};

export default Home;
