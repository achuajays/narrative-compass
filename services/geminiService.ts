import { GoogleGenAI, Type } from "@google/genai";
import { WorldEntity, EntityType, PlotAnalysis, CharacterInsight, LoreInsight } from "../types";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

// Helper to clean JSON strings if the model wraps them in markdown
const cleanJSON = (text: string): string => {
  return text.replace(/```json/g, '').replace(/```/g, '').trim();
};

export const updateWorldKnowledge = async (
  currentText: string,
  existingEntities: WorldEntity[]
): Promise<WorldEntity[]> => {
  const ai = getAI();
  
  // Use Flash for fast extraction
  const model = "gemini-2.5-flash"; 
  
  const existingSummary = existingEntities.map(e => `${e.name} (${e.type}): ${e.description}`).join('\n');

  const prompt = `
    You are the Narrative Compass, an AI maintaining a fictional universe consistency database.
    
    Current known world data:
    ${existingSummary}
    
    New Story Segment:
    "${currentText}"
    
    Task:
    1. Identify all characters, locations, important objects, and lore mentioned or implied.
    2. Update existing entities with new details found in the text.
    3. Create new entities for newly introduced elements.
    4. Maintain a concise but informative description for each.
    
    Return the result as a JSON array of objects fitting this schema:
    {
      id: string (unique-kebab-case),
      name: string,
      type: "CHARACTER" | "LORE" | "OBJECT" | "LOCATION",
      description: string,
      traits: string[],
      status: string (e.g., "Active", "Injured", "Unknown"),
      relationships: string[]
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              name: { type: Type.STRING },
              type: { type: Type.STRING, enum: [EntityType.CHARACTER, EntityType.LORE, EntityType.OBJECT, EntityType.LOCATION] },
              description: { type: Type.STRING },
              traits: { type: Type.ARRAY, items: { type: Type.STRING } },
              status: { type: Type.STRING },
              relationships: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ["id", "name", "type", "description", "traits"]
          }
        }
      }
    });

    const text = response.text;
    if (!text) return existingEntities;
    
    const newEntities = JSON.parse(text) as WorldEntity[];
    
    // Merge logic: simpler for this demo, we replace/append based on ID
    // In a real app, we might want smarter merging to avoid overwriting deep history
    // Here we trust the AI to have synthesized the "Current known world data" + "New Story"
    
    return newEntities;
  } catch (error) {
    console.error("World Update Failed:", error);
    return existingEntities;
  }
};

export const analyzeNarrative = async (
  text: string,
  worldData: WorldEntity[]
): Promise<PlotAnalysis> => {
  const ai = getAI();
  // Use Pro for deeper reasoning about plot holes
  const model = "gemini-3-pro-preview"; 

  const worldContext = worldData.map(e => `${e.name}: ${e.description}`).join('; ');

  const prompt = `
    Analyze the following narrative segment for pacing, continuity, and plot holes based on the established world context.

    World Context:
    ${worldContext}

    Story Text:
    "${text}"

    Tasks:
    1. Determine a Pacing Score (0-100), where 0 is stagnant/boring and 100 is breathless action. Ideal is often dynamic.
    2. Identify any logical contradictions or Plot Holes (e.g., Character X knows something they shouldn't, or uses an item they don't have).
    3. Suggest immediate narrative moves if the story is dragging.
    
    Return JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            pacingScore: { type: Type.NUMBER },
            pacingComment: { type: Type.STRING },
            plotHoles: { type: Type.ARRAY, items: { type: Type.STRING } },
            narrativeSuggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
            continuityStatus: { type: Type.STRING, enum: ['STABLE', 'RISK', 'BROKEN'] }
          },
          required: ["pacingScore", "plotHoles", "narrativeSuggestions", "continuityStatus"]
        }
      }
    });

    const text = response.text;
    return JSON.parse(text || "{}") as PlotAnalysis;
  } catch (error) {
    console.error("Analysis Failed:", error);
    return {
      pacingScore: 50,
      pacingComment: "Analysis unavailable.",
      plotHoles: [],
      narrativeSuggestions: [],
      continuityStatus: 'STABLE'
    };
  }
};

export const generateCharacterDetails = async (
  character: WorldEntity,
  currentStory: string
): Promise<CharacterInsight> => {
  const ai = getAI();
  const model = "gemini-2.5-flash"; 

  const prompt = `
    Deep dive into character: ${character.name}.
    Role: ${character.description}
    Traits: ${character.traits.join(', ')}
    
    Context from story:
    "${currentStory.slice(-2000)}" 

    Generate:
    1. 3 suggested lines of dialogue relevant to the current scene.
    2. A hidden secret they are keeping.
    3. Their current primary motivation.
    4. A suggestion for their future story arc.
    5. Potential flaws or weaknesses that could cause conflict.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            dialogueSuggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
            hiddenSecrets: { type: Type.ARRAY, items: { type: Type.STRING } },
            motivations: { type: Type.ARRAY, items: { type: Type.STRING } },
            futureArcIdeas: { type: Type.ARRAY, items: { type: Type.STRING } },
            flaws: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        }
      }
    });
    
    return JSON.parse(response.text || "{}") as CharacterInsight;
  } catch (error) {
    return {
      dialogueSuggestions: [],
      hiddenSecrets: [],
      motivations: [],
      futureArcIdeas: [],
      flaws: []
    };
  }
};

export const generateLoreDetails = async (
  entity: WorldEntity,
  currentStory: string
): Promise<LoreInsight> => {
  const ai = getAI();
  const model = "gemini-2.5-flash";

  const prompt = `
    Expand on the lore of this entity: ${entity.name}.
    Type: ${entity.type}
    Description: ${entity.description}
    
    Story Context:
    "${currentStory.slice(-2000)}"
    
    Generate:
    1. A detailed history or origin story (approx 3 sentences).
    2. Its cultural significance or how it's perceived by people.
    3. Hidden properties, rumors, or magical aspects not immediately visible.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            detailedHistory: { type: Type.STRING },
            culturalSignificance: { type: Type.STRING },
            hiddenProperties: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        }
      }
    });
    
    return JSON.parse(response.text || "{}") as LoreInsight;
  } catch (error) {
    return {
      detailedHistory: "Information lost to time.",
      culturalSignificance: "Unknown relevance.",
      hiddenProperties: []
    };
  }
};