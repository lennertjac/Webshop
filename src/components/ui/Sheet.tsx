'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { X } from 'lucide-react';
import clsx from 'clsx';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

type Side = 'right' | 'left' | 'bottom' | 'center' | 'top';

const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

interface SheetProps {
  open: boolean;
  onClose: () => void;
  label: string;
  side?: Side;
  children: ReactNode;
  className?: string;
  hideClose?: boolean;
}

/** Accessible overlay (drawer / bottom sheet / modal): focus trap, Esc to close, scroll lock. */
export function Sheet({ open, onClose, label, side = 'right', children, className, hideClose }: SheetProps) {
  const panel = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    const t = setTimeout(() => {
      const el = panel.current?.querySelector<HTMLElement>('[data-autofocus]') ?? panel.current;
      el?.focus();
    }, 30);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') return onClose();
      if (e.key !== 'Tab' || !panel.current) return;
      const items = [...panel.current.querySelectorAll<HTMLElement>(FOCUSABLE)].filter((el) => el.offsetParent !== null);
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      clearTimeout(t);
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = overflow;
      previous?.focus?.();
    };
  }, [open, onClose]);

  const initial = {
    right: { x: '100%' },
    left: { x: '-100%' },
    bottom: { y: '100%' },
    top: { y: '-100%' },
    center: { opacity: 0, scale: 0.97 },
  }[side];
  const animate = { x: 0, y: 0, opacity: 1, scale: 1 };

  const position = {
    right: 'right-0 top-0 h-dvh w-full max-w-md',
    left: 'left-0 top-0 h-dvh w-full max-w-sm',
    bottom: 'bottom-0 left-0 right-0 max-h-[88dvh] rounded-t-2xl',
    top: 'left-0 right-0 top-0 h-dvh sm:h-auto sm:max-h-[85dvh] sm:rounded-b-2xl',
    center: 'left-1/2 top-1/2 max-h-[90dvh] w-[calc(100%-2rem)] max-w-4xl -translate-x-1/2 -translate-y-1/2 rounded-2xl',
  }[side];

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100]">
          <motion.div
            className="absolute inset-0 bg-navy/50 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.2 }}
            onClick={onClose}
            aria-hidden
          />
          <motion.div
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-label={label}
            tabIndex={-1}
            className={clsx('fixed flex flex-col overflow-hidden bg-ivory shadow-2xl outline-none', position, className)}
            initial={reduce ? { opacity: 0 } : initial}
            animate={reduce ? { opacity: 1 } : animate}
            exit={reduce ? { opacity: 0 } : initial}
            transition={{ duration: reduce ? 0 : 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            {!hideClose && (
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="absolute right-3 top-3 z-20 grid size-9 place-items-center rounded-full bg-white/90 text-navy shadow hover:bg-white"
              >
                <X className="size-5" />
              </button>
            )}
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
