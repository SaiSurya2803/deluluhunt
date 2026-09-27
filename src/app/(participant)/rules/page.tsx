"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { ShieldQuestion, BookOpen, AlertCircle, HelpCircle } from 'lucide-react';
import { DB } from '@/services/db';

export default function RulesPage() {
  const [rulesText, setRulesText] = useState<string>('');

  useEffect(() => {
    const gs = DB.getGlobalSettings();
    setRulesText(gs.rulesText || '');
  }, []);

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="text-center space-y-4 mb-8">
        <ShieldQuestion className="w-16 h-16 text-primary mx-auto" />
        <h1 className="text-3xl font-bold text-white text-glow">CHALLENGE RULES</h1>
        <p className="text-foreground/60">Everything you need to know to compete in the Innovatex Delulu Hunt.</p>
      </div>

      <Card className="border-primary/20">
        <CardHeader className="border-b border-glass-border">
          <CardTitle className="flex items-center text-primary"><BookOpen className="w-5 h-5 mr-2" /> Official Guidelines</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <pre className="whitespace-pre-wrap font-sans text-foreground/80 leading-relaxed">
            {rulesText || 'No rules have been published yet.'}
          </pre>
        </CardContent>
      </Card>
      
      <Card className="border-danger/20">
        <CardHeader className="border-b border-glass-border bg-danger/5">
          <CardTitle className="flex items-center text-danger"><AlertCircle className="w-5 h-5 mr-2" /> Zero Tolerance Policy</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4 text-foreground/80 leading-relaxed">
          <p>
            The system actively monitors for cheating, unauthorized window switching, and suspicious access patterns. 
            Any violation will result in immediate flagging by the proctoring engine. The admin team reserves the right to disqualify any team caught cheating without prior notice.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
