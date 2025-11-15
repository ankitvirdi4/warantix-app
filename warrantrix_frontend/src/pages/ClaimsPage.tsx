import type { ChangeEvent } from 'react';
import { useState } from 'react';
import {
  Box,
  Button,
  Grid,
  MenuItem,
  TextField,
  Typography
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select';
import { useQuery } from '@tanstack/react-query';
import { fetchClaims } from '../api/claims';
import ClaimsTable from '../components/tables/ClaimsTable';
import ErrorAlert from '../components/common/ErrorAlert';
import LoadingSpinner from '../components/common/LoadingSpinner';

const defaultFilters = {
  model: '',
  region: '',
  component: '',
  clusterId: '',
  dateFrom: '',
  dateTo: ''
};

const ClaimsPage = () => {
  const [filters, setFilters] = useState({ ...defaultFilters });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const claimsQuery = useQuery({
    queryKey: ['claims', { page, pageSize, filters }],
    queryFn: () =>
      fetchClaims({
        page,
        page_size: pageSize,
        model: filters.model || undefined,
        region: filters.region || undefined,
        component: filters.component || undefined,
        cluster_id: filters.clusterId ? Number(filters.clusterId) : undefined,
        date_from: filters.dateFrom || undefined,
        date_to: filters.dateTo || undefined
      })
  });

  const handleFilterChange = (
    key: keyof typeof filters
  ) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
      const value = 'target' in event ? event.target.value : '';
      setFilters((prev) => ({ ...prev, [key]: value }));
      setPage(1);
    };

  const handleResetFilters = () => {
    setFilters({ ...defaultFilters });
    setPage(1);
    setPageSize(20);
  };

  return (
    <Box>
      <Box mb={3}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Claims Explorer
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Inspect warranty records with filters to isolate emerging field issues.
        </Typography>
      </Box>

      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} sm={6} md={2}>
          <TextField
            label="Model"
            value={filters.model}
            onChange={handleFilterChange('model')}
            size="small"
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <TextField
            select
            label="Region"
            value={filters.region}
            onChange={handleFilterChange('region')}
            size="small"
            fullWidth
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="NA">North America</MenuItem>
            <MenuItem value="EMEA">EMEA</MenuItem>
            <MenuItem value="APAC">APAC</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <TextField
            label="Component"
            value={filters.component}
            onChange={handleFilterChange('component')}
            size="small"
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <TextField
            label="Cluster ID"
            value={filters.clusterId}
            onChange={handleFilterChange('clusterId')}
            size="small"
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <TextField
            label="Date From"
            type="date"
            value={filters.dateFrom}
            onChange={handleFilterChange('dateFrom')}
            size="small"
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <TextField
            label="Date To"
            type="date"
            value={filters.dateTo}
            onChange={handleFilterChange('dateTo')}
            size="small"
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Button variant="outlined" color="primary" onClick={handleResetFilters} fullWidth sx={{ height: '100%' }}>
            Reset
          </Button>
        </Grid>
      </Grid>

      {claimsQuery.isLoading && <LoadingSpinner label="Loading claims" />}
      {claimsQuery.error && <ErrorAlert message={(claimsQuery.error as Error).message} />}
      {claimsQuery.data && (
        <ClaimsTable
          claims={claimsQuery.data.items}
          page={claimsQuery.data.page}
          pageSize={claimsQuery.data.page_size}
          total={claimsQuery.data.total}
          onPageChange={(newPage) => setPage(newPage)}
          onPageSizeChange={(newSize) => {
            setPageSize(newSize);
            setPage(1);
          }}
        />
      )}
    </Box>
  );
};

export default ClaimsPage;
