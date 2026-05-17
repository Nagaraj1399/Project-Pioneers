import { GoogleGenAI } from '@google/genai';
import type { Toy } from './toysData';
import { projectQueryToVector } from './vectorSearch';

let ai: GoogleGenAI | null = null;
let currentApiKey: string = '';

export const initializeGemini = (apiKey: string): boolean => {
  if (!apiKey || apiKey.trim() === '') {
    ai = null;
    currentApiKey = '';
    return false;
  }
  try {
    ai = new GoogleGenAI({ apiKey });
    currentApiKey = apiKey;
    return true;
  } catch (error) {
    console.error("Failed to initialize Gemini:", error);
    ai = null;
    currentApiKey = '';
    return false;
  }
};

export const isGeminiLive = (): boolean => {
  return ai !== null;
};

export const getApiKey = (): string => {
  return currentApiKey;
};

// MULTIMODAL IMAGE SEARCH
export interface AnalyzedToyImage {
  queryText: string;
  name: string;
  category: string;
  ageGroup: string;
  materials: string[];
  description: string;
}

export const analyzeToyImage = async (base64Data: string, mimeType: string = 'image/jpeg'): Promise<AnalyzedToyImage> => {
  if (!ai) {
    // Elegant simulation delay and high-fidelity mock response based on common image uploads
    await new Promise(resolve => setTimeout(resolve, 1500));
    return {
      queryText: "futuristic eco-friendly wooden interactive robot animal companion",
      name: "Bio-Mech Moss Fox",
      category: "Robotics",
      ageGroup: "6-10 years",
      materials: ["Solid Oak Wood", "Preserved Forest Moss", "Pneumatic Cylinders"],
      description: "A hybrid playmate bridging organic nature and advanced kinetics. It features responsive touch sensors and soft mechanical joints."
    };
  }

  try {
    const prompt = `You are a computer vision expert for the Toy Store of the Future. 
Analyze this uploaded toy image and extract its properties. 
You MUST respond with a valid, clean JSON object (no markdown formatting, no \`\`\`json block, just raw JSON text) with this structure:
{
  "queryText": "a detailed search prompt of 8-12 words summarizing its attributes, materials, and type (e.g. 'cuddly glowing space plushie safe for toddlers')",
  "name": "a creative futuristic name matching its looks",
  "category": "choose the most appropriate from: Robotics, Wooden Toys, STEM, Plushies, Vehicles, Creative Play, Tabletop, Outdoor",
  "ageGroup": "choose one: 0-3 years, 3-6 years, 6-9 years, 8-12 years, 12+ years",
  "materials": ["Material 1", "Material 2", "Material 3"],
  "description": "a 1-2 sentence engaging description of what the toy does and its aesthetic"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          inlineData: {
            mimeType: mimeType,
            data: base64Data
          }
        },
        prompt
      ],
    });

    const text = response.text || "";
    const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanJson);
  } catch (error) {
    console.error("Error analyzing toy image with Gemini:", error);
    throw new Error("Gemini was unable to process this image. Please check your API key.");
  }
};

// CONCEPT LAB: GENERATE TOY DESIGNS & PREDICT PRICES
export const generateToyConcept = async (conceptPrompt: string): Promise<Toy> => {
  const simulatedId = "custom_" + Date.now();
  
  if (!ai) {
    // High-fidelity simulation mode
    await new Promise(resolve => setTimeout(resolve, 2000));
    const randomPrice = parseFloat((25 + Math.random() * 85).toFixed(2));
    
    // Choose a premium unsplash image that fits the concept terms
    let imageUrl = "https://images.unsplash.com/photo-1558060370-d644479cb6f7?auto=format&fit=crop&w=600&q=80"; // mechanical toy
    const lowerPrompt = conceptPrompt.toLowerCase();
    if (lowerPrompt.includes("plush") || lowerPrompt.includes("soft") || lowerPrompt.includes("cuddly") || lowerPrompt.includes("teddy")) {
      imageUrl = "https://images.unsplash.com/photo-1559251606-c623743a6d76?auto=format&fit=crop&w=600&q=80"; // plush dragon
    } else if (lowerPrompt.includes("wood") || lowerPrompt.includes("timber") || lowerPrompt.includes("eco")) {
      imageUrl = "https://images.unsplash.com/photo-1515488042361-404e9250afef?auto=format&fit=crop&w=600&q=80"; // wooden track
    } else if (lowerPrompt.includes("car") || lowerPrompt.includes("truck") || lowerPrompt.includes("vehicle") || lowerPrompt.includes("rc")) {
      imageUrl = "https://images.unsplash.com/photo-1594787318286-3d835c1d207f?auto=format&fit=crop&w=600&q=80"; // rc buggy
    } else if (lowerPrompt.includes("sci-fi") || lowerPrompt.includes("space") || lowerPrompt.includes("star") || lowerPrompt.includes("galaxy")) {
      imageUrl = "https://images.unsplash.com/photo-1531747118685-ca8fa6e08806?auto=format&fit=crop&w=600&q=80"; // space robot
    }

    const estimatedName = conceptPrompt.split(' ').slice(0, 3).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') + " Innovator";

    const customToy: Toy = {
      id: simulatedId,
      name: estimatedName || "Quantum Dream Toy",
      category: lowerPrompt.includes("robot") || lowerPrompt.includes("ai") ? "Robotics" : lowerPrompt.includes("wood") ? "Wooden Toys" : "Creative Play",
      price: randomPrice,
      description: `A unique, customized play concept generated from the user prompt: "${conceptPrompt}". Designed for premium engagement and modern skill-building.`,
      image: imageUrl,
      ageGroup: "8+ years",
      materials: ["PLA Eco-Plastic", "Interactive Core", "Alloy Connectors"],
      tags: ["custom", "concept", "ai-designed", "interactive"],
      embedding: projectQueryToVector(conceptPrompt) // Create perfect semantic embedding locally!
    };
    return customToy;
  }

  try {
    const prompt = `You are the lead product designer for the 'Toy Store of the Future'. 
The user has proposed a new toy concept: "${conceptPrompt}".
Generate a detailed product design and cost breakdown in JSON format.
You MUST respond with a valid, clean JSON object (no markdown formatting, no \`\`\`json block, just raw JSON text) with this structure:
{
  "name": "a creative, high-tech, catchy name for this toy",
  "category": "choose from: Robotics, Wooden Toys, STEM, Plushies, Vehicles, Creative Play, Tabletop, Outdoor",
  "price": a decimal number representing the retail price (e.g. 45.99) based on complexity, between 15.00 and 149.00,
  "description": "a highly engaging 2-sentence description of the toy's futuristic play mechanics and visuals",
  "ageGroup": "choose from: 0-3 years, 3-6 years, 6-9 years, 8-12 years, 12+ years",
  "materials": ["Material 1", "Material 2", "Material 3"],
  "tags": ["a list of 5 relevant lowercase search tags"]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const text = response.text || "";
    const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const result = JSON.parse(cleanJson);

    // Let's call Imagen 3 to generate a visual mockup!
    let generatedImage = "https://images.unsplash.com/photo-1531747118685-ca8fa6e08806?auto=format&fit=crop&w=600&q=80"; // Default
    
    try {
      // In the @google/genai SDK, image generation is:
      // const imageResponse = await ai.models.generateImages({ model: 'imagen-3.0-generate-002', prompt: ... })
      // For speed and compatibility, if it fails or is restricted in free tier, we gracefully fall back to an elegant Unsplash stock search or a styled placeholder.
      const imgRes = await ai.models.generateImages({
        model: 'imagen-3.0-generate-002',
        prompt: `A beautiful high-quality professional product shot of a futuristic toy on a clean illuminated display shelf: ${conceptPrompt}. Sleek modern industrial design, vibrant colors, premium material texture.`,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
          aspectRatio: '1:1'
        }
      });
      if (imgRes.generatedImages?.[0]?.image?.imageBytes) {
        generatedImage = `data:image/jpeg;base64,${imgRes.generatedImages[0].image.imageBytes}`;
      }
    } catch (imgError) {
      // Unused keywords variable removed
      generatedImage = `https://images.unsplash.com/photo-1558060370-d644479cb6f7?auto=format&fit=crop&w=600&q=80`; // mechanical toy
      if (conceptPrompt.toLowerCase().includes("plush")) {
        generatedImage = "https://images.unsplash.com/photo-1559251606-c623743a6d76?auto=format&fit=crop&w=600&q=80";
      } else if (conceptPrompt.toLowerCase().includes("wood")) {
        generatedImage = "https://images.unsplash.com/photo-1515488042361-404e9250afef?auto=format&fit=crop&w=600&q=80";
      }
    }

    // Generate its vector embedding using local projection for perfect consistency
    const embedding = projectQueryToVector(conceptPrompt);

    return {
      id: simulatedId,
      name: result.name,
      category: result.category,
      price: result.price,
      description: result.description,
      image: generatedImage,
      ageGroup: result.ageGroup,
      materials: result.materials,
      tags: result.tags,
      embedding: embedding
    };
  } catch (error) {
    console.error("Error generating toy concept with Gemini:", error);
    throw new Error("Failed to manufacture custom toy. Please ensure your prompt is descriptive and key is valid.");
  }
};

