import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  
  /**
   * Generates an embedding for a given prompt using the ada-embedding model.
   * @param prompt The text prompt to embed.
   * @returns A Promise that resolves to the embedding array.
   */
  export async function createEmbedding(prompt: string): Promise<number[]> {

    console.log("api key", process.env.OPENAI_API_KEY)

    try {
      const response = await openai.embeddings.create({
        model: 'text-embedding-ada-002',
        input: prompt,
      });
      // Return the embedding vector from the response
      return response.data[0].embedding;
    } catch (error) {
      console.error('Error creating embedding:', error);
      throw new Error('Failed to create embedding');
    }
  }
  
