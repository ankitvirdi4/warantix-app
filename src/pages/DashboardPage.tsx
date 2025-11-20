import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchCostByComponent, fetchTopFailures } from '../api/analytics';
import { fetchClaims } from '../api/claims';
import { fetchClusters } from '../api/clusters';
import ErrorAlert from '../components/common/ErrorAlert';
import LoadingSpinner from '../components/common/LoadingSpinner';
import StatCard from '../components/common/StatCard';
import CostByComponentCard from '../components/dashboard/CostByComponentCard';
import TopFailureClustersCard from '../components/dashboard/TopFailureClustersCard';
import type { TopFailureCluster } from '../types';

const DashboardPage = () => {
  const topFailuresQuery = useQuery({ queryKey: ['analytics', 'top-failures'], queryFn: fetchTopFailures });
  const costByComponentQuery = useQuery({ queryKey: ['analytics', 'cost-by-component'], queryFn: fetchCostByComponent });
  const claimsSummaryQuery = useQuery({
    queryKey: ['claims', 'summary'],
    queryFn: () => fetchClaims({ page: 1, page_size: 1 })
  });
  const clustersQuery = useQuery({ queryKey: ['clusters', 'summary'], queryFn: () => fetchClusters({}) });

  const isLoading =
    topFailuresQuery.isLoading || costByComponentQuery.isLoading || claimsSummaryQuery.isLoading || clustersQuery.isLoading;

  const error = topFailuresQuery.error || costByComponentQuery.error || claimsSummaryQuery.error || clustersQuery.error;

  const totalCost = useMemo(() => {
    if (!costByComponentQuery.data) return 0;
    return costByComponentQuery.data.reduce((sum, item) => sum + (item.total_cost_usd ?? 0), 0);
  }, [costByComponentQuery.data]);

  const topCluster = useMemo(() => {
    const clusters = topFailuresQuery.data?.clusters ?? [];
    if (clusters.length === 0) return null;
    return clusters[0];
  }, [topFailuresQuery.data]);

  const aiSummaryClusters = useMemo<TopFailureCluster[]>(() => {
    return (topFailuresQuery.data?.clusters ?? []).slice(0, 3);
  }, [topFailuresQuery.data]);

  if (isLoading) {
    return <LoadingSpinner label="Loading dashboard insights" />;
  }

  if (error) {
    return <ErrorAlert message={(error as Error).message ?? 'Failed to load dashboard'} />;
  }

  return (
    <div className="bg-gray-100">
      <div className="mx-auto max-w-6xl px-6 py-6">
        <header className="mb-6">
          <h1 className="text-3xl font-semibold text-gray-900">Field Quality Pulse</h1>
          <p className="mt-1 text-sm text-gray-500">
            Monitor warranty health, identify emerging issues, and align corrective actions across the fleet.
          </p>
        </header>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard title="Total Claims" value={claimsSummaryQuery.data?.total.toLocaleString() ?? '—'} />
          <StatCard title="Total Warranty Cost" value={`$${totalCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}`} />
          <StatCard title="Top Failure" value={topCluster?.label ?? '—'} subtitle={topCluster ? `${topCluster.num_claims} claims` : undefined} />
          <StatCard title="Active Clusters" value={clustersQuery.data?.length.toLocaleString() ?? '—'} />
        </section>

        <section className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <TopFailureClustersCard />
          </div>

          <div>
            <CostByComponentCard data={costByComponentQuery.data ?? []} isLoading={costByComponentQuery.isLoading} />
          </div>
        </section>

        <section className="mt-8">
          <div className="rounded-xl bg-white p-4 shadow-sm">
            <h2 className="text-base font-semibold text-gray-900">AI Triage Summary</h2>
            <p className="text-sm text-gray-500">Top attention areas across recent warranty activity.</p>
            <div className="mt-4 divide-y divide-gray-200">
              {aiSummaryClusters.map((cluster) => (
                <div key={cluster.cluster_id} className="py-3">
                  <p className="text-sm font-semibold text-gray-900">
                    {cluster.label} — {cluster.num_claims.toLocaleString()} claims
                  </p>
                  <p className="text-xs text-gray-500">
                    Estimated spend ${cluster.total_cost_usd.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </p>
                </div>
              ))}
              {aiSummaryClusters.length === 0 && (
                <p className="py-2 text-sm text-gray-500">No cluster intelligence available yet.</p>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default DashboardPage;
