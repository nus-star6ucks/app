import { useToasts } from '@geist-ui/core';
import { useRequest } from 'ahooks';
import { HashRouter, Routes, Route } from 'react-router-dom';

import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:8081/api';

import Home from './pages/Home';
import CustomerPanel from './pages/CustomerPanel';
import MaintainerPanel from './pages/MaintainerPanel';
import MachineryPanel from './pages/MachineryPanel';

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
    <main className="py-4">
      <HashRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/customer" element={<CustomerPanel />} />
          <Route path="/maintainer" element={<MaintainerPanel />} />
          <Route path="/machinery" element={<MachineryPanel />} />
        </Routes>
      </HashRouter>
    </main>
  );
};

export default App;
