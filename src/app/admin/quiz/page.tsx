"use client";

import { useState, useEffect } from 'react';
import { DB } from '@/services/db';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { QuizQuestion } from '@/types';
import { Plus, Trash2, Save, Clock, Trophy } from 'lucide-react';

export default function AdminQuizPage() {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);

  useEffect(() => {
    setQuestions(DB.getItem<QuizQuestion>(DB.KEYS.QUIZ_QUESTIONS) || []);
  }, []);

  const saveQuestions = () => {
    DB.setItem(DB.KEYS.QUIZ_QUESTIONS, questions);
    alert('Quiz questions saved successfully!');
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: `q-${Date.now()}`,
        text: 'New Question',
        options: ['Option A', 'Option B', 'Option C', 'Option D'],
        correctOptionIndex: 0,
        timer: 60,
        points: 10
      }
    ]);
  };

  const updateQuestion = (id: string, field: keyof QuizQuestion, value: any) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, [field]: value } : q));
  };

  const updateOption = (qId: string, optIndex: number, value: string) => {
    setQuestions(questions.map(q => {
      if (q.id === qId) {
        const newOpts = [...q.options];
        newOpts[optIndex] = value;
        return { ...q, options: newOpts };
      }
      return q;
    }));
  };

  const removeQuestion = (id: string) => {
    if (confirm('Delete this question?')) {
      setQuestions(questions.filter(q => q.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center pb-4 border-b border-white/20/10">
        <div>
          <h1 className="text-3xl font-bold text-danger tracking-tight">QUIZ MANAGEMENT</h1>
          <p className="text-slate-400 mt-1">Configure questions, set point values, and assign per-question timers.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={addQuestion} className="glass-panel  text-slate-300 hover:glass-panel backdrop-blur-lg">
            <Plus className="w-4 h-4 mr-2" /> Add Question
          </Button>
          <Button onClick={saveQuestions} className="bg-success text-foreground hover:bg-success/90">
            <Save className="w-4 h-4 mr-2" /> Save All
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {questions.length === 0 ? (
          <div className="text-center p-12 glass-panel  border border-white/20/10 rounded-xl text-slate-400">
            No questions available. Click "Add Question" to start building the quiz.
          </div>
        ) : (
          questions.map((q, index) => (
            <Card key={q.id} className="border-white/20/10 shadow-sm glass-panel  overflow-visible">
              <CardHeader className="glass-panel backdrop-blur-lg border-b border-white/20/10 flex flex-row items-center justify-between pb-4">
                <CardTitle className="text-lg text-slate-200">Question {index + 1}</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => removeQuestion(q.id)} className="text-danger hover:bg-danger/10">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-300">Question Text</label>
                  <Input 
                    value={q.text} 
                    onChange={(e) => updateQuestion(q.id, 'text', e.target.value)} 
                    className="glass-panel  border-white/20 text-foreground"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-300 flex items-center">
                      <Clock className="w-4 h-4 mr-1 text-slate-400" /> Timer (Seconds)
                    </label>
                    <Input 
                      type="number" 
                      value={q.timer || 60} 
                      onChange={(e) => updateQuestion(q.id, 'timer', parseInt(e.target.value) || 0)}
                      className="glass-panel  border-white/20 text-foreground"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-300 flex items-center">
                      <Trophy className="w-4 h-4 mr-1 text-slate-400" /> Points Awarded
                    </label>
                    <Input 
                      type="number" 
                      value={q.points || 10} 
                      onChange={(e) => updateQuestion(q.id, 'points', parseInt(e.target.value) || 0)}
                      className="glass-panel  border-white/20 text-foreground"
                    />
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <label className="text-sm font-semibold text-slate-300">Options & Correct Answer</label>
                  {q.options.map((opt, oIndex) => (
                    <div key={oIndex} className="flex items-center gap-3">
                      <input 
                        type="radio" 
                        name={`correct-${q.id}`} 
                        checked={q.correctOptionIndex === oIndex}
                        onChange={() => updateQuestion(q.id, 'correctOptionIndex', oIndex)}
                        className="w-5 h-5 text-primary border-white/20 cursor-pointer"
                      />
                      <Input 
                        value={opt} 
                        onChange={(e) => updateOption(q.id, oIndex, e.target.value)}
                        className={q.correctOptionIndex === oIndex ? "border-success bg-success/5 text-foreground" : "glass-panel  border-white/20 text-foreground"}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
