
export function Toggle({ checked, onChange, label }: { checked: boolean, onChange: (next: boolean) => void, label?: string }) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm">
      <span className="relative inline-flex h-6 w-10 items-center rounded-full bg-gray-300 transition dark:bg-gray-600">
        <input
          type="checkbox"
          className="peer sr-only"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <span className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition peer-checked:translate-x-4"></span>
      </span>
      {label}
    </label>
  )}
