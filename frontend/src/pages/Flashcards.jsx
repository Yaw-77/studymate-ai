import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { aiAPI } from '../services/ai';
import { getErrorMessage } from '../services/api';
import Button from '../components/Button';
import Card from '../components/Card';
import Loading from '../components/Loading';

const Flashcard = ({ card, isFlipped, onFlip }) => (
  <div className="perspective h-56 cursor-pointer" onClick={onFlip}>
    <div className={`relative w-full h-full transition-transform duration-500 transform-style-preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
      <div className="absolute inset-0 back-hidden bg-gradient-to-br from-brand-500 to-brand-700 rounded-xl flex items-center justify-center p-6 shadow-lg">
        <p className="text-white text-lg font-medium text-center">{card.question}</p>
      </div>
      <div className="absolute inset-0 back-hidden bg-gradient-to-br from-slate-700 to-slate-900 rounded-xl flex items-center justify-center p-6 shadow-lg rotate-y-180">
        <p className="text-white text-lg text-center">{card.answer}</p>
      </div>
    </div>
    <p className="text-center text-xs text-slate-400 mt-2">Click to flip</p>
  </div>
);

const Flashcards = () => {
  const [topic, setTopic] = useState('');
  const [numCards, setNumCards] = useState(10);
  const [flashcardSet, setFlashcardSet] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!topic.trim()) {
      setError('Please enter a topic.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await aiAPI.generateFlashcards({ topic, num_cards: numCards });
      setFlashcardSet(res.data);
      setCurrentIndex(0);
      setIsFlipped(false);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (flashcardSet && currentIndex < flashcardSet.flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  if (loading) return <Loading fullScreen text="Creating your flashcards..." />;

  if (flashcardSet) {
    const card = flashcardSet.flashcards[currentIndex];
    const progress = ((currentIndex + 1) / flashcardSet.flashcards.length) * 100;

    return (
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Flashcards: {flashcardSet.flashcards[0]?.topic || topic}</h1>
          <p className="text-slate-500 text-sm mt-1">Card {currentIndex + 1} of {flashcardSet.flashcards.length}</p>
        </div>
        <div className="h-2 bg-slate-200 rounded-full mb-8 overflow-hidden">
          <div className="h-full bg-brand-500 transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
        <div className="mb-8">
          <Flashcard card={card} isFlipped={isFlipped} onFlip={() => setIsFlipped(!isFlipped)} />
        </div>
        <div className="flex justify-between">
          <Button variant="secondary" onClick={handlePrev} disabled={currentIndex === 0}>Previous</Button>
          <Button variant="ghost" onClick={() => { setFlashcardSet(null); setTopic(''); }}>Generate New</Button>
          <Button variant="primary" onClick={handleNext} disabled={currentIndex === flashcardSet.flashcards.length - 1}>Next</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">AI Flashcard Generator</h1>
        <p className="text-slate-500 mt-1">Generate study flashcards on any topic.</p>
      </div>
      <Card>
        <div className="space-y-5">
          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Topic</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Database Normalization, French Revolution"
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Number of Cards</label>
            <div className="flex gap-2">
              {[5, 10, 15, 20].map((n) => (
                <button
                  key={n}
                  onClick={() => setNumCards(n)}
                  className={`flex-1 py-2.5 rounded-lg border-2 text-sm font-medium transition-all duration-200 ${
                    numCards === n ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}>
                  {n}
                </button>
              ))}
            </div>
          </div>
          <Button variant="primary" className="w-full" onClick={handleGenerate}>Generate Flashcards</Button>
        </div>
      </Card>
    </div>
  );
};

export default Flashcards;