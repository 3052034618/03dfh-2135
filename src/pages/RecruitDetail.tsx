import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, BookOpen, UserCheck } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import DifficultyBadge from '@/components/DifficultyBadge';
import ProfileCard from '@/components/ProfileCard';
import { cn } from '@/lib/utils';
import type { AppStatus } from '@/types';

const STATUS_MAP: Record<string, string> = {
  '招募中': 'bg-amber/20 text-amber border-amber/30',
  '已满员': 'bg-smoke/20 text-smoke border-smoke/30',
  '已截止': 'bg-ghost-dim/20 text-ghost-dim border-ghost-dim/30',
};

const APP_STATUS_MAP: Record<AppStatus, string> = {
  '待审核': 'bg-amber/20 text-amber-light border-amber/30',
  '已确认': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  '已婉拒': 'bg-crimson/20 text-crimson-light border-crimson/30',
};

export default function RecruitDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [intro, setIntro] = useState('');

  const currentPlayer = useAppStore((s) => s.currentPlayer);
  const getRecruitmentById = useAppStore((s) => s.getRecruitmentById);
  const getApplicationsByRecruitment = useAppStore((s) => s.getApplicationsByRecruitment);
  const getPlayerById = useAppStore((s) => s.getPlayerById);
  const submitApplication = useAppStore((s) => s.submitApplication);
  const reviewApplication = useAppStore((s) => s.reviewApplication);
  const hasApplied = useAppStore((s) => s.hasApplied);
  const getMyApplications = useAppStore((s) => s.getMyApplications);

  const recruitment = getRecruitmentById(id ?? '');
  const applications = getApplicationsByRecruitment(id ?? '');
  const isOrganizer = currentPlayer?.id === recruitment?.organizerId;
  const myApp = getMyApplications().find((a) => a.recruitmentId === id);
  const alreadyApplied = hasApplied(id ?? '');
  const isClosed = recruitment?.status === '已满员' || recruitment?.status === '已截止';

  if (!recruitment) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-noir font-body text-ghost-dim">
        <p>招募不存在或已删除</p>
      </div>
    );
  }

  const handleSubmit = () => {
    if (!intro.trim() || !id) return;
    submitApplication(id, intro.trim());
    setIntro('');
  };

  return (
    <div className="min-h-screen bg-noir font-body text-ghost">
      <div className="mx-auto max-w-lg px-4 pb-32 pt-4">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 flex items-center gap-1.5 text-sm text-ghost-dim transition-colors hover:text-amber"
        >
          <ArrowLeft className="h-4 w-4" />
          返回
        </button>

        <div className="animate-fade-in rounded-xl border border-noir-light/40 bg-noir-surface/80 p-5 backdrop-blur-md">
          <div className="mb-3 flex items-start justify-between gap-3">
            <h1 className="font-display text-2xl font-bold leading-tight text-ghost">
              {recruitment.scriptName}
            </h1>
            <span
              className={cn(
                'shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-medium',
                STATUS_MAP[recruitment.status],
              )}
            >
              {recruitment.status}
            </span>
          </div>

          <div className="mb-4 flex items-center gap-2">
            <DifficultyBadge difficulty={recruitment.difficulty} />
            <span className="text-sm text-ghost-dim">
              {recruitment.currentPlayers}/{recruitment.totalPlayers} 人
            </span>
          </div>

          <div className="mb-4 space-y-2 text-sm">
            <div className="flex items-center gap-2 text-ghost/80">
              <MapPin className="h-4 w-4 shrink-0 text-amber" />
              {recruitment.store}
            </div>
            <div className="flex items-center gap-2 text-ghost/80">
              <Clock className="h-4 w-4 shrink-0 text-amber" />
              {recruitment.driveTime}
            </div>
          </div>

          {recruitment.missingRoles.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-1.5">
              {recruitment.missingRoles.map((role) => (
                <span
                  key={role}
                  className="rounded-md bg-amber/10 px-2 py-0.5 text-xs text-amber-light"
                >
                  {role}
                </span>
              ))}
            </div>
          )}

          <div className="mb-4 flex flex-wrap gap-3 text-sm">
            {recruitment.requireFastReading && (
              <div className="flex items-center gap-1.5 text-amber-light">
                <BookOpen className="h-4 w-4" />
                <span>需速读</span>
              </div>
            )}
            {recruitment.acceptSubstitute && (
              <div className="flex items-center gap-1.5 text-amber-light">
                <UserCheck className="h-4 w-4" />
                <span>接受替补</span>
              </div>
            )}
          </div>

          <p className="text-sm leading-relaxed text-ghost/70">{recruitment.description}</p>
        </div>

        {isOrganizer && (
          <div className="mt-6 animate-slide-up">
            <h2 className="mb-3 text-lg font-medium text-ghost">
              报名列表
              <span className="ml-2 text-sm text-ghost-dim">({applications.length})</span>
            </h2>
            {applications.length === 0 ? (
              <p className="py-8 text-center text-sm text-ghost-dim">暂无报名</p>
            ) : (
              <div className="space-y-3">
                {applications.map((app) => {
                  const player = getPlayerById(app.playerId);
                  if (!player) return null;
                  const reviewed = app.status !== '待审核';
                  return (
                    <div
                      key={app.id}
                      className="rounded-lg border border-noir-light/30 bg-noir-surface/60 p-4 backdrop-blur-sm"
                    >
                      <ProfileCard player={player} />
                      <p className="mt-2 text-sm text-ghost/60">{app.selfIntroduction}</p>
                      {reviewed ? (
                        <div className="mt-3">
                          <span
                            className={cn(
                              'rounded-full border px-2 py-0.5 text-xs font-medium',
                              APP_STATUS_MAP[app.status],
                            )}
                          >
                            {app.status}
                          </span>
                        </div>
                      ) : (
                        <div className="mt-3 flex gap-2">
                          <button
                            onClick={() => reviewApplication(app.id, '已确认')}
                            className="rounded-lg bg-amber/90 px-4 py-1.5 text-sm font-medium text-noir transition-colors hover:bg-amber"
                          >
                            确认
                          </button>
                          <button
                            onClick={() => reviewApplication(app.id, '已婉拒')}
                            className="rounded-lg bg-crimson/80 px-4 py-1.5 text-sm font-medium text-ghost transition-colors hover:bg-crimson"
                          >
                            婉拒
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {!isOrganizer && (
        <div className="fixed inset-x-0 bottom-0 border-t border-noir-light/40 bg-noir-surface/90 p-4 backdrop-blur-lg">
          <div className="mx-auto max-w-lg">
            {alreadyApplied && myApp ? (
              <div className="flex items-center justify-center gap-2 py-2">
                <span className="text-sm text-ghost-dim">报名状态：</span>
                <span
                  className={cn(
                    'rounded-full border px-2.5 py-0.5 text-xs font-medium',
                    APP_STATUS_MAP[myApp.status],
                  )}
                >
                  {myApp.status}
                </span>
              </div>
            ) : (
              <div className="space-y-3">
                <textarea
                  value={intro}
                  onChange={(e) => setIntro(e.target.value)}
                  placeholder="介绍一下自己，让组织者更了解你..."
                  rows={3}
                  className="w-full resize-none rounded-lg border border-noir-light/40 bg-noir-light/30 px-3 py-2 text-sm text-ghost placeholder:text-ghost-dim/50 focus:border-amber/50 focus:outline-none focus:ring-1 focus:ring-amber/30"
                />
                <button
                  onClick={handleSubmit}
                  disabled={isClosed || !intro.trim()}
                  className={cn(
                    'w-full rounded-lg py-2.5 text-sm font-medium transition-all',
                    isClosed || !intro.trim()
                      ? 'cursor-not-allowed bg-smoke/30 text-ghost-dim'
                      : 'bg-amber/90 text-noir hover:bg-amber',
                  )}
                >
                  {isClosed ? '招募已结束' : '提交报名'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
