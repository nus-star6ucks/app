import { useElectronStateIPC } from 'electron-state-ipc/react';
import { useLayoutEffect } from 'react';
export default function Home() {
  useLayoutEffect(() => {
    document.title = 'VMCS - Simulator Control Panel';
  }, []);

  const state = useElectronStateIPC();

  return (
    <div className="mx-auto max-w-md">
      <header className="text-black py-6 mb-2">
        <p className="text-center font-bold text-3xl tracking-tighter">Simulator Control Panel</p>
      </header>
      <div className="space-y-4 px-4">
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => {
              window.electron.openNewWindow('/customer', {
                width: 1035,
                height: 660,
              });
            }}
            className="btn-solid bg-white py-4 aspect-square w-full"
          >
            Activate Customer Panel
          </button>
          <button
            onClick={() =>
              window.electron.openNewWindow('/maintainer', {
                width: 1035,
                height: 660,
              })
            }
            className="btn-solid bg-teal-100 py-4 aspect-square w-full"
          >
            Activate Maintainer Panel
          </button>
          <button
            onClick={() =>
              window.electron.openNewWindow('/machinery', {
                width: 1035,
                height: 660,
              })
            }
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
