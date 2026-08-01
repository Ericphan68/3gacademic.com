'use client';

import { NotebookPen, Search, Users } from 'lucide-react';
import { useMemo, useState } from 'react';

import { PortalHeader } from '@/components/dashboard/portal-shell';
import { Badge } from '@/components/ui/badge';
import { Field, Input, Select } from '@/components/ui/form-fields';
import { InitialsAvatar, ProgressBar } from '@/components/ui/misc';
import { EmptyState } from '@/components/ui/states';
import { COACH_STUDENTS } from '@/data/coach-portal';
import { formatDate } from '@/lib/format';
import { matchesQuery } from '@/lib/utils';
import type { CoachStudent } from '@/types';

const LEVEL_LABELS: Record<CoachStudent['level'], string> = {
  beginner: 'Người mới',
  intermediate: 'Trung cấp',
  advanced: 'Nâng cao',
};

export function StudentsTable() {
  const [query, setQuery] = useState('');
  const [level, setLevel] = useState<CoachStudent['level'] | 'all'>('all');

  const students = useMemo(
    () =>
      COACH_STUDENTS.filter((student) => {
        if (level !== 'all' && student.level !== level) return false;
        return matchesQuery(query, student.name, student.programName, student.note);
      }),
    [query, level],
  );

  return (
    <div>
      <PortalHeader
        title="Học viên"
        description={`Bạn đang phụ trách ${COACH_STUDENTS.length} học viên. Ghi chú và tiến độ được cập nhật sau mỗi buổi học.`}
      />

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end">
        <Field label="Tìm học viên" htmlFor="student-search" className="flex-1">
          <div className="relative">
            <Search
              className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-[var(--color-muted)]"
              aria-hidden
            />
            <Input
              id="student-search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Tên học viên hoặc gói học…"
              className="pl-10"
            />
          </div>
        </Field>

        <Field label="Trình độ" htmlFor="student-level" className="sm:w-56">
          <Select
            id="student-level"
            value={level}
            onChange={(event) => setLevel(event.target.value as CoachStudent['level'] | 'all')}
          >
            <option value="all">Tất cả trình độ</option>
            <option value="beginner">Người mới</option>
            <option value="intermediate">Trung cấp</option>
            <option value="advanced">Nâng cao</option>
          </Select>
        </Field>
      </div>

      <p className="mb-4 text-sm text-[var(--color-muted)]" aria-live="polite">
        Hiển thị <span className="font-medium text-[var(--color-foreground)]">{students.length}</span> học viên
      </p>

      {students.length === 0 ? (
        <EmptyState
          title="Không tìm thấy học viên"
          description="Thử từ khoá khác hoặc bỏ bớt bộ lọc."
          icon={Users}
        />
      ) : (
        <>
          {/* Bảng cho màn hình lớn */}
          <div className="hidden overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--color-border)] lg:block">
            <table className="w-full min-w-[56rem] border-collapse text-sm">
              <caption className="sr-only">Danh sách học viên đang theo học</caption>
              <thead>
                <tr className="bg-[var(--color-surface)]">
                  <th scope="col" className="p-4 text-left font-medium">
                    Học viên
                  </th>
                  <th scope="col" className="p-4 text-left font-medium">
                    Trình độ
                  </th>
                  <th scope="col" className="p-4 text-left font-medium">
                    Gói học
                  </th>
                  <th scope="col" className="p-4 text-left font-medium">
                    Buổi còn lại
                  </th>
                  <th scope="col" className="p-4 text-left font-medium">
                    Buổi gần nhất
                  </th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id} className="border-t border-[var(--color-border)] align-top">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <InitialsAvatar initials={student.initials} size="sm" />
                        <div className="min-w-0">
                          <p className="font-medium">{student.name}</p>
                          <p className="mt-0.5 text-xs text-[var(--color-muted)]">
                            Tham gia {formatDate(student.joinedAt)}
                          </p>
                        </div>
                      </div>
                      <p className="mt-2 flex gap-2 text-xs text-[var(--color-muted)]">
                        <NotebookPen className="mt-0.5 size-3.5 shrink-0" aria-hidden />
                        {student.note}
                      </p>
                    </td>
                    <td className="p-4">
                      <Badge variant="neutral" size="sm">
                        {LEVEL_LABELS[student.level]}
                      </Badge>
                      {student.referredByCoach ? (
                        <Badge variant="gold" size="sm" className="mt-1.5 block w-fit">
                          Bạn giới thiệu
                        </Badge>
                      ) : null}
                    </td>
                    <td className="p-4">{student.programName}</td>
                    <td className="w-40 p-4">
                      <p className="mb-1.5 font-medium">
                        {student.sessionsRemaining}/{student.sessionsTotal}
                      </p>
                      <ProgressBar
                        value={student.sessionsTotal - student.sessionsRemaining}
                        max={student.sessionsTotal}
                        tone={student.sessionsRemaining <= 2 ? 'gold' : 'accent'}
                        label={`Đã học ${student.sessionsTotal - student.sessionsRemaining} trên ${student.sessionsTotal} buổi`}
                      />
                    </td>
                    <td className="p-4 whitespace-nowrap">{formatDate(student.lastLessonDate)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Thẻ cho màn hình nhỏ */}
          <ul className="space-y-4 lg:hidden">
            {students.map((student) => (
              <li
                key={student.id}
                className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-background)] p-5"
              >
                <div className="flex items-start gap-3">
                  <InitialsAvatar initials={student.initials} />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{student.name}</p>
                    <p className="mt-0.5 text-xs text-[var(--color-muted)]">{student.programName}</p>
                  </div>
                  <Badge variant="neutral" size="sm">
                    {LEVEL_LABELS[student.level]}
                  </Badge>
                </div>

                <div className="mt-4">
                  <div className="mb-1.5 flex justify-between text-xs">
                    <span className="text-[var(--color-muted)]">Buổi còn lại</span>
                    <span className="font-medium">
                      {student.sessionsRemaining}/{student.sessionsTotal}
                    </span>
                  </div>
                  <ProgressBar
                    value={student.sessionsTotal - student.sessionsRemaining}
                    max={student.sessionsTotal}
                    tone={student.sessionsRemaining <= 2 ? 'gold' : 'accent'}
                    label={`Đã học ${student.sessionsTotal - student.sessionsRemaining} trên ${student.sessionsTotal} buổi`}
                  />
                </div>

                <p className="mt-4 flex gap-2 text-xs text-[var(--color-muted)]">
                  <NotebookPen className="mt-0.5 size-3.5 shrink-0" aria-hidden />
                  {student.note}
                </p>

                <p className="mt-3 text-xs text-[var(--color-muted)]">
                  Buổi gần nhất: {formatDate(student.lastLessonDate)}
                </p>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
