import cors from 'cors';
import express, { Request, Response } from 'express';
import axios from 'axios';
import process from 'process';
import { checkQdrantStatus } from './qdrantHandler'

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
app.get('/qdrant-test', checkQdrantStatus);
