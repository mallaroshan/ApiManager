# Application Flow Diagram

## User Navigation Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    START APP (localhost:3000)               │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
        ┌─────────────────────────────┐
        │   📋 LIST VIEW (Default)    │
        │  Shows all APIs from backend│
        │                             │
        │  ┌──────────────────────┐   │
        │  │ API 1 - GET /users   │   │
        │  │ Auth: Bearer Token   │   │
        │  └──────────────────────┘   │
        │  ┌──────────────────────┐   │
        │  │ API 2 - POST /data   │   │
        │  │ Auth: API Key        │   │
        │  └──────────────────────┘   │
        │  ┌──────────────────────┐   │
        │  │ + Add New API Button │   │
        │  └──────────────────────┘   │
        └────┬──────────────────┬─────┘
             │                  │
      (click API)         (click + Add)
             │                  │
             ▼                  ▼
    ┌─────────────────┐   ┌──────────────────┐
    │  🔍 DETAIL VIEW │   │  ➕ FORM VIEW    │
    │                 │   │                  │
    │ • API Name      │   │ Name: ________   │
    │ • URL           │   │ Base URL: ___    │
    │ • Method        │   │ Endpoint: ___    │
    │ • Auth Type     │   │ Method: [GET ▼]  │
    │ • Headers       │   │                  │
    │ • Params        │   │ Auth Type:       │
    │ • Timeout       │   │ [None ▼]         │
    │                 │   │                  │
    │ ← Back Button   │   │ Headers:         │
    │                 │   │ [+ Add Header]   │
    │                 │   │                  │
    │                 │   │ Request Params:  │
    │                 │   │ [+ Add Param]    │
    │                 │   │                  │
    │                 │   │ Response Params: │
    │                 │   │ [+ Add Param]    │
    │                 │   │                  │
    │                 │   │ [Cancel][Create] │
    └────────┬────────┘   └────────┬─────────┘
             │ (back)             │ (cancel)
             │        ┌──────────┘
             │        │
             │    (success)
             │        │
             └────┬───┘
                  │
                  ▼
        ┌─────────────────────────────┐
        │   📋 LIST VIEW (Refreshed)  │
        │  Shows all APIs INCLUDING   │
        │  newly created API          │
        └─────────────────────────────┘
```

---

## API Communication Flow

```
                    React App
                   (localhost:3000)
                         │
                         │
        ┌────────────────┼────────────────┐
        │                │                │
        ▼                ▼                ▼
   ┌─────────┐    ┌─────────┐    ┌──────────────┐
   │GET All  │    │GET By ID│    │CREATE New    │
   │  APIs   │    │  API    │    │  API         │
   └────┬────┘    └────┬────┘    └──────┬───────┘
        │              │                │
        │              │                │
        ▼              ▼                ▼
   [GET /api/     [GET /api/         [POST /api/
    APIConfig    APIConfig/{id}      APIConfig]
    ]             ]                   
        │              │                │
        │              │                │
        └──────────────┼────────────────┘
                       │
                       ▼
    ┌─────────────────────────────────┐
    │   Backend API                   │
    │   https://localhost:7162/api    │
    └─────────────────────────────────┘
```

---

## Data Flow: Creating New API

```
User fills Form
    │
    ▼
Form Validation
    │
    ├─ All required fields present? ✓
    ├─ Valid URLs? ✓
    ├─ JSON paths valid? ✓
    │
    ▼
Create Payload
┌─────────────────────────────────────┐
│ SaveExternalApiDto {                │
│   name, baseUrl, endpoint, method,  │
│   apiAuthentication, headers,       │
│   requestParameters,                │
│   responseParameters                │
│ }                                   │
└─────────────────────────────────────┘
    │
    ▼
POST to Backend
    │
    ▼
Backend Validates
    │
    ├─ Store in Database
    │
    ▼
Return 200 OK
    │
    ▼
Show Success
    │
    ▼
Refresh List View
    │
    ▼
New API appears in List
```

---

## Component Structure

```
app/page.tsx (Main Container)
    │
    ├─── State Management ───┐
    │    • view (list|detail|form)
    │    • selectedApiId
    │
    ├─ Condition: view === 'list'
    │  │
    │  └─> <ApiList>
    │       ├─ Fetch: getAllApis()
    │       ├─ Display: API cards
    │       ├─ Props:
    │       │  • onSelectApi → sets selectedApiId, view='detail'
    │       │  • onAddNew → sets view='form'
    │       │
    │       └─ External API
    │          GET /APIConfiguration
    │
    ├─ Condition: view === 'detail' && selectedApiId
    │  │
    │  └─> <ApiDetail>
    │       ├─ Fetch: getApiById(selectedApiId)
    │       ├─ Display: Full configuration
    │       ├─ Props:
    │       │  • apiId
    │       │  • onBack → sets view='list'
    │       │
    │       └─ External API
    │          GET /APIConfiguration/{id}
    │
    └─ Condition: view === 'form'
       │
       └─> <ApiForm>
            ├─ Fields:
            │  • Basic: name, baseUrl, endpoint, method
            │  • Auth: type + credentials
            │  • Headers: add/remove
            │  • Request Params: add/remove
            │  • Response Params: add/remove
            │
            ├─ Props:
            │  • onSuccess → sets view='list'
            │  • onCancel → sets view='list'
            │
            └─ External API
               POST /APIConfiguration
```

---

## Authentication Flow in Form

```
User selects Auth Type
    │
    ▼
