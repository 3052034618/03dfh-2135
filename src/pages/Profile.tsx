import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';
import { cn } from '@/lib/utils';
import { FileText, Car } from 'lucide-react';
import ProfileCard from '@/components/ProfileCard';
import DifficultyBadge from '@/components/DifficultyBadge';
import type { AppStatus } from '@/types';

const APP_STATUS_STYLES: Record<AppStatus, string> = {
  '待审核': 'bg-amber/20 text-amber-light border-amber/30',
  '已确认': 'bg-green-900/30 text-green-400 border-green-800/40',
  '已婉拒': 'bg-red-900/30 text-red-400 border-red-800/40',
};

export default function Profile() {
  const [activeTab, setActiveTab] = useState<'profile' | 'team'>('profile');
  const currentPlayer = useAppStore((s) => s.currentPlayer);
  const getMyRecruitments = useAppStore((s) => s.getMyRecruitments);
  const getMyApplications = useAppStore((s) => s.getMyApplications);
  const getRecruitmentById = useAppStore((s) => s.getRecruitmentById);

  const myRecruitments = getMyRecruitments();
  const myApplications = getMyApplications();

  return (
    <div className="min-h-screen bg-noir pb-20">
      <div className="flex gap-2 p-4">
        <button
          onClick={() => setActiveTab('profile')}
          className={cn(
            'flex items-center gap-1.5 rounded-full px-5 py-2 text-sm font-medium transition-colors',
            activeTab === 'profile'
              ? 'bg-amber text-noir'
              : 'bg-smoke/50 text-ghost-dim hover:bg-smoke/70'
          )}
        >
          <FileText size={16} />
          我的档案
        </button>
        <button
          onClick={() => setActiveTab('team')}
          className={cn(
            'flex items-center gap-1.5 rounded-full px-5 py-2 text-sm font-medium transition-colors',
            activeTab === 'team'
              ? 'bg-amber text-noir'
              : 'bg-smoke/50 text-ghost-dim hover:bg-smoke/70'
          )}
        >
          <Car size={16} />
          我的车队
        </button>
      </div>

      <div className="px-4">
        {activeTab === 'profile' ? (
          <ProfileTab currentPlayer={currentPlayer} />
        ) : (
          <TeamTab
            myRecruitments={myRecruitments}
            myApplications={myApplications}
            getRecruitmentById={getRecruitmentById}
          />
        )}
      </div>
    </div>
  );
}

function ProfileTab({ currentPlayer }: { currentPlayer: ReturnType<typeof useAppStore.getState>['currentPlayer'] }) {
  if (!currentPlayer) {
    return (
      <div className="mt-12 flex flex-col items-center gap-6 rounded-xl border border-ghost-dim/20 bg-noir-surface p-8">
        <div className="text-6xl opacity-40">🕵️</div>
        <p className="text-lg text-ghost-dim">尚未创建档案</p>
        <Link
          to="/profile/edit"
          className="rounded-lg bg-amber px-8 py-2.5 font-medium text-noir transition-colors hover:bg-amber-dark"
        >
          创建档案
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-2 flex flex-col gap-4">
      <ProfileCard player={currentPlayer} />
      <Link
        to="/profile/edit"
        className="self-center rounded-lg border border-ghost-dim/30 px-6 py-2 text-sm text-ghost-dim transition-colors hover:border-ghost-dim/60 hover:text-ghost"
      >
        编辑档案
      </Link>
    </div>
  );
}

function TeamTab({
  myRecruitments,
  myApplications,
  getRecruitmentById,
}: {
  myRecruitments: ReturnType<typeof useAppStore.getState>['recruitments'];
  myApplications: ReturnType<typeof useAppStore.getState>['applications'];
  getRecruitmentById: (id: string) => ReturnType<typeof useAppStore.getState>['recruitments'][number] | undefined;
}) {
  return (
    <div className="mt-2 flex flex-col gap-8">
      <section>
        <h2 className="mb-3 text-sm font-medium tracking-wider text-ghost-dim uppercase">我发起的</h2>
        {myRecruitments.length === 0 ? (
          <div className="rounded-xl border border-ghost-dim/10 bg-noir-surface p-6 text-center text-sm text-ghost-dim">
            还没有发起过招募
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {myRecruitments.map((rec) => (
              <Link
                key={rec.id}
                to={`/recruit/${rec.id}`}
                className="group rounded-xl border border-ghost-dim/10 bg-noir-surface p-4 transition-colors hover:border-amber/30"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-ghost group-hover:text-amber-light transition-colors">
                    {rec.scriptName}
                  </span>
                  <DifficultyBadge difficulty={rec.difficulty} />
                </div>
                <div className="mt-2 flex items-center gap-3 text-xs text-ghost-dim">
                  <span>{rec.currentPlayers}/{rec.totalPlayers}人</span>
                  <span>·</span>
                  <span>{rec.store}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-3 text-sm font-medium tracking-wider text-ghost-dim uppercase">我报名的</h2>
        {myApplications.length === 0 ? (
          <div className="rounded-xl border border-ghost-dim/10 bg-noir-surface p-6 text-center text-sm text-ghost-dim">
            还没有报名记录
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {myApplications.map((app) => {
              const rec = getRecruitmentById(app.recruitmentId);
              return (
                <Link
                  key={app.id}
                  to={`/recruit/${app.recruitmentId}`}
                  className="group rounded-xl border border-ghost-dim/10 bg-noir-surface p-4 transition-colors hover:border-amber/30"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-ghost group-hover:text-amber-light transition-colors">
                      {rec?.scriptName ?? '未知剧本'}
                    </span>
                    <span
                      className={cn(
                        'rounded-full border px-2.5 py-0.5 text-xs',
                        APP_STATUS_STYLES[app.status]
                      )}
                    >
                      {app.status}
                    </span>
                  </div>
                  <p className="mt-2 line-clamp-1 text-xs text-ghost-dim">{app.selfIntroduction}</p>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
