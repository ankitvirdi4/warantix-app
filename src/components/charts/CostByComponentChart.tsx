import { Box, Card, CardContent, Typography } from '@mui/material';
import { Pie, PieChart, ResponsiveContainer, Tooltip, Cell } from 'recharts';
import type { CostByComponent } from '../../types';

interface CostByComponentChartProps {
  data: CostByComponent[];
}

const COLORS = ['#1f6feb', '#0d9488', '#f59e0b', '#ef4444', '#6366f1', '#14b8a6', '#a855f7'];

const CostByComponentChart = ({ data }: CostByComponentChartProps) => {
  const chartData = data.map((item) => ({
    name: item.component,
    value: item.total_cost_usd
  }));

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
      <Box sx={{ px: 3, pt: 3, pb: 1.5 }}>
        <Typography variant="h6" fontWeight={600}>
          Cost by Component
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Total warranty spend distribution
        </Typography>
      </Box>
      <CardContent sx={{ flexGrow: 1, width: '100%', display: 'flex', pt: 0, px: 3, pb: 3 }}>
        <Box sx={{ flexGrow: 1, minHeight: 280 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={110}
              label={(entry) => entry.name}
            >
              {chartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => `$${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`} />
          </PieChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CostByComponentChart;
