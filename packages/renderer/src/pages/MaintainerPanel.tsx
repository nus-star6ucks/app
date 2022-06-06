import Keyboard from '@/components/Keyboard';
import { Button, useToasts, Grid, Card, Table, Loading, Text, Input } from '@geist-ui/core';
import { CoffeeMachine, Cola, Finance, User } from '@icon-park/react';
import classNames from 'classnames';
import { useLayoutEffect } from 'react';

const brands = [
  {
    title: 'Coca-Cola',
    quantity: 75,
  },
  {
    title: 'Sarsi',
    quantity: 13,
  },
  {
    title: 'Soya Bean',
    quantity: 21,
  },
  {
    title: 'Sevenup',
    quantity: 57,
  },
];

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

export default function MaintainerPanel() {
  useLayoutEffect(() => {
    document.title = 'VMCS - Maintainer Panel';
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
        <span className="uppercase font-medium">Maintainer Panel</span>
      </div>
      <section className="px-6 grid gap-12 grid-cols-2">
        <div className="space-y-6">
          <section>
            <h2 className="font-bold text-lg tracking-tighter mb-2 uppercase">
              Quantity of Coins Available
            </h2>
            <div className="space-y-3">
              {quantities.map((q) => (
                <div
                  key={q.title}
                  className="cursor-pointer btn-solid flex items-center justify-between space-x-2 px-4 py-2"
                >
                  <div className="flex items-center space-x-2">
                    <Finance size={36} strokeWidth={2} />
                    <h2 className="text-2xl tracking-tighter">{q.title}</h2>
                  </div>
                  <span className="led-small">{q.quantity}</span>
                </div>
              ))}
            </div>
          </section>
          <section>
            <h2 className="font-bold text-lg tracking-tighter mb-2 uppercase">
              Quantity of Drinks Available
            </h2>
            <div className="space-y-3">
              {brands.map((brand) => (
                <div
                  key={brand.title}
                  className="cursor-pointer btn-solid flex items-center justify-between space-x-2 px-4 py-2"
                >
                  <div className="flex items-center space-x-2">
                    <Cola size={36} strokeWidth={2} />
                    <div className="flex items-center space-x-2">
                      <h2 className="text-2xl tracking-tighter">{brand.title}</h2>
                    </div>
                  </div>
                  <span className="led-small">{brand.quantity}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
        <aside className="space-y-6">
          <section className="space-y-2">
            <div className="flex justify-between items-center">
              <h2 className="font-bold text-lg tracking-tighter uppercase">Misc</h2>
            </div>
            <section className="grid grid-cols-2 gap-2">
              <div className="border-2 border-black rounded-md p-4 uppercase">
                <p className="font-bold tracking-tighter">Brand Price</p>
                <input
                  type="text"
                  className="px-1 text-sm w-full font-bold border-2 border-black rounded-md transition-all"
                  width="100%"
                  value="75c"
                />
              </div>
              <div className="border-2 border-black rounded-md p-4 uppercase">
                <span className="led-small">No Can</span>
                <p className="font-bold tracking-tighter">Collect Can Here</p>
              </div>
              <div className="border-2 border-black rounded-md p-4 uppercase">
                <span className="font-bold">
                  <span className="tracking-tighter">Collect Cash</span>
                  <span className="ml-2 led-small">2730c</span>
                </span>

                <p className="font-bold mt-1">
                  <button className="w-full btn-solid-small text-xs p-1">
                    Press to Collect All Cash
                  </button>
                </p>
              </div>
              <div className="border-2 border-black rounded-md p-4 uppercase">
                <span className="font-bold">
                  <span className="tracking-tighter">Total Cash</span>
                  <span className="ml-2 led-small">4470c</span>
                </span>
                <p className="font-bold mt-1">
                  <button className="w-full btn-solid-small text-xs p-1">
                    Show Total Cash Held
                  </button>
                </p>
              </div>
            </section>
            <button className="btn-solid bg-purple-100 py-4 rounded-md font-bold w-full">
              Press Here When Finished
            </button>
          </section>
          <section className="space-y-2">
            <div className="flex justify-between items-center ">
              <h2 className="font-bold text-lg tracking-tighter  uppercase">Password</h2>
            </div>
            <div className="flex justify-between items-center ">
              <span className="led bg-teal-600">Valid Password</span>
              <span className={classNames('led bg-red-600', 'opacity-30')}>Invalid Password</span>
            </div>
            <input
              type="password"
              maxLength={6}
              className="p-1 w-full font-bold border-2 border-black rounded-md transition-all"
              width="100%"
            />
          </section>
        </aside>
      </section>
    </>
  );
}
