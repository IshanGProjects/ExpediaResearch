import { AbstractFactory, AbstractProduct } from '../AbstractFactory';
import axios from 'axios';
import process from 'process';
import dotenv from 'dotenv';

dotenv.config();

interface OpenAIResponse {
  choices: { message: { content: string } }[];
}

interface TicketmasterAction {
  action: string;
  params: { [key: string]: any };
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
  private openAiEndpoint = 'https://api.openai.com/v1/chat/completions';

  /**
   * Perform an action, either by directly using `action` and `params` or analyzing a `prompt`.
   */
  async performAction(request: { action?: string; params?: { [key: string]: any }; prompt?: string }): Promise<any> {
    let action: string;
    let params: { [key: string]: any };
  
    try {
      if (request.prompt) {
        // Step 1: Analyze the prompt using OpenAI to determine the action and params
        const analyzed = await this.analyzePromptWithLLM(request.prompt);
  
        // Validate the action returned by the LLM
        const validActions = [
          'getAttractions',
          'getAttractionDetails',
          'getClassifications',
          'getEvents',
          'getEventDetails',
          'getVenues',
          'getVenueDetails',
        ];
        if (!validActions.includes(analyzed.action)) {
          throw new Error(`Invalid action returned by LLM: ${analyzed.action}`);
        }
  
        // Overwrite the placeholder with the determined action and params
        action = analyzed.action;
        params = analyzed.params;
      } else if (request.action && request.params) {
        // Use provided action and params
        action = request.action;
        params = request.params;
  
        // Validate the provided action
        const validActions = [
          'getAttractions',
          'getAttractionDetails',
          'getClassifications',
          'getEvents',
          'getEventDetails',
          'getVenues',
          'getVenueDetails',
        ];
        if (!validActions.includes(action)) {
          throw new Error(`Unsupported action provided: ${action}`);
        }
      } else {
        throw new Error('Either `prompt` or both `action` and `params` must be provided.');
      }
  
      console.log(`Determined action: ${action}, params:`, params);
  
      // Step 2: Construct the Ticketmaster API endpoint
      const endpoint = this.constructEndpoint(action, params);
  
      console.log(`Constructed endpoint: ${endpoint}`);
  
      // Step 3: Fetch data from the Ticketmaster API
      return await this.fetchFromApi(endpoint);
    } catch (error) {
      console.error('Error performing action:', error);
      throw error;
    }
  }
  
  /**
   * Analyze the prompt using OpenAI to determine the action and parameters.
   */
  private async analyzePromptWithLLM(prompt: string): Promise<TicketmasterAction> {
    const requestBody = {
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are an assistant that determines the most appropriate Ticketmaster API action based on user prompts.
  The available Ticketmaster API actions are:
  - "getAttractions": Find attractions like artists, sports, packages, plays, and more.
  - "getAttractionDetails": Get details for a specific attraction using its unique identifier.
  - "getClassifications": Find classifications (segments, genres, sub-genres) and filter by name.
  - "getEvents": Find events and filter by location, date, availability, and more.
  - "getEventDetails": Get details for a specific event using its unique identifier.
  - "getVenues": Find venues and filter by name and other attributes.
  - "getVenueDetails": Get details for a specific venue using its unique identifier.
  
  Choose the most appropriate action for the user's query and provide the necessary parameters for the API call.`,
        },
        {
          role: 'user',
          content: `Given the following prompt: "${prompt}", determine the most appropriate Ticketmaster API action and parameters. Use the following JSON format for the response:
  
  {
    "action": "getEvents",
    "params": {
      "keyword": "concert",
      "location": "New York"
    }
  }
  
  - The "action" must match one of the available Ticketmaster API actions.
  - "params" should include any additional parameters required for the action.`,
        },
      ],
      max_tokens: 300,
    };
  
    try {
      const response = await axios.post<OpenAIResponse>(this.openAiEndpoint, requestBody, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.openAiApiKey}`,
        },
      });
  
      const llmOutput = response.data.choices[0].message.content.trim();
      console.log(`LLM Output: ${llmOutput}`);
  
      return JSON.parse(llmOutput);
    } catch (error) {
      console.error('Error analyzing prompt with LLM:', error);
      throw new Error('Failed to analyze the prompt using LLM.');
    }
  }
  
  /**
   * Construct the Ticketmaster API endpoint based on the action and parameters.
   */
  private constructEndpoint(action: string, params: { [key: string]: any }): string {
    const queryParams = new URLSearchParams();

    // Add all parameters to the query string dynamically
    for (const [key, value] of Object.entries(params)) {
      if (value) {
        queryParams.append(key, value.toString());
      }
    }

    switch (action) {
      case 'getAttractions':
        return `/attractions.json?${queryParams.toString()}`;
      case 'getAttractionDetails':
        return `/attractions/${params.id}.json`; // ID is part of the path, not query string
      case 'getClassifications':
        return `/classifications.json?${queryParams.toString()}`;
      case 'getEvents':
        return `/events.json?${queryParams.toString()}`;
      case 'getEventDetails':
        return `/events/${params.id}.json`; // ID is part of the path, not query string
      case 'getVenues':
        return `/venues.json?${queryParams.toString()}`;
      case 'getVenueDetails':
        return `/venues/${params.id}.json`; // ID is part of the path, not query string
      default:
        throw new Error(`Unsupported action: ${action}`);
    }
  }


  /**
   * Fetches data from the Ticketmaster API.
   */
  private async fetchFromApi(endpoint: string): Promise<any> {
    const url = `${this.ticketmasterBaseUrl}${endpoint}&apikey=${this.ticketmasterApiKey}`;

    try {
      const response = await axios.get(url);

      return response.data;
    } catch (error) {
      console.error(`Error fetching data from Ticketmaster API for endpoint '${endpoint}':`, error);
      throw new Error('Failed to fetch data from Ticketmaster API.');
    }
  }
}
