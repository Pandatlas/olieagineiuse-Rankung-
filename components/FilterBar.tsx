
import React, { useState } from 'react';
import { FilterState, OilCategory, AwardType, Intensity } from '../types';
import { translations } from '../translations';
import { PRODUCERS } from '../data';

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  darkMode?: boolean;
}

const FilterBar: React.FC<FilterBarProps> = ({ filters, onFilterChange, darkMode }) => {
  const categories = Object.values(OilCategory);
  const awards = Object.values(AwardType);
  const intensities: Intensity[] = ['Delicate', 'Medium', 'Robust'];
  
  const countries = Array.from(new Set(PRODUCERS.map(p => p.country))).sort();

  const [isListening, setIsListening] = useState(false);
  const t = translations[filters.language];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    onFilterChange({
      ...filters,
      [name]: name === 'minScore' ? Number(value) : value
    });
  };

  const startVoiceSearch = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = filters.language === 'en' ? 'en-US' : filters.language === 'fr' ? 'fr-FR' : filters.language === 'es' ? 'es-ES' : filters.language === 'it' ? 'it-IT' : 'ar-SA';
    
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      onFilterChange({ ...filters, search: event.results[0][0].transcript });
    };
    recognition.start();
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 transition-colors duration-300">
      <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-6 text-slate-400 dark:text-slate-500 border-b border-slate-50 dark:border-slate-800 pb-4">
        Official Filters
      </h3>

      <div className="space-y-5">
        {/* Search */}
        <div>
          <label className="block text-[10px] font-black uppercase text-slate-500 mb-2 tracking-widest">{t.search}</label>
          <div className="relative">
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleChange}
              placeholder="Brand, Varietal..."
              className="w-full pl-4 pr-10 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-sm font-medium transition-all text-slate-900 dark:text-white"
            />
            <button
              onClick={startVoiceSearch}
              className={`absolute right-3 top-1/2 -translate-y-1/2 ${isListening ? 'text-amber-600 animate-pulse' : 'text-slate-300 hover:text-amber-600'}`}
            >
              <i className={`fa-solid ${isListening ? 'fa-microphone-lines' : 'fa-microphone'}`}></i>
            </button>
          </div>
        </div>

        {/* Category Filter */}
        <div>
          <label className="block text-[10px] font-black uppercase text-slate-500 mb-2 tracking-widest">{t.category}</label>
          <select
            name="category"
            value={filters.category}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-sm font-bold appearance-none cursor-pointer text-slate-900 dark:text-white"
          >
            <option value="All">{t.allCategories}</option>
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>

        {/* Country Filter */}
        <div>
          <label className="block text-[10px] font-black uppercase text-slate-500 mb-2 tracking-widest">Country</label>
          <select
            name="country"
            value={filters.country}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-sm font-bold appearance-none cursor-pointer text-slate-900 dark:text-white"
          >
            <option value="All">All Countries</option>
            {countries.map(country => <option key={country} value={country}>{country}</option>)}
          </select>
        </div>

        {/* Intensity Filter */}
        <div>
          <label className="block text-[10px] font-black uppercase text-slate-500 mb-2 tracking-widest">Intensity</label>
          <div className="grid grid-cols-2 gap-2">
            <button 
              onClick={() => onFilterChange({...filters, intensity: 'All'})}
              className={`px-4 py-2 text-[10px] font-black uppercase rounded-lg border transition-all ${filters.intensity === 'All' ? 'bg-slate-900 dark:bg-amber-600 text-white border-slate-900 dark:border-amber-600 shadow-lg' : 'bg-slate-50 dark:bg-slate-800 text-slate-500 border-slate-100 dark:border-slate-800'}`}
            >
              All
            </button>
            {intensities.map(lvl => (
              <button
                key={lvl}
                onClick={() => onFilterChange({...filters, intensity: lvl})}
                className={`px-4 py-2 text-[10px] font-black uppercase rounded-lg border transition-all ${filters.intensity === lvl ? 'bg-amber-600 text-white border-amber-600 shadow-lg' : 'bg-slate-50 dark:bg-slate-800 text-slate-500 border-slate-100 dark:border-slate-800'}`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        {/* Award Level Filter */}
        <div>
          <label className="block text-[10px] font-black uppercase text-slate-500 mb-2 tracking-widest">{t.awardLevel}</label>
          <select
            name="award"
            value={filters.award}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-sm font-bold appearance-none cursor-pointer text-slate-900 dark:text-white"
          >
            <option value="All">{t.anyAward}</option>
            {awards.map(award => <option key={award} value={award}>{award}</option>)}
          </select>
        </div>

        {/* Score Filter */}
        <div>
          <label className="block text-[10px] font-black uppercase text-slate-500 mb-2 tracking-widest">
            {t.minScore}: <span className="text-amber-600 text-lg">{filters.minScore}</span>
          </label>
          <input
            type="range"
            name="minScore"
            min="0"
            max="100"
            value={filters.minScore}
            onChange={handleChange}
            className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-600"
          />
        </div>

        <button
          onClick={() => onFilterChange({ ...filters, search: '', category: 'All', country: 'All', award: 'All', intensity: 'All', minScore: 0 })}
          className="w-full py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 dark:hover:text-white border-t border-slate-50 dark:border-slate-800 transition-all"
        >
          {t.reset}
        </button>
      </div>
    </div>
  );
};

export default FilterBar;