// CODE VIPASSANA EDUCATIONAL CHAT GUIDE
export const chatWithGuide = async (message: string, chatHistory: { role: 'user' | 'model'; text: string }[]): Promise<string> => {
  if (!ai) {
    // Breathtakingly premium local educational advisor responses about Code Vipassana concepts
    await new Promise(resolve => setTimeout(resolve, 1000));
    const msg = message.toLowerCase();
    
    if (msg.includes("alloydb") || msg.includes("postgres") || msg.includes("database")) {
      return `### 🗄️ AlloyDB & PostgreSQL Vector Store
In the **Code Vipassana** architecture, **AlloyDB** serves as the ultimate high-performance database. Here is how it powers the Toy Store:
1. **pgvector extension**: This extension adds a native \`vector\` column type to Postgres, allowing us to store high-dimensional embeddings (e.g., 768 or 1536 floats representing semantic meanings of toys).
2. **Cosine Similarity Indexing**: Instead of basic text searching, AlloyDB uses \`<=>\` operator representing Cosine Distance. This returns products that match the *intent* of your search rather than simple keyword matches!
3. **ScaNN Indexing**: AlloyDB includes a specialized ScaNN index that accelerates nearest-neighbor searches by 10x-100x compared to standard databases, ensuring sub-millisecond retrieval times.`;
    }
    
    if (msg.includes("embedding") || msg.includes("vector") || msg.includes("cosine")) {
      return `### 📐 Understanding Vector Embeddings & Similarity
**Vector embeddings** are the magical mathematical core of AI search!
- **What is an Embedding?** It's an array of numbers (vectors) generated by an AI model (like Gemini). These numbers map the "semantic meaning" of an item in multi-dimensional space.
- **Our Toy Dimensions**: In this dashboard, we map toys to a **12-dimensional vector** representing Tech-level, Softness, Eco-materials, etc.
- **Cosine Similarity**: We calculate the angle between the Query Vector ($Q$) and the Product Vector ($P$). The math is:
  $$\\text{Similarity} = \\frac{Q \\cdot P}{\\|Q\\| \\|P\\|}$$
  A similarity close to **1.0 (or $0^\\circ$ angle)** represents a perfect conceptual match!`;
    }

    if (msg.includes("gemini") || msg.includes("imagen") || msg.includes("multimodal")) {
      return `### 👁️ Gemini & Imagen 3 Multimodal Orchestration
This project highlights how Generative AI collaborates with Cloud databases in **Code Vipassana**:
1. **Gemini 2.5 Flash**: Acts as the multimodal engine. When you upload a toy photo, it extracts its attributes (color, age group, material) and creates a search prompt. This prompt is projected to vectors, retrieving matching items from AlloyDB instantly.
2. **Imagen 3**: Generates photorealistic mockups of custom toys on the fly in the **Concept Lab**, allowing customers to "co-create" items.
3. **Toolbox Service**: Connects models directly to databases, facilitating automatic price estimations and inventory listings.`;
    }

    return `👋 **Welcome to the Code Vipassana Learning Center!**
I am your interactive workspace mentor. I can explain the advanced cloud backend concepts that drive the **Toy Store of the Future**.

Ask me about:
* **"How does AlloyDB and pgvector perform semantic search?"**
* **"What are Vector Embeddings and Cosine Similarity?"**
* **"How do Gemini and Imagen 3 co-create toys?"**
* **"What is the GenAI Toolbox for Databases?"**

Feel free to input a **Google Gemini API Key** in the settings panel above to see these database operations run live!`;
  }

  try {
    const systemPrompt = `You are a warm, highly knowledgeable developer advocate and AI advisor guiding a developer through a Code Vipassana codelab. 
The codelab is "Toy Store Search App with Cloud Databases, Serverless Runtimes and Open Source Integrations".
You explain how AlloyDB, pgvector, vector embeddings, Gemini 2.5 Flash, Imagen 3, and GenAI Toolbox interact in Google Cloud.
Use markdown tables, formulas, and bullet points to keep explanations clean, readable, and highly technical yet accessible.`;

    const contents = [
      { role: 'user', parts: [{ text: systemPrompt }] },
      { role: 'model', parts: [{ text: "Understood. I am your Code Vipassana guide. I am ready to explain the cloud database and Gen AI architecture." }] },
      ...chatHistory.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      })),
      { role: 'user', parts: [{ text: message }] }
    ];

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: contents,
    });

    return response.text || "I'm having trouble analyzing that. Can you rephrase?";
  } catch (error) {
    console.error("Error in Guide chat:", error);
    return "I'm experiencing connectivity issues. Please verify your Gemini API key, or use simulation mode by clearing the key!";
  }
};
