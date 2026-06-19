import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Player, Recruitment, Application, Difficulty, CreateDraft } from '@/types';

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

const MOCK_PLAYERS: Player[] = [
  {
    id: 'player-1',
    nickname: '侦探K',
    favoriteTypes: ['硬核推理', '本格密室'],
    acceptableDuration: '5-7小时',
    willingToTakeNotes: true,
    reviewHabit: '每轮复盘',
    redFlags: ['恐怖演绎', '情感沉浸'],
    avatar: '🔍',
    createdAt: '2025-01-15T10:00:00Z',
  },
  {
    id: 'player-2',
    nickname: '推理狂魔',
    favoriteTypes: ['硬核推理', '还原推凶', '变格诡计'],
    acceptableDuration: '7小时以上',
    willingToTakeNotes: true,
    reviewHabit: '结束后复盘',
    redFlags: ['情感沉浸'],
    avatar: '🧠',
    createdAt: '2025-02-01T10:00:00Z',
  },
  {
    id: 'player-3',
    nickname: '笔记侠',
    favoriteTypes: ['硬核推理', '还原推凶'],
    acceptableDuration: '5-7小时',
    willingToTakeNotes: true,
    reviewHabit: '每轮复盘',
    redFlags: ['恐怖演绎', '迟到'],
    avatar: '📝',
    createdAt: '2025-01-20T10:00:00Z',
  },
  {
    id: 'player-4',
    nickname: '夜行者',
    favoriteTypes: ['变格诡计', '恐怖演绎', '还原推凶'],
    acceptableDuration: '5-7小时',
    willingToTakeNotes: false,
    reviewHabit: '偶尔复盘',
    redFlags: ['情感沉浸', '读本慢'],
    avatar: '🌙',
    createdAt: '2025-03-01T10:00:00Z',
  },
  {
    id: 'player-5',
    nickname: '逻辑控',
    favoriteTypes: ['硬核推理', '本格密室', '机制阵营'],
    acceptableDuration: '3-5小时',
    willingToTakeNotes: true,
    reviewHabit: '结束后复盘',
    redFlags: ['恐怖演绎', '跳车'],
    avatar: '🎯',
    createdAt: '2025-02-15T10:00:00Z',
  },
];

const MOCK_RECRUITMENTS: Recruitment[] = [
  {
    id: 'rec-1',
    organizerId: 'player-1',
    scriptName: '虚无的十字架',
    difficulty: '地狱',
    totalPlayers: 6,
    currentPlayers: 3,
    store: '迷雾剧场·朝阳店',
    driveTime: '2025-07-05 14:00',
    missingRoles: ['C位推理', '信息整理', '笔记手'],
    requireFastReading: true,
    acceptSubstitute: true,
    description: '纯硬核还原+推凶，时长约8小时，请确保时间充裕。车上有两位硬核老手，欢迎推理能力强、愿意做笔记的玩家。',
    status: '招募中',
    createdAt: '2025-06-18T10:00:00Z',
  },
  {
    id: 'rec-2',
    organizerId: 'player-2',
    scriptName: '年轮',
    difficulty: '烧脑',
    totalPlayers: 7,
    currentPlayers: 5,
    store: '剧坊推理·海淀店',
    driveTime: '2025-07-06 19:00',
    missingRoles: ['辅助推理', '任意位置'],
    requireFastReading: false,
    acceptSubstitute: false,
    description: '本格还原，需要一定推理基础。不要求读本快，但不能跳车。',
    status: '招募中',
    createdAt: '2025-06-19T08:00:00Z',
  },
  {
    id: 'rec-3',
    organizerId: 'player-5',
    scriptName: '第七嫌疑人',
    difficulty: '烧脑',
    totalPlayers: 6,
    currentPlayers: 4,
    store: '迷雾剧场·西单店',
    driveTime: '2025-07-07 13:30',
    missingRoles: ['C位推理', '笔记手'],
    requireFastReading: true,
    acceptSubstitute: true,
    description: '变格诡计+硬核推理，需要逻辑严密。不能接受恐怖演绎的也可以来。',
    status: '招募中',
    createdAt: '2025-06-20T06:00:00Z',
  },
  {
    id: 'rec-4',
    organizerId: 'player-3',
    scriptName: '白日噩梦',
    difficulty: '进阶',
    totalPlayers: 5,
    currentPlayers: 3,
    store: '剧本杀工厂·望京店',
    driveTime: '2025-07-08 14:00',
    missingRoles: ['辅助推理', '气氛担当'],
    requireFastReading: false,
    acceptSubstitute: true,
    description: '适合进阶玩家，节奏轻松，推理适中。欢迎新手老手混合。',
    status: '招募中',
    createdAt: '2025-06-20T08:00:00Z',
  },
  {
    id: 'rec-5',
    organizerId: 'player-4',
    scriptName: '雾鸦馆',
    difficulty: '地狱',
    totalPlayers: 6,
    currentPlayers: 6,
    store: '暗夜推理社·通州店',
    driveTime: '2025-07-04 19:00',
    missingRoles: [],
    requireFastReading: true,
    acceptSubstitute: false,
    description: '地狱难度变格，6小时起步，不接受跳车。',
    status: '已满员',
    createdAt: '2025-06-15T10:00:00Z',
  },
];

