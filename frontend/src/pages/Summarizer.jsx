import React, { useState } from 'react';
import { aiAPI } from '../services/ai';
import { getErrorMessage } from '../services/api';
import Button from '../components/Button';
import Card from '../components/Card';
import Loading from '../components/Loading';

const Summarizer = () => {
  const [text, setText] = useState('');
  const [style, setStyle] = useState('standard');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const styles = [
    { value: 'short', label: 'Short', desc: 'Concise 2-3 paragraph summary' },
    { value: 'standard', label: 'Standard', desc: 'Thorough with key points' },
    { value: 'detailed', label: 'Detailed', desc: 'Comprehensive with explanations' },
  ];

  const handleSubmit = async () => {
    if (text.trim().length < 50) {
      setError('Please provide at least 50 characters of notes.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await aiAPI.summarizeNotes({ text, style });
      setResult(res.data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading fullScreen text="StudyMate AI is summarizing your notes..." />;

  if (result) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Your Summary</h1>
          <p className="text-slate-500 text-sm mt-1">Style: {style}</p>
        </div>
        <div className="space-y-6">
          <Card>
            <h2 className="text-lg font-semibold text-slate-900 mb-3">Summary</h2>
            <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{result.summary}</p>
          </Card>
          <Card>
            <h2 className="text-lg font-semibold text-slate-900 mb-3">Key Points</h2>
            <ul className="space-y-2">
              {result.key_points.map((point, i) => (
                <li key={i} className="flex items-start gap-3 text-slate-700">
                  <span className="w-6 h-6 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-sm font-medium flex-shrink-0">{i + 1}</span>
                  <span className="pt-0.5">{point}</span>
                </li>
              ))}
            </ul>
          </Card>
          <div className="grid sm:grid-cols-2 gap-6">
            <Card>
              <h2 className="text-lg font-semibold text-slate-900 mb-3">Important Concepts</h2>
              <div className="flex flex-wrap gap-2">
                {result.important_concepts.map((concept, i) => (
                  <span key={i} className="px-3 py-1.5 bg-purple-50 text-purple-700 rounded-full text-sm font-medium">{concept}</span>
                ))}
              </div>
            </Card>
            <Card>
              <h2 className="text-lg font-semibold text-slate-900 mb-3">Exam Focus</h2>
              <div className="flex flex-wrap gap-2">
                {result.exam_focus.map((topic, i) => (
                  <span key={i} className="px-3 py-1.5 bg-amber-50 text-amber-700 rounded-full text-sm font-medium">{topic}</span>
                ))}
              </div>
            </Card>
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => { setResult(null); setText(''); }}>Summarize Again</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">AI Note Summarizer</h1>
        <p className="text-slate-500 mt-1">Paste your lecture notes and get a structured summary.</p>
      </div>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste your lecture notes here..."
              rows={14}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none resize-none transition-colors text-sm"
            />
            <div className="flex items-center justify-between mt-3">
              <span className="text-xs text-slate-400">{text.length} characters</span>
              <Button variant="primary" onClick={handleSubmit} disabled={loading}>Summarize Notes</Button>
            </div>
            {error && <div className="mt-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>}
          </Card>
        </div>
        <div>
          <h2 className="text-sm font-semibold text-slate-700 mb-3">Summary Style</h2>
          <div className="space-y-3">
            {styles.map((s) => (
              <button
                key={s.value}
                onClick={() => setStyle(s.value)}
                className={`w-full text-left p-3 rounded-lg border-2 transition-all duration-200 ${
                  style === s.value ? 'border-brand-500 bg-brand-50' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <p className="font-medium text-slate-900 text-sm">{s.label}</p>
                <p className="text-xs text-slate-500 mt-0.5">{s.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Summarizer;