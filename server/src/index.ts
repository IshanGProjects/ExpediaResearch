import cors from 'cors';
import express, { Request, Response } from 'express';
import process from 'process';

const app = express();


// Enable CORS
app.use(cors());

// Start the server, ensuring that the port is properly typed
const port = Number(process.env.EXPRESS_PORT) || 8001;

app.listen(port, () => {
  console.log(`App server now listening on port ${port}`);
});

app.get('/test', (req: Request, res: Response) => {
  res.send('Server check verified');
});




