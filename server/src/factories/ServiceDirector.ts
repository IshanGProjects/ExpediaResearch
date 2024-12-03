import { AbstractFactory } from './AbstractFactory';
import { TicketmasterFactory } from './thirdPartyFactories/TicketmasterFactory';
import { OpenAIService } from './OpenAIService';
import { Request, Response } from 'express';


export class ServiceDirector {
  private factories: { [key: string]: AbstractFactory } = {};
  private openAIService: OpenAIService;

  constructor() {
    // Register all available factories
    this.factories['Ticketing'] = new TicketmasterFactory();
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
    const serviceResponses: { service: string; data: any | null; error?: string }[] = [];
  
    try {
      // Step 1: Analyze the prompt using OpenAIService
      const analysisResults = await this.openAIService.analyzePrompt(req, res);
  
      // Step 2: Process each result
      for (const result of analysisResults) {
        const { service, applicability } = result;
  
        // Skip services below the applicability threshold
        if (applicability < 50) {
          console.log(`Skipping service: ${service} (Applicability: ${applicability}%)`);
          serviceResponses.push({
            service,
            data: null,
            error: `Applicability below threshold (${applicability}%)`,
          });
          continue;
        }
  
        console.log(`Processing service: ${service} (Applicability: ${applicability}%)`);
  
        try {
          const factory = this.getFactory(service);
          const product = factory.createProduct();
  
          // Dynamically determine the action using the prompt
          const data = await product.performAction({
            prompt: req.body.prompt, // Pass prompt directly
          });
  
          // Add successful result
          serviceResponses.push({ service, data });
        } catch (error) {
          console.error(`Error processing service ${service}:`, error);
  
          // Add error result
          serviceResponses.push({
            service,
            data: null,
            error: (error as Error).message || 'An unknown error occurred',
          });
        }
      }
  
      // Step 3: Send the unified response
      res.json({ message: 'Processed all services', responses: serviceResponses });
    } catch (error) {
      console.error('Error in processPrompt:', error);
  
      // General error response
      res.status(500).json({ error: 'Failed to process the prompt.', details: (error as Error).message });
    }
  }
  
  
}