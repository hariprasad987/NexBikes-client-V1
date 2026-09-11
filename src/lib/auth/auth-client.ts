const apiBaseUrl = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://172.17.7.225:5000").replace(
  /\/$/,
  "",
);

const ACCESS_TOKEN_KEY = "nexbikes.access-token";
const REFRESH_TOKEN_KEY = "nexbikes.refresh-token";
const USER_KEY = "nexbikes.user";
const AUTH_CHANGE_EVENT = "nexbikes-auth-change";

export type AuthUser = {
  email: string;
  firstName: string;
  lastName: string;
  name: string;
};

type LoginResponse = {
  accessToken?: string;
  access_token?: string;
  firstName?: string;
  lastName?: string;
  message?: string;
  refreshToken?: string;
  status?: string;
};

type RefreshResponse = {
  accessToken?: string;
  access_token?: string;
  message?: string;
  status?: string;
};

type ForgotPasswordResponse = {
  message?: string;
  status?: string;
};

type ResetPasswordResponse = {
  message?: string;
  status?: string;
};

type VerifyTokenResponse = {
  email?: string;
  is_verified?: boolean;
  message?: string;
  name?: string;
  status?: string;
};

type ApiErrorPayload = {
  message?: string;
  status?: string;
};

export class AuthApiError extends Error {
  readonly statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = "AuthApiError";
    this.statusCode = statusCode;
  }
}

function isApiErrorPayload(value: unknown): value is ApiErrorPayload {
  return typeof value === "object" && value !== null;
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${apiBaseUrl}${path}`, {
      ...init,
      headers: {
        Accept: "application/json",
        ...(init.body ? { "Content-Type": "application/json" } : {}),
        ...init.headers,
      },
    });
  } catch {
    throw new AuthApiError("Unable to connect to NexBikes. Please try again.", 0);
  }

  let payload: unknown;

  try {
    payload = await response.json();
  } catch {
    payload = undefined;
  }

  if (!response.ok || (isApiErrorPayload(payload) && payload.status === "error")) {
    const message =
      isApiErrorPayload(payload) && typeof payload.message === "string"
        ? payload.message
        : "Something went wrong. Please try again.";

    throw new AuthApiError(message, response.status);
  }

  return payload as T;
}

function notifyAuthChange() {
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
}

function getStoredValue(key: string) {
  return window.localStorage.getItem(key);
}

export function getAccessToken() {
  if (typeof window === "undefined") return null;

  return getStoredValue(ACCESS_TOKEN_KEY);
}

export function getRefreshToken() {
  if (typeof window === "undefined") return null;

  return getStoredValue(REFRESH_TOKEN_KEY);
}

export function getStoredUser(): AuthUser | null {
  if (typeof window === "undefined") return null;

  const value = getStoredValue(USER_KEY);

  if (!value) return null;

  try {
    return JSON.parse(value) as AuthUser;
  } catch {
    return null;
  }
}

export function storeAuthSession({
  accessToken,
  email,
  firstName,
  lastName,
  refreshToken,
}: {
  accessToken: string;
  email: string;
  firstName?: string;
  lastName?: string;
  refreshToken: string;
}) {
  const name = [firstName, lastName].filter(Boolean).join(" ").trim();
  const user: AuthUser = {
    email,
    firstName: firstName ?? "",
    lastName: lastName ?? "",
    name: name || email,
  };

  window.localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  window.localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  window.localStorage.setItem(USER_KEY, JSON.stringify(user));
  notifyAuthChange();
}

export function storeAccessToken(accessToken: string) {
  window.localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  notifyAuthChange();
}

export function clearAuthSession() {
  if (typeof window === "undefined") return;

  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  window.localStorage.removeItem(REFRESH_TOKEN_KEY);
  window.localStorage.removeItem(USER_KEY);
  notifyAuthChange();
}

export function subscribeToAuthChanges(listener: () => void) {
  if (typeof window === "undefined") return () => undefined;

  window.addEventListener(AUTH_CHANGE_EVENT, listener);
  window.addEventListener("storage", listener);

  return () => {
    window.removeEventListener(AUTH_CHANGE_EVENT, listener);
    window.removeEventListener("storage", listener);
  };
}

export async function login(email: string, password: string) {
  const response = await request<LoginResponse>("/api/users/login", {
    body: JSON.stringify({ email, password }),
    method: "POST",
  });
  const accessToken = response.accessToken ?? response.access_token;

  if (!accessToken || !response.refreshToken) {
    throw new AuthApiError("Login response did not include the required tokens.", 500);
  }

  return {
    accessToken,
    firstName: response.firstName,
    lastName: response.lastName,
    refreshToken: response.refreshToken,
  };
}

export async function forgotPassword(email: string) {
  return request<ForgotPasswordResponse>("/api/users/forgot-password", {
    body: JSON.stringify({ email }),
    method: "POST",
  });
}

export async function resetPassword(token: string, password: string) {
  return request<ResetPasswordResponse>("/api/users/reset-password", {
    body: JSON.stringify({ password, token }),
    method: "POST",
  });
}

export async function verifyAccessToken(accessToken: string) {
  return request<VerifyTokenResponse>("/api/users/verify-token", {
    headers: { Authorization: `Bearer ${accessToken}` },
    method: "GET",
  });
}

export async function refreshAccessToken(refreshToken: string) {
  const response = await request<RefreshResponse>("/api/users/refresh-token", {
    body: JSON.stringify({ refreshToken }),
    method: "POST",
  });
  const accessToken = response.accessToken ?? response.access_token;

  if (!accessToken) {
    throw new AuthApiError("Refresh response did not include an access token.", 500);
  }

  return accessToken;
}

export async function logout(refreshToken: string | null) {
  if (!refreshToken) return;

  await request("/api/users/logout", {
    body: JSON.stringify({ refreshToken }),
    method: "POST",
  });
}

export async function authenticatedFetch(input: RequestInfo | URL, init: RequestInit = {}) {
  const accessToken = getAccessToken();

  if (!accessToken) {
    throw new AuthApiError("Access token required", 401);
  }

  const makeRequest = (token: string) => {
    const headers = new Headers(init.headers);
    headers.set("Authorization", `Bearer ${token}`);
    const requestInput =
      typeof input === "string" && input.startsWith("/") ? `${apiBaseUrl}${input}` : input;

    return fetch(requestInput, { ...init, headers });
  };

  let response = await makeRequest(accessToken);

  if (response.status !== 403) return response;

  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    clearAuthSession();
    throw new AuthApiError("Refresh token expired", 403);
  }

  try {
    const nextAccessToken = await refreshAccessToken(refreshToken);
    storeAccessToken(nextAccessToken);
    response = await makeRequest(nextAccessToken);

    if (response.status === 403) {
      clearAuthSession();
      throw new AuthApiError("Invalid or expired access token", 403);
    }
  } catch (error) {
    clearAuthSession();
    throw error;
  }

  return response;
}
