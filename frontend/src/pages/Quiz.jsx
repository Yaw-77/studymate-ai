import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { aiAPI } from '../services/ai';
import { getErrorMessage } from '../services/api';
import Button from '../components/Button';
import Card from '../components/Card';
import Loading from '../components/Loading';

const Quiz = () => {
  const navigate = useNavigate();
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [numQuestions, setNumQuestions] = useState(5);
  const [quizData, setQuizData] = useState(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!topic.trim()) {
      setError('Please enter a topic for the quiz.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await aiAPI.generateQuiz({ topic, difficulty, num_questions: numQuestions });
      setQuizData(res.data);
      setCurrentQ(0);
      setAnswers({});
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (answer) => {
    setAnswers({ ...answers, [quizData.questions[currentQ].id]: answer });
  };

  const handleSubmit = async () => {
    try {
      const res = await aiAPI.submitQuiz(quizData.quiz_id, { answers });
      navigate(`/quiz/result/${quizData.quiz_id}`, { state: { result: res.data } });
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  if (loading) return <Loading fullScreen text="Generating your quiz..." />;

  if (quizData) {
    const q = quizData.questions[currentQ];
    const progress = ((currentQ + 1) / quizData.questions.length) * 100;
    const options = { A: q.option_a, B: q.option_b, C: q.option_c, D: q.option_d };

    return (
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Quiz: {quizData.topic}</h1>
          <p className="text-slate-500 text-sm mt-1">Question {currentQ + 1} of {quizData.questions.length}</p>
        </div>
        <div className="h-2 bg-slate-200 rounded-full mb-6 overflow-hidden">
          <div className="h-full bg-brand-500 transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
        <Card className="mb-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">{q.question}</h2>
          <div className="space-y-3">
            {['A', 'B', 'C', 'D'].map((opt) => (
              <button
                key={opt}
                onClick={() => handleAnswer(opt)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                  answers[q.id] === opt
                    ? 'border-brand-500 bg-brand-50'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <span className="flex items-center gap-3">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    answers[q.id] === opt ? 'bg-brand-500 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {opt}
                  </span>
                  <span className="text-slate-700">{options[opt]}</span>
                </span>
              </button>
            ))}
          </div>
        </Card>
        <div className="flex justify-between">
          <Button variant="secondary" onClick={() => setCurrentQ(Math.max(0, currentQ - 1))} disabled={currentQ === 0}>Previous</Button>
          {currentQ < quizData.questions.length - 1 ? (
            <Button variant="primary" onClick={() => setCurrentQ(currentQ + 1)}>Next</Button>
          ) : (
            <Button variant="primary" onClick={handleSubmit}>Submit Quiz</Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">AI Quiz Generator</h1>
        <p className="text-slate-500 mt-1">Generate a custom quiz on any topic.</p>
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
              placeholder="e.g. Photosynthesis, Newton's Laws, World War II"
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Difficulty</label>
            <div className="flex gap-2">
              {['easy', 'medium', 'hard'].map((d) => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={`flex-1 py-2.5 rounded-lg border-2 text-sm font-medium capitalize transition-all duration-200 ${
                    difficulty === d ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}>
                  {d}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Number of Questions</label>
            <div className="flex gap-2">
              {[5, 10, 15].map((n) => (
                <button
                  key={n}
                  onClick={() => setNumQuestions(n)}
                  className={`flex-1 py-2.5 rounded-lg border-2 text-sm font-medium transition-all duration-200 ${
                    numQuestions === n ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}>
                  {n}
                </button>
              ))}
            </div>
          </div>
          <Button variant="primary" className="w-full" onClick={handleGenerate}>Generate Quiz</Button>
        </div>
      </Card>
    </div>
  );
};

export default Quiz;