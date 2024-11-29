import { Request, Response } from 'express';
import axios from 'axios';
import process from 'process';
import dotenv from 'dotenv';

dotenv.config();

// OpenAIService.ts

export class OpenAIService {
    private apiKey = process.env.OPENAI_API_KEY;
  
    async analyzePrompt(req: Request, res: Response): Promise<JSON> {
      // Call to OpenAI API (this is a simplified example)
      const { prompt, metadata } = req.body;

      if (!prompt) {
        res.status(400).send('Prompt is required');
        return JSON.parse(`{"error":"error"}`);
      }

      const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: "gpt-3.5-turbo",
        messages: [
            { role: "user", content: `Given the prompt, "${prompt}" generate a JSON array ranking how applicable each service is for this prompt. Use the format:

[
  {
    "service": "Ticketing",
    "applicability": "XX"
  },
  {
    "service": "Bookings",
    "applicability": "XX"
  },
  {
    "service": "Restaurants",
    "applicability": "XX"
  }
]

- "Applicability" reflects the relevance of each service for fulfilling the user's goal.
- Rank each service from 0% (irrelevant) to 100% (highly relevant).
- In the JSON object dont include the percent symbol in the applicability value.
- For context: The "Ticketing" service provides tickets to events, "Bookings" helps with travel accommodations, and "Restaurants" suggests nearby dining options.
Return only the JSON object as a string.`,
            },  
          ],
          max_tokens: 100,
          temperature: 0.5,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`
          },
        }
      );
  
      const data = response.data;

      return this.filterOpenAIResponse(data.choices[0].message.content);
    }
  
    private filterOpenAIResponse(response: string): JSON {
        let services;
        const threshold = 50;
    
        try {
            services = JSON.parse(response);
        } catch (error) {
            console.error("Invalid JSON string:", error);
            return JSON.parse(`{"error":"error"}`);
        }
    
        let filteredServices: JSON = services.filter((item: any) => {
            const applicabilityValue = parseInt(item.applicability, 10);
            return applicabilityValue >= threshold;
        });

    
        return filteredServices;
    }
  }
  