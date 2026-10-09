import React, { useState, useEffect } from 'react';
import { aiAPI } from '../services/ai';
import { MessageSquare, FileText, HelpCircle, Book, Clock } from 'lucide-react';
import Card from '../components/Card';
import Loading from '../components/Loading';

const History = () => {
  const [history, setHistory] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await aiAPI.getHistory(filter);
        setHistory(res.data);
      } catch (err) {
        console.error('Failed to load history:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [filter]);

  if (loading) return <Loading fullScreen text="Loading your study history..." />;

  const filters = [
    { value: 'all', label: 'All' },
    { value: 'tutor', label: 'Tutor' },
    { value: 'summarizer', label: 'Summaries' },
    { value: 'quiz', label: 'Quizzes' },
    { value: 'flashcards', label: 'Flashcards' },
  ];

  const icons = { tutor: MessageSquare, summarizer: FileText, quiz: HelpCircle, flashcards: Book };
  const colors = { tutor: 'bg-blue-50 text-blue-600', summarizer: 'bg-purple-50 text-purple-600', quiz: 'bg-amber-50 text-amber-600', flashcards: 'bg-green-50 text-green-600' };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Study History</h1>
        <p className="text-slate-500 mt-1">Review your past study activities.</p>
      </div>
      <div className="flex flex-wrap gap-2 mb-6">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              filter === f.value ? 'bg-brand-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}>
            {f.label}
          </button>
        ))}
      </div>
      {history.length === 0 ? (
        <Card className="text-center py-12">
          <Clock className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500">No study activity found. Start studying to see your history here!</p>
        </Card>
      ) : (
        <Card>
          <div className="divide-y divide-slate-100">
            {history.map((item) => {
              const Icon = icons[item.type] || Clock;
              const color = colors[item.type] || 'bg-slate-50 text-slate-600';
              return (
                <div key={item.id} className="flex items-center gap-4 py-3.5">
                  <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center flex-shrink-0`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-900 truncate">{item.title}</p>
                    <p className="text-xs text-slate-500">{new Date(item.date).toLocaleDateString()} {item.detail && `- ${item.detail}`}</p>
                  </div>
                  {item.score !== null && item.score !== undefined && (
                    <span className="text-sm font-semibold text-slate-700 ml-2">{item.score}%</span>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
};

export default History;