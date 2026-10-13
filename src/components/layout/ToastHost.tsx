'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, X } from 'lucide-react';
import Link from 'next/link';
import { ProductImage } from '@/components/product/ProductImage';
import { useToasts } from '@/store/toasts';

export function ToastHost() {
  const { toasts, dismiss } = useToasts();
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-20 z-[120] flex flex-col items-center gap-2 px-4 sm:bottom-6 sm:items-start sm:px-6" role="status" aria-live="polite">
      <AnimatePresence initial={false}>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            layout
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.18 }}
            className="pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-xl border border-stone/70 bg-white p-3 shadow-card-hover"
          >
            {t.image ? (
              <span className="relative h-14 w-10 shrink-0 overflow-hidden rounded bg-parchment/60">
                <ProductImage src={t.image} alt="" sizes="40px" />
              </span>
            ) : (
              <CheckCircle2 className="size-6 shrink-0 text-emerald" aria-hidden />
            )}
            <div className="min-w-0 flex-1 font-sans">
              <p className="text-sm font-semibold text-navy">{t.title}</p>
              {t.description && <p className="truncate text-xs text-muted">{t.description}</p>}
            </div>
            {t.action && (
              <Link href={t.action.href} onClick={() => dismiss(t.id)} className="shrink-0 rounded-lg bg-navy px-3 py-2 font-sans text-xs font-semibold text-white hover:bg-navy-soft">
                {t.action.label}
              </Link>
            )}
            <button type="button" onClick={() => dismiss(t.id)} aria-label="Dismiss" className="shrink-0 text-muted hover:text-navy">
              <X className="size-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
