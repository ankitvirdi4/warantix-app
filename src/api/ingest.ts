import apiClient from './client';

export interface UploadResponse {
  rows_processed: number;
  rows_inserted: number;
  total_cost_usd: number;
}

export const uploadClaimsCsv = async (file: File): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  const { data } = await apiClient.post<UploadResponse>('/ingest/claims-csv', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return data;
};
