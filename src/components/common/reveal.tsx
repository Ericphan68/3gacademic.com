'use client';

import { motion, useReducedMotion } from 'framer-motion';
import * as React from 'react';

/**
 * Hiệu ứng xuất hiện khi cuộn tới: fade + trượt nhẹ.
 * Tự động tắt hoàn toàn khi người dùng bật "giảm chuyển động".
 */
export function Reveal({
  children,
  delay = 0,
  y = 16,
  className,
  as = 'div',
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: 'div' | 'li' | 'article' | 'section';
}) {
  const reduce = useReducedMotion();
  const MotionTag = motion[as];

  if (reduce) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </MotionTag>
  );
}

/** Bọc một danh sách để các phần tử xuất hiện lần lượt. */
export function RevealGroup({
  children,
  className,
  step = 0.06,
}: {
  children: React.ReactNode;
  className?: string;
  step?: number;
}) {
  const items = React.Children.toArray(children);
  return (
    <div className={className}>
      {items.map((child, index) => (
        <Reveal key={index} delay={Math.min(index * step, 0.4)}>
          {child}
        </Reveal>
      ))}
    </div>
  );
}
