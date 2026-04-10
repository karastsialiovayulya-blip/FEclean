import { getAuthTokenAction } from "../utils";

const API_BASE_URL = "http://localhost:8080";

async function getAuthToken() {
  if (typeof window === "undefined") {
    return false;
  } else {
    return await getAuthTokenAction();
  }
}

type RequestOptions = RequestInit & {
  isFormData?: boolean;
};

export interface IResponse<T> {
  pagination?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  data: T;
  errors: string[];
  messages: string[];
  ok: boolean;
  status: number;
}

async function request(endpoint: string, options: RequestOptions = {}) {
  const { headers, isFormData, ...restOptions } = options;
  const authCookie = await getAuthToken();

  const requestHeaders = new Headers({
    ...headers,
    Accept: "application/json",
    "ngrok-skip-browser-warning": "true",
  });

  if (!isFormData) {
    requestHeaders.append("Content-Type", "application/json");
  }

  if (authCookie) {
    requestHeaders.append("Cookie", authCookie);
  }

  if (authCookie) {
    requestHeaders.append("Authorization", authCookie);
  }

  const request = new Request(`${API_BASE_URL}${endpoint}`, {
    ...restOptions,
    headers: requestHeaders,
    credentials: "include",
  });

  const response = await fetch(request);
  const data = await response.json();

  return { ...data, ok: response.ok, status: response.status };
}
