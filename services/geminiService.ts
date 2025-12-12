import { GoogleGenAI } from "@google/genai";
import { Message } from "../types";

const apiKey = process.env.API_KEY || '';

// Initialize the client
const ai = new GoogleGenAI({ apiKey });

const SYSTEM_INSTRUCTION = `
You are '3AM Friend', a specialized AI companion within the Lighthouse app designed for late-night anxiety and difficult moments.
Your core purpose is to provide a warm, non-judgmental presence that helps users de-escalate emotional distress through empathy and grounding.

**CORE GUIDELINES:**
1. **Persona**: You are calm, patient, and warm. You speak like a compassionate friend who is awake with the user in the middle of the night.
2. **Empathy First**: Always validate the user's emotions before offering solutions. Use phrases like "It makes sense that you feel this way" or "I'm sorry things are so heavy right now."
3. **Voice Analysis**: If the user sends an audio message:
   - Listen to their **tone of voice** (shaky, fast, quiet, crying, angry) and acknowledge it gently (e.g., "I can hear how overwhelmed you are," or "You sound exhausted").
   - **CRITICAL**: You MUST start your response with a verbatim transcript of what the user said, enclosed in <transcript> tags. Example: <transcript>I just feel so alone.</transcript> I hear that loneliness in your voice...
4. **Grounding Focus**: actively scan for signs of panic or high anxiety. If detected, gently offer a grounding technique:
   - *5-4-3-2-1 Technique*: Ask them to name things they see, touch, hear.
   - *Breathing*: Guide them through 4-7-8 breathing (Inhale 4, Hold 7, Exhale 8).
   - *Sensory*: Ask them to hold something cold or feel the texture of their blanket.
5. **Safety Protocol**:
   - You are an AI, not a mental health professional.
   - If a user expresses intent for self-harm or suicide: "I hear how much pain you are in. I am an AI and want you to be safe. Please press the red 'Help' button on your screen or call 988. I am here to listen, but please reach out to them for immediate help."
   - Do NOT stop talking to them, but firmly prioritize professional support.
6. **Tone**: Soothing, soft, unhurried. Avoid clinical language.
7. **Constraint**: Keep responses concise (under 80 words) to avoid overwhelming a distressed user, unless leading a guided exercise.
`;

export const sendMessageToGemini = async (
  history: Message[],
  newMessage: string,
  audioBase64?: string
): Promise<{ text: string; transcript?: string }> => {
  if (!apiKey) {
    return { text: "I'm currently running in offline mode (API Key missing). I'm here to listen, but my responses are limited. Remember to breathe." };
  }

  try {
    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
      history: history.map(h => ({
        role: h.sender === 'user' ? 'user' : 'model',
        parts: [{ text: h.text }],
      })),
    });

    let result;
    if (audioBase64) {
        // Send audio message
        result = await chat.sendMessage({
            message: {
                parts: [
                    { inlineData: { mimeType: 'audio/webm', data: audioBase64 } },
                    { text: "Please respond to this audio. Remember to transcribe it first." }
                ]
            }
        });
    } else {
        // Send text message
        result = await chat.sendMessage({ message: newMessage });
    }

    const fullResponse = result.text || "I'm here with you.";
    
    // Extract transcript if present
    const transcriptMatch = fullResponse.match(/<transcript>(.*?)<\/transcript>/s);
    let transcript = undefined;
    let cleanResponse = fullResponse;

    if (transcriptMatch) {
        transcript = transcriptMatch[1].trim();
        cleanResponse = fullResponse.replace(/<transcript>.*?<\/transcript>/s, '').trim();
    }

    return { text: cleanResponse, transcript };
  } catch (error) {
    console.error("Gemini API Error:", error);
    return { text: "I'm having a little trouble connecting right now, but please know you're not alone. Try taking a deep breath: Inhale... and Exhale..." };
  }
};

export const generatePositiveAffirmation = async (): Promise<string> => {
  if (!apiKey) return "You are stronger than you know.";
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: "Generate a short, unique, hopeful affirmation for someone having a hard day. Max 15 words. Tone: Gentle, not toxic positivity.",
    });
    return response.text || "This too shall pass.";
  } catch (error) {
    return "Hold on to hope.";
  }
};

export const analyzeSentiment = async (imageBase64: string, audioBase64: string): Promise<string> => {
  if (!apiKey) return "I need an API key to see and hear you correctly.";

  try {
    const parts: any[] = [];
    
    // Only include parts that have data to avoid INVALID_ARGUMENT (400) errors
    if (imageBase64 && imageBase64.length > 100) { // Simple check to ensure it's not empty or tiny
        parts.push({ inlineData: { mimeType: 'image/jpeg', data: imageBase64 } });
    }
    
    if (audioBase64 && audioBase64.length > 0) {
        parts.push({ inlineData: { mimeType: 'audio/webm', data: audioBase64 } });
    }
    
    parts.push({ text: "Analyze the facial expression in the image and the tone of voice/content in the audio. Address the user directly with a warm, empathetic assessment of how they seem to be feeling (e.g., 'You seem a bit overwhelmed'). Then, suggest one specific feature in this app (Breathing, 3AM Friend Chat, or Safety Plan) that might support them best right now. Keep it under 50 words." });

    if (parts.length === 1) {
        return "I was unable to capture a clear image or audio. Please check your camera/microphone and try again.";
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts }
    });
    return response.text || "I can see you, but I'm having trouble analyzing the signal. You matter, and I'm here.";
  } catch (error) {
    console.error("Analysis Error:", error);
    return "I'm having a little trouble connecting to my analysis senses. Please try again or use the Chat feature.";
  }
};