import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import type { Cluster } from '../../types';

interface ClustersTableProps {
  clusters: Cluster[];
}

const ClustersTable = ({ clusters }: ClustersTableProps) => {
  const navigate = useNavigate();

  return (
    <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Cluster ID</TableCell>
              <TableCell>Label</TableCell>
              <TableCell>Claims</TableCell>
              <TableCell>Total Cost</TableCell>
              <TableCell>First Failure</TableCell>
              <TableCell>Last Failure</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clusters.length === 0 && (
              <TableRow>
                <TableCell colSpan={6}>
                  <Typography align="center" py={3} color="text.secondary">
                    No clusters available.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
            {clusters.map((cluster) => (
              <TableRow
                key={cluster.id}
                hover
                sx={{ cursor: 'pointer' }}
                onClick={() => navigate(`/clusters/${cluster.id}`)}
              >
                <TableCell>{cluster.id}</TableCell>
                <TableCell>{cluster.label}</TableCell>
                <TableCell>{cluster.num_claims.toLocaleString()}</TableCell>
                <TableCell>{`$${Number(cluster.total_cost_usd ?? 0).toLocaleString()}`}</TableCell>
                <TableCell>{cluster.first_failure_date ? new Date(cluster.first_failure_date).toLocaleDateString() : '—'}</TableCell>
                <TableCell>{cluster.last_failure_date ? new Date(cluster.last_failure_date).toLocaleDateString() : '—'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default ClustersTable;
