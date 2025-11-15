import { Alert, AlertTitle } from '@mui/material';

interface ErrorAlertProps {
  message: string;
  title?: string;
}

const ErrorAlert = ({ message, title = 'Something went wrong' }: ErrorAlertProps) => (
  <Alert severity="error" sx={{ my: 2 }}>
    <AlertTitle>{title}</AlertTitle>
    {message}
  </Alert>
);

export default ErrorAlert;
