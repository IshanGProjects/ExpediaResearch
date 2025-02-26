import React from "react";
import NavBar from "../components/NavBar";
import Search from "../components/Search";
import CardGrid from "../components/CardGrid";
import axios from "axios";

const Home = () => {
  const [userPrompt, setUserPrompt] = React.useState("");
  const [searchResults, setSearchResults] = React.useState([]);

  const handleSubmit = async () => {
    // setLoading(true);
    // setError("");

    try {
      const response = await axios.post("http://localhost:8000/promptOpenAI", {
        prompt: userPrompt,
      });
      const data = response.data;
      setSearchResults(data.parsedActivities);
    } catch (error) {
      console.log("Error in handleSubmit");
      console.log(error);
    }
  };

  return (
    <>
      <NavBar />
      <Search
        userPrompt={userPrompt}
        setUserPrompt={setUserPrompt}
        handleSearch={handleSubmit}
      />
      <CardGrid searchResults={searchResults} />
    </>
  );
};

export default Home;
