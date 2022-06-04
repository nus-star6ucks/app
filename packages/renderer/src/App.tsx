import { useMemo } from 'react';
import Example from './pages/example/Example';
import { useStore } from './store/useStore';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Zustand from './pages/example/Zustand';
import Info from './pages/example/Info';
import pkg from '../../../package.json';

const App = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Example />} />
        <Route path="/Zustand" element={<Zustand />} />
        <Route path="/Info" element={<Info />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
