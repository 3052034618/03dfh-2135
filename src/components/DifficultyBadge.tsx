import { DIFFICULTY_COLORS, type Difficulty } from '@/types';
import { cn } from '@/lib/utils';

interface DifficultyBadgeProps {
  difficulty: Difficulty;
  className?: string;
}

export function DifficultyBadge({ difficulty, className }: DifficultyBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium',
        DIFFICULTY_COLORS[difficulty],
        className,
      )}
    >
      {difficulty}
    </span>
  );
}

export default DifficultyBadge;
