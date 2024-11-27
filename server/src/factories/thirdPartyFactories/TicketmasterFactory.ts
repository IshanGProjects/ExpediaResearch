import { AbstractFactory, AbstractProduct } from '../AbstractFactory';

export class TicketmasterFactory implements AbstractFactory {
  createProduct(): AbstractProduct {
    return new TicketmasterProduct();
  }
}

class TicketmasterProduct implements AbstractProduct {
  private apiKey = 'YOUR_API_KEY'; // Replace with your actual API key
  private baseUrl = 'https://app.ticketmaster.com/discovery/v2';

  async performAction(action: string, params: { [key: string]: any }): Promise<any> {
    const endpoint = this.constructEndpoint(action, params);
    return this.fetchFromApi(endpoint);
  }

  private constructEndpoint(action: string, params: { [key: string]: any }): string {
    switch (action) {
      case 'getAttractions':
        return `/attractions.json?keyword=${encodeURIComponent(params.keyword)}`;
      case 'getAttractionDetails':
        return `/attractions/${params.id}.json`;
      case 'getEvents':
        return `/events.json?keyword=${encodeURIComponent(params.keyword)}`;
      case 'getEventDetails':
        return `/events/${params.id}.json`;
      // Add other endpoints as necessary
      default:
        throw new Error(`Unsupported action: ${action}`);
    }
  }

  private async fetchFromApi(endpoint: string): Promise<any> {
    const url = `${this.baseUrl}${endpoint}&apikey=${this.apiKey}`;
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (error) {
      console.error('There has been a problem with your fetch operation:', error);
      throw error;
    }
  }
}