Type === None?
    ├─ Yes → Show no additional fields
    │
    └─ No
        ▼
    Type === API Key?
        ├─ Yes → Show:
        │        • apiKeyHeaderName
        │        • apiKey (password field)
        │
        └─ No
            ▼
        Type === Bearer Token?
            ├─ Yes → Show:
            │        • bearerToken (password field)
            │
            └─ No
                ▼
            Type === Basic Auth?
                ├─ Yes → Show:
                │        • username
                │        • password
                │
                └─ No
                    ▼
                Type === OAuth2?
                    └─ Yes → Show:
                             • tokenUrl
                             • clientId
                             • clientSecret
                             • scope

User submits form
    │
    ▼
Build ApiAuthenticationDto
with selected type and fields
    │
    ▼
Include in SaveExternalApiDto
    │
    ▼
Send to Backend
```

---

## List View: Data Display

```
GET /api/APIConfiguration
    │
    ▼
Returns: ExternalApiListDto[]
┌────────────────────────────────┐
│ [                              │
│   {                            │
│     id: "uuid",                │
│     name: "User API",          │
│     baseUrl: "https://...",    │
│     endpoint: "/users",        │
│     method: 0,                 │
│     authenticationType: 2,     │
│     isActive: true             │
│   },                           │
│   { ... more APIs ... }        │
│ ]                              │
└────────────────────────────────┘
    │
    ▼
Loop through each API
    │
    ├─ name           → Title
    ├─ baseUrl        → Description line 1
    ├─ endpoint       → Description line 1
    ├─ method         → Badge 1 (GET/POST/etc)
    ├─ authType       → Badge 2 (None/ApiKey/Bearer/etc)
    └─ isActive       → Indicator dot (green/gray)
    │
    ▼
Display API Card
    │
    Click → ApiDetail view
```

---

## Detail View: Data Display

```
GET /api/APIConfiguration/{id}
    │
    ▼
Returns: ExternalApiDetailDto
┌──────────────────────────────────┐
│ {                                │
│   id, name, baseUrl, endpoint,   │
│   method, authenticationType,    │
│   contentType, timeoutInSeconds, │
│   isActive,                      │
│   apiAuthentication: {...},      │
│   headers: [{...}, {...}],       │
│   requestParameters: [{...}],    │
│   responseParameters: [{...}]    │
│ }                                │
└──────────────────────────────────┘
    │
    ├─ Endpoint Section
    │  ├─ name → Heading
    │  ├─ baseUrl → Display
    │  ├─ endpoint → Display
    │  ├─ baseUrl + endpoint → Full URL
    │  ├─ contentType → Display
    │  └─ timeoutInSeconds → Display
    │
    ├─ Headers Section (if any)
    │  └─ Table:
    │     ├─ headerName
    │     ├─ headerValue (masked if isSecret)
    │     └─ isSecret → Indicator
    │
    ├─ Request Params Section (if any)
    │  └─ Table:
    │     ├─ name
    │     ├─ jsonPath
    │     ├─ dataType → Badge
    │     ├─ isRequired → Indicator
    │     └─ defaultValue
    │
    └─ Response Params Section (if any)
       └─ Table:
          ├─ name
          ├─ jsonPath
          └─ dataType → Badge
```

---

## Error Handling Flow

```
API Call
    │
    ├─ Success (200)
    │  │
    │  └─ Show Data
    │
    └─ Error
       │
       ├─ Network Error
       │  └─ Show: "Network error"
       │
       └─ HTTP Error
          ├─ 400 Bad Request
          │  └─ Show: "Invalid request"
          │
          ├─ 404 Not Found
          │  └─ Show: "API not found"
          │
          ├─ 500 Server Error
          │  └─ Show: "Server error"
          │
          └─ Other
             └─ Show: Generic error message
```

---

## State Management

```
page.tsx maintains:

┌──────────────────────────────────┐
│  view: 'list' | 'detail' | 'form'│
│  Controls which component shows  │
│  Default: 'list'                 │
└──────────────────────────────────┘
         │
         ├─ setState('list')   → Show ApiList
         ├─ setState('detail') → Show ApiDetail
         └─ setState('form')   → Show ApiForm

┌──────────────────────────────────┐
│  selectedApiId: string | null    │
│  Stores selected API for detail  │
│  Default: null                   │
└──────────────────────────────────┘
         │
         ├─ setSelectedApiId(id) when clicking API
         └─ setSelectedApiId(null) when going back

Each Component has:
    • Local state for form fields (ApiForm)
    • Loading state (isLoading)
    • Error state (error)
```

---

## Key Functions

```
apiClient.getAllApis()
    │
    └─> GET /api/APIConfiguration
        Returns: ExternalApiListDto[]

apiClient.getApiById(id)
    │
    └─> GET /api/APIConfiguration/{id}
        Returns: ExternalApiDetailDto

apiClient.createApi(data)
    │
    └─> POST /api/APIConfiguration
        Body: SaveExternalApiDto
        Returns: 200 OK
```

---

## Rendering Logic

```
render() {
    return (
        <main>
            <div className="container">
                <h1>API Manager</h1>

                {view === 'list' && (
                    <ApiList 
                        onSelectApi={handleSelectApi}
                        onAddNew={handleAddNew}
                    />
                )}

                {view === 'detail' && selectedApiId && (
                    <ApiDetail 
                        apiId={selectedApiId}
                        onBack={handleBackToList}
                    />
                )}

                {view === 'form' && (
                    <ApiForm 
                        onSuccess={handleFormSuccess}
                        onCancel={handleBackToList}
                    />
                )}
            </div>
        </main>
    )
}
```

---

**This diagram shows the complete flow of the API Manager application!**
