'use client';

import Image from 'next/image';
import { useState } from 'react';

import { BLUR_DATA_URL } from '@/constants/media';
import { cn } from '@/lib/utils';

export function ExperienceGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0);

  return (
    <div>
      <div className="relative aspect-[16/10] overflow-hidden rounded-[var(--radius-xl)] bg-[var(--color-muted-surface)]">
        <Image
          key={images[active]}
          src={images[active]}
          alt={`Hình ${active + 1} của gói ${name}`}
          fill
          priority
          sizes="(min-width: 1024px) 62vw, 92vw"
          placeholder="blur"
          blurDataURL={BLUR_DATA_URL}
          className="animate-fade-in object-cover"
        />
      </div>

      <div className="mt-3 grid grid-cols-3 gap-3">
        {images.map((image, index) => (
          <button
            key={image}
            type="button"
            onClick={() => setActive(index)}
            aria-label={`Xem hình ${index + 1}`}
            aria-current={active === index}
            className={cn(
              'relative aspect-[4/3] cursor-pointer overflow-hidden rounded-[var(--radius-md)] border-2 transition-all duration-200',
              active === index
                ? 'border-[var(--color-accent)]'
                : 'border-transparent opacity-70 hover:opacity-100',
            )}
          >
            <Image
              src={image}
              alt=""
              fill
              sizes="30vw"
              placeholder="blur"
              blurDataURL={BLUR_DATA_URL}
              className="object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
