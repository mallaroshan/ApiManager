'use client';

import { useEffect, useState } from 'react';
import { apiClient, ExternalApiDetailDto } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface ApiDetailProps {
  apiId: string;
  onBack: () => void;
}

const HTTP_METHODS = {
  1: 'GET',
  2: 'POST',
  3: 'PUT',
  4: 'DELETE',
  5: 'PATCH',
  6: 'HEAD',
  7: 'OPTIONS',
};

const AUTH_TYPES = {
  0: 'None',
  1: 'API Key',
  2: 'Bearer Token',
  3: 'Basic Auth',
  4: 'OAuth2',
};

export function ApiDetail({ apiId, onBack }: ApiDetailProps) {
  const [api, setApi] = useState<ExternalApiDetailDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApi = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await apiClient.getApiById(apiId);
        setApi(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch API details');
      } finally {
        setLoading(false);
      }
    };

    fetchApi();
  }, [apiId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <Button onClick={onBack} variant="outline">
          ← Back to List
        </Button>
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">
          <p className="font-semibold">Error loading API details</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (!api) {
    return (
      <div className="space-y-4">
        <Button onClick={onBack} variant="outline">
          ← Back to List
        </Button>
        <p className="text-muted-foreground">API not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Button onClick={onBack} variant="outline">
        ← Back to List
      </Button>

      <div className="space-y-4">
        <div className="border-b pb-4">
          <h1 className="text-3xl font-bold text-card-foreground">{api.name}</h1>
          <div className="mt-2 flex gap-2">
            <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              {HTTP_METHODS[api.method as keyof typeof HTTP_METHODS] || 'UNKNOWN'}
            </span>
            <span className="inline-flex items-center rounded-full bg-secondary/10 px-3 py-1 text-sm font-medium text-secondary-foreground">
              {AUTH_TYPES[api.authenticationType as keyof typeof AUTH_TYPES] || 'Unknown'}
            </span>
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${api.isActive
                ? 'bg-green-500/10 text-green-700 dark:text-green-400'
                : 'bg-gray-400/10 text-gray-700 dark:text-gray-400'
                }`}
            >
              {api.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>

        {/* Endpoint Information */}
        <div className="grid gap-4 rounded-lg border border-border bg-card p-4">
          <div>
            <h3 className="font-semibold text-card-foreground mb-2">Endpoint Configuration</h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-muted-foreground">Base URL</p>
                <p className="font-mono bg-muted p-2 rounded break-all">{api.baseUrl}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Endpoint Path</p>
                <p className="font-mono bg-muted p-2 rounded break-all">{api.endpoint}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Full URL</p>
                <p className="font-mono bg-muted p-2 rounded break-all">
                  {api.baseUrl}{api.endpoint}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Content Type</p>
                <p className="font-mono bg-muted p-2 rounded">{api.contentType}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Timeout (seconds)</p>
                <p className="font-mono bg-muted p-2 rounded">{api.timeoutInSeconds}</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Authentication Type</p>
                <p className="font-mono bg-muted p-3 rounded-md">
                  {api.apiAuthentication.apiKeyHeaderName || api.apiAuthentication.bearerToken ? 'API Key' : 'Bearer Token'}
                </p>
              </div>

              <div className="mt-4">
                <p className="text-muted-foreground mb-1">Is Authentication API</p>
                <p className="font-mono bg-muted p-3 rounded-md">
                  {api.IsAuthenticationApi ? "Yes" : "No"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Headers */}
        {api.headers && api.headers.length > 0 && (
          <div className="rounded-lg border border-border bg-card p-4">
            <h3 className="font-semibold text-card-foreground mb-3">Headers</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 px-2 text-muted-foreground">Header Name</th>
                    <th className="text-left py-2 px-2 text-muted-foreground">Value</th>
                    <th className="text-left py-2 px-2 text-muted-foreground">Secret</th>
                  </tr>
                </thead>
                <tbody>
                  {api.headers.map((header, idx) => (
                    <tr key={idx} className="border-b border-border/50">
                      <td className="py-2 px-2 font-mono">{header.headerName}</td>
                      <td className="py-2 px-2 font-mono break-all">
                        {header.isSecret ? '•••••••••' : header.headerValue}
                      </td>
                      <td className="py-2 px-2">
                        {header.isSecret ? (
                          <span className="text-yellow-600 dark:text-yellow-400">Yes</span>
                        ) : (
                          <span className="text-gray-500">No</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Request Parameters */}
        {api.requestParameters && api.requestParameters.length > 0 && (
          <div className="rounded-lg border border-border bg-card p-4">
            <h3 className="font-semibold text-card-foreground mb-3">Request Parameters</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 px-2 text-muted-foreground">Name</th>
                    <th className="text-left py-2 px-2 text-muted-foreground">JSON Path</th>
                    <th className="text-left py-2 px-2 text-muted-foreground">Data Type</th>
                    <th className="text-left py-2 px-2 text-muted-foreground">Required</th>
                    <th className="text-left py-2 px-2 text-muted-foreground">Default</th>
                  </tr>
                </thead>
                <tbody>
                  {api.requestParameters.map((param, idx) => (
                    <tr key={idx} className="border-b border-border/50">
                      <td className="py-2 px-2 font-semibold">{param.name}</td>
                      <td className="py-2 px-2 font-mono text-xs">{param.jsonPath}</td>
                      <td className="py-2 px-2">
                        <span className="inline-flex items-center rounded bg-muted px-2 py-1 text-xs">
                          {param.dataType}
                        </span>
                      </td>
                      <td className="py-2 px-2">
                        {param.isRequired ? (
                          <span className="text-red-600 dark:text-red-400">Yes</span>
                        ) : (
                          <span className="text-gray-500">No</span>
                        )}
                      </td>
                      <td className="py-2 px-2 font-mono text-xs">
                        {param.defaultValue || '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Response Parameters */}
        {api.responseParameters && api.responseParameters.length > 0 && (
          <div className="rounded-lg border border-border bg-card p-4">
            <h3 className="font-semibold text-card-foreground mb-3">Response Parameters</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 px-2 text-muted-foreground">Name</th>
                    <th className="text-left py-2 px-2 text-muted-foreground">JSON Path</th>
                    <th className="text-left py-2 px-2 text-muted-foreground">Data Type</th>
                  </tr>
                </thead>
                <tbody>
                  {api.responseParameters.map((param, idx) => (
                    <tr key={idx} className="border-b border-border/50">
                      <td className="py-2 px-2 font-semibold">{param.name}</td>
                      <td className="py-2 px-2 font-mono text-xs">{param.jsonPath}</td>
                      <td className="py-2 px-2">
                        <span className="inline-flex items-center rounded bg-muted px-2 py-1 text-xs">
                          {param.dataType}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
