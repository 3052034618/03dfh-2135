import { cn } from '@/lib/utils'

interface TagSelectorProps {
  options: string[]
  selected: string[]
  onChange: (selected: string[]) => void
  max?: number
}

export default function TagSelector({ options, selected, onChange, max }: TagSelectorProps) {
  function toggle(tag: string) {
    if (selected.includes(tag)) {
      onChange(selected.filter((t) => t !== tag))
      return
    }
    if (max && selected.length >= max) return
    onChange([...selected, tag])
  }

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((tag) => {
        const isSelected = selected.includes(tag)
        return (
          <button
            key={tag}
            type="button"
            onClick={() => toggle(tag)}
            className={cn(
              'rounded-full px-3 py-1 text-sm transition-all',
              isSelected
                ? 'bg-amber/20 text-amber-light border border-amber/40'
                : 'bg-smoke/50 text-ghost-dim border border-transparent hover:bg-smoke/30',
            )}
          >
            {tag}
          </button>
        )
      })}
    </div>
  )
}
