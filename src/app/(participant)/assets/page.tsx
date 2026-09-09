"use client";

import { useEffect, useState } from 'react';
import { DB } from '@/services/db';
import { Asset, Round } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { FileText, Image as ImageIcon, Video, FileArchive, Link as LinkIcon, Lock, Download } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';

export default function AssetsPage() {
  const { team } = useAuthStore();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [rounds, setRounds] = useState<Record<string, Round>>({});

  useEffect(() => {
    if (!team) return;
    const allRounds = DB.getRounds();
    const roundsMap = allRounds.reduce((acc, r) => ({ ...acc, [r.id]: r }), {} as Record<string, Round>);
    setRounds(roundsMap);

    const allAssets = DB.getAssets();
    // Assets are locked if the round is locked. The `isLocked` flag on Asset itself might be for specific admin overrides, 
    // but primarily we check the round status.
    const processedAssets = allAssets.map(a => {
      const roundLocked = roundsMap[a.roundId]?.status === 'LOCKED';
      return { ...a, isLocked: a.isLocked || roundLocked };
    });
    setAssets(processedAssets);
  }, [team]);

  const getIcon = (type: Asset['type']) => {
    switch (type) {
      case 'PDF': return <FileText className="w-8 h-8 text-danger" />;
      case 'IMAGE': return <ImageIcon className="w-8 h-8 text-success" />;
      case 'VIDEO': return <Video className="w-8 h-8 text-primary" />;
      case 'DATASET': return <FileArchive className="w-8 h-8 text-warning" />;
      case 'LINK': return <LinkIcon className="w-8 h-8 text-secondary" />;
      default: return <FileText className="w-8 h-8 text-foreground/50" />;
    }
  };

  if (!team) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white text-glow">ASSET LIBRARY</h1>
        <p className="text-foreground/60 mt-1">Access resources provided for unlocked challenge rounds.</p>
      </div>

      {assets.length === 0 ? (
        <div className="text-center py-12 glass-panel rounded-xl">
          <FileArchive className="w-12 h-12 text-foreground/20 mx-auto mb-4" />
          <p className="text-foreground/60">No assets available yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {assets.map(asset => {
            const round = rounds[asset.roundId];
            return (
              <Card key={asset.id} className={asset.isLocked ? 'opacity-70 border-glass-border' : 'hover:border-primary/50 transition-colors'}>
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-slate-900/60 rounded-lg border border-glass-border">
                      {asset.isLocked ? <Lock className="w-8 h-8 text-foreground/40" /> : getIcon(asset.type)}
                    </div>
                    {round && (
                      <Badge variant="outline" className="text-[10px]">R{round.roundNumber}</Badge>
                    )}
                  </div>
                  <CardTitle className="text-base leading-tight truncate" title={asset.name}>
                    {asset.name}
                  </CardTitle>
                </CardHeader>
                <CardFooter>
                  {asset.isLocked ? (
                    <Button variant="ghost" disabled className="w-full text-xs bg-slate-900/80">
                      <Lock className="w-3 h-3 mr-2" /> LOCKED
                    </Button>
                  ) : (
                    <Button variant="outline" className="w-full text-xs">
                      <Download className="w-3 h-3 mr-2" /> DOWNLOAD
                    </Button>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
