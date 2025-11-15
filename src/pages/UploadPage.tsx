import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  Typography
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { uploadClaimsCsv } from '../api/ingest';
import { useAuth } from '../hooks/useAuth';

const UploadPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const { user } = useAuth();

  const uploadMutation = useMutation({
    mutationFn: uploadClaimsCsv
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setFile(files[0]);
    } else {
      setFile(null);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!file) {
      return;
    }
    uploadMutation.mutate(file);
  };

  const isAdmin = user?.role === 'admin';

  if (!isAdmin) {
    return (
      <Box maxWidth={640}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Claims Ingestion
        </Typography>
        <Alert severity="info">
          Data ingestion is currently limited to administrator accounts. Please contact the quality systems team to request
          access.
        </Alert>
      </Box>
    );
  }

  return (
    <Box maxWidth={640}>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Claims Ingestion
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Upload dealer warranty claim CSV exports to refresh analytics and AI insights across the fleet.
      </Typography>

      <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
        <CardContent>
          <Stack spacing={3} component="form" onSubmit={handleSubmit}>
            <Button variant="outlined" component="label" startIcon={<CloudUploadIcon />}>
              {file ? file.name : 'Select CSV file'}
              <input type="file" accept=".csv" hidden onChange={handleFileChange} />
            </Button>
            <Button type="submit" variant="contained" disabled={!file || uploadMutation.isPending}>
              {uploadMutation.isPending ? 'Uploading…' : 'Upload & Ingest'}
            </Button>
            {uploadMutation.isSuccess && uploadMutation.data && (
              <Alert severity="success">
                Processed {uploadMutation.data.rows_processed} rows, inserted {uploadMutation.data.rows_inserted}. Total cost impact ${uploadMutation.data.total_cost_usd.toLocaleString(
                  undefined,
                  { maximumFractionDigits: 0 }
                )}.
              </Alert>
            )}
            {uploadMutation.isError && (
              <Alert severity="error">{(uploadMutation.error as Error).message ?? 'Upload failed'}</Alert>
            )}
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

export default UploadPage;
