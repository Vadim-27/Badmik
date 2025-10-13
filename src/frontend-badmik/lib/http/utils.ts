// lib/http/utils.ts
import axios, { AxiosError, AxiosResponse } from "axios";

/**
 * Кастомна помилка, яку ми кидаємо з unwrap.
 * Містить HTTP-статус, сирий payload бека та оригінальну помилку.
 */
export class ApiError extends Error {
  status?: number;
  data?: any;
  original?: unknown;

  constructor(message: string, status?: number, data?: any, original?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
    this.original = original;
  }
}

/** Type-guard, якщо раптом треба */
export function isApiError(err: unknown): err is ApiError {
  return err instanceof ApiError;
}

/** Те, що найчастіше приходить від .NET / інших беків */
type ErrorPayload = {
  // RFC7807 / ProblemDetails поля
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
  instance?: string;

  // Кастомні поля, що часто трапляються
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
  [k: string]: any;
};

/**
 * Дістає найадекватніше повідомлення з payload бека:
 * - message / error / title / detail
 * - перше повідомлення з ModelState (errors: {Field: ["..."]})
 * - або fallback.
 */
function pickMessageFromPayload(payload: ErrorPayload | undefined, fallback: string): string {
  if (!payload) return fallback;

  // ASP.NET ModelState: errors: { Email: ["Email is already in use."] }
  const modelStateMsg =
    payload.errors && Object.values(payload.errors)[0]?.[0];

  return (
    payload.message ||
    payload.error ||
    payload.title ||
    payload.detail ||
    modelStateMsg ||
    fallback
  );
}

/**
 * Основний хелпер: приймає проміс AxiosResponse<T>, повертає T (тіло).
 * На помилках кидає ApiError із уже підготовленим message/status/data.
 */
export async function unwrap<T>(req: Promise<AxiosResponse<T>>): Promise<T> {
  try {
    const { data } = await req;
    return data;
  } catch (err) {
    // Axios-помилки: формуємо нормальний ApiError
    if (axios.isAxiosError(err)) {
      const aerr = err as AxiosError;
      const status = aerr.response?.status;
      const payload = aerr.response?.data as ErrorPayload | undefined;

      const fallback = aerr.message || "API request failed";
      const message = pickMessageFromPayload(payload, fallback);

      throw new ApiError(message, status, payload, err);
    }

    // Не-Axios помилки
    if (err instanceof Error) {
      throw new ApiError(err.message, undefined, undefined, err);
    }
    throw new ApiError(String(err ?? "Unknown error"), undefined, err);
  }
}

/**
 * Зручний помічник для компонентів:
 * дістає текст повідомлення, який можна показати юзеру.
 * Якщо це ApiError — беремо його message, інакше робимо best-effort.
 */
export function getApiErrorMessage(err: unknown): string {
  if (isApiError(err)) return err.message;

  if (axios.isAxiosError(err)) {
    const payload = err.response?.data as ErrorPayload | undefined;
    const fallback = err.message || "Request failed";
    return pickMessageFromPayload(payload, fallback);
  }

  if (err instanceof Error) return err.message;
  return "Unexpected error";
}


