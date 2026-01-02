
import React, { useState } from 'react';
import { OilProduct, Producer, AwardType } from '../types';
import { getOilAnalysisInsights } from '../services/geminiService';

interface RankingTableProps {
  products: OilProduct[];
  producers: Producer[];
}

const RankingTable: React.FC<RankingTableProps> = ({ products, producers }) => {
  const [selectedProduct, setSelectedProduct] = useState<OilProduct | null>(null);
  const [aiInsight, setAiInsight] = useState<string>('');
  const [loadingAi, setLoadingAi] = useState(false);

  const getProducer = (id: string) => producers.find(p => p.id === id);

  const handleShowDetails = async (product: OilProduct) => {
    setSelectedProduct(product);
    setAiInsight('');
    setLoadingAi(true);
    const producer = getProducer(product.producerId);
    const insight = await getOilAnalysisInsights(product, producer?.name || 'Unknown');
    setAiInsight(insight);
    setLoadingAi(false);
  };

  const getAwardIcon = (awards: AwardType[]) => {
    if (awards.includes(AwardType.BEST_IN_CLASS)) return 'fa-solid fa-trophy text-amber-500';
    if (awards.includes(AwardType.GOLD)) return 'fa-solid fa-award text-yellow-500';
    if (awards.includes(AwardType.SILVER)) return 'fa-solid fa-award text-slate-400';
    return 'fa-solid fa-award text-amber-700';
  };

  return (
    <div className="overflow-hidden bg-white rounded-xl shadow-sm border border-slate-200">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-900 text-white">
              <th className="px-6 py-4 font-semibold text-sm uppercase tracking-wider">Oil / Brand</th>
              <th className="px-6 py-4 font-semibold text-sm uppercase tracking-wider">Origin</th>
              <th className="px-6 py-4 font-semibold text-sm uppercase tracking-wider">Category</th>
              <th className="px-6 py-4 font-semibold text-sm uppercase tracking-wider">Score</th>
              <th className="px-6 py-4 font-semibold text-sm uppercase tracking-wider">Awards</th>
              <th className="px-6 py-4 font-semibold text-sm uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {products.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-slate-500 italic">
                  No oils match your criteria. Try adjusting your filters.
                </td>
              </tr>
            ) : (
              products.map((oil) => {
                const producer = getProducer(oil.producerId);
                return (
                  <tr key={oil.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <img src={oil.imageUrl} alt={oil.name} className="w-10 h-10 rounded-full object-cover border border-slate-200" />
                        <div>
                          <p className="font-bold text-slate-800">{oil.name}</p>
                          <p className="text-sm text-slate-500">{producer?.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium">{producer?.country}</p>
                      <p className="text-xs text-slate-400">{producer?.region}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-md">
                        {oil.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <span className={`text-lg font-black ${oil.score >= 90 ? 'text-green-600' : 'text-amber-600'}`}>
                          {oil.score}
                        </span>
                        <div className="w-16 h-1 bg-slate-100 rounded-full overflow-hidden">
                          <div className={`h-full ${oil.score >= 90 ? 'bg-green-500' : 'bg-amber-500'}`} style={{ width: `${oil.score}%` }}></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {oil.awards.map((award, i) => (
                          <i key={i} className={`${getAwardIcon([award])} text-xl`} title={award}></i>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleShowDetails(oil)}
                        className="text-amber-600 hover:text-amber-800 font-semibold text-sm flex items-center gap-1 transition-colors"
                      >
                        Details <i className="fa-solid fa-chevron-right text-[10px]"></i>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="relative h-48 bg-slate-900">
              <img src={selectedProduct.imageUrl} className="w-full h-full object-cover opacity-50" alt="Detail" />
              <button 
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white rounded-full w-8 h-8 flex items-center justify-center transition-colors"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
              <div className="absolute bottom-0 left-0 p-6">
                <h2 className="text-3xl font-bold text-white mb-1">{selectedProduct.name}</h2>
                <p className="text-amber-400 font-semibold">{getProducer(selectedProduct.producerId)?.name}</p>
              </div>
            </div>
            
            <div className="p-8 grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Chemical Analysis</h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                    <span className="text-slate-600">Acidity</span>
                    <span className="font-bold text-slate-800">{selectedProduct.analysis.acidity}%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                    <span className="text-slate-600">Peroxide Value</span>
                    <span className="font-bold text-slate-800">{selectedProduct.analysis.peroxideValue} <span className="text-[10px] font-normal uppercase">meq O2/kg</span></span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                    <span className="text-slate-600">Polyphenols</span>
                    <span className="font-bold text-slate-800">{selectedProduct.analysis.polyphenols} <span className="text-[10px] font-normal uppercase">mg/kg</span></span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-bold text-amber-600 uppercase tracking-widest mb-4 flex items-center">
                  <i className="fa-solid fa-wand-sparkles mr-2"></i> AI Quality Insights
                </h4>
                <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 min-h-[120px] flex items-center">
                  {loadingAi ? (
                    <div className="flex items-center space-x-3 text-amber-700">
                      <div className="w-5 h-5 border-2 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-sm font-medium">Consulting Gemini expert...</span>
                    </div>
                  ) : (
                    <p className="text-slate-700 text-sm italic leading-relaxed">
                      "{aiInsight}"
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="px-8 pb-8 flex justify-end">
              <button 
                onClick={() => setSelectedProduct(null)}
                className="px-6 py-2 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 transition-colors"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RankingTable;
