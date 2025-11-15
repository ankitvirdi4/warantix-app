import apiClient from './client';

export interface IngestResponse {
  rows_processed: number;
  rows_inserted: number;
  total_cost_usd?: number;
}

export async function uploadClaimsCsv(file: File): Promise<IngestResponse> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await apiClient.post<IngestResponse>('/ingest/claims-csv', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });

  return response.data;
}
