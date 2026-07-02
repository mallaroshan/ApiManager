# API Manager

A React-based API management application built with Next.js that allows you to view, manage, and create API configurations. The application connects to an external API backend running at `https://localhost:7162/api`.

## Features

✅ **View All APIs** - Display a list of all configured API endpoints with key details
✅ **Get API by ID** - View detailed information about a specific API configuration
✅ **Add New APIs** - Create new API configurations with a comprehensive form
✅ **Authentication Support** - Support for multiple authentication types (None, API Key, Bearer Token, Basic Auth, OAuth2)
✅ **Headers Management** - Add and manage custom headers for API requests
✅ **Parameters Mapping** - Configure request and response parameters with JSON paths and data types

## Getting Started

### Prerequisites
- Node.js 18+ installed
- The backend API running at `https://localhost:7162/api`

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:3000`

## Application Structure

### Components

#### `ApiList` (components/api-list.tsx)
Displays all configured APIs in a card-based layout with:
- API name and description
- Base URL and endpoint path
- HTTP method badge
- Authentication type badge
- Active/Inactive status
- Click to view details

#### `ApiDetail` (components/api-detail.tsx)
Shows comprehensive details for a selected API:
- Basic endpoint configuration (URL, method, timeout)
- Headers with secret masking
- Request parameters table
- Response parameters table
- Full configuration preview

#### `ApiForm` (components/api-form.tsx)
Form to create new API configurations with fields for:
- **Basic Configuration**: Name, Base URL, Endpoint, HTTP Method, Empty Body flag
- **Authentication**: Type selection and credentials based on auth type
- **Headers**: Add custom headers with optional secret marking
- **Request Parameters**: Define expected request parameters with JSON paths and data types
- **Response Parameters**: Map response fields with JSON paths and data types

### API Client

**File**: `lib/api-client.ts`

Provides TypeScript interfaces and functions for API communication:

```typescript
// Get all APIs
const apis = await apiClient.getAllApis();

// Get API by ID
const api = await apiClient.getApiById(apiId);

// Create new API
await apiClient.createApi(newApiConfiguration);
```

## API Configuration Data Structure

### SaveExternalApiDto (Create/Update)
```typescript
{
  name: string;                          // API configuration name
  baseUrl: string;                       // Base URL (e.g., https://api.example.com)
  endpoint: string;                      // Endpoint path (e.g., /users)
  method: number;                        // HTTP method (0=GET, 1=POST, 2=PUT, 3=DELETE, 4=PATCH, 5=HEAD, 6=OPTIONS)
  isEmptyBody: boolean;                  // Whether request has no body
  apiAuthentication: ApiAuthenticationDto;
  headers: ApiHeaderDto[];
  requestParameters: RequestParameterDto[];
  responseParameters: ResponseParameterDto[];
}
```

### ApiAuthenticationDto
```typescript
{
  authenticationType: number;            // 0=None, 1=API Key, 2=Bearer Token, 3=Basic Auth, 4=OAuth2
  apiKeyHeaderName?: string;             // For API Key auth
  apiKey?: string;                       // For API Key auth
  bearerToken?: string;                  // For Bearer Token auth
  username?: string;                     // For Basic Auth
  password?: string;                     // For Basic Auth
  tokenUrl?: string;                     // For OAuth2
  clientId?: string;                     // For OAuth2
  clientSecret?: string;                 // For OAuth2
  scope?: string;                        // For OAuth2
}
```

### ApiHeaderDto
```typescript
{
  headerName: string;                    // Header name (e.g., X-API-Key)
  headerValue: string;                   // Header value
  isSecret: boolean;                     // Whether to mask in UI
}
```

### RequestParameterDto
```typescript
{
  name: string;                          // Parameter name
  jsonPath: string;                      // JSON path (e.g., $.id)
  dataType: string;                      // Data type (string, number, boolean, integer, array, object)
  isRequired: boolean;                   // Whether parameter is required
  defaultValue?: string;                 // Optional default value
}
```

### ResponseParameterDto
```typescript
{
  name: string;                          // Parameter name
  jsonPath: string;                      // JSON path (e.g., $.data.id)
  dataType: string;                      // Data type
}
```

## Usage Guide

### Viewing APIs
1. The homepage displays all configured APIs
2. Each API card shows key information
3. Click on any API card to view its detailed configuration

### Adding a New API
1. Click the "+ Add New API" button
2. Fill in the basic configuration:
   - API Name (required)
   - Base URL (required)
   - Endpoint Path (required)
   - HTTP Method (defaults to GET)
3. Select authentication type and provide credentials if needed
4. Add custom headers (optional)
5. Configure request parameters (optional)
6. Configure response parameters (optional)
7. Click "Create API Configuration"

### Authentication Types

**None**
- No authentication required

**API Key**
- Provide header name (e.g., X-API-Key)
- Provide API key value

**Bearer Token**
- Provide the bearer token value

**Basic Auth**
- Provide username
- Provide password

**OAuth2**
- Token URL
- Client ID
- Client Secret
- Scope (optional)

## HTTP Methods

- `GET` - Retrieve data
- `POST` - Create new resource
- `PUT` - Replace entire resource
- `DELETE` - Remove resource
- `PATCH` - Partial update
- `HEAD` - Get headers only
- `OPTIONS` - Describe communication options

## Data Types Supported

- `string` - Text data
- `number` - Numeric values (float)
- `boolean` - True/False values
- `integer` - Whole numbers
- `array` - Array/list data
- `object` - Complex object data

## Building for Production

```bash
npm run build
npm start
```

## Environment Variables

The application connects to the API at `https://localhost:7162/api`. This is hardcoded in `lib/api-client.ts`. To change it, modify the `API_BASE_URL` constant.

## Common JSON Paths Examples

- `$.id` - Root-level id field
- `$.user.name` - Nested field
- `$.items[0].id` - Array first element
- `$.data[*].email` - All email fields in array

## Troubleshooting

### "Failed to fetch APIs" Error
- Ensure the backend API is running at `https://localhost:7162/api`
- Check CORS settings if running locally
- Verify network connectivity

### Headers Not Showing
- Some headers may be hidden if marked as secret
- Look for the secret indicator badge

### Parameters Not Saving
- Ensure all required fields are filled
- Verify JSON paths are correctly formatted
- Check data types are selected

## Technologies Used

- **Next.js 16** - React framework
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Styling
- **Lucide Icons** - Icon library
- **React 19** - UI library

## License

MIT

## Support

For issues or questions, please refer to the application or contact the development team.
