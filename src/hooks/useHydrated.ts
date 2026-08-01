'use client';

import { useSyncExternalStore } from 'react';

const emptySubscribe = () => () => {};

/**
 * Trả về `true` sau khi component đã hydrate trên client.
 *
 * Dùng để tránh hydration mismatch cho mọi UI phụ thuộc localStorage
 * (ví Lotus, booking đã lưu, hội viên…): server render trạng thái rỗng,
 * client chỉ hiển thị dữ liệu thật sau khi hydrate xong.
 *
 * Cài bằng `useSyncExternalStore` thay vì `useEffect` + `setState` để không
 * tạo thêm một vòng render thừa sau khi hydrate.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true, // trên client
    () => false, // trên server
  );
}
