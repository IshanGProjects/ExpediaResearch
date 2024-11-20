import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { v4 as uuidv4 } from 'uuid';
import { storeEmbedding } from '../storeEmbedding';

const QDRANT_URL = 'http://vectordb:6333';
const COLLECTION_NAME = 'embeddings';

describe('storeEmbedding', () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(axios); // Mock Axios
  });

  afterEach(() => {
    mock.reset(); // Reset mocks after each test
  });

  it('should store an embedding successfully', async () => {
    const vector = [0.1, 0.2, 0.3];
    const payload = { prompt: 'Test prompt' };
  
    // Mock successful Qdrant API response
    mock.onPost(`${QDRANT_URL}/collections/${COLLECTION_NAME}/points`).reply(200, { result: 'success' });
  
    // Spy on console.log
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
  
    await storeEmbedding(vector, payload);
  
    // Check that the request was made with correct payload
    expect(mock.history.post.length).toBe(1);
    const requestData = JSON.parse(mock.history.post[0].data);
    expect(requestData.points[0].vector).toEqual(vector);
    expect(requestData.points[0].payload).toEqual(payload);
    expect(requestData.points[0].id).toBeTruthy();
  
    // Ensure success message was logged with two arguments
    expect(consoleLogSpy).toHaveBeenCalledWith(
      'Embedding stored successfully:',
      { result: 'success' }
    );
  
    consoleLogSpy.mockRestore();
  });
  

  it('should throw an error if Qdrant returns an error', async () => {
    const vector = [0.1, 0.2, 0.3];
    const payload = { prompt: 'Test prompt' };

    // Mock Qdrant API error response
    mock.onPost(`${QDRANT_URL}/collections/${COLLECTION_NAME}/points`).reply(400, { error: 'Bad Request' });

    // Expect the function to throw an error
    await expect(storeEmbedding(vector, payload)).rejects.toThrow('Qdrant insertion failed');
  });
});
