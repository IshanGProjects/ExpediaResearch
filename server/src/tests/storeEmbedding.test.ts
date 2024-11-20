import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { ensureCollectionExists, storeEmbedding } from '../storeEmbedding';

const QDRANT_URL = 'http://vectordb:6333';
const COLLECTION_NAME = 'embeddings';

/**
 * Deletes a point from the Qdrant database by ID.
 */
async function deletePoint(pointId: string): Promise<void> {
  const endpoint = `${QDRANT_URL}/collections/${COLLECTION_NAME}/points/delete`;
  try {
    const body = {
      filter: {
        must: [
          {
            key: 'id',
            match: { value: pointId },
          },
        ],
      },
    };
    const response = await axios.post(endpoint, body, {
      headers: { 'Content-Type': 'application/json' },
    });
    console.log(`Point with ID ${pointId} deleted. Response:`, response.data);
  } catch (error: any) {
    console.error('Failed to delete point:', error.response?.data || error.message);
  }
}

describe('Qdrant Embeddings Collection Tests', () => {
  let pointId: string;

  beforeAll(async () => {
    // Ensure the embeddings collection exists
    await ensureCollectionExists();
  });

  it('should create a collection if none exist, add a point, and verify it exists', async () => {
    // Generate a unique ID for the test point
    pointId = uuidv4();
    const testVector = Array(1536).fill(0.1); // Example vector
    const testPayload = { author: 'Test User', category: 'test', prompt: 'Test prompt' };

    // Store the embedding in the collection
    await storeEmbedding(testVector, { ...testPayload, id: pointId });

    // Retrieve the point using GET /collections/{collection_name}/points/{id}
    const endpoint = `${QDRANT_URL}/collections/${COLLECTION_NAME}/points/${pointId}`;
    console.log('Verifying point exists:', endpoint);
    const response = await axios.get(endpoint, {
      headers: { 'Content-Type': 'application/json' },
    });

    // Verify the point exists in the database
    expect(response.status).toBe(200);
    expect(response.data.result.id).toBe(pointId);
    console.log('Point verified successfully:', response.data.result);
  });

  afterAll(async () => {
    // Delete the test point
    await deletePoint(pointId);
  });
});
