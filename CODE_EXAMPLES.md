# Code Examples - API Manager

## How to Use the API Client

### Example 1: Get All APIs

```typescript
import { apiClient } from '@/lib/api-client';

// Fetch all APIs
const apis = await apiClient.getAllApis();

// Result:
// [
//   {
//     id: "550e8400-e29b-41d4-a716-446655440000",
//     name: "User Management API",
//     baseUrl: "https://api.example.com",
//     endpoint: "/users",
//     method: 0,  // GET
//     authenticationType: 2,  // Bearer Token
//     isActive: true
//   },
//   ...
// ]

apis.forEach(api => {
  console.log(`${api.name}: ${api.baseUrl}${api.endpoint}`);
});
```

---

### Example 2: Get Single API by ID

```typescript
import { apiClient } from '@/lib/api-client';

const apiId = "550e8400-e29b-41d4-a716-446655440000";
const api = await apiClient.getApiById(apiId);

// Result:
// {
//   id: "550e8400-e29b-41d4-a716-446655440000",
//   name: "User Management API",
//   baseUrl: "https://api.example.com",
//   endpoint: "/users",
//   method: 0,  // GET
//   authenticationType: 2,  // Bearer Token
//   contentType: "application/json",
//   timeoutInSeconds: 30,
//   isActive: true,
//   apiAuthentication: {
//     authenticationType: 2,
//     bearerToken: "secret-token-here"
//   },
//   headers: [
//     {
//       headerName: "X-Custom-Header",
//       headerValue: "custom-value",
//       isSecret: false
//     }
//   ],
//   requestParameters: [
//     {
//       name: "userId",
//       jsonPath: "$.id",
//       dataType: "string",
//       isRequired: true
//     }
//   ],
//   responseParameters: [
//     {
//       name: "userName",
//       jsonPath: "$.data.name",
//       dataType: "string"
//     }
//   ]
// }

console.log(`API: ${api.name}`);
console.log(`Endpoint: ${api.baseUrl}${api.endpoint}`);
console.log(`Auth Type: ${api.authenticationType}`);
```

---

### Example 3: Create New API

```typescript
import { apiClient, SaveExternalApiDto } from '@/lib/api-client';

const newApi: SaveExternalApiDto = {
  name: "Weather API",
  baseUrl: "https://api.openweathermap.org",
  endpoint: "/data/2.5/weather",
  method: 0,  // GET
  isEmptyBody: true,
  
  apiAuthentication: {
    authenticationType: 1,  // API Key
    apiKeyHeaderName: "appid",
    apiKey: "your-api-key-here"
  },
  
  headers: [
    {
      headerName: "Accept",
      headerValue: "application/json",
      isSecret: false
    }
  ],
  
  requestParameters: [
    {
      name: "city",
      jsonPath: "$.q",
      dataType: "string",
      isRequired: true,
      defaultValue: "London"
    },
    {
      name: "units",
      jsonPath: "$.units",
      dataType: "string",
      isRequired: false,
      defaultValue: "metric"
    }
  ],
  
  responseParameters: [
    {
      name: "temperature",
      jsonPath: "$.main.temp",
      dataType: "number"
    },
    {
      name: "description",
      jsonPath: "$.weather[0].description",
      dataType: "string"
    },
    {
      name: "humidity",
      jsonPath: "$.main.humidity",
      dataType: "number"
    }
  ]
};

try {
  await apiClient.createApi(newApi);
  console.log("API created successfully!");
} catch (error) {
  console.error("Failed to create API:", error);
}
```

---

## Component Usage Examples

### Example 4: Using ApiList in Parent

```typescript
'use client';

import { useState } from 'react';
import { ApiList } from '@/components/api-list';

export function MyApiManager() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleSelectApi = (apiId: string) => {
    setSelectedId(apiId);
    console.log(`Selected API: ${apiId}`);
  };

  const handleAddNew = () => {
    console.log("Opening form to add new API");
  };

  return (
    <div>
      <h1>API Management</h1>
      <ApiList 
        onSelectApi={handleSelectApi}
        onAddNew={handleAddNew}
      />
    </div>
  );
}
```

---

### Example 5: Using ApiDetail in Parent

