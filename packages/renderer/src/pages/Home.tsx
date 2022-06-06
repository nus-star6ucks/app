import { Button, useToasts, Grid, Card, Table, Loading, Text } from '@geist-ui/core';
import { useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  useLayoutEffect(() => {
    document.title = 'VMCS - Simulator Control Panel';
  }, []);

  return (
    <div className="mx-auto max-w-md">
      <header className="text-black py-6 mb-2">
        <p className="text-center font-bold text-3xl tracking-tighter">Simulator Control Panel</p>
      </header>
      <div className="space-y-4 px-4">
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => window.open('/#/customer', '_blank', 'frame=false,nodeIntegration=no')}
            className="btn-solid bg-white py-4 aspect-square w-full"
          >
            Activate Customer Panel
          </button>
          <button
            onClick={() => window.open('/#/maintainer')}
            className="btn-solid bg-teal-100 py-4 aspect-square w-full"
          >
            Activate Maintainer Panel
          </button>
          <button
            onClick={() => window.open('/#/machinery')}
            className="btn-solid bg-red-50 py-4 aspect-square w-full"
          >
            Activate Machinery Panel
          </button>
        </div>
      </div>

      <footer className="fixed bottom-0 left-0 px-4 pb-2 space-y-2 max-w-md w-full mx-auto">
        <button className="btn-solid bg-purple-100 py-4 rounded-md font-bold w-full">
          Begin Simulation
        </button>
        <button className="w-full uppercase font-semibold py-4">End Simulation</button>
      </footer>
    </div>
  );
}
