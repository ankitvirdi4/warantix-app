import apiClient from './client';
import type { Claim, ClaimsResponse } from '../types';

export interface ClaimsQueryParams {
  page?: number;
  page_size?: number;
  model?: string;
  region?: string;
  component?: string;
  cluster_id?: number;
  date_from?: string;
  date_to?: string;
}

export const fetchClaims = async (params: ClaimsQueryParams = {}): Promise<ClaimsResponse> => {
  const { data } = await apiClient.get<ClaimsResponse>('/claims', { params });
  return data;
};

export const fetchClaimById = async (id: string | number): Promise<Claim> => {
  const { data } = await apiClient.get<Claim>(`/claims/${id}`);
  return data;
};
