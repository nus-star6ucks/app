import Keyboard from '@/components/Keyboard';
import { Input } from '@geist-ui/core';
import { Checkbox, CheckboxFill } from '@geist-ui/icons';
import { CoffeeMachine, Cola, Finance } from '@icon-park/react';
import { useStateIPC } from 'electron-state-ipc/react';
import { useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const quantities = [
  {
    title: '5c',
    quantity: 22,
  },
  {
    title: '10c',
    quantity: 37,
  },
  {
    title: '20c',
    quantity: 9,
  },
  {
    title: '$1',
    quantity: 10,
  },
];

const brands = [
  {
    title: 'Coca-Cola',
    quantity: 5,
  },
  {
    title: 'Sarsi',
    quantity: 7,
  },
  {
    title: 'Soya Bean',
    quantity: 12,
  },
  {
    title: 'Sevenup',
    quantity: 1,
  },
];

export default function MachineryPanel() {
  const navigate = useNavigate();

  useLayoutEffect(() => {
    document.title = 'VMCS - Machinery Panel';
  }, []);

  return (
    <>
      <div className="px-6 mb-4 flex items-center space-x-2 -ml-1">
        <CoffeeMachine
          theme="outline"
          size="48"
          strokeWidth={3}
          strokeLinejoin="bevel"
          strokeLinecap="butt"
        />
        <span className="uppercase font-medium">Machinery Panel</span>
      </div>
      <section className="px-6 grid gap-12 grid-cols-2">
        <div className="space-y-6">
          <section>
            <h2 className="font-bold text-lg tracking-tighter mb-2 uppercase">Quantity of Coins</h2>
            <div className="grid grid-cols-2 gap-2">
              {quantities.map((q) => (
                <div
                  key={q.title}
                  className="border-2 border-black rounded-md p-4 uppercase flex justify-between items-center"
                >
                  <div className="flex items-center space-x-2 font-semibold">
                    <Finance size={36} strokeWidth={2} />
                    <div className="flex items-center space-x-2">
                      <h2 className="text-2xl tracking-tighter">{q.title}</h2>
                    </div>
                  </div>
                  <span className="led-small">{q.quantity}</span>
                </div>
              ))}
            </div>
          </section>
          <section>
            <h2 className="font-bold text-lg tracking-tighter mb-2 uppercase">Quantity of Cans</h2>
            <div className="grid grid-cols-2 gap-2">
              {brands.map((brand) => (
                <div
                  key={brand.title}
                  className="border-2 border-black rounded-md p-4 uppercase flex justify-between items-center"
                >
                  <div className="flex items-center space-x-2 font-semibold">
                    <Cola size={36} strokeWidth={2} />
                    <div className="flex items-center space-x-2">
                      <h2 className="text-xl tracking-tighter">{brand.title}</h2>
                    </div>
                  </div>
                  <span className="led-small">{brand.quantity}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
        <aside className="space-y-6">
          <section>
            <div className="flex justify-between items-center mb-2">
              <h2 className="font-bold text-lg tracking-tighter  uppercase">Misc</h2>
            </div>
            <div>
              <label className="font-semibold text-lg flex items-center">
                <Checkbox />
                <CheckboxFill />
                <span className="ml-2">Door Locked?</span>
              </label>
            </div>
          </section>
          <section>
            <div className="flex justify-between items-center mb-2">
              <h2 className="font-bold text-lg tracking-tighter  uppercase">State</h2>
            </div>
          </section>
          <Keyboard disabled />
        </aside>
      </section>
    </>
  );
}
