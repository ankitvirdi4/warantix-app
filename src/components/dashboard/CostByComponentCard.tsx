import { Skeleton } from '@mui/material';
import { Pie, PieChart, ResponsiveContainer, Tooltip, Cell } from 'recharts';
import type { CostByComponent } from '../../types';
import EmptyState from '../common/EmptyState';

interface CostByComponentCardProps {
  data: CostByComponent[];
  isLoading?: boolean;
}

const COLORS = ['#1f6feb', '#0d9488', '#f59e0b', '#ef4444', '#6366f1', '#14b8a6', '#a855f7'];

const CostByComponentCard = ({ data, isLoading }: CostByComponentCardProps) => {
  return (
    <div className="h-80 rounded-xl bg-white p-4 shadow-sm">
      <div className="flex items-baseline justify-between">
        <div>
          <h2 className="text-base font-semibold text-gray-900">Cost by Component</h2>
          <p className="text-xs text-gray-500">Total warranty spend distribution</p>
        </div>
      </div>

      <div className="mt-4 h-64">
        {isLoading ? (
          <Skeleton variant="rectangular" width="100%" height="100%" sx={{ borderRadius: '0.75rem' }} />
        ) : data && data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} dataKey="total_cost_usd" nameKey="component" outerRadius="90%" paddingAngle={2} labelLine={false}>
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => `$${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <EmptyState message="Upload claims to see component cost distribution." />
        )}
      </div>
    </div>
  );
};

export default CostByComponentCard;
