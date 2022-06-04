import pkg from '../../../package.json';
import { useState, useEffect } from 'react';
import { Avatar, Button, Paper, Typography, Box, Chip } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { InfoOutlined, Brightness4, Brightness7 } from '@mui/icons-material';

const ipcRenderer = window.ipcRenderer || false;

const Example = () => {
  // React's useState
  const [count, setCount] = useState(0);
  const [message, setMessage] = useState('hacked by Blade');
  const [data, setData] = useState(0);

  // Electron-Store
  const onClickSetStore = () => {
    ipcRenderer.send('set', ['count', count]);
    onClickGetStore();
  };
  const onClickGetStore = () => {
    ipcRenderer.send('get');
  };

  // IPC Example
  const onClickWithIpc = () => {
    ipcRenderer.send('ping-pong', 'some data from ipcRenderer');
  };
  const onClickWithIpcSync = () => {
    const message = ipcRenderer.sendSync('ping-pong-sync', 'some data from ipcRenderer');
    setMessage(message);
  };

  // set React-state from Electron-Store
  useEffect(() => {
    if (ipcRenderer) {
      if (data) {
        setCount(data);
      }
    }
  }, [data]);

  // IPC init
  useEffect(() => {
    if (ipcRenderer) {
      ipcRenderer.on('ping-pong', (event: any, data: any) => {
        setMessage(data);
      });
      ipcRenderer.on('get', (event: any, data: any) => {
        setData(data.count);
      });
    }
    return () => {
      if (ipcRenderer) {
        ipcRenderer.removeAllListeners('ping-pong');
        ipcRenderer.removeAllListeners('get');
      }
    };
  }, []);

  useEffect(() => {
    if (ipcRenderer) {
      onClickGetStore();
    }
  }, []);

  return (
    <Box
      sx={{
        bgcolor: 'background.default',
        color: 'text.primary',
        overflowX: 'hidden',
      }}
    >
      <header
        style={{
          minHeight: ipcRenderer && pkg.env.VITRON_CUSTOM_TITLEBAR ? 'calc(100vh - 30px)' : '100vh',
        }}
      >
        <div></div>

        {ipcRenderer && (
          <Paper elevation={3} sx={{ p: 2, m: 1, minWidth: 480 }}>
            <Button
              variant="outlined"
              size={'small'}
              sx={{ mr: 1, width: '250px', whiteSpace: 'nowrap' }}
            >
              Electron Store: {data}
            </Button>
            <Button sx={{ width: 100 }} onClick={() => setCount(data)}>
              Get
            </Button>{' '}
            <Button sx={{ width: 100 }} onClick={() => onClickSetStore()}>
              Set
            </Button>
          </Paper>
        )}

        <Paper elevation={3} sx={{ p: 2, m: 1, minWidth: 480 }}>
          <Button variant="outlined" sx={{ mr: 1, width: '250px', whiteSpace: 'nowrap' }}>
            React useState: {count}
          </Button>
          <Button sx={{ width: 100 }} onClick={() => setCount((count: number) => count - 1)}>
            - 1
          </Button>{' '}
          <Button sx={{ width: 100 }} onClick={() => setCount((count: number) => count + 1)}>
            + 1
          </Button>
        </Paper>

        {ipcRenderer && (
          <Paper elevation={3} sx={{ p: 2, m: 1, minWidth: 480 }}>
            <Button variant="outlined" sx={{ mr: 1, width: '250px', whiteSpace: 'nowrap' }}>
              IPC messaging
            </Button>
            <Button sx={{ width: 100 }} onClick={onClickWithIpc}>
              async
            </Button>{' '}
            <Button sx={{ width: 100 }} onClick={onClickWithIpcSync}>
              sync
            </Button>
          </Paper>
        )}

        <Paper elevation={3} sx={{ p: 2, m: 1, minWidth: 480 }}>
          <Button variant="outlined" sx={{ mr: 1, width: '250px', whiteSpace: 'nowrap' }}>
            Extras
          </Button>
          <Button size={'large'} sx={{ width: 60 }} component={RouterLink} to={'info'}>
            <InfoOutlined />
          </Button>{' '}
        </Paper>

        {ipcRenderer && (
          <Paper elevation={1} sx={{ p: 2, m: 1, minWidth: 480 }}>
            <p className="text-center">{message}</p>
          </Paper>
        )}
      </header>
    </Box>
  );
};

export default Example;
