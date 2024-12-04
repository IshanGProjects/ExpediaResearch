export abstract class APIFactory {
    protected apiKey: string;
  
    constructor(apiKey: string) {
      this.apiKey = apiKey;
    }
  
    abstract makeAPICall(location: string, time: string, activity: string): string;
    // TODO more parameters
  }
  