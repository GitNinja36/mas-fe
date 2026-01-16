import type { TextareaHTMLAttributes, InputHTMLAttributes, ReactNode } from 'react'

export function Label({ children }: { children: ReactNode }) {
  return <span className="mb-1 block text-sm font-medium text-gray-800 dark:text-gray-200">{children}</span>
}

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={[
        'w-full rounded-xl border border-gray-300/70 bg-white/80 p-2 text-sm shadow-sm outline-none transition dark:border-white/10 dark:bg-white/10',
        'focus:ring-2 focus:ring-blue-500/40',
        props.className ?? '',
      ].join(' ')}
    />
  )
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={[
        'w-full rounded-xl border border-gray-300/70 bg-white/80 p-2 text-sm shadow-sm outline-none transition dark:border-white/10 dark:bg-white/10',
        'focus:ring-2 focus:ring-blue-500/40',
        props.className ?? '',
      ].join(' ')}
    />
  )
}
