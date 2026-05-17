export interface Toy {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  image: string;
  ageGroup: string;
  materials: string[];
  tags: string[];
  embedding: number[]; // 12-dimensional normalized attribute vector
  highlight?: boolean;
}

export const TOY_DIMENSIONS = [
  "Tech/Electronic (vs. Traditional)",
  "Interactive/Autonomous (vs. Static)",
  "Soft/Plush (vs. Rigid/Hard)",
  "Indoors (vs. Outdoors)",
  "Toddler/Young (vs. Teen/Adult)",
  "Creative/Artistic (vs. Analytical/Logic)",
  "Science/Space (vs. Nature/Animals)",
  "Multiplayer/Social (vs. Solo)",
  "Bio/Wood/Eco (vs. Metal/Plastic)",
  "Dynamic Movement (vs. Stationary)",
  "STEM/Educational (vs. Recreational)",
  "Fantasy/Magic (vs. Reality/Sci-Fi)"
];

export const preSeededToys: Toy[] = [
  {
    id: "toy_1",
    name: "Nebula Knight Robo-Pal",
    category: "Robotics",
    price: 89.99,
    description: "An AI-powered robotic companion that teaches kids coding and galactic astronomy. Reacts to voice commands and navigates obstacles with glowing LED eyes.",
    image: "https://images.unsplash.com/photo-1531747118685-ca8fa6e08806?auto=format&fit=crop&w=600&q=80",
    ageGroup: "8-12 years",
    materials: ["Recycled ABS Plastic", "Copper Circuitry", "Lithium Ion battery"],
    tags: ["robot", "coding", "ai", "electronics", "space", "smart", "interactive"],
    embedding: [1.0, 1.0, 0.1, 0.9, 0.7, 0.2, 1.0, 0.3, 0.9, 0.8, 1.0, 0.2]
  },
  {
    id: "toy_2",
    name: "Eco-Sprout Forest Tracks",
    category: "Wooden Toys",
    price: 34.99,
    description: "A beautifully hand-crafted, modular wooden marble run made from premium FSC birch. Promotes fine motor skills and spatial intuition through natural gravity play.",
    image: "https://images.unsplash.com/photo-1515488042361-404e9250afef?auto=format&fit=crop&w=600&q=80",
    ageGroup: "3-6 years",
    materials: ["FSC Birch Wood", "Organic Water-based Paint", "Natural Felt"],
    tags: ["wooden", "blocks", "natural", "eco-friendly", "physics", "toddler", "gravity"],
    embedding: [0.0, 0.0, 0.0, 1.0, 0.2, 0.8, 0.1, 0.5, 0.0, 0.7, 0.8, 0.5]
  },
  {
    id: "toy_3",
    name: "Quantum Chemistry Set",
    category: "STEM",
    price: 49.99,
    description: "Conduct safe molecular experiments and explore quantum physics. Features a companion Augmented Reality (AR) headset that visualizes atomic bonds in real time.",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80",
    ageGroup: "12+ years",
    materials: ["Borosilicate Glass", "AR Visor", "Biodegradable Chemical Vials"],
    tags: ["science", "chemistry", "ar", "stem", "learning", "advanced", "physics"],
    embedding: [0.8, 0.4, 0.0, 1.0, 0.9, 0.1, 0.9, 0.2, 0.7, 0.1, 1.0, 0.1]
  },
  {
    id: "toy_4",
    name: "Bioluminescent Dragon-Hug",
    category: "Plushies",
    price: 27.99,
    description: "A super-soft, cuddly plush dragon made from self-charging bio-glow fabric. Gently radiates a soft soothing teal light in the dark, acting as a smart nightlight.",
    image: "https://images.unsplash.com/photo-1559251606-c623743a6d76?auto=format&fit=crop&w=600&q=80",
    ageGroup: "0-5 years",
    materials: ["Bio-glow Organic Cotton", "Recycled Polyester Stuffing", "Micro-LED Glow-Core"],
    tags: ["plush", "nightlight", "dragon", "soft", "baby", "toddler", "glowing", "fantasy"],
    embedding: [0.3, 0.2, 1.0, 1.0, 0.1, 0.6, 0.3, 0.1, 0.3, 0.0, 0.1, 1.0]
  },
  {
    id: "toy_5",
    name: "Titanium Terrain Buggy",
    category: "Vehicles",
    price: 119.99,
    description: "A heavy-duty, outdoor RC vehicle with multi-terrain tread. Reaches speeds of up to 25mph, features hydraulic shocks and shockproof aluminum roll-cage.",
    image: "https://images.unsplash.com/photo-1594787318286-3d835c1d207f?auto=format&fit=crop&w=600&q=80",
    ageGroup: "10+ years",
    materials: ["Titanium Alloy Frame", "Vulcanized Rubber Tires", "Brushless DC Motor"],
    tags: ["rc car", "outdoor", "speed", "racing", "rugged", "vehicle", "remote control"],
    embedding: [0.9, 0.9, 0.0, 0.1, 0.8, 0.1, 0.2, 0.4, 0.9, 1.0, 0.3, 0.0]
  },
  {
    id: "toy_6",
    name: "Cosmic Voyager Sandbox Kit",
    category: "Creative Play",
    price: 19.99,
    description: "Never-drying hydrophobic sand that molds like clay under water and stays completely dry when pulled out. Includes high-tech molds of space bases and alien fauna.",
    image: "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=600&q=80",
    ageGroup: "4-8 years",
    materials: ["Silica Kinetic Sand", "PLA Molds", "Hydrophobic Coating"],
    tags: ["sandbox", "creative", "tactile", "space", "water", "sensory", "toddler"],
    embedding: [0.1, 0.0, 0.8, 0.6, 0.3, 0.9, 0.6, 0.3, 0.4, 0.2, 0.5, 0.7]
  },
  {
    id: "toy_7",
    name: "Chrono-Quest Board Game",
    category: "Tabletop",
    price: 39.99,
    description: "A collaborative time-travel board game featuring historical puzzles. Integrates an optional smartphone app that acts as an interactive narrator and companion.",
    image: "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&w=600&q=80",
    ageGroup: "10+ years",
    materials: ["FSC Recycled Cardboard", "Wood Player Tokens", "Organic Soy Inks"],
    tags: ["boardgame", "co-op", "multiplayer", "history", "puzzles", "strategy", "app-linked"],
    embedding: [0.5, 0.5, 0.0, 1.0, 0.7, 0.6, 0.3, 1.0, 0.1, 0.1, 0.8, 0.9]
  },
  {
    id: "toy_8",
    name: "Solaris Wind Glider",
    category: "Outdoor",
    price: 24.99,
    description: "An aerodynamic solar glider made from carbon fiber sheets. Absorb sun energy during soaring flights to activate turbo-thrust propellers for high altitude climbs.",
    image: "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=600&q=80",
    ageGroup: "8+ years",
    materials: ["Ultralight Carbon Fiber", "Micro Solar Cells", "EPP Foam"],
    tags: ["glider", "flying", "solar", "wind", "outdoor", "aerodynamics", "green-energy"],
    embedding: [0.7, 0.6, 0.1, 0.0, 0.6, 0.2, 0.8, 0.2, 0.3, 1.0, 0.7, 0.1]
  },
  {
    id: "toy_9",
    name: "Holographic Pixel Canvas",
    category: "Creative Play",
    price: 54.99,
    description: "Draw in three dimensions! A light-field projection screen that lets children sketch shimmering glowing shapes in mid-air using a magnetic light-stylus.",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80",
    ageGroup: "6-12 years",
    materials: ["Holographic Projection Film", "Indium-Tin-Oxide Glass", "Stylus Pen"],
    tags: ["hologram", "drawing", "creative", "art", "light", "futuristic", "3d"],
    embedding: [0.9, 0.7, 0.0, 1.0, 0.5, 1.0, 0.4, 0.2, 0.9, 0.3, 0.6, 0.8]
  },
  {
    id: "toy_10",
    name: "Bio-Construct Coral Reef",
    category: "STEM",
    price: 29.99,
    description: "Grow your own miniature underwater ecosystem! Seed real, friendly bio-engineered crystals that form organic reef shapes and support small aquatic life.",
    image: "https://images.unsplash.com/photo-1546026423-cc4642628d2b?auto=format&fit=crop&w=600&q=80",
    ageGroup: "7-11 years",
    materials: ["Aquatic Terrarium", "Non-toxic Crystallizing Minerals", "Lichen Seeds"],
    tags: ["biology", "ecosystem", "nature", "terrarium", "grow", "science", "marine"],
    embedding: [0.2, 0.1, 0.1, 1.0, 0.5, 0.8, 0.2, 0.1, 0.2, 0.1, 0.9, 0.4]
  }
];
