import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';

const QuizResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state?.result;

  if (!result) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <p className="text-slate-500">No quiz result found.</p>
        <Link to="/quiz" className="text-brand-600 hover:text-brand-700 font-medium mt-2 inline-block">Go to Quiz Generator</Link>
      </div>
    );
  }

  const { topic, score, total_questions, percentage, correct_answers, incorrect_answers, results } = result;

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Quiz Results</h1>
        <p className="text-slate-500 mt-1">Topic: {topic}</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="text-center">
          <p className="text-sm text-slate-500">Score</p>
          <p className="text-3xl font-bold text-brand-600 mt-1">{percentage}%</p>
        </Card>
        <Card className="text-center">
          <p className="text-sm text-slate-500">Correct</p>
          <p className="text-3xl font-bold text-green-600 mt-1">{correct_answers}</p>
        </Card>
        <Card className="text-center">
          <p className="text-sm text-slate-500">Incorrect</p>
          <p className="text-3xl font-bold text-red-600 mt-1">{incorrect_answers}</p>
        </Card>
        <Card className="text-center">
          <p className="text-sm text-slate-500">Total</p>
          <p className="text-3xl font-bold text-slate-700 mt-1">{total_questions}</p>
        </Card>
      </div>
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Review Answers</h2>
        <div className="space-y-4">
          {results.map((r, i) => (
            <Card key={i} className={r.is_correct ? 'border-green-200' : 'border-red-200'}>
              <div className="flex items-start gap-3">
                <span className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                  r.is_correct ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {r.is_correct ? '✓' : '✗'}
                </span>
                <div className="flex-1">
                  <p className="font-medium text-slate-900">{r.question}</p>
                  <p className="text-sm mt-1">
                    <span className="text-slate-500">Your answer: </span>
                    <span className={r.is_correct ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>{r.user_answer}</span>
                    {!r.is_correct && <span className="text-slate-500"> | Correct: <span className="text-green-600 font-medium">{r.correct_answer}</span></span>}
                  </p>
                  {r.explanation && <p className="text-sm text-slate-600 mt-2 bg-slate-50 rounded-lg p-3">{r.explanation}</p>}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
      <div className="flex gap-3 justify-center">
        <Button variant="primary" onClick={() => navigate('/quiz')}>Try Another Quiz</Button>
        <Button variant="secondary" onClick={() => navigate('/history')}>View History</Button>
      </div>
    </div>
  );
};

export default QuizResult;