
import { GoogleGenAI } from "@google/genai";
import { OilProduct, ChemicalAnalysis } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getOilAnalysisInsights(product: OilProduct, producerName: string): Promise<string> {
  try {
    const prompt = `
      Analyze this premium oil from a sensory and health perspective based on its chemical profile:
      - Product: ${product.name} (${product.category})
      - Producer: ${producerName}
      - Acidity: ${product.analysis.acidity}%
      - Peroxide Value: ${product.analysis.peroxideValue} meq O2/kg
      - Polyphenols: ${product.analysis.polyphenols} mg/kg
      
      Provide a concise 3-sentence summary of its quality and what makes it special.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "Analysis currently unavailable.";
  } catch (error) {
    console.error("Gemini API error:", error);
    return "Failed to fetch AI insights.";
  }
}
