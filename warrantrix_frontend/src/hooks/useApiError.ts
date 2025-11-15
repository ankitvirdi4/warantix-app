import { useMemo } from 'react';

export const useApiError = (error: unknown): string | null => {
  return useMemo(() => {
    if (!error) {
      return null;
    }

    if (typeof error === 'string') {
      return error;
    }

    if (error instanceof Error) {
      return error.message;
    }

    if (typeof error === 'object' && error !== null && 'message' in error) {
      return String((error as { message: unknown }).message ?? 'Unknown error');
    }

    return 'Unexpected error occurred.';
  }, [error]);
};
