import type { Toy } from './toysData';

// Calculates Cosine Similarity between two vectors: A . B / (||A|| * ||B||)
export const calculateCosineSimilarity = (vecA: number[], vecB: number[]): number => {
  if (vecA.length !== vecB.length) return 0;
  
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
};

// Projects a natural language string query into our 12-dimensional vector space.
// This is a powerful local heuristic classifier that mirrors what a neural embedding model does.
export const projectQueryToVector = (query: string): number[] => {
  const q = query.toLowerCase();
  
  // Start with a neutral baseline vector [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5]
  const vector = Array(12).fill(0.5);

  // 1. Tech/Electronic vs Traditional
  if (hasAny(q, ["robot", "electronic", "smart", "ai", "app", "digital", "charge", "battery", "led", "wire"])) {
    vector[0] = 0.9;
  } else if (hasAny(q, ["wooden", "blocks", "wood", "traditional", "cardboard", "classic", "natural"])) {
    vector[0] = 0.1;
  }

  // 2. Interactive vs Static
  if (hasAny(q, ["interactive", "autonomous", "reacts", "narrator", "voice", "remote", "rc", "move", "glider"])) {
    vector[1] = 0.9;
  } else if (hasAny(q, ["static", "boardgame", "terrarium", "plush", "canvas", "sand"])) {
    vector[1] = 0.2;
  }

  // 3. Soft vs Rigid
  if (hasAny(q, ["soft", "plush", "hug", "cuddly", "felt", "cloth", "baby", "toddler", "sleep"])) {
    vector[2] = 0.9;
  } else if (hasAny(q, ["metal", "titanium", "glass", "hard", "wood", "rigid", "plastic", "abs"])) {
    vector[2] = 0.1;
  }

  // 4. Indoors vs Outdoors
  if (hasAny(q, ["outdoor", "garden", "glider", "flying", "buggy", "rc car", "speed", "climb", "wind"])) {
    vector[3] = 0.1;
  } else if (hasAny(q, ["indoor", "room", "table", "boardgame", "sandbox", "chemistry", "home"])) {
    vector[3] = 0.9;
  }

  // 5. Toddler/Young vs Teen/Adult
  if (hasAny(q, ["baby", "toddler", "infant", "3-6", "0-5", "young", "kid", "little"])) {
    vector[4] = 0.1;
  } else if (hasAny(q, ["teen", "adult", "12+", "advanced", "complex", "difficult", "coding", "chemistry"])) {
    vector[4] = 0.9;
  }

  // 6. Creative/Artistic vs Analytical
  if (hasAny(q, ["art", "creative", "drawing", "paint", "canvas", "sketch", "mold", "design"])) {
    vector[5] = 0.9;
  } else if (hasAny(q, ["code", "stem", "math", "logic", "chemistry", "experiments", "puzzles", "strategy"])) {
    vector[5] = 0.1;
  }

  // 7. Science/Space vs Nature/Animals
  if (hasAny(q, ["space", "nebula", "galactic", "quantum", "astronomy", "atom", "universe"])) {
    vector[6] = 0.9;
  } else if (hasAny(q, ["dragon", "nature", "biodegradable", "eco", "forest", "coral", "reef", "biological"])) {
    vector[6] = 0.2;
  }

  // 8. Multiplayer/Social vs Solo
  if (hasAny(q, ["multiplayer", "social", "boardgame", "co-op", "family", "together", "friends"])) {
    vector[7] = 0.9;
  } else if (hasAny(q, ["solo", "single", "companion", "nightlight", "sandbox", "canvas"])) {
    vector[7] = 0.2;
  }

  // 9. Bio/Wood/Eco vs Metal/Plastic
  if (hasAny(q, ["wooden", "birch", "natural", "eco", "organic", "felt", "biodegradable"])) {
    vector[8] = 0.1;
  } else if (hasAny(q, ["plastic", "titanium", "alloy", "metal", "circuitry", "lithium", "battery"])) {
    vector[8] = 0.9;
  }

  // 10. Dynamic Movement vs Stationary
  if (hasAny(q, ["move", "speed", "glider", "flying", "track", "buggy", "rc", "tires", "run"])) {
    vector[9] = 0.9;
  } else if (hasAny(q, ["stationary", "boardgame", "plush", "canvas", "terrarium", "blocks"])) {
    vector[9] = 0.1;
  }

  // 11. STEM/Educational vs Recreational
  if (hasAny(q, ["stem", "educational", "learning", "teaches", "physics", "science", "chemistry", "coding"])) {
    vector[10] = 0.9;
  } else if (hasAny(q, ["recreational", "toy", "nightlight", "fun", "rc car", "speed", "dragon"])) {
    vector[10] = 0.2;
  }

  // 12. Fantasy/Magic vs Reality/Sci-Fi
  if (hasAny(q, ["dragon", "magic", "fantasy", "glowing", "holographic", "light-stylus"])) {
    vector[11] = 0.9;
  } else if (hasAny(q, ["real", "reality", "science", "chemistry", "rc car", "track"])) {
    vector[11] = 0.1;
  }

  // Normalize the vector
  return normalizeVector(vector);
};

// Normalizes a vector to unit length so that cosine similarity is simply the dot product.
const normalizeVector = (vector: number[]): number[] => {
  const sumOfSquares = vector.reduce((sum, val) => sum + val * val, 0);
  const magnitude = Math.sqrt(sumOfSquares);
  if (magnitude === 0) return vector;
  return vector.map(val => val / magnitude);
};

const hasAny = (text: string, keywords: string[]): boolean => {
  return keywords.some(keyword => text.includes(keyword));
};

export interface SearchResult {
  toy: Toy;
  similarity: number;
}

// Searches toys by comparing the similarity of each toy's pre-computed embedding
// to the target query vector. Returns matching items sorted by similarity descending.
export const performVectorSearch = (queryVector: number[], database: Toy[]): SearchResult[] => {
  return database
    .map(toy => ({
      toy,
      similarity: calculateCosineSimilarity(queryVector, toy.embedding)
    }))
    .sort((a, b) => b.similarity - a.similarity);
};
