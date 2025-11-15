import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  Stack,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import { fetchClusterById } from '../api/clusters';
import { fetchClaims } from '../api/claims';
import ClaimsTable from '../components/tables/ClaimsTable';
import ErrorAlert from '../components/common/ErrorAlert';
import LoadingSpinner from '../components/common/LoadingSpinner';

const ClusterDetailPage = () => {
  const { id } = useParams();
  const [claimsPage, setClaimsPage] = useState(1);
  const [claimsPageSize, setClaimsPageSize] = useState(10);

  useEffect(() => {
    setClaimsPage(1);
  }, [id]);

  const clusterQuery = useQuery({
    queryKey: ['cluster', id],
    queryFn: () => fetchClusterById(id as string),
    enabled: Boolean(id)
  });

  const claimsQuery = useQuery({
    queryKey: ['claims', 'cluster', id, claimsPage, claimsPageSize],
    queryFn: () =>
      fetchClaims({ cluster_id: Number(id), page: claimsPage, page_size: claimsPageSize }),
    enabled: Boolean(id)
  });

  const recommendedActions = useMemo(() => {
    const text = clusterQuery.data?.recommended_actions ?? '';
    if (!text) return [];
    try {
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed)) {
        return parsed as string[];
      }
    } catch (error) {
      console.debug('Unable to parse recommended actions JSON', error);
    }
    return text.split(/\r?\n/).filter((line) => line.trim().length > 0);
  }, [clusterQuery.data?.recommended_actions]);

  const rootCauseLines = useMemo(() => {
    const text = clusterQuery.data?.root_cause_hypothesis ?? '';
    return text.split(/\r?\n/).filter((line) => line.trim().length > 0);
  }, [clusterQuery.data?.root_cause_hypothesis]);

  if (clusterQuery.isLoading || claimsQuery.isLoading) {
    return <LoadingSpinner label="Loading cluster detail" />;
  }

  if (clusterQuery.error) {
    return <ErrorAlert message={(clusterQuery.error as Error).message} />;
  }

  if (!clusterQuery.data) {
    return <ErrorAlert message="Cluster not found" />;
  }

  const cluster = clusterQuery.data;

  return (
    <Stack spacing={4}>
      <Box>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Cluster {cluster.id}: {cluster.label}
        </Typography>
        <Stack direction="row" spacing={2} flexWrap="wrap" rowGap={1}>
          <Chip color="primary" label={`${cluster.num_claims.toLocaleString()} claims`} />
          <Chip color="secondary" label={`$${Number(cluster.total_cost_usd ?? 0).toLocaleString()} total cost`} />
          {cluster.first_failure_date && cluster.last_failure_date && (
            <Chip
              label={`${new Date(cluster.first_failure_date).toLocaleDateString()} - ${new Date(cluster.last_failure_date).toLocaleDateString()}`}
            />
          )}
        </Stack>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
            <CardContent>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                Root Cause Hypothesis
              </Typography>
              {rootCauseLines.length > 0 ? (
                <List disablePadding>
                  {rootCauseLines.map((line, index) => (
                    <ListItem key={index} disableGutters>
                      <ListItemText primary={line} />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No hypothesis documented yet.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
            <CardContent>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                Recommended Actions
              </Typography>
              {recommendedActions.length > 0 ? (
                <List disablePadding>
                  {recommendedActions.map((action, index) => (
                    <ListItem key={index} disableGutters>
                      <ListItemText primary={action} />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No recommended actions provided.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
        <CardContent>
          <Typography variant="h6" fontWeight={700} gutterBottom>
            Sample Claims
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Most recent claims linked to this cluster.
          </Typography>
          <Divider sx={{ my: 2 }} />
          {claimsQuery.error && <ErrorAlert message={(claimsQuery.error as Error).message} />}
          {claimsQuery.data && (
            <ClaimsTable
              claims={claimsQuery.data.items}
              page={claimsQuery.data.page}
              pageSize={claimsQuery.data.page_size}
              total={claimsQuery.data.total}
              onPageChange={(newPage) => setClaimsPage(newPage)}
              onPageSizeChange={(newSize) => {
                setClaimsPageSize(newSize);
                setClaimsPage(1);
              }}
            />
          )}
        </CardContent>
      </Card>
    </Stack>
  );
};

export default ClusterDetailPage;
