import { useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import HubIcon from '@mui/icons-material/Hub';
import DescriptionIcon from '@mui/icons-material/Description';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Box, Drawer, List, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography } from '@mui/material';
import { useAuth } from '../../hooks/useAuth';

const drawerWidth = 240;

interface NavItem {
  label: string;
  to: string;
  icon: React.ReactNode;
  roles?: string[];
}

const navItems: NavItem[] = [
  { label: 'Dashboard', to: '/dashboard', icon: <DashboardIcon /> },
  { label: 'Clusters', to: '/clusters', icon: <HubIcon /> },
  { label: 'Claims', to: '/claims', icon: <DescriptionIcon /> },
  { label: 'Upload', to: '/upload', icon: <CloudUploadIcon />, roles: ['admin'] }
];

const Sidebar = () => {
  const { user } = useAuth();

  const items = useMemo(() => {
    return navItems.filter((item) => {
      if (!item.roles || item.roles.length === 0) {
        return true;
      }
      return item.roles.includes(user?.role ?? '');
    });
  }, [user]);

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: 'border-box'
        }
      }}
    >
      <Toolbar>
        <Typography variant="h6" component="div" fontWeight={700} color="primary">
          warrantrix
        </Typography>
      </Toolbar>
      <Box sx={{ overflow: 'auto' }}>
        <List>
          {items.map((item) => (
            <ListItemButton
              key={item.to}
              component={NavLink}
              to={item.to}
              sx={{
                '&.active': {
                  bgcolor: 'action.selected',
                  borderRight: (theme) => `3px solid ${theme.palette.primary.main}`
                }
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
export { drawerWidth };
