
export enum OilCategory {
  OLIVE = 'Olive Oil',
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

export interface ChemicalAnalysis {
  acidity: number; // %
  peroxideValue: number; // meq O2/kg
  polyphenols: number; // mg/kg
}

export interface Producer {
  id: string;
  name: string;
  country: string;
  region: string;
}

export interface OilProduct {
  id: string;
  name: string;
  producerId: string;
  category: OilCategory;
  score: number; // 0-100
  awards: AwardType[];
  analysis: ChemicalAnalysis;
  year: number;
  imageUrl: string;
}

export interface FilterState {
  search: string;
  category: OilCategory | 'All';
  award: AwardType | 'All';
  minScore: number;
}
