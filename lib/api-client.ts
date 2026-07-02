const API_BASE_URL = 'https://localhost:7162/api';

// Types based on the API specification
export interface ApiAuthenticationDto {
  authenticationType: number;
  apiKeyHeaderName?: string | null;
  apiKey?: string | null;
  bearerToken?: string | null;
  username?: string | null;
  password?: string | null;
  tokenUrl?: string | null;
  clientId?: string | null;
  clientSecret?: string | null;
  scope?: string | null;
}

export interface ApiHeaderDto {
  headerName: string;
  headerValue: string;
  isSecret: boolean;
}

export interface RequestParameterDto {
  name: string;
  jsonPath: string;
  dataType: string;
  isRequired: boolean;
  defaultValue?: string | null;
}

export interface ResponseParameterDto {
  name: string;
  jsonPath: string;
  dataType: string;
}

export interface SaveExternalApiDto {
  name: string;
  baseUrl: string;
  endpoint: string;
  method: number; // HttpMethodType
  isEmptyBody: boolean;
  apiAuthentication: ApiAuthenticationDto;
  headers: ApiHeaderDto[];
  requestParameters: RequestParameterDto[];
  responseParameters: ResponseParameterDto[];
}

export interface ExternalApiListDto {
  id: string;
  name: string;
  baseUrl: string;
  endpoint: string;
  method: number;
  authenticationType: number;
  isActive: boolean;
}

export interface ExternalApiDetailDto extends ExternalApiListDto {
  contentType: string;
  timeoutInSeconds: number;
  apiAuthentication: ApiAuthenticationDto;
  headers: ApiHeaderDto[];
  requestParameters: RequestParameterDto[];
  responseParameters: ResponseParameterDto[];
}

// API Client Functions
export const apiClient = {
  async getAllApis(): Promise<ExternalApiListDto[]> {
    const response = await fetch(`${API_BASE_URL}/APIConfiguration`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch APIs: ${response.statusText}`);
    }

    return response.json();
  },

  async getApiById(id: string): Promise<ExternalApiDetailDto> {
    const response = await fetch(`${API_BASE_URL}/APIConfiguration/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch API: ${response.statusText}`);
    }

    return response.json();
  },

  async createApi(data: SaveExternalApiDto): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/APIConfiguration`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to create API: ${response.statusText}`);
    }
  },
};
