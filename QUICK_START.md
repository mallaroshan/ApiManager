# Quick Start Guide - API Manager

## 30-Second Overview

This is a React/Next.js app for managing API configurations. It:
- ✅ Fetches all APIs from your backend
- ✅ Shows detailed API configuration
- ✅ Lets you create new API configurations with a form

**Backend API Base URL**: `https://localhost:7162/api`

---

## Three Main Views

### 1. 📋 List View (Default)
Shows all configured APIs in cards with:
- API name and endpoint
- HTTP method (GET, POST, etc.)
- Authentication type
- Active/Inactive status

**Action**: Click any API to view details or click "+ Add New API" to create one

### 2. 🔍 Detail View
Shows complete configuration for selected API:
- Endpoint URL
- HTTP method and content type
- All headers (secrets are masked)
- Request parameters with JSON paths
- Response parameters with JSON paths
- Timeout settings

**Action**: Click "← Back to List" to return

### 3. ➕ Form View
Create new API configuration with:

**Required Fields:**
- API Name
- Base URL
- Endpoint Path

**Optional Fields:**
- HTTP Method (defaults to GET)
- Authentication (None, API Key, Bearer Token, Basic Auth, OAuth2)
- Custom Headers
- Request Parameters
- Response Parameters

**Action**: Fill form and click "Create API Configuration"

---

## API Endpoints Used

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/APIConfiguration` | Get all APIs |
| GET | `/api/APIConfiguration/{id}` | Get specific API |
| POST | `/api/APIConfiguration` | Create new API |

---

## Form Field Reference

### Basic Configuration
- **API Name**: Display name for the configuration
- **Base URL**: Starting URL (e.g., `https://api.example.com`)
- **Endpoint Path**: Path to append (e.g., `/users`)
- **HTTP Method**: GET, POST, PUT, DELETE, PATCH, HEAD, OPTIONS
- **Empty Body**: Checkbox if request has no body

### Authentication Types

| Type | Fields |
|------|--------|
| None | No fields |
| API Key | Header Name, API Key |
| Bearer Token | Token value |
| Basic Auth | Username, Password |
| OAuth2 | Token URL, Client ID, Client Secret, Scope |

### Headers
- **Header Name**: e.g., `X-API-Key`, `Authorization`
- **Header Value**: The header value
- **Mark as Secret**: Hide value in UI

### Parameters
- **Name**: Parameter display name
- **JSON Path**: Path in JSON (e.g., `$.id`, `$.user.email`)
- **Data Type**: string, number, boolean, integer, array, object
- **Required**: (Request params only) Mark if required
- **Default Value**: (Request params only) Optional default

---

## Common Examples

### Example 1: Simple GET API with Bearer Token
```
Name: Weather API
Base URL: https://api.openweathermap.org
Endpoint: /data/2.5/weather
Method: GET
Auth Type: Bearer Token
Token: your-api-key-here

Request Params:
  - name: city
    jsonPath: $.city
    dataType: string
    required: true
```

### Example 2: POST API with API Key
```
Name: Create User
Base URL: https://api.example.com
Endpoint: /users
Method: POST
Auth Type: API Key
  Header Name: X-API-Key
  API Key: your-key-123

Headers:
  - Content-Type: application/json

Request Params:
  - name: userId
    jsonPath: $.id
    dataType: string
    required: true
  - name: userName
    jsonPath: $.name
    dataType: string
    required: true

Response Params:
  - name: createdId
    jsonPath: $.data.id
    dataType: string
```

---

## Tips & Tricks

### JSON Paths
- `$.fieldName` → Root level field
- `$.user.name` → Nested field
- `$.items[0]` → First array item
- `$.items[*].id` → All IDs in array

### Data Types
- Use `string` for text
- Use `number` for decimals
- Use `integer` for whole numbers
- Use `boolean` for true/false
- Use `array` for lists
- Use `object` for complex data

### Security
- Mark sensitive data (API keys, tokens) as "Secret"
- Secrets are masked with `•••••••` in the detail view
- Never commit real API keys to version control

### Validation
- All fields in forms are validated on submit
- Required fields are marked with `*`
- JSON paths should follow JSONPath syntax
- Base URL should include protocol (http/https)

---

## Troubleshooting

**"Failed to fetch APIs"**
- Make sure backend is running at `https://localhost:7162/api`
- Check your internet connection
- Verify CORS is enabled on backend

**Form won't submit**
- Check for red validation messages
- Ensure all `*` marked fields are filled
- Verify JSON paths are valid

**Can't see API details**
- Make sure you clicked on an API card
- Check browser console for errors
- Try refreshing the page

---

## File Structure

```
components/
  ├── api-list.tsx       # List all APIs
  ├── api-detail.tsx     # Show API details
  └── api-form.tsx       # Form to add API

lib/
  └── api-client.ts      # API communication layer

app/
  ├── page.tsx           # Main app component
  └── layout.tsx         # Root layout
```

---

## Next Steps

1. Start the dev server: `npm run dev`
2. Open `http://localhost:3000`
3. Try viewing existing APIs or creating a new one
4. Check the README.md for more detailed documentation

Happy API managing! 🚀
