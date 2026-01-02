
import { GoogleGenAI, Type, Modality, GenerateContentResponse } from "@google/genai";
import { OilProduct, Language } from "../types";

// Base AI instance for standard tasks
const getAi = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Helper to decode base64 to Uint8Array manually
 */
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

/**
 * Helper to decode raw PCM audio data into an AudioBuffer
 */
async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

/**
 * Standard Quality Insights (Flash-Lite for Speed)
 */
export async function getOilAnalysisInsights(product: OilProduct, producerName: string, lang: Language = 'en'): Promise<string> {
  try {
    const ai = getAi();
    const response = await ai.models.generateContent({
      model: 'gemini-flash-lite-latest',
      contents: `Analyze this oil quickly: ${product.name} by ${producerName}. Profile: Acidity ${product.analysis.acidity}%, Polyphenols ${product.analysis.polyphenols}. Give a 2-sentence expert verdict. Respond ONLY in ${lang}.`,
    });
    return response.text || "Analysis unavailable.";
  } catch (error) {
    return "Expert panel busy.";
  }
}

/**
 * Chat with Search Grounding (Gemini 3 Flash for Up-to-date info)
 */
export async function* streamChat(message: string, lang: Language = 'en', history: any[] = []) {
  const ai = getAi();
  const chat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      tools: [{ googleSearch: {} }],
      systemInstruction: `You are the Lead Sommelier for the World Oil Ranking. Respond in ${lang}. 
      Use Google Search to find recent harvest data, market prices, and Terroir du Maroc certification details if asked. 
      If providing search-based information, ensure the response is accurate and professional.`
    }
  });

  const responseStream = await chat.sendMessageStream({ message });
  for await (const chunk of responseStream) {
    yield chunk as GenerateContentResponse;
  }
}

/**
 * AI Translation Utility
 */
export async function translateText(text: string, targetLang: Language): Promise<string> {
  const ai = getAi();
  const response = await ai.models.generateContent({
    model: 'gemini-flash-lite-latest',
    contents: `Translate the following text to ${targetLang}. Keep the tone professional: "${text}"`,
  });
  return response.text || text;
}

/**
 * Image Generation (Pro Image)
 */
export async function generateOilImage(prompt: string, aspectRatio: string = "1:1", size: string = "1K") {
  if (!(await (window as any).aistudio.hasSelectedApiKey())) {
    await (window as any).aistudio.openSelectKey();
  }
  const ai = getAi();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: { parts: [{ text: prompt }] },
    config: {
      imageConfig: { aspectRatio: aspectRatio as any, imageSize: size as any }
    },
  });
  
  const imagePart = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
  return imagePart?.inlineData?.data ? `data:image/png;base64,${imagePart.inlineData.data}` : null;
}

/**
 * Nano Banana Image Editing (Gemini 2.5 Flash Image)
 */
export async function editOilImage(base64Image: string, prompt: string) {
  const ai = getAi();
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        { inlineData: { data: base64Image.split(',')[1], mimeType: 'image/png' } },
        { text: prompt }
      ]
    },
  });
  const imagePart = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
  return imagePart?.inlineData?.data ? `data:image/png;base64,${imagePart.inlineData.data}` : null;
}

/**
 * Video Generation (Veo)
 */
export async function animateOilImage(base64Image: string, prompt: string, ratio: '16:9' | '9:16' = '16:9') {
  if (!(await (window as any).aistudio.hasSelectedApiKey())) {
    await (window as any).aistudio.openSelectKey();
  }
  const ai = getAi();
  let operation = await ai.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt: prompt,
    image: {
      imageBytes: base64Image.split(',')[1],
      mimeType: 'image/png'
    },
    config: {
      numberOfVideos: 1,
      resolution: '720p',
      aspectRatio: ratio
    }
  });

  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 5000));
    operation = await ai.operations.getVideosOperation({ operation: operation });
  }

  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
  const res = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
  const blob = await res.blob();
  return URL.createObjectURL(blob);
}

/**
 * TTS (Speech)
 */
export async function speakText(text: string, lang: Language = 'en') {
  const ai = getAi();
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text: `Say in a professional voice (native-like for ${lang}): ${text}` }] }],
    config: {
      responseModalalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Charon' } }
      }
    }
  });
  
  const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (base64Audio) {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({sampleRate: 24000});
    const audioBuffer = await decodeAudioData(
      decode(base64Audio),
      audioContext,
      24000,
      1,
    );
    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContext.destination);
    source.start();
  }
}
