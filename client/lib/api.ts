import { BASE_URL } from "@/lib/const";

// ---- Shared landmark types ----
export type PoseLandmark = { x: number; y: number; z: number; visibility: number };
export type HandLandmark = { x: number; y: number; z: number };

export type LstmFrame = {
  pose: PoseLandmark[];
  left_hand: HandLandmark[];
  right_hand: HandLandmark[];
};

export type LstmPredictResponse = { prediction: string; confidence?: number };
export type LstmClassesResponse = { classes: string[] | Record<string, number> };
export type LstmPredictRequest = { frames: LstmFrame[] };

type HandsKeypointsResponse = { landmarks: HandLandmark[] };
type PoseKeypointsResponse = {
  pose: PoseLandmark[];
  left_hand: HandLandmark[];
  right_hand: HandLandmark[];
};

// Custom error classes for better error handling
export class ApiError extends Error {
  constructor(
    message: string,
    public code?: string
  ) {
    super(message);
    this.name = "ApiError";
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

export class NetworkError extends ApiError {
  constructor(
    message: string,
    public originalError?: any
  ) {
    super(message, "NETWORK_ERROR");
    this.name = "NetworkError";
    Object.setPrototypeOf(this, NetworkError.prototype);
  }
}

export class TimeoutError extends ApiError {
  constructor(message: string = "Request timed out") {
    super(message, "TIMEOUT_ERROR");
    this.name = "TimeoutError";
    Object.setPrototypeOf(this, TimeoutError.prototype);
  }
}

export class HttpError extends ApiError {
  public status: number;
  constructor(
    message: string,
    public statusCode: number,
    public statusText: string,
    public responseBody?: string
  ) {
    super(message, `HTTP_${statusCode}`);
    this.name = "HttpError";
    this.status = statusCode;
    Object.setPrototypeOf(this, HttpError.prototype);
  }
}

export class ParseError extends ApiError {
  constructor(
    message: string,
    public originalError?: any
  ) {
    super(message, "PARSE_ERROR");
    this.name = "ParseError";
    Object.setPrototypeOf(this, ParseError.prototype);
  }
}

type FetchOptions = {
  method?: "GET" | "POST";
  headers?: Record<string, string>;
  body?: any;
  timeoutMs?: number;
};

async function safeReadText(res: Response): Promise<string> {
  try {
    return await res.text();
  } catch {
    return "";
  }
}

export async function apiFetch<T = any>(
  path: string,
  { method = "GET", headers = {}, body, timeoutMs = 8000 }: FetchOptions = {}
): Promise<T> {
  const url = BASE_URL.replace(/\/+$/, "") + "/" + path.replace(/^\/+/, "");

  const controller = new AbortController();
  let timer: ReturnType<typeof setTimeout> | null = null;
  let isTimeout = false;

  try {
    timer = setTimeout(() => {
      isTimeout = true;
      controller.abort(new DOMException(`Request to ${path} timed out`, "TimeoutError"));
    }, timeoutMs);

    const res = await fetch(url, {
      method,
      headers: {
        Accept: "application/json",
        ...(body && !(body instanceof FormData) ? { "Content-Type": "application/json" } : {}),
        ...headers,
      },
      body: body && !(body instanceof FormData) ? JSON.stringify(body) : body,
      signal: controller.signal,
    });

    if (timer) clearTimeout(timer);

    // Handle HTTP errors
    if (!res.ok) {
      const responseText = await safeReadText(res);
      let errorDetails;
      try {
        errorDetails = responseText ? JSON.parse(responseText) : null;
      } catch {
        errorDetails = responseText;
      }

      throw new HttpError(
        errorDetails?.detail || errorDetails || res.statusText,
        res.status,
        res.statusText,
        responseText
      );
    }

    // Parse JSON response
    try {
      return (await res.json()) as T;
    } catch (error: any) {
      throw new ParseError(
        `Failed to parse JSON response from ${path}: ${error?.message ?? "Unknown error"}`,
        error
      );
    }
  } catch (error: any) {
    // Handle timeout
    if (isTimeout) {
      throw new TimeoutError(`Request to ${path} timed out after ${timeoutMs}ms`);
    }

    // Handle abort/timeout errors
    if (error.name === "AbortError") {
      throw new TimeoutError(`Request to ${path} timed out after ${timeoutMs}ms`);
    }

    // Re-throw custom API errors
    if (error instanceof ApiError) {
      throw error;
    }

    // Handle network errors
    throw new NetworkError(
      `Network error while fetching ${path}: ${error?.message ?? "Unknown error"}`,
      error
    );
  } finally {
    if (timer) clearTimeout(timer);
  }
}

const createImageFormData = (image: string | Blob | File) => {
  const form = new FormData();

  if (typeof image === "string") {
    // React Native (iOS/Android): Use the URI format that React Native expects
    // @ts-ignore - React Native's FormData accepts this format
    form.append("image", {
      uri: image,
      name: "frame.jpg",
      type: "image/jpeg",
    });
  } else {
    // Web: append actual File/Blob
    const file =
      image instanceof File ? image : new File([image], "frame.jpg", { type: "image/jpeg" });
    form.append("image", file);
  }

  return form;
};

/**
 * API client for the SmartGlasses backend
 *
 * All methods can throw the following errors:
 * - NetworkError: Network connectivity issues
 * - TimeoutError: Request exceeded timeout limit
 * - HttpError: HTTP error responses (4xx, 5xx)
 * - ParseError: Failed to parse response
 */
const api = {
  /**
   * Check API health status
   * @throws {NetworkError} If network request fails
   * @throws {TimeoutError} If request times out
   * @throws {HttpError} If server returns error status
   * @throws {ParseError} If response cannot be parsed
   */
  health: () => apiFetch<{ version: string }>("/health"),

  /**
   * Get available classes for a sign language model
   * @param model - The model to query ("asl" or "vgt")
   * @throws {NetworkError} If network request fails
   * @throws {TimeoutError} If request times out
   * @throws {HttpError} If server returns error status
   * @throws {ParseError} If response cannot be parsed
   */
  classes: (model: "asl" | "vgt") => {
    return apiFetch<{ classes: string[] }>(`/alphabet/${model}/classes`);
  },

  /**
   * Predict sign language gesture from landmarks
   * @param model - The model to use ("asl" or "vgt")
   * @param landmarks - Array of 3D landmark coordinates
   * @throws {NetworkError} If network request fails
   * @throws {TimeoutError} If request times out
   * @throws {HttpError} If server returns error status
   * @throws {ParseError} If response cannot be parsed
   */
  predict: (model: "asl" | "vgt", landmarks: { x: number; y: number; z: number }[]) => {
    return apiFetch<{ prediction: string }>(`/alphabet/${model}/predict`, {
      method: "POST",
      body: { landmarks },
    });
  },

  /**
   * LSTM gesture (word) model
   * @throws {NetworkError} If network request fails
   * @throws {TimeoutError} If request times out
   * @throws {HttpError} If server returns error status
   * @throws {ParseError} If response cannot be parsed
   */
  lstmClasses: () => {
    return apiFetch<LstmClassesResponse>("/gestures/lstm/classes");
  },

  predictLstm: (payload: LstmPredictRequest, timeout:number = 500) => {
    return apiFetch<LstmPredictResponse>("/gestures/lstm/predict", {
      method: "POST",
      body: payload,
      timeoutMs: timeout,
    });
  },

  /**
   * Upload image to keypoints endpoint and extract landmarks
   * @param image - Image URI (iOS/Android) or Blob/File (web)
   * @throws {NetworkError} If network request fails
   * @throws {TimeoutError} If request times out
   * @throws {HttpError} If server returns error status
   * @throws {ParseError} If response cannot be parsed
   */
  keypointsHandsFromImage: async (image: string | Blob | File, timeout:number = 500) => {
    const form = createImageFormData(image);
    return apiFetch<HandsKeypointsResponse>("/keypoints/hands", {
      method: "POST",
      body: form,
      timeoutMs: timeout,
    });
  },

  /**
   * Upload image to pose keypoints endpoint (pose + hands) and extract landmarks
   */
  keypointsPoseFromImage: async (image: string | Blob | File, timeout:number = 500) => {
    const form = createImageFormData(image);
    return apiFetch<PoseKeypointsResponse>("/keypoints/pose", {
      method: "POST",
      body: form,
      timeoutMs: timeout,
    });
  },
};

export default api;
