import Keyboard from '@/components/Keyboard';
import { Button } from '@geist-ui/core';
import { ChevronLeft } from '@geist-ui/icons';
import { CoffeeMachine, Cola } from '@icon-park/react';
import classNames from 'classnames';
import { useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const brands = [
  {
    title: 'Coca-Cola',
    price: '75c',
    inStock: true,
  },
  {
    title: 'Sarsi',
    price: '70c',
    inStock: true,
  },
  {
    title: 'Soya Bean',
    price: '60c',
    inStock: false,
  },
  {
    title: 'Sevenup',
    price: '75c',
    inStock: true,
  },
];

export default function CustomerPanel() {
  const navigate = useNavigate();

  useLayoutEffect(() => {
    document.title = 'VMCS - Customer Panel';
  }, []);

  return (
    <>
      <div className="px-6 my-4 flex items-center space-x-2 -ml-1">
        <CoffeeMachine
          theme="outline"
          size="48"
          strokeWidth={3}
          strokeLinejoin="bevel"
          strokeLinecap="butt"
        />
        <span className="uppercase font-medium">Soft Drink Dispenser</span>
      </div>
      <section className="px-6 grid gap-12 grid-cols-2">
        <div className="space-y-6">
          {/* <header className="flex justify-between text-black pb-6">
        <button className="-ml-2 flex space-x-1" onClick={() => navigate('/')}>
          <ChevronLeft size={24} />
          <span>Back</span>
        </button>
        <span>Soft Drink Dispenser</span>
      </header> */}

          <section>
            <h2 className="font-bold text-lg tracking-tighter mb-2 uppercase">Brands</h2>
            <div className="space-y-3">
              {brands.map((brand) => (
                <div
                  key={brand.title}
                  className="cursor-pointer btn-solid flex items-center justify-between space-x-2 p-4"
                >
                  <div className="flex items-center space-x-2">
                    <Cola size={36} strokeWidth={2} />
                    <div className="flex items-center space-x-2">
                      <h2 className="text-2xl tracking-tighter">{brand.title}</h2>
                      <span className="led-small">{brand.price}</span>
                    </div>
                  </div>
                  <span className={classNames('led', brand.inStock ? 'opacity-30' : '')}>
                    NOT IN STOCK
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>
        <aside className="space-y-6">
          <section>
            <div className="flex justify-between items-center mb-2">
              <h2 className="font-bold text-lg tracking-tighter  uppercase">Enter Coins Here</h2>
              <span
                className={classNames(
                  'led',
                  // brand.inStock ? 'opacity-30' : '',
                )}
              >
                INVALID COIN
              </span>
            </div>
            <div className="flex space-x-2 justify-between">
              {['5c', '10c', '20c', '50c', '$1', 'Invalid'].map((text) => (
                <button key={text} className="btn-solid-small px-2 h-10">
                  {text}
                </button>
              ))}
            </div>
          </section>
          <section className="grid grid-cols-2 gap-2">
            <div className="border-2 border-black rounded-md p-4 uppercase">
              <span className="led-small">0c</span>
              <p className="font-bold">Collect Coins</p>
            </div>
            <div className="border-2 border-black rounded-md p-4 uppercase">
              <span className="led-small">No Can</span>
              <p className="font-bold">Collect Can Here</p>
            </div>
            <div className="border-2 border-black rounded-md p-4 uppercase">
              <span className="led-small">30c</span>
              <p className="font-bold">Total Money Inserted</p>
            </div>
            <div className="border-2 border-black rounded-md p-4 uppercase">
              <span className="led opacity-30">No Change Available</span>
              <p className="font-bold mt-1">
                <button className="btn-solid-small text-xs p-1">Terminate and Return Cash</button>
              </p>
            </div>
          </section>
          <Keyboard />
        </aside>
      </section>
    </>
  );
}
