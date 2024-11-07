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
app.post("/api/extract-keywords", async (req, res) => {
  const userPrompt = req.body.prompt;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // Use the appropriate model
      messages: [
        {
          role: "user",
          content: `Extract travel-related keywords from the following prompt: "${userPrompt}".`,
        },
      ],
    });


    const keywords = response.choices[0].message.content;

    res.json({ keywords });
  } catch (error) {
    console.log("Error in extracting keywords: ", error);
    res.status(500).json({ error: "Failed to extract keywords" });
  }
});



