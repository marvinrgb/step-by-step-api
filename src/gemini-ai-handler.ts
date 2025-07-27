// src/gemini-ai-handler.ts
import axios from 'axios';
import fs from "fs";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

interface GeminiResponse {
    candidates: { content: { parts: { text: string }[] } }[];
}

export async function getGeminiResponse(text: string): Promise<string | null> {
    try {
        // console.log(`GEMINI_API_KEY: ${GEMINI_API_KEY}`)
        if (!GEMINI_API_KEY) {
            console.error('GEMINI_API_KEY is not set. Please set it in your environment variables.');
            return null;
        }

        const response = await axios.post(
            `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
            {
                contents: [{ parts: [{ text }] }],
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
        console.log(`Calling Gemini API with URL: ${GEMINI_API_URL}?key=${GEMINI_API_KEY}`);
        console.log(response)
        const geminiResponse: GeminiResponse = await response.data;

        if (geminiResponse.candidates && geminiResponse.candidates.length > 0) {
            const aiText = geminiResponse.candidates[0].content.parts[0].text;
            return aiText;
        } else {
            console.warn('No candidates found in Gemini response.');
            return null;
        }
    } catch (error: any) {
        console.log(error)
        console.error('Error calling Gemini API:', error.message);
        return null;
    }
}

export function parseGeminiJson(jsonstring: string) {
    jsonstring = jsonstring.replace("```json", "");
    jsonstring = jsonstring.replace("```", "");
    return JSON.parse(jsonstring);
}