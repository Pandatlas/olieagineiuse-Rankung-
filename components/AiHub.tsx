
import React, { useState } from 'react';
import { Language } from '../types';
import { generateOilImage, editOilImage, animateOilImage } from '../services/geminiService';

const AiHub: React.FC<{ isOpen: boolean; onClose: () => void; language: Language }> = ({ isOpen, onClose, language }) => {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [size, setSize] = useState('1K');
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [resultVideo, setResultVideo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'generate' | 'edit' | 'video'>('generate');

  const handleAction = async () => {
    setLoading(true);
    try {
      if (mode === 'generate') {
        const res = await generateOilImage(prompt, aspectRatio, size);
        setResultImage(res);
      } else if (mode === 'edit' && resultImage) {
        const res = await editOilImage(resultImage, prompt);
        setResultImage(res);
      } else if (mode === 'video' && resultImage) {
        const res = await animateOilImage(resultImage, prompt, aspectRatio as any);
        setResultVideo(res);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-full md:w-[450px] bg-white dark:bg-slate-900 shadow-2xl z-[100] border-l border-slate-200 dark:border-slate-800 overflow-y-auto animate-in slide-in-from-right transition-colors duration-300">
      <div className="p-6 bg-slate-900 text-white flex justify-between items-center sticky top-0 z-10">
        <h2 className="text-xl font-bold flex items-center">
          <i className="fa-solid fa-wand-magic-sparkles mr-3 text-amber-500"></i>
          AI Creative Studio
        </h2>
        <button onClick={onClose} className="hover:text-amber-500 transition-colors text-2xl">&times;</button>
      </div>

      <div className="p-6 space-y-8">
        <div className="flex gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
          {(['generate', 'edit', 'video'] as const).map(m => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-all ${mode === m ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}
            >
              {m}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Prompt Instructions</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={mode === 'generate' ? "e.g. A golden bottle of olive oil in a sunny Tuscan field, hyper-realistic..." : "e.g. Add a warm sunset filter to the image..."}
            className="w-full h-32 p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none resize-none text-sm text-slate-900 dark:text-white"
          />
        </div>

        {mode === 'generate' && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">Aspect Ratio</label>
              <select value={aspectRatio} onChange={e => setAspectRatio(e.target.value)} className="w-full p-2 bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white">
                {['1:1', '16:9', '9:16', '4:3', '3:4', '2:3', '3:2'].map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">Resolution</label>
              <select value={size} onChange={e => setSize(e.target.value)} className="w-full p-2 bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white">
                {['1K', '2K', '4K'].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
        )}

        <button
          onClick={handleAction}
          disabled={loading || (!prompt && mode === 'generate')}
          className="w-full py-4 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-3"
        >
          {loading ? <i className="fa-solid fa-spinner animate-spin"></i> : <i className="fa-solid fa-sparkles"></i>}
          {loading ? 'Processing Magic...' : `Run AI ${mode.charAt(0).toUpperCase() + mode.slice(1)}`}
        </button>

        <div className="space-y-4">
          <h4 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Output</h4>
          <div className="aspect-square w-full bg-slate-100 dark:bg-slate-800 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 flex items-center justify-center overflow-hidden relative">
            {resultVideo ? (
              <video src={resultVideo} controls className="w-full h-full object-cover" />
            ) : resultImage ? (
              <img src={resultImage} className="w-full h-full object-contain" alt="AI Result" />
            ) : (
              <div className="text-center text-slate-400 dark:text-slate-600 p-8">
                <i className="fa-solid fa-image text-4xl mb-3 block"></i>
                <p className="text-xs">Your creation will appear here</p>
              </div>
            )}
          </div>
          {resultImage && mode !== 'edit' && (
            <p className="text-[10px] text-slate-400 italic text-center">Tip: Switch to "Edit" or "Video" mode to modify this image further.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AiHub;