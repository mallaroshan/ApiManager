'use client';

import { useState } from 'react';
import { ApiList } from '@/components/api-list';
import { ApiDetail } from '@/components/api-detail';
import { ApiForm } from '@/components/api-form';

type ViewState = 'list' | 'detail' | 'form';

export default function Page() {
  const [view, setView] = useState<ViewState>('list');
  const [selectedApiId, setSelectedApiId] = useState<string | null>(null);

  const handleSelectApi = (apiId: string) => {
    setSelectedApiId(apiId);
    setView('detail');
  };

  const handleAddNew = () => {
    setView('form');
  };

  const handleBackToList = () => {
    setView('list');
    setSelectedApiId(null);
  };

  const handleFormSuccess = () => {
    setView('list');
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">API Manager</h1>
          <p className="text-muted-foreground">
            Manage and configure your external API integrations
          </p>
        </div>

        {view === 'list' && (
          <ApiList onSelectApi={handleSelectApi} onAddNew={handleAddNew} />
        )}

        {view === 'detail' && selectedApiId && (
          <ApiDetail apiId={selectedApiId} onBack={handleBackToList} />
        )}

        {view === 'form' && (
          <ApiForm onSuccess={handleFormSuccess} onCancel={handleBackToList} />
        )}
      </div>
    </main>
  );
}
