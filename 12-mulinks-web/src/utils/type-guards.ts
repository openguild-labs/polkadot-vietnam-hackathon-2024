import type { ActionPostResponse } from "../api/actions-spec";

export const isSignTransactionError = (
  data: { signature: string } | { error: string }
): data is { error: string } => !!(data as any).error;

export const isPostRequestError = (
  data: ActionPostResponse | { error: string }
): data is { error: string } => !!(data as any).error;
