import axios from 'axios';
import { Request, Response } from 'express';

export const checkQdrantStatus = async (req: Request, res: Response) => {
  try {
    const response = await axios.get('http://vectordb:6333/');

    if (response.status === 200) {
      res.send('Qdrant is up and running');
    } else {
      res.status(500).send('Qdrant is not responding as expected');
    }
  } catch (error) {
    // Access the error message directly, assuming Axios error
    const errorMessage = axios.isAxiosError(error) ? error.message : 'An unknown error occurred';
    res.status(500).send(`Error connecting to Qdrant: ${errorMessage}`);
  }
};

