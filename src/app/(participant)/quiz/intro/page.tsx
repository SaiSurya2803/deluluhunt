"use client";

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ShieldAlert, AlertTriangle, Clock, ListOrdered } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';

export default function QuizIntroPage() {
  const { team } = useAuthStore();

  if (team?.quizStatus === 'COMPLETED') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
        <ShieldAlert className="w-24 h-24 text-success" />
        <h1 className="text-3xl font-bold text-white">QUIZ COMPLETED</h1>
        <p className="text-foreground/60 text-center max-w-md">
          Your team has successfully submitted the proctored quiz. Results will be available on the leaderboard or after admin review.
        </p>
        <Link href="/dashboard"><Button>Return to Dashboard</Button></Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 mt-8">
      <div className="text-center space-y-4 mb-12">
        <div className="inline-flex items-center justify-center p-4 bg-secondary/10 rounded-full border border-secondary/30 text-secondary mb-4">
          <ShieldAlert className="w-12 h-12" />
        </div>
        <h1 className="text-4xl font-black text-white tracking-widest text-glow">QUIZ ROUND</h1>
        <p className="text-xl text-foreground/60">Proctored Assessment</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-6 flex items-center gap-4">
            <ListOrdered className="w-8 h-8 text-primary" />
            <div>
              <p className="text-sm uppercase tracking-widest text-foreground/50">Questions</p>
              <p className="text-2xl font-bold text-white">Custom Length</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-warning/20 bg-warning/5">
          <CardContent className="p-6 flex items-center gap-4">
            <Clock className="w-8 h-8 text-warning" />
            <div>
              <p className="text-sm uppercase tracking-widest text-foreground/50">Duration</p>
              <p className="text-2xl font-bold text-white">Per-Question Timers</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-danger/30 bg-danger/5">
        <CardHeader>
          <CardTitle className="flex items-center text-danger"><AlertTriangle className="w-5 h-5 mr-2" /> IMPORTANT NOTICE</CardTitle>
          <CardDescription className="text-foreground/80 text-base mt-2 leading-relaxed">
            This quiz is strictly proctored. Your camera, microphone, screen activity, and browser events will be monitored according to the configured settings.
            Suspicious events, tab switching, or leaving the full-screen environment will be flagged for organizer review.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="flex justify-center pt-8">
        <Link href="/quiz/system-check">
          <Button size="lg" className="px-12 py-6 text-lg uppercase tracking-widest font-bold shadow-[0_0_30px_rgba(0,240,255,0.4)]">
            START SYSTEM CHECK
          </Button>
        </Link>
      </div>
    </div>
  );
}
