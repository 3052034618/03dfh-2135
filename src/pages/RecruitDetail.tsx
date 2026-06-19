import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, BookOpen, UserCheck, FileText } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import DifficultyBadge from '@/components/DifficultyBadge';
import ProfileCard from '@/components/ProfileCard';
import { cn } from '@/lib/utils';
import type { AppStatus, Player, Recruitment } from '@/types';

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

const cardCls = 'rounded-lg border border-noir-light/30 bg-noir-light/20 p-3';
const labelCls = 'mb-1.5 text-[11px] text-ghost-dim';

function MatchReference({ player, recruitment }: { player: Player; recruitment: Recruitment }) {
  return (
    <div className="mt-3">
      <div className="mb-2 text-xs font-medium tracking-wider text-smoke uppercase">匹配参考</div>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3">
        <div className={cardCls}>
          <p className={labelCls}>本型偏好</p>
          <div className="flex flex-wrap gap-1">
            {player.favoriteTypes.map((t) => (
              <span key={t} className="rounded-md bg-amber/15 px-1.5 py-0.5 text-[11px] text-amber-light border border-amber/25">{t}</span>
            ))}
          </div>
        </div>
        <div className={cardCls}><p className={labelCls}>剧本难度</p><DifficultyBadge difficulty={recruitment.difficulty} /></div>
        <div className={cardCls}><p className={labelCls}>可接受时长</p><div className="flex items-center gap-1 text-sm text-ghost/80"><Clock className="h-3.5 w-3.5 text-amber" /><span>{player.acceptableDuration}</span></div></div>
        <div className={cardCls}><p className={labelCls}>人数要求</p><span className="text-sm text-ghost/80">{recruitment.currentPlayers}/{recruitment.totalPlayers} 人</span></div>
        <div className={cardCls}><p className={labelCls}>笔记习惯</p><span className={cn('text-sm', player.willingToTakeNotes ? 'text-amber-light' : 'text-smoke')}>{player.willingToTakeNotes ? '✓ 记笔记' : '✗ 不记笔记'}</span></div>
        <div className={cardCls}><p className={labelCls}>要求速读</p><span className={cn('text-sm', recruitment.requireFastReading ? 'text-amber-light' : 'text-smoke')}>{recruitment.requireFastReading ? '✓' : '✗'}</span></div>
        <div className={cardCls}><p className={labelCls}>复盘习惯</p><span className="text-sm text-ghost/80">{player.reviewHabit}</span></div>
        <div className={cardCls}><p className={labelCls}>接受替补</p><span className={cn('text-sm', recruitment.acceptSubstitute ? 'text-amber-light' : 'text-smoke')}>{recruitment.acceptSubstitute ? '✓' : '✗'}</span></div>
        {player.redFlags.length > 0 && (
          <div className={cn(cardCls, 'sm:col-span-2')}>
            <p className={labelCls}>雷区</p>
            <div className="flex flex-wrap gap-1">
              {player.redFlags.map((f) => (
                <span key={f} className="rounded-md bg-crimson/20 px-1.5 py-0.5 text-[11px] text-crimson-light border border-crimson/30">{f}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function RecruitDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [intro, setIntro] = useState('');
  const [reviewingAppId, setReviewingAppId] = useState<string | null>(null);
  const [remark, setRemark] = useState('');

  const currentPlayer = useAppStore((s) => s.currentPlayer);
  const getRecruitmentById = useAppStore((s) => s.getRecruitmentById);
  const getApplicationsByRecruitment = useAppStore((s) => s.getApplicationsByRecruitment);
  const getPlayerById = useAppStore((s) => s.getPlayerById);
  const submitApplication = useAppStore((s) => s.submitApplication);
  const reviewApplication = useAppStore((s) => s.reviewApplication);
  const cancelConfirm = useAppStore((s) => s.cancelConfirm);
  const toggleContacted = useAppStore((s) => s.toggleContacted);
  const toggleSubstitute = useAppStore((s) => s.toggleSubstitute);
  const hasApplied = useAppStore((s) => s.hasApplied);
  const getMyApplications = useAppStore((s) => s.getMyApplications);

  const recruitment = getRecruitmentById(id ?? '');
  const applications = getApplicationsByRecruitment(id ?? '');
  const isOrganizer = currentPlayer?.id === recruitment?.organizerId;
  const myApp = getMyApplications().find((a) => a.recruitmentId === id);
  const alreadyApplied = hasApplied(id ?? '');
  const isFull = recruitment ? recruitment.currentPlayers >= recruitment.totalPlayers : false;
  const isClosed = recruitment?.status === '已满员' || recruitment?.status === '已截止';

  useEffect(() => { if (alreadyApplied && myApp && intro) setIntro(''); }, [alreadyApplied, myApp, intro]);

  if (!recruitment) {
    return <div className="flex min-h-screen items-center justify-center bg-noir font-body text-ghost-dim"><p>招募不存在或已删除</p></div>;
  }

  const handleSubmit = () => { if (!intro.trim() || !id || !currentPlayer) return; submitApplication(id, intro.trim()); };
  const canConfirm = (s: AppStatus) => s === '待审核' && !isFull;
  const openReview = (aid: string) => { setReviewingAppId(aid); setRemark(''); };
  const closeReview = () => { setReviewingAppId(null); setRemark(''); };
  const handleReview = (aid: string, status: '已确认' | '已婉拒') => { reviewApplication(aid, status, remark.trim() || undefined); closeReview(); };

  const badgeCls = 'rounded-full border px-2 py-0.5 text-xs font-medium';
  const btnBase = 'rounded-lg px-4 py-1.5 text-sm font-medium transition-colors';

  return (
    <div className="min-h-screen bg-noir font-body text-ghost">
      <div className="mx-auto max-w-lg px-4 pb-44 pt-4">
        <button onClick={() => navigate(-1)} className="mb-4 flex items-center gap-1.5 text-sm text-ghost-dim transition-colors hover:text-amber">
          <ArrowLeft className="h-4 w-4" />返回
        </button>

        <div className="animate-fade-in rounded-xl border border-noir-light/40 bg-noir-surface/80 p-5 backdrop-blur-md">
          <div className="mb-3 flex items-start justify-between gap-3">
            <h1 className="font-display text-2xl font-bold leading-tight text-ghost">{recruitment.scriptName}</h1>
            <span className={cn('shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-medium', STATUS_MAP[recruitment.status])}>{recruitment.status}</span>
          </div>
          <div className="mb-4 flex items-center gap-2">
            <DifficultyBadge difficulty={recruitment.difficulty} />
            <span className="text-sm text-ghost-dim">{recruitment.currentPlayers}/{recruitment.totalPlayers} 人</span>
          </div>
          <div className="mb-4 space-y-2 text-sm">
            <div className="flex items-center gap-2 text-ghost/80"><MapPin className="h-4 w-4 shrink-0 text-amber" />{recruitment.store}</div>
            <div className="flex items-center gap-2 text-ghost/80"><Clock className="h-4 w-4 shrink-0 text-amber" />{recruitment.driveTime}</div>
          </div>
          {recruitment.missingRoles.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-1.5">
              {recruitment.missingRoles.map((r) => <span key={r} className="rounded-md bg-amber/10 px-2 py-0.5 text-xs text-amber-light">{r}</span>)}
            </div>
          )}
          <div className="mb-4 flex flex-wrap gap-3 text-sm">
            {recruitment.requireFastReading && <div className="flex items-center gap-1.5 text-amber-light"><BookOpen className="h-4 w-4" /><span>需速读</span></div>}
            {recruitment.acceptSubstitute && <div className="flex items-center gap-1.5 text-amber-light"><UserCheck className="h-4 w-4" /><span>接受替补</span></div>}
          </div>
          <p className="text-sm leading-relaxed text-ghost/70">{recruitment.description}</p>
        </div>

        {isOrganizer && (
          <div className="mt-6 animate-slide-up">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-medium text-ghost">报名列表<span className="ml-2 text-sm text-ghost-dim">({applications.length})</span></h2>
              {isFull && <span className="rounded-full bg-smoke/20 px-2 py-0.5 text-xs text-smoke">已满员</span>}
            </div>
            {applications.length === 0 ? (
              <p className="py-8 text-center text-sm text-ghost-dim">暂无报名</p>
            ) : (
              <div className="space-y-3">
                {applications.map((app) => {
                  const player = getPlayerById(app.playerId);
                  if (!player) return null;
                  const reviewed = app.status !== '待审核';
                  const confirmDisabled = !canConfirm(app.status);
                  const isConfirmed = app.status === '已确认';
                  const isReviewingThis = reviewingAppId === app.id;
                  return (
                    <div key={app.id} className="rounded-lg border border-noir-light/30 bg-noir-surface/60 p-4 backdrop-blur-sm">
                      <ProfileCard player={player} />
                      <MatchReference player={player} recruitment={recruitment} />
                      <div className="my-3 border-t border-noir-light/30" />
                      <p className="text-sm text-ghost/60">{app.selfIntroduction}</p>
                      {reviewed ? (
                        <div className="mt-3">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className={cn(badgeCls, app.isSubstitute ? 'bg-smoke/15 text-ghost-dim border-smoke/25' : APP_STATUS_MAP[app.status])}>
                              {app.isSubstitute ? '替补中' : app.status}
                            </span>
                            {app.contacted && <span className={cn(badgeCls, 'border-emerald-500/30 bg-emerald-500/15 text-emerald-400')}>✓已联系</span>}
                            {app.isSubstitute && <span className={cn(badgeCls, 'border-blue-500/30 bg-blue-500/15 text-blue-400')}>替补</span>}
                          </div>
                          {app.remark && (
                            <div className={cn('mt-2 rounded-lg border p-2.5 text-xs leading-relaxed',
                              app.status === '已婉拒' ? 'border-crimson/20 bg-crimson/10 text-crimson-light/90' : 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400/90')}>
                              {app.remark}
                            </div>
                          )}
                          {isConfirmed && (
                            <div className="mt-3 flex flex-wrap gap-2 border-t border-noir-light/20 pt-3">
                              <button onClick={() => toggleContacted(app.id)} className={cn('rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors',
                                app.contacted ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25' : 'border-noir-light/30 bg-noir-light/20 text-ghost-dim hover:bg-noir-light/30')}>
                                {app.contacted ? '✓已联系' : '标记已联系'}
                              </button>
                              <button onClick={() => toggleSubstitute(app.id)} className={cn('rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors',
                                app.isSubstitute ? 'border-blue-500/40 bg-blue-500/15 text-blue-400 hover:bg-blue-500/25' : 'border-noir-light/30 bg-noir-light/20 text-ghost-dim hover:bg-noir-light/30')}>
                                {app.isSubstitute ? '取消替补' : '设为替补'}
                              </button>
                              <button onClick={() => cancelConfirm(app.id)} className="rounded-lg border border-crimson/40 px-3 py-1.5 text-xs font-medium text-crimson-light transition-colors hover:bg-crimson/15">
                                取消确认
                              </button>
                            </div>
                          )}
                        </div>
                      ) : isReviewingThis ? (
                        <div className="mt-3 space-y-3">
                          <textarea value={remark} onChange={(e) => setRemark(e.target.value)} placeholder="添加审核备注（可选）..." rows={2}
                            className="w-full resize-none rounded-lg border border-noir-light/40 bg-noir-light/30 px-3 py-2 text-sm text-ghost placeholder:text-ghost-dim/50 focus:border-amber/50 focus:outline-none focus:ring-1 focus:ring-amber/30" />
                          <div className="flex gap-2">
                            <button onClick={() => handleReview(app.id, '已确认')} disabled={confirmDisabled} className={cn(btnBase, confirmDisabled ? 'cursor-not-allowed bg-smoke/30 text-ghost-dim' : 'bg-amber/90 text-noir hover:bg-amber')}>
                              确认{isFull && '（已满）'}
                            </button>
                            <button onClick={() => handleReview(app.id, '已婉拒')} className={cn(btnBase, 'bg-crimson/80 text-ghost hover:bg-crimson')}>婉拒</button>
                            <button onClick={closeReview} className={cn(btnBase, 'border border-noir-light/30 text-ghost-dim hover:bg-noir-light/20')}>取消</button>
                          </div>
                        </div>
                      ) : (
                        <div className="mt-3 flex gap-2">
                          <button onClick={() => openReview(app.id)} disabled={confirmDisabled} className={cn(btnBase, confirmDisabled ? 'cursor-not-allowed bg-smoke/30 text-ghost-dim' : 'bg-amber/90 text-noir hover:bg-amber')}>
                            确认{isFull && '（已满）'}
                          </button>
                          <button onClick={() => openReview(app.id)} className={cn(btnBase, 'bg-crimson/80 text-ghost hover:bg-crimson')}>婉拒</button>
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
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-noir-light/40 bg-noir-surface/95 p-4 backdrop-blur-xl pb-safe">
          <div className="mx-auto max-w-lg">
            {!currentPlayer ? (
              <div className="flex flex-col items-center gap-3 py-2 text-center">
                <div className="flex items-center gap-2 text-sm text-ghost-dim"><FileText size={16} /><span>创建推理档案后才能报名</span></div>
                <Link to="/profile/edit" state={{ from: location.pathname }} className="w-full rounded-lg bg-amber py-2.5 text-sm font-medium text-noir transition-all hover:bg-amber-light active:scale-[0.98]">先创建档案</Link>
              </div>
            ) : alreadyApplied && myApp ? (
              <div className="flex flex-col items-center gap-2 py-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-ghost-dim">报名状态：</span>
                  <span className={cn('rounded-full border px-2.5 py-0.5 text-xs font-medium', APP_STATUS_MAP[myApp.status])}>{myApp.status}</span>
                </div>
                <p className="text-xs text-ghost-dim/70">{myApp.selfIntroduction}</p>
                {myApp.remark && (
                  <div className={cn('mt-1 w-full rounded-lg border p-2 text-xs leading-relaxed',
                    myApp.status === '已婉拒' ? 'border-crimson/20 bg-crimson/10 text-crimson-light/90' : 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400/90')}>
                    {myApp.remark}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-noir-light text-sm">{currentPlayer.avatar}</span>
                  <span className="text-sm text-ghost-dim">{currentPlayer.nickname} · {currentPlayer.favoriteTypes.slice(0, 2).join('、')}</span>
                </div>
                <textarea value={intro} onChange={(e) => setIntro(e.target.value)} placeholder="介绍一下自己，让组织者更了解你..." rows={3}
                  className="w-full resize-none rounded-lg border border-noir-light/40 bg-noir-light/30 px-3 py-2 text-sm text-ghost placeholder:text-ghost-dim/50 focus:border-amber/50 focus:outline-none focus:ring-1 focus:ring-amber/30" />
                <button onClick={handleSubmit} disabled={isClosed || !intro.trim()} className={cn('w-full rounded-lg py-2.5 text-sm font-medium transition-all',
                  isClosed || !intro.trim() ? 'cursor-not-allowed bg-smoke/30 text-ghost-dim' : 'bg-amber/90 text-noir hover:bg-amber active:scale-[0.98]')}>
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
