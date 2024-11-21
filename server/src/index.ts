import cors from 'cors';
import express, { Request, Response } from 'express';
import process from 'process';
import OpenAIApi from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
<<<<<<< HEAD

import { TicketmasterAPI } from "./factories/TicketmasterAPI";
import { TripAdvisorAPI } from "./factories/TripAdvisorAPI";
import { WeatherAPI } from "./factories/WeatherAPI";

// Concrete factories
// TODO move these to more appropriate class
const ticketmaster = new TicketmasterAPI(process.env.TICKETMASTER_API_KEY || "");
const tripadvisor = new TripAdvisorAPI(process.env.TRIPADVISOR_API_KEY || "");
const weather = new WeatherAPI(process.env.WEATHER_API_KEY || "");

=======
app.use(express.json());
>>>>>>> b1f5768 (Fixed error where POST request wasn't working and added dotenv library)

// Enable CORS
app.use(cors());

app.use(express.json());

// Initialize OpenAI API with API key
const openai = new OpenAIApi({
  apiKey: process.env.OPENAI_API_KEY, // add a key to .env file from group openai account
});

// Start the server, ensuring that the port is properly typed
const port = Number(process.env.EXPRESS_PORT) || 8000;

app.listen(port, () => {
  console.log(`App server now listening on port ${port}`);
});

app.get('/test', (req: Request, res: Response) => {
  res.send('Server check verified');
});

// OpenAI API route
app.post("/api/extract-keywords", async (req: Request, res: Response): Promise<any> => {
  const userPrompt = req.body.userPrompt;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // Use the appropriate model
      messages: [
        {
          role: "user",
          content: `Please analyze the following user prompt: "${userPrompt}". Extract any travel-related keywords and respond in JSON format, following this structure:
                    {
                      "location": "Extracted location if any like state, country, otherwise leave empty",
                      "time": "Extracted time or date if any, otherwise leave empty",
                      "activities": "Extracted activities or things to do if any, otherwise leave empty"
                    }.
                    Respond only in JSON format, without additional text.`,
        },
      ],
    });

    let keywords;
    let content = response.choices[0].message.content;
    if (content) {
      try {
        content = content.replace(/```json|```/g, "").trim();
        const keywords = JSON.parse(content);

        // Parse keywords into variables
        const location = keywords.location || '';
        const time = keywords.time || '';
        const activities = keywords.activities || '';

        // API calls to external services
        // TODO these could be handled outside of this route
        const ticketmasterResult = ticketmaster.makeAPICall(location, time, activities);
        const tripadvisorResult = tripadvisor.makeAPICall(location, time, activities);
        const weatherResult = weather.makeAPICall(location, time, activities);
        
        console.log("API Response:", ticketmasterResult);
        console.log("API Response:", tripadvisorResult);
        console.log("API Response:", weatherResult);

        // Return keywords and API results
        return res.json({
          keywords,
          ticketmasterResult,
          tripadvisorResult,
          weatherResult
        });

      } catch (error) {
        console.log("Error in parsing JSON: ", error);
        return res
          .status(500)
          .json({ error: "Failed to parse JSON from OpenAI response." });
      }
    }

    res.json({ keywords });
  } catch (error) {
    console.error("Error in extracting keywords: ", error);
    return res.status(500).json({ error: "Failed to extract keywords" });
  }
});
