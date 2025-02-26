import React from "react";
import NavBar from "../components/NavBar";
import Search from "../components/Search";
import CardGrid from "../components/CardGrid";
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
      <NavBar />
      <Search
        userPrompt={userPrompt}
        setUserPrompt={setUserPrompt}
        handleSearch={handleSubmit}
        loading={loading}
        error={error}
        errorMessage={errorMessage}
      />
      <CardGrid searchResults={searchResults} />
    </>
  );
};

export default Home;
