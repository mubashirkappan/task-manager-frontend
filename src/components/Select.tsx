import { useEffect, useId, useRef, useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';

export interface SelectOption<T extends string | number> {
  value: T;
  label: string;
}

interface Props<T extends string | number> {
  value: T;
  options: SelectOption<T>[];
  onChange: (value: T) => void;
  ariaLabel?: string;
  /** Classes for the trigger button (size, colours, border). */
  className?: string;
  /** Classes for the outer wrapper, e.g. `w-full` to stretch the control. */
  wrapperClassName?: string;
  /** Width of the popup list; defaults to the trigger's width. */
  menuClassName?: string;
  align?: 'left' | 'right';
}

// The popup needs roughly this much room below the trigger, otherwise it opens upwards.
const MENU_SPACE = 240;

/**
 * Custom dropdown used instead of the native <select>, whose popup is drawn by the
 * OS/browser and can render detached from the control (and ignores dark mode).
 */
export function Select<T extends string | number>({
  value,
  options,
  onChange,
  ariaLabel,
  className = '',
  wrapperClassName = '',
  menuClassName = 'w-full',
  align = 'left',
}: Props<T>) {
  const [open, setOpen] = useState(false);
  const [openUp, setOpenUp] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [open]);

  const openMenu = () => {
    const rect = rootRef.current?.getBoundingClientRect();
    setOpenUp(!!rect && window.innerHeight - rect.bottom < MENU_SPACE && rect.top > MENU_SPACE);
    setActiveIndex(Math.max(0, options.findIndex((o) => o.value === value)));
    setOpen(true);
  };

  const choose = (option: SelectOption<T>) => {
    onChange(option.value);
    setOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) {
        e.preventDefault();
        openMenu();
      }
      return;
    }
    if (e.key === 'Escape' || e.key === 'Tab') {
      setOpen(false);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, options.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      choose(options[activeIndex]);
    }
  };

  return (
    <div ref={rootRef} className={`relative inline-block ${wrapperClassName}`}>
      <button
        type="button"
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => (open ? setOpen(false) : openMenu())}
        onKeyDown={handleKeyDown}
        className={`flex w-full items-center justify-between gap-2 text-left cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${className}`}
      >
        <span className="truncate">{selected?.label}</span>
        <ChevronDown size={14} className={`shrink-0 opacity-60 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <ul
          id={listId}
          role="listbox"
          className={`absolute z-30 ${openUp ? 'bottom-full mb-1' : 'top-full mt-1'} ${align === 'right' ? 'right-0' : 'left-0'} ${menuClassName} min-w-full py-1 rounded-lg border border-slate-200 bg-white shadow-lg text-sm dark:border-slate-700 dark:bg-slate-900`}
        >
          {options.map((option, i) => {
            const isSelected = option.value === value;
            return (
              <li
                key={String(option.value)}
                role="option"
                aria-selected={isSelected}
                onPointerEnter={() => setActiveIndex(i)}
                onClick={() => choose(option)}
                className={`flex items-center justify-between gap-3 px-3 py-1.5 cursor-pointer whitespace-nowrap ${
                  i === activeIndex ? 'bg-slate-100 dark:bg-slate-800' : ''
                } ${isSelected ? 'font-medium text-blue-600 dark:text-blue-400' : 'text-slate-700 dark:text-slate-200'}`}
              >
                {option.label}
                {isSelected && <Check size={14} />}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
