import React from 'react';
import { Link } from 'react-router-dom';
import {
  MessageSquare,
  FileText,
  HelpCircle,
  Book,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Zap,
  Brain,
  TrendingUp,
  Clock,
  UserPlus,
  Send,
  BarChart3,
  CheckCircle2,
} from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

/* ------------------------------------------------------------------ */
/* Static content                                                     */
/* ------------------------------------------------------------------ */

const FEATURES = [
  {
    icon: MessageSquare,
    title: 'AI Tutor',
    description:
      'Ask anything about your coursework and get clear, step-by-step explanations tailored to your level. Your conversations are saved so you can revisit them anytime.',
    color: 'bg-blue-50',
    iconColor: 'text-blue-600',
  },
  {
    icon: FileText,
    title: 'Note Summarizer',
    description:
      'Paste your lecture notes and get concise summaries with key points, important concepts, and exam focus areas pulled out automatically.',
    color: 'bg-purple-50',
    iconColor: 'text-purple-600',
  },
  {
    icon: HelpCircle,
    title: 'Quiz Generator',
    description:
      'Turn any topic into a multiple-choice quiz at your chosen difficulty level. Get instant scoring with detailed explanations for every answer.',
    color: 'bg-amber-50',
    iconColor: 'text-amber-600',
  },
  {
    icon: Book,
    title: 'Flashcards',
    description:
      'Build a flashcard deck from any subject and drill it with a smooth flip animation. Perfect for rapid revision before exams.',
    color: 'bg-green-50',
    iconColor: 'text-green-600',
  },
];

const STEPS = [
  {
    icon: UserPlus,
    title: 'Create your free account',
    description:
      'Sign up with your name, email, university, and program. No credit card required.',
  },
  {
    icon: Send,
    title: 'Ask, summarise, and practise',
    description:
      'Chat with the AI tutor, condense your notes, generate a quiz, or build a flashcard deck in seconds.',
  },
  {
    icon: BarChart3,
    title: 'Track your progress',
    description:
      'Watch your study streak grow, review your quiz scores, and revisit everything you have studied from one dashboard.',
  },
];

const STATS = [
  { icon: Brain, value: '4', label: 'AI study tools', color: 'bg-blue-50 text-blue-600' },
  { icon: TrendingUp, value: '100%', label: 'Free for students', color: 'bg-purple-50 text-purple-600' },
  { icon: Zap, value: 'Instant', label: 'AI responses', color: 'bg-amber-50 text-amber-600' },
  { icon: Clock, value: '24/7', label: 'Always available', color: 'bg-green-50 text-green-600' },
];

const BENEFITS = [
  'Understand difficult concepts without the jargon',
  'Turn dense lecture notes into revision-ready summaries',
  'Test your knowledge before the real exam does',
  'Keep every conversation, quiz, and deck in one place',
];

/* ------------------------------------------------------------------ */
/* Section: Hero                                                       */
/* ------------------------------------------------------------------ */

