import axios from 'axios';
import process from 'process';
import dotenv from 'dotenv';

dotenv.config();

export async function formatData(service: string, combinedData: { service: string; data: any }[]): Promise<any[]> {
    const parsedActivities: any[] = [];
    const openAiEndpoint = 'https://api.openai.com/v1/chat/completions';
    const openAiApiKey = process.env.OPENAI_API_KEY;

    try {
        if (!combinedData || combinedData.length === 0) {
            console.warn(`No data provided for combined formatting.`);
            return parsedActivities;
        }

        const requestBody = {
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'system',
                    content: `You are a data extraction assistant that processes raw JSON data from multiple services. Extract activities in a standardized format:
- image: URL or image data for the activity.
- activity_name: Name or title of the activity.
- time: Time or duration of the activity (if available).
- date: Date of the activity (if available).
- location: Location of the activity.
- details: Key highlights or details about the activity.
- link: url to more information about the activity.`,
                },
                {
                    role: 'user',
                    content: `Format the following combined raw data into the standardized activity format:\n\n${JSON.stringify(
                        combinedData,
                        null,
                        2
                    )}`,
                },
            ],
            max_tokens: 1500,
            temperature: 0.3,
        };

        const response = await axios.post(openAiEndpoint, requestBody, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${openAiApiKey}`,
            },
        });

        const llmOutput = response.data.choices[0].message.content.trim();

        console.log(`Raw response from OpenAI:`, llmOutput);

        // Strip surrounding backticks or malformed JSON wrappers
        const cleanOutput = llmOutput.replace(/^```json|```$/g, '').trim();

        const formattedData = JSON.parse(cleanOutput);

        if (Array.isArray(formattedData)) {
            parsedActivities.push(...formattedData);
        } else {
            console.warn(`Expected an array from LLM but got:`, formattedData);
        }
    } catch (error) {
        console.error(`Error in OpenAI API call for combined data:`, error);
        throw new Error('Failed to format combined data using OpenAI.');
    }

    return parsedActivities;
}
