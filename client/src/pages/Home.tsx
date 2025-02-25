import React from "react";
import NavBar from "../components/NavBar";
import Search from "../components/Search";
import CardGrid from "../components/CardGrid";

// TEMP DATA DELETE LATER
const testResults = [
  { title: "Card 1", description: "Card 1 Description" },
  { title: "Card 2", description: "Card 2 Description" },
  { title: "Card 3", description: "Card 3 Description" },
  { title: "Card 4", description: "Card 4 Description" },
];

const Home = () => {
  const [userPrompt, setUserPrompt] = React.useState("");

  // function to handle search
  const handleSearch = () => {
    console.log("User Input: " + userPrompt);
  };

  return (
    <>
      <NavBar />
      <Search
        userPrompt={userPrompt}
        setUserPrompt={setUserPrompt}
        handleSearch={handleSearch}
      />
      <CardGrid searchResults={testResults} />
    </>
  );
};

export default Home;
