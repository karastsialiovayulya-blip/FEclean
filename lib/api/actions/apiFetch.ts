import { success } from "zod";
import { getAuthTokenAction } from "../utils";

const API_BASE_URL = "http://localhost:8080";

async function getAuthToken() {
  if (typeof window === "undefined") {
    return false;
  } else {
    return await getAuthTokenAction();
  }
}

export interface IResponse<T> {
  pagination?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  data: T;
  error: string;
  message: string;
  ok: boolean;
  status: number;
}

interface RequestOption extends RequestInit {
  body?: any;
}

export async function apiFetch<T>(
  endpoint: string,
  options: RequestOption = {},
): Promise<IResponse<T>> {
  const { headers, body, ...restOptions } = options;
  const authCookie = await getAuthToken();

  const requestHeaders = new Headers({
    ...headers,
    Accept: "application/json",
    "ngrok-skip-browser-warning": "true",
  });

  if (!(body instanceof FormData)) {
    requestHeaders.append("Content-Type", "application/json");
  }

  if (authCookie) {
    requestHeaders.append("Cookie", authCookie);
  }

  if (authCookie) {
    requestHeaders.append("Authorization", `Bearer ${authCookie}`);
  }

  const request = new Request(`${API_BASE_URL}${endpoint}`, {
    ...restOptions,
    headers: requestHeaders,
    credentials: "include",
    body: body instanceof FormData ? body : JSON.stringify(body),
  });

  const response = await fetch(request);
  const data = await response.json();

  console.log(data);
  return { ...data, ok: response.ok, status: response.status };
}
