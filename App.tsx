
import React, { useState, useMemo } from 'react';
import { OIL_PRODUCTS, PRODUCERS } from './data';
import { FilterState, OilCategory, AwardType } from './types';
import RankingTable from './components/RankingTable';
import FilterBar from './components/FilterBar';

const App: React.FC = () => {
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    category: 'All',
    award: 'All',
    minScore: 0
  });

  const filteredProducts = useMemo(() => {
    return OIL_PRODUCTS.filter(product => {
      const producer = PRODUCERS.find(p => p.id === product.producerId);
      const searchStr = `${product.name} ${producer?.name}`.toLowerCase();
      
      const matchesSearch = searchStr.includes(filters.search.toLowerCase());
      const matchesCategory = filters.category === 'All' || product.category === filters.category;
      const matchesAward = filters.award === 'All' || product.awards.includes(filters.award as AwardType);
      const matchesScore = product.score >= filters.minScore;

      return matchesSearch && matchesCategory && matchesAward && matchesScore;
    }).sort((a, b) => b.score - a.score);
  }, [filters]);

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <header className="bg-slate-900 text-white sticky top-0 z-40 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-amber-600 p-2 rounded-lg">
              <i className="fa-solid fa-droplet text-white text-2xl"></i>
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">World Oil Ranking</h1>
              <p className="text-[10px] uppercase tracking-widest text-amber-500 font-bold">Official Quality Portal</p>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
            <a href="#" className="hover:text-amber-500 transition-colors">Winners</a>
            <a href="#" className="hover:text-amber-500 transition-colors">Methodology</a>
            <a href="#" className="hover:text-amber-500 transition-colors">Producers</a>
            <button className="bg-amber-600 hover:bg-amber-700 px-5 py-2 rounded-full transition-all shadow-md">
              Submit Samples
            </button>
          </nav>

          <button className="md:hidden text-2xl">
            <i className="fa-solid fa-bars"></i>
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-80 bg-slate-800 flex items-center justify-center overflow-hidden">
        <img 
          src="https://picsum.photos/seed/oil-field/1200/400" 
          className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-overlay"
          alt="Banner"
        />
        <div className="relative z-10 text-center px-4">
          <h2 className="text-4xl md:text-6xl font-black text-white mb-4 drop-shadow-lg">
            2024 Global Ranking
          </h2>
          <p className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Discover the world's most exceptional Argan, Olive, and Specialty oils, vetted by chemical rigorous standards and professional sensory panels.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full lg:w-80 flex-shrink-0">
            <FilterBar filters={filters} onFilterChange={setFilters} />
          </aside>

          {/* Table Area */}
          <div className="flex-1 space-y-6">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex justify-between items-center">
              <span className="text-slate-500 font-medium">
                Showing <span className="text-slate-900 font-bold">{filteredProducts.length}</span> verified results
              </span>
              <div className="flex items-center space-x-2 text-sm">
                <span className="text-slate-400">Sort:</span>
                <select className="bg-transparent font-bold text-slate-700 focus:outline-none cursor-pointer">
                  <option>Highest Score</option>
                  <option>Producer (A-Z)</option>
                  <option>Recent Wins</option>
                </select>
              </div>
            </div>

            <RankingTable products={filteredProducts} producers={PRODUCERS} />
            
            {/* Quick Stats / Info Card */}
            <div className="grid md:grid-cols-3 gap-6 mt-12">
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <i className="fa-solid fa-microscope text-amber-600 text-3xl mb-4"></i>
                <h4 className="font-bold text-lg mb-2">Chemical Integrity</h4>
                <p className="text-sm text-slate-600">Every listed oil undergoes GC-MS and HPLC testing to verify purity and nutrient density.</p>
              </div>
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <i className="fa-solid fa-earth-americas text-amber-600 text-3xl mb-4"></i>
                <h4 className="font-bold text-lg mb-2">Global Coverage</h4>
                <p className="text-sm text-slate-600">Representing over 45 regions including traditional Moroccan Argan groves and Spanish Picual estates.</p>
              </div>
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <i className="fa-solid fa-shield-check text-amber-600 text-3xl mb-4"></i>
                <h4 className="font-bold text-lg mb-2">Fair Evaluation</h4>
                <p className="text-sm text-slate-600">Our double-blind sensory evaluation ensures unbiased ranking for every participant.</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-20 py-12 bg-slate-900 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-500 text-sm">
            © 2024 World Oil Ranking Portal. All data provided for international distribution under the Oil Quality Standards Act.
          </p>
          <div className="flex justify-center space-x-6 mt-6">
            <a href="#" className="text-slate-400 hover:text-white transition-colors"><i className="fa-brands fa-twitter"></i></a>
            <a href="#" className="text-slate-400 hover:text-white transition-colors"><i className="fa-brands fa-instagram"></i></a>
            <a href="#" className="text-slate-400 hover:text-white transition-colors"><i className="fa-brands fa-linkedin"></i></a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
