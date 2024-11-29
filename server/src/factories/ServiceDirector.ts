import { AbstractFactory } from './AbstractFactory';
import { TicketmasterFactory } from './thirdPartyFactories/TicketmasterFactory';
import { OpenAIService } from './OpenAIService';
import { Request, Response } from 'express';


export class ServiceDirector {
  private factories: { [key: string]: AbstractFactory } = {};
  private openAIService: OpenAIService;

  constructor() {
    // Register all available factories
    this.factories['Ticketmaster'] = new TicketmasterFactory();
    // Add more factories as needed

    // Initialize the OpenAIService instance
    this.openAIService = new OpenAIService();
  }

  getFactory(serviceType: string): AbstractFactory {
    const factory = this.factories[serviceType];
    if (!factory) {
      throw new Error(`Factory for service type ${serviceType} not found.`);
    }
    return factory;
  }

  async processPrompt(req: Request, res: Response): Promise<void> {
    try {
      // // Step 1: Analyze the prompt using OpenAIService
      // const analysisResults = await this.openAIService.analyzePrompt(req, res);

      const analysisResults = [
        {
          service: 'Ticketing',
          applicability: 40,
        },
        {
          service: 'Bookings',
          applicability: 80,
        },
        {
          service: 'Restaurants',
          applicability: 30,
        },
      ];

      // Step 2: Process the whole prompt with each applicable factory
      for (const result of analysisResults) {
        const { service, applicability } = result;

        if (applicability >= 50) { // Only process if applicability is above threshold
          console.log(`Processing with service: ${service} (Applicability: ${applicability}%)`);

          try {
            // Get the appropriate factory
            const factory = this.getFactory(service);
            const product = factory.createProduct();

            // Pass the entire prompt to the product
            const response = await product.performAction(req.body.prompt);
            console.log(`Response from ${service}:`, response);

            res.json({ message: `Response from ${service}`, data: response });
          } catch (error) {
            console.error(`Error processing service ${service}:`, error);
            res.status(500).json({ error: `Error processing service ${service}` });
          }
        } else {
          console.log(`Skipping service: ${service} (Applicability: ${applicability}%)`);
        }
      }
    } catch (error) {
      console.error('Error in processPrompt:', error);
      res.status(500).json({ error: 'Failed to process the prompt.' });
    }
  }
}