const MOCK_APPLICATIONS: Application[] = [
  {
    id: 'app-1',
    recruitmentId: 'rec-1',
    playerId: 'player-2',
    selfIntroduction: '硬核推理深度玩家，习惯做笔记和每轮复盘，8小时本没问题',
    status: '待审核',
    createdAt: '2025-06-19T12:00:00Z',
  },
  {
    id: 'app-2',
    recruitmentId: 'rec-1',
    playerId: 'player-5',
    selfIntroduction: '逻辑控一枚，推理效率高，可以承担C位',
    status: '待审核',
    createdAt: '2025-06-19T14:00:00Z',
  },
  {
    id: 'app-3',
    recruitmentId: 'rec-2',
    playerId: 'player-4',
    selfIntroduction: '变格本爱好者，不跳车不迟到',
    status: '已确认',
    createdAt: '2025-06-19T16:00:00Z',
  },
  {
    id: 'app-4',
    recruitmentId: 'rec-3',
    playerId: 'player-1',
    selfIntroduction: '硬核老手，笔记习惯好，C位可以',
    status: '待审核',
    createdAt: '2025-06-20T10:00:00Z',
  },
];

interface AppStore {
  currentPlayer: Player | null;
  recruitments: Recruitment[];
  applications: Application[];
  players: Player[];
  createDraft: CreateDraft | null;

  updateProfile: (data: Partial<Player>) => void;
  createRecruitment: (data: Omit<Recruitment, 'id' | 'createdAt' | 'organizerId'>) => void;
  updateRecruitmentStatus: (id: string, status: Recruitment['status']) => void;
  submitApplication: (recruitmentId: string, selfIntroduction: string) => void;
  reviewApplication: (id: string, status: '已确认' | '已婉拒', remark?: string) => void;
  cancelConfirm: (id: string) => void;
  toggleContacted: (id: string) => void;
  toggleSubstitute: (id: string) => void;
  setRemark: (id: string, remark: string) => void;
  getRecruitmentById: (id: string) => Recruitment | undefined;
  getApplicationsByRecruitment: (recruitmentId: string) => Application[];
  getPlayerById: (id: string) => Player | undefined;
  getMyApplications: () => Application[];
  getMyRecruitments: () => Recruitment[];
  hasApplied: (recruitmentId: string) => boolean;
  filterRecruitments: (filters: { difficulty?: Difficulty; type?: string; status?: string }) => Recruitment[];
  setCreateDraft: (draft: CreateDraft | null) => void;
}

