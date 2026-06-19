import { Clock, MapPin, Users } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Recruitment, Player, Difficulty } from '@/types'
import { DifficultyBadge } from '@/components/DifficultyBadge'

const BORDER_COLORS: Record<Difficulty, string> = {
  '进阶': 'border-l-amber',
  '烧脑': 'border-l-crimson',
  '地狱': 'border-l-red-500',
}

const STATUS_MAP: Record<string, string> = {
  '招募中': 'bg-amber/20 text-amber border-amber/30',
  '已满员': 'bg-smoke/20 text-smoke border-smoke/30',
  '已截止': 'bg-ghost-dim/20 text-ghost-dim border-ghost-dim/30',
}

interface TeamCardProps {
  recruitment: Recruitment
  organizer: Player
  className?: string
}

export default function TeamCard({ recruitment, organizer, className }: TeamCardProps) {
  const remaining = Math.max(0, recruitment.totalPlayers - recruitment.currentPlayers)

  return (
    <div
      className={cn(
        'rounded-lg border-l-4 bg-noir-surface p-4 transition-all hover:bg-noir-light hover:shadow-lg hover:shadow-amber/5',
        BORDER_COLORS[recruitment.difficulty],
        className,
      )}
    >
      <div className="mb-3 flex items-start justify-between gap-2">
        <h3 className="font-display text-base font-bold text-ghost">
          {recruitment.scriptName}
        </h3>
        <DifficultyBadge difficulty={recruitment.difficulty} />
      </div>

      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="flex items-center gap-1 text-ghost-dim">
          <Users size={14} className="text-amber/70" />
          <span>{recruitment.currentPlayers}/{recruitment.totalPlayers}人</span>
        </span>
        <span
          className={cn(
            'rounded-full px-2 py-0.5 text-xs',
            remaining > 0
              ? 'bg-amber/20 text-amber-light'
              : 'bg-smoke/20 text-smoke',
          )}
        >
          {remaining > 0 ? `缺${remaining}位` : '已满'}
        </span>
      </div>

      <div className="mb-2 flex items-center gap-1 text-sm text-ghost-dim">
        <Clock size={14} className="text-amber/70" />
        <span>{recruitment.driveTime}</span>
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
          <span
            className={cn(
              'rounded-md border px-2 py-0.5 text-xs',
              STATUS_MAP[recruitment.status] || 'bg-smoke/20 text-smoke border-smoke/30',
            )}
          >
            {recruitment.status}
          </span>
        )}
      </div>
    </div>
  )
}
