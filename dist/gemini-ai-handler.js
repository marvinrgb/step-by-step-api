"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGeminiResponse = void 0;
// src/gemini-ai-handler.ts
const axios_1 = __importDefault(require("axios"));
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
function getGeminiResponse(text) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log(`GEMINI_API_KEY: ${GEMINI_API_KEY}`);
            if (!GEMINI_API_KEY) {
                console.error('GEMINI_API_KEY is not set. Please set it in your environment variables.');
                return null;
            }
            const response = yield axios_1.default.post(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
                contents: [{ parts: [{ text }] }],
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            console.log(`Calling Gemini API with URL: ${GEMINI_API_URL}?key=${GEMINI_API_KEY}`);
            console.log(response);
            const geminiResponse = response.data;
            if (geminiResponse.candidates && geminiResponse.candidates.length > 0) {
                const aiText = geminiResponse.candidates[0].content.parts[0].text;
                return aiText;
            }
            else {
                console.warn('No candidates found in Gemini response.');
                return null;
            }
        }
        catch (error) {
            console.log(error);
            console.error('Error calling Gemini API:', error.message);
            return null;
        }
    });
}
exports.getGeminiResponse = getGeminiResponse;
function parseGeminiJson(jsonstring) {
    jsonstring = jsonstring.replace("```json", "");
    jsonstring = jsonstring.replace("```", "");
    return JSON.parse(jsonstring);
}
