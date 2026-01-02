
export enum OilCategory {
  OLIVE = 'Extra Virgin Olive Oil',
  ARGAN = 'Argan Oil',
  COLZA = 'Canola Oil (Colza)',
  SESAME = 'Sesame Oil',
  AVOCADO = 'Avocado Oil'
}

export enum AwardType {
  BEST_IN_CLASS = 'Best in Class',
  GOLD = 'Gold Award',
  SILVER = 'Silver Award',
  BRONZE = 'Bronze Award'
}

export type Intensity = 'Delicate' | 'Medium' | 'Robust';
export type Language = 'en' | 'fr' | 'es' | 'it' | 'ar';

export interface ChemicalAnalysis {
  acidity: number; // %
  peroxideValue: number; // meq O2/kg
  polyphenols: number; // mg/kg
  fruity?: number; // 0-10 scale
  bitter?: number; // 0-10 scale
  pungent?: number; // 0-10 scale
}

export interface Producer {
  id: string;
  name: string;
  country: string;
  region: string;
  website?: string;
}

export interface OilProduct {
  id: string;
  name: string;
  producerId: string;
  category: OilCategory;
  score: number; // 0-100
  intensity: Intensity;
  varietals: string[];
  tastingNotes: string[];
  awards: AwardType[];
  analysis: ChemicalAnalysis;
  year: number;
  imageUrl: string;
}

export interface FilterState {
  search: string;
  category: OilCategory | 'All';
  country: string | 'All';
  award: AwardType | 'All';
  intensity: Intensity | 'All';
  minScore: number;
  language: Language;
}