const Hero = ({ isAuthenticated }) => (
  <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-white">
    {/* Decorative background blobs */}
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-brand-200/30 rounded-full blur-3xl" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl" />
    </div>

    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 lg:pt-40 pb-16 lg:pb-24">
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Copy */}
        <div className="animate-fade-in text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            Powered by Claude AI
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Study Smarter.
            <br />
            <span className="text-brand-600">Understand Better.</span>
          </h1>

          <p className="mt-6 text-lg text-slate-600 leading-relaxed max-w-xl mx-auto lg:mx-0">
            Your AI study companion. Ask questions, summarise your notes, generate
            quizzes, and build flashcards — all in one place, built for university
            students.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
            {isAuthenticated ? (
              <Link to="/dashboard">
                <Button size="xl" className="w-full sm:w-auto">
                  Go to Dashboard
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/register">
                  <Button size="xl" className="w-full sm:w-auto">
                    Get Started Free
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="secondary" size="xl" className="w-full sm:w-auto">
                    I Already Have an Account
                  </Button>
                </Link>
              </>
            )}
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-2 text-sm text-slate-500">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              No credit card
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              Set up in seconds
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-green-500" />
              Secure & private
            </span>
          </div>
        </div>

        {/* Mockup */}
        <div className="animate-fade-in hidden lg:block">
          <div className="relative">
            {/* Chat card */}
            <div className="rounded-2xl bg-white border border-slate-200 shadow-xl shadow-slate-200/60 overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 bg-slate-50 border-b border-slate-200">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <span className="ml-2 text-xs font-medium text-slate-500">
                  StudyMate AI — Tutor
                </span>
              </div>

              <div className="p-4 space-y-3 bg-slate-50/50">
                {/* User message */}
                <div className="flex justify-end">
                  <div className="max-w-[80%] px-3.5 py-2.5 rounded-lg rounded-br-sm bg-brand-600 text-white text-sm">
                    Can you explain how neural networks learn?
                  </div>
                </div>

                {/* AI response */}
                <div className="flex gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div className="max-w-[85%] px-3.5 py-2.5 rounded-lg rounded-bl-sm bg-white border border-slate-200 text-sm text-slate-700 space-y-2">
                    <p>
                      A neural network learns by adjusting the strength of the
                      connections between its neurons.
                    </p>
                    <div className="space-y-1.5">
                      <p className="font-semibold text-slate-900 text-xs">
                        In three steps:
                      </p>
                      <p className="flex gap-1.5">
                        <span className="text-brand-600 font-semibold">1.</span>
                        Feed data forward through the layers
                      </p>
                      <p className="flex gap-1.5">
                        <span className="text-brand-600 font-semibold">2.</span>
                        Measure how wrong the prediction was
                      </p>
                      <p className="flex gap-1.5">
                        <span className="text-brand-600 font-semibold">3.</span>
                        Nudge every connection to reduce that error
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-4 py-3 border-t border-slate-200 bg-white">
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-400">
                  Ask a follow-up question...
                  <ArrowRight className="w-4 h-4 ml-auto text-brand-500" />
                </div>
              </div>
            </div>

            {/* Floating stat card */}
            <div className="absolute -bottom-6 -left-8 flex items-center gap-3 px-4 py-3 rounded-xl bg-white border border-slate-200 shadow-lg">
              <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Study streak</p>
                <p className="text-lg font-bold text-slate-900 leading-tight">
                  12 days
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

/* ------------------------------------------------------------------ */
/* Section: Features                                                   */
/* ------------------------------------------------------------------ */

