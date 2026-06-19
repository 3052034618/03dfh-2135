import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';
import { cn } from '@/lib/utils';
import { ChevronDown, FileText, Car, Clock, MapPin, Bell, Check } from 'lucide-react';
import ProfileCard from '@/components/ProfileCard';
import DifficultyBadge from '@/components/DifficultyBadge';
import type { AppStatus, Application, Notice } from '@/types';

const APP_STATUS_STYLES: Record<AppStatus, string> = {
  '待审核': 'bg-amber/20 text-amber-light border-amber/30',
  '已确认': 'bg-emerald-900/30 text-emerald-400 border-emerald-800/40',
  '已婉拒': 'bg-crimson/20 text-crimson-light border-crimson/30',
};

const BADGE = {
  pending: 'border-amber/30 bg-amber/20 text-amber-light',
  confirmed: 'border-emerald-700/40 bg-emerald-900/30 text-emerald-400',
  rejected: 'border-crimson/30 bg-crimson/20 text-crimson-light',
  full: 'border-smoke/30 bg-smoke/20 text-smoke',
  groupPending: 'border-amber/30 bg-amber/10 text-amber-light',
  groupConfirmed: 'border-emerald-700/40 bg-emerald-900/20 text-emerald-400',
  groupRejected: 'border-crimson/30 bg-crimson/10 text-crimson-light',
  contacted: 'border-emerald-700/40 bg-emerald-900/30 text-emerald-400',
  sub: 'border-amber/30 bg-amber/20 text-amber-light',
  attendanceDone: 'border-emerald-600/40 bg-emerald-800/30 text-emerald-300',
  attendancePending: 'border-smoke/40 bg-smoke/25 text-smoke-light',
};

export default function Profile() {
  const [activeTab, setActiveTab] = useState<'profile' | 'team'>('profile');
  const currentPlayer = useAppStore((s) => s.currentPlayer);
  const getMyRecruitments = useAppStore((s) => s.getMyRecruitments);
  const getMyApplications = useAppStore((s) => s.getMyApplications);
  const getRecruitmentById = useAppStore((s) => s.getRecruitmentById);
  const getApplicationsByRecruitment = useAppStore((s) => s.getApplicationsByRecruitment);
  const getPlayerById = useAppStore((s) => s.getPlayerById);
  const getNoticeByRecruitment = useAppStore((s) => s.getNoticeByRecruitment);
  const markNoticeRead = useAppStore((s) => s.markNoticeRead);
  const hasUnreadNotice = useAppStore((s) => s.hasUnreadNotice);
  const confirmAttendance = useAppStore((s) => s.confirmAttendance);
  const hasConfirmedAttendance = useAppStore((s) => s.hasConfirmedAttendance);

  return (
    <div className="min-h-screen bg-noir pb-20">
      <div className="flex gap-2 p-4">
        <TabButton active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} icon={FileText} label="我的档案" />
        <TabButton active={activeTab === 'team'} onClick={() => setActiveTab('team')} icon={Car} label="我的车队" />
      </div>
      <div className="px-4">
        {activeTab === 'profile' ? (
          <ProfileTab currentPlayer={currentPlayer} />
        ) : (
          <TeamTab
            currentPlayer={currentPlayer}
            myRecruitments={getMyRecruitments()}
            myApplications={getMyApplications()}
            getRecruitmentById={getRecruitmentById}
            getApplicationsByRecruitment={getApplicationsByRecruitment}
            getPlayerById={getPlayerById}
            getNoticeByRecruitment={getNoticeByRecruitment}
            markNoticeRead={markNoticeRead}
            hasUnreadNotice={hasUnreadNotice}
            confirmAttendance={confirmAttendance}
            hasConfirmedAttendance={hasConfirmedAttendance}
          />
        )}
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon: Icon, label }: { active: boolean; onClick: () => void; icon: any; label: string }) {
  return (
    <button onClick={onClick} className={cn(
      'flex items-center gap-1.5 rounded-full px-5 py-2 text-sm font-medium transition-colors',
      active ? 'bg-amber text-noir' : 'bg-smoke/50 text-ghost-dim hover:bg-smoke/70'
    )}>
      <Icon size={16} />{label}
    </button>
  );
}

