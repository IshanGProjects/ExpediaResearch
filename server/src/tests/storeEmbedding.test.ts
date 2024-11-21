import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { ensureCollectionExists, storeEmbedding } from '../storeEmbedding';

const QDRANT_URL = 'http://vectordb:6333';
const COLLECTION_NAME = 'embeddings';

jest.setTimeout(30000);

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
      // Avoid logging the entire response object
      console.log(`Point with ID ${pointId} deleted. Status: ${response.status}`);
    } catch (error: any) {
      console.error('Failed to delete point:', error.response?.data || error.message);
    }
}

describe('Qdrant Embeddings Collection Tests', () => {
    let pointId: string;
  
    beforeAll(async () => {
      await ensureCollectionExists();
    });
  
    it('should create and verify a point', async () => {
      const testVector = Array(1536).fill(0.1);
      const testPayload = { author: 'Test User', category: 'test', prompt: 'Test prompt' }; 

      const pointId = await storeEmbedding(testVector, { ...testPayload });

      console.log('endpoint', `${QDRANT_URL}/collections/${COLLECTION_NAME}/points/${pointId}`)
  
      const endpoint = `${QDRANT_URL}/collections/${COLLECTION_NAME}/points/${pointId}`;
      const response = await axios.get(endpoint);
  
      // Log response status and data to avoid circular structure
      console.log('Response Status:', response.status);
      console.log('Response Data:', response.data.id);
  
      expect(response.status).toBe(200);
      expect(response.data.result.id).toBe(pointId);
    });
  
  });