```typescript
'use client';

import { useState } from 'react';
import { ApiDetail } from '@/components/api-detail';

export function ApiViewer() {
  const [apiId] = useState("550e8400-e29b-41d4-a716-446655440000");

  const handleBack = () => {
    console.log("Going back to list");
  };

  return (
    <div>
      <ApiDetail 
        apiId={apiId}
        onBack={handleBack}
      />
    </div>
  );
}
```

---

### Example 6: Using ApiForm in Parent

```typescript
'use client';

import { ApiForm } from '@/components/api-form';

export function CreateApiModal() {
  const handleSuccess = () => {
    console.log("API created! Refreshing list...");
    // Trigger list refresh
  };

  const handleCancel = () => {
    console.log("Form cancelled");
  };

  return (
    <div className="modal">
      <ApiForm 
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
    </div>
  );
}
```

---

## Authentication Examples

### Example 7: API Key Authentication

```typescript
const apiKeyConfig: SaveExternalApiDto = {
  name: "GitHub API",
  baseUrl: "https://api.github.com",
  endpoint: "/user",
  method: 0,  // GET
  isEmptyBody: false,
  
  apiAuthentication: {
    authenticationType: 1,  // API Key
    apiKeyHeaderName: "Authorization",
    apiKey: "Bearer ghp_xxxxxxxxxxxxx"
  },
  
  headers: [],
  requestParameters: [],
  responseParameters: [
    {
      name: "username",
      jsonPath: "$.login",
      dataType: "string"
    }
  ]
};
```

---

### Example 8: Bearer Token Authentication

```typescript
const bearerTokenConfig: SaveExternalApiDto = {
  name: "Stripe API",
  baseUrl: "https://api.stripe.com",
  endpoint: "/v1/customers",
  method: 1,  // POST
  isEmptyBody: false,
  
  apiAuthentication: {
    authenticationType: 2,  // Bearer Token
    bearerToken: "sk_test_xxxxxxxxxxxxxxxx"
  },
  
  headers: [],
  requestParameters: [
    {
      name: "email",
      jsonPath: "$.email",
      dataType: "string",
      isRequired: true
    }
  ],
  responseParameters: [
    {
      name: "customerId",
      jsonPath: "$.id",
      dataType: "string"
    }
  ]
};
```

---

### Example 9: Basic Authentication

```typescript
const basicAuthConfig: SaveExternalApiDto = {
  name: "Database API",
  baseUrl: "https://db.example.com",
  endpoint: "/api/data",
  method: 0,  // GET
  isEmptyBody: true,
  
  apiAuthentication: {
    authenticationType: 3,  // Basic Auth
    username: "admin@example.com",
    password: "secure-password"
  },
  
  headers: [],
  requestParameters: [],
  responseParameters: [
    {
      name: "data",
      jsonPath: "$.records",
      dataType: "array"
    }
  ]
};
```

---

### Example 10: OAuth2 Configuration

```typescript
const oauth2Config: SaveExternalApiDto = {
  name: "Google API",
  baseUrl: "https://www.googleapis.com",
  endpoint: "/oauth2/v4/token",
  method: 1,  // POST
  isEmptyBody: false,
  
  apiAuthentication: {
    authenticationType: 4,  // OAuth2
    tokenUrl: "https://oauth2.googleapis.com/token",
    clientId: "your-client-id-here",
    clientSecret: "your-client-secret-here",
    scope: "openid profile email"
  },
  
  headers: [],
  requestParameters: [],
  responseParameters: [
    {
      name: "accessToken",
      jsonPath: "$.access_token",
      dataType: "string"
    }
  ]
};
```

---

## JSON Path Examples

### Example 11: Simple JSON Path

```
JSON Response:
{
  "id": 1,
  "name": "John",
  "email": "john@example.com"
}

Mappings:
- $.id       → 1
- $.name     → "John"
- $.email    → "john@example.com"
```

```typescript
const requestParams = [
  {
    name: "userId",
    jsonPath: "$.id",
    dataType: "number",
    isRequired: true
  }
];
```

---

### Example 12: Nested JSON Path

```
JSON Response:
{
  "user": {
    "profile": {
      "firstName": "John",
      "lastName": "Doe",
      "address": {
        "city": "New York",
        "zipCode": "10001"
      }
    }
  }
}

Mappings:
- $.user.profile.firstName        → "John"
- $.user.profile.lastName         → "Doe"
- $.user.profile.address.city     → "New York"
- $.user.profile.address.zipCode  → "10001"
```

