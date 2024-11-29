import { AbstractFactory, AbstractProduct } from '../AbstractFactory';
import fetch from 'node-fetch'; // Ensure fetch is available in your environment
import process from 'process';
import dotenv from 'dotenv';

dotenv.config();

interface OpenAIResponse {
  choices: { text: string }[];
}

export class TicketmasterFactory implements AbstractFactory {
  createProduct(): AbstractProduct {
    return new TicketmasterProduct();
  }
}

class TicketmasterProduct implements AbstractProduct {
  private ticketmasterApiKey = process.env.TICKETMASTER_API_KEY; 
  private ticketmasterBaseUrl = 'https://app.ticketmaster.com/discovery/v2';
  private openAiApiKey = process.env.OPENAI_API_KEY; 
  private openAiEndpoint = 'https://api.openai.com/v1/completions';

  /**
   * Perform an action based on a prompt by first analyzing it using LLM.
   * @param request - Contains the action and parameters for the API call.
   */
  async performAction(request: { action: string; params: { [key: string]: any } }): Promise<any> {
    const { prompt } = request.params;

    // Step 1: Use the LLM to determine the Ticketmaster API call structure
    const llmResponse = await this.analyzePromptWithLLM(prompt);
    const { action, params } = llmResponse;

    // Step 2: Construct the Ticketmaster API endpoint based on the LLM response
    const endpoint = this.constructEndpoint(action, params);

    // Step 3: Make the Ticketmaster API call
    return this.fetchFromApi(endpoint);
  }

  /**
   * Analyze the prompt using OpenAI to determine the action and parameters.
   * @param prompt - The user input to analyze.
   * @returns A structured response with the action and parameters.
   */

  private async analyzePromptWithLLM(prompt: string): Promise<{ action: string; params: { [key: string]: any } }> {
    const requestBody = {
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are an assistant that generates API call structures based on prompts.' },
        { role: 'user', content: `Analyze the following prompt to determine the action and parameters for the Ticketmaster API in JSON format:\n\nPrompt: "${prompt}"` },
      ],
      max_tokens: 150,
    };
    

    try {
      const response = await fetch(this.openAiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.openAiApiKey}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API call failed with status: ${response.status}`);
      }

      // Use type assertion to cast the result of response.json() to OpenAIResponse
      const data = (await response.json()) as OpenAIResponse;

      // Extract and parse the LLM output
      const llmOutput = data.choices[0].text.trim();

      return JSON.parse(llmOutput); // Parse the JSON response from the LLM
    } catch (error) {
      console.error('Error analyzing prompt with LLM:', error);
      throw new Error('Failed to analyze the prompt using LLM.');
    }
  }

  /**
   * Construct the endpoint for the Ticketmaster API call.
   * @param action - The specific action determined by the LLM.
   * @param params - The parameters for the API call.
   * @returns The constructed endpoint as a string.
   */
  private constructEndpoint(action: string, params: { [key: string]: any }): string {
    switch (action) {
      case 'getAttractions':
        return `/attractions.json?keyword=${encodeURIComponent(params.keyword)}`;
      case 'getEvents':
        return `/events.json?keyword=${encodeURIComponent(params.keyword)}`;
      default:
        throw new Error(`Unsupported action: ${action}`);
    }
  }

  /**
   * Fetch data from the Ticketmaster API.
   * @param endpoint - The endpoint to call.
   * @returns A promise resolving to the API response data.
   */
  private async fetchFromApi(endpoint: string): Promise<any> {
    const url = `${this.ticketmasterBaseUrl}${endpoint}&apikey=${this.ticketmasterApiKey}`;
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (error) {
      console.error('Error fetching data from Ticketmaster API:', error);
      throw error;
    }
  }
}
