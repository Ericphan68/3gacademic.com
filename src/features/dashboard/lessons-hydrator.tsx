'use client';

import { useEffect } from 'react';

import { useAccountStore } from '@/store/useAccountStore';
import type { LessonRecord } from '@/types';

/** Nạp buổi học THẬT (từ DB) vào store client để dashboard hiển thị đúng. */
export function LessonsHydrator({ lessons }: { lessons: LessonRecord[] }) {
  const mergeServerLessons = useAccountStore((state) => state.mergeServerLessons);

  useEffect(() => {
    mergeServerLessons(lessons);
  }, [lessons, mergeServerLessons]);

  return null;
}
