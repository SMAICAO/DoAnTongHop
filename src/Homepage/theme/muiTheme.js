// src/theme/muiTheme.js
import { createTheme } from '@mui/material/styles';

const muiTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#16a34a', // xanh lá chính
    },
    secondary: {
      main: '#166534',
    },
    background: {
      default: '#f3f4f6', // nền xám nhạt
      paper: '#ffffff',   // card trắng
    },
    text: {
      primary: '#111827',
      secondary: '#4b5563',
    },
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily:
      'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
});

export default muiTheme;
