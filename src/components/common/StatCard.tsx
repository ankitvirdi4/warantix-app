import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { Card, CardContent, Stack, Typography } from '@mui/material';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
}

const StatCard = ({ title, value, subtitle, icon }: StatCardProps) => (
  <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
    <CardContent>
      <Stack direction="row" alignItems="center" spacing={2}>
        {icon ?? <TrendingUpIcon color="primary" fontSize="large" />}
        <Stack spacing={0.5}>
          <Typography variant="body2" color="text.secondary" fontWeight={600} textTransform="uppercase">
            {title}
          </Typography>
          <Typography variant="h4" fontWeight={700}>
            {value}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Stack>
      </Stack>
    </CardContent>
  </Card>
);

export default StatCard;
