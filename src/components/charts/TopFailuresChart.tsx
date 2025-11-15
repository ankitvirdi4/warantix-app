import { useMemo, useState } from 'react';
import { Box, Card, CardContent, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import type { TopFailureCluster } from '../../types';

interface TopFailuresChartProps {
  data: TopFailureCluster[];
}

type Metric = 'num_claims' | 'total_cost_usd';

const TopFailuresChart = ({ data }: TopFailuresChartProps) => {
  const [metric, setMetric] = useState<Metric>('num_claims');

  const chartData = useMemo(() => {
    return data.map((cluster) => ({
      name: cluster.label,
      num_claims: cluster.num_claims,
      total_cost_usd: cluster.total_cost_usd
    }));
  }, [data]);

  const handleMetricChange = (_: React.MouseEvent<HTMLElement>, value: Metric | null) => {
    if (value) {
      setMetric(value);
    }
  };

  return (
    <Card
      elevation={0}
      sx={{
        height: '100%',
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 3, pt: 3, pb: 1.5 }}>
        <Typography variant="h6" fontWeight={600}>
          Top Failure Clusters
        </Typography>
        <ToggleButtonGroup size="small" value={metric} exclusive onChange={handleMetricChange}>
          <ToggleButton value="num_claims">Claims</ToggleButton>
          <ToggleButton value="total_cost_usd">Cost</ToggleButton>
        </ToggleButtonGroup>
      </Box>
      <CardContent sx={{ flexGrow: 1, width: '100%', display: 'flex', pt: 0, px: 3, pb: 3 }}>
        <Box sx={{ flexGrow: 1, minHeight: 280 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" interval={0} tick={{ fontSize: 12 }} height={80} angle={-20} textAnchor="end" />
              <YAxis />
              <Tooltip formatter={(value: number) => value.toLocaleString()} />
              <Bar dataKey={metric} fill="#1f6feb" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};

export default TopFailuresChart;
