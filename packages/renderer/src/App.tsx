import axios from 'axios';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';

axios.defaults.baseURL = 'http://localhost:8081/api';

const App = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