const Features = () => (
  <section id="features" className="py-20 lg:py-28 bg-white scroll-mt-20">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto text-center mb-16">
        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-sm font-medium mb-4">
          <Sparkles className="w-4 h-4" />
          Features
        </span>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
          Everything you need to study effectively
        </h2>
        <p className="mt-5 text-lg text-slate-600 leading-relaxed">
          Four powerful AI tools working together, so you spend less time wrestling
          with information and more time actually understanding it.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {FEATURES.map(({ icon: Icon, title, description, color, iconColor }) => (
          <Card
            key={title}
            className="hover:shadow-lg hover:-translate-y-1 hover:border-brand-300 transition-all duration-300"
          >
            <div
              className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center mb-4`}
            >
              <Icon className={`w-6 h-6 ${iconColor}`} />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
            <p className="text-sm text-slate-600 leading-relaxed">{description}</p>
          </Card>
        ))}
      </div>
    </div>
  </section>
);

/* ------------------------------------------------------------------ */
/* Section: How it works                                               */
/* ------------------------------------------------------------------ */

const HowItWorks = () => (
  <section
    id="how-it-works"
    className="py-20 lg:py-28 bg-slate-50 scroll-mt-20 border-y border-slate-200/60"
  >
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto text-center mb-16">
        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-sm font-medium mb-4">
          <Zap className="w-4 h-4" />
          How It Works
        </span>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
          Up and running in three steps
        </h2>
        <p className="mt-5 text-lg text-slate-600 leading-relaxed">
          No setup, no configuration, no learning curve. Create an account and start
          studying.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 relative">
        {/* Connecting line (desktop only) */}
        <div className="hidden md:block absolute top-7 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-brand-200 via-brand-300 to-brand-200" />

        {STEPS.map(({ icon: Icon, title, description }, index) => (
          <div key={title} className="relative text-center">
            <div className="relative inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white border-2 border-brand-200 shadow-sm mb-5">
              <Icon className="w-6 h-6 text-brand-600" />
              <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-brand-600 text-white text-xs font-bold flex items-center justify-center">
                {index + 1}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
            <p className="text-sm text-slate-600 leading-relaxed max-w-sm mx-auto">
              {description}
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* ------------------------------------------------------------------ */
/* Section: About / Why us                                             */
/* ------------------------------------------------------------------ */

const About = () => (
  <section id="about" className="py-20 lg:py-28 bg-white scroll-mt-20">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <div>
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            About
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Built for students who want to actually understand
          </h2>
          <p className="mt-5 text-lg text-slate-600 leading-relaxed">
            Reading the same textbook five times is not revision. StudyMate AI gives
            you a patient, always-available tutor that explains things the way a good
            lecturer would — clear, structured, and at your level.
          </p>

          <ul className="mt-8 space-y-3.5">
            {BENEFITS.map((benefit) => (
              <li key={benefit} className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-brand-600 flex-shrink-0 mt-0.5" />
                <span className="text-slate-700">{benefit}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {STATS.map(({ icon: Icon, value, label, color }) => (
            <Card key={label} className="text-center">
              <div
                className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center mx-auto mb-3`}
              >
                <Icon className="w-6 h-6" />
              </div>
              <p className="text-2xl font-extrabold text-slate-900">{value}</p>
              <p className="text-sm text-slate-500 mt-1">{label}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  </section>
);

/* ------------------------------------------------------------------ */
/* Section: Final CTA                                                  */
/* ------------------------------------------------------------------ */

const FinalCTA = ({ isAuthenticated }) => (
  <section className="py-20 lg:py-28 bg-white">
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 via-brand-700 to-brand-800 px-8 py-14 lg:px-16 lg:py-20 text-center shadow-xl shadow-brand-600/20">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/20 rounded-full blur-2xl" />
          <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-white/10 rounded-full blur-2xl" />
        </div>

        <div className="relative">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            {isAuthenticated
              ? 'Ready to keep studying?'
              : 'Stop re-reading. Start understanding.'}
          </h2>
          <p className="mt-5 text-lg text-brand-100 leading-relaxed max-w-2xl mx-auto">
            {isAuthenticated
              ? 'Pick up your streak, review your progress, and get your next question answered.'
              : 'Join thousands of students using AI to study faster and understand more. It is free, and you could be studying in under a minute.'}
          </p>

          <div className="mt-9 flex flex-col sm:flex-row gap-3 justify-center">
            {isAuthenticated ? (
              <Link to="/dashboard">
                <Button
                  size="xl"
                  className="w-full sm:w-auto bg-white text-brand-700 hover:bg-brand-50 shadow-lg"
                >
                  Go to Dashboard
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/register">
                  <Button
                    size="xl"
                    className="w-full sm:w-auto bg-white text-brand-700 hover:bg-brand-50 shadow-lg"
                  >
                    Create Free Account
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/login">
                  <Button
                    variant="ghost"
                    size="xl"
                    className="w-full sm:w-auto text-white hover:bg-white/10 border border-white/30"
                  >
                    Login
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  </section>
);

/* ------------------------------------------------------------------ */
/* Footer                                                              */
/* ------------------------------------------------------------------ */

const Footer = () => {
  const productLinks = [
    { label: 'AI Tutor', to: '/tutor' },
    { label: 'Note Summarizer', to: '/summarizer' },
    { label: 'Quiz Generator', to: '/quiz' },
    { label: 'Flashcards', to: '/flashcards' },
  ];

  const resourceLinks = [
    { label: 'Dashboard', to: '/dashboard' },
    { label: 'Study History', to: '/history' },
    { label: 'Settings', to: '/settings' },
  ];

  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
                <Book className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-slate-900">
                StudyMate<span className="text-brand-500">AI</span>
              </span>
            </div>
            <p className="mt-4 text-sm text-slate-500 leading-relaxed max-w-sm">
              An AI-powered study assistant for university students. Understand
              concepts faster, revise smarter, and study with confidence.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">
              Product
            </h3>
            <ul className="space-y-2.5">
              {productLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-slate-500 hover:text-brand-600 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">
              Resources
            </h3>
            <ul className="space-y-2.5">
              {resourceLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-slate-500 hover:text-brand-600 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} StudyMate AI. All rights reserved.
          </p>
          <p className="flex items-center gap-1.5 text-sm text-slate-500">
            Powered by
            <span className="font-semibold text-slate-700">Claude</span>
            <span className="text-slate-400">by Anthropic</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

const Landing = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-white">
      {/* App.jsx renders this route outside AppLayout, so the landing page
          owns the Navbar itself. It is fixed, hence the hero top padding. */}
      <Navbar />
      <Hero isAuthenticated={isAuthenticated} />
      <Features />
      <HowItWorks />
      <About />
      <FinalCTA isAuthenticated={isAuthenticated} />
      <Footer />
    </div>
  );
};

export default Landing;