'use client';

import Image from 'next/image';

export default function CACIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <Image
      src="/cac-certificate.jpg"
      alt="CAC Registered"
      width={20}
      height={20}
      className={`${className} rounded object-cover`}
    />
  );
}
