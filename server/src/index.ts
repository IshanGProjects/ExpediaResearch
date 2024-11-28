import cors from 'cors';
import express, { Request, Response } from 'express';
import axios from 'axios';
import process from 'process';
import { checkQdrantStatus } from './qdrantHandler';
import { embeddingPromptHandler } from './embedPromptHandler';
import { OpenAIService } from './factories/OpenAIService'

const app = express();

const openAIService = new OpenAIService();

// Enable CORS
app.use(cors());

// Add this middleware to parse JSON bodies
app.use(express.json());


// Start the server, ensuring that the port is properly typed
const port = Number(process.env.EXPRESS_PORT) || 8000;

app.listen(port, () => {
  console.log(`App server now listening on port ${port}`);
});

// Test server endpoint
app.get('/test', (req: Request, res: Response) => {
  console.log('Server check verified');
  res.send('Server check verified');
});

// Endpoint to generate embeddings
app.post('/generate-embedding', (req, res) => {
  console.log('Request received');
  embeddingPromptHandler(req, res);
});

app.post('/promptOpenAI', (req, res) => {
    console.log('Request received');
    openAIService.analyzePrompt(req, res);
})


// Qdrant validation endpoint
app.get('/qdrant-test', checkQdrantStatus);
