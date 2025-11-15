import { useMemo } from 'react';
import { Grid, Stack, Typography, Card, CardContent, List, ListItem, ListItemText } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { fetchCostByComponent, fetchTopFailures } from '../api/analytics';
import { fetchClaims } from '../api/claims';
import { fetchClusters } from '../api/clusters';
import CostByComponentChart from '../components/charts/CostByComponentChart';
import TopFailuresChart from '../components/charts/TopFailuresChart';
import ErrorAlert from '../components/common/ErrorAlert';
import LoadingSpinner from '../components/common/LoadingSpinner';
import StatCard from '../components/common/StatCard';
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
    <Stack spacing={4}>
      <div>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Field Quality Pulse
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Monitor warranty health, identify emerging issues, and align corrective actions across the fleet.
        </Typography>
      </div>

      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <StatCard title="Total Claims" value={claimsSummaryQuery.data?.total.toLocaleString() ?? '—'} />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard title="Total Warranty Cost" value={`$${totalCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}`} />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard title="Top Failure" value={topCluster?.label ?? '—'} subtitle={topCluster ? `${topCluster.num_claims} claims` : undefined} />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard title="Active Clusters" value={clustersQuery.data?.length.toLocaleString() ?? '—'} />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <TopFailuresChart data={topFailuresQuery.data?.clusters ?? []} />
        </Grid>
        <Grid item xs={12} md={5}>
          <CostByComponentChart data={costByComponentQuery.data ?? []} />
        </Grid>
      </Grid>

      <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
        <CardContent>
          <Typography variant="h6" fontWeight={700} gutterBottom>
            AI Triage Summary
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Top attention areas across recent warranty activity.
          </Typography>
          <List>
            {aiSummaryClusters.map((cluster) => (
              <ListItem key={cluster.cluster_id} divider>
                <ListItemText
                  primary={`${cluster.label} — ${cluster.num_claims.toLocaleString()} claims`}
                  secondary={`Estimated spend $${cluster.total_cost_usd.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
                />
              </ListItem>
            ))}
            {aiSummaryClusters.length === 0 && (
              <Typography variant="body2" color="text.secondary">
                No cluster intelligence available yet.
              </Typography>
            )}
          </List>
        </CardContent>
      </Card>
    </Stack>
  );
};

export default DashboardPage;
