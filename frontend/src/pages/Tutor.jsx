import React, { useState, useEffect, useRef } from 'react';
import { aiAPI } from '../services/ai';
import { getErrorMessage } from '../services/api';
import Button from '../components/Button';
import Card from '../components/Card';
import Loading from '../components/Loading';

const Tutor = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [conversationId, setConversationId] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);

  const loadConversations = async () => {
    try {
      const res = await aiAPI.getConversations();
      setConversations(res.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { loadConversations(); }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  useEffect(() => { scrollToBottom(); }, [messages]);

  const handleNewChat = () => {
    setMessages([]);
    setConversationId(null);
    setInput('');
    setError('');
  };

  const handleSelectConversation = async (id) => {
    try {
      const res = await aiAPI.getConversation(id);
      setConversationId(id);
      setMessages(res.data.messages.map(m => ({ role: m.role, content: m.content })));
    } catch (err) { setError(getErrorMessage(err)); }
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    setSending(true);
    setError('');
    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

    try {
      const res = await aiAPI.tutorChat({
        message: userMessage,
        conversation_id: conversationId,
        history: messages.map(m => ({ role: m.role, content: m.content })),
      });
      setMessages(prev => [...prev, { role: 'assistant', content: res.data.response }]);
      setConversationId(res.data.conversation_id);
      loadConversations();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSending(false);
    }
  };

  const handleDeleteConversation = async (id) => {
    try {
      await aiAPI.deleteConversation(id);
      loadConversations();
      if (id === conversationId) handleNewChat();
    } catch (err) { setError(getErrorMessage(err)); }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex gap-4">
      <div className="w-64 flex-shrink-0 hidden lg:block">
        <Card className="h-full flex flex-col">
          <Button variant="primary" className="w-full mb-4" onClick={handleNewChat}>
            New Chat
          </Button>
          <div className="flex-1 overflow-y-auto space-y-1">
            {conversations.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-4">No conversations yet</p>
            ) : (
              conversations.map((conv) => (
                <div key={conv.id} className="group flex items-center justify-between p-2 rounded-lg hover:bg-slate-100">
                  <button
                    onClick={() => handleSelectConversation(conv.id)}
                    className="flex-1 text-left text-sm text-slate-700 truncate"
                  >
                    {conv.title}
                  </button>
                  <button
                    onClick={() => handleDeleteConversation(conv.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-red-500 hover:bg-red-50 rounded"
                  >
                    Delete
                  </button>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
      <div className="flex-1 flex flex-col">
        <Card className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-brand-50 flex items-center justify-center mb-4">
                  <span className="text-3xl font-bold text-brand-600">AI</span>
                </div>
                <h3 className="text-lg font-semibold text-slate-900">Start a conversation</h3>
                <p className="text-slate-500 text-sm mt-1 max-w-md">Ask StudyMate AI any academic question. I can help explain concepts, solve problems, and more.</p>
              </div>
            ) : (
              messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                    msg.role === 'user' ? 'bg-brand-600 text-white rounded-br-md' : 'bg-slate-100 text-slate-800 rounded-bl-md'
                  }`}>
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              ))
            )}
            {sending && (
              <div className="flex justify-start">
                <div className="bg-slate-100 px-4 py-3 rounded-2xl rounded-bl-md">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" />
                    <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          {error && <div className="px-4 py-2 bg-red-50 border-t border-red-200 text-red-700 text-sm">{error}</div>}
          <div className="p-4 border-t border-slate-200">
            <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask StudyMate AI anything..."
                className="flex-1 px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-colors text-sm"
              />
              <Button type="submit" variant="primary" disabled={sending || !input.trim()}>Send</Button>
            </form>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Tutor;