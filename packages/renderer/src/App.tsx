import { useToasts } from '@geist-ui/core';
import { useRequest } from 'ahooks';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';

import axios from 'axios';
axios.defaults.baseURL = 'http://localhost:8081/api';

import { getHeartbeatService } from './services/heartbeat';

const App = () => {
  const { setToast } = useToasts();
  useRequest(getHeartbeatService, {
    pollingInterval: 3000,
    onError() {
      setToast({
        delay: 3000,
        type: 'error',
        text: 'Internal server error, please reopen and try again.',
      });
    },
  });

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
