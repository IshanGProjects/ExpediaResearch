import { APIFactory } from "./APIFactory";

export class WeatherAPI extends APIFactory {
  constructor(apiKey: string) {
    super(apiKey);
  }

  makeAPICall(location: string, time: string, activity: string): string {
    const response = {
      api: "Weather",
      location,
      time,
      activity,
      apiKey: this.apiKey,

      // TODO api call

      forecast: {
        temperature: "72°F",
        condition: "Sunny",
        windSpeed: "5 mph",
      }, // Mock data
    };

    return JSON.stringify(response);
  }
}
