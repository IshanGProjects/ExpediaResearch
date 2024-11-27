import { AbstractFactory } from './AbstractFactory';
import { TicketmasterFactory } from './thirdPartyFactories/TicketmasterFactory';

export class ServiceDirector {
  private factories: { [key: string]: AbstractFactory } = {};

  constructor() {
    // Register all available factories
    this.factories['Ticketmaster'] = new TicketmasterFactory();
    // Add more factories as needed
  }

  getFactory(serviceType: string): AbstractFactory {
    const factory = this.factories[serviceType];
    if (!factory) {
      throw new Error(`Factory for service type ${serviceType} not found.`);
    }
    return factory;
  }
}
