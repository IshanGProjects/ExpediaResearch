import { Request, Response } from 'express';
import fetch from 'node-fetch';

// OpenAIService.ts

export class OpenAIService {
    private apiKey = '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'; // Replace with your actual OpenAI API key
  
    async analyzePrompt(req: Request, res: Response): Promise<string> {
      // Call to OpenAI API (this is a simplified example)
      const { prompt, metadata } = req.body;

      if (!prompt) {
        res.status(400).send('Prompt is required');
        return "Error";
      }

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",  // or "gpt-4"
          messages: [
            { role: "user", content: prompt }  // Use the provided prompt
          ],
          max_tokens: 50,
          temperature: 0.5
        })
      });
  
      const data = await response.json();

      console.log(data.choices[0].message.content)

    //   return this.interpretOpenAIResponse(data.choices[0].text);
      return "DONE"
    }
  
    private interpretOpenAIResponse(response: string): string {
      // Interpret the response to decide the service type
      // Simple heuristic: based on keywords found in response
      if (response.includes('attractions')) {
        return 'Ticketmaster';
      }
      // Extend logic as needed for different services
      return 'DefaultService';
    }
  }
  