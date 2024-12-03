import { AbstractFactory } from './AbstractFactory';
import { TicketmasterFactory } from './thirdPartyFactories/TicketmasterFactory';
import { OpenAIService } from './OpenAIService';
import { Request, Response } from 'express';
import { formatData } from '../formatData';

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

  getFactory(serviceType: string): AbstractFactory | null {
    return this.factories[serviceType] || null;
  }

  async processPrompt(req: Request, res: Response): Promise<void> {
    const rawDataCombined: { service: string; data: any }[] = [];
    const serviceResponses: { service: string; data: any | null; error?: string }[] = [];

    try {
        const analysisResults = await this.openAIService.analyzePrompt(req, res);

        for (const result of analysisResults) {
            const { service, applicability } = result;

            if (applicability < 50) {
                console.log(`Skipping service: ${service} (Applicability: ${applicability}%)`);
                serviceResponses.push({
                    service,
                    data: null,
                    error: `Applicability below threshold (${applicability}%)`,
                });
                continue;
            }

            try {
                const factory = this.getFactory(service);
                if (!factory) {
                    throw new Error(`Factory not found for service: ${service}`);
                }

                const product = factory.createProduct();
                const rawData = await product.performAction({
                    prompt: req.body.prompt,
                });

                console.log(`Raw data for service ${service}:`, JSON.stringify(rawData, null, 2));

                // Pre-process and trim the raw data
                const trimmedData = this.trimData(rawData);
                if (trimmedData) {
                    rawDataCombined.push({ service, data: trimmedData });
                }

                serviceResponses.push({ service, data: rawData });
            } catch (error) {
                console.error(`Error processing service ${service}:`, error);

                serviceResponses.push({
                    service,
                    data: null,
                    error: (error as Error).message || 'An unknown error occurred',
                });
            }
        }

        if (rawDataCombined.length === 0) {
            console.warn(`No raw data accumulated.`);
        }

        const parsedActivities = await formatData('Combined', rawDataCombined);

        res.json({
            message: 'Processed all services',
            parsedActivities,
            responses: serviceResponses,
        });
    } catch (error) {
        console.error('Error in processPrompt:', error);

        res.status(500).json({
            error: 'Failed to process the prompt.',
            details: (error as Error).message,
        });
    }
}

  // Helper function to trim raw data
  private trimData(data: any): any {
      // Select only relevant fields to minimize payload size
      return {
          _embedded: data._embedded?.events?.slice(0, 30).map((event: any) => ({
              name: event.name,
              type: event.type,
              id: event.id,
              locale: event.locale,
              images: event.images?.slice(0, 2), // Include only the first two images
              dates: event.dates,
              venues: event._embedded?.venues?.map((venue: any) => ({
                  name: venue.name,
                  location: venue.address?.line1,
                  city: venue.city?.name,
                  state: venue.state?.name,
                  country: venue.country?.name,
              })),
          })),
      };
  }


}
