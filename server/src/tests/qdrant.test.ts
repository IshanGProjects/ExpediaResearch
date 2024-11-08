import { checkQdrantStatus } from '../qdrantHandler';
import axios from 'axios';
import { Request, Response } from 'express';

jest.mock('axios');

describe('Qdrant Status Check', () => {
  it('should return success message if Qdrant is running', async () => {
    const req = {} as Request;
    const res = {
      send: jest.fn(),
      status: jest.fn().mockReturnThis(),
    } as Partial<Response> as Response;

    (axios.get as jest.Mock).mockResolvedValue({ status: 200 });

    await checkQdrantStatus(req, res);
    expect(res.send).toHaveBeenCalledWith('Qdrant is up and running');
  });

  it('should return error message if Qdrant is not responding', async () => {
    const req = {} as Request;
    const res = {
      send: jest.fn(),
      status: jest.fn().mockReturnThis(),
    } as Partial<Response> as Response;

    (axios.get as jest.Mock).mockResolvedValue({ status: 500 });

    await checkQdrantStatus(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith('Qdrant is not responding as expected');
  });

  it('should return error message on connection issue with Qdrant', async () => {
    const req = {} as Request;
    const res = {
      send: jest.fn(),
      status: jest.fn().mockReturnThis(),
    } as Partial<Response> as Response;

    (axios.get as jest.Mock).mockRejectedValue(new Error('Network Error'));

    await checkQdrantStatus(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect((res.send as jest.Mock).mock.calls[0][0]).toContain('Error connecting to Qdrant:');
  });
});
