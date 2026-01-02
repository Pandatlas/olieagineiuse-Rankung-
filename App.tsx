
import React, { useState, useEffect } from 'react';
import { PRODUCERS } from './data';
import { FilterState, Language, OilProduct } from './types';
import { translations } from './translations';
import { OliveOilTimesAPI } from './services/apiService';
import RankingTable from './components/RankingTable';
import FilterBar from './components/FilterBar';
import ChatBot from './components/ChatBot';
import AiHub from './components/AiHub';

const App: React.FC = () => {
  const [isAiHubOpen, setIsAiHubOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [products, setProducts] = useState<OilProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    category: 'All',
    country: 'All',
    award: 'All',
    intensity: 'All',
    minScore: 0,
    language: 'en'
  });

  const t = translations[filters.language];

  // Effet pour appliquer physiquement la classe dark sur le document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const results = await OliveOilTimesAPI.getRankings(filters);
      setProducts(results);
      setLoading(false);
    };
    loadData();
  }, [filters]);

  const changeLanguage = (lang: Language) => {
    setFilters(prev => ({ ...prev, language: lang }));
  };

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  return (
    <div className={`min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 ${filters.language === 'ar' ? 'rtl' : 'ltr'}`} dir={filters.language === 'ar' ? 'rtl' : 'ltr'}>
      <header className="bg-slate-900 text-white sticky top-0 z-40 shadow-lg border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-amber-600 p-2 rounded-lg">
              <i className="fa-solid fa-crown text-white text-xl"></i>
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-black tracking-tighter uppercase">{t.title}</h1>
              <p className="text-[10px] uppercase tracking-[0.2em] text-amber-500 font-black">{t.subtitle}</p>
            </div>
          </div>
          
          <nav className="hidden lg:flex items-center space-x-6 text-xs font-black uppercase tracking-widest">
            <button 
              onClick={toggleDarkMode}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors border border-slate-700"
              aria-label="Toggle Dark Mode"
            >
              <i className={`fa-solid ${isDarkMode ? 'fa-sun text-amber-400' : 'fa-moon text-slate-400'}`}></i>
            </button>

            <div className="relative group">
              <button className="flex items-center gap-2 px-3 py-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors border border-slate-700">
                <i className="fa-solid fa-globe text-amber-500"></i>
                {filters.language}
                <i className="fa-solid fa-chevron-down text-[8px]"></i>
              </button>
              <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-slate-900 rounded-xl shadow-2xl overflow-hidden hidden group-hover:block border border-slate-100 dark:border-slate-800 animate-in fade-in slide-in-from-top-2">
                {(['en', 'fr', 'es', 'it', 'ar'] as Language[]).map(lang => (
                  <button
                    key={lang}
                    onClick={() => changeLanguage(lang)}
                    className={`w-full text-left px-4 py-3 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-3 transition-colors ${filters.language === lang ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-600' : ''}`}
                  >
                    <span className="uppercase text-[10px] font-black">{lang}</span>
                    <span className="text-[10px]">
                        {lang === 'en' && 'English'}
                        {lang === 'fr' && 'Français'}
                        {lang === 'es' && 'Español'}
                        {lang === 'it' && 'Italiano'}
                        {lang === 'ar' && 'العربية'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <button 
              onClick={() => setIsAiHubOpen(true)}
              className="flex items-center gap-2 bg-amber-500 text-slate-900 px-4 py-2 rounded-full font-black hover:bg-amber-400 transition-all shadow-lg"
            >
              <i className="fa-solid fa-wand-sparkles"></i>
              {t.aiStudio}
            </button>
            <div className="h-6 w-px bg-slate-800"></div>
            <a href="#" className="hover:text-amber-500 transition-colors">{t.winners}</a>
            <button className="bg-slate-800 border border-slate-700 hover:bg-slate-700 px-5 py-2 rounded-full transition-all">
              {t.submit}
            </button>
          </nav>

          <div className="lg:hidden flex items-center gap-4">
             <button className="text-amber-500 w-10 h-10 bg-slate-800 rounded-lg" onClick={toggleDarkMode}>
               <i className={`fa-solid ${isDarkMode ? 'fa-sun' : 'fa-moon'}`}></i>
             </button>
             <button className="text-xl text-amber-500" onClick={() => setIsAiHubOpen(true)}>
                <i className="fa-solid fa-wand-sparkles"></i>
             </button>
          </div>
        </div>
      </header>

      <section className="relative h-[400px] bg-slate-900 flex items-center justify-center overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=1600&h=600" 
          className="absolute inset-0 w-full h-full object-cover opacity-40"
          alt="Banner"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/40 via-transparent to-slate-50 dark:to-slate-950"></div>
        <div className="relative z-10 text-center px-4 max-w-4xl">
          <div className="inline-block px-4 py-1.5 bg-amber-600/20 text-amber-500 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-6 border border-amber-600/30">
            Professional Ranking Standard
          </div>
          <h2 className="text-5xl md:text-7xl font-black text-white mb-6 drop-shadow-2xl leading-tight">
            {t.heroTitle}
          </h2>
          <p className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed italic">
            {t.heroDesc}
          </p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <aside className="w-full lg:w-80 sticky lg:top-24">
            <FilterBar filters={filters} onFilterChange={setFilters} />
          </aside>

          <div className="flex-1 space-y-6 w-full">
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-5 rounded-2xl shadow-xl border border-white/50 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 transition-colors">
              <div className="flex items-center gap-4">
                 <div className="flex -space-x-3">
                   {products.slice(0, 3).map((p, i) => (
                     <img key={i} src={p.imageUrl} className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-800 object-cover" alt="" />
                   ))}
                 </div>
                 <span className="text-slate-500 dark:text-slate-400 font-bold text-sm italic">
                  {t.showing} <span className="text-slate-900 dark:text-white font-black">{products.length}</span> {t.results}
                 </span>
              </div>
              <div className="flex items-center space-x-4 text-[10px] font-black uppercase tracking-widest">
                <button className="text-amber-600 flex items-center gap-2 hover:scale-105 transition-transform">
                   <i className="fa-solid fa-location-dot"></i> {t.nearMe}
                </button>
                <div className="h-4 w-px bg-slate-200 dark:bg-slate-800"></div>
                <span className="text-slate-400">{t.sort}:</span>
                <select className="bg-transparent text-slate-900 dark:text-white focus:outline-none cursor-pointer font-black">
                  <option className="bg-white dark:bg-slate-900">{t.highestScore}</option>
                  <option className="bg-white dark:bg-slate-900">Producer (A-Z)</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="h-96 flex flex-col items-center justify-center space-y-4">
                <div className="w-12 h-12 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-xs font-black uppercase tracking-widest text-slate-400">Querying Official Database...</p>
              </div>
            ) : (
              <RankingTable products={products} producers={PRODUCERS} language={filters.language} />
            )}
          </div>
        </div>
      </main>

      <AiHub isOpen={isAiHubOpen} onClose={() => setIsAiHubOpen(false)} language={filters.language} />
      <ChatBot language={filters.language} />

      <footer className="mt-24 py-16 bg-slate-900 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-12 text-slate-400">
             <div className="col-span-2">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="bg-amber-600 p-2 rounded-lg">
                    <i className="fa-solid fa-crown text-white text-xl"></i>
                  </div>
                  <h3 className="text-white text-xl font-black uppercase tracking-tighter">{t.title}</h3>
                </div>
                <p className="text-sm leading-relaxed max-w-sm mb-6">
                  The Gemini World Oil Ranking 2025 is the authoritative guide to the world’s most exceptional oils, verified by high-end Gemini AI Intelligence.
                </p>
             </div>
             <div>
                <h4 className="text-white text-xs font-black uppercase tracking-widest mb-6">Explore</h4>
                <ul className="space-y-4 text-xs font-bold uppercase tracking-wider">
                  <li><a href="#" className="hover:text-amber-500 transition-colors">Archive 2024</a></li>
                  <li><a href="#" className="hover:text-amber-500 transition-colors">Producer Search</a></li>
                </ul>
             </div>
             <div>
                <h4 className="text-white text-xs font-black uppercase tracking-widest mb-6">Legal</h4>
                <ul className="space-y-4 text-xs font-bold uppercase tracking-wider">
                  <li><a href="#" className="hover:text-amber-500 transition-colors">Copyright 2025</a></li>
                  <li><a href="#" className="hover:text-amber-500 transition-colors">Privacy Policy</a></li>
                </ul>
             </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;