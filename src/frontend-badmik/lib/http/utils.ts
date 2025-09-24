
import axios, { AxiosResponse, AxiosError } from 'axios';

export class ApiError extends Error {
  status?: number;
  data?: any;
  original?: any;
  constructor(message: string, status?: number, data?: any, original?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
    this.original = original;
  }
}


type ErrorPayload = {
  message?: string;
  error?: string;
  title?: string;
  [k: string]: any;
};

export async function unwrap<T>(req: Promise<AxiosResponse<T>>): Promise<T> {
  try {
    const { data } = await req;
    return data;
  } catch (err) {

    if (axios.isAxiosError(err)) {
      const axiosErr = err as AxiosError;
      const status = axiosErr.response?.status;
    
      const payload = axiosErr.response?.data as ErrorPayload | undefined;

      const message =
        payload?.message ??
        payload?.error ??
        payload?.title ??
        axiosErr.message ??
        'API request failed';

      throw new ApiError(message, status, payload, err);
    }

   
    if (err instanceof Error) {
      throw new ApiError(err.message, undefined, undefined, err);
    }

   
    throw new ApiError(String(err ?? 'Unknown error'), undefined, err);
  }
}

