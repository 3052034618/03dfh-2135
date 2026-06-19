import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { SlidersHorizontal, Plus, Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store/useAppStore';
import TeamCard from '@/components/TeamCard';
import type { Difficulty } from '@/types';
import { DIFFICULTIES } from '@/types';

const SCRIPT_TYPES = ['硬核推理', '机制阵营', '还原推凶'] as const;
const STATUS_OPTIONS = ['招募中', '已满员'] as const;

interface Filters {
  difficulty: Difficulty | '';
  scriptType: string;
  status: string;
}

export default function Home() {
  const navigate = useNavigate();
  const recruitments = useAppStore((s) => s.recruitments);
  const getPlayerById = useAppStore((s) => s.getPlayerById);
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    difficulty: '',
    scriptType: '',
    status: '',
  });

  const filtered = recruitments.filter((r) => {
    if (filters.difficulty && r.difficulty !== filters.difficulty) return false;
    if (filters.scriptType && !r.description.includes(filters.scriptType)) return false;
    if (filters.status && r.status !== filters.status) return false;
    return true;
  });

  const resetFilters = useCallback(() => {
    setFilters({ difficulty: '', scriptType: '', status: '' });
  }, []);

  const applyFilters = useCallback(() => {
    setShowFilter(false);
  }, []);

  const hasActiveFilter = filters.difficulty || filters.scriptType || filters.status;

  return (
    <div className="noise-bg min-h-screen bg-noir pb-24">
      <header className="glass sticky top-0 z-40 flex items-center justify-between px-4 py-3">
        <button
          onClick={() => setShowFilter(true)}
          className={cn(
            'rounded-lg p-2 transition-colors',
            hasActiveFilter ? 'text-amber' : 'text-ghost-dim hover:text-ghost',
          )}
        >
          <SlidersHorizontal size={20} />
        </button>
        <h1 className="font-display text-2xl font-bold tracking-wide text-amber">
          拼车局
        </h1>
        <button
          onClick={() => navigate('/create')}
          className="rounded-lg p-2 text-ghost-dim transition-colors hover:text-amber"
        >
          <Plus size={20} />
        </button>
      </header>

      <main className="scrollbar-hide px-4 pt-4">
        {filtered.length > 0 ? (
          <div className="space-y-3">
            {filtered.map((rec, i) => {
              const organizer = getPlayerById(rec.organizerId);
              if (!organizer) return null;
              return (
                <div
                  key={rec.id}
                  className="animate-float-in opacity-0"
                  style={{ animationDelay: `${i * 80}ms` }}
                  onClick={() => navigate(`/recruit/${rec.id}`)}
                >
                  <TeamCard recruitment={rec} organizer={organizer} />
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center pt-32 text-center">
            <div className="mb-4 rounded-full bg-noir-surface p-6">
              <Search size={48} className="text-amber/40" />
            </div>
            <p className="mb-6 font-display text-xl text-ghost-dim">暂无车队</p>
            <button
              onClick={() => navigate('/create')}
              className="rounded-full bg-amber px-6 py-2.5 font-medium text-noir transition-all hover:bg-amber-light active:scale-95"
            >
              发起拼车
            </button>
          </div>
        )}
      </main>

      {showFilter && (
        <div className="fixed inset-0 z-50" onClick={() => setShowFilter(false)}>
          <div className="absolute inset-0 bg-black/60 animate-fade-in" />
          <div
            className="absolute bottom-0 left-0 right-0 rounded-t-2xl bg-noir-surface p-5 animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold text-ghost">筛选条件</h2>
              <button onClick={() => setShowFilter(false)} className="text-smoke hover:text-ghost">
                <X size={20} />
              </button>
            </div>

            <section className="mb-4">
              <h3 className="mb-2 text-sm text-ghost-dim">难度</h3>
              <div className="flex flex-wrap gap-2">
                {DIFFICULTIES.map((d) => (
                  <button
                    key={d}
                    onClick={() =>
                      setFilters((f) => ({ ...f, difficulty: f.difficulty === d ? '' : d }))
                    }
                    className={cn(
                      'rounded-full border px-3 py-1.5 text-sm transition-all',
                      filters.difficulty === d
                        ? 'border-amber bg-amber/20 text-amber'
                        : 'border-noir-light text-ghost-dim hover:border-smoke',
                    )}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </section>

            <section className="mb-4">
              <h3 className="mb-2 text-sm text-ghost-dim">剧本类型</h3>
              <div className="flex flex-wrap gap-2">
                {SCRIPT_TYPES.map((t) => (
                  <button
                    key={t}
                    onClick={() =>
                      setFilters((f) => ({ ...f, scriptType: f.scriptType === t ? '' : t }))
                    }
                    className={cn(
                      'rounded-full border px-3 py-1.5 text-sm transition-all',
                      filters.scriptType === t
                        ? 'border-amber bg-amber/20 text-amber'
                        : 'border-noir-light text-ghost-dim hover:border-smoke',
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </section>

            <section className="mb-6">
              <h3 className="mb-2 text-sm text-ghost-dim">状态</h3>
              <div className="flex flex-wrap gap-2">
                {STATUS_OPTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() =>
                      setFilters((f) => ({ ...f, status: f.status === s ? '' : s }))
                    }
                    className={cn(
                      'rounded-full border px-3 py-1.5 text-sm transition-all',
                      filters.status === s
                        ? 'border-amber bg-amber/20 text-amber'
                        : 'border-noir-light text-ghost-dim hover:border-smoke',
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </section>

            <div className="flex gap-3">
              <button
                onClick={resetFilters}
                className="flex-1 rounded-full border border-noir-light py-2.5 text-sm text-ghost-dim transition-colors hover:border-smoke"
              >
                重置
              </button>
              <button
                onClick={applyFilters}
                className="flex-1 rounded-full bg-amber py-2.5 text-sm font-medium text-noir transition-all hover:bg-amber-light active:scale-95"
              >
                应用
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => navigate('/create')}
        className="fixed bottom-24 right-5 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-amber shadow-lg shadow-amber/25 transition-all hover:bg-amber-light active:scale-90 animate-pulse-glow"
      >
        <Plus size={24} className="text-noir" />
      </button>
    </div>
  );
}
