import cors from 'cors';
import express, { Request, Response } from 'express';
import axios from 'axios';
import process from 'process';

const app = express();

// Enable CORS
app.use(cors());

// Start the server, ensuring that the port is properly typed
const port = Number(process.env.EXPRESS_PORT) || 8000;

app.listen(port, () => {
  console.log(`App server now listening on port ${port}`);
});

// Test server endpoint
app.get('/test', (req: Request, res: Response) => {
  res.send('Server check verified');
});

// Qdrant validation endpoint
app.get('/qdrant-test', async (req: Request, res: Response) => {
  try {
    // Connect to Qdrant's root endpoint to check its status
    const response = await axios.get('http://vectordb:6333/');

    if (response.status === 200) {
      res.send('Qdrant is up and running');
    } else {
      res.status(500).send('Qdrant is not responding as expected');
    }
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      res.status(500).send(`Error connecting to Qdrant: ${error.message}`);
    } else {
      res.status(500).send('An unknown error occurred');
    }
  }
});
