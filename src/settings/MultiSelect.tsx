import { useEffect, useRef, useState } from 'react'
import { Check, ChevronDown } from 'lucide-react'

type Props<T extends string> = { options: readonly T[]; value: T[]; onChange: (v: T[]) => void }

// Dropdown with checkboxes; selected items show as chips.
export default function MultiSelect<T extends string>({ options, value, onChange }: Props<T>) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const close = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false)
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [open])

  const toggle = (o: T) => onChange(value.includes(o) ? value.filter((v) => v !== o) : [...value, o])

  return (
    <div className="ms" ref={ref}>
      <button type="button" className={`field ms__trigger${open ? ' is-open' : ''}`} onClick={() => setOpen((v) => !v)}>
        <span className="ms__chips">
          {value.length === 0 && <span className="ms__placeholder">Select accounts</span>}
          {value.map((v) => (
            <span key={v} className="chip">
              {v}
            </span>
          ))}
        </span>
        <ChevronDown size={14} />
      </button>
      {open && (
        <div className="ms__menu">
          {options.map((o) => (
            <button type="button" key={o} className="ms__option" onClick={() => toggle(o)}>
              <span className={`checkbox${value.includes(o) ? ' is-on' : ''}`}>{value.includes(o) && <Check size={11} />}</span>
              {o}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