function ProfileTab({ currentPlayer }: { currentPlayer: ReturnType<typeof useAppStore.getState>['currentPlayer'] }) {
  if (!currentPlayer) {
    return (
      <div className="mt-12 flex flex-col items-center gap-6 rounded-xl border border-ghost-dim/20 bg-noir-surface p-8">
        <div className="text-6xl opacity-40">🕵️</div>
        <p className="text-lg text-ghost-dim">尚未创建档案</p>
        <Link to="/profile/edit" className="rounded-lg bg-amber px-8 py-2.5 font-medium text-noir transition-colors hover:bg-amber-dark">创建档案</Link>
      </div>
    );
  }
  return (
    <div className="mt-2 flex flex-col gap-4">
      <ProfileCard player={currentPlayer} />
      <Link to="/profile/edit" className="self-center rounded-lg border border-ghost-dim/30 px-6 py-2 text-sm text-ghost-dim transition-colors hover:border-ghost-dim/60 hover:text-ghost">编辑档案</Link>
    </div>
  );
}

function TeamTab({
  currentPlayer, myRecruitments, myApplications, getRecruitmentById, getApplicationsByRecruitment, getPlayerById,
  getNoticeByRecruitment, markNoticeRead, hasUnreadNotice, confirmAttendance, hasConfirmedAttendance,
}: {
  currentPlayer: ReturnType<typeof useAppStore.getState>['currentPlayer'];
  myRecruitments: ReturnType<typeof useAppStore.getState>['recruitments'];
  myApplications: ReturnType<typeof useAppStore.getState>['applications'];
  getRecruitmentById: (id: string) => any;
  getApplicationsByRecruitment: (id: string) => any;
  getPlayerById: (id: string) => any;
  getNoticeByRecruitment: (id: string) => Notice | undefined;
  markNoticeRead: (id: string) => void;
  hasUnreadNotice: (id: string) => boolean;
  confirmAttendance: (id: string) => void;
  hasConfirmedAttendance: (playerId: string, recruitmentId: string) => boolean;
}) {
  const [expandedRec, setExpandedRec] = useState<string | null>(null);

  return (
    <div className="mt-2 flex flex-col gap-8">
      <section>
        <h2 className="mb-3 text-sm font-medium tracking-wider text-ghost-dim uppercase">我发起的</h2>
        {myRecruitments.length === 0 ? (
          <EmptyState text="还没有发起过招募" />
        ) : (
          <div className="flex flex-col gap-3">
            {myRecruitments.map((rec) => {
              const apps = getApplicationsByRecruitment(rec.id);
              const pending = apps.filter((a: Application) => a.status === '待审核');
              const confirmed = apps.filter((a: Application) => a.status === '已确认');
              const rejected = apps.filter((a: Application) => a.status === '已婉拒');
              const confirmedMain = confirmed.filter((a: Application) => !a.isSubstitute);
              const isFull = rec.currentPlayers >= rec.totalPlayers;
              const isExpanded = expandedRec === rec.id;
              const notice = getNoticeByRecruitment(rec.id);

              return (
                <div key={rec.id} className="rounded-xl border border-ghost-dim/10 bg-noir-surface transition-colors hover:border-amber/30 overflow-hidden">
                  <button onClick={() => setExpandedRec(isExpanded ? null : rec.id)} className="w-full text-left p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-ghost hover:text-amber-light transition-colors">{rec.scriptName}</span>
                        <DifficultyBadge difficulty={rec.difficulty} />
                      </div>
                      <ChevronDown size={18} className={cn('text-ghost-dim transition-transform duration-300', isExpanded && 'rotate-180 text-amber')} />
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                      <span className="text-ghost-dim">{rec.currentPlayers}/{rec.totalPlayers}人</span>
                      {pending.length > 0 && <span className={cn('rounded-full border px-2 py-0.5', BADGE.pending)}>待审核{pending.length}</span>}
                      {confirmedMain.length > 0 && <span className={cn('rounded-full border px-2 py-0.5', BADGE.confirmed)}>已确认{confirmedMain.length}</span>}
                      {rejected.length > 0 && <span className={cn('rounded-full border px-2 py-0.5', BADGE.rejected)}>已婉拒{rejected.length}</span>}
                      {isFull && <span className={cn('rounded-full border px-2 py-0.5', BADGE.full)}>已满</span>}
                    </div>
                    <div className="mt-3 flex items-center justify-between text-xs text-ghost-dim">
                      <span className="flex items-center gap-1"><Clock size={12} className="text-amber/70" />{rec.driveTime}</span>
                      <span className="flex items-center gap-1"><MapPin size={12} className="text-amber/70" />{rec.store}</span>
                    </div>
                  </button>
                  <div className={cn('transition-all duration-300 overflow-hidden', isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0')}>
                    <div className="px-4 pb-4 pt-2 flex flex-col gap-5 border-t border-ghost-dim/10">
                      {notice ? (
                        <div className="rounded-lg border border-amber/40 bg-gradient-to-br from-amber/15 via-amber/10 to-amber/5 p-3">
                          <div className="flex items-center gap-1.5 mb-2">
                            <Bell size={14} className="text-amber" />
                            <span className="text-sm font-medium text-amber-light">集合通知</span>
                          </div>
                          <div className="flex flex-col gap-1.5 text-xs text-ghost">
                            <span className="flex items-center gap-1.5"><Clock size={12} className="text-amber/70 shrink-0" />{notice.arrivalTime}</span>
                            <span className="flex items-center gap-1.5"><MapPin size={12} className="text-amber/70 shrink-0" />{notice.storeLocation}</span>
                            {notice.notes && <span className="text-ghost-dim mt-1">{notice.notes}</span>}
                          </div>
                        </div>
                      ) : (
                        <div className="rounded-lg border border-dashed border-ghost-dim/20 bg-smoke/10 p-3 text-center text-xs text-ghost-dim">
                          尚未发布集合通知
                        </div>
                      )}
                      <ApplicantGroup label="待审核" labelClass={BADGE.groupPending} apps={pending} getPlayerById={getPlayerById} recId={rec.id} hasConfirmedAttendance={hasConfirmedAttendance} />
                      <ApplicantGroup label="已确认" labelClass={BADGE.groupConfirmed} apps={confirmed} getPlayerById={getPlayerById} recId={rec.id} showConfirmedDetails hasConfirmedAttendance={hasConfirmedAttendance} />
                      <ApplicantGroup label="已婉拒" labelClass={BADGE.groupRejected} apps={rejected} getPlayerById={getPlayerById} recId={rec.id} showRejectedRemark hasConfirmedAttendance={hasConfirmedAttendance} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-3 text-sm font-medium tracking-wider text-ghost-dim uppercase">我报名的</h2>
        {myApplications.length === 0 ? (
          <EmptyState text="还没有报名记录" />
        ) : (
          <div className="flex flex-col gap-3">
            {myApplications.map((app) => {
              const rec = getRecruitmentById(app.recruitmentId);
              const isRejected = app.status === '已婉拒';
              const hasUnread = hasUnreadNotice(app.recruitmentId);
              const notice = getNoticeByRecruitment(app.recruitmentId);
              const confirmed = currentPlayer ? hasConfirmedAttendance(currentPlayer.id, app.recruitmentId) : false;
              const showAttendanceBtn = app.status === '已确认';

              if (notice && !currentPlayer?.readNoticeIds.includes(notice.id)) {
                markNoticeRead(notice.id);
              }

              return (
                <div key={app.id} className={cn('rounded-xl border bg-noir-surface p-4 transition-colors hover:border-amber/30 relative', isRejected ? 'border-crimson/30' : 'border-ghost-dim/10')}>
                  {hasUnread && (
                    <span className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-crimson/90 px-2 py-0.5 text-[10px] font-medium text-white">
                      🔴 新通知
                    </span>
                  )}
                  <Link to={`/recruit/${app.recruitmentId}`}>
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-ghost group-hover:text-amber-light transition-colors">{rec?.scriptName ?? '未知剧本'}</span>
                      <span className={cn('rounded-full border px-2.5 py-0.5 text-xs', APP_STATUS_STYLES[app.status])}>{app.status}</span>
                    </div>
                    <p className="mt-2 line-clamp-1 text-xs text-ghost-dim">{app.selfIntroduction}</p>
                    <div className="mt-3 flex items-center justify-between text-xs text-ghost-dim">
                      <span className="flex items-center gap-1"><Clock size={12} className="text-amber/70" />{rec?.driveTime ?? '待定'}</span>
                      <span className="flex items-center gap-1"><MapPin size={12} className="text-amber/70" />{rec?.store ?? '待定'}</span>
                    </div>
                  </Link>
                  {notice && (
                    <div className="mt-3 rounded-lg border border-amber/40 bg-amber/10 p-3">
                      <div className="flex items-center gap-1.5 mb-2">
                        <Bell size={13} className="text-amber" />
                        <span className="text-xs font-medium text-amber-light">集合通知</span>
                      </div>
                      <div className="flex flex-col gap-1 text-xs text-ghost">
                        <span className="flex items-center gap-1.5"><Clock size={11} className="text-amber/70 shrink-0" />{notice.arrivalTime}</span>
                        <span className="flex items-center gap-1.5"><MapPin size={11} className="text-amber/70 shrink-0" />{notice.storeLocation}</span>
                        {notice.notes && <span className="text-ghost-dim mt-0.5">{notice.notes}</span>}
                      </div>
                    </div>
                  )}
                  {showAttendanceBtn && (
                    <button
                      onClick={() => confirmAttendance(app.recruitmentId)}
                      disabled={confirmed}
                      className={cn(
                        'mt-3 w-full rounded-lg px-4 py-2 text-sm font-medium transition-colors flex items-center justify-center gap-1.5',
                        confirmed
                          ? 'bg-emerald-800/30 text-emerald-300 border border-emerald-700/40 cursor-not-allowed'
                          : 'bg-amber text-noir hover:bg-amber-dark'
                      )}
                    >
                      {confirmed ? <><Check size={15} />已确认到场</> : (app.isSubstitute ? '替补-我已确认到场' : '我已确认到场')}
                    </button>
                  )}
                  {app.remark && (
                    <div className={cn('mt-3 rounded-lg border px-3 py-2 text-xs', isRejected ? 'border-crimson/30 bg-crimson/10 text-crimson-light' : 'border-amber/30 bg-amber/10 text-amber-light')}>
                      <span className="opacity-70">备注：</span>{app.remark}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return <div className="rounded-xl border border-ghost-dim/10 bg-noir-surface p-6 text-center text-sm text-ghost-dim">{text}</div>;
}

function ApplicantGroup({
  label, labelClass, apps, getPlayerById, recId, showConfirmedDetails, showRejectedRemark, hasConfirmedAttendance,
}: {
  label: string; labelClass: string; apps: Application[]; getPlayerById: any; recId: string;
  showConfirmedDetails?: boolean; showRejectedRemark?: boolean;
  hasConfirmedAttendance: (playerId: string, recruitmentId: string) => boolean;
}) {
  if (apps.length === 0) return null;
  return (
    <div className="flex flex-col gap-2">
      <span className={cn('self-start rounded-full border px-2.5 py-0.5 text-[11px]', labelClass)}>{label} {apps.length}</span>
      <div className="flex flex-col gap-2">
        {apps.map((app) => {
          const player = getPlayerById(app.playerId);
          const attended = hasConfirmedAttendance(app.playerId, recId);
          return (
            <Link key={app.id} to={`/recruit/${recId}`} className="flex items-start gap-3 rounded-lg border border-ghost-dim/10 bg-smoke/20 p-3 transition-colors hover:border-amber/30 hover:bg-smoke/40">
              <div className="h-10 w-10 shrink-0 rounded-full bg-noir-800 flex items-center justify-center text-lg overflow-hidden">
                {player?.avatar ? <img src={player.avatar} alt="" className="h-full w-full object-cover" /> : '🎭'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium text-ghost truncate">{player?.nickname ?? '未知玩家'}</span>
                  {showConfirmedDetails && app.contacted && <span className={cn('rounded-full border px-1.5 py-0.5 text-[10px]', BADGE.contacted)}>✓已联系</span>}
                  {showConfirmedDetails && app.isSubstitute && <span className={cn('rounded-full border px-1.5 py-0.5 text-[10px]', BADGE.sub)}>替补</span>}
                  {showConfirmedDetails && (
                    <span className={cn('rounded-full border px-1.5 py-0.5 text-[10px]', attended ? BADGE.attendanceDone : BADGE.attendancePending)}>
                      {attended ? '✓已到场' : '未回应'}
                    </span>
                  )}
                </div>
                {!showRejectedRemark && <p className="mt-1 line-clamp-1 text-xs text-ghost-dim">{app.selfIntroduction}</p>}
                {showRejectedRemark && app.remark && <div className="mt-1 rounded-md border border-crimson/30 bg-crimson/10 px-2 py-1.5 text-xs text-crimson-light">{app.remark}</div>}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
