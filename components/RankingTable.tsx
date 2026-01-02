
import React, { useState } from 'react';
import { OilProduct, Producer, AwardType, Language, Intensity } from '../types';
import { translations } from '../translations';
import { getOilAnalysisInsights, speakText } from '../services/geminiService';

interface RankingTableProps {
  products: OilProduct[];
  producers: Producer[];
  language: Language;
  darkMode?: boolean;
}

const RankingTable: React.FC<RankingTableProps> = ({ products, producers, language, darkMode }) => {
  const [selectedProduct, setSelectedProduct] = useState<OilProduct | null>(null);
  const [aiInsight, setAiInsight] = useState<string>('');
  const [loadingAi, setLoadingAi] = useState(false);
  const t = translations[language];

  const getProducer = (id: string) => producers.find(p => p.id === id);

  const handleShowDetails = async (product: OilProduct) => {
    setSelectedProduct(product);
    setAiInsight('');
    setLoadingAi(true);
    const producer = getProducer(product.producerId);
    const insight = await getOilAnalysisInsights(product, producer?.name || 'Unknown', language);
    setAiInsight(insight);
    setLoadingAi(false);
  };

  const getAwardIcon = (awards: AwardType[]) => {
    if (awards.includes(AwardType.BEST_IN_CLASS)) return 'fa-solid fa-crown text-amber-500';
    if (awards.includes(AwardType.GOLD)) return 'fa-solid fa-award text-yellow-500';
    if (awards.includes(AwardType.SILVER)) return 'fa-solid fa-medal text-slate-300';
    return 'fa-solid fa-medal text-amber-700';
  };

  const getIntensityColor = (intensity: Intensity) => {
    switch(intensity) {
      case 'Robust': return 'bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-400 border-red-200 dark:border-red-900/50';
      case 'Medium': return 'bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-900/50';
      case 'Delicate': return 'bg-green-100 dark:bg-green-950/40 text-green-700 dark:text-green-400 border-green-200 dark:border-green-900/50';
      default: return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300';
    }
  };

  return (
    <div className="overflow-hidden bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-900 dark:bg-slate-950 text-white">
              <th className="px-6 py-5 font-black text-[10px] uppercase tracking-widest">{t.oilBrand}</th>
              <th className="px-6 py-5 font-black text-[10px] uppercase tracking-widest">Intensity</th>
              <th className="px-6 py-5 font-black text-[10px] uppercase tracking-widest hidden md:table-cell">Varietals</th>
              <th className="px-6 py-5 font-black text-[10px] uppercase tracking-widest text-center">Score</th>
              <th className="px-6 py-5 font-black text-[10px] uppercase tracking-widest">Awards</th>
              <th className="px-6 py-5 font-black text-[10px] uppercase tracking-widest">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {products.map((oil) => {
              const producer = getProducer(oil.producerId);
              return (
                <tr key={oil.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-4">
                      <img src={oil.imageUrl} className="w-14 h-14 rounded-xl object-cover border border-slate-100 dark:border-slate-800 shadow-sm" alt="" />
                      <div>
                        <p className="font-black text-slate-900 dark:text-white group-hover:text-amber-700 dark:group-hover:text-amber-500 transition-colors">{oil.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-bold">{producer?.name}, <span className="uppercase tracking-tighter">{producer?.country}</span></p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 border text-[9px] font-black uppercase rounded-full ${getIntensityColor(oil.intensity)}`}>
                      {oil.intensity}
                    </span>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-1 italic font-medium">{oil.varietals.join(', ')}</p>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-2xl font-black text-slate-900 dark:text-white">{oil.score}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-1">
                      {oil.awards.map((award, i) => (
                        <i key={i} className={`${getAwardIcon([award])} text-xl drop-shadow-sm`} title={award}></i>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button onClick={() => handleShowDetails(oil)} className="bg-slate-900 dark:bg-amber-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-md">
                      {t.details}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-4xl w-full flex flex-col md:flex-row overflow-hidden max-h-[90vh] border border-white/20 dark:border-slate-800">
            <div className="md:w-1/3 bg-slate-100 dark:bg-slate-950 relative h-64 md:h-auto">
              <img src={selectedProduct.imageUrl} className="w-full h-full object-cover" alt="" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-transparent"></div>
              <div className="absolute bottom-8 left-8 right-8 text-white">
                <span className={`inline-block px-3 py-1 rounded-full text-[9px] font-black uppercase mb-3 ${getIntensityColor(selectedProduct.intensity)}`}>{selectedProduct.intensity}</span>
                <h2 className="text-4xl font-black mb-2 leading-tight drop-shadow-lg">{selectedProduct.name}</h2>
                <p className="text-amber-400 font-black uppercase text-xs tracking-widest">{getProducer(selectedProduct.producerId)?.name}</p>
              </div>
            </div>

            <div className="flex-1 p-8 overflow-y-auto bg-white dark:bg-slate-900">
              <div className="flex justify-between items-start mb-10">
                <div className="flex gap-8">
                   <div className="text-center">
                     <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase mb-1 tracking-widest">Score</p>
                     <p className="text-5xl font-black text-slate-900 dark:text-white">{selectedProduct.score}</p>
                   </div>
                   <div className="h-14 w-px bg-slate-100 dark:bg-slate-800 mt-2"></div>
                   <div>
                     <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase mb-1 tracking-widest">Varietals</p>
                     <p className="text-sm font-black text-slate-700 dark:text-slate-300 italic">{selectedProduct.varietals.join(', ')}</p>
                   </div>
                </div>
                <button onClick={() => setSelectedProduct(null)} className="w-10 h-10 flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 rounded-full transition-colors">
                  <i className="fa-solid fa-xmark text-xl"></i>
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-10 mb-10">
                <div className="space-y-6">
                  <h4 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b dark:border-slate-800 pb-2">Organoleptic Profile</h4>
                  {['fruity', 'bitter', 'pungent'].map((attr) => (
                    <div key={attr} className="space-y-2">
                      <div className="flex justify-between text-[10px] font-black uppercase text-slate-500 dark:text-slate-400">
                        <span>{attr}</span>
                        <span className="text-amber-600 dark:text-amber-500">{selectedProduct.analysis[attr as keyof typeof selectedProduct.analysis]}/10</span>
                      </div>
                      <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
                        <div 
                          className={`h-full transition-all duration-1000 ${attr === 'fruity' ? 'bg-green-500' : attr === 'bitter' ? 'bg-amber-600' : 'bg-red-500'}`}
                          style={{ width: `${(selectedProduct.analysis[attr as keyof typeof selectedProduct.analysis] as number) * 10}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-6">
                  <h4 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b dark:border-slate-800 pb-2">{t.verdict}</h4>
                  <div className="bg-slate-50 dark:bg-slate-950/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 relative shadow-sm">
                    {loadingAi ? (
                      <div className="flex flex-col items-center space-y-4 animate-pulse py-4">
                         <div className="w-10 h-10 bg-amber-600/20 rounded-full flex items-center justify-center">
                            <i className="fa-solid fa-wand-sparkles text-amber-600 text-xl"></i>
                         </div>
                         <span className="text-[10px] font-black uppercase tracking-widest text-amber-600">Gemini Sommelier Analyzing...</span>
                      </div>
                    ) : (
                      <>
                        <p className="text-slate-700 dark:text-slate-300 text-sm italic font-medium leading-relaxed mb-6">"{aiInsight}"</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedProduct.tastingNotes.map(note => (
                            <span key={note} className="px-3 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[9px] font-black uppercase rounded-lg text-slate-600 dark:text-slate-400 shadow-sm">#{note}</span>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 border-t border-slate-100 dark:border-slate-800">
                <button 
                  onClick={() => speakText(`${selectedProduct.name}. Score: ${selectedProduct.score}. ${aiInsight}`, language)}
                  className="flex items-center gap-3 text-[10px] font-black uppercase text-amber-600 dark:text-amber-500 hover:scale-105 transition-transform px-6 py-3 bg-amber-50 dark:bg-amber-900/10 rounded-xl"
                >
                  <i className="fa-solid fa-volume-high text-lg"></i>
                  {t.listen}
                </button>
                <button onClick={() => setSelectedProduct(null)} className="w-full sm:w-auto px-12 py-4 bg-slate-900 dark:bg-white dark:text-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-slate-800 dark:hover:bg-slate-100 transition-all shadow-xl">
                  {t.close}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RankingTable;
