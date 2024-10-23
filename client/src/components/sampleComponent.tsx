import React, { useEffect } from "react";
import axios from "axios";

const SampleComponent: React.FC = () => {
  const fetchData = async (): Promise<void> => {
    try {
      console.log("Attempting to fetch data...");
      const response = await axios.get<string>("http://localhost:8001/test"); // TypeScript expects the response to be a string
      console.log("Server Response:", response.data); // Axios response body is in 'data'
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("Axios Error fetching data:", error.message);
      } else {
        console.error("Unexpected Error:", error);
      }
    }
  };

  // useEffect to call the function when the component mounts
  useEffect(() => {
    fetchData();
  }, []); // Empty dependency array to ensure it runs only once when the component mounts

  return (
    <div className="SampleComponent">
      <h1>Sample Component</h1>
    </div>
  );
};

export default SampleComponent;
