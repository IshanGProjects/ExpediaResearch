import { Request, Response } from 'express';
import axios from 'axios';
import process from 'process';
import dotenv from 'dotenv';

dotenv.config();

// Define the expected result type for OpenAI analysis
interface AnalysisResult {
  service: string;
  applicability: number;
}

export class OpenAIService {
  private apiKey = process.env.OPENAI_API_KEY;

  async analyzePrompt(req: Request, res: Response): Promise<AnalysisResult[]> {
    console.log("API KEY: " + this.apiKey);

    const { prompt } = req.body;

    if (!prompt) {
      res.status(400).send('Prompt is required');
      return [];
    }

    try {
      // Call to OpenAI API
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "user",
              content: `Given the prompt, "${prompt}" generate a JSON array ranking how applicable each service is for this prompt. Use the format:
              
[
  {
    "service": "Ticketing",
    "applicability": "XX"
  },
  {
    "service": "Accommodations",
    "applicability": "XX"
  },
  {
    "service": "Restaurants",
    "applicability": "XX"
  }
]

- "Applicability" reflects the relevance of each service for fulfilling the user's goal.
- Rank each service from 0% (irrelevant) to 100% (highly relevant).
- In the JSON object, don't include the percent symbol in the applicability value.
- For context: The "Ticketing" service provides tickets to events, "Accomodations" helps with travel accommodations, and "Restaurants" suggests nearby dining options.
Return only the JSON object as a string.`,
            },
          ],
          max_tokens: 100,
          temperature: 0.5,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`,
          },
        }
      );

      const data = response.data;

      return this.filterOpenAIResponse(data.choices[0].message.content);
    } catch (error) {
      console.error('Error calling OpenAI API:', error);
      res.status(500).send('Failed to analyze the prompt.');
      return [];
    }
  }

  /**
   * Filters the OpenAI response to include only services with applicability >= threshold.
   * @param response - JSON string from OpenAI API.
   * @returns Filtered array of AnalysisResult.
   */
  private filterOpenAIResponse(response: string): any {
    let services;
    const threshold = 50;
  
    try {
      // Attempt to parse the JSON response
      services = JSON.parse(response);
    } catch (error) {
      console.error("Invalid JSON string:", error);
      console.error("Raw response from OpenAI:", response);
  
      // Return an empty result to prevent crashing
      return [];
    }
  
    // Filter services based on applicability threshold
    return services.filter((item: any) => {
      const applicabilityValue = parseInt(item.applicability, 10);
      return applicabilityValue >= threshold;
    });
  }
  
}
