import cors from 'cors';
import express, { Request, Response } from 'express';
import process from 'process';
import OpenAIApi from 'openai';

const app = express();


// Enable CORS
app.use(cors());

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
  const userPrompt = req.body.prompt;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // Use the appropriate model
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
    const content = response.choices[0].message.content;
    if (content) {
      try {
        const keywords = JSON.parse(content);
        return res.json({ keywords });
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



