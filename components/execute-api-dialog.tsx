'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface ExecuteApiDialogProps {
  apiId: string | null;
  open: boolean;
  onClose: () => void;
}

export function ExecuteApiDialog({
  apiId,
  open,
  onClose,
}: ExecuteApiDialogProps) {
  const [requestBody, setRequestBody] = useState(
    JSON.stringify(
      {
        parameters: {},
      },
      null,
      2
    )
  );

  const [response, setResponse] = useState('');
  const [executing, setExecuting] = useState(false);

  // Clear response whenever the dialog is closed
  useEffect(() => {
    if (!open) {
      setResponse('');
    }
  }, [open]);

  if (!open) return null;

  const handleClose = () => {
    setResponse('');
    onClose();
  };

  const executeApi = async () => {
    if (!apiId) return;

    try {
      setExecuting(true);

      const res = await fetch(
        `https://localhost:7162/api/ExternalAPI/${apiId}/execute`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: requestBody,
        }
      );

      const json = await res.json();

      setResponse(JSON.stringify(json, null, 2));
    } catch (err) {
      setResponse(String(err));
    } finally {
      setExecuting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-[800px] rounded-lg border border-border bg-card p-6 shadow-xl text-card-foreground">

        <h2 className="mb-4 text-2xl font-bold">
          Execute API
        </h2>

        <textarea
          className="h-64 w-full rounded-md border border-border bg-background p-3 font-mono text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          value={requestBody}
          onChange={(e) => setRequestBody(e.target.value)}
        />

        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={handleClose}>
            Close
          </Button>

          <Button onClick={executeApi} disabled={executing}>
            {executing ? 'Executing...' : 'Execute'}
          </Button>
        </div>

        {response && (
          <div className="mt-6">
            <h3 className="mb-2 text-lg font-semibold">
              Response
            </h3>

            <pre className="max-h-80 overflow-y-auto overflow-x-auto rounded-md border border-border bg-muted p-4 text-sm text-foreground whitespace-pre-wrap">
              {response}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}