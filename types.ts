export enum EntityType {
  CHARACTER = 'CHARACTER',
  LORE = 'LORE',
  OBJECT = 'OBJECT',
  LOCATION = 'LOCATION'
}

export interface WorldEntity {
  id: string;
  name: string;
  type: EntityType;
  description: string;
  traits: string[];
  status?: string; // e.g., "Alive", "Lost", "Active"
  relationships?: string[]; // e.g., "Brother of X", "Owner of Y"
}

export interface CharacterInsight {
  dialogueSuggestions: string[];
  hiddenSecrets: string[];
  motivations: string[];
  futureArcIdeas: string[];
  flaws: string[];
}

export interface LoreInsight {
  detailedHistory: string;
  culturalSignificance: string;
  hiddenProperties: string[];
}

export interface PlotAnalysis {
  pacingScore: number; // 0-100
  pacingComment: string;
  plotHoles: string[]; // List of continuity errors
  narrativeSuggestions: string[]; // Ideas to move story forward
  continuityStatus: 'STABLE' | 'RISK' | 'BROKEN';
}

export interface WorldState {
  entities: WorldEntity[];
  lastUpdated: number;
}

export interface PacingDataPoint {
  segment: number;
  tension: number;
}