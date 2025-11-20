import { useEffect, useState } from 'react';
import { Skeleton } from '@mui/material';
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import { apiClient } from '../../api/client';
import EmptyState from '../common/EmptyState';
import type { Cluster } from '../../types';

const TopFailureClustersCard = () => {
  const [clusters, setClusters] = useState<Cluster[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchClusters() {
      try {
        setIsLoading(true);
        const response = await apiClient.get<Cluster[]>('/clusters', {
          params: { sort_by: 'cost', limit: 10 }
        });
        setClusters(response.data);
        setError(null);
      } catch (err) {
        console.error('Failed to load clusters', err);
        setError('Could not load clusters');
      } finally {
        setIsLoading(false);
      }
    }

    fetchClusters();
  }, []);

  return (
    <div className="h-80 rounded-xl bg-white p-4 shadow-sm">
      <div className="flex items-baseline justify-between">
        <h2 className="text-base font-semibold text-gray-900">Top Failure Clusters</h2>
      </div>

      <div className="mt-4 h-64">
        {isLoading ? (
          <Skeleton variant="rectangular" width="100%" height="100%" sx={{ borderRadius: '0.75rem' }} />
        ) : error ? (
          <EmptyState message={error} />
        ) : clusters.length === 0 ? (
          <EmptyState message="No clusters yet. Upload a claims CSV to generate clusters." />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={clusters} margin={{ left: 0, right: 16 }}>
              <XAxis
                dataKey="label"
                tick={{ fontSize: 10 }}
                interval={0}
                angle={-25}
                textAnchor="end"
                height={70}
              />
              <YAxis tickFormatter={(value) => `$${value.toLocaleString()}`} />
              <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
              <Bar dataKey="total_cost_usd" fill="#1f6feb" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default TopFailureClustersCard;
