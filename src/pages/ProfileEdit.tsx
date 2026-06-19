import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import TagSelector from '@/components/TagSelector'
import { FAVORITE_TYPES, DURATIONS, REVIEW_HABITS, RED_FLAGS } from '@/types'
import { cn } from '@/lib/utils'

export default function ProfileEdit() {
  const navigate = useNavigate()
  const location = useLocation()
  const { currentPlayer, updateProfile } = useAppStore()

  const [nickname, setNickname] = useState(currentPlayer?.nickname ?? '')
  const [avatar, setAvatar] = useState(currentPlayer?.avatar ?? '🕵️')
  const [favoriteTypes, setFavoriteTypes] = useState<string[]>(currentPlayer?.favoriteTypes ?? [])
  const [duration, setDuration] = useState(currentPlayer?.acceptableDuration ?? '3-5小时')
  const [willingToTakeNotes, setWillingToTakeNotes] = useState(currentPlayer?.willingToTakeNotes ?? false)
  const [reviewHabit, setReviewHabit] = useState(currentPlayer?.reviewHabit ?? '偶尔复盘')
  const [redFlags, setRedFlags] = useState<string[]>(currentPlayer?.redFlags ?? [])

  const AVATARS = ['🕵️', '🔍', '🧠', '📝', '🎯', '🌙', '🎭', '🔮', '💀', '⚔️']

  const handleSubmit = () => {
    if (!nickname.trim()) return
    updateProfile({
      nickname: nickname.trim(),
      avatar,
      favoriteTypes,
      acceptableDuration: duration,
      willingToTakeNotes,
      reviewHabit,
      redFlags,
    })
    if (location.state?.from) {
      navigate(location.state.from)
    } else {
      navigate('/profile')
    }
  }

  return (
    <div className="min-h-screen bg-noir">
      <header className="glass sticky top-0 z-40 flex items-center gap-3 px-4 py-3">
        <button onClick={() => location.state?.from ? navigate(location.state.from) : navigate(-1)} className="text-ghost-dim hover:text-ghost transition-colors">
          <ArrowLeft size={22} />
        </button>
        <h1 className="font-display text-lg text-amber">推理档案</h1>
      </header>

      <div className="mx-auto max-w-lg space-y-6 p-4">
        <section className="space-y-3">
          <label className="text-xs font-medium text-ghost-dim uppercase tracking-wider">头像</label>
          <div className="flex flex-wrap gap-2">
            {AVATARS.map((a) => (
              <button
                key={a}
                onClick={() => setAvatar(a)}
                className={cn(
                  'flex h-11 w-11 items-center justify-center rounded-xl text-xl transition-all',
                  avatar === a
                    ? 'bg-amber/20 ring-2 ring-amber scale-110'
                    : 'bg-noir-light hover:bg-noir-light/70'
                )}
              >
                {a}
              </button>
            ))}
          </div>
        </section>

        <section className="space-y-2">
          <label className="text-xs font-medium text-ghost-dim uppercase tracking-wider">昵称</label>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="你的推理代号"
            className="input-base w-full"
            maxLength={12}
          />
        </section>

        <section className="space-y-3">
          <label className="text-xs font-medium text-ghost-dim uppercase tracking-wider">常玩本型</label>
          <TagSelector
            options={[...FAVORITE_TYPES]}
            selected={favoriteTypes}
            onChange={setFavoriteTypes}
            max={4}
          />
        </section>

        <section className="space-y-3">
          <label className="text-xs font-medium text-ghost-dim uppercase tracking-wider">可接受时长</label>
          <div className="flex flex-wrap gap-2">
            {DURATIONS.map((d) => (
              <button
                key={d}
                onClick={() => setDuration(d)}
                className={cn(
                  'rounded-full border px-3 py-1.5 text-sm transition-all',
                  duration === d
                    ? 'bg-amber/20 text-amber-light border-amber/40'
                    : 'bg-smoke/50 text-ghost-dim border-transparent hover:bg-smoke/40'
                )}
              >
                {d}
              </button>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <label className="text-xs font-medium text-ghost-dim uppercase tracking-wider">复盘习惯</label>
          <div className="flex flex-wrap gap-2">
            {REVIEW_HABITS.map((h) => (
              <button
                key={h}
                onClick={() => setReviewHabit(h)}
                className={cn(
                  'rounded-full border px-3 py-1.5 text-sm transition-all',
                  reviewHabit === h
                    ? 'bg-amber/20 text-amber-light border-amber/40'
                    : 'bg-smoke/50 text-ghost-dim border-transparent hover:bg-smoke/40'
                )}
              >
                {h}
              </button>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <label className="text-xs font-medium text-ghost-dim uppercase tracking-wider">是否愿意做笔记</label>
          <button
            role="switch"
            aria-checked={willingToTakeNotes}
            onClick={() => setWillingToTakeNotes(!willingToTakeNotes)}
            className={cn(
              'relative inline-flex h-7 w-12 items-center rounded-full transition-colors',
              willingToTakeNotes ? 'bg-amber' : 'bg-smoke/50'
            )}
          >
            <span
              className={cn(
                'inline-block h-5 w-5 rounded-full bg-ghost shadow-md transition-transform',
                willingToTakeNotes ? 'translate-x-6' : 'translate-x-1'
              )}
            />
          </button>
        </section>

        <section className="space-y-3">
          <label className="text-xs font-medium text-ghost-dim uppercase tracking-wider">雷点</label>
          <TagSelector
            options={[...RED_FLAGS]}
            selected={redFlags}
            onChange={setRedFlags}
            max={5}
          />
        </section>

        <button
          onClick={handleSubmit}
          disabled={!nickname.trim()}
          className={cn(
            'w-full rounded-xl py-3.5 text-sm font-semibold transition-all',
            nickname.trim()
              ? 'bg-amber text-noir hover:bg-amber-light active:scale-[0.98]'
              : 'bg-smoke/30 text-smoke cursor-not-allowed'
          )}
        >
          {currentPlayer ? '保存档案' : '创建档案'}
        </button>
      </div>
    </div>
  )
}
