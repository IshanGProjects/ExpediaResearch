import { Request, Response } from 'express';
import { createEmbedding } from './createEmbedding';

/**
 * Endpoint handler to generate an embedding for a given prompt.
 * @param req Request object
 * @param res Response object
 */
export async function embeddingPromptHandler(req: Request, res: Response): Promise<void> {
  const { prompt } = req.body;

  if (!prompt) {
    res.status(400).send('Prompt is required');
    return;
  }

  try {
    const embedding = await createEmbedding(prompt);
    res.status(200).json({ embedding });
  } catch (error) {
    res.status(500).send('Failed to generate embedding');
  }
}