function recalcRecruitment(recruitments: Recruitment[], applications: Application[], recruitmentId: string): Recruitment[] {
  return recruitments.map((r) => {
    if (r.id !== recruitmentId) return r;
    const confirmedCount = applications.filter(
      (a) => a.recruitmentId === recruitmentId && a.status === '已确认' && !a.isSubstitute
    ).length;
    return {
      ...r,
      currentPlayers: confirmedCount,
      status: confirmedCount >= r.totalPlayers ? '已满员' : (r.status === '已截止' ? '已截止' : '招募中'),
    };
  });
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      currentPlayer: null,
      recruitments: MOCK_RECRUITMENTS,
      applications: MOCK_APPLICATIONS,
      players: MOCK_PLAYERS,
      createDraft: null,

      updateProfile: (data) => {
        set((state) => {
          if (!state.currentPlayer) {
            const newPlayer: Player = {
              id: generateId(),
              nickname: '',
              favoriteTypes: [],
              acceptableDuration: '3-5小时',
              willingToTakeNotes: false,
              reviewHabit: '偶尔复盘',
              redFlags: [],
              avatar: '🕵️',
              createdAt: new Date().toISOString(),
              ...data,
            };
            return {
              currentPlayer: newPlayer,
              players: [...state.players, newPlayer],
            };
          }
          const updated = { ...state.currentPlayer, ...data };
          return {
            currentPlayer: updated,
            players: state.players.map((p) => (p.id === updated.id ? updated : p)),
          };
        });
      },

      createRecruitment: (data) => {
        const state = get();
        if (!state.currentPlayer) return;
        const newRec: Recruitment = {
          ...data,
          id: generateId(),
          organizerId: state.currentPlayer.id,
          createdAt: new Date().toISOString(),
        };
        set((s) => ({
          recruitments: [newRec, ...s.recruitments],
          createDraft: null,
        }));
      },

      updateRecruitmentStatus: (id, status) => {
        set((state) => ({
          recruitments: state.recruitments.map((r) => (r.id === id ? { ...r, status } : r)),
        }));
      },

      submitApplication: (recruitmentId, selfIntroduction) => {
        const state = get();
        if (!state.currentPlayer) return;
        if (state.applications.some((a) => a.recruitmentId === recruitmentId && a.playerId === state.currentPlayer!.id)) return;
        const newApp: Application = {
          id: generateId(),
          recruitmentId,
          playerId: state.currentPlayer.id,
          selfIntroduction,
          status: '待审核',
          createdAt: new Date().toISOString(),
        };
        set((s) => ({
          applications: [...s.applications, newApp],
        }));
      },

      reviewApplication: (id, status, remark) => {
        set((state) => {
          const updatedApps = state.applications.map((a) =>
            a.id === id ? { ...a, status, remark: remark || a.remark, isSubstitute: false } : a
          );
          const app = state.applications.find((a) => a.id === id);
          if (!app) return { applications: updatedApps };
          return {
            applications: updatedApps,
            recruitments: recalcRecruitment(state.recruitments, updatedApps, app.recruitmentId),
          };
        });
      },

      cancelConfirm: (id) => {
        set((state) => {
          const updatedApps: Application[] = state.applications.map((a) =>
            a.id === id ? { ...a, status: '待审核' as const, isSubstitute: false } : a
          );
          const app = state.applications.find((a) => a.id === id);
          if (!app) return { applications: updatedApps };
          return {
            applications: updatedApps,
            recruitments: recalcRecruitment(state.recruitments, updatedApps, app.recruitmentId),
          };
        });
      },

      toggleContacted: (id) => {
        set((state) => ({
          applications: state.applications.map((a) =>
            a.id === id ? { ...a, contacted: !a.contacted } : a
          ),
        }));
      },

      toggleSubstitute: (id) => {
        set((state) => {
          const app = state.applications.find((a) => a.id === id);
          if (!app) return state;
          const wasSub = !!app.isSubstitute;
          const updatedApps = state.applications.map((a) =>
            a.id === id ? { ...a, isSubstitute: !wasSub } : a
          );
          return {
            applications: updatedApps,
            recruitments: recalcRecruitment(state.recruitments, updatedApps, app.recruitmentId),
          };
        });
      },

      setRemark: (id, remark) => {
        set((state) => ({
          applications: state.applications.map((a) =>
            a.id === id ? { ...a, remark } : a
          ),
        }));
      },

      getRecruitmentById: (id) => get().recruitments.find((r) => r.id === id),

      getApplicationsByRecruitment: (recruitmentId) =>
        get().applications.filter((a) => a.recruitmentId === recruitmentId),

      getPlayerById: (id) => get().players.find((p) => p.id === id),

      getMyApplications: () => {
        const state = get();
        if (!state.currentPlayer) return [];
        return state.applications.filter((a) => a.playerId === state.currentPlayer!.id);
      },

      getMyRecruitments: () => {
        const state = get();
        if (!state.currentPlayer) return [];
        return state.recruitments.filter((r) => r.organizerId === state.currentPlayer!.id);
      },

      hasApplied: (recruitmentId) => {
        const state = get();
        if (!state.currentPlayer) return false;
        return state.applications.some(
          (a) => a.recruitmentId === recruitmentId && a.playerId === state.currentPlayer!.id
        );
      },

      filterRecruitments: (filters) => {
        const { difficulty, type, status } = filters;
        return get().recruitments.filter((r) => {
          if (difficulty && r.difficulty !== difficulty) return false;
          if (type && !r.scriptName.includes(type)) return false;
          if (status && r.status !== status) return false;
          return true;
        });
      },

      setCreateDraft: (draft) => {
        set({ createDraft: draft });
      },
    }),
    {
      name: 'pincar-ju-storage',
    }
  )
);
