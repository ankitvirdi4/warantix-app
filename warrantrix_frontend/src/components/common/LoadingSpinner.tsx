import { Box, CircularProgress, Typography } from '@mui/material';

interface LoadingSpinnerProps {
  label?: string;
}

const LoadingSpinner = ({ label = 'Loading data...' }: LoadingSpinnerProps) => (
  <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" py={6}>
    <CircularProgress color="primary" />
    <Typography mt={2} color="text.secondary">
      {label}
    </Typography>
  </Box>
);

export default LoadingSpinner;
