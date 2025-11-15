import { useState, type ChangeEvent, type FormEvent } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  LinearProgress,
  Typography
} from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { uploadClaimsCsv, type IngestResponse } from '../api/ingest';

const UploadPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [success, setSuccess] = useState<IngestResponse | null>(null);

  const { mutate, isLoading, isError, error } = useMutation({
    mutationFn: (selectedFile: File) => uploadClaimsCsv(selectedFile),
    onSuccess: (data) => {
      setSuccess(data);
    }
  });

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSuccess(null);
    const selectedFile = event.target.files?.[0] ?? null;
    setFile(selectedFile);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file) return;
    setSuccess(null);
    mutate(file);
  };

  return (
    <Box display="flex" justifyContent="center" mt={4}>
      <Card sx={{ width: '100%', maxWidth: 600 }}>
        {isLoading && <LinearProgress />}
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Upload Warranty Claims CSV
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Select a CSV file with warranty claims and upload it to ingest data into Warrantrix.
          </Typography>

          <Box component="form" onSubmit={handleSubmit} mt={2}>
            <input accept=".csv" type="file" onChange={handleFileChange} style={{ marginBottom: 16 }} />

            <Box mt={1} mb={2}>
              <Button type="submit" variant="contained" disabled={!file || isLoading}>
                {isLoading ? 'Uploading...' : 'Upload & Ingest'}
              </Button>
            </Box>
          </Box>

          {isError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error instanceof Error ? error.message : 'Upload failed'}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mt: 2 }}>
              <Typography variant="body2">
                Rows processed: <b>{success.rows_processed}</b>
              </Typography>
              <Typography variant="body2">
                Rows inserted: <b>{success.rows_inserted}</b>
              </Typography>
              {success.total_cost_usd !== undefined && (
                <Typography variant="body2">
                  Total cost: <b>${success.total_cost_usd.toFixed(2)}</b>
                </Typography>
              )}
            </Alert>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default UploadPage;
