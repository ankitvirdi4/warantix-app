import apiClient from './client';
import type { CostByComponent, TopFailuresResponse } from '../types';

export const fetchTopFailures = async (): Promise<TopFailuresResponse> => {
  const { data } = await apiClient.get<TopFailuresResponse>('/analytics/top-failures');
  return data;
};

export const fetchCostByComponent = async (): Promise<CostByComponent[]> => {
  const { data } = await apiClient.get<CostByComponent[]>('/analytics/cost-by-component');
  return data;
};
