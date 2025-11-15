import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography
} from '@mui/material';
import type { Claim } from '../../types';

interface ClaimsTableProps {
  claims: Claim[];
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

const ClaimsTable = ({ claims, page, pageSize, total, onPageChange, onPageSizeChange }: ClaimsTableProps) => {
  return (
    <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Model</TableCell>
              <TableCell>Model Year</TableCell>
              <TableCell>Region</TableCell>
              <TableCell>Component</TableCell>
              <TableCell>DTC Codes</TableCell>
              <TableCell>Cluster ID</TableCell>
              <TableCell align="right">Claim Cost (USD)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {claims.length === 0 && (
              <TableRow>
                <TableCell colSpan={8}>
                  <Typography align="center" py={3} color="text.secondary">
                    No claims match the selected filters.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
            {claims.map((claim) => (
              <TableRow key={claim.id ?? claim.claim_id} hover>
                <TableCell>{claim.claim_id}</TableCell>
                <TableCell>{claim.model}</TableCell>
                <TableCell>{claim.model_year ?? '—'}</TableCell>
                <TableCell>{claim.region ?? '—'}</TableCell>
                <TableCell>{claim.component ?? '—'}</TableCell>
                <TableCell>{claim.dtc_codes ?? '—'}</TableCell>
                <TableCell>{claim.cluster_id ?? '—'}</TableCell>
                <TableCell align="right">
                  {claim.claim_cost_usd ? `$${claim.claim_cost_usd.toLocaleString(undefined, { maximumFractionDigits: 0 })}` : '—'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={total}
        page={page - 1}
        rowsPerPage={pageSize}
        onPageChange={(_, newPage) => onPageChange(newPage + 1)}
        onRowsPerPageChange={(event) => onPageSizeChange(parseInt(event.target.value, 10))}
        rowsPerPageOptions={[10, 20, 50]}
      />
    </Paper>
  );
};

export default ClaimsTable;
