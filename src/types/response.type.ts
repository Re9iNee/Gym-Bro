export interface SuccessResponse<T> {
  data: T;
  message: "OK";
}
export interface ErrorResponse {
  error: unknown;
  message: "error";
}

export type ResponseType<T> = SuccessResponse<T> | ErrorResponse;
