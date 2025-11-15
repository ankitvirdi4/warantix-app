import { useState } from 'react';
import { Box, FormControl, Grid, InputLabel, MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { fetchClusters } from '../api/clusters';
import ClustersTable from '../components/tables/ClustersTable';
import ErrorAlert from '../components/common/ErrorAlert';
import LoadingSpinner from '../components/common/LoadingSpinner';

const ClustersPage = () => {
  const [sortBy, setSortBy] = useState('cost');
  const [limit, setLimit] = useState(10);

  const clustersQuery = useQuery({
    queryKey: ['clusters', { sortBy, limit }],
    queryFn: () => fetchClusters({ sort_by: sortBy, limit })
  });

  const handleSortChange = (event: SelectChangeEvent) => {
    setSortBy(event.target.value);
  };

  const handleLimitChange = (event: SelectChangeEvent<number>) => {
    setLimit(Number(event.target.value));
  };

  return (
    <Box>
      <Box mb={3}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Failure Clusters
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Investigate emerging failure patterns and align cross-functional response plans.
        </Typography>
      </Box>

      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth size="small">
            <InputLabel id="sort-by-label">Sort by</InputLabel>
            <Select labelId="sort-by-label" value={sortBy} label="Sort by" onChange={handleSortChange}>
              <MenuItem value="cost">Highest cost</MenuItem>
              <MenuItem value="count">Claim volume</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth size="small">
            <InputLabel id="limit-label">Limit</InputLabel>
            <Select<number> labelId="limit-label" value={limit} label="Limit" onChange={handleLimitChange}>
              {[5, 10, 20].map((value) => (
                <MenuItem key={value} value={value}>
                  Top {value}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {clustersQuery.isLoading && <LoadingSpinner label="Loading clusters" />}
      {clustersQuery.error && <ErrorAlert message={(clustersQuery.error as Error).message} />}
      {clustersQuery.data && <ClustersTable clusters={clustersQuery.data} />}
    </Box>
  );
};

export default ClustersPage;
