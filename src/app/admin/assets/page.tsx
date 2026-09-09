"use client";

import { useState, useEffect } from 'react';
import { DB } from '@/services/db';
import { Asset, Round } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Save, Plus, Trash2, FileArchive } from 'lucide-react';

export default function AdminAssetsPage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [rounds, setRounds] = useState<Round[]>([]);

  useEffect(() => {
    setAssets(DB.getAssets() || []);
    setRounds(DB.getRounds() || []);
  }, []);

  const saveAssets = () => {
    DB.setAssets(assets);
    alert('Assets saved successfully!');
  };

  const addAsset = () => {
    setAssets([
      ...assets,
      {
        id: `a-${Date.now()}`,
        roundId: rounds[0]?.id || 'r1',
        name: 'New Asset',
        type: 'LINK',
        url: 'https://example.com',
        description: 'Resource description',
        isLocked: false
      }
    ]);
  };

  const updateAsset = (id: string, field: keyof Asset, value: any) => {
    setAssets(assets.map(a => a.id === id ? { ...a, [field]: value } : a));
  };

  const removeAsset = (id: string) => {
    if (confirm('Delete this asset?')) {
      setAssets(assets.filter(a => a.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center pb-4 border-b border-slate-700">
        <div>
          <h1 className="text-3xl font-bold text-danger tracking-tight">ASSETS MANAGEMENT</h1>
          <p className="text-slate-400 mt-1">Manage challenge resources, datasets, and file links.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={addAsset} className="bg-slate-900 text-slate-300 hover:bg-slate-800">
            <Plus className="w-4 h-4 mr-2" /> Add Asset
          </Button>
          <Button onClick={saveAssets} className="bg-success text-white hover:bg-success/90">
            <Save className="w-4 h-4 mr-2" /> Save All
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {assets.map((asset, index) => (
          <Card key={asset.id} className="border-slate-700 shadow-sm bg-slate-900 overflow-visible">
            <CardHeader className="bg-slate-800 border-b border-slate-800 flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-lg text-slate-200 flex items-center">
                <FileArchive className="w-4 h-4 mr-2 text-primary" /> {asset.name}
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={() => removeAsset(asset.id)} className="text-danger hover:bg-danger/10">
                <Trash2 className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-300">Assigned Round</label>
                <select 
                  value={asset.roundId}
                  onChange={(e) => updateAsset(asset.id, 'roundId', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-600 text-sm rounded-md px-3 py-2 text-white"
                >
                  {rounds.map(r => (
                    <option key={r.id} value={r.id}>Round {r.roundNumber}: {r.title}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-300">Asset Name</label>
                <Input 
                  value={asset.name} 
                  onChange={(e) => updateAsset(asset.id, 'name', e.target.value)} 
                  className="bg-slate-900 border-slate-600 text-white"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-300">Description</label>
                <textarea 
                  value={asset.description || ''} 
                  onChange={(e) => updateAsset(asset.id, 'description', e.target.value)} 
                  className="w-full bg-slate-900 border border-slate-600 text-white rounded-md p-2 text-sm min-h-[60px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-300">Type</label>
                  <select 
                    value={asset.type}
                    onChange={(e) => updateAsset(asset.id, 'type', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-600 text-sm rounded-md px-3 py-2 text-white"
                  >
                    <option value="PDF">PDF</option>
                    <option value="IMAGE">IMAGE</option>
                    <option value="VIDEO">VIDEO</option>
                    <option value="DOCUMENT">DOCUMENT</option>
                    <option value="DATASET">DATASET</option>
                    <option value="LINK">LINK</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-300">Status</label>
                  <label className="flex items-center gap-2 cursor-pointer mt-2">
                    <input 
                      type="checkbox" 
                      checked={asset.isLocked}
                      onChange={(e) => updateAsset(asset.id, 'isLocked', e.target.checked)}
                      className="w-4 h-4 text-primary"
                    />
                    <span className="text-sm text-slate-300">Locked Globally</span>
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-300">URL / Link</label>
                <Input 
                  value={asset.url} 
                  onChange={(e) => updateAsset(asset.id, 'url', e.target.value)} 
                  className="bg-slate-900 border-slate-600 text-white text-xs"
                />
              </div>

            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
