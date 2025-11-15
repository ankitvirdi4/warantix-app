import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, ToggleButton, ToggleButtonGroup } from '@mui/material';
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
    <Card elevation={0} sx={{ height: '100%', borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
      <CardHeader
        title="Top Failure Clusters"
        action={
          <ToggleButtonGroup size="small" value={metric} exclusive onChange={handleMetricChange}>
            <ToggleButton value="num_claims">Claims</ToggleButton>
            <ToggleButton value="total_cost_usd">Cost</ToggleButton>
          </ToggleButtonGroup>
        }
      />
      <CardContent sx={{ height: 320 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" interval={0} tick={{ fontSize: 12 }} height={80} angle={-20} textAnchor="end" />
            <YAxis />
            <Tooltip formatter={(value: number) => value.toLocaleString()} />
            <Bar dataKey={metric} fill="#1f6feb" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default TopFailuresChart;
