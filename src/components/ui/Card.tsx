import type { PropsWithChildren, ReactNode } from 'react'

export function Card({ title, subtitle, action, children }: PropsWithChildren<{ title?: ReactNode, subtitle?: ReactNode, action?: ReactNode }>) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/60 p-5 shadow-xl backdrop-blur dark:border-white/10 dark:bg-white/5">
      {(title || action) && (
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            {title && <div className="text-base font-semibold leading-6">{title}</div>}
            {subtitle && <div className="text-xs text-gray-600 dark:text-gray-400">{subtitle}</div>}
          </div>
          {action}
        </div>
      )}
      <div className="text-sm">{children}</div>
    </div>
  )
}
