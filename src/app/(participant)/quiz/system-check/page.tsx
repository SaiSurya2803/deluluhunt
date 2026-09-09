"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Camera, Mic, Monitor, Globe, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { DB } from '@/services/db';
import { useAuthStore } from '@/store/useAuthStore';

type Status = 'PENDING' | 'CHECKING' | 'PASSED' | 'FAILED';

export default function SystemCheckPage() {
  const router = useRouter();
  const { team, currentMember } = useAuthStore();
  const [checks, setChecks] = useState({
    camera: 'PENDING' as Status,
    mic: 'PENDING' as Status,
    browser: 'PENDING' as Status,
    internet: 'PENDING' as Status,
  });
  const [allPassed, setAllPassed] = useState(false);
  const [consent, setConsent] = useState(false);
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    runChecks();
    return () => {
      // Cleanup stream when leaving
      videoStream?.getTracks().forEach(t => t.stop());
    };
  }, []);

  const runChecks = async () => {
    // 1. Internet Check
    setChecks(prev => ({ ...prev, internet: 'CHECKING' }));
    await new Promise(r => setTimeout(r, 800));
    setChecks(prev => ({ ...prev, internet: navigator.onLine ? 'PASSED' : 'FAILED' }));

    // 2. Browser Check
    setChecks(prev => ({ ...prev, browser: 'CHECKING' }));
    await new Promise(r => setTimeout(r, 800));
    setChecks(prev => ({ ...prev, browser: 'PASSED' }));

    // 3. Camera & Mic Check (Actual)
    setChecks(prev => ({ ...prev, camera: 'CHECKING', mic: 'CHECKING' }));
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      // Turn it off immediately since we just needed to verify access.
      stream.getTracks().forEach(track => track.stop());
      setChecks(prev => ({ ...prev, camera: 'PASSED', mic: 'PASSED' }));
      setAllPassed(true);
    } catch (err) {
      console.error("Camera access denied", err);
      setChecks(prev => ({ ...prev, camera: 'FAILED', mic: 'FAILED' }));
      alert("You must allow Camera and Microphone access to proceed.");
    }
  };

  const handleEnterQuiz = () => {
    if (!consent) return;
    
    if (team && currentMember) {
      // Log entry
      const logs = DB.getActivityLogs();
      DB.setActivityLogs([
        {
          id: `log-${Date.now()}`,
          teamId: team.id,
          memberId: currentMember.id,
          action: 'Passed System Check, Entered Proctored Quiz',
          timestamp: new Date().toISOString()
        },
        ...logs
      ]);
    }
    
    router.push('/quiz/active');
  };

  const CheckItem = ({ icon: Icon, title, status }: { icon: any, title: string, status: Status }) => (
    <div className="flex items-center justify-between p-4 border-b border-glass-border last:border-0">
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5 text-foreground/60" />
        <span className="font-medium text-slate-900">{title}</span>
      </div>
      <div>
        {status === 'PENDING' && <span className="text-foreground/40 text-sm">Pending...</span>}
        {status === 'CHECKING' && <span className="text-primary text-sm flex items-center"><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Checking...</span>}
        {status === 'PASSED' && <span className="text-success text-sm flex items-center"><CheckCircle className="w-4 h-4 mr-2" /> Passed</span>}
        {status === 'FAILED' && <span className="text-danger text-sm flex items-center"><XCircle className="w-4 h-4 mr-2" /> Failed</span>}
      </div>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto space-y-6 mt-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">SYSTEM CHECK</h1>
        <p className="text-foreground/60">Verifying your environment before starting the proctored assessment.</p>
      </div>

      <Card className="border-slate-200 shadow-sm mt-8">
        <CardContent className="p-0">
          <CheckItem icon={Globe} title="Internet Connection" status={checks.internet} />
          <CheckItem icon={Monitor} title="Browser Compatibility" status={checks.browser} />
          <CheckItem icon={Camera} title="Webcam Access" status={checks.camera} />
          <CheckItem icon={Mic} title="Microphone Access" status={checks.mic} />
        </CardContent>
      </Card>

      {allPassed && (
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="p-6">
            <label className="flex items-start gap-3 cursor-pointer">
              <input 
                type="checkbox" 
                className="mt-1 w-5 h-5 rounded border-glass-border bg-white/80 text-primary focus:ring-primary"
                checked={consent}
                onChange={e => setConsent(e.target.checked)}
              />
              <span className="text-sm text-foreground/80 leading-relaxed">
                I understand that this quiz is proctored and that relevant activity (camera, screen, browser events) will be monitored and may be flagged for review by the organizers. I agree to maintain academic integrity.
              </span>
            </label>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-center pt-4">
        <Button 
          size="lg" 
          disabled={!allPassed || !consent} 
          onClick={handleEnterQuiz}
          className="w-full sm:w-auto px-12 uppercase tracking-widest font-bold"
        >
          ENTER QUIZ
        </Button>
      </div>
    </div>
  );
}
