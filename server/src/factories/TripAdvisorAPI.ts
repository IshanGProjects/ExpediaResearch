import { APIFactory } from "./APIFactory";

export class TripAdvisorAPI extends APIFactory {
  constructor(apiKey: string) {
    super(apiKey);
  }

  makeAPICall(location: string, time: string, activity: string): string {
    const response = {
      api: "Yelp",
      location,
      time,
      activity,
      apiKey: this.apiKey,

      // TODO api call

      businesses: ["Restaurant X", "Cafe Y", "Bar Z"], // Mock data
    };

    return JSON.stringify(response);
  }
}
