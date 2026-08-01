import { StudentsTable } from '@/features/coach-portal/students-table';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Học viên — Coach Portal',
  description: 'Danh sách học viên, gói học, số buổi còn lại và ghi chú chuyên môn.',
  path: '/coach-portal/students',
  noIndex: true,
});

export default function CoachStudentsPage() {
  return <StudentsTable />;
}
