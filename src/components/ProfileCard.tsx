import { cn } from '@/lib/utils'
import type { Player } from '@/types'

interface ProfileCardProps {
  player: Player
  className?: string
}

function ProfileCard({ player, className }: ProfileCardProps) {
  return (
    <div
      className={cn(
        'relative rounded-lg p-[1px] bg-gradient-to-br from-amber/40 via-crimson/20 to-noir-light',
        className,
      )}
    >
      <div className="rounded-[7px] bg-noir-surface p-4">
        <div className="mb-3 flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-noir-light text-lg">
            {player.avatar}
          </span>
          <div>
            <h3 className="font-display text-base font-bold text-ghost">{player.nickname}</h3>
            <span className="text-xs text-ghost-dim">{player.acceptableDuration}</span>
          </div>
        </div>

        {player.favoriteTypes.length > 0 && (
          <div className="mb-3">
            <p className="mb-1 text-xs text-smoke">偏好类型</p>
            <div className="flex flex-wrap gap-1.5">
              {player.favoriteTypes.map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-amber/15 px-2 py-0.5 text-xs text-amber-light border border-amber/25"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mb-3 flex items-center gap-3 text-xs text-ghost-dim">
          <span className={cn(player.willingToTakeNotes ? 'text-amber-light' : 'text-smoke')}>
            {player.willingToTakeNotes ? '✓ 记笔记' : '✗ 不记笔记'}
          </span>
          <span>{player.reviewHabit}</span>
        </div>

        {player.redFlags.length > 0 && (
          <div>
            <p className="mb-1 text-xs text-smoke">雷区</p>
            <div className="flex flex-wrap gap-1.5">
              {player.redFlags.map((f) => (
                <span
                  key={f}
                  className="rounded-full bg-crimson/20 px-2 py-0.5 text-xs text-crimson-light border border-crimson/30"
                >
                  {f}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export { ProfileCard }
export default ProfileCard
