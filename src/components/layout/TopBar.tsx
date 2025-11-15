import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import { AppBar, Box, IconButton, Toolbar, Typography, Avatar } from '@mui/material';
import { useAuth } from '../../hooks/useAuth';

interface TopBarProps {
  onMenuClick?: () => void;
  title?: string;
}

const TopBar = ({ onMenuClick, title }: TopBarProps) => {
  const { user, logout } = useAuth();

  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }} color="inherit" elevation={1}>
      <Toolbar>
        {onMenuClick && (
          <IconButton color="primary" edge="start" sx={{ mr: 2 }} onClick={onMenuClick}>
            <MenuIcon />
          </IconButton>
        )}
        <Typography variant="h6" sx={{ flexGrow: 1 }} fontWeight={600} color="primary">
          {title ?? 'Warranty Intelligence Copilot'}
        </Typography>
        <Box display="flex" alignItems="center" gap={2}>
          <Box textAlign="right">
            <Typography variant="body1" fontWeight={600}>
              {user?.name ?? user?.email ?? 'Analyst'}
            </Typography>
            {user?.role && (
              <Typography variant="caption" color="text.secondary">
                {user.role}
              </Typography>
            )}
          </Box>
          <Avatar sx={{ bgcolor: 'primary.main' }}>{(user?.name ?? user?.email ?? 'U').charAt(0).toUpperCase()}</Avatar>
          <IconButton color="primary" onClick={logout}>
            <LogoutIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
