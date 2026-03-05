'use client';

import React, { useState, useEffect } from 'react';
import { 
  Mic, 
  Volume2, 
  Download, 
  ArrowRightLeft, 
  Copy, 
  Loader2,
  Trash2
} from 'lucide-react';

// Supported languages dictionary
const LANGUAGES = {
  'auto': 'Auto Detect',
  'en': 'English',
  'fr': 'French',
  'de': 'German',
  'es': 'Spanish',
  'ar': 'Arabic',
  'tr': 'Turkish',
};

export default function TranslatorApp() {
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLang, setSourceLang] = useState('auto');
  const [targetLang, setTargetLang] = useState('fr');
  
  const [isTranslating, setIsTranslating] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // Translate function using MyMemory free API
  const handleTranslate = async () => {
    if (!sourceText.trim()) {
      setTranslatedText('');
      return;
    }

    setIsTranslating(true);
    try {
      // MyMemory API format: source|target (e.g., en|fr)
      const pair = `${sourceLang === 'auto' ? 'Autodetect' : sourceLang}|${targetLang}`;
      const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(sourceText)}&langpair=${pair}`);
      const data = await response.json();
      
      setTranslatedText(data.responseData.translatedText);
    } catch (error) {
      console.error('Translation error:', error);
      setTranslatedText('Error in translation. Please try again.');
    } finally {
      setIsTranslating(false);
    }
  };

  // Debounce for automatic translation when typing stops
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (sourceText) handleTranslate();
    }, 1000);

    return () => clearTimeout(delayDebounceFn);
  }, [sourceText, sourceLang, targetLang]);

  // Speech to Text (Voice Input for Source)
  const handleVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Your browser does not support voice input.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = sourceLang === 'auto' ? 'en-US' : sourceLang; 
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setSourceText((prev) => prev + (prev ? ' ' : '') + transcript);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognition.start();
  };

  // Text to Speech (Listen to Translation)
  const handleListen = () => {
    if (!translatedText) return;
    
    const utterance = new SpeechSynthesisUtterance(translatedText);
    utterance.lang = targetLang; 
    window.speechSynthesis.speak(utterance);
  };

  // Direct Audio Download using Next.js API Route (Bypasses CORS)
  const handleDownloadAudio = async () => {
    if (!translatedText) return;
    
    setIsDownloading(true);
    try {
      // Call our own Next.js API route
      const response = await fetch(`/api/tts?text=${encodeURIComponent(translatedText)}&lang=${targetLang}`);
      
      if (!response.ok) throw new Error('Network response was not ok');
      
      // Convert response to blob
      const blob = await response.blob();
      
      // Create an object URL and trigger a hidden download link
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `translation_${targetLang}.mp3`; // File name
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download audio.');
    } finally {
      setIsDownloading(false);
    }
  };

  // Swap Languages
  const handleSwapLanguages = () => {
    if (sourceLang !== 'auto') {
      setSourceLang(targetLang);
      setTargetLang(sourceLang);
      setSourceText(translatedText);
      setTranslatedText(sourceText);
    }
  };

  // Copy to clipboard
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-4 md:p-8 font-sans">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold text-indigo-600 mb-2">Translatify</h1>
          <p className="text-slate-500">Fast, smart, and accessible language translation</p>
        </header>

        {/* Translation Container */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
          
          {/* Language Selectors & Controls */}
          <div className="flex flex-col md:flex-row items-center justify-between p-4 bg-slate-100/50 border-b border-slate-100 gap-4">
            
            <select 
              className="w-full md:w-64 bg-white border border-slate-200 text-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 p-2.5 outline-none font-medium cursor-pointer"
              value={sourceLang}
              onChange={(e) => setSourceLang(e.target.value)}
            >
              {Object.entries(LANGUAGES).map(([code, name]) => (
                <option key={code} value={code}>{name}</option>
              ))}
            </select>

            <button 
              onClick={handleSwapLanguages}
              disabled={sourceLang === 'auto'}
              className="p-2 rounded-full hover:bg-slate-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-indigo-600"
              title="Swap languages"
            >
              <ArrowRightLeft size={20} />
            </button>

            <select 
              className="w-full md:w-64 bg-white border border-slate-200 text-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 p-2.5 outline-none font-medium cursor-pointer"
              value={targetLang}
              onChange={(e) => setTargetLang(e.target.value)}
            >
              {Object.entries(LANGUAGES).filter(([code]) => code !== 'auto').map(([code, name]) => (
                <option key={code} value={code}>{name}</option>
              ))}
            </select>

          </div>

          {/* Text Areas */}
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100">
            
            {/* Source Section */}
            <div className="p-6 flex flex-col h-full">
              <textarea
                className="w-full h-48 md:h-64 resize-none outline-none text-lg text-slate-700 placeholder-slate-400 bg-transparent"
                placeholder="Type text or use the microphone to speak..."
                value={sourceText}
                onChange={(e) => setSourceText(e.target.value)}
                dir="auto"
              ></textarea>
              
              <div className="flex items-center justify-between mt-4 text-slate-400">
                <div className="flex gap-2">
                  <button 
                    onClick={handleVoiceInput}
                    className={`p-2 rounded-full transition-all ${isListening ? 'bg-red-100 text-red-500 animate-pulse' : 'hover:bg-slate-100 hover:text-indigo-600'}`}
                    title="Voice Input (Speech to Text)"
                  >
                    <Mic size={20} />
                  </button>
                  <button 
                    onClick={() => handleCopy(sourceText)}
                    className="p-2 rounded-full hover:bg-slate-100 hover:text-indigo-600 transition-all"
                    title="Copy text"
                  >
                    <Copy size={20} />
                  </button>
                </div>
                {sourceText && (
                  <button 
                    onClick={() => {
                      setSourceText('');
                      setTranslatedText('');
                    }}
                    className="p-2 text-sm hover:text-red-500 transition-all flex items-center gap-1"
                  >
                    <Trash2 size={16} /> Clear
                  </button>
                )}
              </div>
            </div>

            {/* Target Section */}
            <div className="p-6 bg-slate-50/50 flex flex-col h-full relative">
              {isTranslating && (
                <div className="absolute inset-0 bg-slate-50/50 flex items-center justify-center z-10 backdrop-blur-[1px]">
                  <Loader2 className="animate-spin text-indigo-500" size={32} />
                </div>
              )}
              
              <textarea
                className="w-full h-48 md:h-64 resize-none outline-none text-lg text-slate-700 bg-transparent"
                placeholder="Translation will appear here..."
                value={translatedText}
                readOnly
                dir="auto"
              ></textarea>
              
              <div className="flex items-center justify-between mt-4 text-slate-400">
                <div className="flex gap-2">
                  <button 
                    onClick={handleListen}
                    disabled={!translatedText}
                    className="p-2 rounded-full hover:bg-slate-200 hover:text-indigo-600 transition-all disabled:opacity-50"
                    title="Listen to translation"
                  >
                    <Volume2 size={20} />
                  </button>
                  
                  {/* Updated Download Button with loading state */}
                  <button 
                    onClick={handleDownloadAudio}
                    disabled={!translatedText || isDownloading}
                    className="p-2 rounded-full hover:bg-slate-200 hover:text-indigo-600 transition-all disabled:opacity-50"
                    title="Download Audio (.mp3)"
                  >
                    {isDownloading ? (
                      <Loader2 size={20} className="animate-spin" />
                    ) : (
                      <Download size={20} />
                    )}
                  </button>
                  
                  <button 
                    onClick={() => handleCopy(translatedText)}
                    disabled={!translatedText}
                    className="p-2 rounded-full hover:bg-slate-200 hover:text-indigo-600 transition-all disabled:opacity-50"
                    title="Copy translation"
                  >
                    <Copy size={20} />
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
        
      </div>
    </div>
  );
}