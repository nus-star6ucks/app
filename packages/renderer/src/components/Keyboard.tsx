import classNames from 'classnames';

type TKeyboardProps = {
  onType?: (command: string | number) => void;
  disabled?: boolean;
};

export default function Keyboard({ onType, disabled = false }: TKeyboardProps) {
  return (
    <section>
      <div className="flex justify-between items-center mb-2">
        <h2 className="font-bold text-lg tracking-tighter uppercase">KEYBOARD</h2>
      </div>
      <div className={classNames('grid grid-cols-3 gap-2', disabled ? 'opacity-30' : '')}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 'RESET', 0, 'CONFIRM'].map((text) => (
          <button
            key={text}
            disabled={disabled}
            onClick={() => onType?.(text)}
            className="btn-solid-small px-2 h-10"
          >
            {text}
          </button>
        ))}
      </div>
    </section>
  );
}
