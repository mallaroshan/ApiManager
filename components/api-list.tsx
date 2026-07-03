'use client';

import { useEffect, useState } from 'react';
import { apiClient, ExternalApiListDto } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { ExecuteApiDialog } from '@/components/execute-api-dialog';


interface ApiListProps {
  onSelectApi: (apiId: string) => void;
  onAddNew: () => void;
}

const HTTP_METHODS = {
  0: 'GET',
  1: 'POST',
  2: 'PUT',
  3: 'DELETE',
  4: 'PATCH',
  5: 'HEAD',
  6: 'OPTIONS',
};

const AUTH_TYPES = {
  0: 'None',
  1: 'API Key',
  2: 'Bearer Token',
  3: 'Basic Auth',
  4: 'OAuth2',
};


export function ApiList({ onSelectApi, onAddNew }: ApiListProps) {
  const [apis, setApis] = useState<ExternalApiListDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [executeApiId, setExecuteApiId] = useState<string | null>(null);
// const [requestBody, setRequestBody] = useState(
//   JSON.stringify(
//     {
//       parameters: {}
//     },
//     null,
//     2
//   )
// );
// const [response, setResponse] = useState("");
// const [executing, setExecuting] = useState(false);
  useEffect(() => {
    const fetchApis = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await apiClient.getAllApis();
        setApis(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch APIs');
      } finally {
        setLoading(false);
      }
    };

    fetchApis();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">
        <p className="font-semibold">Error loading APIs</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">APIs ({apis.length})</h2>
        <Button onClick={onAddNew} className="gap-2">
          <span>+</span> Add New API
        </Button>
      </div>

      {apis.length === 0 ? (
        <div className="rounded-lg border border-dashed border-muted-foreground/25 p-8 text-center text-muted-foreground">
          <p>No APIs found. Create your first API to get started.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {apis.map((api) => (
            <div
              key={api.id}
              className="rounded-lg border border-border bg-card p-4 hover:bg-accent/50 transition-colors cursor-pointer"
              onClick={() => onSelectApi(api.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-card-foreground">{api.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {api.baseUrl}
                    <span className="mx-1">/</span>
                    {api.endpoint}
                  </p>
                </div>
                <div className="flex gap-2 ml-4">
                  <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                    {HTTP_METHODS[api.method as keyof typeof HTTP_METHODS] || 'UNKNOWN'}
                  </span>
                  <span className="inline-flex items-center rounded-full bg-secondary/10 px-3 py-1 text-xs font-medium text-secondary-foreground">
                    {AUTH_TYPES[api.authenticationType as keyof typeof AUTH_TYPES] || 'Unknown'}
                  </span>
                  <Button
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setExecuteApiId(api.id);
                  }}
                >
                  Execute
                </Button>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                <span
                  className={`inline-block h-2 w-2 rounded-full ${
                    api.isActive ? 'bg-green-500' : 'bg-gray-400'
                  }`}
                />
                {api.isActive ? 'Active' : 'Inactive'}
              </div>
            </div>
          ))}
        </div>
      )}
      <ExecuteApiDialog
  apiId={executeApiId}
  open={executeApiId !== null}
  onClose={() => setExecuteApiId(null)}
/>
    </div>
    
  );
}
