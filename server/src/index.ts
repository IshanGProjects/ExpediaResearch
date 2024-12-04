import cors from 'cors';
import express, { Request, Response } from 'express';
import process from 'process';
import OpenAIApi from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

// Enable CORS
app.use(cors());

// Start the server, ensuring that the port is properly typed
const port = Number(process.env.EXPRESS_PORT) || 8000;

app.listen(port, () => {
  console.log(`App server now listening on port ${port}`);
});

app.get('/test', (req: Request, res: Response) => {
  res.send('Server check verified');
});

// OpenAI API route
app.post("/api/extract-weather", async (req: Request, res: Response): Promise<any> => {
  const location = req.body.location
  const date = req.body.date

  try {

    /* 
    // get response from OpenAI based on user prompt
    const response = await openai.chat.completions.create({
   
    let keywords;
    let content = response.choices[0].message.content;
    if (content) {
      try {
        // Clean up the response   
        content = content.replace(/```json|```/g, "").trim();
        const keywords = JSON.parse(content);

        return res.status(200).json({ keywords });
      } catch (error) {
        console.log("Error in parsing JSON: ", error);
        return res
          .status(500)
          .json({ error: "Failed to parse JSON from OpenAI response." });
      }
    }

    */

    // Validate input
  if (!location || !date) {
    return res.status(400).json({ error: 'Missing location or date parameter' });
  }

  // Respond with the received parameters
  res.status(200).json({
    location,
    date,
  });

  } catch (error) {


    /*
    console.error("Error in extracting keywords: ", error);
    return res.status(500).json({ error: "Failed to extract keywords" });
    */
  }
});



