
import React from 'react';
import { FilterState, OilCategory, AwardType } from '../types';

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ filters, onFilterChange }) => {
  const categories = Object.values(OilCategory);
  const awards = Object.values(AwardType);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    onFilterChange({
      ...filters,
      [name]: name === 'minScore' ? Number(value) : value
    });
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 sticky top-24">
      <h3 className="text-xl font-bold mb-6 text-slate-800 flex items-center">
        <i className="fa-solid fa-filter mr-2 text-amber-600"></i>
        Refine Results
      </h3>

      <div className="space-y-6">
        {/* Search */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Search Oil or Producer</label>
          <div className="relative">
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleChange}
              placeholder="e.g. Picual, Argan..."
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Category</label>
          <select
            name="category"
            value={filters.category}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
          >
            <option value="All">All Categories</option>
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>

        {/* Award */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Award Level</label>
          <select
            name="award"
            value={filters.award}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
          >
            <option value="All">Any Award</option>
            {awards.map(award => <option key={award} value={award}>{award}</option>)}
          </select>
        </div>

        {/* Score Range */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Minimum Score: <span className="text-amber-600">{filters.minScore}</span>
          </label>
          <input
            type="range"
            name="minScore"
            min="0"
            max="100"
            value={filters.minScore}
            onChange={handleChange}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
          />
        </div>

        <button
          onClick={() => onFilterChange({ search: '', category: 'All', award: 'All', minScore: 0 })}
          className="w-full py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors"
        >
          Reset All Filters
        </button>
      </div>
    </div>
  );
};

export default FilterBar;
