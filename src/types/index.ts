export interface Player {
  id: string;
  nickname: string;
  favoriteTypes: string[];
  acceptableDuration: string;
  willingToTakeNotes: boolean;
  reviewHabit: string;
  redFlags: string[];
  avatar: string;
  readNoticeIds: string[];
  confirmedAttendanceIds: string[];
  createdAt: string;
}

export type Difficulty = '进阶' | '烧脑' | '地狱';
export type RecruitStatus = '招募中' | '已满员' | '已截止';
export type AppStatus = '待审核' | '已确认' | '已婉拒';

export interface Recruitment {
  id: string;
  organizerId: string;
  scriptName: string;
  difficulty: Difficulty;
  totalPlayers: number;
  currentPlayers: number;
  baseHeadcount: number;
  store: string;
  driveTime: string;
  missingRoles: string[];
  requireFastReading: boolean;
  acceptSubstitute: boolean;
  description: string;
  status: RecruitStatus;
  createdAt: string;
}

export interface Application {
  id: string;
  recruitmentId: string;
  playerId: string;
  selfIntroduction: string;
  status: AppStatus;
  remark?: string;
  contacted?: boolean;
  isSubstitute?: boolean;
  createdAt: string;
}

export interface Notice {
  id: string;
  recruitmentId: string;
  organizerId: string;
  arrivalTime: string;
  storeLocation: string;
  notes: string;
  createdAt: string;
}

export interface CreateDraft {
  scriptName: string;
  difficulty: Difficulty;
  totalPlayers: number;
  currentPlayers: number;
  store: string;
  driveTime: string;
  missingRoles: string[];
  requireFastReading: boolean;
  acceptSubstitute: boolean;
  description: string;
}

export const FAVORITE_TYPES = ['硬核推理', '机制阵营', '还原推凶', '变格诡计', '本格密室', '情感沉浸', '恐怖演绎'] as const;
export const DURATIONS = ['3小时以内', '3-5小时', '5-7小时', '7小时以上'] as const;
export const REVIEW_HABITS = ['每轮复盘', '结束后复盘', '偶尔复盘', '从不复盘'] as const;
export const RED_FLAGS = ['情感沉浸', '恐怖演绎', '过度沉浸', '读本慢', '跳车', '迟到', '剧透党', '不尊重DM'] as const;
export const DIFFICULTIES: Difficulty[] = ['进阶', '烧脑', '地狱'];
export const ROLES = ['C位推理', '辅助推理', '信息整理', '气氛担当', '笔记手', '任意位置'] as const;

export const DIFFICULTY_COLORS: Record<Difficulty, string> = {
  '进阶': 'bg-amber/20 text-amber-light border-amber/30',
  '烧脑': 'bg-crimson/20 text-crimson-light border-crimson/30',
  '地狱': 'bg-red-900/30 text-red-400 border-red-800/40',
};
