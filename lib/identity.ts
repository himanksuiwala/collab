export interface CursorData extends Record<string, unknown> {
  name: string;
  color: string;
}

const ADJECTIVES = [
  "Anonymous", "Clever", "Brave", "Mighty", "Swift",
  "Silent", "Fierce", "Noble", "Wise", "Loyal",
  "Sneaky", "Happy", "Lucky", "Cosmic", "Wild"
];

const ANIMALS = [
  "Panda", "Fox", "Bear", "Wolf", "Tiger",
  "Eagle", "Shark", "Lion", "Falcon", "Panther",
  "Koala", "Penguin", "Rhino", "Dragon", "Phoenix"
];

const COLORS = [
  "#ef4444", // Red
  "#f97316", // Orange
  "#f59e0b", // Amber
  "#84cc16", // Lime
  "#22c55e", // Green
  "#10b981", // Emerald
  "#06b6d4", // Cyan
  "#0ea5e9", // Sky
  "#3b82f6", // Blue
  "#6366f1", // Indigo
  "#8b5cf6", // Violet
  "#d946ef", // Fuchsia
  "#f43f5e", // Rose
];

/**
 * Generates a random session identity consisting of a pseudonym and a hex color.
 */
export function generateIdentity(): CursorData {
  let storedIdentity: CursorData | null = null;
  
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem("localUserName");
      if (stored) {
        storedIdentity = JSON.parse(stored);
      }
    } catch (e) {
      // Ignore JSON parse errors
    }
  }

  if (storedIdentity && storedIdentity.name && storedIdentity.color) {
    return storedIdentity;
  }

  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const animal = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
  const color = COLORS[Math.floor(Math.random() * COLORS.length)];
  
  const newIdentity = {
    name: `${adj} ${animal}`,
    color,
  };

  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("localUserName", JSON.stringify(newIdentity));
    } catch (e) {
      // Ignore quota errors
    }
  }

  return newIdentity;
}
