import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

const QDRANT_URL = 'http://vectordb:6333';
const COLLECTION_NAME = 'embeddings';

/**
 * Ensure the collection exists in the Qdrant database. Creates it if missing.
 */
export async function ensureCollectionExists(): Promise<void> {
  const endpoint = `${QDRANT_URL}/collections/${COLLECTION_NAME}`;
  try {
    await axios.get(endpoint);
    console.log(`Collection "${COLLECTION_NAME}" already exists.`);
  } catch (error: any) {
    if (error.response?.status === 404) {
      console.log(`Collection "${COLLECTION_NAME}" not found. Creating...`);
      try {
        await axios.put(endpoint, {
          vectors: {
            size: 1536, // Match your embedding vector size
            distance: 'Cosine',
          },
          shard_number: 1, // Optional: Adjust for your setup
        });
        console.log(`Collection "${COLLECTION_NAME}" created successfully.`);
      } catch (creationError: any) {
        console.error('Failed to create collection:', creationError.response?.data || creationError.message);
        throw new Error('Failed to create Qdrant collection');
      }
    } else {
      console.error('Failed to check collection existence:', error.response?.data || error.message);
      throw new Error('Failed to ensure collection exists');
    }
  }
}

/**
 * Store an embedding in the Qdrant database.
 * @param vector The embedding vector.
 * @param payload Metadata associated with the vector.
 */
export async function storeEmbedding(vector: number[], payload: Record<string, any>): Promise<void> {
  const endpoint = `${QDRANT_URL}/collections/${COLLECTION_NAME}/points`;

  // Use UUID for unique point ID
  const id = uuidv4();

  const body = {
    points: [
      {
        id, // The same UUID as above
        vector: vector,
        payload: payload,
      },
    ],
    ids: [id] // Match the id in points
  };

  try {
    // Ensure the collection exists before inserting the point
    await ensureCollectionExists();

    // Insert the embedding
    const response = await axios.put(endpoint, body, {
      headers: { 'Content-Type': 'application/json' },
    });

    console.log('Embedding stored successfully:', response.data);
  } catch (error: any) {
    console.error('Failed to store embedding:', error.response?.data || error.message);
    throw new Error('Qdrant insertion failed');
  }
}
