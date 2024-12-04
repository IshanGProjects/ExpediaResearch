import { APIFactory } from "./APIFactory";

export class TicketmasterAPI extends APIFactory {
  constructor(apiKey: string) {
    super(apiKey);
  }

  makeAPICall(location: string, time: string, activity: string): string {
    const response = {
      api: "Ticketmaster",
      location,
      time,
      activity,
      apiKey: this.apiKey,
      
       // TODO api call
      
      events: ["Concert A", "Concert B", "Concert C"], // Mock data
    };

    return JSON.stringify(response);
  }
}
