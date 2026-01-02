
import { OilProduct, OilCategory, AwardType, Producer } from './types';

export const PRODUCERS: Producer[] = [
  { id: 'p1', name: 'Castillo de Canena', country: 'Spain', region: 'Jaén' },
  { id: 'p2', name: 'Argan d\'Or', country: 'Morocco', region: 'Agadir' },
  { id: 'p3', name: 'Golden Fields', country: 'France', region: 'Provence' },
  { id: 'p4', name: 'Oléi', country: 'Spain', region: 'Galicia' },
  { id: 'p5', name: 'Atlas Heritage', country: 'Morocco', region: 'Marrakech' },
  { id: 'p6', name: 'Pure Press', country: 'Canada', region: 'Alberta' },
];

export const OIL_PRODUCTS: OilProduct[] = [
  {
    id: '1',
    name: 'Family Reserve Picual',
    producerId: 'p1',
    category: OilCategory.OLIVE,
    score: 98,
    awards: [AwardType.BEST_IN_CLASS, AwardType.GOLD],
    analysis: { acidity: 0.12, peroxideValue: 4.5, polyphenols: 580 },
    year: 2024,
    imageUrl: 'https://picsum.photos/seed/olive1/400/400'
  },
  {
    id: '2',
    name: 'Premium Argan Nectar',
    producerId: 'p2',
    category: OilCategory.ARGAN,
    score: 95,
    awards: [AwardType.GOLD],
    analysis: { acidity: 0.25, peroxideValue: 8.1, polyphenols: 620 },
    year: 2024,
    imageUrl: 'https://picsum.photos/seed/argan1/400/400'
  },
  {
    id: '3',
    name: 'Artisan Colza Gold',
    producerId: 'p3',
    category: OilCategory.COLZA,
    score: 89,
    awards: [AwardType.SILVER],
    analysis: { acidity: 0.08, peroxideValue: 2.1, polyphenols: 150 },
    year: 2024,
    imageUrl: 'https://picsum.photos/seed/colza1/400/400'
  },
  {
    id: '4',
    name: 'Ancestral Argan Oil',
    producerId: 'p5',
    category: OilCategory.ARGAN,
    score: 92,
    awards: [AwardType.GOLD],
    analysis: { acidity: 0.31, peroxideValue: 9.2, polyphenols: 590 },
    year: 2024,
    imageUrl: 'https://picsum.photos/seed/argan2/400/400'
  },
  {
    id: '5',
    name: 'Coastal Olive Blend',
    producerId: 'p4',
    category: OilCategory.OLIVE,
    score: 87,
    awards: [AwardType.SILVER],
    analysis: { acidity: 0.18, peroxideValue: 5.2, polyphenols: 410 },
    year: 2024,
    imageUrl: 'https://picsum.photos/seed/olive2/400/400'
  },
  {
    id: '6',
    name: 'Northern Prairie Rapeseed',
    producerId: 'p6',
    category: OilCategory.COLZA,
    score: 82,
    awards: [AwardType.BRONZE],
    analysis: { acidity: 0.05, peroxideValue: 1.8, polyphenols: 120 },
    year: 2024,
    imageUrl: 'https://picsum.photos/seed/colza2/400/400'
  }
];
