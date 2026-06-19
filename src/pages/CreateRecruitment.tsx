import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';
import { cn } from '@/lib/utils';
import { ArrowLeft, FileText } from 'lucide-react';
import TagSelector from '@/components/TagSelector';
import { ROLES, DIFFICULTIES, type Difficulty } from '@/types';

export default function CreateRecruitment() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPlayer = useAppStore((s) => s.currentPlayer);
  const createRecruitment = useAppStore((s) => s.createRecruitment);
  const createDraft = useAppStore((s) => s.createDraft);
  const setCreateDraft = useAppStore((s) => s.setCreateDraft);

  const [scriptName, setScriptName] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>('进阶');
  const [totalPlayers, setTotalPlayers] = useState(6);
  const [currentPlayers, setCurrentPlayers] = useState(1);
  const [store, setStore] = useState('');
  const [driveTime, setDriveTime] = useState('');
  const [missingRoles, setMissingRoles] = useState<string[]>([]);
  const [requireFastReading, setRequireFastReading] = useState(false);
  const [acceptSubstitute, setAcceptSubstitute] = useState(false);
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (createDraft) {
      setScriptName(createDraft.scriptName);
      setDifficulty(createDraft.difficulty);
      setTotalPlayers(createDraft.totalPlayers);
      setCurrentPlayers(createDraft.currentPlayers);
      setStore(createDraft.store);
      setDriveTime(createDraft.driveTime);
      setMissingRoles(createDraft.missingRoles);
      setRequireFastReading(createDraft.requireFastReading);
      setAcceptSubstitute(createDraft.acceptSubstitute);
      setDescription(createDraft.description);
      setCreateDraft(null);
    }
  }, [createDraft, setCreateDraft]);

  const handleGoCreateProfile = () => {
    setCreateDraft({
      scriptName,
      difficulty,
      totalPlayers,
      currentPlayers,
      store,
      driveTime,
      missingRoles,
      requireFastReading,
      acceptSubstitute,
      description,
    });
    navigate('/profile/edit', { state: { from: location.pathname } });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPlayer) {
      handleGoCreateProfile();
      return;
    }
    createRecruitment({
      scriptName,
      difficulty,
      totalPlayers,
      currentPlayers,
      store,
      driveTime,
      missingRoles,
      requireFastReading,
      acceptSubstitute,
      description,
      status: '招募中',
    });
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-noir pb-24">
      <div className="flex items-center gap-3 p-4">
        <button
          onClick={() => navigate(-1)}
          className="rounded-lg p-2 text-ghost-dim transition-colors hover:bg-noir-surface hover:text-ghost"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="font-display text-2xl text-ghost">发车</h1>
      </div>

      {!currentPlayer && (
        <div className="mx-4 mb-4 rounded-xl border border-amber/30 bg-amber/10 p-4">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-noir-surface">
              <FileText size={20} className="text-amber" />
            </div>
            <div className="flex-1">
              <h3 className="font-display text-base text-ghost">先创建你的推理档案</h3>
              <p className="mt-1 text-sm text-ghost-dim">
                作为车头需要先完善个人档案，让队友了解你的推理风格。你可以先填写下面的表单，创建档案后会自动恢复。
              </p>
              <button
                type="button"
                onClick={handleGoCreateProfile}
                className="mt-3 inline-flex items-center justify-center rounded-lg bg-amber px-5 py-2 text-sm font-medium text-noir transition-all hover:bg-amber-light active:scale-[0.98]"
              >
                去创建档案
              </button>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5 px-4">
        <FieldGroup label="剧本名称">
          <input
            type="text"
            value={scriptName}
            onChange={(e) => setScriptName(e.target.value)}
            required
            className="input-base"
          />
        </FieldGroup>

        <FieldGroup label="难度">
          <div className="flex gap-2">
            {DIFFICULTIES.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDifficulty(d)}
                className={cn(
                  'rounded-full border px-4 py-1.5 text-sm transition-colors',
                  difficulty === d
                    ? 'border-amber bg-amber/20 text-amber-light'
                    : 'border-ghost-dim/20 text-ghost-dim hover:border-ghost-dim/40'
                )}
              >
                {d}
              </button>
            ))}
          </div>
        </FieldGroup>

        <div className="grid grid-cols-2 gap-4">
          <FieldGroup label="总人数">
            <input
              type="number"
              min={3}
              max={10}
              value={totalPlayers}
              onChange={(e) => setTotalPlayers(Number(e.target.value))}
              required
              className="input-base"
            />
          </FieldGroup>
          <FieldGroup label="当前人数">
            <input
              type="number"
              min={1}
              max={totalPlayers}
              value={currentPlayers}
              onChange={(e) => setCurrentPlayers(Number(e.target.value))}
              required
              className="input-base"
            />
          </FieldGroup>
        </div>

        <FieldGroup label="店铺">
          <input
            type="text"
            value={store}
            onChange={(e) => setStore(e.target.value)}
            required
            className="input-base"
          />
        </FieldGroup>

        <FieldGroup label="开车时间">
          <input
            type="datetime-local"
            value={driveTime}
            onChange={(e) => setDriveTime(e.target.value)}
            required
            className="input-base"
          />
        </FieldGroup>

        <FieldGroup label="缺位角色">
          <TagSelector
            options={[...ROLES]}
            selected={missingRoles}
            onChange={setMissingRoles}
          />
        </FieldGroup>

        <ToggleRow
          label="要求读本快"
          checked={requireFastReading}
          onChange={setRequireFastReading}
        />
        <ToggleRow
          label="接受跳车替补"
          checked={acceptSubstitute}
          onChange={setAcceptSubstitute}
        />

        <FieldGroup label="补充说明">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="input-base resize-none"
          />
        </FieldGroup>

        <button
          type="submit"
          className="w-full rounded-lg bg-amber py-3 font-medium text-noir transition-all hover:bg-amber-light active:scale-[0.98]"
        >
          发布招募
        </button>
      </form>
    </div>
  );
}

function FieldGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm text-ghost-dim">{label}</label>
      {children}
    </div>
  );
}

function ToggleRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-ghost-dim">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative h-6 w-11 rounded-full transition-colors',
          checked ? 'bg-amber' : 'bg-noir-light'
        )}
      >
        <span
          className={cn(
            'absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-ghost transition-transform',
            checked ? 'translate-x-5' : 'translate-x-0'
          )}
        />
      </button>
    </div>
  );
}
