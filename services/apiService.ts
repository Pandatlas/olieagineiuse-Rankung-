
import { OIL_PRODUCTS, PRODUCERS } from '../data';
import { OilProduct, Producer, FilterState, AwardType } from '../types';

export class OliveOilTimesAPI {
  static async getRankings(filters: FilterState): Promise<OilProduct[]> {
    // Simulating network delay
    await new Promise(resolve => setTimeout(resolve, 300));

    return OIL_PRODUCTS.filter(product => {
      const producer = PRODUCERS.find(p => p.id === product.producerId);
      const searchStr = `${product.name} ${producer?.name} ${product.varietals.join(' ')}`.toLowerCase();
      
      const matchesSearch = searchStr.includes(filters.search.toLowerCase());
      const matchesCategory = filters.category === 'All' || product.category === filters.category;
      const matchesCountry = filters.country === 'All' || producer?.country === filters.country;
      const matchesAward = filters.award === 'All' || product.awards.includes(filters.award as any);
      const matchesIntensity = filters.intensity === 'All' || product.intensity === filters.intensity;
      const matchesScore = product.score >= filters.minScore;

      return matchesSearch && matchesCategory && matchesCountry && matchesAward && matchesScore && matchesIntensity;
    }).sort((a, b) => b.score - a.score);
  }

  static async getProducer(id: string): Promise<Producer | undefined> {
    return PRODUCERS.find(p => p.id === id);
  }

  // Fixed: use .some() instead of .includes() when passing a callback function to check for specific awards
  static async getTopWinners(): Promise<OilProduct[]> {
    return OIL_PRODUCTS.filter(p => 
      p.awards.some(award => award === AwardType.BEST_IN_CLASS || award === AwardType.GOLD)
    ).slice(0, 3);
  }
}
