"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { ShieldQuestion, BookOpen, AlertCircle, HelpCircle } from 'lucide-react';

export default function RulesPage() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="text-center space-y-4 mb-8">
        <ShieldQuestion className="w-16 h-16 text-primary mx-auto" />
        <h1 className="text-3xl font-bold text-slate-900 text-glow">CHALLENGE RULES</h1>
        <p className="text-foreground/60">Everything you need to know to compete in the Innovatex Delulu Hunt.</p>
      </div>

      <Card className="border-primary/20">
        <CardHeader className="border-b border-glass-border">
          <CardTitle className="flex items-center text-primary"><BookOpen className="w-5 h-5 mr-2" /> General Rules</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4 text-foreground/80 leading-relaxed">
          <ul className="list-disc pl-5 space-y-2">
            <li>A team can consist of a maximum of 4 members.</li>
            <li>All members must use the same team credentials to access the platform.</li>
            <li>Sharing solutions or code with other teams is strictly prohibited and will result in immediate disqualification.</li>
            <li>Any attempt to attack or compromise the platform infrastructure is forbidden.</li>
            <li>The organizer's decisions regarding scoring, penalties, and disqualifications are final.</li>
          </ul>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="border-b border-glass-border">
            <CardTitle className="flex items-center text-warning"><AlertCircle className="w-5 h-5 mr-2" /> Credits & Clues</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4 text-foreground/80 text-sm">
            <p>Every team starts with an initial balance of 50 credits.</p>
            <p>Credits can be used to unlock premium clues for difficult challenges. Once spent, credits cannot be refunded.</p>
            <p>The total amount of credits remaining will be factored into leaderboard tie-breakers.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b border-glass-border">
            <CardTitle className="flex items-center text-success"><HelpCircle className="w-5 h-5 mr-2" /> Proctored Quiz</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4 text-foreground/80 text-sm">
            <p>The MCQ round is actively proctored. You must grant camera and microphone permissions.</p>
            <p>Navigating away from the quiz tab, exiting full-screen, or opening developer tools will be flagged as suspicious activity.</p>
            <p>If your internet disconnects, your timer will continue. Auto-save ensures your answers are not lost.</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white/60">
        <CardContent className="p-6 text-center">
          <p className="text-foreground/60 mb-2">Need technical assistance?</p>
          <p className="font-bold text-slate-900">Contact the support team at <a href="mailto:support@innovatex.com" className="text-primary hover:underline">support@innovatex.com</a></p>
        </CardContent>
      </Card>
    </div>
  );
}
