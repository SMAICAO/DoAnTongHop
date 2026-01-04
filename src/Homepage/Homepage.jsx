import Board from './components/Board';
import { Button } from '@mui/material';
import ViewKanbanIcon from '@mui/icons-material/ViewKanban';
import WorkspacesIcon from '@mui/icons-material/Workspaces';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import './Homepage.css';

import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import muiTheme from './theme/muiTheme';

function Homepage() {
  return (
    <ThemeProvider theme={muiTheme}>
    <CssBaseline />
    <div className="app">
      <header className="app-header">
        <div className="app-logo">Trello Clone</div>

        <div className="app-actions">
          <Button
            variant="contained"
            size="small"
            startIcon={<ViewKanbanIcon />}
            sx={{
              textTransform: 'none',
              borderRadius: '999px',
              fontSize: 13,
              px: 2,
            }}
          >
            Board
          </Button>

          <Button
            variant="outlined"
            size="small"
            startIcon={<WorkspacesIcon />}
            sx={{
              textTransform: 'none',
              borderRadius: '999px',
              fontSize: 13,
              px: 2,
              borderColor: 'rgba(148, 163, 184, 0.6)',
              color: 'rgb(226, 232, 240)',
            }}
          >
            Workspace
          </Button>

          <Button
            variant="outlined"
            size="small"
            sx={{
              minWidth: 0,
              borderRadius: '999px',
              padding: '4px 10px',
              borderColor: 'rgba(148, 163, 184, 0.6)',
              color: 'rgb(226, 232, 240)',
            }}
          >
            <MoreHorizIcon fontSize="small" />
          </Button>
        </div>
      </header>

      <main className="app-main">
        <Board />
      </main>
    </div>
    </ThemeProvider>
  );
  
}

export default Homepage;