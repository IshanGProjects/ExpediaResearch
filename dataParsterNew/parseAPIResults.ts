import * as fs from 'fs';
import * as path from 'path';
import fetch from 'node-fetch';
import 'dotenv/config';

// Define API Key from .env
const API_KEY = process.env.LLM_API_KEY;
if (!API_KEY) {
    throw new Error('Missing API Key. Set LLM_API_KEY in your .env file.');
}

interface SimplifiedActivity {
    image: string;
    activity_name: string;
    time: string | null;
    location: string;
    details: string | null;
}

// call ChatGPT API
async function callChatGPT(prompt: string): Promise<any> {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
            model: 'gpt-4',
            messages: [{ role: 'user', content: prompt }],
        }),
    });

    if (!response.ok) {
        throw new Error(`Error from API: ${response.statusText}`);
    }
    const data = await response.json();
    return data.choices[0].message.content;
}

// process data dynamically
async function processData(filePath: string) {
    const rawData = fs.readFileSync(filePath, 'utf-8');
    const apiResults = JSON.parse(rawData);

    const parsedData: SimplifiedActivity[] = [];

    for (const serviceData of apiResults) {
        const prompt = `Process this data into a simplified format: ${JSON.stringify(serviceData.data)}`;
        const result = await callChatGPT(prompt);
        parsedData.push(JSON.parse(result));
    }

    const outputPath = path.resolve(__dirname, 'parsed_results.json');
    fs.writeFileSync(outputPath, JSON.stringify(parsedData, null, 4), 'utf-8');
    console.log('Data processing complete. Parsed results saved to parsed_results.json');
}


processData(path.resolve(__dirname, 'api_results.json'))
    .then(() => console.log('Processing complete!'))
    .catch((err) => console.error(err));