```typescript
const responseParams = [
  {
    name: "firstName",
    jsonPath: "$.user.profile.firstName",
    dataType: "string"
  },
  {
    name: "city",
    jsonPath: "$.user.profile.address.city",
    dataType: "string"
  }
];
```

---

### Example 13: Array JSON Path

```
JSON Response:
{
  "items": [
    { "id": 1, "name": "Item 1" },
    { "id": 2, "name": "Item 2" },
    { "id": 3, "name": "Item 3" }
  ]
}

Mappings:
- $.items         → entire array
- $.items[0]      → { "id": 1, "name": "Item 1" }
- $.items[0].id   → 1
- $.items[*].id   → [1, 2, 3] (all ids)
```

```typescript
const responseParams = [
  {
    name: "firstItemId",
    jsonPath: "$.items[0].id",
    dataType: "number"
  },
  {
    name: "allItemIds",
    jsonPath: "$.items[*].id",
    dataType: "array"
  }
];
```

---

## Complete Workflow Example

### Example 14: Full API Creation Workflow

```typescript
'use client';

import { useState } from 'react';
import { apiClient, SaveExternalApiDto } from '@/lib/api-client';
import { Button } from '@/components/ui/button';

export function ApiCreationWorkflow() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const createSampleApi = async () => {
    try {
      setLoading(true);
      setMessage('Creating API...');

      // Step 1: Define the API configuration
      const newApi: SaveExternalApiDto = {
        name: "Sample REST API",
        baseUrl: "https://jsonplaceholder.typicode.com",
        endpoint: "/posts/{id}",
        method: 0,  // GET
        isEmptyBody: true,
        
        apiAuthentication: {
          authenticationType: 0  // None
        },
        
        headers: [
          {
            headerName: "Accept",
            headerValue: "application/json",
            isSecret: false
          }
        ],
        
        requestParameters: [
          {
            name: "postId",
            jsonPath: "$.id",
            dataType: "number",
            isRequired: true
          }
        ],
        
        responseParameters: [
          {
            name: "title",
            jsonPath: "$.title",
            dataType: "string"
          },
          {
            name: "body",
            jsonPath: "$.body",
            dataType: "string"
          },
          {
            name: "userId",
            jsonPath: "$.userId",
            dataType: "number"
          }
        ]
      };

      // Step 2: Send to backend
      await apiClient.createApi(newApi);
      setMessage('✅ API created successfully!');
      
      // Step 3: Fetch updated list
      const allApis = await apiClient.getAllApis();
      console.log('Current APIs:', allApis);
      
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      setMessage(`❌ Error: ${errorMsg}`);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <Button 
        onClick={createSampleApi} 
        disabled={loading}
      >
        {loading ? 'Creating...' : 'Create Sample API'}
      </Button>
      {message && <p className="mt-4">{message}</p>}
    </div>
  );
}
```

---

## Error Handling Examples

### Example 15: Handle API Errors

```typescript
import { apiClient } from '@/lib/api-client';

async function safeGetApi(apiId: string) {
  try {
    const api = await apiClient.getApiById(apiId);
    console.log('API found:', api.name);
    return api;
    
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      
      if (error.message.includes('404')) {
        console.error('API not found');
      } else if (error.message.includes('500')) {
        console.error('Server error');
      } else {
        console.error('Network error');
      }
    }
    return null;
  }
}
```

---

## Type Definition Examples

### Example 16: Type Safety with TypeScript

```typescript
import {
  SaveExternalApiDto,
  ExternalApiListDto,
  ExternalApiDetailDto,
  ApiAuthenticationDto,
  ApiHeaderDto,
  RequestParameterDto,
  ResponseParameterDto
} from '@/lib/api-client';

// This won't compile if the structure is wrong
const config: SaveExternalApiDto = {
  name: "My API",
  baseUrl: "https://api.example.com",
  endpoint: "/endpoint",
  method: 0,
  isEmptyBody: false,
  
  apiAuthentication: {
    authenticationType: 0
  },
  headers: [],
  requestParameters: [],
  responseParameters: []
};

// Type-safe iteration
const displayApis = (apis: ExternalApiListDto[]) => {
  apis.forEach(api => {
    console.log(api.name);      // ✓ Correct
    console.log(api.unknown);   // ✗ TypeScript Error
  });
};
```

---

**These examples show how to use every part of the API Manager application!**
