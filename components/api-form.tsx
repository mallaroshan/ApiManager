'use client';

import { useState } from 'react';
import {
  apiClient,
  SaveExternalApiDto,
  ApiAuthenticationDto,
  ApiHeaderDto,
  RequestParameterDto,
  ResponseParameterDto,
} from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface ApiFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const HTTP_METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'];
const AUTH_TYPES = ['None', 'API Key', 'Bearer Token', 'Basic Auth', 'OAuth2'];
const DATA_TYPES = ['string', 'number', 'boolean', 'integer', 'array', 'object'];


export function ApiForm({ onSuccess, onCancel }: ApiFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Basic Configuration
  const [name, setName] = useState('');
  const [baseUrl, setBaseUrl] = useState('https://api.example.com');
  const [endpoint, setEndpoint] = useState('/users');
  const [method, setMethod] = useState('0'); // GET
  const [isEmptyBody, setIsEmptyBody] = useState(false);

  // Authentication
  const [authType, setAuthType] = useState('0'); // None
  const [apiKeyHeaderName, setApiKeyHeaderName] = useState('');
  const [authentications, setAuthentications] = useState<ApiAuthenticationDto[]>([]);
  console.log("authentications", authentications)
  const [apiKey, setApiKey] = useState('');
  const [bearerToken, setBearerToken] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [credentials, setCredentials] = useState<
    { key: string; value: string; isSecret: boolean }[]
  >([]);
  console.log("apiKeyHeaderName", apiKeyHeaderName)
  const addCredential = () => {
    const newAuth: ApiAuthenticationDto = {
      // authenticationType: parseInt(authType),
      apiKeyHeaderName: apiKeyHeaderName,
      apiKey,
      // bearerToken,
      // username,
      // password,
    };

    setAuthentications((current) => [...current, newAuth]);
    setApiKeyHeaderName('');
    setApiKey('');
  };

  // Headers
  const [headers, setHeaders] = useState<ApiHeaderDto[]>([]);
  const [headerName, setHeaderName] = useState('');
  const [headerValue, setHeaderValue] = useState('');
  const [isHeaderSecret, setIsHeaderSecret] = useState(false);

  // Request Parameters
  const [requestParams, setRequestParams] = useState<RequestParameterDto[]>([]);
  const [paramName, setParamName] = useState('');
  const [paramJsonPath, setParamJsonPath] = useState('');
  const [paramDataType, setParamDataType] = useState('string');
  const [paramIsRequired, setParamIsRequired] = useState(false);

  // Response Parameters
  const [responseParams, setResponseParams] = useState<ResponseParameterDto[]>([]);
  const [respParamName, setRespParamName] = useState('');
  const [respParamJsonPath, setRespParamJsonPath] = useState('');
  const [respParamDataType, setRespParamDataType] = useState('string');

  const addHeader = () => {
    if (!headerName || !headerValue) {
      setError('Header name and value are required');
      return;
    }
    setHeaders([...headers, { headerName, headerValue, isSecret: isHeaderSecret }]);
    setHeaderName('');
    setHeaderValue('');
    setIsHeaderSecret(false);
  };

  const removeHeader = (idx: number) => {
    setHeaders(headers.filter((_, i) => i !== idx));
  };

  const addRequestParam = () => {
    if (!paramName || !paramJsonPath) {
      setError('Parameter name and JSON path are required');
      return;
    }
    setRequestParams([
      ...requestParams,
      { name: paramName, jsonPath: paramJsonPath, dataType: paramDataType, isRequired: paramIsRequired },
    ]);
    setParamName('');
    setParamJsonPath('');
    setParamDataType('string');
    setParamIsRequired(false);
  };

  const removeRequestParam = (idx: number) => {
    setRequestParams(requestParams.filter((_, i) => i !== idx));
  };

  const addResponseParam = () => {
    if (!respParamName || !respParamJsonPath) {
      setError('Response parameter name and JSON path are required');
      return;
    }
    setResponseParams([
      ...responseParams,
      { name: respParamName, jsonPath: respParamJsonPath, dataType: respParamDataType },
    ]);
    setRespParamName('');
    setRespParamJsonPath('');
    setRespParamDataType('string');
  };

  const removeResponseParam = (idx: number) => {
    setResponseParams(responseParams.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name || !baseUrl || !endpoint) {
      setError('Name, Base URL, and Endpoint are required');
      return;
    }

    const authentication: ApiAuthenticationDto = {
      authenticationType: parseInt(authType),
      apiKeyHeaderName: authType === '1' ? apiKeyHeaderName : undefined,
      apiKey: authType === '1' ? apiKey : undefined,
      bearerToken: authType === '2' ? bearerToken : undefined,
      username: authType === '3' ? username : undefined,
      password: authType === '3' ? password : undefined,
    };

    const payload: SaveExternalApiDto = {
      name,
      baseUrl,
      endpoint,
      method: parseInt(method),
      isEmptyBody,
      apiAuthentication: authentication,
      headers,
      requestParameters: requestParams,
      responseParameters: responseParams,
       credentials: authentications.map((item)=>({
        key: item.apiKeyHeaderName || '',
        value: item.apiKey || '',
        isSecret: false
       })),
  //       credentials: [
  //   {
  //     "key": "",
  //     "value": "",
  //     "isSecret": true
  //   }
  // ],
    };

    try {
      setLoading(true);
      await apiClient.createApi(payload);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create API');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Add New API Configuration</h2>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">
          <p className="font-semibold">Error</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Basic Configuration */}
      <fieldset className="rounded-lg border border-border bg-card p-4 space-y-4">
        <legend className="text-lg font-semibold px-2">Basic Configuration</legend>

        <div>
          <label className="block text-sm font-medium mb-1">API Name *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., User Management API"
            className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Base URL *</label>
            <input
              type="url"
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              placeholder="https://api.example.com"
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Endpoint Path *</label>
            <input
              type="text"
              value={endpoint}
              onChange={(e) => setEndpoint(e.target.value)}
              placeholder="/users"
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">HTTP Method</label>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {HTTP_METHODS.map((m, idx) => (
                <option key={idx} value={idx}>
                  {m}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <label className="flex items-center gap-2 cursor-pointer h-10">
              <input
                type="checkbox"
                checked={isEmptyBody}
                onChange={(e) => setIsEmptyBody(e.target.checked)}
                className="w-4 h-4 cursor-pointer"
              />
              <span className="text-sm font-medium">Empty Body</span>
            </label>
          </div>
        </div>
      </fieldset>

      {/* Authentication */}
      <fieldset className="rounded-lg border border-border bg-card p-4 space-y-4">
        <legend className="text-lg font-semibold px-2">Authentication</legend>

        <div>
          <label className="block text-sm font-medium mb-1">Authentication Type</label>
          <select
            value={authType}
            onChange={(e) => setAuthType(e.target.value)}
            className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {AUTH_TYPES.map((a, idx) => (
              <option key={idx} value={idx}>
                {a}
              </option>
            ))}
          </select>
        </div>

        {authType === '1' && (
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              value={apiKeyHeaderName}
              onChange={(e) => setApiKeyHeaderName(e.target.value)}
              placeholder="Header name (e.g., X-API-Key)"
              className="px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="API Key"
              className="px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        )}

        {authType === '2' && (
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-2">
              <input
                type="text"
                placeholder="Key (e.g. client_id)"
                className="px-3 py-2 border rounded-md"
                value={apiKeyHeaderName}
                onChange={(e) => setApiKeyHeaderName(e.target.value)}
              />
              <input
                type="text"
                placeholder="Value"
                className="px-3 py-2 border rounded-md"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
              <Button
                type="button"
                onClick={addCredential}
                variant="secondary"
                size="sm"
                className="ml-auto"
              >
                Add Bearer
              </Button>
            </div>
          </div>
        )}
            {authentications.length > 0 && (
          <div className="space-y-2 pt-4 border-t border-border">
            {authentications.map((h, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 bg-muted rounded">
                <span className="text-sm">
                  <span className="font-semibold">Key: {h.apiKeyHeaderName}:</span> Value:{h.apiKey }
                </span>
                {/* <Button
                  type="button"
                  onClick={() => removeHeader(idx)}
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                >
                  ✕
                </Button> */}
              </div>
            ))}
          </div>
        )}

        {authType === '3' && (
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        )}
      </fieldset>

      {/* Headers */}
      <fieldset className="rounded-lg border border-border bg-card p-4 space-y-4">
        <legend className="text-lg font-semibold px-2">Headers</legend>

        <div className="grid grid-cols-2 gap-3">
          <input
            type="text"
            value={headerName}
            onChange={(e) => setHeaderName(e.target.value)}
            placeholder="Header name"
            className="px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            type="text"
            value={headerValue}
            onChange={(e) => setHeaderValue(e.target.value)}
            placeholder="Header value"
            className="px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isHeaderSecret}
              onChange={(e) => setIsHeaderSecret(e.target.checked)}
              className="w-4 h-4 cursor-pointer"
            />
            <span className="text-sm">Mark as secret</span>
          </label>
          <Button
            type="button"
            onClick={addHeader}
            variant="secondary"
            size="sm"
            className="ml-auto"
          >
            Add Header
          </Button>
        </div>

        {headers.length > 0 && (
          <div className="space-y-2 pt-4 border-t border-border">
            {headers.map((h, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 bg-muted rounded">
                <span className="text-sm">
                  <span className="font-semibold">{h.headerName}:</span> {h.isSecret ? '••••••' : h.headerValue}
                </span>
                <Button
                  type="button"
                  onClick={() => removeHeader(idx)}
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                >
                  ✕
                </Button>
              </div>
            ))}
          </div>
        )}
      </fieldset>

      {/* Request Parameters */}
      <fieldset className="rounded-lg border border-border bg-card p-4 space-y-4">
        <legend className="text-lg font-semibold px-2">Request Parameters</legend>

        <div className="grid grid-cols-2 gap-3">
          <input
            type="text"
            value={paramName}
            onChange={(e) => setParamName(e.target.value)}
            placeholder="Parameter name"
            className="px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            type="text"
            value={paramJsonPath}
            onChange={(e) => setParamJsonPath(e.target.value)}
            placeholder="JSON path (e.g., $.id)"
            className="px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="grid grid-cols-3 gap-3 items-end">
          <select
            value={paramDataType}
            onChange={(e) => setParamDataType(e.target.value)}
            className="px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {DATA_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={paramIsRequired}
              onChange={(e) => setParamIsRequired(e.target.checked)}
              className="w-4 h-4 cursor-pointer"
            />
            <span className="text-sm">Required</span>
          </label>
          <Button
            type="button"
            onClick={addRequestParam}
            variant="secondary"
            size="sm"
          >
            Add Parameter
          </Button>
        </div>

        {requestParams.length > 0 && (
          <div className="space-y-2 pt-4 border-t border-border">
            {requestParams.map((p, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 bg-muted rounded">
                <span className="text-sm">
                  <span className="font-semibold">{p.name}</span> ({p.dataType})
                  {p.isRequired && <span className="ml-2 text-destructive">*</span>}
                </span>
                <Button
                  type="button"
                  onClick={() => removeRequestParam(idx)}
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                >
                  ✕
                </Button>
              </div>
            ))}
          </div>
        )}
      </fieldset>

      {/* Response Parameters */}
      <fieldset className="rounded-lg border border-border bg-card p-4 space-y-4">
        <legend className="text-lg font-semibold px-2">Response Parameters</legend>

        <div className="grid grid-cols-3 gap-3">
          <input
            type="text"
            value={respParamName}
            onChange={(e) => setRespParamName(e.target.value)}
            placeholder="Parameter name"
            className="px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            type="text"
            value={respParamJsonPath}
            onChange={(e) => setRespParamJsonPath(e.target.value)}
            placeholder="JSON path (e.g., $.data.id)"
            className="px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <select
            value={respParamDataType}
            onChange={(e) => setRespParamDataType(e.target.value)}
            className="px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {DATA_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <Button
          type="button"
          onClick={addResponseParam}
          variant="secondary"
          size="sm"
        >
          Add Response Parameter
        </Button>

        {responseParams.length > 0 && (
          <div className="space-y-2 pt-4 border-t border-border">
            {responseParams.map((p, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 bg-muted rounded">
                <span className="text-sm">
                  <span className="font-semibold">{p.name}</span> ({p.dataType})
                </span>
                <Button
                  type="button"
                  onClick={() => removeResponseParam(idx)}
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                >
                  ✕
                </Button>
              </div>
            ))}
          </div>
        )}
      </fieldset>

      {/* Submit Buttons */}
      <div className="flex gap-3 justify-end pt-4 border-t border-border">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading} className="gap-2">
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {loading ? 'Creating...' : 'Create API Configuration'}
        </Button>
      </div>
    </form>
  );
}
