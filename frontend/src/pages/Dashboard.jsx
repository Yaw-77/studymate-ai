import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { aiAPI } from '../services/ai';
import { LayoutDashboard, MessageSquare, FileText, HelpCircle, Book, TrendingUp, ArrowRight, Clock } from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';
import Loading from '../components/Loading';

const StatCard = ({ title, value, icon: Icon, color }) => (
  <Card>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-slate-500 font-medium">{title}</p>
        <p className="text-3xl font-bold text-slate-900 mt-1">{value}</p>
      </div>
      <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  </Card>
);

const QuickAction = ({ to, icon: Icon, title, description }) => (
  <Link to={to} className="block">
    <Card className="hover:shadow-md hover:border-brand-300 transition-all duration-200 group">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center group-hover:bg-brand-100 transition-colors">
          <Icon className="w-6 h-6 text-brand-600" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-slate-900 group-hover:text-brand-600 transition-colors">{title}</h3>
          <p className="text-sm text-slate-500 mt-0.5">{description}</p>
        </div>
      </div>
    </Card>
  </Link>
);

const ActivityItem = ({ item }) => {
  const icons = { tutor: MessageSquare, summarizer: FileText, quiz: HelpCircle, flashcards: Book };
  const Icon = icons[item.type] || Clock;
  const colors = { tutor: 'bg-blue-50 text-blue-600', summarizer: 'bg-purple-50 text-purple-600', quiz: 'bg-amber-50 text-amber-600', flashcards: 'bg-green-50 text-green-600' };
  return (
    <div className="flex items-center gap-3 py-2.5">
      <div className={`w-9 h-9 rounded-lg ${colors[item.type] || 'bg-slate-50'} flex items-center justify-center flex-shrink-0`}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-900 truncate">{item.title}</p>
        <p className="text-xs text-slate-500">{new Date(item.date).toLocaleDateString()}</p>
      </div>
      {item.score !== null && item.score !== undefined && (
        <span className="text-sm font-semibold text-slate-700 ml-2">{item.score}%</span>
      )}
    </div>
  );
};

const Dashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await aiAPI.getDashboard();
        setDashboardData(res.data);
      } catch (err) {
        console.error('Failed to load dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return <Loading fullScreen text="Loading your dashboard..." />;

  const stats = dashboardData?.stats || { topics_studied: 0, quizzes_completed: 0, average_score: 0, study_streak: 0 };
  const activity = dashboardData?.recent_activity || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">
          Welcome back, {user?.name?.split(' ')[0] || 'Student'}!
        </h1>
        <p className="text-slate-500 mt-1">Here is your study overview for today.</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Topics Studied" value={stats.topics_studied} icon={TrendingUp} color="bg-brand-500" />
        <StatCard title="Quizzes Completed" value={stats.quizzes_completed} icon={HelpCircle} color="bg-green-500" />
        <StatCard title="Average Score" value={`${stats.average_score}%`} icon={TrendingUp} color="bg-amber-500" />
        <StatCard title="Study Streak" value={`${stats.study_streak} days`} icon={Clock} color="bg-purple-500" />
      </div>
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <QuickAction to="/tutor" icon={MessageSquare} title="Ask AI Tutor" description="Get help with difficult concepts" />
            <QuickAction to="/summarizer" icon={FileText} title="Summarize Notes" description="Condense your lecture notes" />
            <QuickAction to="/quiz" icon={HelpCircle} title="Generate Quiz" description="Test your knowledge" />
            <QuickAction to="/flashcards" icon={Book} title="Create Flashcards" description="Build study flashcards" />
          </div>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Recent Activity</h2>
          <Card>
            <div className="divide-y divide-slate-100">
              {activity.length > 0 ? (
                activity.slice(0, 5).map((item) => <ActivityItem key={item.id} item={item} />)
              ) : (
                <p className="text-sm text-slate-400 py-4 text-center">No recent activity</p>
              )}
            </div>
          </Card>
          {activity.length > 5 && (
            <Link to="/history" className="flex items-center justify-center gap-1 mt-3 text-sm text-brand-600 hover:text-brand-700 font-medium">
              View all activity
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;