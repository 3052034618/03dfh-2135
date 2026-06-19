import { Clock, MapPin, Users } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Recruitment, Player, Difficulty } from '@/types'
import { DifficultyBadge } from '@/components/DifficultyBadge'

const BORDER_COLORS: Record<Difficulty, string> = {
  '进阶': 'border-l-amber',
  '烧脑': 'border-l-crimson',
  '地狱': 'border-l-red-500',
}

interface TeamCardProps {
  recruitment: Recruitment
  organizer: Player
  className?: string
}

export default function TeamCard({ recruitment, organizer, className }: TeamCardProps) {
  const missingCount = recruitment.missingRoles.length

  return (
    <div
      className={cn(
        'rounded-lg border-l-4 bg-noir-surface p-4 transition-all hover:bg-noir-light hover:shadow-lg hover:shadow-amber/5',
        BORDER_COLORS[recruitment.difficulty],
        className,
      )}
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <h3 className="font-display text-base font-bold text-ghost">
          {recruitment.scriptName}
        </h3>
        <DifficultyBadge difficulty={recruitment.difficulty} />
      </div>

      <div className="mb-2 flex items-center gap-4 text-sm text-ghost-dim">
        <span className="flex items-center gap-1">
          <Users size={14} className="text-amber/70" />
          <span>缺{missingCount}人</span>
        </span>
        <span className="flex items-center gap-1">
          <Clock size={14} className="text-amber/70" />
          <span>{recruitment.driveTime}</span>
        </span>
      </div>

      <div className="mb-3 flex items-center gap-1 text-sm text-ghost-dim">
        <MapPin size={14} className="text-amber/70" />
        <span>{recruitment.store}</span>
      </div>

      <div className="flex items-center justify-between border-t border-smoke/20 pt-3">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-noir-light text-sm">
            {organizer.avatar}
          </span>
          <span className="text-sm text-ghost-dim">{organizer.nickname}</span>
        </div>
        {recruitment.status !== '招募中' && (
          <span className="text-xs text-smoke">{recruitment.status}</span>
        )}
      </div>
    </div>
  )
}
