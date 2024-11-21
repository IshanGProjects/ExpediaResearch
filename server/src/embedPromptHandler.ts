import { Request, Response } from 'express';
import { createEmbedding } from './createEmbedding';
import { storeEmbedding } from './storeEmbedding';

/**
 * Endpoint handler to generate an embedding and store it in Qdrant.
 * @param req Request object
 * @param res Response object
 */
export async function embeddingPromptHandler(req: Request, res: Response): Promise<void> {
  const { prompt, metadata } = req.body;

  if (!prompt) {
    res.status(400).send('Prompt is required');
    return;
  }

  try {
    console.log('Received prompt:', prompt);
    const embedding = await createEmbedding(prompt);

    // Store embedding in Qdrant
    await storeEmbedding(embedding, { ...metadata, prompt });

    res.status(200).json({ message: 'Embedding generated and stored successfully' });
  } catch (error) {
    console.error('Error handling embedding prompt:', error);
    res.status(500).send('Failed to generate and store embedding');
  }
}
