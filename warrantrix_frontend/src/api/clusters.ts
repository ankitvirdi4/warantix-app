import apiClient from './client';
import type { Cluster } from '../types';

export interface ClustersQueryParams {
  sort_by?: string;
  limit?: number;
}

export const fetchClusters = async (params: ClustersQueryParams = {}): Promise<Cluster[]> => {
  const { data } = await apiClient.get<Cluster[]>('/clusters', { params });
  return data;
};

export const fetchClusterById = async (id: string | number): Promise<Cluster> => {
  const { data } = await apiClient.get<Cluster>(`/clusters/${id}`);
  return data;
};
