
import { OilProduct, OilCategory, AwardType, Producer } from './types';

export const PRODUCERS: Producer[] = [
  { "id": "p1", "name": "Castillo de Canena", "country": "Spain", "region": "Jaén", "website": "castillodecanena.com" },
  { "id": "p2", "name": "Frantoio Franci", "country": "Italy", "region": "Tuscany", "website": "frantoiofranci.it" },
  { "id": "p3", "name": "Almazaras de la Subbética", "country": "Spain", "region": "Córdoba" },
  { "id": "p5", "name": "Coopérative Tighanimine", "country": "Morocco", "region": "Souss-Massa", "website": "tighanimine.com" },
  { "id": "p6", "name": "Coopérative Taitmatine", "country": "Morocco", "region": "Taroudant" },
  { "id": "p7", "name": "Coopérative Ajddigue", "country": "Morocco", "region": "Essaouira" },
  { "id": "p8", "name": "Coopérative Toudarte", "country": "Morocco", "region": "Agadir" },
  { "id": "p9", "name": "Kyklopas", "country": "Greece", "region": "Makri" },
  { "id": "p10", "name": "Domenica Fiore", "country": "Italy", "region": "Umbria" },
  { "id": "p11", "name": "Cho Group (Terra Delyssa)", "country": "Tunisia", "region": "Kairouan" },
  { "id": "p12", "name": "Herdade do Esporão", "country": "Portugal", "region": "Alentejo" },
  { "id": "p13", "name": "Nova Vera", "country": "Turkey", "region": "Ayvalık" },
  { "id": "p14", "name": "California Olive Ranch", "country": "USA", "region": "California" },
  { "id": "p15", "name": "Laur Olive Oil", "country": "Argentina", "region": "Mendoza" },
  { "id": "p16", "name": "Chiavalon", "country": "Croatia", "region": "Istria" }
];

export const OIL_PRODUCTS: OilProduct[] = [
  {
    "id": "arg-tm-1",
    "name": "Huile d'Argan Torréfiée (IGP Maroc)",
    "producerId": "p5",
    "category": OilCategory.ARGAN,
    "score": 97,
    "intensity": "Robust",
    "varietals": ["Argania Spinosa"],
    "tastingNotes": ["Toasted Hazelnut", "Warm Sesame", "Crème Brûlée"],
    "awards": [AwardType.BEST_IN_CLASS, AwardType.GOLD],
    "analysis": { 
      "acidity": 0.18, "peroxideValue": 5.2, "polyphenols": 690,
      "fruity": 9.5, "bitter": 2.0, "pungent": 3.0
    },
    "year": 2025,
    "imageUrl": "https://images.unsplash.com/photo-1620332372374-f108c53d2e03?auto=format&fit=crop&q=80&w=400&h=400"
  },
  {
    "id": "tun-1",
    "name": "Terra Delyssa Premium Bio",
    "producerId": "p11",
    "category": OilCategory.OLIVE,
    "score": 93,
    "intensity": "Delicate",
    "varietals": ["Chetoui", "Chemlali"],
    "tastingNotes": ["Artichoke", "Mild Pepper", "Green Apple"],
    "awards": [AwardType.GOLD],
    "analysis": { 
      "acidity": 0.21, "peroxideValue": 6.1, "polyphenols": 420,
      "fruity": 7.0, "bitter": 3.0, "pungent": 3.5
    },
    "year": 2025,
    "imageUrl": "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=400&h=400"
  },
  {
    "id": "1",
    "name": "Reserva Familiar Picual",
    "producerId": "p1",
    "category": OilCategory.OLIVE,
    "score": 99,
    "intensity": "Robust",
    "varietals": ["Picual"],
    "tastingNotes": ["Tomato leaf", "Green Grass", "Artichoke"],
    "awards": [AwardType.BEST_IN_CLASS, AwardType.GOLD],
    "analysis": { 
      "acidity": 0.11, "peroxideValue": 3.8, "polyphenols": 640,
      "fruity": 8.5, "bitter": 7.0, "pungent": 7.5
    },
    "year": 2025,
    "imageUrl": "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=400&h=400"
  },
  {
    "id": "por-1",
    "name": "Esporão Selecção",
    "producerId": "p12",
    "category": OilCategory.OLIVE,
    "score": 95,
    "intensity": "Medium",
    "varietals": ["Galega", "Cobrançosa"],
    "tastingNotes": ["Walnut Shell", "Ripe Fruits"],
    "awards": [AwardType.GOLD],
    "analysis": { 
      "acidity": 0.14, "peroxideValue": 4.8, "polyphenols": 510,
      "fruity": 7.8, "bitter": 4.5, "pungent": 5.0
    },
    "year": 2025,
    "imageUrl": "https://images.unsplash.com/photo-1541854615901-93c354197834?auto=format&fit=crop&q=80&w=400&h=400"
  },
  {
    "id": "cro-1",
    "name": "Chiavalon Ex Albis",
    "producerId": "p16",
    "category": OilCategory.OLIVE,
    "score": 96,
    "intensity": "Robust",
    "varietals": ["Buža", "Istarska Bjelica"],
    "tastingNotes": ["Wild Asparagus", "Chicory", "Black Pepper"],
    "awards": [AwardType.BEST_IN_CLASS, AwardType.GOLD],
    "analysis": { 
      "acidity": 0.12, "peroxideValue": 3.9, "polyphenols": 590,
      "fruity": 8.2, "bitter": 6.5, "pungent": 7.0
    },
    "year": 2025,
    "imageUrl": "https://images.unsplash.com/photo-1620332372374-f108c53d2e03?auto=format&fit=crop&q=80&w=400&h=400"
  },
  {
    "id": "arg-tm-2",
    "name": "Huile d'Argan Extra Vierge Bio",
    "producerId": "p6",
    "category": OilCategory.ARGAN,
    "score": 94,
    "intensity": "Medium",
    "varietals": ["Argania Spinosa"],
    "tastingNotes": ["Fresh Almond", "Green Walnut", "Floral Honey"],
    "awards": [AwardType.GOLD],
    "analysis": { 
      "acidity": 0.22, "peroxideValue": 6.8, "polyphenols": 610,
      "fruity": 7.5, "bitter": 2.5, "pungent": 2.5
    },
    "year": 2025,
    "imageUrl": "https://images.unsplash.com/photo-1621340150117-91a62d08316c?auto=format&fit=crop&q=80&w=400&h=400"
  },
  {
    "id": "usa-1",
    "name": "Miller's Blend",
    "producerId": "p14",
    "category": OilCategory.OLIVE,
    "score": 92,
    "intensity": "Medium",
    "varietals": ["Arbequina", "Arbosana"],
    "tastingNotes": ["Fruity", "Light Herbaceous"],
    "awards": [AwardType.SILVER],
    "analysis": { 
      "acidity": 0.17, "peroxideValue": 5.5, "polyphenols": 380,
      "fruity": 6.5, "bitter": 3.5, "pungent": 4.0
    },
    "year": 2025,
    "imageUrl": "https://images.unsplash.com/photo-1626202341410-91a99f16c522?auto=format&fit=crop&q=80&w=400&h=400"
  }
];
